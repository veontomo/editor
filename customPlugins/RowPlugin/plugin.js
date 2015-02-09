/*jslint plusplus: true, white: true */
/*global CKEDITOR, CRow, NEWSLETTER, Document */

/**
 * A customized CKEDITOR plugin to manage operations on table rows.
 * @module    CKEditorPlugins
 * @class     RowPlugin
 * @type      {Object}
 * @since     0.2.0
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('RowPlugin', {
	// The plugin initialization logic goes inside this method.
	init: function (editor) {
		/**
		 * Instance of {{#crossLink "CRow"}}CRow{{/crossLink}}
		 * @property   {CRow}        CRow
		 * @type       {CRow}
		 * @private
		 */
		var _controller = new CRow();

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
		 * Name of the group to embrace the plugin functionality.
		 * @type       {String}
		 * @property   {String}        _pluginNameGroup
		 * @since      0.2.0
		 * @private
		 */
		 var _pluginNameGroup = _pluginName + 'Group';

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

		editor.addCommand(_pluginName + 'AddRowBefore', {
			exec: function (ed) {
				_controller.insertRow(ed, _target.hostElem, 'before');
			}
		});

		editor.addCommand(_pluginName + 'AddRowAfter', {
			exec: function (ed) {
				_controller.insertRow(ed, _target.hostElem, 'after');
			}
		});

		editor.addCommand(_pluginName + 'DeleteRow', {
			exec: function (editor) {
				_controller.dropRow(editor, _target.hostElem);
			}
		});

		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);
			editor.addMenuItem(_pluginName + 'AddRowBefore', {
				label: editor.lang[_pluginName].insertBefore,
				icon: this.path + 'icons/insertRow.png',
				command: _pluginName + 'AddRowBefore',
				group: _pluginName + 'Group'
			});
			editor.addMenuItem(_pluginName + 'AddRowAfter', {
				label: editor.lang[_pluginName].insertAfter,
				icon: this.path + 'icons/insertRow.png',
				command: _pluginName + 'AddRowAfter',
				group: _pluginName + 'Group'
			});
			editor.addMenuItem(_pluginName + 'DeleteRow', {
				label: editor.lang[_pluginName].deleteRow,
				icon: this.path + 'icons/deleteRow.png',
				command: _pluginName + 'DeleteRow',
				group: _pluginName + 'Group'
			});

			editor.contextMenu.addListener(function (element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostElem = el;
					menuObj[_pluginName + 'DeleteRow'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'AddRowAfter'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'AddRowBefore'] = CKEDITOR.TRISTATE_OFF;
				}
				return menuObj;
			});
		}
	},

	onLoad: function(){
		var translations = {
			it: {
				insertBefore:  'Inserire riga prima',
				insertAfter:   'Inserire riga dopo',
				deleteRow:     'Eliminare riga'
			},
			en: {
				insertBefore:  'Insert row before',
				insertAfter:   'Insert row after',
				deleteRow:     'Drop row'
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