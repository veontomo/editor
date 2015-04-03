/*jslint plusplus: true, white: true */
/*global CKEDITOR, CImage, NEWSLETTER, Document */
/**
 * A customized CKEDITOR plugin to manage image operations.
 * @module    CKEditorPlugins
 * @class     Image2
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('image2', {
	// Register the icons.
	icons: 'image2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
				/**
		 * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
		 * @property  {CLink}     _controller
		 * @type      {CLink}
		 * @private
		 */
		var _controller = new CImage();
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);
		/**
		 * A class that performs operations with editor window content.
		 * @property {Document} worker
		 * @type     {Document}
		 * @since    0.2.0
		 * @private
		 */
		var worker = new Document();
		worker.setFactory(NEWSLETTER.factory);
		_controller.setWorker(worker);

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
			editor.addMenuItem(_pluginName + 'Modify', {
				label: editor.lang.image2.title,
				icon: this.path + 'icons/image2edit.png',
				command: 'image2',
				group: 'image2Group'
			});
			editor.addMenuItem(_pluginName + 'Delete', {
				label: editor.lang.image2.drop,
				icon: this.path + 'icons/image2cancel.png',
				command: 'image2Cancel',
				group: 'image2Group'
			});
			editor.contextMenu.addListener(function(element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostLink = el;
					menuObj[_pluginName + 'Modify'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'Delete'] = CKEDITOR.TRISTATE_OFF;
					return menuObj;
				}
			});
		}
	},
	onLoad: function(){
		var translations = {
			it: {
				generalInfo: 'Informazione generale',
				alternativeAndTitle: 'Titolo e testo alternativo',
				title: 'Proprietà immagine',
				delete: 'Eliminare immagine',
				invalidUrl: 'URL non valido'
			},
			en: {
				generalInfo: 'General information',
				alternativeAndTitle: 'Title and alternative text',
				title: 'Image property',
				delete: 'Delete image',
				invalidUrl: 'Invalid URL'
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

