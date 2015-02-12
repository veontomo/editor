/*jslint plusplus: true, white: true */
/*global CKEDITOR*/


// Fictitious menu dialog that embraces "link" and "mail" menu dialogs.
// It is introduced in order to have all translations in one place.

CKEDITOR.plugins.add('LinkMailPlugin', {
	// The plugin initialization logic goes inside this method.
	init: function() {return;},

	onLoad: function(){
		var translations = {
			it: {
				colordialog:   'Colore',
				link:          'Url',
				linkTextTitle: 'il testo di collegamento',
				linkTitle:     'Dati collegamento',
				mail:          'E-mail',
				mailTextTitle: 'testo che contiene l\'email',
				mailTitle:     'Dati indirizzo email',
				modify:        'Modificare collegamento',
				styleTitle:    'Stile',
				targetNew:     'Apri in una nuova scheda',
				text:          'Testo',
				title:         'Titolo',
				titleTitle:    'testo che appare quando il cursore va sopra',
				underline:     'Sottolineato',
			},
			en: {
				colordialog:   'Color',
				link:          'Url',
				linkTextTitle: 'text of the link',
				linkTitle:     'Link information',
				mail:          'E-mail',
				mailTextTitle: 'text containing e-mail link',
				mailTitle:     'Email address data',
				modify:        'Modify link',
				styleTitle:    'Style',
				targetNew:     'Open in new tab',
				text:          'Text',
				title:         'Title',
				titleTitle:    'popup text',
				underline:     'Underlined',
			}
		};

		var lang;
		for (lang in translations){
			if (translations.hasOwnProperty(lang)){
				CKEDITOR.plugins.setLang(this.name, lang, translations[lang]);
			}
		}

	}
});

