/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node, Link, FACTORY */

/**
 * This class is used to encompass other objects.
 * @module 	    HtmlElements
 * @class  		Content
 * @constructor
 * @param 		{String} 	str 		an optional argument that will be inserted into
 *                                      {{#crossLink "Content/elements:property"}}elements{{/crossLink}}
 *
 */
function Content(str) {
	"use strict";
	if (!(this instanceof Content)) {
		return new Content(str || null);
	}

	/**
	 * The  name of the class.
	 * @property        {String}            className
	 * @type            {String}
	 * @private
	 */
	var className = 'Content';


	/**
	 * Array in which Content items are stored.
	 * @property       {Array}              elements
	 * @private
	 * @default        [str]
	 */
	var elements = str ? [str] : [];

	/**
	 * {{#crossLink "Content/className:property"}}Class name{{/crossLink}} getter.
	 * @return         {String}
	 */
	this.getName = function(){
		return className;
	};


	/**
	 * {{#crossLink "Content/elements:property"}}elements{{/crossLink}} getter. <br/>
	 * *NB*: the method tries to return a copy of {{#crossLink "Content/elements:property"}}elements{{/crossLink}}
	 * content.
	 * return a copy of the element
	 * @method         getElements
	 * @return         {Array}
	 */
	this.getElements = function(){
		var output = [];
		elements.forEach(function(el){
			var copy = (typeof el.clone === 'function') ? el.clone() : el;
			output.push(copy);
		});
		return output;
	};

	/**
	 * {{#crossLink "Content/elements:property"}}elements{{/crossLink}} setter.
	 * @method         setElements
	 * @param          {Array}             items       array of items
	 * @return         {void}
	 */
	this.setElements = function(items){
		if (Array.isArray(items)){
			elements = items;
		}
	};

	/**
	 * The number of items in the "elements" property
	 * @method length
	 * @return {Integer}
	 */
	this.length = function () {
		return elements.length;
	};

	/**
	 * Gets the element with index "pos". If it does not exist, null is returned.
	 * @method getElem
	 * @param  {Number}         pos
	 * @return {mixed}
	 */
	this.getElem = function(pos){
		var res = elements[pos],
			output = (res === undefined) ?  null : res;
		return output;
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
			elements.splice(pos, 0, elem);
		}
		return null;
	};

	/**
	 * Reset {{#crossLink "Content/elements:property"}}elements{{/crossLink}} array.
	 * @method  flush
	 * @return  {void}
	 */
	this.flush = function(){
		elements = [];
	};

	/**
	 * Appends argument to the array of {{#crossLink "Content/elements:property"}}elements{{/crossLink}}.
	 * If the argument is a {{#crossLink "Content"}}Content{{/crossLink}} instance, then its
	 * {{#crossLink "Content/elements:property"}}elements{{/crossLink}} are appended one by one to the
	 * target instance {{#crossLink "Content/elements:property"}}elements{{/crossLink}} array.
	 * @method   appendElem
	 * @param    {mixed}           elem
	 * @return   {void}
	 */
	this.appendElem = function(elem){
		// var rnd = parseInt(Math.random()*1000, 10);
		// console.info(rnd, 'Content: before appending elem ', elem, ' to ', this.toHtml());
		if(elem !== undefined){
			if (elem instanceof Content){
				var elemElem = elem.getElements();
				elemElem.forEach(function(el){
					elements.push(el);
				});
			} else {
				elements.push(elem);
			}
		}
		// console.info(rnd, 'Content: after appending elem ', this.toHtml());
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
		var elem = elements[pos];
		if (elem !== undefined){
			elements.splice(pos, 1);
			return elem;
		}

	};


	/**
	 * Drops the first element. Alias for {{#crossLink "Content/dropElemAt:method"}}Content/dropElemAt(0){{/crossLink}}.
	 * @method   dropFirst
	 * @return   {void}
	 */
	this.dropFirst = function(){
		this.dropElemAt(0);
	};

	/**
	 * Drops the last element. If the number of current elements is greater than zero, then it is called
	 * {{#crossLink "Content/dropElemAt:method"}}Content/dropElemAt(pos){{/crossLink}} with pos being
	 * the index of the last element.
	 * @method  dropLast
	 * @return  {void}
	 */
	this.dropLast = function(){
		var len = this.length();
		if (len > 0){
			this.dropElemAt(len-1);
		}
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
	/**
	 * Scans recursively the content of "element" property and returns true, if each item of the content is empty.
	 * Returns false otherwise.
	 * What is supposed to be empty:
	 * <ul><li>objects having method `isEmpty()` and which returns `true`</li>
	 * <li> '' or '&nbsp;' </li>
	 * <li>objects without any attributes</li> <ul>
	 * @todo decide whether consider functions to be empty or not.
	 * @method  isEmpty
	 * @return {Boolean}
	 */
	this.isEmpty = function(){
		var output = true,
			len = this.length(),
			i, elem, elemType;
		for (i = 0; i < len; i++){
			elem = this.getElem(i);
			// if the element has "isEmpty" method, make use of it
			if (typeof elem.isEmpty === 'function'){
				output = elem.isEmpty();
				if (!output){
					return false;
				}
			} else {
				elemType = typeof elem;
				if (elemType === 'number'){
					return false;
				}
				if (elemType === 'string'){
					return elem === '&nbsp;' || elem === '';
				}

				if (elemType === 'object'){
					if(Object.getOwnPropertyNames(elem).length !== 0){
						return false;
					}
				}
			}
		}
		return output;
	};

	/**
	 * Apply recursively this function to all items in `elements` property. In the case, the last
	 * item is empty, deletes it.
	 * @method trim
	 * @return {void}
	 */
	this.trim = function(){
		// console.log('trim called on ', this.toHtml() );
		var len = this.length(),
			i, elem;
		// console.log('trim target: length = ', len, ', content: ', this.toHtml() );
		if (len > 0){
			// call trim() function on all but last element
			for (i = 0; i < len; i++){
				// console.log('trim: loop#', i);
				elem = this.getElem(i);
				// console.log('elem: ', elem);
				if (typeof elem.trim === 'function'){
					// console.log('trim: elem has trim function');
					elem.trim();
				}
				// check whether the last element is empty
				if (i === len - 1 && (typeof elem.isEmpty === 'function') && elem.isEmpty()){
					// console.log('trim: dropping last elem');
					// here the deletion occurs
					this.dropLast();
					this.trim();
				}
			}
		}
	};

	/**
	 * Returns true, if the argument is empty, and false otherwise.
	 * What is supposed to be empty:
	 * <ol>
	 * <li>object that has a method `isEmpty` that returns `true`</li>
	 * <li>object without methods</li>
	 * <li>string ''</li>
	 * <li>array [] </li>
	 * </ol>
	 * @method    isElemEmpty
	 * @param     {any}          arg
	 * @return    {Boolean}
	 */
	this.isElemEmpty = function(arg){
		switch(typeof arg){
			case 'object':
				if (typeof arg.isEmpty === 'function'){
					return arg.isEmpty();
				}
				if (Object.getOwnPropertyNames(arg).length === 0){
					return true;
				}
				if (Array.isArray(arg) ){
					return arg.length === 0;
				}
				break;
			case 'string':
				if (arg === ''){
					return true;
				}
				break;
		}
		return false;
	};

	/**
	 * If the argument is not empty, calls {{#crossLink "Content/appendElem:method"}}Content::appendElem(){{/crossLink}}.
	 * If the argument is empty, nothing is done. The argument is considered empty, if the method
	 * {{#crossLink "Content/isElemEmpty:method"}}Content::isElemEmpty(arg){{/crossLink}} returns `true`.
	 * @method  appendElemIfNotEmpty
	 * @param   {any} 	                obj 		Object to be inserted if not empty
	 * @return  {void}
	 */
	this.appendElemIfNotEmpty = function(obj){
		if (!this.isElemEmpty(obj)){
			this.appendElem(obj);
		}
	};

	/**
	 * Loads elements into the {{#crossLink "Content/elements:property"}}element{{/crossLink}} property.
	 * Each element of the input array is to be mimicked using the means of the FACTORY. If it is not
	 * defined, then no loading is performed and `false` is returned. Otherwise, the method tries to load
	 * and returns `true`.
	 * @method    load
	 * @param     {Array}       arr       array of Elements or Text instances
	 * @return    {Boolean}               true, if loaded successfully, false otherwise
	 */
	this.load = function(arr){
		if (Array.isArray(arr) && (window.FACTORY !== undefined) && FACTORY.factory){
			var factory = FACTORY.factory,
			   	items = [];
			arr.forEach(function(el){
				var baby = factory.mimic(el);
				items.push(baby);
			});
			this.setElements(items);
			return true;
		}
		console.info('Content::load()', 'FACTORY is not defined, so I am returning FALSE');
		return false;
	};

	/**
	 * Takes each element of the array {{#crossLink "Content/elements:property"}}Content::elements{{/crossLink}}
	 * and appends it as a child node to the argument which is supposed to be an instance of
	 * [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node), but in fact it is enough
	 * that is has [appendChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node.appendChild)
	 * method. In order to append, the array element should respond to `toNode()` method which
	 * returns [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 * instance of the element. If the element does not respond to the
	 * above-mentioned method, this element is ignored.
	 * @method  stickTo
	 * @param   {Object}     el
	 * @return  {void}
	 */
	this.stickTo = function(el){
		// var rnd = parseInt(Math.random()*1000, 10);
		// console.info(rnd, 'Content::stickTo() called with argument ', el, ', this = ', this);
		if (typeof el.appendChild === 'function'){
			// console.info(rnd, 'argument has "appendChild" method');
			elements.forEach(function(ch){
				// console.info(rnd, 'child = ', ch);
				if (typeof ch.toNode === 'function'){
					// console.info(rnd, ' the child has toNode() method');
					el.appendChild(ch.toNode());
				} else {
					// console.info(rnd, ' the child has NO toNode() method');
				}
			});
		} else {
			// console.info(rnd, 'argument has no "appendChild" method');
		}
		// console.info(rnd, 'Content::stickTo() finished with final value of el = ', el);
	};

	/**
	 * Clones the target. Tries to create a clone of each {{#crossLink "Content/elements:property"}}elements{{/crossLink}}
	 * item. In case the item is an object with no "clone" method, it is inserted into
	 * {{#crossLink "Content/elements:property"}}elements{{/crossLink}} by reference.
	 * @method         clone
	 * @return         {Object}
	 */
	this.clone = function(){
		var clone = new Content();
		elements.forEach(function(el){
			var current = (typeof el.clone === 'function') ? el.clone() : el;
			clone.appendElem(current);
		});
		return clone;
	};

	/**
	 * Appends Style `stl` to element at position `pos`.
	 * @param          {Integer}            pos
	 * @param          {Object}             obj
	 * @return         {void}
	 */
	this.appendStyleToElemAt = function(pos, stl){
		/// !!! stub
	};
}