/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, Row, Cell, TableStyles, TableRowStyles, TableCellStyles, Content, NEWSLETTER, alert, CKHelper, Helper, CTable
 */
CKEDITOR.dialog.add('table2Dialog', function (editor) {
	var inputStyle = 'min-width: 3em; width: 5em;text-align: center;';
	var inputColorStyle = 'width: 6em;';   // input field style for choosing color
	var inputWidthStyle = 'width: 3em;';   // input field style for choosing width

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
		},
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


	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.table.title,
		minWidth: 500,
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
				label: editor.lang.table2.rowBorders,
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
						id: 'globalBorder',
						"default": '0',
						inputStyle: inputWidthStyle
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'globalBorderColor',
						'default': '#000001x',
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
						id: 'phantomBorder',
						"default": '0',
						inputStyle: inputWidthStyle
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'phantomBorderColor',
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
// 					"default": '0',
// 					title: editor.lang.table2.valueInPx
// 				}