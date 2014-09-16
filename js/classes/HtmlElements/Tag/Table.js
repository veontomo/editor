/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Properties, Cell, Helper, TableProperties, Properties, Row, Tag, Content, RowProperties, CellProperties, NEWSLETTER, Unit */

/**
* Represents table.
*
* Table might be a plain one or a framed one. Table is called framed if each of its rows contains only one cell,
* and each of these cells contains another table. These three elements - row, cell and table - are called phantom ones.
* Only {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} of the phantom elements are of interest.
*
* Below it is depicted a framed table. Dotted lines correspond to the phantom elements, solid - to "normal" ones.
* <span style="color: black">Black color corresponds to table</span>,
* <span style="color: orange">orange - to table row</span>,
* <span style="color: green">green - to table cell</span>.
* <style>
* .phantom, .normal{
*	border-width: 2px;
*	padding: 4px;
* 	margin: 4px;
*	border-collapse: separate;
* }
*
* .phantom {
* 	border-style: dashed;
* }
* .normal {
*   border-style: solid;
* }
* table.phantom, table.normal {
*	border-color: #2818B1;
*	padding: 10px;
* }
* td.phantom, td.normal{
* 	border-color: #00A779;
* }
* tr.phantom, tr.normal {
* 	outline-width: 2px;
* 	outline-color: #FF9C00;
* }
* tr.phantom{
* 	outline-style: dashed;
* }
* tr.normal {
* 	outline-style: solid;
* }

* </style>
*
* <table class="normal">
* 	<tr class="phantom">
*  		<td class="phantom">
*  			<table class="phantom">
*  				<tr class="normal">
*  					<td class="normal">
*  						first cell of the first line
*  					</td>
*  					<td class="normal">
*  						second cell of the first line
*  					</td>
*  				</tr>
*  			</table>
*  		</td>
*   </tr>
* 	<tr class="phantom">
*  		<td class="phantom">
*  			<table class="phantom">
*  				<tr class="normal">
*  					<td class="normal">
*  						first cell of the second line
*  					</td>
*  					<td class="normal">
*  						second cell of the second line
*  					</td>
*  				</tr>
*  			</table>
*  		</td>
*   </tr>
* </table>
* @module        HtmlElements
* @class         Table
* @constructor
* @extends       Tag
*/
function Table() {
	"use strict";
	if (!(this instanceof Table)) {
		return new Table();
	}
	// inherit tag properties
	Tag.call(this);


	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "table"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Table"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableStyles"}}TableStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/attributes:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableAttributes"}}TableAttributes{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('table');
	this.setName('Table');
	this.setProperties(new TableProperties());


	/**
	 * Phantom cell.
	 * @property       {Cell}    phantomCell
	 * @type           {Cell}
	 * @private
	 * @default        undefined
	 */
	var phantomCell;

	/**
	 * Phantom row.
	 * @property       {Row}    phantomRow
	 * @type           {Row}
	 * @private
	 * @default        undefined
	 */
	var phantomRow;


	/**
	 * Phantom table {{#crossLink "Styles"}}styles{{/crossLink}}.
	 * @property       {Table}    phantomTable
	 * @type           {Table}
	 * @private
	 * @default        undefined
	 */
	var phantomTable;

	/**
	 * Initializes {{#crossLink "Table/phantomRow:property"}}phantomRow{{/crossLink}},
	 * {{#crossLink "Table/phantomCell:property"}}phantomCell{{/crossLink}},
	 * {{#crossLink "Table/phantomTable:property"}}phantomTable{{/crossLink}} if not initialized.
	 * If they are initialized, no re-initialization happens.
	 * @method          initPhantoms
	 * @return          void
	 */
	this.initPhantoms = function(){
		if (!(phantomRow instanceof Row)){
			phantomRow = new Row();
		}
		if (!(phantomCell instanceof Cell)){
			phantomCell = new Cell();
		}
		if (!(phantomTable instanceof Table)){
			phantomTable = new Table();
		}
	};


	/**
	 * {{#crossLink "Table/phantomCellStyles:property"}}phantomCellStyles{{/crossLink}} getter.
	 * @method         getPhantomCellStyles
	 * @return         {Styles}
	 */
	this.getPhantomCellStyles = function(){
		if (phantomCell instanceof Cell){
			return phantomCell.getStyles();
		}

	};

	/**
	 * {{#crossLink "Table/phantomCellStyles:property"}}phantomCellStyles{{/crossLink}} setter.
	 * @method         setPhantomCellStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomCellStyles = function(stl){
		if (stl !== undefined){
			this.initPhantoms();
			if (stl instanceof Properties){
				phantomCell.setStyles(stl);
			} else {
				phantomCell.setStyles(new Properties(stl));
			}
		}
	};


	/**
	 * {{#crossLink "Table/phantomCellStyles:property"}}phantomRowStyles{{/crossLink}} getter.
	 * @method         getPhantomRowStyles
	 * @return         {Styles}
	 */
	this.getPhantomRowStyles = function(){
		if (phantomRow instanceof Row){
			return phantomRow.getStyles();
		}
	};

	/**
	 * {{#crossLink "Table/phantomRowStyles:property"}}setPhantomRowStyles{{/crossLink}} setter.
	 * @method         setPhantomRowStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomRowStyles = function(stl){
		if (stl !== undefined){
			this.initPhantoms();
			if (stl instanceof Properties){
				phantomRow.setStyles(stl);
			} else {
				phantomRow.setStyles(new Properties(stl));
			}
		}
	};


	/**
	 * {{#crossLink "Table/phantomTableStyles:property"}}phantomTableStyles{{/crossLink}} getter.
	 * @method         getPhantomTableStyles
	 * @return         {Styles}
	 */
	this.getPhantomTableStyles = function(){
		if (phantomTable instanceof Table){
			return phantomTable.getStyles();
		}
	};

	/**
	 * {{#crossLink "Table/phantomTableStyles:property"}}phantomTableStyles{{/crossLink}} setter.
	 * @method         setPhantomTableStyles
	 * @param          {Any}             stl
	 * @return         {void}
	 */
	this.setPhantomTableStyles = function(stl){
		if (stl !== undefined){
			this.initPhantoms();
			if (stl instanceof Properties){
				phantomTable.setStyles(stl);
			} else {
				phantomTable.setStyles(new Properties(stl));
			}
		}
	};


	/**
	 * {{#crossLink "FramedTable/phantomCellAttributes:property"}}phantomCellAttributes{{/crossLink}} getter.
	 * @method         getPhantomCellAttributes
	 * @return         {Properties}
	 */
	this.getPhantomCellAttributes = function(){
		if (phantomCell instanceof Cell){
			return phantomCell.getProperties();
		}

	};

	/**
	 * {{#crossLink "FramedTable/phantomCellAttributes:property"}}phantomCellAttributes{{/crossLink}} setter.
	 * @method         setPhantomCellAttributes
	 * @param          {Properties}             prop
	 * @return         {void}
	 */
	this.setPhantomCellAttributes = function(prop){
		this.initPhantoms();
		phantomCell.setProperties(prop);
	};

	/**
	 * Returns `true` if the content of the instance contains the only element
	 * which is a "tbody" tag instance.
	 * @method           hasTBody
	 * @return           {Boolean}
	 */
	// this.hasTBody = function(){
	// 	console.log(this.getElements());
	// 	return this.getElements().length === 1 && this.getElements()[0].getTag() === 'tbody';
	// }

	/**
	 * {{#crossLink "FramedTable/phantomRowAttributes:property"}}phantomRowAttributes{{/crossLink}} getter.
	 * @method         getPhantomRowAttributes
	 * @return         {Properties}
	 */
	this.getPhantomRowAttributes = function(){
		if (phantomRow instanceof Row){
			return phantomRow.getProperties();
		}

	};

	/**
	 * Sets {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} of
	 * {{#crossLink "Table/phantomRow:property"}}phantomRow{{/crossLink}}.
	 * @method         setPhantomRowProperties
	 * @param          {Properties}             prop
	 * @return         {void}
	 * @since          0.0.5
	 */
	this.setPhantomRowProperties = function(prop){
		this.initPhantoms();
		phantomRow.setProperties(prop);
	};

	/**
	 * Sets {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} of
	 * {{#crossLink "Table/phantomCell:property"}}phantomCell{{/crossLink}}.
	 * @method         setPhantomCellProperties
	 * @param          {Properties}             prop
	 * @return         {void}
	 * @since          0.0.5
	 */
	this.setPhantomCellProperties = function(prop){
		this.initPhantoms();
		phantomCell.setProperties(prop);
	};


	/**
	 * {{#crossLink "FramedTable/phantomTableAttributes:property"}}phantomTableAttributes{{/crossLink}} getter.
	 * @method         getPhantomTableAttributes
	 * @return         {Properties}
	 */
	this.getPhantomTableAttributes = function(){
		if (phantomTable instanceof Table){
			return phantomTable.getProperties();
		}

	};

	/**
	 * Sets private variable {{#crossLink "Tag/_property:property"}}_property{{/crossLink}} of
	 * {{#crossLink "Table/phantomTable:property"}}phantomTable{{/crossLink}}.
	 * @method         setPhantomTableProperties
	 * @param          {Any}                prop
	 * @since          0.0.5
	 * @return         {void}
	 */
	this.setPhantomTableProperties = function(prop){
		this.initPhantoms();
		phantomTable.setProperties(prop);
	};


	/**
	 * {{#crossLink "Table/phantomTable:property"}}phantomTable{{/crossLink}}
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} getter.
	 * Alias for {{#crossLink "Tag/getProperties:property"}}getProperties{{/crossLink}}
	 * method.
	 * @method         getPhantomTableProperties
	 * @since          0.0.5
	 * @return         {Properties|Null}
	 */
	this.getPhantomTableProperties = function(){
		return phantomTable.getProperties();
	};


	/**
	 * {{#crossLink "Table/phantomCell:property"}}phantomCell{{/crossLink}}
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} getter.
	 * Alias for {{#crossLink "Tag/getProperties:property"}}getProperties{{/crossLink}}
	 * method.
	 * @method         getPhantomCellProperties
	 * @since          0.0.5
	 * @return         {Properties|Null}
	 */
	this.getPhantomCellProperties = function(){
		return phantomCell.getProperties();
	};


	/**
	 * {{#crossLink "Table/phantomRow:property"}}phantomRow{{/crossLink}}
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} getter.
	 * Alias for {{#crossLink "Tag/getProperties:property"}}getProperties{{/crossLink}}
	 * method.
	 * @method         getPhantomRowProperties
	 * @since          0.0.5
	 * @return         {Properties|Null}
	 */
	this.getPhantomRowProperties = function(){
		return phantomRow.getProperties();
	};

	/**
	 * Returns {{#crossLink "Tag/openingTag:method"}}opening{{/crossLink}} or
	 * {{#crossLink "Tag/closingTag:method"}}closing{{/crossLink}} tag for one of the
	 * phantom elements: {{#crossLink "Table/phantomCell:property"}}cell{{/crossLink}},
	 * {{#crossLink "Table/phantomRow:property"}}row{{/crossLink}},
	 * {{#crossLink "Table/phantomTable:property"}}table{{/crossLink}}.
	 * @method         getPhantomTag
	 * @param          {String}             phantomElem       "cell", "row", "table" (case insensitive)
	 * @param          {String|Null}        type              "open" or "close" (case insensitive).
	 *                                                        If missing, supposed to be equal to "open".
	 * @return         {String}
	 */
	this.getPhantomTag = function(phantomElem, type){
		if (typeof phantomElem === 'string'){
			var phElemName = phantomElem.toLowerCase(),
				tagType = (typeof type === 'string' && type.toLowerCase() === 'close') ? 'closingTag' : 'openingTag';
			if (phElemName === 'cell' && phantomCell !== undefined && typeof phantomCell[tagType] === 'function') {
				return phantomCell[tagType]();
			}
			if (phElemName === 'row' && phantomRow !== undefined && typeof phantomRow[tagType] === 'function') {
				return phantomRow[tagType]();
			}
			if (phElemName === 'table' && phantomTable !== undefined && typeof phantomTable[tagType] === 'function') {
				return phantomTable[tagType]();
			}
		}
	};


	/**
	 * The number of the rows in the table. It scans {{#crossLink "Table/content:property"}}content{{/crossLink}}
	 * of the instance until the first occurrence of `tbody` tag. Once found, its length is returned. If not found,
	 * zero is returned.
	 * @method  rowNum
	 * @return {Number}
	 */
	this.rowNum = function(){
		var cntn = this.getBody();
		return cntn ? cntn.length : 0;
	};

	/**
	 * Sets `tbody` part of the table. The argument must be either a {{#crossLink "Row"}}Row{{/crossLink}}
	 * instance or an array of {{#crossLink "Row"}}Row{{/crossLink}} instances.
	 * Otherwise, an error is thrown.
	 *
	 * Even though not more than one instance of `tbody` must be present among
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * {{#crossLink "Content/elements:property"}}elements{{/crossLink}}, all `tbody` tags are first dropped
	 * from {{#crossLink "Tag/content:property"}}content{{/crossLink}} and then the requested one is inserted.
	 * @method         setBody
	 * @param          {array|Row}  body    array of {{#crossLink "Row"}}Row{{/crossLink}} instances or
	 *                                      {{#crossLink "Row"}}Row{{/crossLink}} instance
	 * @return         {void}
	 * @since          0.0.5
	 */
	this.setBody = function(body){
		var bodyArr = Array.isArray(body) ? body : [body],
			valid;
		valid = bodyArr.every(function(elem){
			return (elem instanceof Row);
		});

		if (!valid){
			throw new Error('Instance of Row class is required to be set as tbody!');
		}
		var cntn = this.getContent(),
			oldTBodyPos = cntn.findTagPos('tbody'),
			newTbody = new Tag('tbody');
		newTbody.setElements(bodyArr);
		if (oldTBodyPos.length > 0){
			oldTBodyPos.sort(function(a, b){return b - a;});  // sort elements in descreasing order
			oldTBodyPos.forEach(function(pos){
				cntn.dropElemAt(pos);
			});
		}
		cntn.appendElem(newTbody);
		this.setContent(cntn);
	};


	/**
	 * Alias for {{#crossLink "Table/setBody:method"}}setBody{{/crossLink}} method.
	 *
	 * Overrides parent method {{#crossLink "Tag/setElements:method"}}setElements{{/crossLink}}.
	 * @method         setElements
	 * @param          {array|Row}  elems    array of {{#crossLink "Row"}}Row{{/crossLink}} instances or
	 *                                      {{#crossLink "Row"}}Row{{/crossLink}} instance
	 */
	this.setElements = function(elems){
		this.setBody(elems);
	};

	/**
	 * Returns array of {{#crossLink "Row"}}Row{{/crossLink}} instances in `tbody` part of the table.
	 * @method         getBody
	 * @return         {Array}              one dimensional array of
	 *                                      {{#crossLink "Row"}}Row{{/crossLink}} instances
	 *                                      or empty array
	 * @since          0.0.5
	 */
	this.getBody = function(){
		var cntn = this.getContent(),
			tbody = cntn.getFirstEntryOfTag('tbody');
		return tbody ? tbody.getElements() : [];
	};

	/**
	 * Returns footer of the table.
	 * @method         getFooter
	 * @return         {Tag|Null}
	 */
	this.getFooter = function(){
		var cntn = this.getContent();
		if (cntn){
			return cntn.getFirstEntryOfTag('tfoot');
		}
	};

	/**
	 * Returns header of the table.
	 * @method         getHeader
	 * @return         {Tag|Null}
	 */
	this.getHeader = function(){
		var cntn = this.getContent();
		if (cntn){
			return cntn.getFirstEntryOfTag('thead');
		}
	};

	/**
	 * Returns header of the table.
	 * @method         getCaption
	 * @return         {Tag|Null}
	 */
	this.getCaption = function(){
		var cntn = this.getContent();
		if (cntn){
			return cntn.getFirstEntryOfTag('caption');
		}
	};

	/**
	 * Appends a row to the content property. If the argument is not a Row instance, an error is thrown.
	 * @method   appendRow
	 * @param    {Object} row     a row to append. If not a Row instance, an error is thrown.
	 * @return   {void}
	 */
	this.appendRow = function(row){
		if (!(row instanceof Row)){
			throw new Error('The argument is not a Row instance!');
		}
		var cntn = this.getContent(),
			tbody = cntn.getFirstEntryOfTag('tbody');
		if (tbody){
			tbody.appendElem(row);
			// this.
		} else {
			tbody = new Tag('tbody');
			tbody.setElements([row]);
			cntn.appendElem(tbody);
		}
		// cntn.filterOut(function(el){return elem.getTag() === 'tbody';});
		this.setContent(cntn);
	};

	/**
	 * Gives a two-dimensional array [[w_11, w_12, ..., w_1n], ..., [w_m1, w_m2, ..., w_m3]]
	 * where w_ij is width of the cell located in the row i and column j.
	 * @method  getMatrix
	 * @return {Array}
	 */
	this.getMatrix = function(){
		var output = [],
			rowsNum = this.rowNum(), i,
			body = this.getBody();
		for (i = 0; i < rowsNum; i++){
			output.push(body[i].getCellWidths());
		}
		//console.log('Table::getMatrix() returning ', output);
		return output;
	};

	/**
	 * Returns array of widths of the cells in the table rows if all rows
	 * have the same cell widths. Otherwise null is returned.
	 * @method  getProfile
	 * @return {Array|Null}
	 */
	this.getProfile = function (){
		var output = this.isSameWidths() ? this.getMatrix()[0] : null;
		//console.log('Table::getProfile() returning ', output);
		return output;
	};

	/**
	 * Imposes the widths of all cell in all rows of the table body. If the argument is not array, an error is thrown.
	 * If the array length is different from the number of columns, an error is thrown. Otherwise, it is called
	 * method {{#crossLink "Row/setCellWidths:method"}}setCellWidths{{/crossLink}} on each row of table body.
	 * @method         setProfile
	 * @param          {Array}         profile      an array of cell widths that will be applied to each row.
	 * @return         {void}
	 */
	this.setProfile = function(profile){
		var len = this.rowNum(),
			cols = this.colNum(),
			i;
		if (!Array.isArray(profile)){
			throw new Error('Wrong argument type: array expected.');
		}
		if (profile.length !== cols){
			throw new Error('Wrong input array length!');
		}
		var tbody = this.getBody();
		for (i = 0; i < len; i++){
			tbody[i].setCellWidths(profile);
		}
		this.setBody(tbody);
	};

	/**
	 * Inserts a cell "cell" into a given position "pos" of each row of the table.
	 * If the table has 5 columns, then after insertion it will have 5+1=6 columns.
	 * Position "pos" will correspond to the index of the inserted cell in the row after insertion.
	 * "pos" must be a valid cell number into the table after insertion. So, for the example above,
	 * the valid values for "pos" are 0, 1, 2, 3, 4 and 5.
	 * @method insertColAt
	 * @param  {Cell} 	cell
	 * @param  {Number} pos
	 * @return {void}
	 */
	this.insertColAt = function(pos, cell){
		cell = cell || (new Cell());
		var colNum = this.colNum(),
			rowNum = this.rowNum(),
			tbody = this.getBody(),
			i;

		if (colNum <= 0 || pos < 0 || pos > colNum){
			throw new Error('Wrong index for the cell to insert!');
		}
		if (pos < colNum){
			for (i = 0; i < rowNum; i++){
				tbody[i].insertCellAt(pos, cell);
			}
		} else {
			for (i = 0; i < rowNum; i++){
				tbody[i].appendCell(cell);
			}
		}
		this.setBody(tbody);

		return null;
	};


	/**
	 * Knocks out given column from the table. The operation is delegated to
	 * {{#crossLink "Row/knockOutCell:method"}}Row::knockOutCell{{/crossLink}} method.
	 * @method         knockOutCol
	 * @param          {integer} 	   colNum        the number of the column to be knocked out. Numeration starts with 0.
	 * @return         {void}
	 */
	this.knockOutCol = function(colNum){
		var rowsNum = this.rowNum(),
			tbody = this.getBody(),
			i;
		for (i = 0; i < rowsNum; i++){
			tbody[i].knockOutCell(colNum);
		}
		this.setBody(tbody);
	};


	/**
	 * Drops specified column from the table. The operation is delegated to the `Row::dropCellAt()`
	 * @method dropColAt
	 * @param  {integer} 	colNum           the number of the column to delete. Numeration starts with 0.
	 * @return {void}
	 */
	this.dropColAt = function(colNum){
		var rowsNum = this.rowNum(),
			tbody = this.getBody(),
			i;
		for (i = 0; i < rowsNum; i++){
			tbody[i].dropCellAt(colNum);
		}
		this.setBody(tbody);
	};

	/**
	 * Gives the number of columns in the table or null if not all rows have the same number of cells.
	 * The operation is delegated to the `Row::cellNum()`.
	 * @method  colNum
	 * @return {Number|null}
	 */
	this.colNum = function(){
		var rowNum = this.rowNum(),
			firstRowCellNum, i, tbody;
		// if table has no rows, return 0 as number of column
		if (rowNum === 0){
			return 0;
		}
		tbody = this.getBody();
		firstRowCellNum = tbody[0].cellNum();
		// if the table has a unique row
		if (rowNum === 1){
			return firstRowCellNum;
		}

		for (i = 1; i < rowNum; i++){
			if (tbody[i].cellNum() !== firstRowCellNum){
				return null;
			}
		}
		return firstRowCellNum;
	};

	/**
	 * Whether all rows in the table have the same cell widths.
	 * @method isSameWidth
	 * @return {Boolean} true, if all rows have the same cells' widths, false otherwise.
	 */
	this.isSameWidths = function(){
		var matrix = this.getMatrix(),
			rowsNum = matrix.length,
			output = true,
			firstRow, firstRowLen, i, j;
			//console.log('table::isSameWidth: matrix=', matrix);
		// only if the number of rows is bigger than 1
		if (rowsNum > 1){
			// compare the first row with the rest
			firstRow = matrix[0];
			firstRowLen = firstRow.length;
			for (i = 1; i < rowsNum; i++){
				if (matrix[i].length !== firstRowLen){
					output = false;
					break;
				}
				// compare element by element
				for (j = 0; j < firstRowLen; j++){
					if(matrix[i][j] !== firstRow[j]){
						output = false;
						break;
					}
				}
				// exit as well from outer loop if necessary
				if (!output){
					break;
				}
			}
		}
		return output;
	};

	/**
	 * Set the border of the table.
	 *
	 * It gets a copy of current {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}, applies
	 * {{#crossLink "Properties/setBorder:method"}}Properties.setBorder(){{/crossLink}} method to it and
	 * sets instance's properties to the resulted properties.
	 * @method         setBorder
	 * @param          {Object}     borderInfo
	 * @return         {void}
	 */
	this.setBorder = function(borderInfo){
		var newProp = this.getProperties();
		newProp.setBorder(borderInfo);
		this.setProperties(newProp);
	};

	/**
	 * Returns object with information about border properties (style, width, color).
	 *
	 * It is an alias of {{#crossLink "Properties/getBorder:method"}}Properties.getBorder(){{/crossLink}}.
	 * @method         getBorder
	 * @return         {Object}
	 * @since          0.0.6
	 */
	this.getBorder = function(){
		return this.getProperties().getBorder();
	};

	/**
	 * Removes the border of the table.
	 *
	 * It updates {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} by applying to it
	 * {{#crossLink "Properties/removeBorder:property"}}removeBorder{{/crossLink}} method.
	 * @method  removeBorder
	 * @return {void}
	 */
	this.removeBorder = function(){
		var newProp = this.getProperties();
		newProp.removeBorder();
		this.setProperties(newProp);
	};

	/**
	 * Returns true if the table is fragmented, and false otherwise. It takes table rows and calls method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} on each of them until
	 * first "false" is encountered.
	 *
	 * A table is a __framed table__ if all table rows have only one cell and this cell contains
	 * only one element that is a Table instance.
	 * @method         isFragmented
	 * @return         {Boolean}            true if the table is framed, and false otherwise
	 */
	this.isFragmented = function(){
		if (this.rowNum() === 0){
			return false;
		}
		return this.getBody().every(function(row){
			var res = row.onlyTableInside();
			return res;
		});
	};

	/**
	 * Returns `true` if at least one of the following variables  {{#crossLink "Table/phantomRow:property"}}phantomRow{{/crossLink}},
	 * {{#crossLink "Table/phantomCell:property"}}phantomCell{{/crossLink}},
	 * {{#crossLink "Table/phantomTable:property"}}phantomTable{{/crossLink}} is set. `False` otherwise.
	 * @method         isFramed
	 * @return         {Boolean}
	 */
	this.isFramed = function(){
		return (phantomRow !== undefined) || (phantomCell !== undefined) || (phantomTable !== undefined);
	};

	/**
	 * Unsets phantom properties. After resetting those properties, the table becomes a table without frame.
	 * @method unsetPhantom
	 * @return {void}
	 */
	this.unsetPhantom = function(){
		phantomRow = undefined;
		phantomCell = undefined;
		phantomTable = undefined;
	};

	/**
	 * Appends the style to the column. If the column exists, the method call `Row::appendStyleToCell()`
	 * on each of the table rows.
	 * @method appendStyleToCol
	 * @param  {Number}        colNum    column number to which the style is to be appended.
	 * @param  {Style|Object}  style     Style or Object to be appended
	 * @return {void}
	 */
	this.appendStyleToCol = function(colNum, style){
		var colNumInt = parseInt(colNum, 10),
			colLen = this.colNum(),
			rowLen = this.rowNum(),
			tbody = this.getBody(),
			i;
		if (colNumInt === colNum && colNum >= 0 && colNum < colLen) {
			for (i = 0; i < rowLen; i++){
				tbody[i].appendStyleToCellAt(colNum, style);
			}
			this.setBody(tbody);
		} else {
			throw new Error('The column is not present!');
		}
	};

	/**
	 * Generates html representation of the table body. If table is framed, wraps each element of
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} with strings corresponding to phantom
	 * elements. Generation of html string of each {{#crossLink "Tag/content:property"}}content element{{/crossLink}}
	 * is delegated to its `toHtml` method (if an element has no `toHtml` method, this element gets ignored).
	 * @method         bodyToHtml
	 * @param          {Boolean}            withFrame         whether the table is framed or not.
	 * @return         {String}
	 * @since          0.0.5
	 */
	this.bodyToHtml = function(){
		var prologue = '',
			epilogue  = '',
			bodyHtml = '';
		if (this.isFramed()){
			epilogue = this.getPhantomTag('row', 'open') + this.getPhantomTag('cell', 'open') + this.getPhantomTag('table', 'open');
			prologue = this.getPhantomTag('table', 'close') + this.getPhantomTag('cell', 'close') + this.getPhantomTag('row', 'close');
		}
		this.getBody().forEach(function(el){
			if (typeof el.toHtml === 'function'){
				bodyHtml += epilogue + el.toHtml() + prologue;
			}
		});
		return bodyHtml;
	};

	/**
	 * Generates html code corresponding to this instance. Makes use of
	 * {{#crossLink "Table/bodyToHtml:method"}}bodyToHtml{{/crossLink}} method.
	 *
	 * This method overrides parent one {{#crossLink "Tag/toHtml:method"}}toHtml{{/crossLink}} because one has to manage
	 * presence of properties {{#crossLink "Table/phantomTable:property"}}phantomTable{{/crossLink}},
	 * {{#crossLink "Table/phantomCell:property"}}phantomCell{{/crossLink}} and
	 * {{#crossLink "Table/phantomRow:property"}}phantomRow{{/crossLink}}.
	 * @method         toHtml
	 * @return         {String}
	 */
	this.toHtml = function () {
		var tableHtml  = this.openingTag();
		var that = this;

		this.getElements().forEach(function(el){
			if (typeof el.toHtml === 'function'){
				if (el.getTag() === 'tbody'){
					tableHtml += el.openingTag() + that.bodyToHtml() + el.closingTag();
				} else {
					tableHtml += el.toHtml();
				}

			}
		});
		tableHtml += this.closingTag();
		return tableHtml;
	};


	/**
	 * Generates instance of [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element)
	 * corresponding to this instance.
	 *
	 * This method overrides parent one  {{#crossLink "Tag/toNode:method"}}toNode{{/crossLink}} because
	 * one has to manage presence of properties {{#crossLink "Table/phantomTable:property"}}phantomTable{{/crossLink}},
	 * {{#crossLink "Table/phantomCell:property"}}phantomCell{{/crossLink}} and
	 * {{#crossLink "Table/phantomRow:property"}}phantomRow{{/crossLink}}.
	 * @method         toNode
	 * @return         {DOM.Element}
	 */
	this.toNode = function(){
		var el = document.createElement(this.getTag());
		this.getProperties().decorateElement(el);
		if (this.isFramed()){
			var body = this.getBody();
			body.forEach(function(row){
				var rowNode = row.toNode();
				var phantomRowNode = phantomRow.toNode();
				var phantomCellNode = phantomCell.toNode();
				var phantomTableNode = phantomTable.toNode();
				phantomRowNode.appendChild(phantomCellNode);
				phantomCellNode.appendChild(phantomTableNode);
				phantomTableNode.appendChild(rowNode);
				el.appendChild(phantomRowNode);
			});
		} else {
			this.getContent().stickTo(el);
		}
		return el;
	};


	/**
	 * If the table is fragmented and all rows have the same requested property, then
	 * this property of the first row is returned. In any other case, null is returned.
	 * NB: to compare requested property for all rows, this property must be an object
	 * with boolean-valued method isTheSameAs().
	 * @method   getPhantomRowProp
	 * @param    {String}         prop      a tag of the property to return. All rows should have this property.
	 * @return   {Object|null}			    the value of the property specified by the argument, if it is the same
	 *                                      for all rows, null otherwise.
	 */
	this.getPhantomRowProp = function(prop){
		if (!this.isFragmented()){
			return null;
		}
		var firstRow = this.getFirst(),
			rowNum = this.rowNum(),
			rowProp, i, firstRowProp;
		switch (prop){
			case 'attr':
				firstRowProp = firstRow.getProperties();
				break;
			case 'style':
				firstRowProp = firstRow.getStyles();
				break;
			default:
				return null;
		}
		if (rowNum === 1){
			return firstRowProp;
		}
		if (typeof firstRowProp.isTheSameAs !== 'function'){
			return null;
		}
		for (i = 1; i < rowNum; i++){
			rowProp = (prop === 'style') ? (this.getElem(i).getStyles()) : (prop === 'attr' ? this.getElem(i).getProperties() : null) ;
			if (!firstRowProp.isTheSameAs(rowProp)){
				return null;
			}
		}
		return firstRowProp;

	};

	/**
	 * Gets copy of n-th row stored in table body. If that row does not exist, nothing is returned.
	 * @method        getRow
	 * @param         {Number}    n
	 * @return        {Row|Null}
	 * @since         0.0.5
	 */
	this.getRow = function(n){
		if (n !== undefined){
			var len = this.rowNum();
			if (len > 0 && n >= 0 && n < len){
				return this.getBody()[n];
			}
		}
	};

	/**
	 * Returns copy of the first row stored in table body. If that row does not exist, nothing is returned.
	 * @method         getFirstRow
	 * @return         {Row}
	 * @since          0.0.5
	 */
	this.getFirstRow = function(){
		if (this.rowNum() > 0){
			return this.getBody()[0];
		}
	};

	/**
	 * Returns copy of last row stored in table body. If that row does not exist, nothing is returned.
	 * @method        getLastRow
	 * @return        {Row}
	 * @since         0.0.5
	 */
	this.getLastRow = function(){
		var len = this.rowNum();
		if (len > 0){
			return this.getBody()[len - 1];
		}
	};

	/**
	 * If the table is fragmented, gives the requested property of the phantom cell if that property is
	 * the same for all rows. Otherwise, null is returned.
	 * @method        getPhantomCellProp
	 * @param         {String}              propName            requested property (supposed to be "style" or "attr")
	 * @return        {Object|null}
	 */
	this.getPhantomCellProp = function(propName){
		if (!this.isFragmented()){
			return null;
		}
		var rowNum = this.rowNum(),
			firstRow = this.getFirst(),
			firstRowProp, i, currentRowProp;
		firstRowProp = firstRow.getPhantomCellProp(propName);
		console.log('Table::getPhantomCellProp : firstRowProp(', propName, ') = ', firstRowProp);
		if (rowNum === 1){
			return firstRowProp;
		}
		for (i = 1; i < rowNum; i++){
			currentRowProp = this.getElem(i).getPhantomCellProp(propName);
			if (!firstRowProp.isTheSameAs(currentRowProp)){
				return null;
			}
		}
		return firstRowProp;
	};

	/**
	 * If the table is fragmented, gives the requested property of the phantom cell if that property is
	 * the same for all rows. Otherwise, null is returned.
	 * @method  getPhantomTableProp
	 * @param   {String}     propName            requested property (supposed to be "style" or "attr")
	 * @return  {Object|null}
	 */
	this.getPhantomTableProp = function(propName){
		if (!this.isFragmented()){
			return null;
		}
		var rowNum = this.rowNum(),
			firstRow = this.getFirst(),
			firstRowProp, i, currentRowProp;
		firstRowProp = firstRow.getPhantomTableProp(propName);
		if (rowNum === 1){
			return firstRowProp;
		}
		for (i = 1; i < rowNum; i++){
			currentRowProp = this.getElem(i).getPhantomTableProp(propName);
			if (!firstRowProp.isTheSameAs(currentRowProp)){
				return null;
			}
		}
		return firstRowProp;

	};


	/**
	 * If the table is fragmented, then sets up the phantom properties and rearrange content property.
	 * If not, the table remains as it is.
	 *
	 * NB: refactor it!!!!
	 *
	 * NB: note that disentanglement only of table body occurs. If table header contains fragmented table,
	 * it remains untouched.
	 * @method   desintangle
	 * @return   {void}
	 */
	this.disentangle = function(){
		if (!this.isFragmented()){
			return null;
		}
		var rows = [],
			rowNum = this.rowNum(),
			i,
			firstRow,
			cellInside,
			tableInside;
		firstRow = this.getFirstRow();
		if (firstRow){
			this.setPhantomRowStyles(firstRow.getStyles());
			this.setPhantomRowProperties(firstRow.getProperties());
			cellInside = firstRow.getFirst();
			if (cellInside){
				this.setPhantomCellStyles(cellInside.getStyles());
				this.setPhantomCellAttributes(cellInside.getProperties());
				tableInside = cellInside.getFirst();
				if(tableInside){
					this.setPhantomTableStyles(tableInside.getStyles());
					this.setPhantomTableAttributes(tableInside.getProperties());
					for (i = 0; i < rowNum; i++){
						rows.push(this.getRow(i).getFirst().getFirst().getFirstRow());
					}
					this.setBody(rows);
				}
			}
		}
	};

	/**
	 * Inserts `r` {{#crossLink "Row"}}rows{{/crossLink}} with `c` {{#crossLink "Cell"}}cells{{/crossLink}} each.
	 *
	 * Creating a {{#crossLink "Row"}}row{{/crossLink}} with `c`-many cells is delegated to
	 * {{#crossLink "Row/makeShape:method"}}Row.makeShape{{/crossLink}} method.
	 *
	 * Previous content of the table gets lost after execution of this method.
	 *
	 * @method         makeShape
	 * @param          {Integer}        r       number of rows
	 * @param          {Integer}        c       number of columns
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.makeShape = function(r, c){
		if (r === undefined){
			throw new Error('Number of rows and columns are missing.');
		}
		// proceed only if both r and c are positive integer.
		if (!Number.isInteger(r) || r <= 0){
			throw new Error('Number of rows must be positive integer.');
		}
		var i, row;
		this.flushContent();
		for (i = 0; i < r; i++){
			row = new Row();
			row.makeShape(c);
			this.appendRow(row);
		}
	};


	/**
	 * Creates an {{#crossLink "Table"}}Table{{/crossLink}} instance with parameters specified in the table creation dialog.
	 *
	 * @method         configure
	 * @param          {Object}        descr           json object chracterizing parameters of the table instance
	 * @return         {Table}
	 * @since          0.0.6
	 */
	this.configure = function(descr){
		this.mark(NEWSLETTER['marker-name']);
		this.makeShape(descr.rows, descr.cols);
		this.markRows(NEWSLETTER['marker-name']);
		// this.markCells(NEWSLETTER['marker-name']);
		this.configureProperties(descr);

	};

	/**
	 * Marks all table rows.
	 * @method         markRows
	 * @param          {String}       marker
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.markRows = function(marker){
		var r = this.rowNum(),
			i, elem,
			c = new Content();
		for (i = 0; i < r; i++){
			elem = this.getElem(i);
			if (elem && typeof elem.mark === 'function'){
				elem.mark(marker);
				c.appendElem(elem);
			}
		}
		this.setContent(c);
	};

	/**
	 * Imposes table characteristics related to its properties (e.g., background color, border width,
	 * row/cell width) and not to its structure (number of rows and columns).
	 * @method         configureProperties
	 * @param          {Object}        descr
	 * @return         {void}
	 */
	this.configureProperties = function(descr){
		var tWidth = descr.width,
			bWidth = descr.tableBorderWidth,
			spaceBtwRows = descr.spaceBtwRows,
			currentWidth = tWidth.clone(),
			spaceBtwRowsHalf = spaceBtwRows.frac(2, 0),
			cellWidths;


		if (descr.spaceTableGlobal.getValue() > 0){
			this.setStyleProperty('margin', descr.spaceTableGlobal.toString());
			currentWidth = currentWidth.sub(descr.spaceTableGlobal.times(2));
		}

		var globalPadding = descr.paddingTableGlobal;
		this.setStyleProperty('padding', globalPadding.toString());
		// this.setProperty('cellpadding', globalPadding.getValue());
		this.setProperty('cellspacing', globalPadding.getValue());
		currentWidth = currentWidth.sub(globalPadding.times(2));

		// setting overall border of the table
		if (bWidth.getValue() > 0){
			currentWidth = currentWidth.sub(bWidth.times(2));
			this.setBorder({
				style: 'solid',
				color: descr.tableBorderColor,
				width: bWidth.getValue()
			});
		}

		// padding is always zero
		// this.setStyleProperty('padding', 0);
		// available width for the table after taking into account margin, padding and border widths
		this.setWidth(currentWidth.getValue());

		// setting vertical spaces between rows
		this.setStyleProperty('border-spacing', '0px ' + spaceBtwRowsHalf.toString());

		// setting background color
		if (descr.globalTableBgColor){
			this.setStyleProperty('background-color', descr.globalTableBgColor);
		}

		// setting properties of the phantom elements
		if (descr.phantomBorderWidth.getValue() > 0){
			var phantomRowProp    = new RowProperties(),
				phantomCellProp   = new CellProperties(),
				phantomTableProp  = new TableProperties();

			phantomRowProp.setStyleProperty('padding', 0);
			phantomRowProp.setStyleProperty('margin', 0);
			phantomCellProp.setStyleProperty('padding', 0);
			phantomCellProp.setStyleProperty('margin', 0);

			// setting width of the phantom row and phantom cell
			phantomRowProp.setWidth(currentWidth.getValue());
			phantomCellProp.setWidth(currentWidth.getValue());

			phantomTableProp.setBorder({
				style: 'solid',
				color: descr.phantomBorderColor,
				width: descr.phantomBorderWidth.getValue()
			});

			// updating current width after imposing border width of the phantom table
			currentWidth = currentWidth.sub(descr.phantomBorderWidth.times(2));
			phantomTableProp.setWidth(currentWidth.getValue());

			this.setPhantomRowProperties(phantomRowProp);
			this.setPhantomCellProperties(phantomCellProp);
			this.setPhantomTableProperties(phantomTableProp);
		}

		// table.setRowWidths(currentWidth.getValue());



		cellWidths = Helper.columnWidths2(currentWidth.getValue(), descr.cellWeights);
		// console.log(cellWidths, Helper.columnWidths2(currentWidth.getValue(), descr.cellWeights), currentWidth.getValue());
		this.setProfile(cellWidths);
		var cellBorderInfo = descr.cellBorderWidth.toString() + ' solid ' + descr.cellBorderColor;
		if (descr.cellBorders.topHor){
			this.setStylePropertyToChildrenOf(0, 'border-top', cellBorderInfo);
			this.setFirstRowCellTopBorder(cellBorderInfo);
		}
		if (descr.cellBorders.bottomHor){
			this.setLastRowCellBottomBorder(cellBorderInfo);
		}


		// this.mark(NEWSLETTER['marker-name']);
		// creating rows
		// var cellBorderInfo = descr.cellBorderWidth.toString() + ' solid ' + descr.cellBorderColor,
		// 	cellWidth;
		// for (r = 0; r < descr.rows; r++){
		// 	row = new Row();
		// 	row.setWidth(currentWidth.getValue());
		// 	row.mark(NEWSLETTER['marker-name']);
		// 	// creating cells
		// 	for (c = 0; c < descr.cols; c++){
		// 		cell = new Cell();
		// 		cell.appendElem('riga #' + (r + 1) + ', cella #' + (c + 1));
		// 		cell.mark(NEWSLETTER['marker-name']);

		// 		cellWidth = new Unit(cellWidths[c], NEWSLETTER.unitMeasure());

		// 		cell.setStyleProperty('padding', descr.spaceCell);
		// 		cellWidth = cellWidth.sub(descr.spaceCell.times(2));

		// 		// top border of the first row
		// 		if (r === 0 && descr.cellBorders.topHor){
		// 			cell.setStyleProperty('border-top', cellBorderInfo);
		// 		}

		// 		// bottom border of the last row
		// 		if (r === descr.rows - 1 && descr.cellBorders.bottomHor){
		// 			cell.setStyleProperty('border-bottom', cellBorderInfo);
		// 		}
		// 		// horizontal border between rows: top border of each but first rows
		// 		if (descr.rows > 1 && r > 0 && descr.cellBorders.intHor){
		// 			cell.setStyleProperty('border-top', cellBorderInfo);
		// 		}
		// 		// most left border
		// 		if (c === 0 && descr.cellBorders.leftVer){
		// 			cell.setStyleProperty('border-left', cellBorderInfo);
		// 			cellWidth = cellWidth.sub(descr.cellBorderWidth);
		// 		}
		// 		// most right border
		// 		if (c === descr.cols - 1 && descr.cellBorders.rightVer){
		// 			cell.setStyleProperty('border-right', cellBorderInfo);
		// 			cellWidth = cellWidth.sub(descr.cellBorderWidth);
		// 		}
		// 		// vertical border between columns: left border of each but first column
		// 		if (descr.cols > 1 && c > 0 && descr.cellBorders.intVer){
		// 			cell.setStyleProperty('border-left', cellBorderInfo);
		// 			cellWidth = cellWidth.sub(descr.cellBorderWidth);
		// 		}

		// 		cell.setWidth(cellWidth.getValue());
		// 		row.appendCell(cell);
		// 	}
		// 	this.appendRow(row);
		// }



		// var isAllPositive = cellWidths.some(function(el){
		// 	return el < 0;
		// });
		// // if at least one of the values becomes negative, flash alert message
		// if (isAllPositive){
		// 	alert("Rilevato un numero negativo:\n" + cellWidths.join(' ') + "\nLa tabella non sarà inserita." );
		// 	return null;
		// }

	};

	/**
	 * Sets top border of the cells situated in the upper row.
	 * @method         setFirstRowCellTopBorder
	 * @param          {String}        borderInfo     border description (e.g., "1px solid red")
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.setFirstRowCellTopBorder = function(borderInfo){
		var rowNum = this.rowNum(),
			cntn = new Content(),
			row, r;
		if (rowNum > 0){
			row = this.getRow(0);
			cntn.appendElem(row);
			row.setCellTopBorder(borderInfo);
			for (r = 1; r < rowNum; r++){
				cntn.appendElem(this.getRow(r));
			}
		}
		this.setContent(cntn);
	};

	/**
	 * Sets style property `name` for all cells of  elements
	 * @method 	       setStylePropertyToCellsOf
	 * @param          {Integer} pos
	 * @param          {String}  name  [description]
	 * @param          {String|Integer} value [description]
	 */
	this.setStylePropertyToCellsOf = function(pos, name, value){
		var rowNum = this.rowNum(),
			cntn = new Content(),
			row, i;
		if (rowNum > 0){
			row = this.getRow(0);
			cntn.appendElem(row);
			row.setChildrenStyleProperty(name, value);
			for (i = 0; i < rowNum; i++){
				cntn.appendElem(this.getRow(i));
			}
		}
		this.setContent(cntn);



	};

	/**
	 * Updates `tableNode` with new chracteristics given by `tableInfo` object.
	 *
	 * It takes `tableNode`, constructs {{#crossLink "Table"}}Table{{/crossLink}} instance of it,
	 * adjusts its properties according to `tableInfo` and returns it.
	 * @method         update
	 * @param          {Table}         tableNode
	 * @param          {Object}        dialogData
	 * @return         {Table}         a Table instance with updated properties
	 */
	this.update = function(tableInfo){
		console.log(tableInfo);
		var tableClone = this.clone();
		tableClone.configureProperties(tableInfo);
		return tableClone;
	};


}
Table.prototype = Object.create(Tag.prototype);