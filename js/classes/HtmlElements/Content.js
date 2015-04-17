/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node, Link, NEWSLETTER */

/**
 * This class is used to encompass other objects.
 * @module 	    HtmlElements
 * @class  		Content
 * @constructor
 * @param 		{String} 	str 		an optional argument that will be inserted into
 *                                      {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}
 */
function Content(str) {
	"use strict";
	if (!(this instanceof Content)) {
		return new Content(str || null);
	}

	/**
	 * The  name of the class.
	 * @property        {String}            _className
	 * @type            {String}
	 * @private
	 */
	var _className = 'Content';


	/**
	 * Array in which Content items are stored.
	 * @property       {Array}              _elements
	 * @private
	 * @default        [str]
	 */
	var _elements = str ? [str] : [];

	/**
	 * {{#crossLink "Content/_className:property"}}Class name{{/crossLink}} getter.
	 * @method         getName
	 * @return         {String}
	 */
	this.getName = function(){
		return _className;
	};


	/**
	 * {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} getter. <br/>
	 * *NB*: the method tries to return a copy of {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}
	 * content.
	 * @method         getElements
	 * @return         {Array}
	 */
	this.getElements = function(){
		var output = [];
		_elements.forEach(function(el){
			var copy = (el && (typeof el.clone === 'function')) ? el.clone() : el;
			output.push(copy);
		});
		return output;
	};

	/**
	 * {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} setter.
	 * @method         setElements
	 * @param          {Array}             items       array of items
	 * @return         {void}
	 */
	this.setElements = function(items){
		if (Array.isArray(items)){
			_elements = items;
		}
	};

	/**
	 * The number of items in the "_elements" property
	 * @method length
	 * @return {Integer}
	 */
	this.length = function () {
		return _elements.length;
	};

	/**
	 * Gets a copy of element correspoinding to index `pos`. If it does not exist, null is returned.
	 * @method         getElem
	 * @param          {Number}             pos
	 * @return         {mixed}
	 */
	this.getElem = function(pos){
		var current = _elements[pos];
		if (current !== undefined){
			return (typeof current.clone === 'function') ?  current.clone() : current;
		}
		return null;
	};

	/**
	 * Gets the first element. Alias for {{#crossLink "Content/getElem:method"}}getElem(0){{/crossLink}}.
	 * @method getFirst
	 * @return {mixed}
	 */
	this.getFirst = function(){
		return this.getElem(0);
	};

	/**
	 * Gets the last element. Alias for {{#crossLink "Content/getElem:method"}}getElem(...){{/crossLink}}.
	 * @method         getLast
	 * @return         {mixed}
	 */
	this.getLast = function(){
		var len = this.length();
		return len > 0 ? this.getElem(len - 1) : null;
	};

	/**
	 * Inserts element at position pos inside the array of _elements. If the lenght of array "_elements"
	 * is equal to N, than the allowed position index is inside the range [0, 1, ..., N]. If the given
	 * position index is outside that range, an error is thrown. If the position index is equal to N
	 * (that corresponds to appending the element), then Content::appendElem is called.
	 * @method         insertElemAt
	 * @param          {Number}             pos
	 * @param          {mixed}              elem
	 * @return         {void}
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
			_elements.splice(pos, 0, elem);
		}
		return null;
	};

	/**
	 * Reset {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} array.
	 * @method  flush
	 * @return  {void}
	 */
	this.flush = function(){
		_elements = [];
	};

	/**
	 * Appends argument to the array of {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}.
	 * If the argument is a {{#crossLink "Content"}}Content{{/crossLink}} instance, then its
	 * {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} are appended one by one to the
	 * target instance {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} array.
	 * @method   appendElem
	 * @param    {mixed}           elem
	 * @return   {void}
	 */
	this.appendElem = function(elem){
		// var rnd = parseInt(Math.random()*1000, 10);
		// console.info(rnd, 'Content: before appending elem ', elem, ' to ', this.toHtml());
		if(elem !== undefined){
			if (elem instanceof Content){
				this.absorb(elem);
			} else {
				_elements.push(elem);
			}
		}
		// console.info(rnd, 'Content: after appending elem ', this.toHtml());
		return null;
	};

	/**
	 * If the argument is an instance of Content, then its {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}
	 * are copied (if possible) and inserted into target {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}
	 * array.
	 * @method         absorb
	 * @param          {Content}            cntn
	 * @return         {void}
	 */
	this.absorb = function(cntn){
		if (cntn instanceof Content){
			var cntnElements = cntn.getElements();
			cntnElements.forEach(function(el){
				_elements.push(el);
			});
		}
	};

	/**
	 * Drops the element at the given position and returns it. If element at the position does not exist,
	 * an error is thrown.
	 * @method dropElemAt
	 * @param  {Number}      pos
	 * @return {mixed}
	 */
	this.dropElemAt = function(pos){
		var elem = _elements[pos];
		if (elem !== undefined){
			_elements.splice(pos, 1);
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
	 * Drops the last element. If the number of current _elements is greater than zero, then it is called
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
	 * Transforms the object into html form. Object-type entries of the "_elements" property,
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
	 * Text representation of the content. Object-type entries of the "_elements" property,
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
	 * Returns true, if the argument is empty, and false otherwise.
	 * What is supposed to be empty:
	 * <ol>
	 * <li>object that has a method `isEmpty` that returns `true`</li>
	 * <li>object without methods</li>
	 * <li>string ''</li>
	 * <li>array [] </li>
	 * </ol>
	 * @method         isElemEmpty
	 * @param          {any}                arg
	 * @return         {Boolean}
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
	 * @method         appendElemIfNotEmpty
	 * @param          {any} 	            obj 		Object to be inserted if not empty
	 * @return         {void}
	 */
	this.appendElemIfNotEmpty = function(obj){
		if (!this.isElemEmpty(obj)){
			this.appendElem(obj);
		}
	};

	/**
	 * Converts each element of this instance into a node and appends it to the argument.
	 *
	 * Takes each element of the array {{#crossLink "Content/_elements:property"}}Content::_elements{{/crossLink}},
	 * converts it into a node (if the element responds to `toNode()` method, the convertion will
	 * be performed using this method, otherwise a text node will be constructed)
	 * and then appends this node to the argument which is supposed to be an instance of
	 * [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) (in fact, it is enough
	 * that is has [appendChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node.appendChild)
	 * method).
	 * @method         stickTo
	 * @param          {Object}             el      [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 * @return         {void}
	 */
	this.stickTo = function(el){
		if (typeof el.appendChild === 'function'){
			_elements.forEach(function(ch){
				if (typeof ch.toNode === 'function'){
					el.appendChild(ch.toNode());
				} else {
					el.appendChild(document.createTextNode(ch));
				}
			});
		}
	};

	/**
	 * Clones the target. Tries to create a clone of each {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}
	 * item. In case the item is an object with no "clone" method, it is inserted into
	 * {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} by reference.
	 * @method         clone
	 * @return         {Object}
	 */
	this.clone = function(){
		var clone = new Content();
		_elements.forEach(function(el){
			var current = (typeof el.clone === 'function') ? el.clone() : el;
			clone.appendElem(current);
		});
		return clone;
	};

	/**
	 * Appends Style `stl` to element at position `pos`.
	 * @method         appendStyleToElemAt
	 * @param          {Integer}            pos
	 * @param          {Object}             obj
	 * @return         {void}
	 */
	this.appendStyleToElemAt = function(pos, stl){
		var item = _elements[pos];
		if (item !== undefined && typeof item.appendStyle === 'function'){
			item.appendStyle(stl);
		}

	};

	/**
	 * Returns array of positions at which object with tag name `name` is situated.
	 * @method         findTagPos
	 * @param          {String}             name
	 * @return         {Array}
	 * @since          0.0.5
	 */
	this.findTagPos = function(name){
		var output = [];
		_elements.forEach(function(obj, pos){
			if (obj && (typeof obj.getTag === 'function') && obj.getTag() === name){
				output.push(pos);
			}
		});
		return output;
	};

	/**
	 * Returns first element from {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} whose getTag() returns `name`.
	 * If nothing is found, nothing is returned.
	 * @method         getFirstEntryOfTag
	 * @param          {String}        name
	 * @return         {Tag|Null}              first element from
	 *                                         {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}
	 *                                         which "getTag" method returns `name`.
	 * @since          0.0.5
	 */
	this.getFirstEntryOfTag = function(name){
		var len = this.length(),
		     counter = 0,
		     item;
		while (counter < len){
		 	item = this.getElem(counter);
		 	if (typeof item.getTag === 'function' && item.getTag() === name){
		 		return item;
		 	}
		 	counter++;
		}
	};

	/**
	 * Filters out array {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} in such a way
	 * that only those _elements for which `fun` returns `true` remain.
	 * @method         filterOut
	 * @param          {function}           fun       function to be applied to each element
	 * @return         {void}
	 */
	this.filterOut = function(fun){
		var filtered = _elements.filter(function(elem){
			return fun(elem);
		});
		_elements = filtered;
	};


	/**
	 * Applies function `fun` to each element of {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}.
	 * @method         applyToAll
	 * @param          {Function}           fun            function to be applied to each element of content
	 * @since          0.0.6
	 */
	this.applyToAll = function(fun){
		if (_elements && typeof fun === 'function'){
			_elements.forEach(function(elem){
				fun(elem);
			});
		}
	};

	/**
	 * Returns array with templates corresponding to each content element.
	 *
	 * The method tries to invoke method `template()` on each element of
	 * array {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}}.
	 * In case of success, the output of that execution is inserted into resulting array.
	 * Otherwise, a `null` is inserted in the resulting array.
	 * @method         template
	 * @return         {Array}         array of objects
	 * @since          0.2.1
	 */
	this.template = function(){
		var elements = this.getElements(),
			output = [];
		if (Array.isArray(elements) && elements.length > 0){
			elements.forEach(function(element){
				var template;
				try {
					template = element.template();
				} catch (e){
					template = null;
				}
				output.push(template);
			});
		}
		return output;
	};

	/**
	 * Loads templates into content elements.
	 *
	 * It iterates over {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}} array
	 * and loads a next available template into every element. If the array of templates
	 * is shorter than the array of {{#crossLink "Content/_elements:property"}}_elements{{/crossLink}},
	 * then the last template is used for missing templates.
	 * @method         loadTemplateBunch
	 * @param          {Object}        templateBunch      array of templates
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.loadTemplateBunch = function(templateBunch){
		var children = this.getElements();
		if (!Array.isArray(children) || !Array.isArray(templateBunch) || templateBunch.length === 0){
			return;
		}
		var childNum = children.length,
			i,
			template;
		for (i = 0; i < childNum; i++){
			try {
				if (templateBunch[i]){
					template = templateBunch[i];
				}
				children[i].loadTemplate(template);
			} catch (e){
				console.log(e.name + ' when loading template into child n.' + i + ': ' + e.message);
			}
		}
		this.setElements(children);
	};
}