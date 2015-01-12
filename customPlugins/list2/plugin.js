/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */



CKEDITOR.plugins.add('list2', {
	// The plugin initialization logic goes inside this method.
	init: function(){}
});

var pluginName = 'list2';
var translations = {
	it: {
		ol : {
			switch: 'convertire in elenco puntato',
			title: 'elenco numerato'
		},
		ul: {
			switch: 'convertire in elenco numerato',
			title: 'elenco punato'
		},
	},
	en: {
		ol : {
			switch: 'convert into unordered list',
			title: 'numbered list'
		},
		ul: {
			switch: 'convert into numbered list',
			title: 'unordered list'
		},
	}
};

var lang;
for (lang in translations){
	if (translations.hasOwnProperty(lang)){
		CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
	}
}


