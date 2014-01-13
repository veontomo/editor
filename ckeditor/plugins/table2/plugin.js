/*global CKEDITOR, location
 */

/**
 * Drops the table row. If after that the table remains empty, removes it as well.
 */
var dropRow = function (ed) {
		var row = $(ed.getSelection().getStartElement().$).closest('tr[data-marker=row]'),
			parentTable = row.closest('table'),
			tableLength;
		if (row) {
			row.remove();
			// calculating the number of children of the table after removing the row
			tableLength = parentTable.find('tbody').children().length;
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
			// tag to replicate
			currentRow = ed.getSelection().getStartElement().getAscendant(tag, true),
			newElement = new CKEDITOR.dom.element(tag),
			operation = 'insert' + firstLetterUpperCase(pos),
			currentChildren = currentRow.getChildren(),
			childNum = currentChildren.count(),
			i, child, newChild;

		if (newElement[operation] !== undefined) {
			newElement[operation](currentRow);
		} else {
			console.log('no ' + operation + ' in newElement');
			return null;
		}

		currentRow.copyAttributes(newElement);
		for (i = 0; i < childNum; i++) {
			child = currentChildren.getItem(i);
			newChild = new CKEDITOR.dom.element(child.getName());
			newChild.setHtml('&curren;');
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
				console.log("!!!remove table!");
				var table = $(ed.getSelection().getStartElement().$).closest('table[data-marker=table]');
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
			editor.addMenuItem('table2DeleteTable', {
				label: editor.lang.table.deleteTable,
				icon: this.path + 'icons/deleteTable.png',
				command: 'table2DeleteTable',
				group: 'table2Group'
			});


			editor.contextMenu.addListener(function (element) {
				var el = $(element.$).closest('tr[data-marker=row]');
				if (el) {
					return {
						table2AddRowBefore: CKEDITOR.TRISTATE_OFF,
						table2AddRowAfter: CKEDITOR.TRISTATE_OFF,
						table2DeleteRow: CKEDITOR.TRISTATE_OFF,
					};
				}
			});

			editor.contextMenu.addListener(function (element) {
				var el = $(element.$).closest('table[data-marker=table]');
				if (el) {
					return {
						table2DeleteTable: CKEDITOR.TRISTATE_OFF
					}
				}
			});


		}

	}
});