/*jslint plusplus: true, white: true */
/*global EditorAdapter, CKEDITOR */

/**
 * Implements "abstract" methods of class {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}}
 * Transforms [CKEDITOR](http://docs.ckeditor.com/#!/api/CKEDITOR) objects into native javascript one.
 * @class     CKEditorAdapter
 * @module    Adapters
 * @type      {Object}
 * @extends   {EditorAdapter}
 * @since     0.0.8
 * @author    A.Shcherbakov
 */
function CKEditorAdapter(){
	"use strict";
	if (!(this instanceof CKEditorAdapter)) {
		return new CKEditorAdapter();
	}
	EditorAdapter.call(this);

	/**
 	 * Retrieves native javascript Node object representing editor body.
	 *
	 * @method         getEditorContent
	 * @param          {Object}        editor
	 * @return         {Node|Null}
	 * @abstract
	 * @since          0.1.0
	 */
	this.getEditorContent = function(editor){
		if (editor instanceof CKEDITOR.editor){
			return editor.document.getBody().$;
		}
	};

	/**
	 * Sets the content of the editor body.
	 *
	 * @method         setEditorContent
	 * @param          {Editor}      editor
	 * @param          {Node}        content       [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @abstract
	 * @since          0.1.0
	 */
	this.setEditorContent = function(editor, content){
		if ((editor instanceof CKEDITOR.editor) && (content instanceof Node)){
			try {
				editor.setData(content.outerHTML);
			} catch (e){
				console.log(e.name + ' occurred when setting up the editor content: ' + e.message);
			}
		}
	};

	/**
	 * Returns editor-specific representation of the ranges.
	 *
	 * It is supposed to be an array of editor-specific range instances. If for some reason it turns out
	 * that it is impossible to retrieve the ranges, `null` is returned.
	 * @method         getEditorRanges
	 * @param          {CKEDITOR.editor}    e         instance [CKeditor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor)
	 * @return         {Array|Null}                   array of
	 *                                                [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range)
	 *                                                instances
	 * @throws         {Error}              If `e` is not [CKeditor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor) instance
	 * @since          0.1.0
	 */
	this.getEditorRanges = function(e){
		if (e instanceof CKEDITOR.editor){
			var selection = e.getSelection();
			if (selection){
				return selection.getRanges();
			}
		}
	};


	/**
	 * Converts editor-specific range `r` into a native javascript representation of
	 * [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) object.
	 * @method         toNativeRange
	 * @param          {CKEDITOR.dom.range}      r      [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range)
	 *                                                  instance
	 * @return         {Range}
	 * @since          0.1.0
	 * @throws         {Error} If `r` is not a [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) instance
	 */
	this.toNativeRange = function(r){
		if (r instanceof CKEDITOR.dom.range){
			var range = document.createRange();
			var startOffset = r.startOffset,
				endOffset = r.endOffset,
				startContainer = r.startContainer,
				endContainer = r.endContainer;
			try {
				range.setEnd(endContainer.$, endOffset);
				range.setStart(startContainer.$, startOffset);
			} catch (e){
				console.log('Error (' + e.name + ') detected when setting up the range: ' + e.message);
			} finally {
				return range;
			}
		}
	};

	/**
	 * Fills in dialog window `dialog` with `data`.
	 *
	 * `data` is a {{#crossLink "Tag/template:method"}}template{{/crossLink}}.
	 * Note that structure of `data` might be not conform with structure that `dialog` admits.
	 * For this reason, `marker` is a string defining
	 * @method         fillInDialog
	 * @param          {CKEDITOR.dialog}        dialog             instance of
	 *                                                             [CKEDITOR.dialog](http://docs.ckeditor.com/#!/api/CKEDITOR.dialog)
	 * @param          {Object}                 data
	 * @param          {String}                 marker              defines what type of pre-processing should be applied to `data`
	 * @return         {void}
	 * @since          0.1.0
	 * @abstract
	 *
	 */
	this.fillInDialog = function(dialog, data, marker){
		var dataForDialog;
		if (typeof marker === 'string' && this.templateToDialog.hasOwnProperty(marker)){
			dataForDialog = this.templateToDialog[marker](data);
		} else {
			dataForDialog = data;
		}
		var pageId, page, elemId, value;
		for (pageId in dataForDialog){
			if (dataForDialog.hasOwnProperty(pageId)){
				page = dataForDialog[pageId];
				for (elemId in page){
					if (page.hasOwnProperty(elemId)){
						value = page[elemId];
						if (value !== undefined){
							try {
								dialog.setValueOf(pageId, elemId, value);
							} catch (e){
								console.log(e.name + ' when filling in the dialog menu item (' +
									pageId + ', ' + elemId + ') with value ' + value + ': ' + e.message);
							}
						}
					}
				}
			}
		}
	};

	var _linkTemplateToDialog = function(template){
		var output = {
			'linkInfoTab': {
				href:          template.href,
				scheme:        template.scheme,
				color:         template.color,
				isUnderlined:  template.isUnderlined,
				status:        template.isCompound,
				isNewWindow:   template.target ==='_blank' ,
				title:         template.title,
				text:          template.text
			}
		};
		return output;
	};


	/**
	 * Converts output of a {{#crossLink "Tag/template:method"}}Tag::template{{/crossLink}} method
	 * into an object accepted by a dialog menu, that is into a format described by
	 * {{#crossLink "Controller/getDialogData:method"}}getDialogData{{/crossLink}}.
	 * @method         templateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.templateToDialog = {
		'link': _linkTemplateToDialog
	};


	/**
	 * Collects parameters from the dialog menu and returns json like object with that data.
	 * If optional parameter `types` is provided, then only dialog fields of types present
	 * in array `types` are to be taken in consideration.
	 *
	 * Returns json object whose keys are page ids of the dialog menu and values are json objects
	 * whose keys are ids of the elements present on that page and values are those read from  the
	 * dialog menu.
	 *
	 * Example: <pre>{infoTab: {author: 'A.Einstein', title: 'On electrodynamics of moving electron'},
	 * publisher: {code: TDR19, license: 1031}}</pre>
	 *
	 * @method         getDialogData
	 * @param          {CKEDITOR.dialog}  dialog 		See [dialog definition](http://docs.ckeditor.com/#!/api/CKEDITOR.dialog).
	 * @param          {Array}            types         array of strings standing for dialog field types.
	 * @return         {Object}
	 */
	this.getDialogData = function(dialog, types){
		var data = {},
			pages = dialog._.contents,
			pageId,
			elems, elemId, pageContent, value,
			considerAll = types === undefined  || !Array.isArray(types); // whether all dialog fields should be considered
		for (pageId in pages){
			if (pages.hasOwnProperty(pageId)){
				elems = pages[pageId];
				pageContent = {};
				for (elemId in elems){
					if (elems.hasOwnProperty(elemId)){
						if (considerAll || types.indexOf(elems[elemId].type) !== -1){
							value = dialog.getValueOf(pageId, elemId);
							if (value !== undefined){
								pageContent[elemId] = dialog.getValueOf(pageId, elemId);
							}

						}
					}
				}
				data[pageId] = pageContent;
			}
		}
		return data;
	};


	/**
	 * Converts information collected from the link dialog menu into format defined by
	 * {{#crossLink "Link/template:method"}}Link::template{{/crossLink}} method.
	 *
	 * Overrides {{#crossLink "Controller"}}base class{{/crossLink}} definition of
	 * {{#crossLink "Controller/dialogToTemplate:method"}}dialogToTemplate{{/crossLink}}.
 	 * The returning object include the following keys:
	 * Returns an object with the following keys:<dl>
	 * <dt>href</dt><dd> (String) value of the link "href" attribute</dd>
	 * <dt>scheme</dt><dd> (String) scheme (mail or link)</dd>
	 * <dt>color</dt><dd>(String) link color</dd>
	 * <dt>isUnderlined</dt><dd>(Boolean) whether the link is underlined</dd>
	 * <dt>isCompound</dt><dd>(Boolean) whether the link content contains more that one element</dd>
	 * <dt>target</dt><dd> (String) in what window the link is supposed to be open</dd>
	 * <dt>text</dt><dd> (String) string representation of the link content</dd>
	 * <dt>title</dt><dd> (String) title attribute</dd>
	 * </dl>
	 * @method         dialogToTemplate
	 * @param          {Object}        obj
	 * @return         {Object}
	 */
	this.dialogToTemplate = function(obj){
		var tabName = 'linkInfoTab',
			template = {
				href:          obj[tabName].href,
				scheme:        obj[tabName].scheme,
				color:         obj[tabName].color,
				isUnderlined:  obj[tabName].isUnderlined,
				isCompound:    obj[tabName].status,
				target:        obj[tabName].isNewWindow ? '_blank' : '_self',
				title:         obj[tabName].title
			};
		return template;
	};


	/**
	 * Inserts node `child` as a child of a node `parent` at position `index`.
	 *
	 * If case of success, the inserted node has number `index` among children of node `parent`.
	 *
	 * Returns the newly inserted node.
	 * @method       insertAt
	 * @param        {Node}            parent      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param        {Node}            child       [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param        {Integer}         index
	 * @return       {Node}                        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @since        0.1.0
	 * @abstract
	 */
	this.insertAt = function(parent, child, index){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "insertAt" of class CKEditorAdapter has yet to be implemented!');
	};

	/**
	 * Removes node `n` from the DOM along with all its descendants.
	 *
	 * Returns the removed node.
	 * @method         removeNode
	 * @param          {Node}        n     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Node}
	 * @since          0.1.0
	 * @abstract
	 */
	this.removeNode = function(n){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "removeNode"  of class CKEditorAdapter has yet to be implemented!');
	};


}
CKEditorAdapter.prototype = Object.create(EditorAdapter.prototype);