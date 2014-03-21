/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, List, ListItem*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('selection', {

	// Register the icons.
	icons: 'olist2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('selection', {
			exec: function(editor){
				console.log('inside Selection plugin');
				var selected = editor.getSelection(),
					selection = new Selection(editor, selected);
				console.log(selection.getNodes());
				// CKHelper.insertList(editor, 'ol');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('selection', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.list.numberedlist,
			// The command to execute on click.
			command: 'selection',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

	}
});