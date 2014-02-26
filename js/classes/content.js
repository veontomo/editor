/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node */

/**
 * This class is used to encompass other objects.
 * @module 	    HtmlElements
 * @class  		Content
 * @param 		{String} 	str 		an optional argument that will be inserted when creating property "elements".
 */
function Content(str) {
	"use strict";
	if (!(this instanceof Content)) {
		return new Content(str || null);
	}
	/**
	 * Container of items. If an item has a method "toHtml", it will be applied when transforming the whole Content object into a string.
	 * @property {Array} elements
	 * @default  [str]
	 */
	this.elements = str ? [str] : [];

	/**
	 * The number of items in the "elements" property
	 * @method length
	 * @return {Integer}
	 */
	this.length = function () {
		return this.elements.length;
	};

	/**
	 * Gets the element with index "pos". If it does not exist, null is returned.
	 * @method getElem
	 * @param  {Number}         pos
	 * @return {mixed}
	 */
	this.getElem = function(pos){
		return this.elements[pos] || null;
	};

	/**
	 * Gets the first element. Delegates to Content::getElem(0)
	 * @method getFirst
	 * @return {mixed}
	 */
	this.getFirst = function(){
		return this.getElem(0);
	};

	/**
	 * Gets the last element. Delegates to Content::getElem()
	 * @method getLast
	 * @return {mixed}
	 */
	this.getLast = function(){
		var len = this.length();
		return len > 0 ? this.getElem(len - 1) : null;
	};



	/**
	 * Inserts element at position pos inside the array of elements. If the lenght of array "elements"
	 * is equal to N, than the allowed position index is inside the range [0, 1, ..., N]. If the given
	 * position index is outside that range, an error is thrown. If the position index is equal to N
	 * (that corresponds to appending the element), then Content::appendElem is called.
	 * @method  insertElemAt
	 * @param  {Number}   pos
	 * @param  {mixed}    elem
	 * @return {void}
	 */
	this.insertElemAt = function(pos, elem){
		var len = this.length(),
			isInt = parseInt(pos, 10) === pos;
		if (!isInt || pos < 0 || pos > len) {
			throw new Error('Wrong index to insert the element at!');
		}
		if (pos === len){
			this.appendElem(elem);
		} else {
			this.elements.splice(pos, 0, elem);
		}
		return null;
	};

	/**
	 * Appends element to the array of Content::elements.
	 * @method   appendElem
	 * @param    {mixed}           elem
	 * @return   {void}
	 */
	this.appendElem = function(elem){
		this.elements.push(elem);
		return null;
	};

	/**
	 * Drops the element at the given position and returns it. If element at the position does not exist,
	 * an error is thrown.
	 * @method dropElemAt
	 * @param  {Number}      pos
	 * @return {mixed}
	 */
	this.dropElemAt = function(pos){
		var elem = this.elements[pos];
		if (elem === undefined){
			throw new Error('No element is found at the given position!');
		}
		this.elements.splice(pos, 1);
		return elem;
	};

	/**
	 * Transforms the object into html form. Object-type entries of the "elements" property,
	 * should have `toHtml()` method in order the html string to be generated. If it has no
	 * `toHtml()`, then html comment `<!--- ... -->` will be generated.
	 * @method toHtml
	 * @return {String}
	 */
	this.toHtml = function () {
		var i, elem,  methodExists,
			output = '',
			len = this.length();
		for (i = 0; i < len; i++) {
			elem = this.getElem(i);
			switch (typeof elem) {
			case 'string':
				output += elem;
				break;
			case 'number':
				output += elem.toString();
				break;
			default:
				methodExists = (typeof elem.toHtml === 'function');
				output += methodExists ? elem.toHtml() : '<!-- no html representation -->';
				break;
			}
		}
		return output;
	};
	/**
	 * Text representation of the content. Object-type entries of the "elements" property,
	 * should have `toText()` method in order the html string to be generated. If it has no
	 * `toText()`, then this object will be ignored.
	 * @method toText
	 * @return {String}
	 */
	this.toText = function(){
		var i, elem,
			output = '',
			len = this.length();
		for (i = 0; i < len; i++){
			elem = this.getElem(i);
			switch (typeof elem) {
				case 'string':
					output += elem;
					break;
				case 'number':
					output += elem.toString();
					break;
				default:
					if (typeof elem.toText === 'function'){
						output += elem.toText();
					}
					break;
			}
		}
		return output;
	};
}