/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, Row, Cell, TableStyles, TableRowStyles, TableCellStyles, Attributes, Content, TableAttributes, NEWSLETTER, alert, CKHelper, Helper
 */
CKEDITOR.dialog.add('table2Dialog', function (editor) {
	var inputStyle = 'min-width: 3em; width: 5em;text-align: center;';

	/**
	 * Drops inline attribute named attrName from DOM element
	 * @param          {Object}             element 	an inline attribute of  this element will be dropped.
	 *                                                  The element should respond to jQuery "attr" method.
	 * @param          {string}             attrName 	this attribute name will be dropped.
	 * @return         {void}
	 */

	var INPUTCOLWIDTHNAME = 'widthCol',
		// draw input fields for column width
		drawColumns = function () {
			// adds input fields to set the widths of the table columns
			var element = CKEDITOR.document.getById('columnWidthTable'),
				title = CKEDITOR.document.getById('columnWidthTableTitle'),
				children, length, i, td, inputField, colWidthInput, tr, colNum;

			title.setHtml('');
			children = element.getChildren();
			length = children.count();
			for (i = 0; i < length; i++) {
				children.getItem(i).remove();
			}

			colWidthInput = new CKEDITOR.dom.element('table');
			tr = new CKEDITOR.dom.element('tr');
			colNum = this.getDialog().getValueOf('info', 'tblCols');
			colWidthInput.append(tr);
			if (colNum > 1) {
				for (i = 0; i < colNum; i++) {
					td = new CKEDITOR.dom.element('td');
					inputField = new CKEDITOR.dom.element('input');
					inputField.setAttribute('type', 'text');
					inputField.setAttribute('id', INPUTCOLWIDTHNAME + i);
					// inputField.setAttribute('width', '50');
					inputField.setAttribute('class', 'cke_dialog_ui_input_text');
					inputField.setStyle('min-width', '2em');
					inputField.setStyle('max-width', '5em');
					inputField.setStyle('text-align', 'center');
					td.append(inputField);
					tr.append(td);
				}
				element.append(colWidthInput);
				title.setHtml('Fattori con i quali le colonne contribuiscono<br>nella larghezza della tabella:');
			}
		},

		/**
		 * Returns the width of the parent element available for its children.
		 * <pre>
		 * available width = (element width) - (element left border width) -
		 * 		(element right border width) - (element left margin) - (element right margin)
		 * </pre>
		 * The element width is supposed to be greater than zero and hence to have a unit of
		 * measurement (e.g. 'px'). If not set, widths of other attributes are equal to zero
		 * without unit of measurement.  In this case one has to set the unit of measurement
		 * equal to the element width.
		 * @return     {Number}             available width for the children as Unit object
		 *                                  (with properties "value" and "measure")
		 */
		parentWidth = function () {
			var startElem = editor.getSelection().getStartElement(),
				rawWidth = new Unit(startElem.getComputedStyle('width')),
				borderWidthL = new Unit(startElem.getComputedStyle('border-width-left')),
				borderWidthR = new Unit(startElem.getComputedStyle('border-width-right')),
				paddingL = new Unit(startElem.getComputedStyle('padding-left')),
				paddingR = new Unit(startElem.getComputedStyle('padding-right')),
				output;
			if (borderWidthL.value === 0) {
				borderWidthL.measure = rawWidth.measure;
			}
			if (borderWidthR.value === 0) {
				borderWidthR.measure = rawWidth.measure;
			}
			if (paddingL.value === 0) {
				paddingL.measure = rawWidth.measure;
			}
			if (paddingR.value === 0) {
				paddingR.measure = rawWidth.measure;
			}
			output = rawWidth.sub(borderWidthL).sub(borderWidthR).sub(paddingL).sub(paddingR);
			output.value = Math.round(output.value);
			return output;
		};


	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.table.title,
		minWidth: 300,
		minHeight: 300,

		// Dialog window contents definition.
		contents: [{
			id: "info",
			label: editor.lang.table.columns + ' & ' + editor.lang.table.rows,
			elements: [
			{
				type: 'text',
				label: editor.lang.table.rows,
				id: 'tblRows',
				"default": '2',
				'inputStyle': inputStyle,
			},
			{
				type: "text",
				label: editor.lang.table.columns,
				id: 'tblCols',
				'default': '2',
				'inputStyle': inputStyle,
				onChange: drawColumns
			},
			{
				type: 'text',
				id: 'borderWidth',
				label: editor.lang.table.border + ' (px)',
				'default': '0',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: 'Bordo attorno alle righe (px)',
				id: 'frameWidth',
				'default': '0',
				'inputStyle': inputStyle
			},{
				type: 'text',
				label: editor.lang.image.vSpace + ' (px)',
				'default': '1',
				id: 'vSpace',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: editor.lang.image.hSpace + ' (px)',
				'default': '1',
				id: 'hSpace',
				'inputStyle': inputStyle
			}, {
				type: 'html',
				html: '<div id="columnWidthTableTitle"></div>'
			}, {
				type: 'html',
				html: '<div id="columnWidthTable"></div>',
			}, {
				// whether the line separator between table rows should be included
				type: 'checkbox',
				label: 'Inserire separatore tra le righe',
				id: 'trSeparator',
				'inputStyle': inputStyle,
				'default': false
			}]
		}, {
			id: 'borderTab',
			label: 'Bordi', // it is better to make it I18n
			elements: [
			{
				type: 'vbox',
				children: [{
					type: 'html',
					html: 'Bordo globale',
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'text',
						label: editor.lang.common.width,
						title: 'larghezza in pixel',
						id: 'globalBorder',
						"default": '0',
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'globalBorderColor',
						'default': '#000001',
						"onclick": 'colorPicker(click)'
					}]
				}]
			}, {
				type: 'vbox',
				children: [{
					type: 'html',
					html: 'Bordo attorno a ogni riga',
				}, {
					type: 'hbox',
					widths: ['50%', '50%'],
					children: [{
						type: 'text',
						label: editor.lang.common.width,
						id: 'phantomBorder',
						"default": '0',
					}, {
						type: 'text',
						label: editor.lang.colordialog.title,
						id: 'phantomBorderColor',
						'default': '#000001'
					}]

				}]
			},  {
				type: 'vbox',
				children: [{
					type: 'html',
					html: 'Bordo attorno a celle',
				}, {
					type: 'hbox',
					widths: ['10%', '10%', '10%', '10%', '10%', '10%', '20%'],
					children: [{
						type: 'vbox',
						children: [{
							type: 'html',
							html: '<img src="ckeditor/plugins/table2/icons/left.gif" title="left border" width="15" />',
						}, {
							type: 'checkbox',
							label: '',
							title: 'left border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: '<img src="ckeditor/plugins/table2/icons/middleVer.gif" title="middle vertical border" width="15" />',
						}, {
							type: 'checkbox',
							label: '',
							title: 'middle vertical border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: '<img src="ckeditor/plugins/table2/icons/right.gif" title="right border" width="15" />',
						}, {
							type: 'checkbox',
							label: '',
							title: 'right border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: '<img src="ckeditor/plugins/table2/icons/upper.gif" title="upper border" width="15"/ >',
						}, {
							type: 'checkbox',
							label: '',
							title: 'upper border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: '<img src="ckeditor/plugins/table2/icons/middleHor.gif" title="middle horizontal border" width="15" />',
						}, {
							type: 'checkbox',
							label: '',
							title: 'middle horizontal border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: '<img src="ckeditor/plugins/table2/icons/lower.gif" title="lower border" width="15"/>',
						}, {
							type: 'checkbox',
							label: '',
							title: 'lower border'
						}]
					}, {
						type: 'vbox',
						children: [{
							type: 'html',
							html: editor.lang.colordialog.title,
						}, {
							type: 'text',
							label: '',
							title: 'inserisci colore',
							'default': '#000001',

						}]
					}]
				}]
			}]
		}, {
			id: 'backgroundTab',
			label: 'Sfondo',   // it is better to make it I18n
			elements: [
			{
				type: 'text',
				label: editor.lang.table.cell.bgColor,
				id: 'backgroundColor',

			}]
		}, {
			id: 'spacesTab',
			label: 'Spazi', // it is better to make it I18n
			elements: [
			{
				type: 'hbox',
				widths: ['50%', '50%'],
				children: [{
					type: 'html',
					html: 'Spaziatura',
					title: 'inserisci valore in pixel'
				}, {
					type: 'text',
					id: 'spaces',
					"default": '0',
					title: 'inserisci valore in pixel'
					// 'inputStyle': inputStyle,
				}]
			}]
		}


		],
		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function () {
			var dialog = this,
				// user input
				rows = parseInt(dialog.getValueOf('info', 'tblRows'), 10),
				cols = parseInt(dialog.getValueOf('info', 'tblCols'), 10),
				borderWidth = parseInt(dialog.getValueOf('info', 'borderWidth'), 10),
				frameWidth = parseInt(dialog.getValueOf('info', 'frameWidth'), 10),
				vSpace = parseInt(dialog.getValueOf('info', 'vSpace'), 10),
				hSpace = parseInt(dialog.getValueOf('info', 'hSpace'), 10),
				withSeparator = dialog.getValueOf('info',  'trSeparator'),

				// variables to be used in what follows
				phantomRowAttr, phantomRowStyle,  phantomCellAttr, phantomCellStyle, phantomTableAttr, phantomTableStyle,
				parentElemStyle, phantomRowWidth, phantomCellWidth, phantomTableWidth,
				i, table, tableWidth, tableElem, cellWidths, rowWidth,
				// rowContentWidth,
				spaceTop, spaceBottom,
				inputField, cellWeights, row, cell,
				// TableStyles, tableAttr,
				rowStyle, rowAttr, cellStyle,
				cellAttr, cellWidth, allCellsWidth, tableStr, isFramed,
				allWidths = [];


			// read inserted values
			cellWeights = [];
			for (i = 0; i < cols; i++) {
				// in fact, this check is needed only when the user does not change the default number of the table rows
				inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
				cellWeights[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
			}

			// calculating widths
			try {
				tableWidth = Math.min(parentWidth().value, NEWSLETTER.maxWidth); // integer, the width in px
			} catch (e){
				tableWidth = NEWSLETTER.maxWidth; // integer, the width in px
			}
			spaceTop = parseInt(vSpace / 2, 10); 			// top white space for each row (cast to integer)
			spaceBottom = vSpace - spaceTop; 				// bottom white space for each row

			isFramed = frameWidth > 0;

			table = new Table();

			// impose styles and attribute values
			table.setWidth(tableWidth);
			//console.log('table2.js: tableWidth = ', tableWidth);
			table.setStyleProperty('margin', 0);
			table.setStyleProperty('padding', 0);

			table.setProperty(NEWSLETTER['marker-name'], table.getName());
			table.setProperty('width', tableWidth);

			// binding the styles and attributes and the table object
			if (borderWidth > 0){
				table.setBorder({
					'width': borderWidth,
					'color': '#000000',
					'style': 'solid'
				});
			}
			allWidths.push({'value': tableWidth, 'descr': 'larghezza della tabella'});

			// creating table row
			row  = new Row();
			rowStyle = new TableRowStyles();
			rowAttr = new Attributes();

			// By default, table style is a parent style for the nested rows.
			// The properties of the the nested elements will be calculated based on this style.
			parentElemStyle = table.getStyles();

			if (isFramed){
				// creating phantom styles and attributes
				phantomRowAttr    = new Attributes();
				phantomRowStyle   = new TableRowStyles();
				phantomCellAttr   = new Attributes();
				phantomCellStyle  = new TableCellStyles();
				phantomTableAttr  = new TableAttributes();
				phantomTableStyle = new TableStyles();

				// calculating widths of the phantom elements
				// NB: if the parent table has no border, then its 'border-width' attribute is not set!
				phantomRowWidth = parentElemStyle.getProperty('width') - 2 * parentElemStyle.getProperty('padding') - 2 * parentElemStyle.getBorderInfo().width;

				phantomRowStyle.setWidth(phantomRowWidth);
				//console.log('table2.js: phantomRowWidth = ', phantomRowWidth);
				allWidths.push({'value': phantomRowWidth, 'descr': 'larghezza della riga fittizia'});
				phantomRowStyle.setProperty('padding', 0);
				phantomRowStyle.setProperty('margin', 0);
				// mark the phantom row
				phantomRowAttr.setProperty(NEWSLETTER['marker-name'], row.getName());
				phantomCellWidth = phantomRowStyle.getProperty('width') - 2 * phantomRowStyle.getProperty('padding') - 2 * frameWidth;
				phantomCellStyle.setWidth(phantomCellWidth);
				allWidths.push({'value': phantomCellWidth, 'descr': 'larghezza della cella fittizia'});

				// if remains zero, then in MS Outlook the cell content overlaps the border
				// and latter becomes invisible
				phantomCellStyle.setProperty('padding-left', frameWidth);
				phantomCellStyle.setProperty('padding-right', frameWidth);
				phantomCellStyle.setProperty('padding-top', spaceTop);
				phantomCellStyle.setProperty('padding-bottom', spaceBottom);
				phantomCellStyle.setProperty('margin', 0);

				phantomTableWidth = phantomCellStyle.getProperty('width') - phantomCellStyle.getProperty('padding-left') - phantomCellStyle.getProperty('padding-right');
				phantomTableStyle.setWidth(phantomTableWidth);
				phantomTableAttr.setProperty('width', phantomTableWidth);

				allWidths.push({'value': phantomTableWidth, 'descr': 'larghezza della tabella fittizia'});

				phantomTableStyle.setProperty('border-style', 'solid');
				phantomTableStyle.setProperty('border-color', '#000001');
				phantomTableStyle.setProperty('border-width', frameWidth);
				phantomTableAttr.setProperty('border', frameWidth);

				// binding attributes and styles with the objects
				table.setPhantomTableStyles(phantomTableStyle);
				table.setPhantomTableProperties(phantomTableAttr);
				table.setPhantomRowStyles(phantomRowStyle);
				table.setPhantomRowAttributes(phantomRowAttr);
				table.setPhantomCellStyles(phantomCellStyle);
				table.setPhantomCellAttributes(phantomCellAttr);

				// defining a parent style. The properties of the the nested elements
				// will be calculated based on this style.
				parentElemStyle = phantomTableStyle;
			} else {
				// if the table is not framed, mark the row
				rowAttr.setProperty(NEWSLETTER['marker-name'], row.getName());
			}

			// impose row styles and attributes
			rowWidth = parentElemStyle.getProperty('width') - 2 * parentElemStyle.getProperty('padding') - 2 * parentElemStyle.getBorderInfo().width;
			rowStyle.setWidth(rowWidth);
			rowStyle.setProperty('padding', 0);

			// binding the row properties and the row object
			row.setStyles(rowStyle);
			row.setProperties(rowAttr);

			// fill in the row with the cells
			allCellsWidth = rowStyle.getProperty('width') - rowStyle.getProperty('padding');     // sum of all cell widths
			cellWidths = Helper.columnWidths(allCellsWidth, cellWeights);                        // array of column widths

			// creating cells to be inserted into the row
			for (i = 0; i < cols; i++) {
				// It is better to recreate objects for every cell
				// in order to avoid influence of previously imposed values
				cell = new Cell('cell' + i);
				cellStyle = new TableCellStyles();
				cellAttr = new Attributes();

				// imposing cell styles and attributes
				// mark the cell
				cellAttr.setProperty(NEWSLETTER['marker-name'], cell.getName());
				// adjust width of the first and the last cell
				cellWidth = cellWidths[i]  - (i === cols - 1 || i === 0 ? hSpace : 0);
				cellStyle.setWidth(cellWidth);
				allWidths.push({'value': cellWidth, 'descr': 'larghezza della cella numero ' + i});
				cellStyle.dropProperty('padding');
				cellStyle.setProperty('padding-left',  (i === 0) ? hSpace : 0);        // add space to the left for the first cell
				cellStyle.setProperty('padding-right', (i === cols - 1) ? hSpace : 0); // add space to the right for the last cell
				cellStyle.setProperty('padding-top',  spaceTop);
				cellStyle.setProperty('padding-bottom', spaceBottom);
				cellStyle.setProperty('margin', 0);

				if (withSeparator){
					cellStyle.setProperty('border-bottom', '1px solid #cccccc');
				}

				// binding the styles and attributes and the object
				cell.setStyles(cellStyle);
				cell.setProperties(cellAttr);

				// add the newly created cell to the row
				row.appendCell(cell);
			}
			// clone the row created above
			for (i = 0; i < rows; i++){
				table.appendRow(row);
			}

			// if at least one of the values becomes negative, flash alert message
			if (allWidths.some(
				function(el){
					var result = el.value < 0;
					if (result){
						alert('Rilevato un numero negativo:' + el.value + "\n(" + el.descr + ")\nLa tabella non sarà inserita." );
					}
					return result;
				}))
			{
				return null;
			}
			tableStr = table.toHtml();
			tableElem = CKEDITOR.dom.element.createFromHtml(tableStr);
			editor.insertElement(tableElem);
			// CKHelper.insertTableWithHoverEff(editor, tableElem);
		}
	};
});