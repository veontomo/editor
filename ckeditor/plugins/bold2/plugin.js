//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('bold2', {

	// Register the icons.
	icons: 'bold2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('bold2', {
			exec: function(editor){
				var	selection = new Selection(editor);
				selection.propagateStyle('font-weight', 'bold');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('bold2', {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.bold,
			// The command to execute on click.
			command: 'bold2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2'
		});

	}
});