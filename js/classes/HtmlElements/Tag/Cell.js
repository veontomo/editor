/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, TableCellStyles, Content, Tag */

/**
 * Represents a table cell. The argument is supposed to be passed to the "content" property.
 * @module          HtmlElements
 * @class           Cell
 * @constructor
 * @param           {mixed} arg
 */
function Cell(arg) {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell(arg);
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Html tag corresponding to Cell instances.
	 * @property {String}    name
	 * @type     {String}
	 * @default  table
	 */
	this.tag = 'td';

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "Cell", while in IE, there
	 * is no `name` property.
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
	this.style = new TableCellStyles();


}
Cell.prototype = Object.create(Tag.prototype);