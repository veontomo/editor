/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, Row, Cell, TableStyles, TableRowStyles, TableCellStyles, Content, NEWSLETTER, alert, CKHelper, Helper, CTable
 */
CKEDITOR.dialog.add('table2Dialog', function (editor) {
	var inputStyle = 'min-width: 3em; width: 5em;text-align: center;';

	/**
	 * Drops inline attribute named attrName from DOM element
	 * @param          {Object}             element 	an inline attribute of  this element will be dropped.
	 *                                                  The element should respond to jQuery "attr" method.
	 * @param          {string}             attrName 	this attribute name will be dropped.
	 * @return         {void}
	 */

	var INPUTCOLWIDTHNAME = 'widthCol',
		// draw input fields for column width
		drawColumns = function () {
			// adds input fields to set the widths of the table columns
			var element = CKEDITOR.document.getById('columnWidthTable'),
				title = CKEDITOR.document.getById('columnWidthTableTitle'),
				children, length, i, td, inputField, colWidthInput, tr, colNum;

			title.setHtml('');
			children = element.getChildren();
			length = children.count();
			for (i = 0; i < length; i++) {
				children.getItem(i).remove();
			}

			colWidthInput = new CKEDITOR.dom.element('table');
			tr = new CKEDITOR.dom.element('tr');
			colNum = this.getDialog().getValueOf('info', 'tblCols');
			colWidthInput.append(tr);
			if (colNum > 1) {
				for (i = 0; i < colNum; i++) {
					td = new CKEDITOR.dom.element('td');
					inputField = new CKEDITOR.dom.element('input');
					inputField.setAttribute('type', 'text');
					inputField.setAttribute('id', INPUTCOLWIDTHNAME + i);
					// inputField.setAttribute('width', '50');
					inputField.setAttribute('class', 'cke_dialog_ui_input_text');
					inputField.setStyle('min-width', '2em');
					inputField.setStyle('max-width', '5em');
					inputField.setStyle('text-align', 'center');
					td.append(inputField);
					tr.append(td);
				}
				element.append(colWidthInput);
				title.setHtml('Fattori con i quali le colonne contribuiscono<br>nella larghezza della tabella:');
			}
		};


	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.table.title,
		minWidth: 300,
		minHeight: 300,

		// Dialog window contents definition.
		contents: [{
			id: "info",
			label: editor.lang.table.columns + ' & ' + editor.lang.table.rows,
			elements: [
			{
				type: 'text',
				label: editor.lang.table.rows,
				id: 'tblRows',
				"default": '2',
				'inputStyle': inputStyle,
			},
			{
				type: "text",
				label: editor.lang.table.columns,
				id: 'tblCols',
				'default': '2',
				'inputStyle': inputStyle,
				onChange: drawColumns
			},
			{
				type: 'text',
				id: 'borderWidth',
				label: editor.lang.table.border + ' (px)',
				'default': '0',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: 'Bordo attorno alle righe (px)',
				id: 'frameWidth',
				'default': '0',
				'inputStyle': inputStyle
			},{
				type: 'text',
				label: editor.lang.image.vSpace + ' (px)',
				'default': '1',
				id: 'vSpace',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: editor.lang.image.hSpace + ' (px)',
				'default': '1',
				id: 'hSpace',
				'inputStyle': inputStyle
			}, {
				type: 'html',
				html: '<div id="columnWidthTableTitle"></div>'
			}, {
				type: 'html',
				html: '<div id="columnWidthTable"></div>',
			}, {
				// whether the line separator between table rows should be included
				type: 'checkbox',
				label: editor.lang.table2.separator,
				id: 'trSeparator',
				'inputStyle': inputStyle,
				'default': false
			}]
		}, {
			id: 'borderTab',
			label: 'Bordi', // it is better to make it I18n
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
						title: 'larghezza in pixel',
						id: 'globalBorder',
						"default": '0',
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'globalBorderColor',
						'default': '#000001',
						"onclick": 'colorPicker(click)' // does not work
					}]
				}]
			}, {
				type: 'vbox',
				children: [{
					type: 'html',
					html: 'Bordo attorno a ogni riga',
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'text',
						label: editor.lang.common.width,
						id: 'phantomBorder',
						"default": '0',
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'phantomBorderColor',
						'default': '#000001'
					}]

				}]
			},  {
				type: 'vbox',
				children: [{
					type: 'html',
					html: 'Bordo attorno a celle',
				}, {
					type: 'hbox',
					widths: ['10%', '10%', '10%', '10%', '10%', '10%', '20%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('left.gif', editor.lang.table2.leftVertBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: 'left border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('middleVer.gif', editor.lang.table2.intVertBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: 'middle vertical border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('right.gif', editor.lang.table2.rightVertBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: 'right border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('upper.gif', editor.lang.table2.topVertBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: 'upper border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('middleHor.gif', editor.lang.table2.intHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: 'middle horizontal border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: CTable.iconTag('lower.gif', editor.lang.table2.bottomHorBord, 15, 15)
						}, {
							type: 'checkbox',
							label: '',
							title: 'lower border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: editor.lang.colordialog.title,
						}, {
							type: 'text',
							label: '',
							title: 'inserisci colore',
							'default': '#000001',

						}]
					}]
				}]
			}]
		}, {
			id: 'backgroundTab',
			label: 'Sfondo',   // it is better to make it I18n
			elements: [
			{
				type: 'text',
				label: editor.lang.table.cell.bgColor,
				id: 'backgroundColor',

			}]
		}, {
			id: 'spacesTab',
			label: 'Spazi', // it is better to make it I18n
			elements: [
			{
				type: 'hbox',
				widths: ['50%', '50%'],
				children: [{
					type: 'html',
					html: 'Spaziatura',
					title: 'inserisci valore in pixel'
				}, {
					type: 'text',
					id: 'spaces',
					"default": '0',
					title: 'inserisci valore in pixel'
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