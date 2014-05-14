/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKHelper, CKEDITOR */

// Register the plugin within the editor.
CKEDITOR.plugins.add('olist2', {

	// Register the icons.
	icons: 'olist2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('olist2Dialog', {
			exec: function(editor){
 				var startElem = editor.getSelection().getStartElement(),
					list = startElem.getAscendant('ol', true);
				CKHelper.changeListType(editor, list, 'ul');
			}
		});
		editor.addCommand('olist2', {
			exec: function(editor){
				CKHelper.insertList(editor, 'ol');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('olist2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.list.numberedlist,
			// The command to execute on click.
			command: 'olist2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});


		if (editor.contextMenu) {
			editor.addMenuGroup('list2Group');
			editor.addMenuItem('olist2Dialog', {
				label: 'convertire in elenco puntato',
				icon: this.path + 'icons/convertList.png',
				command: 'olist2Dialog',
				group: 'list2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('ol', true)) {
					return {
						olist2Dialog: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}
	}
});