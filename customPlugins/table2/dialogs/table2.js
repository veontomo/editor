/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, Row, Cell, TableStyles, TableRowStyles, TableCellStyles, Content, NEWSLETTER, alert, CKHelper, Helper, CTable
 */

 /**
  * Table dialog.
  *
  * @module  Dialogs
  * @class   table2Dialog
  */

CKEDITOR.dialog.add('table2Dialog', function (editor) {

	var inputStyle = 'min-width: 3em; width: 5em;text-align: center;';
	var inputColorStyle = 'width: 6em;';   // input field style for choosing color
	var inputWidthStyle = 'width: 3em;';   // input field style for choosing width

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
	 */
	var	drawColumns = function () {
			// adds input fields to set the widths of the table columns
			var columnWidths = this.getDialog().getContentElement('info', 'columnWidthTable').getElement().$,
				title = this.getDialog().getContentElement('info', 'columnWidthTableTitle').getElement().$,
				inputFieldStyle = 'min-width: 3em; width: 5em; text-align: center; margin: 0.2em',
				children, i, colNumCurrent, colNumDesired, inputField;
			children = columnWidths.childNodes;
			colNumCurrent = children.length;                                                // actual number of input fields
			colNumDesired = parseInt(this.getDialog().getValueOf('info', 'tblCols'), 10);   // desirable number of input fields
			title.innerHTML =  colNumDesired > 0  ? editor.lang.table2.columnWeight : editor.lang.table2.valueInPx;
			if (colNumDesired < colNumCurrent){
				for (i = colNumCurrent - 1; i > colNumDesired - 1; i--) {
					columnWidths.removeChild(children[i]);
				}
			} else {
				for (i = 0; i < colNumDesired - colNumCurrent; i++){
					inputField = document.createElement('input');
					inputField.setAttribute('style', inputFieldStyle);
					inputField.setAttribute('class', 'cke_dialog_ui_input_text');
					columnWidths.appendChild(inputField);
				}
			}
		},

		/**
		 * Calls color picker function.
		 * @todo    to be implemented
		 * @method  setColor
		 * @since   0.0.6
		 */
		setColor = function(){
			var dialog = this.getDialog();
			dialog.setValueOf(dialog._.currentTabId, this.id, 'TO DO: implement color picking ' + (new Date()).getSeconds());
			// console.log(this.getInputElement());
			// var elem = dialog.getContentElement(dialog._.currentTabId, this.id).getElement();
			// var picker = new Picker(elem.$);
    	    // picker.on_done = function(colour) {
    	    // 	dialog.setValueOf(dialog._.currentTabId, this.id, colour.hex().toString());
    	    // 	// elem.setValue(colour.hex().toString());
    	    //     console.log(colour.hex().toString());
    	    //     // console.log(colour.hex());
    	    // };
	        // elem.$.onclick = function() {
	            // picker.show();
    	    // };



			// dialog.setValueOf(dialog._.currentTabId, this.id, 'TO DO: implement color picking ' + (new Date()).getSeconds());
		};
// editor.plugins.colordialog;
console.log(editor.getCommand('colordialog'));
// console.log(editor.getContentElement("picker","selectedColor"));
// console.log(editor.plugins.colordialog);
	return {
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
				'default': '2',
				'inputStyle': inputStyle,
			},
			{
				type: "text",
				label: editor.lang.table.columns,
				id: 'tblCols',
				'default': '1',
				'inputStyle': inputStyle,
				onChange: drawColumns
			},
			// {
			// 	type: 'text',
			// 	id: 'borderWidth',
			// 	label: editor.lang.table.border + ' (px)',
			// 	'default': '0',
			// 	'inputStyle': inputStyle
			// },
			// {
			// 	type: 'text',
			// 	label: editor.lang.table2.rowBorders,
			// 	id: 'rowBorder',
			// 	'default': '0',
			// 	'inputStyle': inputStyle
			// },
			// {
			// 	type: 'text',
			// 	label: editor.lang.image.vSpace + ' (px)',
			// 	'default': '1',
			// 	id: 'vSpace',
			// 	'inputStyle': inputStyle
			// },
			// {
			// 	type: 'text',
			// 	label: editor.lang.image.hSpace + ' (px)',
			// 	'default': '1',
			// 	id: 'hSpace',
			// 	'inputStyle': inputStyle
			// },
			{
				type: 'html',
				id:   'columnWidthTableTitle',
				// html: '<div id="columnWidthTableTitle"></div>'
				html: ''
			}, {
				type: 'html',
				id:   'columnWidthTable',
				// html: '<div id="columnWidthTable"></div>',
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
						inputStyle: inputWidthStyle
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'globalBorderColor',
						'default': '#000001',
						onClick: setColor,
						inputStyle: inputColorStyle
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
						inputStyle: inputWidthStyle
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'rowBorderColor',
						'default': '#000001',
						onClick: setColor,
						inputStyle: inputColorStyle
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
							id: 'leftVerBord'
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
							id: 'intVerBord'
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
							id: 'rightVerBord'
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
							id: 'topHorBord'
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
							id: 'intHorBord'
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
							id: 'bottomHorBord'
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
							onClick: setColor,
							inputStyle: inputColorStyle

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
							inputStyle: inputWidthStyle

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
				id: 'backgroundColor',
				'default': '#000001',
				onClick: setColor,
				inputStyle: inputColorStyle

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
							'default': '0',
							id: 'spaceTableGlobal',
							inputStyle: inputWidthStyle
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'text',
							label: editor.lang.table2.rowSpaceTitle,
							title: editor.lang.table2.valueInPx,
							'default': '0',
							id: 'spaceBtwRows',
							inputStyle: inputWidthStyle
						}, {
							type: 'text',
							label: editor.lang.table2.cellSpace,
							title: editor.lang.table2.valueInPx,
							'default': '0',
							id: 'spaceCell',
							inputStyle: inputWidthStyle
						}]
					}]
				}]
			}]
		}


		],

		onOk: function () {
			var tableNode = CTable.template(this, editor);
			var tableElem = CKEDITOR.document.createElement(tableNode);
			editor.insertElement(tableElem);
		}
	};
});



// {
// 					type: 'text',
// 					id: editor.lang.table2.spacesDescr,
// 					'default': '0',
// 					title: editor.lang.table2.valueInPx
// 				}