/*jslint plusplus: true, white: true */
/*global CKEDITOR, CList, Document, NEWSLETTER */

/**
 * A customized CKEDITOR plugin to manage operations on ordered list.
 * @module    CKEditorPlugins
 * @class     Olist2
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('olist2', {

	// Register the icons.
	icons: 'olist2',

	/**
	 * The plugin initialization logic goes inside this method.
	 * @method  init
	 * @param   {Object}     editor
	 * @return  {void}
	 */
	init: function(editor) {

		/**
		 * Instance of {{#crossLink "CList"}}CList{{/crossLink}}
		 * @property  {CList}     _controller
		 * @type      {CList}
		 * @private
		 */
		var _controller = new CList();
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);
		(function(){
		    var worker = new Document();
		    worker.setFactory(NEWSLETTER.factory);
		    _controller.setWorker(worker);
		}());

		/**
		 * Object containing elements on which context menu options have been triggered.
		 * @private
		 * @property   {Object}        _target
		 * @since      0.2.5
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


		// Define an editor command that opens our dialog.
		editor.addCommand(_pluginName + 'Modify', {
			exec: function(editor){
				if (_target.host){
					_controller.changeListType(editor, _target.host, 'ul');
				}

			}
		});

		editor.addCommand(_pluginName + 'Create', {
			exec: function(editor){
				_controller.insertLists(editor, 'ol');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(_pluginName, {
			// The text part of the button (if available) and tooptip.
			label: editor.lang[_pluginName].title,
			// The command to execute on click.
			command: _pluginName + 'Create',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);
			editor.addMenuItem(_pluginName + 'Modify', {
				label: editor.lang[_pluginName].switch,
				icon: this.path + 'icons/convertList.png',
				command: _pluginName + 'Modify',
				group: _pluginNameGroup
			});
			editor.contextMenu.addListener(function(element) {
				var el = _controller.findListAncestorOfType(element, 'ol');
				var menuObj = {};
				console.log(el);
				if (el) {
					_target.host = el;
					menuObj[_pluginName + 'Modify'] = CKEDITOR.TRISTATE_OFF;
					return menuObj;
				}
			});
		}
	},

	onLoad: function(){
		var translations = {
			it: {
				switch: 'Convertire in elenco puntato',
				title:  'Elenco numerato'
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

