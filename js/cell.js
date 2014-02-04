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
	 * Attributes of the cell.
	 * @property {Attributes} attr
	 * @type {Attributes}
	 * @default Attributes
	 */
	this.attr = new Attributes();
	/**
	 * Styles of the cell
	 * @property {TableCellStyle} style
	 * @type {TableCellStyle}
	 * @default TableCellStyle
	 */
	this.style = new TableCellStyle();
	/**
	 * Content of the cell
	 * @property {Content} content
	 * @type {Content}
	 * @default Content
	 */
	this.content = new Content(arg);
	/**
	 * Retrieves the value of property from the "style"
	 * @method styleProperty
	 * @param  {String} 	prop 	property name which value should be retrieved
	 * @return {String|Number}
	 */
	this.styleProperty = function (prop) {
		return getProperty(this.style, prop);
	};
	/**
	 * Imposes the value of the width of the "attr" and "style" properties. In the latter, "min-width" and "max-width" are imposed as well.
	 * It is better to use with an integer argument.
	 * @method  setWidth
	 * @param {String|Number} 	w 	value of the width. Supposed to be either a string (i.e. "10px", "14.1em" etc)
	 * or a number (i.e. 200, 10).
	 */
	this.setWidth = function(w){
		setMinMaxWidth(this.style, w);
		this.attr.width = w;
	};

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
	 * Appends style to the cell.
	 * @method appendStyle
	 * @param  {Style|Obj}   stl   style to be appended
	 * @return {void}
	 */
	this.appendStyle = function(stl){
		if ((typeof stl !== 'string') && (typeof stl !== 'object') ) {
			throw new Error("Wrong argument type! Style, string or Object expected.");
		}
		var stlObj = new Style(stl);
		this.style.appendStyle(stlObj);

		return null;
	};
	/**
	 * Generates cell-specific html code with corresponding attributes and styles
	 * @method toHtml
	 * @return {String} html representation of the cell
	 */
	this.toHtml = function () {
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

/**
 * Transforms a cell-html string into Cell object. It is supposed that the string to process is of the
 * following form: <td ... > ... </td>. Inside the tag, there might be other nodes. If they are recognized
 * as a "supported" ones, the corresponding functions will be called to transform them into objects.
 * For the moment, the only supported element is "Table".
 * @module  HtmlElements
 * @method  createCellFromHtml
 * @return  {Object} Cell
 */
String.prototype.createCellFromHtml = function(){
		var htmlStr = this,
			parser = new DOMParser(),
			newParser = new DOMParser(),
			fullTable = '<table><tbody><tr>' + htmlStr + '</tr></tbody></table>',
			doc = parser.parseFromString(fullTable, 'text/html'),
			node = doc.getElementsByTagName('td'),
			newDoc,	cell, attrs, i, nodeStyle, elem, elems, elemsNum, currentElem, id, nodeContent, nodeText;
		if (node.length === 0){
			return null;
		}
		// process the first cell in the list of cells. The remaining cells are to be processed at their turn (when each of the becomes first)
		node = node[0];

		// creating object
		cell = new Cell();

		// imposing its styles
		nodeStyle = node.getAttribute('style');
		cell.style = new Style(nodeStyle);

		// imposing its attributes
		attrs = flatten(node.attributes);
		if (attrs.hasOwnProperty('style')){
			delete attrs.style;
		}
		cell.attr = new Attributes(attrs);

		// create a fictious div containing the cell and assign a unique id to it
		id = "fakeDivId" + Math.floor((Math.random()*99)+1);
		while (doc.getElementById(id)){
			id += Math.floor((Math.random()*99)+1);
		}
		nodeText = '<div id="'+ id +'">' + node.innerHTML + '</div>';

		newDoc = newParser.parseFromString(nodeText, 'text/html');
		nodeContent = newDoc.getElementById(id);

		elems = nodeContent.childNodes;

		elemsNum = elems.length;
		for (i = 0; i < elemsNum; i++){
			currentElem = elems[i];
			switch (currentElem.nodeType){
				case Node.TEXT_NODE:
					elem = currentElem.textContent;
					break;
				case Node.ELEMENT_NODE:
					elem = (currentElem.nodeName === 'TABLE') ? currentElem.outerHTML.createTableFromHtml() : currentElem.outerHTML;
					break;
				default:
					elem = currentElem.nodeValue;
			}
			cell.insert(elem);
		}
		return cell;
};