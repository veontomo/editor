/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */
// Register the plugin within the editor.
CKEDITOR.plugins.add('mail2', {

	// Register the icons.
	icons: 'mail2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {

		// Define an editor command that opens our dialog.
		editor.addCommand('mail2', new CKEDITOR.dialogCommand('linkSimplified'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('mail2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.link.title,
			// The command to execute on click.
			command: 'mail2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});



		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('linkSimplified', this.path + 'dialogs/mail2.js');

		if (editor.contextMenu) {
			editor.addMenuGroup('link2Group');

			editor.addMenuItem('link2Item', {
				label: editor.lang.link.menu,
				icon: this.path + 'icons/mail2.png',
				command: 'mail2',
				group: 'link2Group'
			});
			editor.addMenuItem('link2ItemUnlink', {
				label: editor.lang.link.unlink,
				icon: this.path + 'icons/unlink2.png',
				command: 'link2unlink',
				group: 'link2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('a', true)) {
					return {
						link2Item: CKEDITOR.TRISTATE_OFF,
						link2ItemUnlink: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

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
		text:          'Testo'
	},
	en: {
		targetNew:     'Open the link in new tab',
		underline:     'Underline the link',
		styleTitle:    'Link style',
		colordialog:   'Link color',
		title:         'Title',
		text:          'Text'
	}
};

var lang;
for (lang in translations){
	CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
}