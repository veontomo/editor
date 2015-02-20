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
			var pageId, page, elemId, value, elem, domElem;
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
	 * @param          {String}        marker
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.templateToDialog = function(template, marker){
		var marker2 = (typeof marker === 'string') ? marker.toLowerCase() : 'default',
			mapper = marker2 + 'TemplateToDialog',
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
	 * @param          {Object} tempalte
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.defaultTemplateToDialog = function(template){
		console.log('default template -> dialog converter is called');
		return template;
	};


	/**
	 * Converts information collected from the table dialog menu into format defined by
	 * {{#crossLink "Table/template:method"}}Table::template{{/crossLink}} method.
	 *
	 * Overrides {{#crossLink "Controller"}}base class{{/crossLink}} definition of
	 * {{#crossLink "Controller/dialogToTemplate:method"}}dialogToTemplate{{/crossLink}}.
 	 * The returning object include the following keys:
	 * <dl>
	 * <dt>rows</dt><dd>number of table rows</dd>
	 * <dt>cols</dt><dd>number of table columns</dd>
	 * <dt>tableBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for table border width</dd>
	 * <dt>tableBorderColor</dt><dd>string for table border color</dd>
	 * <dt>phantomBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for width around table rows</dd>
     * <dt>phantomBorderColor</dt><dd>string for the border around table rows</dd>
     * <dt>cellBorders</dt><dd>boolean variables for borders around table cells:
     * 		<code>leftVer</code>, <code>rightVer</code>, <code>intVer</code>,
     *   	<code>topHor</code>, <code>bottomHor</code>, <code>intHor</code>
     * </dd>
     * <dt>cellBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for border width around table cells</dd>
     * <dt>cellBorderColor</dt><dd>string for border color around table cells</dd>
     * <dt>globalTableBgColor</dt><dd>string for table background color</dd>
     * <dt>spaceTableGlobal</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for the table margin</dd>
     * <dt>paddingTableGlobal</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for the table padding</dd>
     * <dt>spaceBtwRows</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance to set vertical spacing between rows
     * (horizontal is set to 0 px)</dd>
     * <dt>spaceCell</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for table cells padding </dd>
	 * <dt>cellWeights</dt><dd>array of (non-negative) numbers that have meaning of weights with which columns contribute
	 * to the total table width</dd>
	 * </dl>
	 * @method         tableDialogToTemplate
	 * @param          {Object}        obj
	 * @return         {Object}
	 */
	this.tableDialogToTemplate = function(obj){
		var defaultUnit = 'px';
		var tableInfo = {
			rows:                 parseInt(obj.structure.rows, 10),
			cols:                 parseInt(obj.structure.cols, 10),
			tableBorderWidth:     new Unit(parseInt(obj.borders.globalBorderWidth, 10), defaultUnit),
			tableBorderColor:     obj.borders.globalBorderColor,
			phantomBorderWidth:   new Unit(parseInt(obj.borders.rowBorderWidth, 10), defaultUnit),
			phantomBorderColor:   obj.borders.rowBorderColor,
			cellBorders: {
				leftVer:   obj.borders.leftVerBord,
				rightVer:  obj.borders.rightVerBord,
				intVer:    obj.borders.intVerBord,
				topHor:    obj.borders.topHorBord,
				bottomHor: obj.borders.bottomHorBord,
				intHor:    obj.borders.intHorBord,
			},
			cellBorderWidth:    new Unit(parseInt(obj.borders.cellBorderWidth, 10), defaultUnit),
			cellBorderColor:    obj.borders.cellBorderColor,
			globalTableBgColor: obj.background.globalTableBgColor,
			spaceTableGlobal:   new Unit(parseInt(obj.spaces.spaceTableGlobal, 10), defaultUnit),
			paddingTableGlobal: new Unit(parseInt(obj.spaces.paddingTableGlobal, 10), defaultUnit),
			spaceBtwRows:       new Unit(parseInt(obj.spaces.spaceBtwRows, 10), defaultUnit),
			spaceCell:          new Unit(parseInt(obj.spaces.spaceCell, 10), defaultUnit),
			width:              obj.width,
		};
		// adding key cellWeights for
		var cellWeights = [];
		if (obj.colWeights){
			var colId;
			for (colId in obj.colWeights){
				if (obj.colWeights.hasOwnProperty(colId)){
					cellWeights.push(parseFloat(obj.colWeights[colId]));
				}
			}
		} else {
			// creating array of 1's whose number is equal to number of table columns
			var arrTmp = new Array(tableInfo.cols + 1); // dumb array of specified length
			cellWeights = arrTmp.join(1).split('').map(function(el){return parseFloat(el);});
		}
		tableInfo.cellWeights = cellWeights;
		return tableInfo;
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
		var dialogData = {
			structure: {
				rows: template.rows,
				cols: template.cols
			},
			background: {
				globalTableBgColor: template.globalTableBgColor
			},
			borders: {
				cellBorderColor: template.cellBorderColor,
				globalBorderColor: template.tableBorderColor,
				rowBorderColor: template.rowBorderColor,
				rowBorderWidth: (new Unit(template.rowBorderWidth || 0)).getValueAsString(),
				cellBorderWidth: (new Unit(template.cellBorderWidth || 0)).getValueAsString(),
				globalBorderWidth: (new Unit(template.tableBorderWidth || 0)).getValueAsString(),
				bottomHorBord: template.cellBorders.bottomHor,
				intHorBord: template.cellBorders.intHor,
				intVerBord: template.cellBorders.intVer,
				leftVerBord: template.cellBorders.leftVer,
				rightVerBord: template.cellBorders.rightVer,
				topHorBord: template.cellBorders.topHor
			},
			spaces: {
				paddingTableGlobal: (new Unit(template.paddingTableGlobal || 0)).getValueAsString(),
				spaceBtwRows:       (new Unit(template.spaceBtwRows || 0)).times(2).getValueAsString(),
				spaceCell:          (new Unit(template.spaceCell || 0)).getValueAsString(),
				spaceTableGlobal:   (new Unit(template.spaceTableGlobal || 0)).getValueAsString()
			},
		};
		// filling in column weight fields: corresponding text input fields are called
		// "col0", "col1" etc.
		var weigths = template.cellWeights;
		try {
			var tmp = Helper.divideByGcd(weigths);
			weigths = tmp;
		} catch (e){
			console.log('Error (' + e.name + ') when cancelling common factors of column widths: ' + e.message);
		}
		if (Array.isArray(weigths)){
			dialogData.colWeights = {};
			weigths.forEach(function(val, ind){
				dialogData.colWeights['col' + ind.toString()] = val.toString();
			});
		}
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
				href:          dialog[tabName].href,
				scheme:        dialog[tabName].scheme,
				color:         dialog[tabName].color,
				isUnderlined:  dialog[tabName].isUnderlined,
				isCompound:    dialog[tabName].status,
				target:        dialog[tabName].isNewWindow ? '_blank' : '_self',
				text:          dialog[tabName].text,
				title:         dialog[tabName].title
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
	 * @param          {Object} tempalte
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
		console.log('mapper: ' + mapper);
		var executor = this[mapper];
		if (typeof executor !== 'function'){
			executor = this.defaultDialogToTemplate;
			console.log('mapper does not exist');
		} else {
			console.log('mapper exists');
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
	 * Information to identify the field and the corresponding value is encoded in object `data`.
	 * @method         setDialogField
	 * @param          {Object}        dialog
	 * @param          {Object}        data
	 * @since          0.2.0
	 * @return         {void}
	 */
	this.setDialogField = function(dialog, data){
		var tabId, elemId, value, elem;
		try {
			tabId = data.tabId;
			elemId = data.elemId;
			elem = dialog.getContentElement(tabId, elemId);
			if (!elem){
				return;
			}
			value  = data.value;
			if (value !== undefined){
				document.getElementById(elem.domId).innerHTML = value;
			}

		} catch(e){
			console.log(e.name  + ' when setting dialog field:' + e.message);
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