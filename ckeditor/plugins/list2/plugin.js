/**
 * Basic sample plugin inserting abbreviation elements into CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Register the plugin within the editor.
CKEDITOR.plugins.add('list2', {

	// Register the icons.
	icons: 'list2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('list2Dialog', new CKEDITOR.dialogCommand('list2Dialog'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('List2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.list.numberedlist,
			// The command to execute on click.
			command: 'list2Dialog',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('list2Dialog', this.path + 'dialogs/list2.js');

		if (editor.contextMenu) {
			console.log('context menu in list2 is called');
			editor.addMenuGroup('list2Group');
			editor.addMenuItem('list2Item', {
				label: editor.lang.list.numberedlist,
				icon: this.path + 'icons/numberedList.png',
				command: 'list2Dialog',
				group: 'list2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('ol', true)) {
					return {
						list2Item: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

	}
});