/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('ulist2', {

	// Register the icons.
	icons: 'ulist2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		editor.addCommand('ulist2', {
			exec: function(editor){
				CKHelper.insertList(editor, 'ul');
			}
		});
		editor.addCommand('ulist2Dialog', {
			exec: function(editor){
				var startElem = editor.getSelection().getStartElement(),
					list = startElem.getAscendant('ul', true);
				CKHelper.changeListType(editor, list, 'ol');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('Ulist2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.list.bulletedlist,
			// The command to execute on click.
			command: 'ulist2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});


		if (editor.contextMenu) {
			editor.addMenuGroup('list2Group');
			editor.addMenuItem('ulist2Dialog', {
				label: 'convertire in elenco numerato', //editor.lang.list.bulletedlist,
				icon: this.path + 'icons/convertList.png',
				command: 'ulist2Dialog',
				group: 'list2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('ul', true)) {
					return {
						ulist2Dialog: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

	}
});