/*global CKEDITOR, location, NEWSLETTER, Table */
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
		// editor.addCommand('table2ResizeColumns', {
		// 	exec: function (editor) {
		// 		var currentElem = editor.getSelection().getStartElement(),
		// 			elem = findAscendant(currentElem, function(el){
		// 				return el.getName() === 'table' &&
		// 					el.getAttribute(NEWSLETTER['marker-name'] ) === (new Table()).getType();
		// 		});
		// 		if(elem){
		// 			var currentTable = elem.getOuterHtml().createTableFromHtml();
		// 			console.log(currentTable.getColWidths());
		// 		}
		// 	}
		// });
		editor.addCommand('table2DeleteTable', {
			exec: function (ed) {
				var table = findAscendant(ed.getSelection().getStartElement(), function (el) {
					return el.getName() === 'table';
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


			editor.contextMenu.addListener(function (element) {
				var el = findAscendant(element, function (el) {
					return (el.getName() === 'tr' && el.getAttribute(NEWSLETTER['marker-name']) === 'Row');
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
				var el = findAscendant(element, function (el) {
					return (el.getName() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === 'Table');
				});
				if (el) {
					return {
						table2DeleteTable: CKEDITOR.TRISTATE_OFF,
						table2ResizeColumns: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}
	}
});


CKEDITOR.dialog.add('table2ResizeColumnsDialog', function (editor) {
	return {
		title: editor.lang.table.column.resize,
		minWidth: 400,
		minHeight: 200,
		contents: [{
			id: 'tab1',
			label: 'Columns Resize',
			elements: [{
				type: 'html',
				html: '<div id="infoCol">Dimensioni attuali delle colonne:</div>',
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
				colField, i;
			var currentElem = editor.getSelection().getStartElement(),
				table = findAscendant(currentElem, function(el){
					return el.getName() === 'table' &&
						el.getAttribute(NEWSLETTER['marker-name'] ) === (new Table()).getType();
			});
			// exit if the table is not found
			if (!table){
				return null;
			}

			var tableObj = table.getOuterHtml().createTableFromHtml(),
				profile = tableObj.getMatrix()[0],
				appendPx = profile.map(function(el){
						return el + 'px';
					}).join(' '),
				appendPxObj = new CKEDITOR.dom.element('span');
			appendPxObj.setHtml(appendPx);

			var infoColElems = infoCol.getChildren(),
				infoColLen = infoColElems.count();
			// delete all but first elements in the "infoCol" element
			if (infoColLen > 1){
				for(i=infoColLen-1; i > 0; i--){
					infoColElems.getItem(i).remove();
				}
			}

			infoCol.append(appendPxObj);

			// input fields for resizing
			var inputFields = hiddenDiv.getElementsByTag('input'),
				len = inputFields.count();
			// remove the items starting from the end.
			for (i = len-1; i >= 0; i--){
				inputFields.getItem(i).remove();
			}

			for (i = 0; i < profile.length; i++){
				colField = new CKEDITOR.dom.element('input');
				colField.setAttribute('type', 'text');
				colField.setAttribute('id', 'colField' + i);
				colField.setValue(profile[i]);
				colField.setAttribute('class', 'cke_dialog_ui_input_text');
				colField.setStyle('width', '3em');
				colField.setStyle('text-align', 'center');
				hiddenDiv.append(colField);
			}
		},

		onOk: function () {
			console.log('this part is yet to be done');
		}
	};
});