/*jslint plusplus: true, white: true */
/*global CKEDITOR */

// Register the plugin within the editor.
CKEDITOR.plugins.add('image2', {
	// Register the icons.
	icons: 'image2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		/**
		 * Instance of {{#crossLink "CImage"}}CImage{{/crossLink}}
		 * @property  {CImage}     _controller
		 * @type      {CImage}
		 * @private
		 */
		var _controller = new CImage();
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);
		(function(){
		    var worker = new Document();
		    worker.setFactory(NEWSLETTER.factory);
		    _controller.setWorker(worker);
		}());
		// Define an editor command that opens our dialog.
		editor.addCommand('image2', new CKEDITOR.dialogCommand('imageSimplified'));
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('image2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.common.image,
			// The command to execute on click.
			command: 'image2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		editor.addCommand('image2Cancel', {
			exec: function(editor){
				_controller.removeImage(editor);
			}
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add('imageSimplified', this.path + 'dialogs/image2.js');

		if (editor.contextMenu) {
			editor.addMenuGroup('image2Group');
			editor.addMenuItem('image2Edit', {
				label: editor.lang.image2.title,
				icon: this.path + 'icons/image2edit.png',
				command: 'image2',
				group: 'image2Group'
			});
			editor.addMenuItem('image2Cancel', {
				label: editor.lang.image2.drop,
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


var pluginName = 'image2';
var translations = {
	it: {
		alternativeAndTitle: 'Titolo e testo alternativo',
		title: 'Proprietà immagine',
		drop: 'Eliminare immagine'
	},
	en: {
		alternativeAndTitle: 'Title and alternative text',
		title: 'Image property',
		drop: 'Drop image'
	}
};

var lang;
for (lang in translations){
	if (translations.hasOwnProperty(lang)){
		CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
	}

}

