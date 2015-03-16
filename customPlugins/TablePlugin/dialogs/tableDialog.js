/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, Row, Cell, TableStyles, TableRowStyles,
TableCellStyles, Content, NEWSLETTER, alert, CKHelper, Helper, CTable, dhtmlXColorPicker, Selection */

/**
 * Returns dialog window for creating a new table.
 *
 * @module        Dialogs
 * @class         TableDialog
 * @param         {Object}        editor      instance of CKEDITOR
 * @return        {Object}        dialog definition
 * @since         0.0.6
 */
function TableDialog(editor) {

	/**
	 * Instance of {{#crossLink "Controller"}}Controller{{/crossLink}}.
	 * @property       {CTable}        _controller
	 * @type           {CTable}
	 * @private
	 */
	 var _controller = new CTable();

	 /**
	  * Configures {{#crossLink "TableDialog/_controller:property"}}_controller{{/crossLink}}.
	  *
	  * @method  constructor
	  * @since   0.2.0
	  */
	 (function(){
		 _controller.setEditorAdapter(NEWSLETTER.editorAdapter);
	     var worker = new Document();
	     worker.setFactory(NEWSLETTER.factory);
	     _controller.setWorker(worker);
	 }());


	/**
	 * Name of the plugin the current dialog belongs to.
	 * @property       {String} _pluginName
	 * @type           {String}
	 * @private
	 * @since          0.2.0
	 */
	var _pluginName = 'TablePlugin';

	/**
	* Location of the directory containing plugin icons.
	* @property      {String}        _iconsDir
	* @type          {String}
	* @since         0.2.0
	* @private
	*/
	var _iconsDir = NEWSLETTER.customPluginDir + _pluginName + '/dialogs/icons/';

	/**
	 * Style for text input fields for numbers.
	 * @property {String} _inputNumberStyle
	 * @type     {String}
	 * @private
	 */
	var _inputNumberStyle = 'min-width: 3em; width: 5em; max-width: 7em; text-align: center;';

	/**
	 * Style for text input fields for choosing colors.
	 * @property       {String}        _inputColorStyle
	 * @type           {String}
	 * @private
	 */
	var _inputColorStyle = 'min-width: 6em; width: 6em; max-width: 6em; text-align: center;';

	/**
	 * Style for icons representing borders between columns and rows.
	 * @property {String} _borderIconStyle
	 * @type     {String}
	 * @private
	 */
	var _borderIconStyle = 'width: 15px; height: 15px;';

	/**
	 * Color picker (JavaScript ColorPicker).
	 *
	 * dhtmlxColorPicker is open source GPL v2 and Free License [JavaScript component](http://dhtmlx.com/docs/products/dhtmlxColorPicker/)
	 * for easy color selection.
	 *
	 * @property       {dhtmlXColorPicker} _colorPicker
	 * @private
	 * @since  0.0.6
	 */
	var _colorPicker = new dhtmlXColorPicker();

	/**
	 * {{#crossLink "TableDialog/_colorPicker:property"}}_colorPicker{{/crossLink}} initializer.
	 *
 	 * `z-index` of the color picker is assigned a value that is greater than `z-index` of
	 * the table dialog window. Without this assignment, the color picker dialog window is
	 * located below the layer of the table dialog window and hence remains unreachable.
	 *
	 * There might be a better way to find dynamically what z-index it should be assigned.
	 * For the moment, the table dialog window turns out to have z-index 10010 (found by
	 * analyzing its html code).
	 * @method  colorPeackerInit
	 * @return {void}
	 * @since  0.0.6
	 */
	(function(){
		_colorPicker.attachEvent('onShow', function(){
			// console.log(this);
			var elem = this.base;
			elem.childNodes[0].style.zIndex = '10011';
		});
	}());



	/**
	 * Draws text input fields to insert weight factors for the column widths.
	 *
	 * The number of text input field is taken from a text input field responsable for the
	 * number of table columns. Once that text input field is modified, this function is fired.
	 * If inserted number of columns is bigger than the number of the text input fields
	 * to insert column weight factors, then missing text input fields are appended.
	 * If inserted number of the columns is smaller than the number of the text input fields
	 * to insert column weight factors, then extra text input fields are removed.
	 *
	 * @method         drawInputCells
	 * @return         {void}
	 * @since          0.0.4
	 * @private
	 */
	var	drawInputCells = function (el) {
		var children = [],
			len, i, colWeigthTab, colWeigthTabId = 'colWeights';
		// 1. hide previous version of the page (if any)
		// 2. prepare a new version of the page
		// 3. reveal the new version of the page
		this.getDialog().hidePage(colWeigthTabId);
		try {
			// creating array of input text fields
			len = parseInt(el.data.value, 10);
			for (i = 0; i < len; i++){
				children.push({
					type: 'text',
					id: 'col' + i,
					inputStyle: 'min-width: 3em; width: 5em; text-align: center; margin: 0.2em',
				});
			}
			colWeigthTab = {
				id: colWeigthTabId,
				label: editor.lang[_pluginName].colWeightInfo,
				elements: [{
					type: 'html',
					html: editor.lang[_pluginName].columnWeight
				}, {
					type: 'hbox',
					children: children
				}]
			};
			this.getDialog().addPage(colWeigthTab);
			// revealing the page
			this.getDialog().showPage(colWeigthTabId);
		} catch (e){
			console.log('Error of type ' + e.name + ' occurred when retrieveing number of columns.');
		}
	};

	/**
	 * Removes (if any) input field resposible for column widths.
	 * @param          {CKEDITOR.dialog}    dialog
	 * @method         dropInputCells
	 * @return         {void}
	 * @since          0.0.6
	 */
	var dropInputCells = function(dialog){
		var colWeigthTabId = 'colWeights';
		dialog.hidePage(colWeigthTabId);
	};

	/**
	 * It takes the content of input field that invoked this function and converts
	 * it into a number. If the convertion fails, 1 is used. The result of the conversion
	 * is then substituted into the input field.
	 * @method         asNumber
	 * @return         {void}
	 * @since          0.0.6
	 */
	var asNumber = function(){
		var input = this.getValue(),
			num = parseInt(input, 10),
			result = input !== undefined && num.toString() === input;
		if (!result){
			this.setValue(isNaN(num) ? '1' : num.toString());
		}
	};

	/**
	 * Binds element that invoked this method with specific text input field: if the elements invokes this function,
	 * the value of target text input field gets modified.
	 *
	 * If the element invokes this function and target text input field value is not positive,
	 * then this field recieves value 1.
	 *
	 * Invoking element must have `target` key to be set to a three-element array
	 * <code>[tabId, elementId, defaultValue]</code>
	 * where `tabId` and `elemId` chracterize location of the target element and `defaultValue`
	 * is value that is suggested for the target.
	 *
	 * @method         suggestValue
	 * @return         {void}
	 * @since          0.0.6
	 */
	var suggestValue = function(){
		if (!this.getValue()){
			return;
		}
		var target = this.target;
		if (!target){
			return;
		}
		var elem = this.getDialog().getContentElement(target[0], target[1]);
		if (!elem){
			return;
		}
		var value = parseInt(elem.getValue(), 10);
		if (!(value > 0)){
			elem.setValue(target[2]);
		}
	};

	/**
	 * Returns html tag to insert icon.
	 * @method         iconName
	 * @param          {String}             fileName  icon file name. It should be located in "table2/icons" folder of the
	 *                                      custom plugin folder.
	 * @param          {String}             title
	 * @return         {String}
	 * private
	 * @since          0.2.0
	 */

	var _iconTag = function(fileName, title){
		if (typeof fileName === 'string' && fileName.trim()){
			var titleText = '',
				path = _iconsDir + fileName;
			titleText =' title="' + (title || fileName) + '"';
			return '<img src="' + path + '"' + titleText + '/>';
		}
	};

	/**
	 * Appends {{#crossLink "TableDialog/_colorPicker:property"}}color picker{{/crossLink}} instance
	 * to many elements.
	 *
	 * The user elements are provided by means of the argument which should be given in the following format:
	 * {tabId1: [pageId1, pageId2, ...], tabId2: [pageId1, pageId2, ...], ...}
	 * @method         appendColorPickerToBunch
	 * @param          {Object}  dialog
	 * @param          {Object}        elements
	 * @return         {void}
	 * @since          0.2.1
	 */
	var _appendColorPickerToBunch = function(dialog, elements){
		var tab, ids, len, i, id;
		for (tab in elements){
			if (elements.hasOwnProperty(tab)){
				ids = elements[tab];
				len = ids.length;
				for (i = 0; i < len; i++){
					try {
						id = dialog.getContentElement(tab, ids[i]).getInputElement().$.getAttribute('id');
						_colorPicker.linkTo(id);
					} catch (e){
						console.log(e.name + ' occurred when linking color picking dialog to input element (' + i + ' of tab '  + tab + '): ' + e.message);
					}


				}
			}
		}
	};


	var dialogWindow = {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.table.title,
		minWidth:  500,
		minHeight: 300,

		// Dialog window contents definition.
		contents: [{
			id: 'table',
			label: editor.lang[_pluginName].structure,
			elements: [{
				type: 'text',
				label: "Background color",
				id: 'background',
				default: '#FFFFFF',
				customcolors: true,
				inputStyle: _inputColorStyle
			}, {
				type: 'text',
				label: "Padding",
				id: 'padding',
				default: '0',
				inputStyle: _inputNumberStyle
			}, {
				type: 'text',
				label: "Margin",
				id: 'margin',
				default: '0',
				inputStyle: _inputNumberStyle
			}, {
				type: 'text',
				label: "Border color",
				id: 'border-color',
				default: '#000001',
				inputStyle: _inputColorStyle
			}, {
				type: 'text',
				label: "Border width",
				id: 'border-width',
				default: '0',
				inputStyle: _inputNumberStyle
			}, {
				type: 'text',
				label: "Number of rows",
				id: 'rows',
				default: '1',
				onChange: asNumber,
				inputStyle: _inputNumberStyle
			}, {
				type: 'text',
				label: "Number of columns",
				id: 'columns',
				default: '1',
				onChange: drawInputCells,
				inputStyle: _inputNumberStyle
			},
			 {
				type: 'html',
				id:   'columnWidthTableTitle',
				html: ''
			}, {
				type: 'html',
				id:   'columnWidthTable',
				html: ''
			}]},
		{
			id: 'rows',
			label:  editor.lang[_pluginName].rows,
			elements: [
			{
				type: 'vbox',
				children: [{
					type: 'text',
					label: "Padding",
					id: 'padding',
					default: '0',
					inputStyle: _inputNumberStyle,
					onChange: asNumber
				}, {
					type: 'text',
					label: "Margin",
					id: 'margin',
					default: '0',
					inputStyle: _inputNumberStyle,
					onChange: asNumber
				}, {
					type: 'text',
					label: "Border color",
					id: 'border-color',
					default: '#000001',
					inputStyle: _inputColorStyle
				}, {
					type: 'text',
					label: "Border width",
					id: 'border-width',
					default: '0',
					inputStyle: _inputNumberStyle,
					onChange: asNumber
				}, {
					type: 'hbox',
					widths: ['8%', '8%', '8%', '8%', '8%', '8%', '20%', '20%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'html',
							id: 'topHorIcon',
							html: _iconTag('upper.gif', editor.lang[_pluginName].topHorBord)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang[_pluginName].topHorBord,
							id: 'topHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							id: 'intHorIcon',
							html: _iconTag('middleHor.gif', editor.lang[_pluginName].intHorBord)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang[_pluginName].intHorBord,
							id: 'intHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							id: 'bottomHorIcon',
							html: _iconTag('lower.gif', editor.lang[_pluginName].bottomHorBord)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang[_pluginName].bottomHorBord,
							id: 'bottomHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}]
				}
				]
			}]
		}, {
			id: 'cells',
			label:  editor.lang[_pluginName].cells,
			elements: [{
				type: 'vbox',
				children: [{
					type: 'text',
					label: "Padding",
					id: 'padding',
					default: '0',
					inputStyle: _inputNumberStyle,
					onChange: asNumber
				}, {
					type: 'text',
					label: "Margin",
					id: 'margin',
					default: '0',
					inputStyle: _inputNumberStyle,
					onChange: asNumber
				}, {
					type: 'text',
					label: "Border color",
					id: 'border-color',
					default: '#000001',
					inputStyle: _inputColorStyle
				}, {
					type: 'text',
					label: "Border width",
					id: 'border-width',
					default: '0',
					inputStyle: _inputNumberStyle,
					onChange: asNumber
				}, {
					type: 'hbox',
					widths: ['8%', '8%', '8%', '8%', '8%', '8%', '20%', '20%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'html',
							id: 'leftVerIcon',
							html: _iconTag('left.gif', editor.lang[_pluginName].leftVerBord),
							style: _borderIconStyle
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang[_pluginName].leftVerBord,
							id: 'leftVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							id: 'intVerIcon',
							html: _iconTag('middleVer.gif', editor.lang[_pluginName].intVerBord)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang[_pluginName].intVerBord,
							id: 'intVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							id: 'rightVerIcon',
							html: _iconTag('right.gif', editor.lang[_pluginName].rightVerBord)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang[_pluginName].rightVerBord,
							id: 'rightVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}]
				}
			]
			}]
		}
		],

		/**
		 * Binding {{#crossLink "TableDialog/_colorPicker:property"}}_colorPicker{{/crossLink}}
		 * to color-related input text fields.
		 * @method     onLoad
		 * @return     {void}
		 */
		onLoad: function(){
			// ui text input elements to which the color picker should be appended
			// format: tabId: [pageId1, pageId2, ...]
			var colorInputFields = {
				'table':     ['background', 'border-color'],
				'rows':      ['border-color'],
				'cells':     ['border-color'],
			};
			_appendColorPickerToBunch(this, colorInputFields);
		},



		/**
		 * The function to execute when the dialog is loaded (executed every time the dialog is opened).
		 *
		 * @method    onShow
		 * @return    {void}
		 */
		onShow: function() {
		},

		/**
		 * The function to execute when the dialog is confirmed.
		 *
		 * @method    onShow
		 * @return    {void}
		 */
		onOk: function () {
			_controller.onOk(this, editor, _controller.getExtra(this));
			dropInputCells(this);
		}
	};
	return dialogWindow;
}


CKEDITOR.dialog.add('TablePluginDialog', TableDialog);