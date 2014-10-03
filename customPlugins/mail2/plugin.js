/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */
// Register the plugin within the editor.
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
		CKEDITOR.dialog.add('mailDialog', this.path + 'dialogs/mail2.js');


	}
});

var pluginName = 'mail2';
var translations = {
	it: {
		targetNew:     'Aprire il collegamento in una nuova scheda',
		underline:     'Sottolineare il collegamento',
		styleTitle:    'Stile del collegamento',
		colordialog:   'Colore di collegamento',
		title:         'Titolo',
		text:          'Testo',
		email:         'E-mail'
	},
	en: {
		targetNew:     'Open the link in new tab',
		underline:     'Underline the link',
		styleTitle:    'Link style',
		colordialog:   'Link color',
		title:         'Title',
		text:          'Text',
		email:         'E-mail'
	}
};

var lang;
for (lang in translations){
	CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
}