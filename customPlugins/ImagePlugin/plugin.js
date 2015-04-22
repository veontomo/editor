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
CKEDITOR.plugins.add('ImagePlugin', {
	// Register the icons.
	icons: 'ImagePlugin',

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

		// opens image dialog when a user clicks on a corresponding toolbar icon
		editor.addCommand(_pluginName + 'Dialog', new CKEDITOR.dialogCommand(_pluginName + 'Dialog'));

		editor.addCommand(_pluginName + 'Modify', {
			exec: function(e){
				e.openDialog(_pluginName + 'Dialog', function(dialog){
					if (_target.image){
						// wait until the dialog gets loaded completely
						// otherwise, an error occurs because the editor can already be
						// aware of the UI input elements, but they might not be present
						// in DOM so far
						dialog.once('show', function(){
							_controller.fillInDialogWithElement(dialog, _target.image);
							_controller.saveExtra(dialog, _target.image);
							_target.image = undefined;

						});
					}
				});
			}
		});


		// Create a toolbar button that executes the above command.
		editor.ui.addButton(_pluginName, {
			label: editor.lang.ImagePlugin.descr,
			command: _pluginName + 'Dialog',
			toolbar: 'document'
		});
		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + 'dialogs/image2.js');



		editor.addCommand(_pluginName + 'Delete', {
			exec: function(editor){
				if (_target.image){
					_controller.removeNode(editor, _target.image);
				}
				_target.image = null;
			}
		});


		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);
			editor.addMenuItem(_pluginName + 'Modify', {
				label: editor.lang.ImagePlugin.title,
				icon: this.path + 'icons/image2edit.png',
				command: _pluginName + 'Modify',
				group: _pluginNameGroup
			});
			editor.addMenuItem(_pluginName + 'Delete', {
				label: editor.lang.ImagePlugin.deleteImg,
				icon: this.path + 'icons/image2cancel.png',
				command: _pluginName + 'Delete',
				group: _pluginNameGroup
			});
			editor.contextMenu.addListener(function(element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.image = el;
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
				alternativeAndTitle: 'Titolo e testo alternativo',
				deleteImg: 'Eliminare immagine',
				descr: 'Inserire nuova immagine',
				generalInfo: 'Informazione generale',
				invalidUrl: 'URL non valido',
				title: 'Proprietà immagine',
			},
			en: {
				alternativeAndTitle: 'Title and alternative text',
				deleteImg: 'Delete image',
				descr: 'Insert new image',
				generalInfo: 'General information',
				invalidUrl: 'Invalid URL',
				title: 'Image property',
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

