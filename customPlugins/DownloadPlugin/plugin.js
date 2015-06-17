/*jslint plusplus: true, white: true */
/*global CKEDITOR */

/**
 * A customized CKEDITOR plugin to download editor content.
 * @module    CKEditorPlugins
 * @class     Download
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('DownloadPlugin', {

	// Register the icons.
	icons: 'DownloadPlugin',

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
		editor.addCommand(_pluginName + 'Dialog', new CKEDITOR.dialogCommand('DownloadPluginDialog'));


		// Create a toolbar button that executes the above command.
		editor.ui.addButton(_pluginName, {

			// The text part of the button (if available) and tooptip.
			label: editor.lang[_pluginName].label,

			// The command to execute on click.
			command: _pluginName + 'Dialog',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'save'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + 'dialogs/download.js');
	},

	onLoad: function(){
		var translations = {
			it: {
				label:  'Scaricare la newsletter',
			},
			en: {
				label:  'Download the newsletter',
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
