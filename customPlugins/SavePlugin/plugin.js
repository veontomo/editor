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
CKEDITOR.plugins.add('SavePlugin', {
	/**
	 * Register plugin icons.
	 * @property       {String} icons
	 * @since          0.0.5
	 */
	icons: 'SavePlugin',

	/**
	 * Plugin initializer.
	 * @method         init
	 * @param          {CKEditor}      editor
	 * @return         {void}
	 * @since          0.0.5
	 */
	init: function(editor) {
		/**
		 * Instance of {{#crossLink "CTable"}}CTable{{/crossLink}}
		 * @property   {CTable}        _controller
		 * @type       {CTable}
		 * @private
		 */
		var _controller = new CFile();
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);
		/**
		 * A class that performs operations with editor window content.
		 * @property   {Document}     _worker
		 * @type       {Document}
		 * @since      0.2.0
		 * @private
		 */
		var _worker = new Document();
		_worker.setFactory(NEWSLETTER.factory);
		_controller.setWorker(_worker);


		/**
		 * Object containing elements on which context menu options have been triggered.
		 * @private
		 * @property   {Object}        _target
		 * @since      0.2.0
		 */
		var _target = {};

		/**
		 * Plugin name.
		 * @type       {String}
		 * @property   {String}        _pluginName
		 * @since      0.2.0
		 * @private
		 */
		var _pluginName = this.name;

		/**
		 * Name of the group to embrace the plugin functionality.
		 * @type       {String}
		 * @property   {String}        _pluginNameGroup
		 * @since      0.2.0
		 * @private
		 */
		 var _pluginNameGroup = _pluginName + 'Group';

		 // Register dialog corresponding to table creation and table modification.
		 CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + 'dialogs/save.js');

		// Define an editor command that opens our dialog.
		editor.addCommand(_pluginName + 'Dialog', {
			exec: function(e){
				e.openDialog(_pluginName + 'Dialog', function(dialog){
					dialog.once('show', function(){
						_controller.fillInDialogWithSelection(dialog, e);
						if (!_controller.isSelectionEditable(_controller.getEditorSelection(e))){
							_controller.disableField(dialog, {'linkInfoTab': 'content'});
						}
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
			toolbar: 'document'
		});
	},


	onLoad: function(){
		var translations = {
			it: {
				label:    'Salvare contenuto grezzo',
				title:    'Salvare contenuto',
				name:     'Salvare con nome',
				fileName: 'Nome di file',
				fileNameDescr: 'Inserire il nome del file. Altrimenti il nome viene generato automaticamente.',
			},
			en: {
				label:    'Save raw content',
				title:    'Save content',
				name:     'Save with name',
				fileName: 'File name',
				fileNameDescr: 'Insert file name otherwise an it will be generated automatically.',
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



