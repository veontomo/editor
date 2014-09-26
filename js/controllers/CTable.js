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

	/**
	 * Returns parameters that determine the table internal characteristics. External chracteristic (for the moment,
	 * only "width") is added somewhere else.
	 *
	 * The returning object include the following keys:
	 * <dl>
	 * <dt>rows</dt><dd>number of table rows</dd>
	 * <dt>cols</dt><dd>number of table columns</dd>
	 * <dt>tableBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for table border width</dd>
	 * <dt>tableBorderColor</dt><dd>string for table border color</dd>
	 * <dt>phantomBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for width around table rows</dd>
     * <dt>phantomBorderColor</dt><dd>string for the border around table rows</dd>
     * <dt>cellBorders</dt><dd>boolean variables for borders around table cells:
     * 		<code>leftVer</code>, <code>rightVer</code>, <code>intVer</code>,
     *   	<code>topHor</code>, <code>bottomHor</code>, <code>intHor</code>
     * </dd>
     * <dt>cellBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for border width around table cells</dd>
     * <dt>cellBorderColor</dt><dd>string for border color around table cells</dd>
     * <dt>globalTableBgColor</dt><dd>string for table background color</dd>
     * <dt>spaceTableGlobal</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for the table margin</dd>
     * <dt>paddingTableGlobal</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for the table padding</dd>
     * <dt>spaceBtwRows</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance to set vertical spacing between rows
     * (horizontal is set to 0 px)</dd>
     * <dt>spaceCell</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for table cells padding </dd>
	 * <dt>cellWeights</dt><dd>array of (non-negative) numbers that have meaning of weights with which columns contribute
	 * to the total table width</dd>
	 * </dl>
	 * @method  getDialogData
	 * @param   {Object}        dialog
	 * @return  {Object}
	 */
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
			// width: CTable.parentWidth(editor)
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
		console.log('dialog data: ', tableInfo.cellWeights);
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
		// adding width of the parent element into tableInfo
		tableInfo.width = CTable.parentWidth(editor);
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
	 * Returns instance of {{#crossLink "Table"}}Table{{/crossLink}} corresponding to a DOM.Element
	 * inside which the cursor is situated. If no table is found, nothing is returned.
	 * @method        getTable
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Object}              editor            editor instance
	 * @return        {Table}
	 */
	getTable: function(context, editor){
		var tableElem = this.findParentTable(editor);
		if (tableElem){
			var factory = NEWSLETTER.factory,
				table = factory.mimic(tableElem.$);
			if (table){
				table.disentangle();
				return table;
			}
		}
	},

	/**
	 * Appends `n` input fields to `elem` element in order to insert column width weigths.
	 * @method         addColWeightFields
	 * @param          {DOM.Element}   elem       element to which append input fields
	 * @param          {Integer}       num        number of input fields to append
	 */
	addColWeightFields: function(elem, n){
		if (!elem || !elem.nodeType || !Number.isInteger(n) || n < 0){
			// exit if either elem is not valid node or n is not positive integer
			return;
		}
		var inputField;
		for (i = 0; i < n; i++){
			inputField = document.createElement('input');
			inputField.setAttribute('style', 'min-width: 3em; width: 5em; text-align: center; margin: 0.2em');
			inputField.setAttribute('class', 'cke_dialog_ui_input_text'); // imitate the editor style for input fields
			elem.appendChild(inputField);
		}
	},

	/**
	 * Populates the field of the table plugin dialog.
	 * @method        fillInDialog
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Object}              editor            editor instance
	 * @param         {Table}               table             table whose attributes are to be loaded into the dialog window.
	 * @return        {void}
	 */
	fillInDialog: function(context, editor, table){
		if (!(table instanceof Table)){
			// no table, no pre-fill
			return;
		}
		var profile,
			borderInfo, spaceTableGlobal, paddingTableGlobal,
			spaceBtwRows, cellBorders, spaceCell, phantomTableBorder,
			profileLen, cellWidthsParent, columns, columnsLen, i;

		profile = table.getProfile();
		inputCellParent = context.getContentElement('info', 'columnWidthTable').getElement().$;
		columns = inputCellParent.childNodes;
		columnNum = columns.length;
		// getting table profile with cancelled common factors
		if (profile){
			profile = Helper.divideByGcd(profile);
		}
		// filling in input fields corresponding to column widths
		profileLen = profile.length;
		if (profileLen === columnNum){
			for (i = 0; i < profileLen; i++){
				columns[i].value = profile[i];
			}
		}

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
			tableInfo = this.getDialogData(dialog, editor),
			factory = NEWSLETTER.factory,
			currentTable = factory.mimic(tableNode),
			width = currentTable.getWidth() || NEWSLETTER.width();
		currentTable.disentangle();

		// adding table width into tableInfo
		tableInfo.width = new Unit(width);
		table = currentTable.update(tableInfo);
		return table.toNode();
	}
};