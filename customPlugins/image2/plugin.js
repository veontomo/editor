/*jslint plusplus: true, white: true */
/*global CKEDITOR */


var pluginName = 'image2';
// Register the plugin within the editor.
CKEDITOR.plugins.add(pluginName, {
	// Register the icons.
	icons: pluginName,

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand(pluginName, new CKEDITOR.dialogCommand('imageSimplified'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton(pluginName, {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.common.image,
			// The command to execute on click.
			command: pluginName,
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		editor.addCommand('image2Cancel', {
			exec: function(editor){
				console.log('image cancel');
				var startElem = editor.getSelection().getStartElement(),
					elem = startElem.getAscendant('img', true);
				elem.$.remove();
			}
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('imageSimplified', this.path + 'dialogs/image2.js');

		if (editor.contextMenu) {
			editor.addMenuGroup('image2Group');

			editor.addMenuItem('image2Edit', {
				label: editor.lang.image.title,
				icon: this.path + 'icons/image2edit.png',
				command: pluginName,
				group: 'image2Group'
			});
			editor.addMenuItem('image2Cancel', {
				label: editor.lang[pluginName].drop, //'Eliminare immagine',
				icon: this.path + 'icons/image2cancel.png',
				command: 'image2Cancel',
				group: 'image2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('img', true)) {
					return {
						image2Edit: CKEDITOR.TRISTATE_OFF,
						image2Cancel: CKEDITOR.TRISTATE_OFF,
					};
				}
			});
		}

	}
});

var translations = {
	it: {
		drop: 'Eliminare immagine'
	},
	en: {
		drop: 'Drop image'
	}
};

var lang;
for (lang in translations){
	CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
}

