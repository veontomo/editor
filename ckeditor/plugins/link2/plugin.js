// Register the plugin within the editor.
CKEDITOR.plugins.add('link2', {

	// Register the icons.
	icons: 'link2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {

		// Define an editor command that opens our dialog.
		editor.addCommand('link2', new CKEDITOR.dialogCommand('linkSimplified'));
		editor.addCommand('modifyLink', new CKEDITOR.dialogCommand('modifyLinkSimplified'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('link2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.link.title,
			// The command to execute on click.
			command: 'link2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('linkSimplified', this.path + 'dialogs/link2.js');
		CKEDITOR.dialog.add('modifyLinkSimplified', this.path + 'dialogs/modifyLinkSimplified.js');

		if (editor.contextMenu) {
			editor.addMenuGroup('link2Group');

			editor.addMenuItem('link2Item', {
				label: editor.lang.link.menu,
				icon: this.path + 'icons/link2.png',
				command: 'modifyLink',
				group: 'link2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('a', true)) {
					return {
						link2Item: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

	}
});