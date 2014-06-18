//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('italic2', {

	// Register the icons.
	icons: 'italic2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('italic2', {
			exec: function(editor){
				console.log('inside bold2 plugin');
				var	selection = new Selection(editor);
				selection.propagateStyle('font-style', 'italic', 'normal');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('italic2', {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.italic,
			// The command to execute on click.
			command: 'italic2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2'
		});

	}
});