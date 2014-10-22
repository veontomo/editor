/*jslint plusplus: true, white: true */
/*global CKEDITOR*/

/**
 * Plugin to save the editor window content.
 * @module    Plugins
 * @class     Save
 * @type      {Object}
 * @since     0.0.7
 * @author    A.Shcherbakov
 */
(function(){
	/**
	 * Plugin name. A string under which the plugin is registered in the editor.
	 * @property    _pluginName
	 * @private
	 * @type        {String}
	 */
	var _pluginName = 'save2';

	/**
	 * Internationalization of strings used by the plugin.
	 * @property    _translations
	 * @private
	 * @type        {Object}
	 */
	var _translations = {
		it: {
			label:    'Salvare contenuto grezzo',
			title:    'Salvare contenuto',
			name:     'Salvare con nome',
			description: 'Inserire il nome del file. Altrimenti il nome viene generato automaticamente.',
			popup:     'Inserire suggerimento per il nome del file',
		},
		en: {
			label:    'Save raw content',
			title:    'Save content',
			name:     'Sava with name',
			description: 'Insert file name otherwise an it will be generated automatically.',
			popup:     'Insert a suggestion to be used as the file name',
		}
	};


	/**
	 * Commands that configure the plugin, namely:
	 * <ol><li>
	 * register the plugin: adds icon, command and dialog.
	 * </li><li>
	 * add translations defined in {{#crossLink "Save/_translations:property"}}_translations{{/crossLink}}.
	 * </li></ol>
	 * <b>NB</b>: name "constructor" used in the documentation does not correspond to a real called "constructor" but rather
	 * to a set of commands used to configure the plugin.
	 * @method  constructor
	 * @return {void}
	 */
	CKEDITOR.plugins.add(_pluginName, {
		// Register the icon. Icon file name coincides with the plugin name.
		icons: _pluginName,
		// The plugin initialization logic goes inside this method.
		init: function(editor) {
			// Define an editor command that opens our dialog.
			editor.addCommand(_pluginName, new CKEDITOR.dialogCommand('saveDialog'));
			// Create a toolbar button that executes the above command.
			editor.ui.addButton('Save2', {
				// The text part of the button (if available) and tooptip.
				label: editor.lang[_pluginName].label,
				// The command to execute on click.
				command: _pluginName,
				// The button placement in the toolbar (toolbar group name).
				toolbar: 'document'
			});
			// Register our dialog file. this.path is the plugin folder path.
			CKEDITOR.dialog.add('saveDialog', this.path + 'dialogs/save.js');

		}
	});


	var lang;
	for (lang in _translations){
		if (_translations.hasOwnProperty(lang)){
			CKEDITOR.plugins.setLang(_pluginName, lang, _translations[lang]);
		}

	}
}());



