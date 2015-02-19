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

		/*
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

		// Register dialog corresponding to table creation and table modification.
		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + 'dialogs/tableDialog.js');

		// Define an editor commands that open the above dialogs.
		editor.addCommand(_pluginName + 'Dialog', {
			exec: function(editor){
				editor.openDialog(_pluginName + 'Dialog', function(dialog){
					console.info(performance.now(), 'dialog callback is called with argument', dialog);
					console.info(performance.now(), 'dialog has ' + dialog.getPageCount() + ' pages');
					if (_target.hostTable){
						_controller.fillInDialogWithElementData(dialog, _target.hostTable, 'table');
						_controller.saveExtra(dialog, _target.hostTable);
						// reset the reference to the target element
						_target.hostTable = undefined;
					}
				});
				console.info(performance.now(), 'after opening dialog');

			}
		});

		editor.addCommand(_pluginName + 'Delete', {
			exec: function (editor) {
				_controller.removeTable(editor, _target.hostTable);
			}
		});

		// Create a toolbar button that calls a command that opens a dialog.
		editor.ui.addButton(_pluginName, {
			label: editor.lang.table.toolbar,
			command: _pluginName + 'Dialog',
			toolbar: 'document'
		});


		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);
			editor.addMenuItem(_pluginName + 'Delete', {
				label:   editor.lang[_pluginName].deleteTable,
				icon:    this.path + 'icons/deleteTable.png',
				command: _pluginName + 'Delete',
				group:  _pluginNameGroup
			});

			editor.addMenuItem(_pluginName + 'Modify', {
				label: editor.lang[_pluginName].modifyTable,
				icon: this.path + 'icons/modifyTable.png',
				command: _pluginName + 'Dialog',
				group: _pluginNameGroup
			});

			editor.contextMenu.addListener(function (element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					console.log('context menu items are triggered with host table', el);
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
				background:    'Sfondo',
				borders:       'Bordi',
				bottomHorBord: 'Includere solo il bordo orizzontale basso',
				cellBorders:   'Bordi attorno a celle',
				cellSpace:     'Spazio tra testo e bordo di cella',
				chooseColor:   'Scegliere colore',
				columnWeight:  'Fattori con i quali le colonne contribuiscono nella larghezza della tabella',
				colWeightInfo: 'Colonne',
				deleteTable:   'Eliminare tabella',
				frame:         'Bordo attorno alla tabella',
				globalPadding: 'Spazio tra cornice e contenuto',
				globalSpaces:  'Spazi attorno alla tabella',
				intHorBord:    'Includere interni bordi orizzonatali',
				intVerBord:    'Includere interni bordi verticali',
				leftVerBord:   'Includere solo il bordo verticale sinistro',
				modifyTable:   'Modificare tabella',
				rightVerBord:  'Includere solo il bordo verticale destro',
				rowBorders:    'Bordo attorno alle righe',
				rowSpaceTitle: 'Spazi tra le righe',
				separator:     'Inserire una linea tra le righe',
				spacesDescr:   'Spazi attorno alla tabella, righe e celle',
				spacesTitle:   'Spaziatura',
				structure:     'Struttura',
				topHorBord:    'Includere solo il bordo orizzontale alto',
				valueInPx:     'Inserisci valore in pixel',
			},
			en: {
				background:    'Background',
				borders:       'Borders',
				bottomHorBord: 'Insert lowest horizontal border',
				cellBorders:   'Cell frames',
				cellSpace:     'Space between text and cell frame',
				chooseColor:   'Choose color',
				columnWeight:  'Column weight factors',
				colWeightInfo: 'Columns',
				deleteTable:   'Drop table',
				frame:         'Frame around the table',
				globalPadding: 'Space between table border and content',
				globalSpaces:  'Spaces around the table',
				intHorBord:    'Insert only internal horizontal borders',
				intVerBord:    'Insert only internal vertical borders',
				leftVerBord:   'Insert the most left horizontal border',
				modifyTable:   'Modify table',
				rightVerBord:  'Insert the most right horizontal border',
				rowBorders:    'Border around the rows',
				rowSpaceTitle: 'Space between rows',
				separator:     'Insert a line between the rows',
				spacesDescr:   'Spaces around the table, cells and rows',
				spacesTitle:   'Margins',
				structure:     'Structure',
				topHorBord:    'Insert upper horizontal border',
				valueInPx:     'Insert value in pixel',
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
