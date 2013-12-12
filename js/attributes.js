/** 
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @param  	obj 	Object 	
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
var setMinMaxWidth = function(w) {
		this.width = w;
		this["max-width"] = this.width;
		this["min-width"] = this.width;
	};

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
TextAttributes.prototype.toString = function(){ return toString(this);};;

function LinkAttributes() {
	this["text-decoration"] = "undeline";
	this["font-size"] = 12;
	this.color = "blue";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
LinkAttributes.prototype.toString = function(){ return toString(this);};;

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
TableAttributes.prototype.toString = function(){ return toString(this);};
TableAttributes.prototype.setWidth = setMinMaxWidth;

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
TableRowAttributes.prototype.toString = function(){ return toString(this);};
TableRowAttributes.prototype.setWidth = setMinMaxWidth;

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
TableCellAttributes.prototype.toString = function(){ return toString(this);};;
TableCellAttributes.prototype.setWidth = setMinMaxWidth;

function ImageAttributes() {
	this["border-width"] = 0;
	this["border-style"] = "solid";
	this["border-color"] = "rgb(255, 255, 255)";
	this.padding = 0;
	this.margin = 0;
	this.width = 0;
	this.height = 0;
}
ImageAttributes.prototype.toString = function(){ return toString(this);};

function ListAttributes() {
	this.padding = 0;
	this.margin = 0;
}
ListAttributes.prototype.toString = function(){ return toString(this);};

function ListItemAttributes() {
	this["font-size"] = 12;
	this.color = "#000000";
	this["font-weight"] = 0;
	this.padding = 0;
	this.margin = 0;
}
ListItemAttributes.prototype.toString = function(){ return toString(this);};

/**
* Cell class
*/ 
function Cell(){
	this.style = new TableCellAttributes();
	this.setStyle = function(cellAttr){
		this.style = cellAttr;
	};
	this.toHtml = function(){
		return '<td width="' + this.style.width + '" style="' + this.style.toString() + '"></td>';
	}
}


function Table() {
	this.cols = 1;
	this.rows = 1;
}
/**
 * Plain table collects info about table: 			# params
 * its width, number of columns, number of rows,  	3 (integers)
 * styles of row (the rows are of the same style) 	1 (object)
 * styles of the cells of the rows 				 	cols (objects)
 */

function PlainTable() {
	this.style = new TableAttributes();
	this.rowAttr = new TableRowAttributes();
	this.colsAttr = Array.apply(null, new Array(this.cols)).map(function() {
		return new TableCellAttributes();
	});
	this.toHtml = function() {
		var output = '<table width="' + this.style.width + '" style="' + this.style.toString() + '"><tbody>';
		for (var r = 0; r < this.rows; r++) {
			var row = '<tr width="' + this.rowAttr.width + '" style="' + this.rowAttr.toString() + '">';
			for (var c = 0; c < this.cols; c++) {
				row = row + '<td width="' + this.colsAttr[c].width + '" style="' + this.colsAttr[c].toString() + '"></td>';
			}
			row = row + '</tr>';
			output = output + row;
		}
		output = output + '</tbody></table>';
		return output;
	};

}

PlainTable.prototype = new Table();


function FramedTable() {


}

FramedTable.prototype = new PlainTable();