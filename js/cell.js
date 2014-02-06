/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableCellStyle, setMinMaxWidth, Content */

/**
 * Represents a table cell. The argument is supposed to be passed to the "content" property.
 * @module 	HtmlElements
 * @class   Cell
 * @param   {mixed} arg
 */
function Cell(arg) {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell(arg);
	}
	/**
	 * Type of the object. Set to value "Cell" for the objects of this type.
	 * @method {string} getType
	 * @return {string}
	 */
	this.getType = function(){
		return "Cell";
	};

	/**
	 * Html tag corresponding to Cell instances.
	 * @property {String}    name
	 * @type     {String}
	 * @default  table
	 */
	this.name = 'td';

	/**
	 * Overrides the inherited methods in order to pass the argument to the constructor of Content class.
	 * @param     {any}       arg
	 * @type      {Content}
	 * @return    {void}
	 */
	this.content = new Content(arg);

	/**
	 * Styles of the cell
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableCellStyle
	 */
	this.style = new TableCellStyle();

	/**
	 * Gets the width of the cell as it is present in the style property. It tends to return a number:
	 * if it is measured in "px", then the measurment unit is removed and the number is returned.
	 * @method getWidth
	 * @return {Number|String}
	 */
	this.getWidth = function(){
		var raw = this.style.width,
			raw2;
		if (raw){
			raw = raw.toString().trim().replace(/px$/, '');
			// try to parse it to a number. Under this operation whatever string at the end gets removed
			raw2 = parseFloat(raw, 10);
			if (raw2.toString() === raw){
				raw = raw2;
			}
		}
		return raw;
	};

	/**
	 * Insert the argument into the cell content
	 * @method insert
	 * @param {any} item
	 * @return {void}
	 */
	 this.insert = function(item){
	 	this.content.elements.push(item);
	 };

	/**
	 * Generates cell-specific html code with corresponding attributes and styles
	 * @method toHtml
	 * @return {String} html representation of the cell
	 */
	this.toHtml2 = function () {
		var tag = 'td',
			cellHtml,
			attr = this.attr.toString(),
			style = this.style.toString();
		if (style){
			style = 'style="' + style + '"';
		}
		cellHtml = '<' + [tag, attr, style].join(' ').replace(/\s+/g, ' ').trim() + '>' ;
		cellHtml += this.content.toHtml();
		cellHtml += '</' + tag + '>';
		return cellHtml;
	};
}
Cell.prototype = new Tag();