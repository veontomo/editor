/*jslint plusplus: true, white: true */
/*global CKEDITOR, CTable, NEWSLETTER, Document */

/**
 * A customized CKEDITOR plugin to manage table operations.
 * @module    CKEditorPlugins
 * @class     TablePlugin
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('TablePlugin', {
	/**
	 * Register plugin icons.
	 * @property       {String} icons
	 * @since          0.0.5
	 */
	icons: 'TablePlugin',

	/**
	 * Plugin initializer.
	 * @method         init
	 * @param          {CKEditor}      editor
	 * @return         {void}
	 * @since          0.0.5
	 */
	init: function (editor) {
		/**
		 * Instance of {{#crossLink "CTable"}}CTable{{/crossLink}}
		 * @property   {CTable}        _controller
		 * @type       {CTable}
		 * @private
		 */
		var _controller = new CTable();

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

		 /**
		 * Register dialog corresponding to table creation and table modification.
		 *
		 * File "table2.js" is mentioned twice, because it contains definitions
		 * of two dialogs: "TablePluginDialogCreate" and "TablePluginDialogModify".
		 * These dialogs are defined in the same file bacause they are defined in terms of a
		 * class "manageTable" which is defined in that file.
		 * CKEDITOR uses lazy loading, therefore file 'dialogs/table2.js' is not loaded
		 * immediately, but rather gets registered in such a way that CKEDITOR knows where
		 * to find the definitions of the dialogs once they are called. If they are never called,
		 * file 'dialogs/table2.js' will never be called.
		 */
		 CKEDITOR.dialog.add(_pluginName + 'DialogCreate', this.path + 'dialogs/table2.js');
		 CKEDITOR.dialog.add(_pluginName + 'DialogModify', this.path + 'dialogs/table2.js');


		// Define an editor commands that open the above dialogs.
		editor.addCommand(_pluginName + 'DialogCreate', new CKEDITOR.dialogCommand(_pluginName + 'DialogCreate'));
		editor.addCommand(_pluginName + 'ModifyDialog', new CKEDITOR.dialogCommand(_pluginName + 'DialogModify'));

		editor.addCommand(_pluginName + 'Delete', {
			exec: function (editor) {
				_controller.removeTable(editor, _target.hostTable);
			}
		});

		// Create a toolbar button that calls a command that opens a dialog.
		editor.ui.addButton(_pluginName, {
			label: editor.lang.table.toolbar,
			command: _pluginName + 'DialogCreate',
			toolbar: 'document'
		});


		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);
			editor.addMenuItem(_pluginName + 'Delete', {
				label:   editor.lang.table.deleteTable,
				icon:    this.path + 'icons/deleteTable.png',
				command: _pluginName + 'Delete',
				group:  _pluginNameGroup
			});

			editor.addMenuItem(_pluginName + 'Modify', {
				label: editor.lang[_pluginName].modifyTable,
				icon: this.path + 'icons/modifyTable.png',
				command: _pluginName + 'ModifyDialog',
				group: _pluginNameGroup
			});


			editor.contextMenu.addListener(function (element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostTable = el;
					menuObj[_pluginName + 'Delete'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'Modify'] = CKEDITOR.TRISTATE_OFF;
					return menuObj;
				}
			});
		}
	},

	onLoad: function(){
		var translations = {
			it: {
				separator:     'Inserire una linea tra le righe',
				frame:         'Bordo attorno alla tabella',
				intVerBord:    'Includere interni bordi verticali',
				intHorBord:    'Includere interni bordi orizzonatali',
				leftVerBord:   'Includere solo il bordo verticale sinistro',
				rightVerBord:  'Includere solo il bordo verticale destro',
				topHorBord:    'Includere solo il bordo orizzontale alto',
				bottomHorBord: 'Includere solo il bordo orizzontale basso',
				chooseColor:   'Scegliere colore',
				borders:       'Bordi',
				cellBorders:   'Bordi attorno a celle',
				background:    'Sfondo',
				spacesTitle:   'Spaziatura',
				spacesDescr:   'Spazi attorno alla tabella, righe e celle',
				valueInPx:     'Inserisci valore in pixel',
				rowBorders:    'Bordo attorno alle righe',
				globalSpaces:  'Spazi attorno alla tabella',
				rowSpaceTitle: 'Spazi tra le righe',
				cellSpace:     'Spazio tra testo e bordo di cella',
				columnWeight:  'Fattori con i quali le colonne contribuiscono nella larghezza della tabella',
				structure:     'Struttura',
				globalPadding: 'Spazio tra cornice e contenuto',
				modifyTable:   'Modificare tabella',
				colWeightInfo: 'Colonne'
			},
			en: {
				separator:     'Insert a line between the rows',
				frame:         'Frame around the table',
				intVerBord:    'Insert only internal vertical borders',
				intHorBord:    'Insert only internal horizontal borders',
				leftVerBord:   'Insert the most left horizontal border',
				rightVerBord:  'Insert the most right horizontal border',
				topHorBord:    'Insert upper horizontal border',
				bottomHorBord: 'Insert lowest horizontal border',
				chooseColor:   'Choose color',
				borders:       'Borders',
				cellBorders:   'Cell frames',
				background:    'Background',
				spacesTitle:   'Margins',
				spacesDescr:   'Spaces around the table, cells and rows',
				valueInPx:     'Insert value in pixel',
				rowBorders:    'Border around the rows',
				globalSpaces:  'Spaces around the table',
				rowSpaceTitle: 'Space between rows',
				cellSpace:     'Space between text and cell frame',
				columnWeight:  'Column weight factors',
				structure:     'Structure',
				globalPadding: 'Space between table border and content',
				modifyTable:   'Modify table',
				colWeightInfo: 'Columns'
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
