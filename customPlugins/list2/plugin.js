/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */


// Fictitious menu dialog that embraces "link" and "mail" menu dialogs.
// It is introduced in order to have all translations in one place.

CKEDITOR.plugins.add('list2', {
	// The plugin initialization logic goes inside this method.
	init: function(editor) {}
});

var pluginName = 'list2';
var translations = {
	it: {
		targetNew:     'Apri in una nuova scheda',
		underline:     'Sottolineato',
		styleTitle:    'Stile',
		colordialog:   'Colore',
		title:         'Titolo',
		text:          'Testo',
		mail:          'E-mail',
		link:          'Url',
		mailTitle:     'Dati indirizzo email',
		linkTitle:     'Dati collegamento',
		mailTextTitle: 'testo che contiene l\'email',
		linkTextTitle: 'il testo di collegamento',
		titleTitle:    'testo che appare quando il cursore va sopra',

	},
	en: {
		targetNew:     'Open in new tab',
		underline:     'Underlined',
		styleTitle:    'Style',
		colordialog:   'Color',
		title:         'Title',
		text:          'Text',
		mail:          'E-mail',
		link:          'Url',
		mailTitle:     'Email address data',
		linkTitle:     'Link information',
		mailTextTitle: 'text containing e-mail link',
		linkTextTitle: 'text of the link',
		titleTitle:    'popup text'

	}
};

var lang;
for (lang in translations){
	if (translations.hasOwnProperty(lang)){
		CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
	}
}
