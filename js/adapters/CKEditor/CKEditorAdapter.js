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
	 * @param          {CKEDITOR.editor}    e         instance [CKeditor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor)
	 * @param          {Node}        content          [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
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
	 * `data` should be an object structured in a way that `dialog` accepts.
	 *
	 * Method {{#crossLink "EditorAdapter/templateToDialog:method"}}templateToDialog{{/crossLink}} is responsable
	 * for transforming a template-like object into a dialog-like one.
	 * @method         fillInDialog
	 * @param          {CKEDITOR.dialog}        dialog             instance of
	 *                                                             [CKEDITOR.dialog](http://docs.ckeditor.com/#!/api/CKEDITOR.dialog)
	 * @param          {Object}                 data
	 * @return         {void}
	 * @since          0.1.0
	 * @abstract
	 *
	 */
	this.fillInDialog = function(dialog, data){
		console.log('filling in dialog with data: ', data);
		var pageId, page, elemId, value;
		for (pageId in data){
			if (pageId && data.hasOwnProperty(pageId)){
				page = data[pageId];
				for (elemId in page){
					if (elemId && page.hasOwnProperty(elemId)){
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

	/**
	 * Dispatcher for functions that transform {{#crossLink "Tag/template:method"}}Tag::template{{/crossLink}}
	 * object into an object accepted by corresponding dialog window.
	 *
	 * It is inverse of {{#crossLink "CKEditorAdapter/dialogToTemplate:property"}}dialogToTemplate{{/crossLink}}.
	 *
	 * The format of the returned object is: <code>{`key1`: `mapper1`, ...}</code>, where `key1` is a marker by means of
	 * which required mapper is chosen and `mapper1` is a function to which a template is supposed to be given.
	 * @method         templateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.templateToDialog = function(template){
		var marker = template.name.toLowerCase(),
			mapper = marker + 'TemplateToDialog',
			executor = this[mapper];
		if (typeof executor !== 'function'){
			executor = this.defaultTemplateToDialog;
		}
		try {
			return executor(template);
		} catch(e){
			console.log(e.name + ' when transforming a template into dialog data: ' + e.message);
		}

	};



	/**
	 * Default function that transforms a template into a dialog-structred object.
	 *
	 * Current implementation is a trivial one.
	 * @method         defaultTemplateToDialog
	 * @param          {Object} template
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.defaultTemplateToDialog = function(template){
		console.log('default template -> dialog converter is called');
		return template;
	};


	/**
	 * Converts information collected from the table dialog menu into table template.
	 *
	 * NB: due to nested nature (table -> tbody -> row -> cell) of tables, it seems
	 * better to be able to customize process of loading table template.
	 *
	 * This method produces output that is then intended to be given to
	 * {{#crossLink "Table/loadTemplate:method"}}Table:loadTemplate{{/crossLink}}
	 * method.
	 *
	 * Note that first, middle and last rows of table might have different templates (i.e.,
	 * first row might have upper border and the last row - the bottom border) as well as
	 * first, middle and last cells might have different templates.
	 *
	 * @method         tableDialogToTemplate
	 * @param          {Object}        dialog
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.tableDialogToTemplate = function(dialog){
		var tableTemplate = {
			name: 'table',
			root: {
				'style': {
					'margin':        dialog.table.margin,
					'padding':       dialog.table.padding,
					'border-width':  dialog.table['border-width'],
					'border-color':  dialog.table['border-color'],
					'background':    dialog.table.background,
				},
			},
			'frame': {
				'width': dialog.rows.frameWidth,
				'color': dialog.rows.frameColor
			},
			'rows':     dialog.table.rows,
			'columns':  dialog.table.columns,
			row: {
				name: 'row',
				root: {
					style: {
						'margin':        dialog.rows.margin,
						'padding':       dialog.rows.padding,
						'border-width':  dialog.rows['border-width'],
						'border-color':  dialog.rows['border-color'],
					}
				},
				'border-first':  dialog.rows.borderFirst,
				'border-last':   dialog.rows.borderLast,
				'border-middle': dialog.rows.borderMiddle,
			},
			cell: {
				name: 'cell',
				root: {
					style: {
						'margin':    dialog.cells.margin,
						'padding':   dialog.cells.padding,
					}
				},
				'border-first':  dialog.cells.borderFirst,
				'border-last':   dialog.cells.borderLast,
				'border-middle': dialog.cells.borderMiddle,
			}
		};
		return tableTemplate;
	};

	/**
	 * Converts output of table {{#crossLink "Table/template:method"}}template{{/crossLink}} method
	 * into an object accepted by table dialog menu, that is into a format described by
	 * {{#crossLink "Controller/getDialogData:method"}}getDialogData{{/crossLink}}.
	 * @method         tableTemplateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.tableTemplateToDialog = function(template){
		console.log('tableTemplateToDialog input:', template);
		var dialogData = {
			structure: {
				rows:             template.root.rows,
				cols:             template.root.cols,
			},
			spaces: {
				margin:           template.root.margin,
				padding:          template.root.padding,
				'border-spacing': template.root['border-spacing']
			},
			borders: {
				// 'border-width':         template.root['border-width'],
				// 'border-color':         template.root['border-color'],
				// 'phantomBorderWidth':   template.root.phantomTable.rowBorderWidth,
				// 'phantomBorderColor':   template.root.phantomTable.rowBorderColor,
			},
		};
		return dialogData;
	};


	/**
	 * Rearrange {{#crossLink "Link/template:property"}}link `template` object{{/crossLink}} into
	 * an object accepted by link dialog window.
	 *
	 * Returns an object with the following keys:<dl>
	 * <dt>href</dt><dd> (String) value of the link "href" attribute</dd>
	 * <dt>scheme</dt><dd> (String) scheme ("mail" or "link")</dd>
	 * <dt>color</dt><dd>(String) link color</dd>
	 * <dt>isUnderlined</dt><dd>(Boolean) whether the link is underlined</dd>
	 * <dt>isCompound</dt><dd>(Boolean) whether the link content contains more that one element</dd>
	 * <dt>target</dt><dd> (String) in what window the link is supposed to be open</dd>
	 * <dt>text</dt><dd> (String) string representation of the link content</dd>
	 * <dt>title</dt><dd> (String) title attribute</dd>
	 * </dl>
	 * @method         linkTemplateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.linkTemplateToDialog = function(template){
		return {'linkInfoTab': template.root};
	};

	/**
	 * Rearrange link dialog window object into
	 * {{#crossLink "Link/template:property"}}link template{{/crossLink}} object.
	 *
	 * It is inverse of {{#crossLink "CKEditorAdapter/_linkTemplateToDialog:method"}}_linkTemplateToDialog{{/crossLink}}.
	 * @method         linkDialogToTemplate
	 * @param          {Object}       dialog
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.linkDialogToTemplate = function(dialog){
		var tabName = 'linkInfoTab',
			linkTemplate = {
				name: 'link',
				root: {
					href:          dialog[tabName].href,
					scheme:        dialog[tabName].scheme,
					color:         dialog[tabName].color,
					isUnderlined:  dialog[tabName].isUnderlined,
					isCompound:    dialog[tabName].status,
					target:        dialog[tabName].isNewWindow ? '_blank' : '_self',
					text:          dialog[tabName].text,
					title:         dialog[tabName].title
				}
			};
		return linkTemplate;
	};



	/**
	 * Rearrange image dialog window object into
	 * {{#crossLink "ImageTag/template:property"}}image template{{/crossLink}} object.
	 *
	 * Returns an object with the following keys:<dl>
	 * <dt>imageUrl</dt><dd> (String) value of "src" attribute</dd>
	 * <dt>textAlt</dt><dd> (String) alternative text or the title in case the former is not defined</dd>
	 * </dl>
	 * @method         imageDialogToTemplate
	 * @param          {Object}        dialog
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.imageDialogToTemplate = function(dialog){
		var tabName = 'mainTab',
			info = {
				src:           dialog[tabName].imageUrl,
				alt:           dialog[tabName].textAlt,
				title:         dialog[tabName].textAlt,
			};
		return info;
	};


	/**
	 * Default function that transforms a dialog-structred object into a template.
	 *
	 * Current implementation is a trivial one.
	 * @method         defaultDialogToTemplate
	 * @param          {Object} template
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.defaultDialogToTemplate = function(template){
		console.log('default dialog -> template converter is called');
		return template;
	};

	/**
	 * Rearrange {{#crossLink "ImageTag/template:property"}}image `template` object{{/crossLink}} into
	 * an object accepted by image dialog window.
	 * Returns an object with the following keys:<dl>
	 * <dt>imageUrl</dt><dd> (String) value of "src" attribute</dd>
	 * <dt>textAlt</dt><dd> (String) alternative text or the title in case the former is not defined</dd>
	 * </dl>
	 * @method         imageTemplateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.imageTemplateToDialog = function(template){
		var output = {
			'mainTab': {
				imageUrl:     template.src,
				textAlt:      template.alt || template.title,
			}
		};
		return output;
	};

	/**
	 * Dispatcher for functions that transform dialog window object into corresponding
	 * {{#crossLink "Tag/template:method"}}Tag::template{{/crossLink}} object.
	 *
	 * It is inverse of {{#crossLink "CKEditorAdapter/templateToDialog:property"}}templateToDialog{{/crossLink}}.
	 *
	 * The format of the returned object is: <code>{`key1`: `mapper1`}</code>, where `key1` is a marker by means of
	 * which required mapper is chosen and `mapper1` is a function to which a dialog output object is supposed to be given.
	 * @method         dialogToTemplate
	 * @param          {Object}        template
	 * @param          {String}        marker
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.dialogToTemplate = function(dialog, marker){
		var marker2 = (typeof marker === 'string') ? marker.toLowerCase() : 'default';
		var mapper = marker2 + 'DialogToTemplate';
		var executor = this[mapper];
		if (typeof executor !== 'function'){
			executor = this.defaultDialogToTemplate;
		}
		return executor(dialog);
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
							try {
								value = dialog.getValueOf(pageId, elemId);
								if (value !== undefined){
									pageContent[elemId] = dialog.getValueOf(pageId, elemId);
								}
							} catch(e){
								console.log(e.name  + ': retrieving dialog element (' + pageId + ', ' + elemId + ')');
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
	 * Returns the position of the cursor inside the content of `editor`.
	 *
	 * The position is decribed by means of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * whose `startOffset` attribute is considered for determining the cursor position.
	 * @method         getCursorPosition
	 * @param          {CKEDITOR.editor}    e         [CKeditor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor) instance
	 * @return         {Range}                        [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * @since          0.1.0
	 */
	this.getCursorPosition = function(editor){
		try {
			var selection = editor.getSelection();
			var ranges = selection.getRanges();
			return this.toNativeRange(ranges[0]);
		} catch (e){
			console.log(e.name  + ': when detecting cursor position (' + e.message + ')');
			return undefined;
		}
	};


	/**
	 * Sets value of a field in `dialog`.
	 *
	 * Information to identify the field and the value is encoded in object `data` which must be of
	 * the following format: <pre>{`tabId`: ..., `elemId`: ..., `value`: ...}</pre>
	 * @method         setDialogInputField
	 * @param          {Object}        dialog
	 * @param          {Object}        data
	 * @since          0.2.0
	 * @return         {void}
	 */
	this.setDialogInputField = function(dialog, data){
		var tabId, elemId, value;
		try {
			tabId = data.tabId;
			elemId = data.elemId;
			value = data.value;
			dialog.setValueOf(tabId, elemId, value);
		} catch(e){
			console.log(e.name  + ' when setting dialog input field:' + e.message);
		}
	};

	/**
	 * Sets value of a field in `dialog`.
	 *
	 * Information to identify the field and the value is encoded in object `data` which must be of
	 * the following format: <pre>{`tabId`: ..., `elemId`: ..., `value`: ...}</pre>
	 * @method         setDialogHtmlField
	 * @param          {Object}        dialog
	 * @param          {Object}        data
	 * @since          0.2.0
	 * @return         {void}
	 */
	this.setDialogHtmlField = function(dialog, data){
		var tabId, elemId, elem;
		try {
			tabId = data.tabId;
			elemId = data.elemId;
			elem = dialog.getContentElement(tabId, elemId);
			CKEDITOR.document.getById(elem.domId).$.innerHTML = data.value;
		} catch(e){
			console.log(e.name  + ' when setting dialog html field:' + e.message);
		}
	};

	/**
	 * Returns native javascript representation of `el`.
	 *
	 * The output is either [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance or `null`
	 * if the argument is not an element.
	 * @method         toNativeElement
	 * @param          {CKEDITOR.dom.element}   el   [CKEDITOR.dom.element](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.element)
	 *                                               instance
	 * @return         {Node}
	 * @since          0.2.0
	 */
	this.toNativeElement = function(el){
		if (el instanceof CKEDITOR.dom.element){
			return el.$;
		}
	};

	/**
	 * Saves `data` inside editor-specific element `host` (i.e, inside dialog, editor itself etc).
	 * @method         saveExtra
	 * @param          {Object}        host
	 * @param          {Any}           data
	 * @return         {void}
	 * @since          0.2.0
	 * @abstract
	 */
	this.saveExtra = function(host, data){
		host.extraDataToStoreHere = data;
	};

	/**
	 * Gets previously saved data from editor-specific object `host` (i.e, inside dialog, editor itself etc).
	 * @method         getExtra
	 * @param          {Object}        host
	 * @return         {Any}
	 * @since          0.2.0
	 * @abstract
	 */
	this.getExtra = function(host){
		return host.extraDataToStoreHere;
	};
}
CKEditorAdapter.prototype = Object.create(EditorAdapter.prototype);