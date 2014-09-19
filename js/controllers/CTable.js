/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, NEWSLETTER, Table, Properties, CKHelper, Helper */

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
	 * @return     {Unit}             available width for the children as Unit object
	 *                                (with properties "value" and "measure")
	 */
	parentWidth: function (editor) {
		var startElem = editor.getSelection().getStartElement(),
			rawWidth = new Unit(startElem.getComputedStyle('width') || NEWSLETTER.width()),
			borderWidthL = new Unit(startElem.getComputedStyle('border-width-left') || 0),
			borderWidthR = new Unit(startElem.getComputedStyle('border-width-right') || 0),
			paddingL = new Unit(startElem.getComputedStyle('padding-left') || 0),
			paddingR = new Unit(startElem.getComputedStyle('padding-right') || 0),
			output;
		output = rawWidth.sub(borderWidthL).sub(borderWidthR).sub(paddingL).sub(paddingR);
		output.value = Math.round(output.value);
		return output;
	},

	getDialogData: function(dialog, editor){
		var defaultUnit = 'px';
		var tableInfo = {
			rows:                 parseInt(dialog.getValueOf('info', 'tblRows'), 10),
			cols:                 parseInt(dialog.getValueOf('info', 'tblCols'), 10),
			tableBorderWidth:     new Unit(parseInt(dialog.getValueOf('borderTab', 'globalBorderWidth'), 10), defaultUnit),
			tableBorderColor:     dialog.getValueOf('borderTab', 'globalBorderColor'),
			phantomBorderWidth:   new Unit(parseInt(dialog.getValueOf('borderTab', 'rowBorderWidth'), 10), defaultUnit),
			phantomBorderColor:   dialog.getValueOf('borderTab', 'rowBorderColor'),
			cellBorders: {
				leftVer:   dialog.getValueOf('borderTab', 'leftVerBord'),
				rightVer:  dialog.getValueOf('borderTab', 'rightVerBord'),
				intVer:    dialog.getValueOf('borderTab', 'intVerBord'),
				topHor:    dialog.getValueOf('borderTab', 'topHorBord'),
				bottomHor: dialog.getValueOf('borderTab', 'bottomHorBord'),
				intHor:    dialog.getValueOf('borderTab', 'intHorBord'),
			},
			cellBorderWidth:    new Unit(parseInt(dialog.getValueOf('borderTab', 'cellBorderWidth'), 10), defaultUnit),
			cellBorderColor:    dialog.getValueOf('borderTab', 'cellBorderColor'),
			globalTableBgColor: dialog.getValueOf('backgroundTab', 'globalTableBgColor'),
			spaceTableGlobal:   new Unit(parseInt(dialog.getValueOf('spacesTab', 'spaceTableGlobal'), 10), defaultUnit),
			paddingTableGlobal: new Unit(parseInt(dialog.getValueOf('spacesTab', 'paddingTableGlobal'), 10), defaultUnit),
			spaceBtwRows:       new Unit(parseInt(dialog.getValueOf('spacesTab', 'spaceBtwRows'), 10), defaultUnit),
			spaceCell:          new Unit(parseInt(dialog.getValueOf('spacesTab', 'spaceCell'), 10), defaultUnit),

			cellWeights: [],
			width: CTable.parentWidth(editor)
		};
		var columnWidthElem = dialog.getContentElement('info', 'columnWidthTable').getElement().$,
			columnFields = columnWidthElem.childNodes,
			i, inputField;
		// weight factors of the columns
		if (columnFields){
			for (i = 0; i < tableInfo.cols; i++) {
				inputField = columnFields[i];
				tableInfo.cellWeights.push(inputField ? parseFloat(inputField.value) : 0);
			}
		}
		return tableInfo;

	},


	/**
	 * Returns html string for the table with properties specified by the user
	 * in the dialog menu.
	 * @method         create
	 * @param          {Object}             context           context by means the variables are passed from view to the controller
	 * @param          {Object}             editor            editor instance
	 * @return         {DOM.Element}
	 */
	create: function(dialog, editor){
		var tableInfo = this.getDialogData(dialog, editor);
		var table = new Table();
		table.configure(tableInfo);
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
	},

	/**
	 * Populates the field of the table plugin dialog.
	 * @method        fillInDialog
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Object}              editor            editor instance
	 * @return        {void}
	 */
	fillInDialog: function(context, editor){
		var tableElem = this.findParentTable(editor);
		if (!tableElem){
			return;
		}
		var factory = NEWSLETTER.factory,
			table = factory.mimic(tableElem.$),
			borderInfo, spaceTableGlobal, paddingTableGlobal, spaceBtwRows, cellBorders, spaceCell,
			phantomTableBorder, phantomTableProp;
		table.disentangle();
		borderInfo = table.getBorder();
		phantomTableBorder = table.getPhantomTableBorder();
		spaceTableGlobal = new Unit(table.getStyleProperty('margin') || 0);
		paddingTableGlobal = new Unit(table.getStyleProperty('padding') || 0);
		// its format is either "5px" or "5px 7px"
		spaceBtwRows = table.getStyleProperty('border-spacing');
		cellBorders = table.getCellBorders();

		// filling in fields for cell borders
		context.setValueOf('borderTab', 'topHorBord', cellBorders.topHor);
		context.setValueOf('borderTab', 'bottomHorBord', cellBorders.bottomHor);
		context.setValueOf('borderTab', 'intHorBord', cellBorders.intHor);
		context.setValueOf('borderTab', 'leftVerBord', cellBorders.leftVer);
		context.setValueOf('borderTab', 'rightVerBord', cellBorders.rightVer);
		context.setValueOf('borderTab', 'intVerBord', cellBorders.intVer);
		context.setValueOf('borderTab', 'cellBorderColor', cellBorders.color);
		context.setValueOf('borderTab', 'cellBorderWidth', cellBorders.width);

		context.setValueOf('borderTab', 'cellBorderWidth', cellBorders.width);

		if (phantomTableBorder.style !== 'none'){
			context.setValueOf('borderTab', 'rowBorderWidth', phantomTableBorder.width);
			context.setValueOf('borderTab', 'rowBorderColor', phantomTableBorder.color);
		}

		if (spaceBtwRows){
			// picking up the last value ("2px") from strings like "1px 2px" or "2px"
			// and transforming it into a Unit object
			spaceBtwRows = new Unit(spaceBtwRows.split(' ').pop() || 0);
		}
		try {
			// table body is an array of Row instances
			spaceCell = table.getBody()[0].getFirst().getStyleProperty('padding');
		} catch (e){
			spaceCell = 0;
		}
		spaceCell = new Unit(spaceCell);  // converting spaceCell into Unit instance

		context.setValueOf('info', 'tblRows', table.rowNum());
		context.getContentElement('info', 'tblRows').disable();
		context.setValueOf('info', 'tblCols', table.colNum());
		context.getContentElement('info', 'tblCols').disable();

		if (table.hasStyleProperty('background-color')){
			context.setValueOf('backgroundTab', 'globalTableBgColor', table.getStyleProperty('background-color'));
		}
		if (borderInfo.style !== 'none'){
			var tableBorderWidth = new Unit(borderInfo.width);
			context.setValueOf('borderTab', 'globalBorderWidth', tableBorderWidth.getValue() || 0);
			context.setValueOf('borderTab', 'globalBorderColor', borderInfo.color || '#000001');
		}
		context.setValueOf('spacesTab', 'spaceTableGlobal', spaceTableGlobal.getValue());
		context.setValueOf('spacesTab', 'paddingTableGlobal', paddingTableGlobal.getValue());
		context.setValueOf('spacesTab', 'spaceBtwRows', spaceBtwRows.times(2).getValue()); // NB: see multiplication by 2
		context.setValueOf('spacesTab', 'spaceCell', spaceCell.getValue());
	},


	/**
	 * Returns the nearest (for current cursor position) parent table. If no table is found among ancestors, `null`
	 * is returned.
	 *
	 * Sought element has tag `table` and attribute NEWSLETTER['marker-name'] equal to {{#crossLink "Table"}}Table{{/crossLink}}
	 * {{#crossLink "Tag/getName:method"}}getName(){{/crossLink}} method.
	 *
	 * @method         findParentTable
	 * @param          {CKEDITOR}      editor
	 * @return         {CKEDITOR.dom.element|null}
	 */
	findParentTable: function(editor){
		var elem = editor.getSelection().getStartElement();
		if (elem){
			var tableElem = CKHelper.findAscendant(elem, function(el){
				return el.getName() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === (new Table()).getName();
			});
			return tableElem;
		}
	},

	/**
	 * Updates parameters of `tableNode` with new ones provided by `editor` dialog.
	 * @method         update
	 * @param          {Object}             context           context by means the variables are passed from view to the controller
	 * @param          {Object}             editor            editor instance
	 * @param          {DOM.Element}        tableNode         node corresponding to a table which parameters are to be updated
	 * @return         {DOM.Element}
	 */
	update: function(dialog, editor, tableNode){
		var table = new Table(),
			dialogData = this.getDialogData(dialog, editor),
			factory = NEWSLETTER.factory,
			currentTable = factory.mimic(tableNode);
		currentTable.disentangle();
		table = currentTable.update(dialogData);
		return table.toNode();
	}
};