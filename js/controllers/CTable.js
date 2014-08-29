/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, NEWSLETTER, Table, TableProperties, Properties, Row, RowProperties, Cell, CellProperties, Helper */

/**
 * Table Controller.
 * @module    Controllers
 * @class     CTable
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
var CTable = {
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
	 * @method     parentWidth
	 * @return     {Number}             available width for the children as Unit object
	 *                                  (with properties "value" and "measure")
	 */
	parentWidth: function (editor) {
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
		// console.log('parentWidth returns ', output);
		return output;
	},


	/**
	 * Returns html string for the table with properties specified by the user
	 * in the dialog menu.
	 * @method         template
	 * @param          {Object}             context           context by means the variables are passed from view to the controller
	 * @param          {Object}             editor            editor instance
	 * @return         {DOM.Element}
	 */
	template: function(dialog, editor){
		var INPUTCOLWIDTHNAME = 'widthCol';
			// user input
		var rows = parseInt(dialog.getValueOf('info', 'tblRows'), 10),
			cols = parseInt(dialog.getValueOf('info', 'tblCols'), 10),
			borderWidth = parseInt(dialog.getValueOf('info', 'borderWidth'), 10),
			frameWidth = parseInt(dialog.getValueOf('info', 'frameWidth'), 10),
			vSpace = parseInt(dialog.getValueOf('info', 'vSpace'), 10),
			hSpace = parseInt(dialog.getValueOf('info', 'hSpace'), 10),
			leftVerBord = dialog.getValueOf('borderTab', 'leftVerBord'),
			rightVerBord = dialog.getValueOf('borderTab', 'rightVerBord'),
			intVerBord = dialog.getValueOf('borderTab', 'intVerBord'),
			topHorBord = dialog.getValueOf('borderTab', 'topHorBord'),
			bottomHorBord = dialog.getValueOf('borderTab', 'bottomHorBord'),
			intHorBord = dialog.getValueOf('borderTab', 'intHorBord'),
			cellBorderColor = dialog.getValueOf('borderTab', 'cellBorderColor'),

			// variables to be used in what follows
			phantomCellAttr, phantomTableAttr, phantomRowAttr,
			parentElemStyle, phantomRowWidth, phantomCellWidth, phantomTableWidth,
			i, r, c, table, tableWidth, cellWidths, rowWidth,
			spaceTop, spaceBottom, parentWidth,
			inputField, cellWeights, row, cell,
			cellWidth, allCellsWidth, isFramed, borderCellInfo,
			allWidths = [];
		console.log(leftVerBord, rightVerBord, intVerBord, topHorBord, bottomHorBord, intHorBord);


		// read inserted values
		cellWeights = [];
		for (i = 0; i < cols; i++) {
			// in fact, this check is needed only when the user does not change the default number of the table rows
			inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
			cellWeights[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
		}
		// calculating widths
		var defaultWidth = new Unit(NEWSLETTER.defaultWidth);
		console.log('NEWSLETTER.defaultWidth = ', NEWSLETTER.defaultWidth);
		try {
			tableWidth = Math.min(this.parentWidth(editor).value, defaultWidth.getValue()); // integer, the width in px
		} catch (e){
			tableWidth = defaultWidth.getValue(); // integer, the width in px
		}
		spaceTop = parseInt(vSpace / 2, 10); 			// top white space for each row (cast to integer)
		spaceBottom = vSpace - spaceTop; 				// bottom white space for each row
		isFramed = frameWidth > 0;
		table = new Table();

		// impose styles and attribute values

		table.setStyleProperty('margin', 0);
		table.setStyleProperty('padding', 0);
		table.setWidth(tableWidth);
		table.setProperty(NEWSLETTER['marker-name'], table.getName());

		// binding the styles and attributes and the table object
		if (borderWidth > 0){
			table.setBorder({
				'width': borderWidth,
				'color': '#000001',
				'style': 'solid'
			});
		}
		allWidths.push(tableWidth);

		// creating table row
		row  = new Row();

		// By default, table style is a parent style for the nested rows.
		// The properties of the the nested elements will be calculated based on this style.
		parentElemStyle = table.getStyles();
		parentWidth = tableWidth;
		if (isFramed){
			// creating phantom styles and attributes
			phantomRowAttr    = new RowProperties();
			phantomCellAttr   = new CellProperties();
			phantomTableAttr  = new TableProperties();

			// calculating widths of the phantom elements
			// NB: if the parent table has no border, then its 'border-width' attribute is not set!
			phantomRowWidth = parentElemStyle.getProperty('width') - 2 * parentElemStyle.getProperty('padding') - 2 * parentElemStyle.getBorderInfo().width;

		 	phantomRowAttr.setWidth(phantomRowWidth);
			allWidths.push(phantomRowWidth);
			phantomRowAttr.setStyleProperty('padding', 0);
			phantomRowAttr.setStyleProperty('margin', 0);
			// mark the phantom row
			phantomRowAttr.setProperty(NEWSLETTER['marker-name'], row.getName());
			phantomCellWidth = phantomRowAttr.getStyleProperty('width') - 2 * phantomRowAttr.getStyleProperty('padding') - 2 * frameWidth;
			phantomCellAttr.setWidth(phantomCellWidth);
			allWidths.push(phantomCellWidth);

			// if remains zero, then in MS Outlook the cell content overlaps the border
			// and latter becomes invisible
			phantomCellAttr.setStyleProperty('padding-left', frameWidth);
			phantomCellAttr.setStyleProperty('padding-right', frameWidth);
			phantomCellAttr.setStyleProperty('padding-top', spaceTop);
			phantomCellAttr.setStyleProperty('padding-bottom', spaceBottom);
			phantomCellAttr.setStyleProperty('margin', 0);

			phantomTableWidth = phantomCellAttr.getStyleProperty('width') - phantomCellAttr.getStyleProperty('padding-left') - phantomCellAttr.getStyleProperty('padding-right');
			phantomTableAttr.setWidth(phantomTableWidth);

			allWidths.push(phantomTableWidth);

			phantomTableAttr.setStyleProperty('border-style', 'solid');
			phantomTableAttr.setStyleProperty('border-color', '#000001');
			phantomTableAttr.setStyleProperty('border-width', frameWidth);
			phantomTableAttr.setProperty('border', frameWidth);

			table.setPhantomTableProperties(phantomTableAttr);
			table.setPhantomRowProperties(phantomRowAttr);
			table.setPhantomCellProperties(phantomCellAttr);

			// defining a parent style. The properties of the the nested elements
			// will be calculated based on this style.
			parentElemStyle = phantomTableAttr.getStyles();
			parentWidth = phantomTableWidth;
		} else {
			// if the table is not framed, mark the row
			row.setProperty(NEWSLETTER['marker-name'], row.getName());
		}

		// impose row styles and attributes
		rowWidth = parentWidth - 2 * parentElemStyle.getProperty('padding') - 2 * parentElemStyle.getBorderInfo().width;
		row.setWidth(rowWidth);
		row.setStyleProperty('padding', 0);


		// fill in the row with the cells
		// allCellsWidth = row.getProperty('width') - row.getStyleProperty('padding');     // sum of all cell widths
		allCellsWidth = rowWidth - row.getStyleProperty('padding');                        // sum of all cell widths
		cellWidths = Helper.columnWidths(allCellsWidth, cellWeights);                      // array of column widths
		borderCellInfo = '1px solid ' + cellBorderColor;

		// creating cells to be inserted into the row
		for (r = 0; r < rows; r++){
			row = new Row();
			for (c = 0; c < cols; c++) {
				// It is better to recreate objects for every cell
				// in order to avoid influence of previously imposed values
				cell = new Cell('cell' + c);
				// imposing cell styles and attributes
				// mark the cell
				cell.setProperty(NEWSLETTER['marker-name'], cell.getName());
				// adjust width of the first and the last cell
				cellWidth = cellWidths[c]  - (c === cols - 1 || c === 0 ? hSpace : 0);
				cell.setWidth(cellWidth);
				allWidths.push(cellWidth);
				cell.dropStyleProperty('padding');
				cell.setStyleProperty('padding-left',  (c === 0) ? hSpace : 0);        // add space to the left for the first cell
				cell.setStyleProperty('padding-right', (c === cols - 1) ? hSpace : 0); // add space to the right for the last cell
				cell.setStyleProperty('padding-top',  spaceTop);
				cell.setStyleProperty('padding-bottom', spaceBottom);
				cell.setStyleProperty('margin', 0);

				// setting the most left border
				if (c === 0 && leftVerBord){
					cell.setStyleProperty('border-left', borderCellInfo);
				}

				// setting the most right border
				if (c === cols - 1 && rightVerBord){
					cell.setStyleProperty('border-right', borderCellInfo);
				}

				// setting intermidiate borders (right border is chosen for all cells except last one)
				if (intVerBord && cols > 1 && c !== cols - 1){
					cell.setStyleProperty('border-right', borderCellInfo);
				}

				row.appendCell(cell);

			}
			if (r === 0 && topHorBord){
				row.applyToAll(function(el){
					el.setStyleProperty('border-top', borderCellInfo);
				});
			}
			if (r === rows - 1 && bottomHorBord){
				row.applyToAll(function(el){
					el.setStyleProperty('border-bottom', borderCellInfo);
				});
			}

			if (rows > 1 && r !== rows - 1 && intHorBord){
				row.applyToAll(function(el){
					el.setStyleProperty('border-bottom', borderCellInfo);
				});
			}



			table.appendRow(row);
		}

		var isAllPositive = allWidths.some(function(el){
			return el < 0;
		});
		// if at least one of the values becomes negative, flash alert message
		if (isAllPositive){
			alert("Rilevato un numero negativo:\n" + allWidths.join(' ') + "\nLa tabella non sarà inserita." );
			return null;
		}
		return table.toNode();
	},

	/**
	 * Returns html tag to insert icon.
	 * @method         iconName
	 * @param          {String}             fileName  icon file name. It should be located in "table2/icons" folder of the
	 *                                      custom plugin folder.
	 * @param          {String}             title
	 * @param          {Number|Null}        width     icon width in px
	 * @param          {Number|Null}        height    icon height in px
	 * @return         {String}
	 */
	iconTag: function(fileName, title, width, height){
		if (typeof fileName === 'string' && fileName.trim()){
			var titleText = '',
				heightText = '',
				widthText = '',
				path = NEWSLETTER.customPluginDir + 'table2/icons/' + fileName;
			titleText =' title="' + (title || fileName) + '"';
			heightText = height ? (' height="' + height + '"') : '';
			widthText = width ? (' width="' + width + '"') : '';
			return '<img src="' + path + '"' + titleText + heightText + widthText + '/>';
		}

	}
};