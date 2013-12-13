/** 
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @param   obj     Object 	
 * @param 	unit 	String|null 	a mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
 * @return 			String 			a concatenation of substrings; each substring is of this format: "attribute: value;".
 * @example "padding: 0px;margin: 10px;color: #ababab;"
 */
var toString = function(obj, unit) {
		var unit = unit || 'px';
		var styles = "";
		for (var attr in obj) {
			// avoid adding method to the output
			var val = obj[attr];
			switch (typeof val) {
			case 'string':
				styles += attr + ': ' + val + ';';
				break;
			case 'number':
				styles += attr + ': ' + String(val) + unit + ';';
				break;
			}
		}
		return styles;
	};

/**
 * Sets width, min-width and max-width to the value given as the argument.
 * This function is supposed to be added to prototypes of different objects.
 * @param mixed w
 * @return void
 */
var setMinMaxWidth = function(obj, w) {
		obj.width = w;
		obj["max-width"] = obj.width;
		obj["min-width"] = obj.width;
	};

function Attributes(){
	this.toString = function(){
		return toString(this);
	};
	this.setWidth = function(w){
		return setMinMaxWidth(this, w);
	};
}

/** 
 * Some data containers with default values of their attributes.
 */

function TextAttributes() {
	this["font-size"] = "12px";
	this.color = "#000000";
	this["font-weight"] = "0";
	this.padding = "0px";
	this.margin = "0px";
}
TextAttributes.prototype = new Attributes();

function LinkAttributes() {
	this["text-decoration"] = "underline";
	this["font-size"] = 12;
	this.color = "blue";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
LinkAttributes.prototype = new Attributes();

function TableAttributes() {
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = 0;
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableAttributes.prototype = new Attributes();

function FramedTableAttributes() {
	this['border-width'] = 1;
	this['border-color'] = 'rgb(0, 0, 0)';
}
FramedTableAttributes.prototype = new TableAttributes();

function TableRowAttributes() {
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = 0;
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableRowAttributes.prototype = new Attributes();

function TableCellAttributes() {
	this["border-color"] = "rgb(255, 255, 255)";
	this["border-style"] = "solid";
	this["border-width"] = "0px";
	this.margin = 0;
	this.padding = 0;
	this.width = 0;
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableCellAttributes.prototype = new Attributes();

function ImageAttributes() {
	this["border-width"] = 0;
	this["border-style"] = "solid";
	this["border-color"] = "rgb(255, 255, 255)";
	this.padding = 0;
	this.margin = 0;
	this.width = 0;
	this.height = 0;
}
ImageAttributes.prototype = new Attributes();

function ListAttributes() {
	this.padding = 0;
	this.margin = 0;
}
ListAttributes.prototype.toString  = new Attributes();

function ListItemAttributes() {
	this["font-size"] = 12;
	this.color = "#000000";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
ListItemAttributes.prototype.toString  = new Attributes();

/**
 * Table cell. It is completely characterized by its styles.
 * @param 	style 				Object 	TableCellAttribute
 * @method 	toHtml() 			String 	html representation of the element
 */

function Cell() {
	this.style = new TableCellAttributes();
	this.width = function() {
		return this.style.width;
	};
	this.toHtml = function() {
		return '<td width="' + this.width() + '" style="' + this.style.toString() + '"></td>';
	};
}

/** 
 * Table row. Contains style attribute and array of table cells.
 * @property 	style 				Object 						the row attributes
 * @property 	cells 				Array 						array of Cell instances
 * @method 		String 				width() 					gets the width of the row from the style attribute. If not set, empty string is returned.
 * @method 		String 				toHtml() 					html representation of the element
 * @method 		Object|null 		dropCell(Number) 			removes the element from the array of the cells
 * @method  	void				insertCell(Object, Number)	inserts cell into the given position of the row. If the position is not a valid index, then
 * the cell will be appended to the end of cell array.
 * @method  	void				appendCell(Object)			appends the cell to the row cells
 */

function Row() {
	this.style = new TableRowAttributes();
	this.cells = Array();

	this.width = function(){
		return ('width' in this.style) ? this.style.width : '';
	};

	this.toHtml = function() {
		var htmlRow = '<tr width="' + this.width() + '" style="' + this.style.toString() + '">';
		var cellsNumber = this.length();
		for(var i = 0; i < cellsNumber; i++){
			htmlRow += this.cells[i].toHtml();
		}
		htmlRow += '</tr>';
		return htmlRow;

	};
	this.length = function() {
		return this.cells.length;
	};

	this.dropCell = function(num) {
		var elem = this.cells[num];
		if ((typeof elem) !== 'undefined') {
			this.cells.splice(num, 1);
			return elem;
		}
	};

	this.insertCell = function(cell, pos) {
		var elem = this.cells[pos];
		if ((typeof elem) !== 'undefined') {
			this.cells.splice(pos, 0, cell);
		}else{
			this.cells.push(cell);	
		}
	};

	this.appendCell = function(cell){
		this.insertCell(cell, this.length());
	};
}

/** 
* Table. 
* @property 	style 		Object 		table styles
* @property 	row 		Object 		Row instance
* @property 	rows 		Number 		the number of the rows in the table. Remember that all rows have identitcal styles.
* @method 		Number 		cols() 		the number of columns in the table. It is retrieved from the row property
* @method 		String 		toHtml() 	html representation of the table
*/
function Table() {
	this.cols = function(){
		return this.row.length();
	};

	this.toHtml = function(){
		var htmlRow = this.row.toHtml();
		var htmlTable = '<table width="' + this.width() + '" style="' + this.style.toString() + '"><tbody>';
		for(var i = 0; i < this.rows; i++){
			htmlTable += htmlRow;
		}
		htmlTable += '</tbody></table>';
		return htmlTable;
	};

	this.width = function(){
		return ('width' in this.style) ? this.style.width : '';
	};

	this.style = new TableAttributes();
	this.row = new Row();
	this.rows = 1;


}

function PlainTable() {
}
PlainTable.prototype = new Table();


function FramedTable() {
	this.style = new FramedTableAttributes();
}
FramedTable.prototype = new Table();