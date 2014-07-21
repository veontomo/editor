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
	template: function(context, editor){
		var INPUTCOLWIDTHNAME = 'widthCol';
		var dialog = context,
			// user input
			rows = parseInt(dialog.getValueOf('info', 'tblRows'), 10),
			cols = parseInt(dialog.getValueOf('info', 'tblCols'), 10),
			borderWidth = parseInt(dialog.getValueOf('info', 'borderWidth'), 10),
			frameWidth = parseInt(dialog.getValueOf('info', 'frameWidth'), 10),
			vSpace = parseInt(dialog.getValueOf('info', 'vSpace'), 10),
			hSpace = parseInt(dialog.getValueOf('info', 'hSpace'), 10),
			withSeparator = dialog.getValueOf('info',  'trSeparator'),

			// variables to be used in what follows
			phantomCellAttr, phantomTableAttr, phantomRowAttr,
			parentElemStyle, phantomRowWidth, phantomCellWidth, phantomTableWidth,
			i, table, tableWidth, cellWidths, rowWidth,
			spaceTop, spaceBottom, parentWidth,
			inputField, cellWeights, row, cell,
			cellWidth, allCellsWidth, isFramed,
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
			tableWidth = Math.min(this.parentWidth(editor).value, NEWSLETTER.maxWidth); // integer, the width in px
		} catch (e){
			tableWidth = NEWSLETTER.maxWidth; // integer, the width in px
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

		// creating cells to be inserted into the row
		for (i = 0; i < cols; i++) {
			// It is better to recreate objects for every cell
			// in order to avoid influence of previously imposed values
			cell = new Cell('cell' + i);
			// imposing cell styles and attributes
			// mark the cell
			cell.setProperty(NEWSLETTER['marker-name'], cell.getName());
			// adjust width of the first and the last cell
			cellWidth = cellWidths[i]  - (i === cols - 1 || i === 0 ? hSpace : 0);
			cell.setWidth(cellWidth);
			allWidths.push(cellWidth);
			cell.dropStyleProperty('padding');
			cell.setStyleProperty('padding-left',  (i === 0) ? hSpace : 0);        // add space to the left for the first cell
			cell.setStyleProperty('padding-right', (i === cols - 1) ? hSpace : 0); // add space to the right for the last cell
			cell.setStyleProperty('padding-top',  spaceTop);
			cell.setStyleProperty('padding-bottom', spaceBottom);
			cell.setStyleProperty('margin', 0);

			if (withSeparator){
				cell.setStyleProperty('border-bottom', '1px solid #cccccc');
			}
			row.appendCell(cell);
		}

		// clone the row created above
		for (i = 0; i < rows; i++){
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
	 * @param          {String}             path      path to icon file.
	 * @param          {String}             title
	 * @param          {Number|Null}        width     icon width in px
	 * @param          {Number|Null}        height    icon height in px
	 * @return         {String}
	 */
	iconTag: function(path, title, width, height){
		if (typeof path === 'string' && path.trim()){
			var titleText = '',
				heightText = '',
				widthText = '';
			titleText = title ? (' title="' + title + '"') : '';
			heightText = height ? (' height="' + height + '"') : '';
			widthText = width ? (' width="' + width + '"') : '';
			return '<img src="' + path + '"' + titleText + heightText + widthText + '/>';
		}

	}
};