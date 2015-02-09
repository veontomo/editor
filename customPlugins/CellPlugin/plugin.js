/*jslint plusplus: true, white: true */
/*global CKEDITOR, CCell, NEWSLETTER, Document */

/**
 * A customized CKEDITOR plugin to manage operations on table row cell.
 * @module    CKEditorPlugins
 * @class     CellPlugin
 * @type      {Object}
 * @since     0.2.0
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('CellPlugin', {
	icons: 'CellPlugin',
	// The plugin initialization logic goes inside this method.
	init: function (editor) {
		console.log(this);
		/**
		 * Instance of {{#crossLink "CCell"}}CCell{{/crossLink}}
		 * @property   {CCell}        CCell
		 * @type       {CCell}
		 * @private
		 */
		var _controller = new CCell();

		/**
		 * A class that performs operations with editor window content.
		 * @property   {Document}     _worker
		 * @type       {Document}
		 * @since      0.2.0
		 * @private
		 */
		var _worker = new Document();

		/**
		 * Plugin name.
		 * @type       {String}
		 * @property   {String}        _pluginName
		 * @since      0.2.0
		 * @private
		 */
		var _pluginName = this.name;

		/**
		 * Configuring the controller:
		 * 1. assign Factory to the worker (in order to make worker be able to construct html elements)
		 * 2. assign adapter to the controller (in order to make controller comminicate with the editor)
		 */
		_worker.setFactory(NEWSLETTER.factory);
		_controller.setWorker(_worker);
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);

		/**
		 * Object containing elements on which context menu options have been triggered.
		 * @private
		 * @type       {Object}
		 * @since      0.2.0
		 */
		var _target = {};


		editor.addCommand(_pluginName + 'DeleteColumn', {
			exec: function (editor) {
				/// !!! stub
				console.log('delete the whole column');
				// _controller.dropRow(editor, _target.hostElem);
			}
		});

		editor.addCommand(_pluginName + 'ResizeColumn', {
			exec: function (editor) {
				/// !!! stub
				console.log('resize the whole column');
				// _controller.dropRow(editor, _target.hostElem);
			}
		});

		editor.addCommand(_pluginName + 'InsertColumn', {
			exec: function (editor) {
				/// !!! stub
				console.log('resize the whole column');
				// _controller.dropRow(editor, _target.hostElem);
			}
		});



		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginName + 'Group');
			editor.addMenuItem(_pluginName + 'DeleteColumn', {
				label: editor.lang[_pluginName].deleteColumn,
				icon: this.path + 'icons/deleteColumn.png',
				command: _pluginName + 'DeleteColumn',
				group: _pluginName + 'Group'
			});
			editor.addMenuItem(_pluginName + 'ResizeColumn', {
				label: editor.lang[_pluginName].resizeColumn,
				icon: this.path + 'icons/resizeColumn.png',
				command: _pluginName + 'ResizeColumn',
				group: _pluginName + 'Group'
			});
			editor.addMenuItem(_pluginName + 'InsertColumn', {
				label: editor.lang[_pluginName].insertColumn,
				icon: this.path + 'icons/CellPlugin.png',
				command: _pluginName + 'InsertColumn',
				group: _pluginName + 'Group'
			});


			editor.contextMenu.addListener(function (element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostElem = el;
					menuObj[_pluginName + 'DeleteColumn'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'ResizeColumn'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'InsertColumn'] = CKEDITOR.TRISTATE_OFF;
				}
				return menuObj;
			});
		}
	},

	onLoad: function(){
		var translations = {
			it: {
				insertColumn:  'Inserire colonna',
				resizeColumn:  'Ridimensionare colonna',
				deleteColumn:  'Eliminare colonna '
			},
			en: {
				insertColumn:  'Insert column',
				resizeColumn:  'Resize column',
				deleteColumn:  'Delete column'
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