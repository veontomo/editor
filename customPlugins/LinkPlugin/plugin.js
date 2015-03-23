/*jslint plusplus: true, white: true */
/*global CKEDITOR, CLink, NEWSLETTER, Document*/

/**
 * A customized CKEDITOR plugin to deal with operations on hyperlink.
 * @module    CKEditorPlugins
 * @class     LinkPlugin
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('LinkPlugin', {

	// Register the icons.
	icons: 'LinkPlugin',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		/**
		 * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
		 * @property  {CLink}     _controller
		 * @type      {CLink}
		 * @private
		 */
		var _controller = new CLink();
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


		// Define an editor command that opens the dialog and fills it in in case
		// there is a link among ancestors of the cursor position.
		editor.addCommand(_pluginName + 'Dialog', {
			exec: function(e){
				e.openDialog(_pluginName + 'Dialog', function(dialog){
					dialog.once('show', function(event){
						_controller.fillInDialog(dialog, e);
					});
				});
			}
		});

		// this code gets called when context menu is activated (with the right button click)
		editor.addCommand(_pluginName + 'Modify', {
			exec: function(e){
				e.openDialog(_pluginName + 'Dialog', function(dialog){
					if (_target.hostLink){
						// wait until the dialog gets loaded completely
						// otherwise, an error occurs because the editor can already be
						// aware of the UI input elements, but they might not be present
						// in DOM so far
						dialog.once('show', function(){
							_controller.fillInDialogWithElementData(dialog, _target.hostLink, 'link');
							_controller.saveExtra(dialog, _target.hostLink);
							_target.hostLink = undefined;
						});
					}
				});
			}
		});




		editor.ui.addButton(_pluginName, {
			label: editor.lang.link.title,
			command: _pluginName + 'Dialog',
			toolbar: 'document',
		});

		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + 'dialogs/link.js');

		editor.addCommand(_pluginName + 'Unlink', {
			exec: function(editor){
				// Remember that the link that has triggered context menu that might not be only one
				// present in the selected text inside the editor content
				_controller.unlink(editor, _target.hostLink);
			}
		});

		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);

			editor.addMenuItem(_pluginName + 'Unlink', {
				label: editor.lang.LinkPlugin.unlink,
				icon: this.path + 'icons/unlink.png',
				command: _pluginName + 'Unlink',
				group: _pluginNameGroup
			});

			editor.addMenuItem(_pluginName + 'Modify', {
				label: editor.lang.LinkPlugin.modify,
				icon: this.path + 'icons/LinkPlugin.png',
				command: _pluginName + 'Modify',
				group: _pluginNameGroup
			});

			editor.contextMenu.addListener(function(element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostLink = el;
					menuObj[_pluginName + 'Unlink'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'Modify'] = CKEDITOR.TRISTATE_OFF;
					return menuObj;
				}
			});
		}
	},

	onLoad: function(){
		var translations = {
			it: {
				color:         'Colore',
				colorDescr:    'Colore del collegamento',
				content:       'Contenuto',
				contentDescr:  'Il contenuto da linkare',
				invalid:       'Indirizzo non valido',
				modify:        'Modificare collegamento',
				target:        'Aprire in scheda nuova',
				targetDescr:   'Impostare che il link si apri in una nuova scheda',
				title:         'Titolo',
				titleDescr:    'testo che appare quando utente passa sopra l\'elemento',
				underline:     'Sottolineato',
				underlineDescr:'Spunta la casella per sottolineare il contenuto',
				unlink:        'Eliminare collegamento',
				url:           'URL',
				urlDescr:      'Indirizzo della risorsa al quale fare il collegamento',

			},
			en: {
				color:         'Color',
				colorDescr:    'Choose color of the link',
				content:       'Content',
				contentDescr:  'The content that is supposed to be linked',
				invalid:       'Invalid address',
				modify:        'Modify link',
				target:        'Open in a new tab',
				targetDescr:   'Open the link in new tab',
				title:         'Title',
				titleDescr:    'popup text',
				underline:     'Underlined',
				underlineDescr:'Check this box for the content to be underlined',
				unlink:        'Drop link',
				url:           'URL',
				urlDescr:      'Address which the link should point to',
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
