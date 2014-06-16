//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('underline2', {

	// Register the icons.
	icons: 'underline2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('underline2', {
			exec: function(editor){
				console.log('inside underline2 plugin');
				var	selection = new Selection(editor);
				selection.propagateStyle('text-decoration', 'underline');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('underline2', {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.underline,
			// The command to execute on click.
			command: 'underline2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2'
		});

	}
});