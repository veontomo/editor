/*global CKEDITOR, location, NEWSLETTER, Table, Style, trace */
/*jslint plusplus: true, white: true */
/**
 * Finds the nearest ascendant of the "elem" for which "filter" returns true
 * @param {CKEDITOR.dom.element} elem
 * @param  {function} filter
 * @return {CKEDITOR.dom.element|null}
 */
var findAscendant = function (elem, filter) {
		if (typeof filter !== 'function') {
			return null;
		}
		while (elem && elem.type === CKEDITOR.NODE_ELEMENT) {
			if (filter(elem)) {
				return elem;
			}
			elem = elem.getParent();
		}
		return null;
	};

/**
 * Drops the table row. If after removing the table becomes empty, then removes it as well.
 */
var dropRow = function (ed) {
		var row = findAscendant(ed.getSelection().getStartElement(), function (el) {
			return ((el.getName() === "tr") && (el.getAttribute(NEWSLETTER['marker-name']) === "Row"));
		}),
			parentTable, tableLength;
		if (row) {
			parentTable = findAscendant(row, function (el) {
				return el.getName() === 'table';
			});
			row.remove();
			// calculating the number of remaining rows
			tableLength = parentTable.getElementsByTag('tr').count();
			if (tableLength === 0) {
				parentTable.remove();
			}
		}
	};
/**
 * Converts the first letter of the string into the upper case
 * If the string is empty, the output is empty string as well.
 * @param 	str 	String
 * @return 			String
 */
var firstLetterUpperCase = function (str) {
		return str.substring(0, 1).toUpperCase() + str.substring(1);
	};

/**
 * Inserts a row at a specified position with respect to the selected element.
 * The command to insert the row is obtained by capitalizing the second argument
 * and appending it to the string 'insert'. Example: if pos is 'after', the command
 * to be executed is 'insertAfter'.
 * @param 	ed 		CKEDITOR.editor
 * @param 	pos 	String 	where to insert the element with respect to the current one.
 */
var insertRow = function (ed, pos) {
		var tag = 'tr',
			dataMarkerAttr = NEWSLETTER['marker-name'],
			dataMarkerVal = 'Row',
			currentElem = ed.getSelection().getStartElement(),
			newElement, operation, currentChildren, childNum, i, child, newChild, row = currentElem.getAscendant(tag, true);
		// looking for the table row marked as data-marker="row"
		while (!((row.getName() === tag) && (row.getAttribute(dataMarkerAttr) === dataMarkerVal))) {
			row = row.getParent();
			// whether the newly defined element exists and is of CKEDITOR type
			if (!(row && row.type === CKEDITOR.NODE_ELEMENT)) {
				return null; // exit in case no element is found in the DOM
			}
		}
		newElement = new CKEDITOR.dom.element(tag);
		operation = 'insert' + firstLetterUpperCase(pos);
		currentChildren = row.getChildren();
		childNum = currentChildren.count();

		if (newElement[operation] !== undefined) {
			newElement[operation](row);
		} else {
			return null;
		}

		row.copyAttributes(newElement);
		for (i = 0; i < childNum; i++) {
			child = currentChildren.getItem(i);
			newChild = new CKEDITOR.dom.element(child.getName());
			newChild.setHtml(row.getChild(i).getHtml());
			newElement.append(newChild);
			child.copyAttributes(newChild);
		}
	};

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
				console.log('insert a column');
				var cell, cellIndex, parentRow, parentTable;
				cell = findAscendant(ed.getSelection().getStartElement(), function (el) {
					console.log(el.getName());
					return (el.getName() === 'td');
				});
				cellIndex = cell.getIndex();

				// find parent row and parent table to be sure that we treat a cell and not a bogus cell.
				parentRow = findAscendant(ed.getSelection().getStartElement(), function (el) {
					console.log(el.getName());
					return (el.getName() === 'tr');
				});

				console.log('index of the cell in the row', cellIndex);

			}
		});

		editor.addCommand('table2AddRowBefore', {
			exec: function (editor) {
				insertRow(editor, 'before');
			}
		});

		editor.addCommand('table2AddRowAfter', {
			exec: function (editor) {
				insertRow(editor, 'after');
			}
		});
		editor.addCommand('table2DeleteRow', {
			exec: function (editor) {
				dropRow(editor);
			}
		});
		editor.addCommand('table2DeleteTable', {
			exec: function (ed) {
				var tableMarker = (new Table()).getType(), // string with which tables are marked
					table = findAscendant(ed.getSelection().getStartElement(), function (el) {
					return ((el.getName() === 'table') &&
						(el.getAttribute(NEWSLETTER['marker-name']) === tableMarker));
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



			editor.contextMenu.addListener(function (element) {
				var rowMarker = (new Row()).getType(), // string with which rows are marked
					el = findAscendant(element, function (el) {
					return (el.getName() === 'tr' && el.getAttribute(NEWSLETTER['marker-name']) === rowMarker);
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
				var tableMarker = (new Table()).getType(), // string with which tables are marked
					el = findAscendant(element, function (el) {
					return (el.getName() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === tableMarker);
				}),
				menuObj, elemObj;
				if (el) {
					menuObj = {
						table2DeleteTable: CKEDITOR.TRISTATE_OFF,
						table2InsertColumnBefore: CKEDITOR.TRISTATE_OFF
					};

					// some get info about clicked table
					elemObj = el.getOuterHtml().createTableFromHtml();
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
				// onChange: updateCellWidthInputs
			}
			]
		}
		],

		onShow: function () {
			var hiddenDiv = CKEDITOR.document.getById('hiddenDiv'),
				infoCol  = 	CKEDITOR.document.getById('infoCol'),
				colField, i,
				currentElem = editor.getSelection().getStartElement(),
				table = findAscendant(currentElem, function(el){
					return el.getName() === 'table' &&
						el.getAttribute(NEWSLETTER['marker-name'] ) === (new Table()).getType();
			});
			// exit if the table is not found
			if (!table){
				return null;
			}

			var tableObj = table.getOuterHtml().createTableFromHtml(),
				profile = tableObj.getProfile(),
				totWidth = trace(profile),
				colNum = profile.length,
				unit = 'px',
				cellWidthStr = profile.map(function(el){
						return el + ' ' + unit;
					}).join(' + ');

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
				currentElem, table, currentTable, tableStr, tableElem,
				i;
			for (i = 0; i < len; i++){
				userInput[i] = parseInt(inputFields.getItem(i).getValue(), 10);
			}

			currentElem = editor.getSelection().getStartElement();
			table = findAscendant(currentElem, function(el){
				return el.getName() === 'table' &&
					el.getAttribute(NEWSLETTER['marker-name'] ) === (new Table()).getType();
			});
			currentTable = table.getOuterHtml().createTableFromHtml();
			currentTable.setProfile(userInput);

			tableStr = currentTable.toHtml();
			tableElem = CKEDITOR.dom.element.createFromHtml(tableStr);
			table.remove();
			// call a custom method to insert the table and assign hovering effects on it
			editor.insertTableWithHoverEff(tableElem);
		}
	};
});

CKEDITOR.dialog.add('table2DropColumnDialog', function (editor) {
	return {
		title: editor.lang.table.column.deleteColumn,
		minWidth: "80em",
		minHeight: "10em",
		contents: [{
			id: 'tab1',
			label: 'Togliere colonna',
			elements: [{
				type: 'text',
				label: editor.lang.table.column.deleteColumn,
				id: 'colNum',
				validate: function(){
					var inputValue = this.getValue();
					return inputValue === (parseInt(inputValue, 10).toString());
				}
			}]
		}
		],

		onOk: function () {
			var currentElem = editor.getSelection().getStartElement(),
				tableElem = findAscendant(currentElem, function(el){
					return el.getName() === 'table' &&
						el.getAttribute(NEWSLETTER['marker-name'] ) === (new Table()).getType();
				}),
				tableObj = tableElem.getOuterHtml().createTableFromHtml(),
				colNum = tableObj.colNum(),
				colToDrop, tableStr, tableElem2;
			// user input for the column number to drop: range from 1 to colNum
			colToDrop = parseInt(this.getValueOf('tab1', 'colNum'), 10);
			if (colToDrop >= 1 && colToDrop <= colNum){
				tableObj.dropColumn(colToDrop - 1);
			}
			tableStr = tableObj.toHtml();
			tableElem2 = CKEDITOR.dom.element.createFromHtml(tableStr);
			tableElem.remove();
			// call a custom method to insert the table and assign hovering effects on it
			editor.insertTableWithHoverEff(tableElem2);
		}
	};
});
