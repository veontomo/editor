/*jslint plusplus: true, white: true */
/*global CKEDITOR*/

/**
 * A customized CKEDITOR plugin to load content into the editor window from external source.
 * @module    CKEditorPlugins
 * @class     Upload
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('UploadPlugin', {

	// Register the icons.
	icons: 'UploadPlugin',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		/**
		 * Plugin name.
		 * @type       {String}
		 * @property   {String}        _pluginName
		 * @since      0.2.8
		 * @private
		 */
		var _pluginName = this.name;

		// Define an editor command that opens our dialog.
		editor.addCommand(_pluginName + 'Dialog', {
			exec: function(e){
				e.openDialog(_pluginName + 'Dialog', function(dialog){
					dialog.once('show', function(){
					});
				});
			}

		});
		// Create a toolbar button that executes the above command.
		editor.ui.addButton(_pluginName, {
			// The text part of the button (if available) and tooptip.
			label: editor.lang[_pluginName].label,
			// The command to execute on click.
			command: _pluginName + 'Dialog',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'save'
		});

		// Register dialog corresponding to table creation and table modification.
		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + 'dialogs/upload.js');


	},

	onLoad: function(){
		var translations = {
			it: {
				label:  'Caricare file nell\'editor',
				title:  'Scegliere il file '
			},
			en: {
				label:  'Load a file into the editor',
				title:  'Choose the file'
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