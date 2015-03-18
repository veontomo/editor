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
				content: 'Contenuto',
				contentDescr: 'Il contenuto da linkare',

				color:        'Color',
				inavlid:       'Indirizzo non valido',
				// link:          'Indirizzo url',
				linkTextTitle: 'il testo di collegamento',
				linkTitle:     'Dati collegamento',
				// mail:          'E-mail',
				mailTextTitle: 'testo che contiene l\'email',
				mailTitle:     'Dati indirizzo email',
				modify:        'Modificare collegamento',
				styleTitle:    'Stile',
				target:        'Aprire in scheda nuova',
				targetDescr:   'Impostare che il link si apri in una nuova scheda',
				text:          'Testo',
				title:         'Titolo',
				titleDescr:    'testo che appare quando utente passa sopra l\'elemento',
				underline:     'Sottolineato',
				underlineDescr:'Spunta la casella per sottolineare il contenuto',
				mail: {
					content: 'Contenuto',
					contentDescr: 'Il contenuto da linkare',
					title:   'Informazioni collegamento',
					url:     'Indirizzo',
					urlDescr: 'Indirizzo e-mail',
				},
				link: {
					title:   'Informazioni e-mail',
					url:     'Url',
					urlDescr: 'Link',

				}
			},
			en: {
				content:      'Content',
				contentDescr: 'The content that is supposed to be linked',
				color:        'Color',
				invalid:       'Invalid URL',
				// link:          'Url',
				linkTextTitle: 'text of the link',
				linkTitle:     'Link information',
				// mail:          'E-mail',
				mailTextTitle: 'text containing e-mail link',
				mailTitle:     'Email address data',
				modify:        'Modify link',
				styleTitle:    'Style',
				target:        'Open in a new tab',
				targetDescr:   'Open the link in new tab',
				text:          'Text',
				title:         'Title',
				titleDescr:    'popup text',
				underline:     'Underlined',
				underlineDescr:'Check this box for the content to be underlined',
				mail: {

					title:        'E-mail property',
				},
				link: {
					title:        'Link property',

				}

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

