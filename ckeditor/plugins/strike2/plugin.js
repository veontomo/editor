//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('strike2', {

	// Register the icons.
	icons: 'strike2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('strike2', {
			exec: function(editor){
				var	selection = new Selection(editor);
				selection.propagateStyle('text-decoration', 'line-through');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('strike2', {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.strike,
			// The command to execute on click.
			command: 'strike2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2'
		});

	}
});