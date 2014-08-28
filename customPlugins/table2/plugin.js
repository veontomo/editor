/*global CKEDITOR, NEWSLETTER, Table, Row, Cell,  Helper, CKHelper, NEWSLETTER */
/*jslint plusplus: true, white: true */

CKEDITOR.plugins.add('table2', {
	// Register the icons.
	icons: 'table2',
	// The plugin initialization logic goes inside this method.
	init: function (editor) {

		// Define an editor command that opens our dialog.
		editor.addCommand('table2Dialog', new CKEDITOR.dialogCommand('table2Dialog'));
		editor.addCommand('table2ResizeColumns', new CKEDITOR.dialogCommand('table2ResizeColumnsDialog'));
		editor.addCommand('table2DropColumn', new CKEDITOR.dialogCommand('table2DropColumnDialog'));
		editor.addCommand('table2InsertColumnBefore', {
			exec: function(ed){
				CKHelper.insertColumn(ed, 'before');
			}
		});

		editor.addCommand('table2InsertColumnAfter', {
			exec: function(ed){
				CKHelper.insertColumn(ed, 'after');
			}
		});

		editor.addCommand('table2AddRowBefore', {
			exec: function (editor) {
				CKHelper.insertRow(editor, 'before');
			}
		});

		editor.addCommand('table2AddRowAfter', {
			exec: function (editor) {
				CKHelper.insertRow(editor, 'after');
			}
		});

		editor.addCommand('table2DeleteRow', {
			exec: function (editor) {
				CKHelper.dropRow(editor);
			}
		});

		editor.addCommand('table2DeleteTable', {
			exec: function (ed) {
				var tableMarker = (new Table()).getName(), // string with which tables are marked
					markerName = NEWSLETTER['marker-name'],
					table = CKHelper.findAscendant(ed.getSelection().getStartElement(), function (el) {
					return ((el.getName() === 'table') &&
						(el.getAttribute(markerName) === tableMarker));
				});
				if (table) {
					table.remove();
				}
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('Table2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.table.toolbar,
			// The command to execute on click.
			command: 'table2Dialog',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('table2Dialog', this.path + 'dialogs/table2.js');

		if (editor.contextMenu) {
			editor.addMenuGroup('table2Group');
			editor.addMenuItem('table2Item', {
				label: editor.lang.table.toolbar,
				icon: this.path + 'icons/table2.png',
				command: 'table2Dialog',
				group: 'table2Group'
			});
			editor.addMenuItem('table2AddRowBefore', {
				label: editor.lang.table.row.insertBefore,
				icon: this.path + 'icons/insert_row.png',
				command: 'table2AddRowBefore',
				group: 'table2Group'
			});
			editor.addMenuItem('table2AddRowAfter', {
				label: editor.lang.table.row.insertAfter,
				icon: this.path + 'icons/insert_row.png',
				command: 'table2AddRowAfter',
				group: 'table2Group'
			});
			editor.addMenuItem('table2DeleteRow', {
				label: editor.lang.table.row.deleteRow,
				icon: this.path + 'icons/delete_row.png',
				command: 'table2DeleteRow',
				group: 'table2Group'
			});
			editor.addMenuItem('table2ResizeColumns', {
				label: editor.lang.table.column.resize || 'Resize Columns',
				icon: this.path + 'icons/resizeColumns.png',
				command: 'table2ResizeColumns',
				group: 'table2Group'
			});
			editor.addMenuItem('table2DeleteTable', {
				label: editor.lang.table.deleteTable,
				icon: this.path + 'icons/deleteTable.png',
				command: 'table2DeleteTable',
				group: 'table2Group'
			});
			editor.addMenuItem('table2DropColumn', {
				label: editor.lang.table.column.deleteColumn,
				icon: this.path + 'icons/deleteColumn.png',
				command: 'table2DropColumn',
				group: 'table2Group'
			});
			editor.addMenuItem('table2InsertColumnBefore', {
				label: editor.lang.table.column.insertBefore,
				icon: this.path + 'icons/insertColumn.png',
				command: 'table2InsertColumnBefore',
				group: 'table2Group'
			});

			editor.addMenuItem('table2InsertColumnAfter', {
				label: editor.lang.table.column.insertAfter,
				icon: this.path + 'icons/insertColumn.png',
				command: 'table2InsertColumnAfter',
				group: 'table2Group'
			});

			editor.contextMenu.addListener(function (element) {
				var rowMarker = (new Row()).getName(), // the label by which the rows are marked
					markerName  = NEWSLETTER['marker-name'],
					el;
				el = CKHelper.findAscendant(element, function (el) {
					return (el.getName() === 'tr' && el.getAttribute(markerName) === rowMarker);
				});
				if (el) {
					return {
						table2AddRowBefore: CKEDITOR.TRISTATE_OFF,
						table2AddRowAfter: CKEDITOR.TRISTATE_OFF,
						table2DeleteRow: CKEDITOR.TRISTATE_OFF
					};
				}
			});

			editor.contextMenu.addListener(function (element) {
				var tableMarker = (new Table()).getName(), // string with which tables are marked
					el = CKHelper.findAscendant(element, function (el) {
					return (el.getName() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === tableMarker);
				}),
				menuObj, elemObj;
				if (el) {
					menuObj = {
						table2DeleteTable: CKEDITOR.TRISTATE_OFF,
						table2InsertColumnBefore: CKEDITOR.TRISTATE_OFF,
						table2InsertColumnAfter: CKEDITOR.TRISTATE_OFF
					};
					elemObj = NEWSLETTER.factory.mimic(el.$);
					// if the table has more than one column, than add possibility to drop columns and to resize them.
					if (elemObj.colNum() > 1){
						menuObj.table2ResizeColumns = CKEDITOR.TRISTATE_OFF;
						menuObj.table2DropColumn = CKEDITOR.TRISTATE_OFF;
					}
					return menuObj;
				}
			});
		}
	}
});

var _pluginName = 'table2';
var _translations = {
	it: {
		separator:     'Inserire una linea tra le righe',
		frame:         'Bordo attorno alla tabella',
		intVertBord:   'Includere interni bordi verticali',
		intHorBord:    'Includere interni bordi orizzonatali',
		leftVerBord:   'Includere solo il bordo verticale sinistro',
		rightVertBord: 'Includere solo il bordo verticale destro',
		topHorBord:    'Includere solo il bordo orizzontale alto',
		bottomHorBord: 'Includere solo il bordo orizzontale basso',
	},
	en: {
		separator:     'Insert a line between the rows',
		frame:         'Frame around the table',
		intVertBord:   'Insert only internal vertical borders',
		intHorBord:    'Insert only internal horizontal borders',
		leftVerBord:   'Insert the most left horizontal border',
		rightVertBord: 'Insert the most right horizontal border',
		topHorBord:    'Insert upper horizontal border',
		bottomHorBord: 'Insert lowest horizontal border'
	},
	ru: {
		separator:     'Вернуть Крым',
		frame:         'Убрать Хутина',
		intVertBord:   'Зарядить Пудака в Царь-Пушку',
		intHorBord:    'Дать Димону игрушку',
		leftVerBord:   'Зарядить Пудака в Царь-Пушку',
		rightVertBord: 'Слить Хутину силикон',
		topHorBord:    'Зарядить Пудаку',
		bottomHorBord: 'Зарядить Путлера'
	},
	ua: {
		separator:     'Додати риску поміж рядків',
		frame:         'Додати рамку до таблиці',
		intVertBord:   'Провести внутрішні вертикальні ліниї між клітинами',
		intHorBord:    'Провести внутрішні горизонтальні ліниї між клітинами',
		leftVerBord:   'Провести ліву вертикальну лінию',
		rightVertBord: 'Провести праву вертикальну лінию',
		topHorBord:    'Провести верхню вертикальну лінию',
		bottomHorBord: 'Провести нижню вертикальну лінию'
	}

};

var _lang;
for (_lang in _translations){
	CKEDITOR.plugins.setLang(_pluginName, _lang, _translations[_lang]);
	console.log(_lang, _translations[_lang]);
}


CKEDITOR.dialog.add('table2ResizeColumnsDialog', function (editor) {
	return {
		title: editor.lang.table.column.resize,
		minWidth: "80em",
		minHeight: "10em",
		contents: [{
			id: 'tab1',
			label: 'Columns Resize',
			elements: [{
				type: 'html',
				html: '<div id="infoCol"></div>',
			}, {
				type: 'html',
				html: '<div id="hiddenDiv">Dimensioni desiderate:</div>'
			}
			]
		}
		],

		onShow: function () {
			var hiddenDiv = CKEDITOR.document.getById('hiddenDiv'),
				infoCol  = 	CKEDITOR.document.getById('infoCol'),
				colField, i,
				markerName  = NEWSLETTER['marker-name'],
				tableMarker = (new Table()).getName(),
				currentElem = editor.getSelection().getStartElement(),
				table = CKHelper.findAscendant(currentElem, function(el){
					return el.getName() === 'table' &&
						el.getAttribute(markerName) === tableMarker;
			});
			// exit if the table is not found
			if (!table){
				return null;
			}

			// var tableObj = table.getOuterHtml().createTableFromHtml();
			var tableObj = NEWSLETTER.factory.mimic(table.$);
			var	profile = tableObj.getProfile().map(function(el){
				return parseFloat(el);
			}),
				totWidth = Helper.trace(profile),
				colNum = profile.length,
				unit = 'px',
				cellWidthStr = profile.map(function(el){
						return el;
					}).join(' + ');

			//console.log('table: ', table);
			// override the field with current info about cell widths
			infoCol.setHtml('Dimensioni attuali delle colonne: ' + cellWidthStr + ' = ' + totWidth + ' ' + unit);

			// input fields for resizing
			var inputFields = hiddenDiv.getElementsByTag('input'),
				len = inputFields.count();
			// remove the items starting from the end.
			for (i = len-1; i >= 0; i--){
				inputFields.getItem(i).remove();
			}
			// appending input fields for insertion of the cell widths
			for (i = 0; i < colNum; i++){
				colField = new CKEDITOR.dom.element('input');
				colField.setAttribute('type', 'text');
				colField.setAttribute('id', 'colField' + i);
				colField.setValue(profile[i]);
				colField.setAttribute('class', 'cke_dialog_ui_input_text');
				colField.setStyle('width', '5em');
				colField.setStyle('text-align', 'center');
				// to all but last field, attach listeners that "validate" user input
				if (i < colNum - 1){
					colField.on('change', function(){
						var allButLast = 0, last, j,
							currentInput = parseInt(this.getValue(), 10),
							lastOld,
							inputFields2 = CKEDITOR.document.getById('hiddenDiv').getElementsByTag('input');
						len = inputFields2.count();
						for (j = 0; j < len - 1; j++){
							allButLast += parseInt(inputFields2.getItem(j).getValue(), 10);
						}
						// value of the last cell before any modifications
						lastOld = parseInt(inputFields2.getItem(len - 1).getValue(), 10);
						// if positive, the last cell should have this width
						last = totWidth - allButLast;
						if (last > 0){
							inputFields2.getItem(len - 1).setValue(last);
						} else {
							// re-impose the previous value of the input field
							this.setValue(currentInput + last - lastOld);
						}
					});
				} else {
					// the last field is made non-editable
					colField.setAttribute('disabled', 'true');
				}
				hiddenDiv.append(colField);
			}
		},

		onOk: function () {
			var hiddenDiv = CKEDITOR.document.getById('hiddenDiv'),
				inputFields = hiddenDiv.getElementsByTag('input'),
				len = inputFields.count(),
				userInput = [],
				factory = NEWSLETTER.factory,
				tableMarker = (new Table()).getName(),
				currentElem, table, currentTable, tableStr, tableElem,
				i;
			for (i = 0; i < len; i++){
				userInput[i] = parseInt(inputFields.getItem(i).getValue(), 10);
			}

			currentElem = editor.getSelection().getStartElement();
			table = CKHelper.findAscendant(currentElem, function(el){
				return el.getName() === 'table' &&
					el.getAttribute(NEWSLETTER['marker-name']) === tableMarker;
			});

			// currentTable = table.getOuterHtml().createTableFromHtml();
			// console.log('parent table ', table);
			currentTable = factory.mimic(table.$);
			console.log('constructed table has ', currentTable.rowNum() , ' rows');
			currentTable.disentangle();
			console.log('disentangled table has ', currentTable.rowNum() , ' rows');
			console.log('imposing profile ', userInput);
			currentTable.setProfile(userInput);
			console.log('resized table has ', currentTable.rowNum() , ' rows');

			tableStr = currentTable.toHtml();
			tableElem = CKEDITOR.dom.element.createFromHtml(tableStr);
			table.remove();
			editor.insertElement(tableElem);
			// console.log('resized table ', currentTable.toHtml());
			return null;
		}
	};
});

CKEDITOR.dialog.add('table2DropColumnDialog', function (editor) {
	return {
		title: editor.lang.table.column.deleteColumn,
		minWidth: '80em',
		minHeight: '10em',
		contents: [{
			id: 'tab1',
			label: 'Togliere colonna',
			elements: [{
				type: 'html',
				html: 'Sei sicuro di voler eliminare la colonna evidenziata?',
			}]
		}
		],

		onShow: function(){
			var currentElem = editor.getSelection().getStartElement(),
				markerName  = NEWSLETTER['marker-name'],
				rowMarker   = (new Row()).getName(),
				cellMarker  = (new Cell()).getName(),
				tableMarker = (new Table()).getName(),
				tableElem = CKHelper.findAscendant(currentElem, function(el){
					return el.getName() === 'table' && el.getAttribute(markerName) === tableMarker;
				}),
				cellElem = CKHelper.findAscendant(currentElem, function(el){
					return el.getName() === 'td' && el.getAttribute(markerName) === cellMarker;
				});
			console.log(markerName, rowMarker, cellMarker, tableMarker, currentElem, tableElem, cellElem);
			var	cellNumber = cellElem.getIndex(),
				columnElems = tableElem.find('tr[' + markerName + '="' + rowMarker + '"] td[' +
					markerName + '="' + cellMarker + '"]:nth-child('+ (cellNumber + 1) +')'),
				len = columnElems.count(),
				i,
				boxShadowValues = '0.05em 0.05em 0.5em 0.05em #8B0000';


			for (i = 0; i < len; i++){
				$(columnElems.getItem(i).$).css('box-shadow', boxShadowValues);
			}
		},

		onOk: function () {
			var markerName  = NEWSLETTER['marker-name'],
				cellMarker  = (new Cell()).getName(),
				tableMarker = (new Table()).getName(),
				currentElem = editor.getSelection().getStartElement(),
				tableElem = CKHelper.findAscendant(currentElem, function(el){
					return el.getName() === 'table' &&	el.getAttribute(markerName) === tableMarker;
				}),
				cellElem = CKHelper.findAscendant(currentElem, function(el){
					return el.getName() === 'td' &&	el.getAttribute(markerName) === cellMarker;
				}),
				// column number to drop
				cellNumber = cellElem.getIndex(),

				// tableObj = tableElem.getOuterHtml().createTableFromHtml(),
				tableObj = NEWSLETTER.factory.mimic(tableElem.$),
				colNum = tableObj.colNum(),
				tableStr, tableElem2;

			console.log('parentTable: ', tableElem);
			console.log('currentElem: ', currentElem, ', its html ', currentElem.getHtml());
			console.log('table before knocking out: ', tableObj.toHtml());
			if (cellNumber >= 0 && cellNumber < colNum){
				tableObj.knockOutCol(cellNumber);
			}
			console.log('table after knocking out: ', tableObj.toHtml());
			tableStr = tableObj.toHtml();
			tableElem2 = CKEDITOR.dom.element.createFromHtml(tableStr);
			tableElem.remove();
			// call a custom method to insert the table and assign hovering effects on it
			editor.insertElement(tableElem2);
		}
	};
});
