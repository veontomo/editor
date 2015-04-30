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
					if (_target.hostTable){
						// wait until the dialog gets loaded completely
						// otherwise, an error occurs because the editor can already be
						// aware of the UI input elements, but they might not be present
						// in DOM so far
						dialog.once('show', function(){
							_controller.fillInDialogWithElement(dialog, _target.hostTable);
							_controller.saveExtra(dialog, _target.hostTable);
							// reset the reference to the target element
							_target.hostTable = undefined;
						});
					}
				});
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
				label: editor.lang[_pluginName].modify,
				icon: this.path + 'icons/modifyTable.png',
				command: _pluginName + 'Dialog',
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
				background:      'Colore di sfondo',
				backgroundDescr: 'Impostare il colore dello sfondo',
				borderColor:     'Colore del bordo',
				borderColorDescr:'Impostare il colore del bordo',
				borderFirst:     'Creare il bordo esterno alto',
				borderLast:      'Creare il bordo basso',
				borderMiddle:    'Creare bordi interni',
				borderWidth:     'Spessore del bordo',
				borderWidthDescr:'Impostare lo spessore del bordo in pixel',
				cellNum:         'Numero di colonne',
				cellNumDescr:    'Impostare il numero di colonne della tabella',
				cells:           'Celle',
				columnNo:        'Colonna no.',
				colWeightDescr:  'Precisare i fattori con i quali le colonne contribuiscono nella larghezza totale',
				colWeightLabel:  'Fattori',
				deleteTable:     'Eliminare la tabella',
				frameColor:      'Colore della cornice',
				frameColorDescr: 'Colore del bordo attorno a ogni riga',
				frameWidth:      'Spessore della cornice',
				frameWidthDescr: 'Spessore del bordo attorno a ogni riga in pixel',
				margin:          'Margine',
				marginDescr:     'Spazio tra il bordo e l\'esterno in pixel',
				modify:          'Modificare la tabella',
				overallTable:    'Tabella',
				padding:         'Padding',
				paddingDescr:    'Spazio tra il bordo e l\'interno in pixel',
				rowBorderColor:  'Colore del bordo',
				rowBorderDescr:  'Esterni oppure interni bordi delle righe',
				rowBorderWidth:  'Spessore del bordo',
				rowNum:          'Numero di righe',
				rowNumDescr:     'Impostare il numero di righe della tabella',
				rows:            'Righe',
				widthOfColumnNo: 'Largezza di colonna n.',
			},
			en: {
				background:      'Background color',
				backgroundDescr: 'Set background color',
				borderColor:     'Border color',
				borderColorDescr:'Set border color',
				borderFirst:     'Make upper border',
				borderLast:      'Make bottom border',
				borderMiddle:    'Make internal borders',
				borderWidth:     'Border width',
				borderWidthDescr:'Set border width in pixels',
				cellNum:         'Columns',
				cells:           'Cells',
				columnNo:        'Column n.',
				colWeightDescr:  'Set up the weights with which each column contributes to the total width',
				colWeightLabel:  'Weights',
				deleteTable:     'Drop the table',
				frameColor:      'Frame color',
				frameColorDescr: 'Color of the border around each row',
				frameWidth:      'Frame width',
				frameWidthDescr: 'Width of the border around each row in pixel',
				margin:          'Margin',
				marginDescr:     'Space between border and outer elements in pixels',
				modify:          'Modify the table',
				overallTable:    'Table',
				padding:         'Padding',
				paddingDescr:    'Space between border and the content in pixels',
				rowBorderColor:  'Border color',
				rowBorderDescr:  'External or internal row borders',
				rowBorderWidth:  'Border width',
				rowNum:          'Rows',
				rowNumDescr:     'The number of table rows',
				rows:            'Rows',
				widthOfColumnNo: 'Width of column n.',
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
