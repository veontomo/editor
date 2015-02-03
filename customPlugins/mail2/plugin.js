/*jslint plusplus: true, white: true */
/*global CKEDITOR*/
/**
 * A customized CKEDITOR plugin to deal with operations on "mailto" insertions.
 * @module    CKEditorPlugins
 * @class     Mail2
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('mail2', {

	// Register the icons.
	icons: 'mail2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {

		// Define an editor command that opens our dialog.
		editor.addCommand('mail2', new CKEDITOR.dialogCommand('mailDialog'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('mail2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.link.emailAddress,
			// The command to execute on click.
			command: 'mail2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		// CKEDITOR.dialog.add('mailDialog', this.path + 'dialogs/mail2.js');
		var path = this.path.split('/'), a;
		// repeat until a non-empty element is popped
		do {
			a = path.pop();
		}
		while (!a && path.length > 0);
		path = path.join('/') + '/linkMail/linkMailDialog.js';
		CKEDITOR.dialog.add('mailDialog', path);


	}
});