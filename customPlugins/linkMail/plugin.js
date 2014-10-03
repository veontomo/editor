/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */
// Register the plugin within the editor.
CKEDITOR.plugins.add('linkMail', {

	// Register the icons.
	icons: '',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {}
});

var pluginName = 'linkMail';
var translations = {
	it: {
		targetNew:     'Aprire in una nuova scheda',
		underline:     'Sottolineare',
		styleTitle:    'Stile',
		colordialog:   'Colore',
		title:         'Titolo',
		text:          'Testo',
		email:         'E-mail'
	},
	en: {
		targetNew:     'Open in new tab',
		underline:     'Underline',
		styleTitle:    'Style',
		colordialog:   'Color',
		title:         'Title',
		text:          'Text',
		email:         'E-mail'
	}
};

var lang;
for (lang in translations){
	CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
}
