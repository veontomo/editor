/*jslint plusplus: true, white: true */
/*global CKEDITOR */

/**
 * A customized CKEDITOR plugin to download editor content.
 * @module    CKEditorPlugins
 * @class     Download
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('download', {

	// Register the icons.
	icons: 'download',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {

		// Define an editor command that opens our dialog.
		editor.addCommand('download', new CKEDITOR.dialogCommand('downloadDialog'));


		// Create a toolbar button that executes the above command.
		editor.ui.addButton('Download', {

			// The text part of the button (if available) and tooptip.
			label: 'Scaricare newsletter',

			// The command to execute on click.
			command: 'download',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('downloadDialog', this.path + 'dialogs/download.js');



	}
});
