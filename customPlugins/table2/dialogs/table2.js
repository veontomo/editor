/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, Row, Cell, TableStyles, TableRowStyles,
TableCellStyles, Content, NEWSLETTER, alert, CKHelper, Helper, CTable, dhtmlXColorPicker, Selection */

/**
  * Table dialog.
  *
  * @module  Dialogs
  * @class   TableDialog
  */


/**
 * Returns table insertion/updating dialog.
 *
 * In case of update, the dialog fields are filled-in with the table attribute value.
 * @method        manageTable
 * @param         {CKEDITOR}      editor   instance of CKEDITOR
 * @param         {Boolean}       isNew    whether the method should insert new table or update exisiting one
 * @return        {Object}        dialog definition
 * @since         0.0.6
 */
function manageTable(editor, isNew) {
	console.log('isNew ? ' + isNew);

	/**
	 * Style for text input fields for numbers.
	 * @property {String} _inputNumberStyle
	 * @type     {String}
	 * @private
	 */
	var _inputNumberStyle = 'min-width: 3em; width: 5em; max-width: 7em; text-align: center;';

	/**
	 * Style for text input fields for choosing colors.
	 * @property {String} _inputColorStyle
	 * @type     {String}
	 * @private
	 */
	var _inputColorStyle = 'min-width: 6em; width: 6em; max-width: 6em; text-align: center;';

	/**
	 * Color picker (JavaScript ColorPicker).
	 *
	 * dhtmlxColorPicker is open source GPL v2 and Free License [JavaScript component](http://dhtmlx.com/docs/products/dhtmlxColorPicker/)
	 * for easy color selection.
	 *
	 * @property {dhtmlXColorPicker} _colorPicker
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
	})();



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
	 * @method         drawColumns
	 * @return         {void}
	 * @since          0.0.4
	 * @private
	 */
	var	drawColumns = function () {
			// adds input fields to set the widths of the table columns
			var columnWidths = this.getDialog().getContentElement('info', 'columnWidthTable').getElement().$,
				title = this.getDialog().getContentElement('info', 'columnWidthTableTitle').getElement().$,
			 _inputFieldStyle = 'min-width: 3em; width: 5em; text-align: center; margin: 0.2em',
				children, i, colNumCurrent, colNumDesired, inputField;
			children = columnWidths.childNodes;
			colNumCurrent = children.length;                                                // actual number of input fields
			colNumDesired = parseInt(this.getDialog().getValueOf('info', 'tblCols'), 10);   // desirable number of input fields
			if (isNaN(colNumDesired)){
				return;
			}
			title.innerHTML =  colNumDesired > 0  ? editor.lang.table2.columnWeight : editor.lang.table2.valueInPx;
			if (colNumDesired < colNumCurrent){
				for (i = colNumCurrent - 1; i > colNumDesired - 1; i--) {
					columnWidths.removeChild(children[i]);
				}
			} else {
				for (i = 0; i < colNumDesired - colNumCurrent; i++){
					inputField = document.createElement('input');
					inputField.setAttribute('style', _inputFieldStyle);
					inputField.setAttribute('class', 'cke_dialog_ui_input_text');
					columnWidths.appendChild(inputField);
				}
			}
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

	var dialogWindow = {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.table.title,
		minWidth: 500,
		minHeight: 300,

		// Dialog window contents definition.
		contents: [{
			id: 'info',
			label: editor.lang.table2.structure,
			elements: [
			{
				type: 'text',
				label: editor.lang.table.rows,
				id: 'tblRows',
				'default': 2,
				inputStyle: _inputNumberStyle,
				onChange: asNumber
			}, {
				type: "text",
				label: editor.lang.table.columns,
				id: 'tblCols',
				'default': 1,
				inputStyle: _inputNumberStyle,
				onChange: drawColumns
			}, {
				type: 'html',
				id:   'columnWidthTableTitle',
				html: ''
			}, {
				type: 'html',
				id:   'columnWidthTable',
				html: ''
			}]
		}, {
			id: 'borderTab',
			label: editor.lang.table2.borders,
			elements: [
			{
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.table2.frame,
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'text',
						label: editor.lang.common.width,
						title: editor.lang.table2.valueInPx,
						id: 'globalBorderWidth',
						'default': '0',
						inputStyle: _inputNumberStyle,
						onChange: asNumber
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'globalBorderColor',
						'default': '#000001',
						customcolors: true,
						inputStyle: _inputColorStyle
					}]
				}]
			}, {
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.table2.rowBorders,
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'text',
						label: editor.lang.common.width,
						id: 'rowBorderWidth',
						'default': '0',
						inputStyle: _inputNumberStyle,
						onChange: asNumber
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'rowBorderColor',
						'default': '#000001',
						inputStyle: _inputColorStyle,
						onChange: suggestValue,
						target: ['borderTab', 'rowBorderWidth', '1']
					}]

				}]
			},  {
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.table2.cellBorders,
				}, {
					type: 'hbox',
					widths: ['8%', '8%', '8%', '8%', '8%', '8%', '20%', '20%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('left.gif', editor.lang.table2.leftVerBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.table2.leftVerBord,
							id: 'leftVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borderTab', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('middleVer.gif', editor.lang.table2.intVerBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.table2.intVerBord,
							id: 'intVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borderTab', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('right.gif', editor.lang.table2.rightVerBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.table2.rightVerBord,
							id: 'rightVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borderTab', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('upper.gif', editor.lang.table2.topHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.table2.topHorBord,
							id: 'topHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borderTab', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('middleHor.gif', editor.lang.table2.intHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.table2.intHorBord,
							id: 'intHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borderTab', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('lower.gif', editor.lang.table2.bottomHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.table2.bottomHorBord,
							id: 'bottomHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borderTab', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: editor.lang.colordialog.title,
						}, {
							type: 'text',
							label: '',
							title: editor.lang.table2.chooseColor,
							id: 'cellBorderColor',
							'default': '#000001',
							inputStyle: _inputColorStyle

						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: editor.lang.common.width,
						}, {
							type: 'text',
							label: '',
							title: editor.lang.common.width,
							id: 'cellBorderWidth',
							'default': '0',
							inputStyle: _inputNumberStyle,
							onChange: asNumber

						}]
					}]
				}]
			}]
		}, {
			id: 'backgroundTab',
			label: editor.lang.table2.background,
			elements: [
			{
				type: 'text',
				label: editor.lang.table.cell.bgColor,
				id: 'globalTableBgColor',
				'default': '#ffffff',
				inputStyle: _inputColorStyle

			}]
		}, {
			id: 'spacesTab',
			label: editor.lang.table2.spacesTitle,
			elements: [
			{
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.table2.spacesDescr,
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'text',
							label: editor.lang.table2.globalSpaces,
							title: editor.lang.table2.valueInPx,
							'default': '3',
							id: 'spaceTableGlobal',
							inputStyle: _inputNumberStyle,
							onChange: asNumber
						}, {
							type: 'text',
							label: editor.lang.table2.globalPadding,
							title: editor.lang.table2.valueInPx,
							'default': '4',
							id: 'paddingTableGlobal',
							inputStyle: _inputNumberStyle,
							onChange: asNumber
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'text',
							label: editor.lang.table2.rowSpaceTitle,
							title: editor.lang.table2.valueInPx,
							'default': '3',
							id: 'spaceBtwRows',
							inputStyle: _inputNumberStyle,
							onChange: asNumber
						}, {
							type: 'text',
							label: editor.lang.table2.cellSpace,
							title: editor.lang.table2.valueInPx,
							'default': '2',
							id: 'spaceCell',
							inputStyle: _inputNumberStyle,
							onChange: asNumber

						}]
					}]
				}]
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
			// ui text input elements to which append color picker
			// format: tabId: [pageId1, pageId2, ...]
			var colorInputFields = {
				'borderTab':     ['globalBorderColor',  'rowBorderColor', 'cellBorderColor'],
				'backgroundTab': ['globalTableBgColor'],
			};
			var tab, ids, len, i, id;
			for (tab in colorInputFields){
				ids = colorInputFields[tab];
				len = ids.length;
				for (i = 0; i < len; i++){
					id = this.getContentElement(tab, ids[i]).getInputElement().$.getAttribute('id');
					_colorPicker.linkTo(id);
				}
			}
		},

		/**
		 * The function to execute when the dialog is loaded (executed every time the dialog is opened).
		 *
		 * Fills in table plugin dialog with selected (if any) table properties.
		 * @method    onShow
		 * @return    {void}
		 */
		onShow: function() {
		    if (!isNew){
		    	CTable.fillInDialog(this, editor);
		    }
		},

		onOk: function () {
			var tableNode = CTable.template(this, editor);
			var tableElem = CKEDITOR.document.createElement(tableNode);
			editor.insertElement(tableElem);
		}
	};
	return dialogWindow;
}


/**
 * Wrapper to call method {{#crossLink "TableDialog/manageTable:method"}}manageTable{{/crossLink}} method with
 * the second argument set to `false`.
 *
 * @method        updateTable
 * @param         {CKEDITOR}      editor   instance of CKEDITOR
 * @param         {Boolean}       isNew    whether the method should insert new table or modify exisiting one
 * @return        {Object}        dialog definition
 * @since         0.0.6
 */
function updateTable(editor){
	return manageTable(editor, false);
}


/**
 * Wrapper to call method {{#crossLink "TableDialog/manageTable:method"}}manageTable{{/crossLink}} method with
 * the second argument set to `true`.
 *
 * @method        createTable
 * @param         {CKEDITOR}      editor   instance of CKEDITOR
 * @param         {Boolean}       isNew    whether the method should insert new table or modify exisiting one
 * @return        {Object}        dialog definition
 * @since         0.0.6
 */

function createTable(editor){
	return manageTable(editor, true);
}


CKEDITOR.dialog.add('table2Dialog', createTable);
CKEDITOR.dialog.add('table2ModifyTableDialog', updateTable);
