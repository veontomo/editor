/**
 * Basic sample plugin inserting abbreviation elements into CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Register the plugin within the editor.
CKEDITOR.plugins.add('table2', {

	// Register the icons.
	icons: 'table2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('table2Dialog', new CKEDITOR.dialogCommand('table2Dialog'));
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
			console.log('context menu in table2 is called');
			editor.addMenuGroup('table2Group');
			editor.addMenuItem('table2Item', {
				label: editor.lang.table.toolbar,
				icon: this.path + 'icons/table2.png',
				command: 'table2Dialog',
				group: 'table2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('table', true)) {
					return {
						table2Item: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

	}
});