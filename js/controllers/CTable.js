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
		var tableInfo = {
			rows:             parseInt(dialog.getValueOf('info', 'tblRows'), 10),
			cols:             parseInt(dialog.getValueOf('info', 'tblCols'), 10),
			tableBorderWidth: parseInt(dialog.getValueOf('borderTab', 'globalBorderWidth'), 10),
			tableBorderColor: dialog.getValueOf('borderTab', 'globalBorderColor'),
			rowBorderWidth:   parseInt(dialog.getValueOf('borderTab', 'rowBorderWidth'), 10),
			rowBorderColor:   dialog.getValueOf('borderTab', 'rowBorderColor'),
			cellBorders: {
				leftVert:  dialog.getValueOf('borderTab', 'leftVerBord'),
				rightVer:  dialog.getValueOf('borderTab', 'rightVerBord'),
				intVer:    dialog.getValueOf('borderTab', 'intVerBord'),
				topHor:    dialog.getValueOf('borderTab', 'topHorBord'),
				bottomHor: dialog.getValueOf('borderTab', 'bottomHorBord'),
				intHor:    dialog.getValueOf('borderTab', 'intHorBord'),
			},
			cellBorderWidth: parseInt(dialog.getValueOf('borderTab', 'cellBorderWidth'), 10),
			cellBorderColor: dialog.getValueOf('borderTab', 'cellBorderColor'),
			spaceBtwRows: parseInt(dialog.getValueOf('spacesTab', 'spaceBtwRows'), 10),
			spaceCell: parseInt(dialog.getValueOf('spacesTab', 'spaceCell'), 10),
			cellWeights: [],
		};

		//  dialog element containing input fields for column widths
		var columnWidthElem = dialog.getContentElement('info', 'columnWidthTable').getElement().$,
			columnFields = columnWidthElem.childNodes,
			table, i, inputField;
		// weight factors of the columns
		if (columnFields){
			for (i = 0; i < tableInfo.cols; i++) {
				inputField = columnFields[i];
				tableInfo.cellWeights.push(inputField ? parseFloat(inputField.value) : 0);
			}
		}
		console.log(tableInfo);
		table = new Table();
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

	}
};