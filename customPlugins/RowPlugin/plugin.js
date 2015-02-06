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

		editor.addCommand('table2AddRowBefore', {
			exec: function (ed) {
				_controller.insertRow(ed, _target.hostElem, 'before');
			}
		});

		editor.addCommand('table2AddRowAfter', {
			exec: function (ed) {
				_controller.insertRow(ed, _target.hostElem, 'after');
			}
		});

		editor.addCommand('table2DeleteRow', {
			exec: function (editor) {
				_controller.dropRow(editor, _target.hostElem);
			}
		});

		if (editor.contextMenu) {
			editor.addMenuGroup('row2Group');
			editor.addMenuItem('table2AddRowBefore', {
				label: editor.lang.RowPlugin.insertBefore,
				icon: this.path + 'icons/insert_row.png',
				command: 'table2AddRowBefore',
				group: 'row2Group'
			});
			editor.addMenuItem('table2AddRowAfter', {
				label: editor.lang.RowPlugin.insertAfter,
				icon: this.path + 'icons/insert_row.png',
				command: 'table2AddRowAfter',
				group: 'row2Group'
			});
			editor.addMenuItem('table2DeleteRow', {
				label: editor.lang.RowPlugin.deleteRow,
				icon: this.path + 'icons/delete_row.png',
				command: 'table2DeleteRow',
				group: 'row2Group'
			});

			editor.contextMenu.addListener(function (element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostElem = el;
					menuObj.table2AddRowAfter = CKEDITOR.TRISTATE_OFF;
					menuObj.table2AddRowBefore = CKEDITOR.TRISTATE_OFF;
					menuObj.table2DeleteRow = CKEDITOR.TRISTATE_OFF;
				}
				return menuObj;
			});
		}
	}
});

var pluginName = 'RowPlugin';
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
	CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
}
