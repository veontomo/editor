CKEDITOR.plugins.add('upload', {

	// Register the icons.
	icons: 'upload',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('uploadDialog', new CKEDITOR.dialogCommand('uploadDialog'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('Upload', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.common.upload,
			// The command to execute on click.
			command: 'uploadDialog',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('uploadDialog', this.path + 'dialogs/upload.js');


	}
});