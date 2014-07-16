/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('setScale2', {

	// Register the icons.
	icons: 'setScale2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {

		editor.addCommand('setScale2', new CKEDITOR.dialogCommand('setScale2'));
		CKEDITOR.dialog.add('setScale2', this.path + 'dialogs/setScale2.js');

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('setScale2', {
			// The text part of the button (if available) and tooptip.
			label: 're-imposta larghezza',
			// The command to execute on click.
			command: 'setScale2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});
	}
});