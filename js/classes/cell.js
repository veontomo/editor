/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableCellStyle, setMinMaxWidth, Content, Tag */

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
	// inherit tag properties
	Tag.call(this);

	// *
	//  * Type of the object. Set to value "Cell" for the objects of this type.
	//  * @method getType
	//  * @return {String}
	//  * @deprecated  in favor of getName()

	// this.getType = function(){
	// 	// return "Cell";
	// 	alert('Remove call to this method. Use property "className" instead.');
	// 	return this.className;
	// };

	/**
	 * Html tag corresponding to Cell instances.
	 * @property {String}    name
	 * @type     {String}
	 * @default  table
	 */
	this.name = 'td';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor.name` returns "Cell", while IE, it returns "undefined".
	 * This property must be overridden in all inherited classes.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "Cell"
	 * @since    0.0.2
	 */
	this.className = "Cell";


	/**
	 * Overrides the inherited methods in order to pass the argument to the constructor of Content class.
	 * @property {Content}    content
	 * @param     {any}       arg
	 * @type      {Content}
	 */
	this.content = new Content(arg);

	/**
	 * Styles of the cell
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableCellStyle
	 */
	this.style = new TableCellStyle();


}
Cell.prototype = Object.create(Tag.prototype);