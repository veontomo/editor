/*jslint plusplus: true, white: true */
/*global CKEDITOR, Unit, Table, columnWidths, Table, Grating, Row, Cell, TableStyle, TableRowStyle, TableCellStyle,  Attributes,Content, TableAttributes, NEWSLETTER, Style
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
				'default': '3',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: 'Bordo attorno alle righe (px)',
				id: 'nestedBorderWidth',
				'default': '0',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: editor.lang.image.vSpace + ' (px)',
				"default": "10",
				id: 'vSpace',
				'inputStyle': inputStyle
			}, {
				type: 'text',
				label: editor.lang.image.hSpace + ' (px)',
				"default": "13",
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
				nestedBorderWidth = parseInt(dialog.getValueOf('info', 'nestedBorderWidth'), 10),
				vSpace = parseInt(dialog.getValueOf('info', 'vSpace'), 10),
				hSpace = parseInt(dialog.getValueOf('info', 'hSpace'), 10),

				// variables to be used in what follows
				i, table, tableWidth, tableElem, cellWidths, rowWidth, spaceTop, spaceBottom, inputField, cellWeights, row, cell, cellStyle, tableStyle, tableAttr, rowStyle, rowAttr,
				nestedTableStyle = new TableStyle(),
				nestedCellStyle = new TableCellStyle(),
				nestedRowStyle,  tableStr, isFramed;

			// read inserted values
			cellWeights = [];
			for (i = 0; i < cols; i++) {
				// in fact, this check is needed only when the user does not change the default number of the table rows
				inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
				cellWeights[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
			}

			// calculating widths
			tableWidth = Math.min(parentWidth().value, NEWSLETTER.maxWidth); // integer, the width in px
			rowWidth = tableWidth - 2 * borderWidth - 2 * hSpace;
			spaceTop = parseInt(vSpace / 2, 10); 			// top white space for each row (cast to integer)
			spaceBottom = vSpace - spaceTop; 				// bottom white space for each row
			cellWidths = columnWidths(rowWidth - 2 * nestedBorderWidth, cellWeights); // array of column widths

			isFramed = nestedBorderWidth > 0;

			table = isFramed ? (new Grating()) : (new Table());

			// the whole table styles and properties
			tableStyle = new TableStyle();
			tableAttr  = new TableAttributes();

			// impose styles and attribute values
			tableStyle.setWidth(tableWidth);
			tableAttr[NEWSLETTER['marker-name']] = table.getType();
			tableStyle['padding-left'] = hSpace;
			tableStyle['padding-right'] = hSpace;

			// binding the styles and attributes with the table object
			table.attr = tableAttr;
			table.style = tableStyle;
			if (borderWidth>0){
				table.setBorder({
					'width': borderWidth,
					'color': '#000000',
					'style': 'solid'
				});
			}

			// creating table row
			row  = new Row();
			rowStyle = new TableRowStyle();
			rowAttr = new Attributes();

			// imposing the row styles and attributes
			rowStyle.setWidth(rowWidth);
			rowStyle.padding = 0;
			if (!isFramed){
				rowAttr[NEWSLETTER['marker-name']] =  'Row';
			}

			// binding the styles to the row
			row.style = rowStyle;
			row.attr = rowAttr;

			// fill in the row with the cells
			for (i = 0; i < cols; i++) {
				cell = new Cell('cell');
				cellStyle = new TableCellStyle();
				// imposing cell styles and attributes
				cellStyle.setWidth(cellWidths[i]);
				delete cellStyle.padding;
				cellStyle['padding-left'] = 0;
				cellStyle['padding-right'] = 0;
				cellStyle['padding-top'] = spaceTop;
				cellStyle['padding-bottom'] = spaceBottom;
				cell.style = cellStyle;
				// add the newly created cell to the row
				row.appendCell(cell);
			}
			// clone the row created above
			for (i = 0; i < rows; i++){
				table.appendRow(row);
			}

			if (isFramed){
				nestedRowStyle =  new TableRowStyle();
				nestedCellStyle = new TableCellStyle();
				nestedTableStyle = new TableStyle();
				// here one should impose the styles
				nestedRowStyle.setWidth(rowWidth);
				nestedCellStyle['padding-top'] = spaceTop;
				nestedCellStyle['padding-bottom'] = spaceBottom;

				nestedTableStyle['border-width'] = nestedBorderWidth;
				nestedTableStyle['border-color'] = "#000001";
				nestedTableStyle['border-style'] = "solid";
				// apply the styles  to the table
				table.bogusRowStyle   = nestedRowStyle;
				table.bogusRowAttr[NEWSLETTER['marker-name']] = 'Row';
				table.bogusCellStyle  = nestedCellStyle;
				table.bogusTableStyle = nestedTableStyle;
			}

			tableStr = table.toHtml();
			tableElem = CKEDITOR.dom.element.createFromHtml(tableStr);
			// call a custom method to insert the table and assign hovering effects on it
			editor.insertTableWithHoverEff(tableElem);
		}
	};
});