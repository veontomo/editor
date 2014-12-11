/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */
// Register the plugin within the editor.
CKEDITOR.plugins.add('link2', {

	// Register the icons.
	icons: 'link2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('link2', new CKEDITOR.dialogCommand('linkDialog'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('link2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.link.title,
			// The command to execute on click.
			command: 'link2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document',
		});
		editor.addCommand('link2unlink', {
			exec: function(editor){
				var startElem = editor.getSelection().getStartElement(),
					link = startElem.getAscendant('a', true);
				CKHelper.unlink(editor, link);
			}
		});
		editor.addCommand('link2modify', {
			exec: function(editor){
				var startElem = editor.getSelection().getStartElement(),
					link = startElem.getAscendant('a', true);
				// CKHelper.modifyLink(editor, link);
			}
		});

		// Register our dialog file. this.path is the plugin folder path.
		var path = this.path.split('/'), a;
		// repeat until a non-empty element is popped
		do {
			a = path.pop();
		}
		while (!a && path.length > 0);
		path = path.join('/') + '/linkMail/linkMailDialog.js';
		CKEDITOR.dialog.add('linkDialog', path);

		if (editor.contextMenu) {
			editor.addMenuGroup('link2Group');

			editor.addMenuItem('link2Item', {
				label: editor.lang.link.menu,
				icon: this.path + 'icons/link2.png',
				command: 'link2',
				group: 'link2Group'
			});
			editor.addMenuItem('link2ItemUnlink', {
				label: editor.lang.link.unlink,
				icon: this.path + 'icons/unlink2.png',
				command: 'link2unlink',
				group: 'link2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('a', true)) {
					return {
						link2Item: CKEDITOR.TRISTATE_OFF,
						link2ItemUnlink: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

	}
});
