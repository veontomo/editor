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

	/**
	 * Instance of {{#crossLink "Controller"}}Controller.{{/crossLink}}
	 * @property       _controller
	 * @type           CTable
	 * @private
	 */
	 var _controller = new CTable();

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
				label: editor.lang.TablePlugin.colWeightInfo,
				elements: [{
					type: 'html',
					html: editor.lang.TablePlugin.columnWeight
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
		// var columnWidths = dialog.getContentElement('structure', 'columnWidthTable').getElement().$,
			// title = dialog.getContentElement('structure', 'columnWidthTableTitle').getElement().$,
		// 	children, i, len;
		// children = columnWidths.childNodes;
		// len = children.length;
		var colWeigthTabId = 'colWeights';
		dialog.hidePage(colWeigthTabId);
		// removing the children backwards (since "children" is a live list)
		// for (i = len - 1; i >= 0; i--) {
		// 	columnWidths.removeChild(children[i]);
		// }
		// title.innerHTML = '';
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
			id: 'structure',
			label: editor.lang.TablePlugin.structure,
			elements: [
			{
				type: 'text',
				label: editor.lang.table.rows,
				id: 'rows',
				'default': 1,
				inputStyle: _inputNumberStyle,
				onChange: asNumber
			}, {
				type: 'text',
				label: editor.lang.table.columns,
				id: 'cols',
				'default': 1,
				inputStyle: _inputNumberStyle,
				onChange: drawInputCells
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
			id: 'borders',
			label: editor.lang.TablePlugin.borders,
			elements: [
			{
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.TablePlugin.frame,
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'text',
						label: editor.lang.common.width,
						title: editor.lang.TablePlugin.valueInPx,
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
					html:  editor.lang.TablePlugin.rowBorders,
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
						target: ['borders', 'rowBorderWidth', '1']
					}]

				}]
			},  {
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.TablePlugin.cellBorders,
				}, {
					type: 'hbox',
					widths: ['8%', '8%', '8%', '8%', '8%', '8%', '20%', '20%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'html',
							html: _controller.iconTag('left.gif', editor.lang.TablePlugin.leftVerBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.TablePlugin.leftVerBord,
							id: 'leftVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: _controller.iconTag('middleVer.gif', editor.lang.TablePlugin.intVerBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.TablePlugin.intVerBord,
							id: 'intVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: _controller.iconTag('right.gif', editor.lang.TablePlugin.rightVerBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.TablePlugin.rightVerBord,
							id: 'rightVerBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: _controller.iconTag('upper.gif', editor.lang.TablePlugin.topHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.TablePlugin.topHorBord,
							id: 'topHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: _controller.iconTag('middleHor.gif', editor.lang.TablePlugin.intHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.TablePlugin.intHorBord,
							id: 'intHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: _controller.iconTag('lower.gif', editor.lang.TablePlugin.bottomHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: editor.lang.TablePlugin.bottomHorBord,
							id: 'bottomHorBord',
							default: false,
							onChange: suggestValue,
							target: ['borders', 'cellBorderWidth', '1']
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: editor.lang.colordialog.title,
						}, {
							type: 'text',
							label: '',
							title: editor.lang.TablePlugin.chooseColor,
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
			id: 'background',
			label: editor.lang.TablePlugin.background,
			elements: [
			{
				type: 'text',
				label: editor.lang.table.cell.bgColor,
				id: 'globalTableBgColor',
				'default': '#ffffff',
				inputStyle: _inputColorStyle

			}]
		}, {
			id: 'spaces',
			label: editor.lang.TablePlugin.spacesTitle,
			elements: [
			{
				type: 'vbox',
				children: [{
					type: 'html',
					html: editor.lang.TablePlugin.spacesDescr,
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'text',
							label: editor.lang.TablePlugin.globalSpaces,
							title: editor.lang.TablePlugin.valueInPx,
							'default': '0',
							id: 'spaceTableGlobal',
							inputStyle: _inputNumberStyle,
							onChange: asNumber
						}, {
							type: 'text',
							label: editor.lang.TablePlugin.globalPadding,
							title: editor.lang.TablePlugin.valueInPx,
							'default': '0',
							id: 'paddingTableGlobal',
							inputStyle: _inputNumberStyle,
							onChange: asNumber
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'text',
							label: editor.lang.TablePlugin.rowSpaceTitle,
							title: editor.lang.TablePlugin.valueInPx,
							'default': '0',
							id: 'spaceBtwRows',
							inputStyle: _inputNumberStyle,
							onChange: asNumber
						}, {
							type: 'text',
							label: editor.lang.TablePlugin.cellSpace,
							title: editor.lang.TablePlugin.valueInPx,
							'default': '0',
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
				'borders':     ['globalBorderColor',  'rowBorderColor', 'cellBorderColor'],
				'background':  ['globalTableBgColor'],
			};
			var tab, ids, len, i, id;
			for (tab in colorInputFields){
				if (colorInputFields.hasOwnProperty(tab)){
					ids = colorInputFields[tab];
					len = ids.length;
					for (i = 0; i < len; i++){
						id = this.getContentElement(tab, ids[i]).getInputElement().$.getAttribute('id');
						_colorPicker.linkTo(id);
					}
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
		    	var table = _controller.getTable(editor);
		    		// parentElem = this.getContentElement('structure', 'columnWidthTable').getElement().$,
		    		// n = table instanceof Table ? table.colNum() : 0;
		    	// _controller.addColWeightFields(parentElem, n);
		    	_controller.fillInDialog(this, _controller.templateToDialog(table.template()));
		    	_controller.disableFields(this, {'structure': ['rows', 'cols']});
		    }
		},

		onOk: function () {
			var tableNode, tableElem;
			// in case of insertion of a new table
			if (isNew){
				tableNode = _controller.create(this, editor);
				tableElem = CKEDITOR.document.createElement(tableNode);
				editor.insertElement(tableElem);
			} else {
				// in case of updating current table
				var currentTable = _controller.findParentTable(editor);
				if (!currentTable){
					console.log('parent table is NOT found');
					return;
				}
				tableNode = _controller.update(this, editor, currentTable);
				currentTable.parentNode.replaceChild(tableNode, currentTable);
				// tableElem = CKEDITOR.document.createElement(tableNode);
				// tableElem.replace(currentTable);
			}
			dropInputCells(this);
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
	console.log('update table is called');
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
	console.log('create table is called');
	return manageTable(editor, true);
}


CKEDITOR.dialog.add('TablePluginDialogCreate', createTable);
CKEDITOR.dialog.add('TablePluginDialogModify', updateTable);
