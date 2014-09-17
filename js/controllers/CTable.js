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
	 *                                  (with properties "value" and "measure")
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
		// console.log('parentWidth returns ', output.toString());
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
		console.log('I should fill in the dialog');
		var tableElem = this.findParentTable(editor);
		if (!tableElem){
			return;
		}
		var factory = NEWSLETTER.factory;
		var table = factory.mimic(tableElem.$),
			borderInfo = table.getBorder();
		context.setValueOf('info', 'tblRows', table.rowNum());
		context.getContentElement('info', 'tblRows').disable();
		context.setValueOf('info', 'tblCols', table.colNum());
		context.getContentElement('info', 'tblCols').disable();

		if (table.hasStyleProperty('background-color')){
			context.setValueOf('backgroundTab', 'globalTableBgColor', table.getStyleProperty('background-color'));
		}
		console.log('... Done.');

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
		table = currentTable.update(dialogData);
		return table.toNode();
	}
};