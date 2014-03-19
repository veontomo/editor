/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, columnWidths, Table, Grating, Row, Cell, TableStyle, TableRowStyle, TableCellStyle,  Attributes,Content, TableAttributes, NEWSLETTER, Style, alert, Helper
 */
CKEDITOR.dialog.add('table2Dialog', function (editor) {
	var inputStyle = 'min-width: 3em; width: 5em;text-align: center;';
	// var columnWidthStyle = 'min-width: 3em; text-align: center;';
	// var tableCell = '<td style="border: 2px solid #aeaeae;min-width: 2em;">&nbsp;</td>';
	// var tableRow = '<tr style="padding: 0.5em">' + tableCell + tableCell + tableCell + tableCell + '</tr>';
	// var tableIcon = '<table><tbody> ' + tableRow + tableRow + tableRow + tableRow + tableRow + '</tbody></table>';
	/**
	 * Drops inline attribute named attrName from DOM element
	 * @param  {Object} element 	an inline attribute of  this element will be dropped. The element should respond to jQuery "attr" method.
	 * @param  {string} attrName 	this attribute name will be dropped.
	 * @return {void}
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
		 *
		 * available width = (element width) - (element left border width) - (element right border width) - (element left margin) - (element right margin)
		 *
		 * The element width is supposed to be greater than zero and hence to have a unit of measurement (e.g. 'px').
		 * If not set, widths of other attributes are equal to zero without unit of measurement. In this case one has to set the unit of measurement
		 * equal to the element width.
		 * @return integer    available width for the children as Unit object (with properties "value" and "measure")
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
			label: editor.lang.table.title,
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
			}, {
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
			}

			]
		}],
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

				// variables to be used in what follows
				bogusRowAttr, bogusRowStyle,  bogusCellAttr, bogusCellStyle, bogusTableAttr, bogusTableStyle,
				parentElemStyle, bogusRowWidth, bogusCellWidth, bogusTableWidth,
				i, table, tableWidth, tableElem, cellWidths, rowWidth,
				// rowContentWidth,
				spaceTop, spaceBottom,
				inputField, cellWeights, row, cell,
				// tableStyle, tableAttr,
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
			table.style.setWidth(tableWidth);
			table.style.margin = 0;
			table.style.padding = 0;

			table.attr[NEWSLETTER['marker-name']] = table.getType();
			table.attr.width = tableWidth;

			// binding the styles and attributes and the table object
			// table.style = tableStyle;
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
			rowStyle = new TableRowStyle();
			rowAttr = new Attributes();

			// By default, table style is a parent style for the nested rows.
			// The properties of the the nested elements will be calculated based on this style.
			parentElemStyle = table.style;

			if (isFramed){
				// creating bogus styles and attributes
				bogusRowAttr    = new Attributes();
				bogusRowStyle   = new TableRowStyle();
				bogusCellAttr   = new Attributes();
				bogusCellStyle  = new TableCellStyle();
				bogusTableAttr  = new TableAttributes();
				bogusTableStyle = new TableStyle();

				// calculating widths of the bogus elements
				// NB: if the parent table has no border, then its 'border-width' attribute is not set!
				bogusRowWidth = table.style.width - 2 * table.style.padding - 2 * table.style.getBorderInfo().width;

				bogusRowStyle.setWidth(bogusRowWidth);
				allWidths.push({'value': bogusRowWidth, 'descr': 'larghezza della riga fittizia'});
				bogusRowStyle.padding = 0;
				bogusRowStyle.margin  = 0;
				// mark the bogus row
				bogusRowAttr[NEWSLETTER['marker-name']] =  row.getType();

				bogusCellWidth = bogusRowStyle.width - 2 * bogusRowStyle.padding - 2 * frameWidth;
				bogusCellStyle.setWidth(bogusCellWidth);
				allWidths.push({'value': bogusCellWidth, 'descr': 'larghezza della cella fittizia'});

				// if remains zero, then in MS Outlook the cell content overlaps the border
				// and latter becomes invisible
				bogusCellStyle['padding-left'] = frameWidth;
				bogusCellStyle['padding-right'] = frameWidth;
				bogusCellStyle['padding-top'] = spaceTop;
				bogusCellStyle['padding-bottom'] = spaceBottom;
				bogusCellStyle.margin  = 0;

				bogusTableWidth = bogusCellStyle.width - bogusCellStyle['padding-left'] - bogusCellStyle['padding-right'];
				bogusTableStyle.setWidth(bogusTableWidth);
				bogusTableAttr.width = bogusTableWidth;

				allWidths.push({'value': bogusTableWidth, 'descr': 'larghezza della tabella fittizia'});

				bogusTableStyle['border-style'] = 'solid';
				bogusTableStyle['border-color'] = '#000000';
				bogusTableStyle['border-width'] = frameWidth;
				bogusTableAttr.border = frameWidth;

				// binding attributes and styles with the objects
				table.bogusTableStyle = bogusTableStyle;
				table.bogusTableAttr  = bogusTableAttr;
				table.bogusRowStyle   = bogusRowStyle;
				table.bogusRowAttr    = bogusRowAttr;
				table.bogusCellStyle  = bogusCellStyle;
				table.bogusCellAttr   = bogusCellAttr;

				// defining a parent style. The properties of the the nested elements
				// will be calculated based on this style.
				parentElemStyle = bogusTableStyle;
			} else {
				// if the table is not framed, mark the row
				rowAttr[NEWSLETTER['marker-name']] =  row.getType();
			}

			// impose row styles and attributes
			rowWidth = parentElemStyle.width - 2 * parentElemStyle.padding - 2 * parentElemStyle.getBorderInfo().width;
			rowStyle.setWidth(rowWidth);
			rowStyle.padding = 0;

			// binding the row properties and the row object
			row.style = rowStyle;
			row.attr = rowAttr;

			// fill in the row with the cells
			allCellsWidth = rowStyle.width - rowStyle.padding;     // sum of all cell widths
			cellWidths = Helper.columnWidths(allCellsWidth, cellWeights); // array of column widths

			// creating cells to be inserted into the row
			for (i = 0; i < cols; i++) {
				// It is better to recreate objects for every cell
				// in order to avoid influence of previously imposed values
				cell = new Cell('cell' + i);
				cellStyle = new TableCellStyle();
				cellAttr = new Attributes();

				// imposing cell styles and attributes
				// mark the cell
				cellAttr[NEWSLETTER['marker-name']] = cell.getType();
				// adjust width of the first and the last cell
				cellWidth = cellWidths[i]  - (i === cols - 1 || i === 0 ? hSpace : 0);
				cellStyle.setWidth(cellWidth);
				allWidths.push({'value': cellWidth, 'descr': 'larghezza della cella numero ' + i});
				delete cellStyle.padding;
				cellStyle['padding-left']  = (i === 0) ? hSpace : 0;        // add space to the left for the first cell
				cellStyle['padding-right'] = (i === cols - 1) ? hSpace : 0; // add space to the right for the last cell
				cellStyle['padding-top'] = spaceTop;
				cellStyle['padding-bottom'] = spaceBottom;
				cellStyle.margin = 0;

				// binding the styles and attributes and the object
				cell.style = cellStyle;
				cell.attr = cellAttr;

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
			// call a custom method to insert the table and assign hovering effects on it
			CKHelper.insertTableWithHoverEff(editor, tableElem);
		}
	};
});