/*jslint plusplus: true, white: true */
/*global CKEDITOR, CTable, NEWSLETTER, Document */

/**
 * A customized CKEDITOR plugin to manage table operations.
 * @module    CKEditorPlugins
 * @class     TablePlugin
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('TablePlugin', {
	// Register the icons.
	icons: 'TablePlugin',
	// The plugin initialization logic goes inside this method.
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
		 * @type       {Object}
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

		 // Register our dialog file. this.path is the plugin folder path.
		 CKEDITOR.dialog.add(_pluginName + 'DialogCreate', this.path + 'dialogs/table2.js');
		 CKEDITOR.dialog.add(_pluginName + 'DialogModify', this.path + 'dialogs/table2.js');


		// Define an editor command that opens our dialog.
		editor.addCommand(_pluginName + 'DialogCreate', new CKEDITOR.dialogCommand(_pluginName + 'DialogCreate'));
		editor.addCommand(_pluginName + 'Modify', new CKEDITOR.dialogCommand(_pluginName + 'DialogModify'));

		editor.addCommand(_pluginName + 'Delete', {
			exec: function (editor) {
				_controller.removeTable(editor, _target.hostTable);
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(_pluginName, {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.table.toolbar,
			// The command to execute on click.
			command: _pluginName + 'DialogCreate',
			// The button placement in the toolbar (toolbar group name).
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
				icon: this.path + 'icons/TablePlugin.png',
				command: _pluginName + 'Modify',
				group: _pluginNameGroup
			});


			editor.contextMenu.addListener(function (element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {},
				elemObj;
				console.log('table operations: ', el);
				if (el) {
					console.log('updating table context menu');
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

// var pluginName = _pluginName + '';
// var translations = {
// 	it: {
// 		separator:     'Inserire una linea tra le righe',
// 		frame:         'Bordo attorno alla tabella',
// 		intVerBord:    'Includere interni bordi verticali',
// 		intHorBord:    'Includere interni bordi orizzonatali',
// 		leftVerBord:   'Includere solo il bordo verticale sinistro',
// 		rightVerBord:  'Includere solo il bordo verticale destro',
// 		topHorBord:    'Includere solo il bordo orizzontale alto',
// 		bottomHorBord: 'Includere solo il bordo orizzontale basso',
// 		chooseColor:   'Scegliere colore',
// 		borders:       'Bordi',
// 		cellBorders:   'Bordi attorno a celle',
// 		background:    'Sfondo',
// 		spacesTitle:   'Spaziatura',
// 		spacesDescr:   'Spazi attorno alla tabella, righe e celle',
// 		valueInPx:     'Inserisci valore in pixel',
// 		rowBorders:    'Bordo attorno alle righe',
// 		globalSpaces:  'Spazi attorno alla tabella',
// 		rowSpaceTitle: 'Spazi tra le righe',
// 		cellSpace:     'Spazio tra testo e bordo di cella',
// 		columnWeight:  'Fattori con i quali le colonne contribuiscono nella larghezza della tabella',
// 		structure:     'Struttura',
// 		globalPadding: 'Spazio tra cornice e contenuto',
// 		modifyTable:   'Modificare tabella',
// 		colWeightInfo: 'Colonne'
// 	},
// 	en: {
// 		separator:     'Insert a line between the rows',
// 		frame:         'Frame around the table',
// 		intVerBord:    'Insert only internal vertical borders',
// 		intHorBord:    'Insert only internal horizontal borders',
// 		leftVerBord:   'Insert the most left horizontal border',
// 		rightVerBord:  'Insert the most right horizontal border',
// 		topHorBord:    'Insert upper horizontal border',
// 		bottomHorBord: 'Insert lowest horizontal border',
// 		chooseColor:   'Choose color',
// 		borders:       'Borders',
// 		cellBorders:   'Cell frames',
// 		background:    'Background',
// 		spacesTitle:   'Margins',
// 		spacesDescr:   'Spaces around the table, cells and rows',
// 		valueInPx:     'Insert value in pixel',
// 		rowBorders:    'Border around the rows',
// 		globalSpaces:  'Spaces around the table',
// 		rowSpaceTitle: 'Space between rows',
// 		cellSpace:     'Space between text and cell frame',
// 		columnWeight:  'Column weight factors',
// 		structure:     'Structure',
// 		globalPadding: 'Space between table border and content',
// 		modifyTable:   'Modify table',
// 		colWeightInfo: 'Columns'
// 	}
// };

// var lang;
// for (lang in translations){
// 	CKEDITOR.plugins.setLang(pluginName, lang, translations[lang]);
// }


// CKEDITOR.dialog.add('TablePluginResizeColumnsDialog', function (editor) {
// 	return {
// 		title: editor.lang.table.column.resize,
// 		minWidth: "80em",
// 		minHeight: "10em",
// 		contents: [{
// 			id: 'tab1',
// 			label: 'Columns Resize',
// 			elements: [{
// 				type: 'html',
// 				html: '<div id="infoCol"></div>',
// 			}, {
// 				type: 'html',
// 				html: '<div id="hiddenDiv">Dimensioni desiderate:</div>'
// 			}
// 			]
// 		}
// 		],

// 		onShow: function () {
// 			var hiddenDiv = CKEDITOR.document.getById('hiddenDiv'),
// 				infoCol  = 	CKEDITOR.document.getById('infoCol'),
// 				colField, i,
// 				markerName  = NEWSLETTER['marker-name'],
// 				tableMarker = (new Table()).getName(),
// 				currentElem = editor.getSelection().getStartElement(),
// 				table = CKHelper.findAscendant(currentElem, function(el){
// 					return el.getName() === 'table' &&
// 						el.getAttribute(markerName) === tableMarker;
// 			});
// 			// exit if the table is not found
// 			if (!table){
// 				return null;
// 			}

// 			// var tableObj = table.getOuterHtml().createTableFromHtml();
// 			var tableObj = NEWSLETTER.factory.mimic(table.$);
// 			var	profile = tableObj.getProfile().map(function(el){
// 				return parseFloat(el);
// 			}),
// 				totWidth = Helper.trace(profile),
// 				colNum = profile.length,
// 				unit = 'px',
// 				cellWidthStr = profile.map(function(el){
// 						return el;
// 					}).join(' + ');

// 			//console.log('table: ', table);
// 			// override the field with current info about cell widths
// 			infoCol.setHtml('Dimensioni attuali delle colonne: ' + cellWidthStr + ' = ' + totWidth + ' ' + unit);

// 			// input fields for resizing
// 			var inputFields = hiddenDiv.getElementsByTag('input'),
// 				len = inputFields.count();
// 			// remove the items starting from the end.
// 			for (i = len-1; i >= 0; i--){
// 				inputFields.getItem(i).remove();
// 			}
// 			// appending input fields for insertion of the cell widths
// 			for (i = 0; i < colNum; i++){
// 				colField = new CKEDITOR.dom.element('input');
// 				colField.setAttribute('type', 'text');
// 				colField.setAttribute('id', 'colField' + i);
// 				colField.setValue(profile[i]);
// 				colField.setAttribute('class', 'cke_dialog_ui_input_text');
// 				colField.setStyle('width', '5em');
// 				colField.setStyle('text-align', 'center');
// 				// to all but last field, attach listeners that "validate" user input
// 				if (i < colNum - 1){
// 					colField.on('change', function(){
// 						var allButLast = 0, last, j,
// 							currentInput = parseInt(this.getValue(), 10),
// 							lastOld,
// 							inputFields2 = CKEDITOR.document.getById('hiddenDiv').getElementsByTag('input');
// 						len = inputFields2.count();
// 						for (j = 0; j < len - 1; j++){
// 							allButLast += parseInt(inputFields2.getItem(j).getValue(), 10);
// 						}
// 						// value of the last cell before any modifications
// 						lastOld = parseInt(inputFields2.getItem(len - 1).getValue(), 10);
// 						// if positive, the last cell should have this width
// 						last = totWidth - allButLast;
// 						if (last > 0){
// 							inputFields2.getItem(len - 1).setValue(last);
// 						} else {
// 							// re-impose the previous value of the input field
// 							this.setValue(currentInput + last - lastOld);
// 						}
// 					});
// 				} else {
// 					// the last field is made non-editable
// 					colField.setAttribute('disabled', 'true');
// 				}
// 				hiddenDiv.append(colField);
// 			}
// 		},

// 		onOk: function () {
// 			var hiddenDiv = CKEDITOR.document.getById('hiddenDiv'),
// 				inputFields = hiddenDiv.getElementsByTag('input'),
// 				len = inputFields.count(),
// 				userInput = [],
// 				factory = NEWSLETTER.factory,
// 				tableMarker = (new Table()).getName(),
// 				currentElem, table, currentTable, tableStr, tableElem,
// 				i;
// 			for (i = 0; i < len; i++){
// 				userInput[i] = parseInt(inputFields.getItem(i).getValue(), 10);
// 			}

// 			currentElem = editor.getSelection().getStartElement();
// 			table = CKHelper.findAscendant(currentElem, function(el){
// 				return el.getName() === 'table' &&
// 					el.getAttribute(NEWSLETTER['marker-name']) === tableMarker;
// 			});

// 			currentTable = factory.mimic(table.$);
// 			currentTable.disentangle();
// 			currentTable.setProfile(userInput);
// 			tableStr = currentTable.toHtml();
// 			tableElem = CKEDITOR.dom.element.createFromHtml(tableStr);
// 			table.remove();
// 			editor.insertElement(tableElem);
// 			return null;
// 		}
// 	};
// });

// CKEDITOR.dialog.add('TablePluginDropColumnDialog', function (editor) {
// 	return {
// 		title: editor.lang.table.column.deleteColumn,
// 		minWidth: '80em',
// 		minHeight: '10em',
// 		contents: [{
// 			id: 'tab1',
// 			label: 'Togliere colonna',
// 			elements: [{
// 				type: 'html',
// 				html: 'Sei sicuro di voler eliminare la colonna evidenziata?',
// 			}]
// 		}
// 		],

// 		onShow: function(){
// 			var currentElem = editor.getSelection().getStartElement(),
// 				markerName  = NEWSLETTER['marker-name'],
// 				rowMarker   = (new Row()).getName(),
// 				cellMarker  = (new Cell()).getName(),
// 				tableMarker = (new Table()).getName(),
// 				tableElem = CKHelper.findAscendant(currentElem, function(el){
// 					return el.getName() === 'table' && el.getAttribute(markerName) === tableMarker;
// 				}),
// 				cellElem = CKHelper.findAscendant(currentElem, function(el){
// 					return el.getName() === 'td' && el.getAttribute(markerName) === cellMarker;
// 				});
// 			console.log(markerName, rowMarker, cellMarker, tableMarker, currentElem, tableElem, cellElem);
// 			var	cellNumber = cellElem.getIndex(),
// 				columnElems = tableElem.find('tr[' + markerName + '="' + rowMarker + '"] td[' +
// 					markerName + '="' + cellMarker + '"]:nth-child('+ (cellNumber + 1) +')'),
// 				len = columnElems.count(),
// 				i,
// 				boxShadowValues = '0.05em 0.05em 0.5em 0.05em #8B0000';


// 			for (i = 0; i < len; i++){
// 				$(columnElems.getItem(i).$).css('box-shadow', boxShadowValues);
// 			}
// 		},

// 		onOk: function () {
// 			var markerName  = NEWSLETTER['marker-name'],
// 				cellMarker  = (new Cell()).getName(),
// 				tableMarker = (new Table()).getName(),
// 				currentElem = editor.getSelection().getStartElement(),
// 				tableElem = CKHelper.findAscendant(currentElem, function(el){
// 					return el.getName() === 'table' &&	el.getAttribute(markerName) === tableMarker;
// 				}),
// 				cellElem = CKHelper.findAscendant(currentElem, function(el){
// 					return el.getName() === 'td' &&	el.getAttribute(markerName) === cellMarker;
// 				}),
// 				// column number to drop
// 				cellNumber = cellElem.getIndex(),

// 				// tableObj = tableElem.getOuterHtml().createTableFromHtml(),
// 				tableObj = NEWSLETTER.factory.mimic(tableElem.$),
// 				colNum = tableObj.colNum(),
// 				tableStr, tableElem2;

// 			console.log('parentTable: ', tableElem);
// 			console.log('currentElem: ', currentElem, ', its html ', currentElem.getHtml());
// 			console.log('table before knocking out: ', tableObj.toHtml());
// 			if (cellNumber >= 0 && cellNumber < colNum){
// 				tableObj.knockOutCol(cellNumber);
// 			}
// 			console.log('table after knocking out: ', tableObj.toHtml());
// 			tableStr = tableObj.toHtml();
// 			tableElem2 = CKEDITOR.dom.element.createFromHtml(tableStr);
// 			tableElem.remove();
// 			// call a custom method to insert the table and assign hovering effects on it
// 			editor.insertElement(tableElem2);
// 		}
// 	};
// });
