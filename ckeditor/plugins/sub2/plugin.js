//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('sub2', {

	// Register the icons.
	icons: 'sub2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('sub2', {
			exec: function(editor){
				console.log('inside sub2 plugin');
				var	selection = new Selection(editor);
				selection.propagateStyle('font-weight', 'bold');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('sub2', {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.bold,
			// The command to execute on click.
			command: 'sub2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2'
		});

	}
});