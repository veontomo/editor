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
			var copy = (typeof el.clone === 'function') ? el.clone() : el;
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
	 * Loads _elements into the {{#crossLink "Content/_elements:property"}}element{{/crossLink}} property.
	 * Each element of the input array is to be mimicked using the means of the FACTORY. If it is not
	 * defined, then no loading is performed and `false` is returned. Otherwise, the method tries to load
	 * and returns `true`.
	 * @method         load
	 * @param          {Array}              arr       array of _elements or Text instances
	 * @return         {Boolean}                      true, if loaded successfully, false otherwise
	 */
	this.load = function(arr){
		if (Array.isArray(arr) && NEWSLETTER.factory){
			var factory = NEWSLETTER.factory,
			   	items = [];
			var len = arr.length;
			arr.forEach(function(el){
				var baby = factory.mimic(el);
				items.push(baby);
			});
			this.setElements(items);
			return true;
		}
		return false;
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
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node, Element, Content, window, Properties, Unit */

/**
 * This class is used to represent a general html tag.
 * @module 	           HtmlElements
 * @class  		       Tag
 * @constructor
 * @param              {String}        tName           html tag corresponding to the class.
 * @since              0.0.3
 * @author             A.Shcherbakov
 *
 */
function Tag(tName) {
	"use strict";
	if (!(this instanceof Tag)) {
		return new Tag();
	}

	/**
	 * Html tag corresponding to element that an instance of this class represents.
	 * @property       {String}             _tag
	 * @default        null
	 * @private
	 * @since          0.0.1
	 */
	var _tag = tName || null;

	/**
	 * Name of the current class.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `tag` property that returns "Tag", while in IE, there
	 * is no `tag` property.
	 * Every class that inherits from this one, should override this property.
	 * @property       {String}    _className
	 * @type           {String}
	 * @default        "Tag"
	 * @private
	 * @readOnly
	 * @since          0.0.2
	 */
	var _className = 'Tag';

	/**
	 * {{#crossLink "Tag/_tag:property"}}_tag{{/crossLink}} getter.
	 * @method         getTag
	 * @return         {String}
	 * @since          0.0.1
	 */
	this.getTag = function(){
		return _tag;
	};


	/**
	 * {{#crossLink "Tag/_tag:property"}}_tag{{/crossLink}} setter. If the argument is
	 * a string or a number, then if necessary, converts it into a string and performs
	 * assignment. If the argument is of any other type, no assignment occures.
	 * @method          setTag
	 * @param           {String|Number}     name
	 * @return          {String}
	 * @since           0.0.1
	 * @return          {void}
	 */
	this.setTag = function(name){
		if (name !== undefined){
			var nameType = typeof name;
			if (nameType === 'string'){
				_tag = name;
			} else if (nameType === 'number'){
				_tag = name.toString();
			}
		}
	};

	/**
	 * Represents all properties of the instance. Previously, it was split into Attributes and Styles.
	 * @private
	 * @property       {Properties}         _properties
	 * @type           {Properties}
	 * @default 	   Properties()
	 * @since          0.0.5
	 */
	var _properties = new Properties();

	/**
	 * Content of the instance.
	 * @property       {Content}            _content
	 * @type           {Content}
	 * @default        Content()
	 * @private
	 * @since          0.0.4
	 */
	var _content = new Content();

	/**
	 * Marker name.
	 *
	 * This string stores the name of attribute which is used to mark the instance using
	 * the method {{#crossLink "Tag/mark:method"}}mark(){{/crossLink}}.
	 * @property       {String}      _marker
	 * @type           {String}
	 * @default        null
	 * @private
	 * @since          0.0.6
	 */
	var _marker = null;

	/**
	 * Reference to a class that performs operations with dimensionful units.
	 *
	 * This instance must implement the same methods that class {{#crossLink "Unit"}}Unit{{/crossLink}} has.
	 * (if there were _interfaces_ in javascript, it would be possible to say that _unitWorker must implement
	 * Unit interface).
	 *
	 * @property       {Object} _unitWorker
	 * @private
	 * @default        Unit
	 * @since          0.2.1
	 *
	 */
	var _unitWorker = new Unit();

	/**
	 * {{#crossLink "Tag/_unitWorker:property"}}_unitWorker{{/crossLink}} setter.
	 * @method         setUnitWorker
	 * @param          {Unit}          worker    must implement {{#crossLink "Unit"}}Unit{{/crossLink}} interface
	 * @since          0.2.1
	 * @return         {void}
	 */
	this.setUnitWorker = function(worker){
		if (worker){
			_unitWorker = worker;
		}
	};

	/**
	 * {{#crossLink "Tag/_unitWorker:property"}}_unitWorker{{/crossLink}} getter.
	 * @method         getUnitWorker
	 * @return         {Unit}
	 * @since          0.2.1
	 */
	this.getUnitWorker = function(){
		return _unitWorker;
	};

	/**
	 * {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}} getter.
	 *
	 * @method         getMarker
	 * @return         {String}
	 * @since          0.0.6
	 */
	this.getMarker = function(){
		return _marker;
	};

	/**
	 * {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}} setter.
	 * @method         setMarker
	 * @param          {String}        str
	 * @since          0.0.6
	 */
	this.setMarker = function(str){
		if (typeof str === 'string' && str !== ''){
			_marker = str;
		}
	};

	/**
	 * Sets {{#crossLink "Tag/_properties:property"}}properties{{/crossLink}} of the instance. If the argument is an instance
	 * of {{#crossLink "Properties"}}Properties{{/crossLink}}, its clone is assigned to private variable
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}, otherwise the argument is passed to the
	 * {{#crossLink "Properties"}}Properties{{/crossLink}} constructor and newly created instance is assigned to
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
	 * @method         setProperties
	 * @since          0.0.5
	 * @param          {Any}                prop
	 * @return         {void}
	 */
	this.setProperties = function(prop){
		if (prop instanceof Properties){
			_properties = prop.clone();
		} else {
			_properties = new Properties(prop);
		}
	};

	/**
	 * Returns clone of {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
	 * @method        getProperties
	 * @since         0.0.5
	 * @return        {Properties}
	 */
	this.getProperties = function(){
		var clone = _properties.clone();
		return clone;
	};

	/**
	* Sets `style` property inside {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}. It is an alias
	* for {{#crossLink "Properties/setStyles:method"}}setStyles(){{/crossLink}} method.
	*
	* @method          setStyles
	* @param           {any}                stl
	* @return          {void}
	* @since           0.0.4
	*/
	this.setStyles = function(stl){
		_properties.setStyles(stl);
	};


	/**
	* Gets `style` key of private variable {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
	* It is an alias for {{#crossLink "Properties/getStyles:method"}}Properties::getStyles{{/crossLink}} method.
	* @method          getStyles
	* @return          {Properties}
	* @since           0.0.4
	*/
	this.getStyles = function(){
		return _properties.getStyles();

	};


	/**
	* Smart {{#crossLink "Tag/_content:property"}}_content{{/crossLink}} setter. If the argument is a
	* {{#crossLink "Content"}}Content{{/crossLink}} instance, then
	* {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}
	* is set to this value. Otherwise, the argument is passed to the constructor of new instance of
	* {{#crossLink "Content"}}Content{{/crossLink}} and the result is assigned to
	* {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}.
	* @method          setContent
	* @param           {any}                cntn
	* @return          {void}
	* @since           0.0.1
	*/
	this.setContent = function(cntn){
		if (cntn instanceof Content){
			_content = cntn;
		} else {
			_content = new Content(cntn);
		}

	};

	/**
	* Returns copy of {{#crossLink "Tag/_content:property"}}Content{{/crossLink}}.
	* @method          getContent
	* @return          {Content}
	* @since           0.0.4
	*/
	this.getContent = function(){
		return _content.clone();
	};

	/**
	 * {{#crossLink "Tag/_className:property"}}Class name{{/crossLink}} getter.
	 * @method         getName
	 * @return         {String}
	 */
	this.getName = function(){
		return _className;
	};

	/**
	 * {{#crossLink "Tag/_className:property"}}Class name{{/crossLink}} setter. Use it with caution. This
	 * method is intended to be used in classes that inherite from this one in order to set the name attribute.
	 * (If only were there a late binding ...)
	 * @method         setName
	 * @param          {String} name
	 * @return         {void}
	 */
	this.setName = function(name){
		if (typeof name === 'string'){
			_className = name;
		}
	};



	/**
	 * Appends style to the instance. Alias for {{#crossLink "Styles/appendStyle:method"}}Styles::appendStyle{{/crossLink}}.
	 * @method         appendStyle
	 * @param          {Styles|Obj}          newStyle   style to be appended
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.appendStyle = function(newStyle){
		_properties.appendStyle(newStyle);
		// this.initializeStyle();
		// this.getStyles().appendStyle(newStyle);
	};

	/**
	 * Appends style to the instance. Alias for
	 * {{#crossLink "Attributes/appendAttributes:method"}}Attributes::appendAttributes{{/crossLink}}.
	 * @method         appendAttributes
	 * @param          {Obj}                attr   attributes to be appended
	 * @return         {void}
	 * @since          0.0.1
	 * @deprecated     Use appendProperties instead
	 */
	this.appendAttributes = function(attr){
		console.log('This method is deprecated. Redirected to appendProperties()');
		// attributes.appendProperty(attr);
		_properties.appendProperties(attr);
	};


	/**
	 * Appends properties to {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}
	 * of the instance. Alias for
	 * {{#crossLink "Properties/appendProperty:method"}}appendProperty(){{/crossLink}} method.
	 * @method         appendProperties
	 * @param          {Obj}                prop   properties to be appended
	 * @return         {void}
	 * @since          0.0.5
	 */
	this.appendProperties = function(prop){
		_properties.appendProperty(prop);
	};


	/**
	 * Appends style `stl` to element at position `pos.` It is an alias for the method
	 * {{#crossLink "Content/appendStyleToElemAt:method"}}appendStyleToElemAt{{/crossLink}}.
	 * @method  appendStyleToElemAt
	 * @param  {any}   pos
	 * @param  {any}      stl
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendStyleToElemAt = function(pos, stl){
		_content.appendStyleToElemAt(pos, stl);
	};


	/**
	 * Retrieves requested property from {{#crossLink "Tag/styles:property"}}styles{{/crossLink}}
	 * property of the current object.
	 * @method         getStyleProperty
	 * @param          {String} 	        prop 	property name to be retrieved from the styles
	 * @return         {Any}
	 * @since          0.0.4
	 */
	this.getStyleProperty = function(prop) {
		var stl = this.getStyles();
		if (stl){
			return stl.getProperty(prop);
		}
	};


	/**
	 * Imposes requested property value in {{#crossLink "Tag/styles:property"}}styles{{/crossLink}}
	 * property of the current object.
	 * @method         setStyleProperty
	 * @param          {String} 	        key 	   property name to be set
	 * @param          {String} 	        value 	   property value
	 * @return         {Any}
	 * @since          0.0.4
	 */
	this.setStyleProperty = function(key, value) {
		return _properties.setStyleProperty(key, value);
	};


	/**
	 * Retrieves value of `prop` from {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}
	 * of the current object.
	 * @method         getProperty
	 * @param          {String} 	        prop 	property name to be retrieved from the attributes
	 * @return         {Any}
	 * @since          0.0.5
	 */
	this.getProperty = function(prop) {
		return this.getProperties().getProperty(prop);

	};


	/**
	 * Sets the value of `key` of {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}
	 * to `value`. Alias for {{#crossLink "Properties/setProperty:method"}}Properties::setProperty{{/crossLink}}.
	 * @method         setProperty
	 * @param          {String} 	        key 	   property name to be set
	 * @param          {String} 	        value 	   property value
	 * @return         {void}
	 * @since          0.0.5
	 */
	this.setProperty = function(key, value) {
		_properties.setProperty(key, value);
	};


	/**
	 * Returns `true` if {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}
	 * contains `key` and `false` otherwise. Alias for
	 * {{#crossLink "Properties/hasProperty:method"}}hasProperty{{/crossLink}}
	 * @method         hasProperty
	 * @param          {String}             key
	 * @return         {Boolean}
	 */
	this.hasProperty = function(key){
		var prop = this.getProperties();
		return (prop && prop.hasProperty(key));
	};

	/**
	 * Returns `true` if {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}
	 * contains attribute `key` and `false` otherwise.
	 * @method         hasStyleProperty
	 * @param          {String}             key
	 * @return         {Boolean}
	 */
	this.hasStyleProperty = function(key){
		var stl = this.getStyles();
		return (stl !== undefined && stl !== null && stl.hasProperty(key));
	};

	/**
	 * Drops `key` from {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}
	 * of the current object and returns a value of the key.
	 * @method         dropProperty
	 * @param          {String} 	        key 	property name to be retrieved from the attributes
	 * @return         {Any}                        value of the key in the attributes
	 * @since          0.0.5
	 */
	this.dropProperty = function(key) {
		if (this.hasProperty(key)){
			return _properties.dropProperty(key);
		}
	};

	/**
	 * Drops requested property from {{#crossLink "Tag/styles:property"}}styles{{/crossLink}}
	 * property of the current object.
	 * @method         dropStyleProperty
	 * @param          {String} 	        key 	property name to be retrieved from the styles
	 * @return         {Any}                        value of the key in the styles
	 * @since          0.0.4
	 */
	this.dropStyleProperty = function(key) {
		if (this.hasStyleProperty(key)){
			return this.getStyles().dropProperty(key);
		}
	};

	/**
	 * Calls {{#crossLink "Properties/setWidth:method"}}setWidth(){{/crossLink}} methods to set the widths.
	 * @method         setWidth
	 * @param          {String|Number} 	    w
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.setWidth = function(w){
		if (w !== undefined){
			_properties.setWidth(w);
		}
	};

	/**
	 * Retrieves value of `width` attribute of {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
	 * @method         getWidth
	 * @return         {mixed}
	 * @since          0.0.4
	 */
	this.getWidth = function(){
		var props = this.getProperties();
		if (props){
			return props.getWidth();
		}
	};

	/**
	 * Returns absolute value of `width` attribute of {{#crossLink "Tag/styles:property"}}styles{{/crossLink}}
	 * property without unit of measurement. If `width` is not defined or defined but its absolute value
	 * can not be found, then `undefined` is returned.
	 * @method         getWidthValue
	 * @return         {Number|Null}        width without unit of measurement
	 */
	this.getWidthValue = function(){
		var w = this.getWidth();
		if (w !== undefined){
			var result = parseFloat(w);
			if (!isNaN(result)){
				return result;
			}
		}
	};


	/**
	 * Returns copy of {{#crossLink "Content/elements"}}elements{{/crossLink}} of
	 * {{#crossLink "Tag/_content"}}_content{{/crossLink}}.
	 * @method         getElements
	 * @return         {Array}
	 */
	this.getElements = function(){
		var cntn = this.getContent();
		if (cntn){
			return cntn.getElements();
		}

	};

	/**
	 * Imposes {{#crossLink "Content/elements:property"}}elements{{/crossLink}} of
	 * {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}. If the argument
	 * is not array, not assignment occures.
	 * @method         setElements
	 * @param          {Array}              arr
	 */
	this.setElements = function(arr){
		if (Array.isArray(arr)){
			_content.setElements(arr);
		}
	};

	/**
	 * Gets the element stored in {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}. Delegates its
	 * functionality to class {{#crossLink "Content"}}Content{{/crossLink}}.
	 * @method getElem
	 * @param  {Number}    pos
	 * @return {any}
	 * @since  0.0.1
	 */
	this.getElem = function(pos){
		return this.getContent().getElem(pos);
	};

	/**
	 * Returns copy of the first element of {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}.
	 * Alias for {{#crossLink "Content/getFirst:method"}}Content::getFirst{{/crossLink}}.
	 * @method         getFirst
	 * @return         {any}
	 * @since          0.0.1
	 */
	this.getFirst = function(){
		return this.getContent().getFirst();
	};

	/**
	 * Returns copy of the first element of {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}.
	 * Alias for {{#crossLink "Content/getLast:method"}}Content::getlast{{/crossLink}}.
	 * @method  getLast
	 * @return {any}
	 * @since  0.0.1
	 */
	this.getLast = function(){
		return this.getContent().getLast();
	};

	/**
	 * Inserts an element into given position. Delegates its functionality to the class
	 * {{#crossLink "Content"}}Content{{/crossLink}}.
	 * @method  insertElemAt
	 * @param  {Number} pos
	 * @param  {any}    elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.insertElemAt = function(pos, elem){
		_content.insertElemAt(pos, elem);
	};

	/**
	 * Appends the element to the _content of the list item. Delegates its functionality to
	 * {{#crossLink "Content/appendElem:method"}}appendElem{{/crossLink}}.
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendElem = function(elem){
		_content.appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its _content. Delegates to Content::length().
	 * @method          length
	 * @return          {Number}
	 * @since           0.0.1
	 */
	this.length = function(){
		return this.getContent().length();
	};

	/**
	 * Deletes element from "_content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropElemAt:method}}dropElemAt{{/crossLink}}.
	 * @method         dropElemAt
	 * @param          {Any}                pos     intented to be an integer, but no check is performed
	 * @return         {Any}
	 * @since          0.0.1
	 */
	this.dropElemAt = function(pos){
		return _content.dropElemAt(pos);
	};

	/**
	 * Deletes first element from "_content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropFirst:method"}}Content::dropFirst(){{/crossLink}}.
	 * @method         dropFirst
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.dropFirst = function(){
		_content.dropFirst();
	};

	/**
	 * Deletes last element from "_content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropLast:method"}}Content::dropLast(){{/crossLink}}.
	 * @method         dropLast
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.dropLast = function(){
		_content.dropLast();
	};


	/**
	 * If {{#crossLink "Tag/_tag:property"}}_tag{{/crossLink}} is a non-empty string, then it is
	 * returned a string with which html representaion of current instance starts,
	 * i.e.: `<div class="media" style="color: red; width: 73%">`.
	 * @method         openingTag
	 * @return         {String|Null}
	 */
	this.openingTag = function(){
		var t = this.getTag(),
			prop;
		if (typeof t === 'string' && t.length > 0){
			prop =  this.getProperties();
			prop = (prop && typeof prop.toString === 'function') ? prop.toString() : '';
			if (prop.length > 0){
				prop = ' ' + prop;
			}
			return '<' + t + prop + '>';
		}
	};

	/**
	 * Returns html closing tag, i.e. `</span>`.
	 * @method         closingTag
	 * @return         {String}
	 */
	this.closingTag = function(){
		var t = this.getTag();
		if (typeof t === 'string' && t.length > 0){
			return '</' + t + '>';
		}
	};

	/**
	 * Gives html representation of the instance.
	 * If {{#crossLink "Tag/_tag:property"}}_tag{{/crossLink}} is not a non-empty string, just html comment is generated.
	 * @method         toHtml
	 * @return         {String}
	 * @since          0.0.1
	 */
	this.toHtml = function(){
		var tagStr = this.getTag(),
			openStr = this.openingTag(),
			closeStr = this.closingTag(),
			constStr = this.getContent().toHtml(),
			html;
		if (typeof tagStr === 'string' && tagStr.length > 0){
			html = openStr + constStr + closeStr;
		} else {
			html = '<!-- tag name is missing -->';
		}
		return html;
	};

	/**
	 * Generates plain text representation of the tag _content. Calls
	 * {{#crossLink "Content/toText:method"}}Content::toText(){{/crossLink}}.
	 * @method         toText
	 * @return         {String}
	 * @since          0.0.1
	 */
	this.toText = function(){
		return this.getContent().toText();
	};

	/**
	 * Returns `true`, if the tag is empty. Returns `false` otherwise.<br />
	 * The tag is considered empty if `isEmpty()` method for its {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * and {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and {{#crossLink "Content"}}_content{{/crossLink}} returns true.
	 * @method         isEmpty
	 * @return         {Boolean}
	 * @since          0.0.1
	 */
	this.isEmpty = function(){
		return this.getProperties().isEmpty() && this.getContent().isEmpty();
	};

	/**
	 * Empties {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}.
	 * @method         flushContent
	 * @return         {void}
	 */
	this.flushContent = function(){
		_content.flush();
	};


	/**
	 * Sets {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to a new
	 * {{#crossLink "Properties"}}Properties{{/crossLink}} instance.
	 * @method         flushProperties
	 * @return         {void}
	 */
	this.flushProperties = function(){
		_properties = new Properties();
	};


	/**
	 * Trims the _content. Calls method {{#crossLink "Content/trim:method"}}Content::trim(){{/crossLink}} on the
	 * {{#crossLink "Tag/_content:property"}}_content{{/crossLink}} property.
	 * @method  trim
	 * @return  {void}
	 */
	this.trim = function(){
		_content.trim();
		// return this;
	};

	/**
	 * Appends element to the _content. It is alias for the
	 * {{#crossLink "Content/appendElem:method"}}Content::appendElemIfNotEmpty(arg){{/crossLink}}
	 * @method appendElemIfNotEmpty
	 * @param  {any}      arg
	 * @return {void}
	 */
	this.appendElemIfNotEmpty = function(arg){
		_content.appendElemIfNotEmpty(arg);
	};


	/**
	 * Creates a clone of the target. If the target has a `_className` attribute corresponding to
	 * exisiting class, then that class instance is to be returned. Otherwise a {{#crossLink "Tag"}}Tag{{/crossLink}}
	 * instance is returned. The method parses all attributes of the target and if the attribute
	 * responds to a "clone" method, then calls this method and assigns its result to the corresponding
	 * clone attribute. Otherwise, assign target attribute value to the clone attribute (there might be
	 * a potential problem with what is passed by reference and not by values, i.e. array). But among
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} properties there are no array-valued ones.
	 * @method    clone
	 * @return    {Object}
	 */
	this.clone = function(){
		var Constr = window[this.getName()],
			output, attr, current;
		output = (typeof Constr === 'function') ?  new Constr() : new Tag();
		for (attr in this){
			if (this.hasOwnProperty(attr)){
				current = this[attr];
				if (current && typeof current.clone === 'function'){
					output[attr] = current.clone();
				} else {
					output[attr] = current;
				}
			}
		}
		return output;
	};

	/**
	 * Populates the following properties of the target object
	 * <ol><li>
	 * {{#crossLink "Tag/_tag:property"}}_tag{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} by calling
	 * {{#crossLink "Properties/load:method"}}load(){{/crossLink}} method.
	 * </li><li>
	 * {{#crossLink "Tag/_content:property"}}_content{{/crossLink}} by calling
	 * {{#crossLink "Content/load:method"}}Content::load(){{/crossLink}} method.
	 * </li></ol>
	 * from the argument which must be an instance of
	 * [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) class. Returns `true` if
	 * the argument is of required type and the above mentioned  `load` methods return `true`. Otherwise,
	 * `false` is returned.<br />
	 * NB: DOM.Element.attributes has the form `{1: {tag: "width", value:"100", ...}, 2: {tag: "color", value:"black", ...}, ...}`
	 * @method     loadFromElement
	 * @param      {Element}            elem           origin from which the element properties are to be loaded
	 * @return     {Boolean}
	 */
	this.loadFromElement = function(elem){
		var propNew,
			propSucc = false,
			contentSucc = false,
			childrenArr = [],
			children, currentChild, attr, i, len;
		if (elem instanceof Element){
			children = elem.childNodes;                      // gives all child nodes (including Elements, TextNodes, etc.)
			len = children.length;
			this.setTag(elem.tagName.toLowerCase());         // setting tag
			attr = elem.attributes;
			if (attr){
				propNew = this.getProperties();
				propSucc = propNew.load(attr);
				this.setProperties(propNew);
			}
			for (i = 0; i < len; i++){
				currentChild = children.item(i);
				childrenArr.push(currentChild);
			}
			contentSucc = _content.load(childrenArr);
		}
		return propSucc && contentSucc;
	};

	/**
	 * Tries to transfer properties of the target onto `el`.
	 *
	 * NB: after execution, it is most probably that `el` undergo modification.
	 * @method         loadIntoElement
	 * @param          {Element}       el
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.loadIntoElement = function(el){
		var attrs = this.getProperties().getCore();
		var key, value;
		for(key in attrs){
			if (attrs.hasOwnProperty(key)){
				value = attrs[key];
				if (value && (typeof value.toString === 'function')){
					value = value.toString();
				}
				try {
					el.setAttribute(key, value);
				} catch (e){
					console.log(e.name + ' occurred when loading properties on the element: ' + e.message);
				}
			}
		}
	};

	/**
	 * Extracts properties from `template`.
	 *
	 * Only those properties which names are present in array `keys` are extracted from `template`.
	 * @method         extractFromTemplate
	 * @param          {Object}        template
	 * @param          {Array}         keys            array of strings
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.extractFromTemplate = function(template, keys){
		var extract = {};
		keys.forEach(function(key){
			if (template.hasOwnProperty(key)){
				extract[key] = template[key];
			}
		});
		return extract;
	};


	/**
	 * Returns [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)  object corresponding to the current object.
	 * Calls methods {{#crossLink "Attributes/decorateElement:method"}}Attributes::decorateElement(){{/crossLink}} to apply attributes,
	 * {{#crossLink "Style/decorateElement:method"}}Style::decorateElement(){{/crossLink}} to apply styles and
	 * {{#crossLink "Content/stickTo:method"}}Content::stickTo(){{/crossLink}} to append elements from the
	 * {{#crossLink "Tag/_content:property"}}Tag::_content{{/crossLink}}.
	 * @method  toNode
	 * @return  {DOM.Element}
	 */
	this.toNode = function(){
		var el = document.createElement(this.getTag());
		this.getProperties().decorateElement(el);
		this.getContent().stickTo(el);
		return el;
	};


	/**
	 * Erases current value of atttribute "title" and sets it to `str` if `str` is a non-empty string.
	 *
	 * @method         setTitle
	 * @param          {String}             str
	 * @return         {void}
	 * @since          0.0.4
	 */
	this.setTitle = function(str){
		if (typeof str === 'string' && str.length > 0){
			this.setProperty('title', str);
		} else {
			this.dropProperty('title');
		}
	};

	/**
	 * Applies function `fun` to each element of {{#crossLink "Tag/_content:property"}}_content{{/crossLink}}.
	 *
	 * It is an alias for {{#crossLink "Content/applyToAll:method"}}Content::applyToAll(){{/crossLink}} method.
	 *
	 * @method         applyToAll
	 * @param          {Function}      fun         function to be applied to each element of _content
	 * @since          0.0.6
	 */
	this.applyToAll = function(fun){
		if (_content && typeof fun === 'function'){
			_content.applyToAll(fun);
		}
	};

	/**
	 * Marks the target.
	 *
	 * Assign value of variable {{#crossLink "Tag/_className:property"}}classname{{/crossLink}} to attribute `marker`
	 * and adds this key-value pair into {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}. It sets
	 * as well {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}} to be `marker` in order to be able to
	 * apply eventually {{#crossLink "Tag/unmark:method"}}unmark{{/crossLink}} method.
	 *
	 * @method         mark
	 * @param          {String}        marker
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.mark = function(marker){
		this.setMarker(marker);
		this.setProperty(marker, this.getName());
	};


	/**
	 * Unmarks the target.
	 *
	 * Removes key {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}} from
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} and clears
	 * variable {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}}.
	 * @method         unmark
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.unmark = function(){
		var markerName = this.getMarker();
		if (markerName){
			this.dropProperty(markerName);
			_marker = null;
		}
	};


	/**
	 * Shrinks instance width by `d`. Alias for {{#crossLink "Properties/shrinkBy:method"}}Properties::shrinkBy{{/crossLink}} method.
	 *
	 * @method         shrinkBy
	 * @param          {Any}           d
	 * @return         {void}
	 * @since          0.0.6
	 *
	 */
	this.shrinkBy = function(d){
		_properties.shrinkBy(d);
	};


	/**
	 * Sets style key `name` of all children of the current instance to be equal to `value`.
	 * @method         setStylePropertyToAll
	 * @param          {String}        key            style key
	 * @param          {String|Number} value          style value
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.setStylePropertyToAll = function(key, value){
		var cntn = new Content(),
			len = this.length(),
			i, elem;
		for (i = 0; i < len; i++){
			elem = this.getElem(i);
			elem.setStyleProperty(key, value);
			cntn.appendElem(elem);
		}
		this.setContent(cntn);
	};

	/**
	 * Sets style key `name` of children which indexes are in array `range` to be equal to `value`.
	 *
	 * Example: <code>tag.setStylePropertyOfRange('margin', '10px', [1, 4, 6, 7])</code> sets inline style
	 * property `margin` to be `10px` for children which indexes are 1, 4, 6, or 7.
	 * @method         setStylePropertyOfRange
	 * @param          {String}        key            style key
	 * @param          {String|Number} value          style value
	 * @param          {Array|Null}    range          array of children indexes to which apply modifications
	 *                                                or `null` if modifications are to be applied to all children
	 * @throws         {Error}  If range is niether an array nor null
	 * @since          0.0.6
	 */
	this.setStylePropertyOfRange = function(key, value, range){
		if (!Array.isArray(range) && range !== null && range !== undefined){
			throw new Error('Range must be an array!');
		}
		var cntn = new Content(),
			len = this.length(),
			i, elem,
			setForAll = (range === null || range === undefined); // in case the range is not specified, apply for all children
		for (i = 0; i < len; i++){
			elem = this.getElem(i);
			if (setForAll || range.indexOf(i) !== -1){
				elem.setStyleProperty(key, value);
			}
			cntn.appendElem(elem);
		}
		this.setContent(cntn);
	};

	/**
	 * Returns value of style property `key` of children which indexes are in array `range` if all of them have
	 * the same value of the property. Otherwise, `null` is returned.
	 *
	 * `range` array admits negative numbers (with usual meaning: enumeration starts from the end).
	 * @method         getStylePropertyOfRange
	 * @param          {String}        key       name of style property (e.g., "width", "top-border")
	 * @param          {Array|null}    range     array of indexes of the children to take into consideration
	 * @return         {String|null}
	 * @since          0.0.6
	 */
	this.getStylePropertyOfRange = function(key, range){
		if (!Array.isArray(range) && range !== null && range !== undefined){
			throw new Error('Range must be an array!');
		}
		if (Array.isArray(range) && range.length === 0){
			return null;
		}
		var len = this.length();
		if (range === null || range === undefined){
			// making a call to the method itself but with "range" being specified
			range = [];
			var i;
			for (i = 0; i < len; i++){
				range.push(i);
			}
			return this.getStylePropertyOfRange(key, range);
		}
		var result, currentValue;

		// if one needs to consider elements one by one, replace negative elements in "range" (if any)
		// by corresponding positive ones
		range = range.map(function(i){return i < 0 ? len + i : i;});
		range.forEach(function(index){
			try {
				currentValue = this.getElem(index).getStyleProperty(key);
			} catch (e){
				console.log('Error (' + e.message + ') when retrieving style property ' + key + ' of element n. ' + index);
				currentValue = null;
			}

			if (result === undefined){
				result = currentValue;
			} else if (result !== currentValue){
				return null;
			}
		}.bind(this));

		return result;
	};


	/**
	 * Returns json object that uniquely parametrizes the instance.
	 *
	 * Base implementation returns an object with a single object-valued key `root`. That object contains key-value pairs
	 * that {{#crossLink "Tag/_property:property"}}_property{{/crossLink}} contains.
	 * @method         template
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.template = function(){
		var output = {},
			tag = this.getTag(),
			cont = this.getContent(),
			prop = this.getProperties();
		if (tag){
			output.tag = tag;
		}
		if (prop){
			var core = prop.template();
			if ((typeof core === 'object') && (Object.keys(core).length !== 0)){
				output.root = core;
			}
		}
		if (cont){
			var contTemplate = cont.template();
			if (Array.isArray(contTemplate) && contTemplate.length > 0) {
				output.children = contTemplate;
			}
		}
		return output;
	};

	/**
	 * Loads properties corresponding to the current instance ones and not to its child elements.
	 *
	 * Object `tmpl` is supposed have an object-valued key 'root' that contains attributes that should be loaded.
	 *
	 * @method         loadTemplate
	 * @param          {Object}        tmpl
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.loadTemplate = function(tmpl){
		this.loadProperTemplate(tmpl);
		this.loadChildTemplates(this.extractChildTemplates(tmpl));
	};

	/**
	 * Loads properties corresponding to the instance and not those corresponding
	 * to its children.
	 * @method         loadProperTemplate
	 * @param          {Object}        template
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.loadProperTemplate = function(template){
		var properties = this.getProperties();
		properties.appendProperty(this.extractProperTemplate(template));
		this.setProperties(properties);
	};

	/**
	 * Loads template corresponding to the instance child elements.
	 *
	 * Delegates its functionality to {{#crossLink "Content/loadTemplateBunch:method"}}loadTemplateBunch{{/crossLink}}
	 * method.
	 * @method         loadChildTemplates
	 * @param          {Array}         templateBunch       array of templates
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.loadChildTemplates = function(templateBunch){
		var content = this.getContent();
		if (content){
			content.loadTemplateBunch(templateBunch);
			this.setContent(content);
		}
	};

	/**
	 * Extract part of template that corresponds to the properties of the tag instance itself and not
	 * to its nested elements.
	 *
	 * It returns value of key "root" of `template` object or an empty object in case that key does not exist.
	 * @method         extractProperTemplate
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.extractProperTemplate = function(template){
		return template.root || {} ;
	};

	/**
	 * Extract part of template that corresponds to the properties of the elements that are located inside
	 * this instance.
	 *
	 * Returns value associated with key `children` of the object `template`. If not present, an empty array is
	 * returned.
	 *
	 * Template is a json object and the template stores the properties related to the instance under key
	 * "root". The properties of the nested elements are stored under array-valued key "children".
	 * @method         extractChildTemplates
	 * @param          {Object}        template
	 * @return         {Array}         array of templates of the child elements
	 * @since          0.2.1
	 */
	this.extractChildTemplates = function(template){
		return template.children || [];
	};


}

/**
 * {{#crossLink "Tag"}}Tag{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Tag is designed
 * to represent.  Inheriting classes are supposed to implement their own characteristic functions.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Tag.prototype.characteristicFunction = function(n){
	return (n instanceof Node);
};

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
		this.initPhantoms();
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
	 * The number of the rows in the table. It scans {{#crossLink "Tag/_content:property"}}_content{{/crossLink}} attribute
	 * (defined in the parent class {{#crossLink "Tag"}}Tag{{/crossLink}}) of the instance until the first occurrence
	 * of `tbody` tag. Once found, its length is returned. If not found,
	 * zero is returned.
	 * @method         rowNum
	 * @return         {Number}
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
	 * Gives a two-dimensional array [[w_11, w_12, ...., w_1n], ...., [w_m1, w_m2, ...., w_m3]]
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
	 * NB: note that disentanglement occurs of a table body only. If the table header contains a
	 * fragmented table, it remains untouched.
	 * @method   desintangle
	 * @return   {void}
	 */
	this.disentangle = function(){
		if (!this.isFragmented()){
			return null;
		}
		var rows = [],
			rowNum = this.rowNum(),
			i, firstRow, cellInside, tableInside, body;
		body = this.getBody();
		firstRow = this.getFirstRow();
		if (firstRow){
			this.setPhantomRowProperties(firstRow.getProperties());
			cellInside = firstRow.getFirst();
			if (cellInside){
				this.setPhantomCellProperties(cellInside.getProperties());
				tableInside = cellInside.getFirst();
				if (tableInside){
					this.setPhantomTableProperties(tableInside.getProperties());
					for (i = 0; i < rowNum; i++){
						try {
							rows.push(body[i].getFirst().getFirst().getFirstRow());
						} catch (e){
							console.log('Error (' + e.name + ') when retrieving nested rows ' + e.message);
						}
					}
					try {
						this.setBody(rows);
					} catch (e){
						console.log('Error (' + e.name + ') when setting table body '  + e.message);
					}

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
	 * @param          {Function}       fun     [optional]  function to mark the rows. It will be given
	 *                                          two arguments: current row and cell numbers.
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.makeShape = function(r, c, fun){
		if (r === undefined){
			throw new Error('Number of rows and columns are missing.');
		}
		// proceed only if both r and c are positive integer.
		if (parseInt(r, 10) !== r || r <= 0){
			throw new Error('Number of rows must be positive integer.');
		}
		var i, row,
			needToMark = typeof fun === 'function',
			markCell;
		this.flushContent();
		for (i = 0; i < r; i++){
			row = new Row();
			if (needToMark){
				markCell = function(j){
					return fun(i, j);
				};
				row.makeShape(c, markCell);
			} else {
				row.makeShape(c);
			}

			this.appendRow(row);
		}
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
		console.log('configuring properties: ', descr);
		var	tWidth = descr.width,
			bWidth = descr.tableBorderWidth,
			borderSpacing = descr['border-spacing'],
			currentWidth = tWidth.clone(),
			borderSpacingHalf = borderSpacing.frac(2, 0),
			cellWidths, i;

		if (descr.margin.getValue() > 0){
			this.setStyleProperty('margin', descr.margin.toString());
			currentWidth = currentWidth.sub(descr.margin.times(2));
		}

		var globalPadding = descr.padding;
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
		this.setStyleProperty('border-spacing', '0px ' + borderSpacingHalf.toString());

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
		this.setAllRowWidths(currentWidth.getValue());
		cellWidths = Helper.columnWidths2(currentWidth.getValue(), descr.cellWeights);
		var cellBorderInfo = descr.cellBorderWidth.toString() + ' solid ' + descr.cellBorderColor;
		if (descr.cellBorders.topHor){
			this.setStylePropertyOfBlock('border-top', cellBorderInfo, [0]);
		}
		if (descr.cellBorders.bottomHor && descr.rows > 0){
			this.setStylePropertyOfBlock('border-bottom', cellBorderInfo, [descr.rows - 1]);
		}
		// horizontal border between rows: top border of each but first rows
		if (descr.cellBorders.intHor){
			// creating array [1, 2, 3, ...., row - 1]
			var rowNums = [];
			for (i = 1; i < descr.rows; i++){
				rowNums.push(i);
			}
			this.setStylePropertyOfBlock('border-top', cellBorderInfo, rowNums);
		}
		// left border of most left cells
		if (descr.cellBorders.leftVer){
			this.setStylePropertyOfBlock('border-left', cellBorderInfo, null, [0]);
			// adjusting left cell width for further setting by means of "setProfile"
			cellWidths[0] -= descr.cellBorderWidth.getValue();

		}
		// most right border
		if (descr.cellBorders.rightVer){
			this.setStylePropertyOfBlock('border-right', cellBorderInfo, null, [descr.cols - 1]);
			// adjusting right cell width for further setting by means of "setProfile"
			cellWidths[cellWidths.length - 1] -= descr.cellBorderWidth.getValue();
		}

		// vertical border between columns: left border of each but first column
		if (descr.cellBorders.intVer){
			// creating array [1, 2, 3, ...., col - 1] of cell indexes to which border is to be applied
			// hence the width of these cells is to be adjusted.
			var colNums = [];
			for (i = 1; i < descr.cols; i++){
				colNums.push(i);
				// adjusting cell width for further setting by means of "setProfile"
				cellWidths[i] -= descr.cellBorderWidth.getValue();
			}
			this.setStylePropertyOfBlock('border-left', cellBorderInfo, null, colNums);
		}
		this.setStylePropertyOfBlock('padding', descr['cell[padding]'].toString(), null, null);
		this.setProfile(cellWidths);
		// console.log('table html after configuring properties: ', this.toHtml());
	};


	/**
	 * Sets style property `key` of children with numbers that are in array `cellArr` of rows
	 * with numbers that are in array `rowArr` to be equal to `value`.
	 *
	 * Example, <code>table.setStylePropertyOfBlock('padding', '1em', [1, 3, 5], [2, 8, 12])</code>
	 * imposes inline style `padding` to be `1em` to cells with numbers 2, 8, 12 of rows with numbers 1, 3, and 5.
	 *
	 * @method         setStylePropertyOfBlock
	 * @param          {Array|Null}    rowArr    array of integers indicating row numbers
	 * @param          {Array|Null}    cellArr   array of integers indicating cell numbers
	 * @param          {String}        key       name of style property to set (e.g., "width", "padding" etc)
	 * @param          {String}        value     border description (e.g., "1px solid red")
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.setStylePropertyOfBlock = function(key, value, rowArr, cellArr){
		if (!Array.isArray(rowArr) && rowArr !== null && rowArr !== undefined){
			throw new Error('Row range must be an array!');
		}
		var body = this.getBody(),
			newBody = [],
			rowNum = body.length,
			row, r,
			setForAll = (rowArr === null || rowArr === undefined); // in case the range is not specified, apply for all rows
		for (r = 0; r < rowNum; r++){
			row = body[r];
			if (setForAll || rowArr.indexOf(r) !== -1){
				row.setStylePropertyOfRange(key, value, cellArr);
			}
			newBody.push(row);
		}
		this.setBody(newBody);
	};

	/**
	 * Sets width of all rows of the table.
	 *
	 * It calls {{#crossLink "Tag/setWidth:method"}}setWidth{{/crossLink}} method on each row.
	 * @method         setAllRowWidths
	 * @param          {String|Number}   w        width value
	 * @return         {void }
	 * @since          0.0.6
	 */
	this.setAllRowWidths = function(w){
		// interrupt if the argument is neither string nor number
		if (typeof w !== 'string' && typeof w !== 'number'){
			throw new Error('Width must be a string or a number!');
		}
		var body = this.getBody(),
			newBody = [],
			rowNum = body.length,
			row, r;
		for (r = 0; r < rowNum; r++){
			row = body[r];
			row.setWidth(w);
			newBody.push(row);
		}
		this.setBody(newBody);
	};

	/**
	 * Returns value of style property `key` of rows which indexes are in array `rowArr` and cell
	 * indexes are in array `cellArr` if all objects have the same value of the above property.
	 * Otherwise, `null` is returned.
	 *
	 * `rowArr` array admits negative values (with usual meaning: enumeration starts from the end).
	 *
	 * @method         getStylePropertyOfBlock
	 * @param          {String}        key       name of style property (e.g., "width", "top-border")
	 * @param          {Array|null}    rowArr    array of row indexes (or null for all rows)
	 * @param          {Array|null}    cellArr   array of column indexes (or null for all rows)
	 * @return         {String|null}
	 * @since          0.0.6
	 */
	this.getStylePropertyOfBlock = function(key, rowArr, cellArr){
		if (!Array.isArray(rowArr) && rowArr !== null && rowArr !== undefined){
			throw new Error('Row range must be an array!');
		}
		var body = this.getBody(),
			rowNum = body.length,
			row, r,
			value, currentValue,
			checkForAll = (rowArr === null || rowArr === undefined); // in case the range is not specified, apply for all rows
		// if one needs to consider elements one by one from rowArr,
		// replace negative elements (if any) by corresponding positive ones
		if (!checkForAll){
			rowArr = rowArr.map(function(i){return i < 0 ? rowNum + i : i;});
		}
		for (r = 0; r < rowNum; r++){
			if (checkForAll || rowArr.indexOf(r) !== -1){
				row = body[r];
				currentValue = row.getStylePropertyOfRange(key, cellArr);
				if (value === undefined){
					// initialize value
					value = currentValue;
				} else {
					// exit, if already initialized value is different from current value
					if (value !== currentValue){
						return;
					}
				}
			}
		}
		return value;
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
		var tableClone = this.clone();
		tableClone.configureProperties(tableInfo);
		return tableClone;
	};

	/**
	 * Returns {{#crossLink "Table/getStylePropertyOfBlock:method"}}getStylePropertyOfBlock(){{/crossLink}} output
	 * formatted as {{#crossLink "Properties/getBorder:method"}}border info object{{/crossLink}}.
	 * @method         getStylePropertyOfRangeAsBorderInfo
	 * @param          {String}        key
	 * @param          {Array|null}    rowArr
	 * @param          {Array|null}    cellArr
	 * @return         {Object}
	 */
	this.getStylePropertyOfRangeAsBorderInfo = function(key, rowArr, cellArr){
		var value = this.getStylePropertyOfBlock(key, rowArr, cellArr),
			borderInfo = {style: 'none'};
		if (value){
			value = value.trim();
			var re = new RegExp(/\s+/g);
			var arr = value.split(re);
			if (arr.length >= 3){
				var width = arr.shift(),
					style = arr.shift();
				if (parseInt(width, 10) === 0){
					borderInfo.style = 'none';
				} else {
					borderInfo.style = style;
					borderInfo.width = width;
					borderInfo.color = arr.join(' ');
				}
			}
		}
		return borderInfo;
	};

	/**
	 * Creates an array of `len` increasing numbers starting with `start`:
	 * `start`, `start + 1`, ...
	 * @method         _range
	 * @param          {Number}        start
	 * @param          {Number}        len
	 * @return         {Array}
	 * @private
	 * @since          0.0.6
	 */
	var _range = function(start, len){
		var i = 0,
			output = [];
		for (i = 0; i < len; i++){
			output[i] = start + i;
		}
		return output;

	};

	/**
	 * Returns an object that parametrizes borders around the cells. The object has the following format:
	 * <br>
	 * <code>
	 * {leftVer: ..., rightVer: ..., intVer: ..., topHor: ..., bottomHor: ..., intHor: ..., [width: ..., color: ...]}
	 * </code>
	 * <br>
	 * where
	 * <ul><li>
	 * `leftVer`, `rightVer`, `intVer`, `topHor`, `bottomHor`, `intHor` are boolean-valued keys
	 * standing for left/right/intermediate horizontal/vertical cell borders,
	 * </li><li>
	 * `width` - (optional) integer, present if at least one of the above boolean values is true.
	 * </li><li>
	 * `color` - (optional) string, present along with "width" key.
	 * </li></ul>
	 * @method         getCellBorders
	 * @return         {Object}
	 * @since          0.0.6
	 */
	this.getCellBorders = function(){
		var output = {},
			width,
			allButFirstRow =  _range(1, this.rowNum() - 1),
			allButFirstCol =  _range(1, this.colNum() - 1),
			// set of keys necessary to get info about cell borders
			keys = {
				'topHor':    ['border-top', [0]],
				'bottomHor': ['border-bottom', [-1]],
				'intHor':    ['border-top', allButFirstRow],
				'leftVer':   ['border-left',  null, [0]],
				'rightVer':  ['border-right', null, [-1]],
				'intVer':    ['border-left',  null, allButFirstCol]
			},
			foo, borderInfo, key;

		for (key in keys){
			if (keys.hasOwnProperty(key)){
				foo = keys[key];
				borderInfo = this.getStylePropertyOfRangeAsBorderInfo(foo[0], foo[1], foo[2]);
				output[key] = borderInfo.style !== 'none';
				// if "width" is not initialized and the border is present,
				// set "width" and "color"
				if (width === undefined && output[key]){
					width = parseInt(borderInfo.width, 10);
					output.width = width;
					output.color = borderInfo.color;
				}

			}
		}
		return output;
	};

	/**
	 * Returns {{#crossLink "Properties/getBorder:method"}}border-like{{/crossLink}} object characterizing
	 * {{#crossLink "Table/phantomTable:property"}}phantom table{{/crossLink}} (if it exists) border.
	 * If {{#crossLink "Table/phantomTable:property"}}phantom table{{/crossLink}} does not exist,
	 * an object <code>{style: none}</code> is returned.
	 * @method  getPhantomTableBorder
	 * @return {Object}
	 * @since  0.0.6
	 */
	this.getPhantomTableBorder = function(){
		var output = {style: 'none'},
			phTblProp = this.getPhantomTableProperties();
		if (phTblProp){
			output = phTblProp.getBorder();
		}
		return output;
	};

	/**
	 * Returns object with properties corresponding to the phantom cell, row and table.
	 *
	 * Current implementation is quite trivial: it just returns value of key "frame" of `template`.
	 * @method         extractPhantomTemplate
	 * @param          {Object} template
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.extractPhantomTemplate = function(template){
		var key = 'frame';
		if (template && template.hasOwnProperty(key)){
			return template[key];
		}
	};


	/**
	 * Loads template.
	 *
	 * Overrides base class method {{#crossLink "Tag/loadTemplate:property"}}Tag:loadTemplate{{/crossLink}}.
	 * @method  loadTemplate
	 * @param   {Object} template
	 * @return  {void}
	 * @since   0.2.1
	 * @override
	 */
	this.loadTemplate = function(template){
		var properTemplate = this.extractProperTemplate(template),
			phantomTemplate = this.extractPhantomTemplate(template);

		if (properTemplate.hasOwnProperty('border-width')){
			properTemplate['border-style'] = 'solid';
		}
		this.setProperties(properTemplate);
		this.setWidth(properTemplate.width);

		if (phantomTemplate){
			phantomTemplate.width = properTemplate.width;  /// stub: it should take into consideration
														   /// parent table padding, margin and border width
 			this.setPhantomTemplate(phantomTemplate);
		}
		var rowNum = parseInt(template.rows, 10),
			rowTemplate = template.row,
			r,
			row;
		if (typeof rowNum !== 'number'){
			return;
		}
		rowTemplate.cell = template.cell;
		console.log(rowTemplate);
		for (r = 0; r < rowNum; r++){
			row = new Row();
			if (r === 0 && rowTemplate && rowTemplate['border-first']){
				row.setStyleProperty('border-top', rowTemplate.root.style['border-width'] + 'px solid ' + rowTemplate.root.style['border-color']);
			}
			if (r === rowNum - 1 && template.row['border-last']){
				console.log('create border of the last row');
			}
			if (r > 0 && r < rowNum - 1 && template.row['border-middle']){
				console.log('create border of the middle row');
			}
			console.log('loading row template:', rowTemplate);
			row.loadTemplate(rowTemplate);
			this.appendRow(row);
		}

		console.log('rows: ' + template.rows, ', columns: ' + template.columns);
		// this.makeShape(, parseInt(template.columns, 10));
	};

	/**
	 * Sets properties of the following phantom elements: table, row, cell.
	 * @method  setPhantomTemplate
	 * @param   {Object} template
	 * @return  {void}
	 * @since   0.2.1
	 */
	this.setPhantomTemplate = function(template){
		/// first apprx
		var style = new Properties(template);
		style.setMode(Properties.MODE_STYLE);
		this.setPhantomTableProperties(style);
		this.setPhantomRowProperties(style);
		this.setPhantomCellProperties(style);
	};

}
Table.prototype = Object.create(Tag.prototype);


/**
 * {{#crossLink "Table"}}Table{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Table is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Table.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'table';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global TableCellStyles, Content, Tag */

/**
 * Represents a table cell. The argument is supposed to be passed to the "content" property.
 * @module             HtmlElements
 * @class              Cell
 * @constructor
 * @param              {mixed}              arg
 */
function Cell(arg) {
	"use strict";
	if (!(this instanceof Cell)) {
		return new Cell(arg);
	}
	// inherit tag properties
	Tag.call(this, arg);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "td"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Cell"
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to be
	 * {{#crossLink "CellProperties"}}TableCellStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('td');
	this.setName('Cell');
	this.setProperties(new CellProperties());
	this.setContent(new Content(arg));
}

Cell.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "Cell"}}Cell{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Link is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Cell.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'td';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ImageProperties, Content, Tag */

/**
 * Represents an ImageTag.
 * @module          HtmlElements
 * @class           ImageTag
 * @constructor
 */
function ImageTag() {
	"use strict";
	if (!(this instanceof ImageTag)) {
		return new ImageTag();
	}
	// inherit tag properties
	Tag.call(this);

	var allowedProtocols = ['http', 'https'];

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "img"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "ImageTag"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "ImageStyles"}}ImageStyles{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('img');
	this.setName('ImageTag');
	this.setProperties(new ImageProperties());

	/**
	 * Sets `src` property of ImageTag {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * if `url` corresponds to an ImageTag with non zero width and height. In this case, `height` and
	 * `width` properties are set in {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * @method         setOrigin
	 * @param          {String}             url
	 * @return         {void}
	 */
	this.setOrigin = function(url){
		var protocol = this.getProtocol(url);
		if (allowedProtocols.indexOf(protocol) === -1){
			console.log('protocol ' + protocol + ' is not supported!');
			return;
		}
		var img = document.createElement('img'),
			imgWidth, imgHeight;
		img.src = url;
		imgWidth = img.width;
		imgHeight = img.height;
		if (typeof imgWidth === 'number' && imgWidth > 0 && typeof imgHeight === 'number' && imgHeight > 0){
			this.setProperty('src', url);
			this.setProperty('width', imgWidth);
			this.setWidth(imgWidth);
			this.setStyleProperty('height', imgHeight);
			this.setProperty('height', imgHeight);
		}
	};

	/**
	 * Drops protocol name from `url`. Everything until the first occurence of '://' will be removed (inclusively).
	 * @method         dropProtocol
	 * @param          {String}             url
	 * @return         {String}
	 */
	this.dropProtocol = function(url){
		var delimiter = '://',
		    pattern = '^[^' + delimiter + ']+' + delimiter,
		    re = new RegExp(pattern, 'gi');
		return url.replace(re, '');
	};

	/**
	 * Returns protocol corresponding to `url`: everything starting from the beginning of line until
	 * first occurence of '://' (exclusively).
	 * @method         getProtocol
	 * @param          {String}             url
	 * @return         {String}
	 */
	this.getProtocol = function(url){
		var delimiter = '://',
		    pattern = '^[^' + delimiter + ']+' + delimiter,
		    re = new RegExp(pattern, 'gi'),
		    needle = url.match(re);
		if (Array.isArray(needle) && typeof needle[0] === 'string'){
			return needle[0].replace(delimiter, '');
		}
		return null;
	};


	/**
	 * Gets "src" property of ImageTag {{#crossLink "Attributes"}}attribute{{/crossLink}} inherited from
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} class.
	 * @method         getOrigin
	 * @return         {String}
	 */
	this.getOrigin = function(){
		return this.getProperty('src');
	};

	/**
	 * Gets ImageTag height. It is read from {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * It is set along with `src` attribute in {{#crossLink "ImageTag/setOrigin:method"}}setOrigin{{/crossLink}}
	 * method.
	 * @method         getHeight
	 * @return         {Integer}
	 */
	this.getHeight = function(){
		return this.getProperty('height') || 0;
	};

	/**
	 * Returns html representation of the instance if
	 * {{#crossLink "ImageTag/getOrigin:method"}}getOrigin(){{/crossLink}} returns non-empty string.
	 * Otherwise, returns empty string.
	 *
	 * Html representation consists of opening and closing tags that are output of methods
     * {{#crossLink "Tag/openingTag:method"}}openingTag{{/crossLink}} and
	 * {{#crossLink "Tag/closingTag:method"}}closingTag{{/crossLink}} correspondingly.
	 *
	 * This method overrides the parent one {{#crossLink "Tag/toHtml:method"}}toHtml{{/crossLink}}
	 * (since I could not consistently call a parent class method from a child one when the child
	 * class overrides the corresponding parent method.)
	 * @method         toHtml
	 * @return         {String}
	 */
	this.toHtml = function(){
		var orig = this.getOrigin();
		return (typeof orig === 'string' && orig.length > 0) ? this.openingTag() + this.closingTag() : '';
	};

	/**
	 * Image template: json object of image properties that parametrise the image. As required, overrides
	 * base class method {{#crossLink "Tag/template:method"}}Tag::template{{/crossLink}}.
	 *
	 * @method         template
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.template = function(){
		var info = {
			name: 'img',
			root: {
				src:           this.getOrigin(),
				// width:         this.getWidth(),
				// height:        this.getHeight(),
				alt:           this.getProperty('alt'),
				title:         this.getProperty('title'),
			}
		};
		return info;
	};

	/**
	 * Sets parameters from template `tmpl`.
	 * @method         loadFromTemplate
	 * @param          {Object}         tmpl
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.loadFromTemplate = function(tmpl){
		var key;
		for (key in tmpl){
			if (tmpl.hasOwnProperty(key)){
				switch (key){
					case 'title':
						this.setProperty(key, tmpl[key]);
						break;
					case 'src':
						this.setOrigin(tmpl[key]);
						break;
					case 'alt':
						this.setProperty(key, tmpl[key]);
						break;
				}
			}
		}
	};
}

ImageTag.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "ImageTag"}}ImageTag{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Link is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
ImageTag.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'img';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Attributes, Cell, Table, TableRowStyles, Tag, Content, Unit */

/**
 * Represents a table row
 * @module      HtmlElements
 * @class       Row
 * @constructor
 * @extends     Tag
 */
function Row() {
	"use strict";
	if (!(this instanceof Row)) {
		return new Row();
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "tr"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Row"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableRowStyles"}}TableRowStyles{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('tr');
	this.setName('Row');
	this.setProperties(new RowProperties());

	/**
	 * Returns an array of absolute cell widths (widths without unit of measurement).
	 * @method         getCellWidths
	 * @return         {Array}
	 */
	this.getCellWidths = function(){
		var output = [],
			cellNum = this.cellNum(),
			i;
		for (i = 0; i < cellNum; i++){
			output.push(this.getElem(i).getWidthValue());
		}
		return output;
	};

	/**
	 * Alias for length() method of the parent class.
	 * @method         cellNum
	 * @return         {Number}
	 */
	this.cellNum = function(){
		return this.length();
	};

	/**
	 * Sets widths of the cells inside the row.
	 * @method         setCellWidths
	 * @param          {Array}              profile         each elements if this array is a width of the corresp. cell in the row.
	 * @return         {void}
	 */
	this.setCellWidths = function(profile){
		var len = profile.length,
			i;
		if (this.cellNum() !== len){
			throw new Error('Incompatible array length!');
		}
		for (i = 0; i < len; i++){
			this.getElem(i).setWidth(profile[i]);
		}
	};

	/**
	 * Inserts a cell into a given position. If the object to insert is a Cell instance,
	 * then parent method insertElemAt is called. Otherwise, an error is thrown.
	 * @method         insertCellAt
	 * @param          {Cell}               cell        a cell to insert. If not a Cell instance, an error will be thrown.
	 * @param          {Number}             pos         position at which the cell is to be inserted.
	 * @return         {void}
	 */
	this.insertCellAt = function(pos, cell){
		if (!(cell instanceof Cell)){
			throw new Error('Only a Cell instance is allowed for insertion!');
		}
		this.insertElemAt(pos, cell);
	};

	/**
	 * Appends a cell to the row cells. If one tries to append a non-Cell object, an exception is thrown.
	 * Otherwise, a method appendElem of the parent class is called.
	 * @method         appendCell
	 * @param          {Cell}               cell            a cell to be appended. If not a Cell instance, an error is thrown.
	 * @return         {void}
	 */
	this.appendCell = function(cell){
		if (!(cell instanceof Cell)){
			throw new Error('The argument is not a Cell instance!');
		}
		this.appendElem(cell);
	};

	/**
	 * Returns `true` if the row contains only one cell and this cell contains only one element
	 * that is a {{#crossLink "Table"}}Table{{/crossLink}} instance. Otherwise, `false` is returned.
	 * @method         onlyTableInside
	 * @return         {Boolean}
	 */
	this.onlyTableInside = function(){
		var cell = this.getFirst();
		if (cell === undefined || this.cellNum() !== 1 || cell.length() !== 1){
			return false;
		}
		return (cell.getFirst() instanceof Table);
	};

	/**
	 * Alias for {{#crossLink "Tag/dropElemAt:method"}}dropElemAt{{/crossLink}} method.
	 * @method         dropCellAt
	 * @param          {Number}             pos        index of the cell to de dropped out.
	 * @return         {void}
	 */
	this.dropCellAt = function(pos){
		this.dropElemAt(pos);
	};

	/**
	 * Drops the cell at the given position and resizes the remaining cells. If the cell to drop has a nieghbour to its
	 * right, then the freed space isassigned to that neighbour, otherwise it is assigned to the left neighbour:
	 * <pre>
     * |xxx| a | b   | c |   ->   |     a | b   | c |
     * | a |xxx| b   | c |   ->   | a |     b   | c |
     * | a | b | c | xxx |   ->   | a | b | c       |
     * </pre>
	 * If the cell to drop does not exist, the row remains unchanged.
	 * @method         knockOutCell
	 * @param          {Number}             cellNum         cell number to delete. Numeration starts with 0.
	 * @return         {void}
	 */
	this.knockOutCell = function(cellNum){
		var acceptor, acceptorWidth, currentCell, currentCellWidth, widthTotal, acceptorWidthObj, currentCellWidthObj;
		if (cellNum < this.cellNum()){
			if (this.getElem(cellNum + 1)){
				acceptor = this.getElem(cellNum + 1);
			} else {
				if (this.getElem(cellNum - 1)){
					acceptor = this.getElem(cellNum - 1);
				}
			}
			if (acceptor){
				acceptorWidth = acceptor.getWidth();
				currentCell = this.getElem(cellNum);
				currentCellWidth = currentCell.getWidth();
				acceptorWidthObj  = new Unit(acceptorWidth);
				currentCellWidthObj  = new Unit(currentCellWidth);
				widthTotal = acceptorWidthObj.add(currentCellWidthObj);
				acceptor.setWidth(widthTotal.getValue());
			}
			this.dropElemAt(cellNum);
		}
	};

	/**
	 * Appends style to a given cell of the row. Alias for Tag::appendStyleToElemAt().
	 * @method         appendStyleToCellAt
	 * @param          {Number}             cellNum       index of the target cell
	 * @param          {any}                stl           style to be appended
	 * @return         {void}
	 */
	this.appendStyleToCellAt = function (cellNum, stl){
		this.appendStyleToElemAt(cellNum, stl);
	};



	/**
	 * This is an alias for {{#crossLink "Row/getPhantomCellProp:method"}}getPhantomCellProp('style'){{/crossLink}}.
	 * @method         phantomCellStyles
	 * @return         {Style}
	 */
	this.phantomCellStyles = function(){
		return this.getPhantomCellProp('style');
	};

	/**
	 * This is an alias for {{#crossLink "Row/getPhantomCellProp:method"}}getPhantomCellProp('attr'){{/crossLink}}.
	 * @method         phantomCellAttr
	 * @return         {Attributes}
	 */
	this.phantomCellAttr = function(){
		return this.getPhantomCellProp('attr');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} returns `true`), then
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} or
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} is returned.
	 * @method         getPhantomCellProp
	 * @param          {String}             prop         "style" or "attr"
	 * @return         {Properties}
	 */
	this.getPhantomCellProp = function(prop){
		if (this.onlyTableInside()){
			if (prop === 'style'){
				return this.getFirst().getStyles();
			}
			if (prop === 'attr'){
				return this.getFirst().getProperties();
			}
		}
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}} returns true),
	 * then {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} or
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} of the table inside first cell of current row is returned.
	 * @method         getPhantomTableProp
	 * @param          {String}             prop        "style" or "attr"
	 * @return         {Properties}
	 */
	this.getPhantomTableProp = function(prop){
		// inside the row there is a cell, inside which there is a table
		if (this.onlyTableInside()){
			if (prop === 'style'){
				return this.getFirst().getFirst().getStyles();
			}
			if (prop === 'attr'){
				return this.getFirst().getFirst().getProperties();
			}
		}
	};


	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}}
	 * returns `true`), then style of the table inside the cell is returned.
	 * This is an alias for {{#crossLink "Row/getPhantomTableProp:method"}}getPhantomTableProp('style'){{/crossLink}}
	 * method.
	 * @method         phantomTableStyles
	 * @return         {Style}
	 */
	this.phantomTableStyles = function(){
		return this.getPhantomTableProp('style');
	};

	/**
	 * If the row corresponds to a framed row (a row for which method
	 * {{#crossLink "Row/onlyTableInside:method"}}onlyTableInside{{/crossLink}}
	 * returns `true`), then attribute of the table inside the cell is returned.
	 * This is an alias for {{#crossLink "Row/getPhantomTableProp:method"}}getPhantomTableProp('attr'){{/crossLink}}.
	 * @method         phantomTableAttr
	 * @return         {Properties}
	 */
	this.phantomTableAttr = function(){
		return this.getPhantomTableProp('attr');
	};

	/**
	 * Inserts `c` cells into the row. If `fun` is a function, it recieves as an argument
	 * the number of cell and its output is then inserted into cell content.
	 *
	 * Previous row content gets lost.
	 *
	 * @method         makeShape
	 * @param          {Integer}       c     number of cells
	 * @param          {Function}      fun   [optional] function whose output is to be set as cell content
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.makeShape = function(c, fun){
		if (c === undefined){
			throw new Error('Number of cells is missing.');
		}
		if (parseInt(c, 10) !== c || c <= 0){
			throw new Error('Number of cells must be positive integer.');
		}
		var needToMark = typeof fun === 'function';
		this.flushContent();
		var i, cell;
		for (i = 0; i < c; i++){
			cell = new Cell();
			if (needToMark){
				cell.setContent(fun(i));
			}
			this.appendCell(cell);
		}
	};

	/**
	 * Sets top border for each cell.
	 * @method         setCellTopBorder
	 * @param          {String}        borderInfo       border description (e.g., "1px solid red")
	 * @since          0.0.6
	 */
	this.setCellTopBorder = function(borderInfo){
		var cntn = new Content(),
			cellNum = this.cellNum(),
			c, cell;
		for (c = 0; c < cellNum; c++){
			cell = this.getElem(c);
			cell.setStyleProperty('border-top', borderInfo);
			cntn.appendElem(cell);
		}
		this.setContent(cntn);
	};


}
Row.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "Row"}}Row{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class UList is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Row.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'tr';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ListStyles, Content, Tag, ListItem, ListProperties */

/**
 * This is a parent class for ordered and unordred lists. If argument is provided and is allowed one, it will be used
 * to set the property "tag". Otherwise, "tag" property will be set to the first allowed value.
 * @module 	    HtmlElements
 * @param       {Sting}       listType
 * @class  		List
 * @constructor
 */
function List(listType) {
	"use strict";
	if (!(this instanceof List)) {
		return new List(listType);
	}
	// inherit tag properties
	Tag.call(this);

	/**
	 * Array of allowed values for the tag names: ['ol', 'ul'].
	 * @property {Array}    _allowedTags
	 * @type     {Array}
	 * @private
	 */
	var _allowedTags = ['ol', 'ul'];

	/**
	 * {{#crossLink "List/_allowedTags:property"}}_allowedTags{{/crossLink}} getter.
	 *
	 * It returns by value, not by reference.
	 * @method         getAllowedTags
	 * @return         {Array}
	 */
	this.getAllowedTags = function(){
		return _allowedTags.slice(0);
	}

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "td"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Cell"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "TableCellStyles"}}TableCellStyles{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag(_allowedTags.indexOf(listType) !== -1 ? listType : _allowedTags[0]);
	this.setName('List');
	this.setProperties(new ListProperties());

	/**
	 * Change the {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} of the list. If the argument is not in
	 * the array of allowed names {{#crossLink "List/_allowedTags:property"}}_allowedTags{{/crossLink}}, then no
	 * change occurs.
	 * @method   switchName
	 * @param    {String}        name       the value to be imposed as a list type.
	 */
	this.switchName = function(name){
		if (_allowedTags.indexOf(name) !== -1){
			this.setTag(name);
		}
	};

	/**
	 * Gets the number of the list items
	 * @method      itemNum
	 * @return      {Number}   an integer number
	 */
	this.itemNum = function(){
		return this.length();
	};

	/**
	 * Appends an object to the list items. The object must be a ListItem instance.
	 * If not, an error is thrown.
	 * @method  appendItem
	 * @param   {ListItem}    item    an instance of ListItem
	 * @return  {void}
	 */
	this.appendItem = function(item){
		if (item instanceof ListItem){
			this.appendElem(item);
		} else {
			throw new Error('The argument is not a ListItem instance!');
		}
	};
	/**
	 * Inserts the item at the given position. If the item to insert is a ListItem instance, then
	 * {{#crossLink "Content/insertElemAt:method"}}Content::insertElemAt(){{/crossLink}}
	 * Content::insertElemAt() is called. Otherwise, an error is thrown.
	 * @method    insertItemAt
	 * @param     {Number}      pos     index of the position of there to insert the item
	 * @param     {ListItem}    item    item to insert
	 * @return    {void}
	 */
	this.insertItemAt = function(pos, item){
		if (item instanceof ListItem){
			this.insertElemAt(pos, item);
		} else {
			throw new Error('The item to insert is not a ListItem instance!');
		}

	};
	/**
	 * Appends list: takes list items of the argument and appends it one by one to the target list.
	 * The argument must be an instance of List. If not, an error is thrown.
	 * @method         appendList
	 * @param          {List}               list
	 * @return         {void}
	 */
	this.appendList = function(list){
		var len, i;
		if (!(list instanceof List)){
			throw new Error('The argument must be a List instance!');
		}
		len = list.length();
		for (i = 0; i < len; i++){
			this.appendItem(list.getElem(i));
		}
	};

	/**
	 * Wraps elements of the input array into a {{#crossLink "ListItem"}}list item{{/crossLink}} object
	 * and appends it to its {{#crossLink "Tag/content:property"}}content{{/crossLink}} property defined in
	 * parent class {{#crossLink "Tag"}}Tag{{/crossLink}}.
	 * If the argument is not of array type, creates a single-element array and apply the above procedure.
	 * @method         appendAsItems
	 * @param          {Array}              itemArr
	 * @return         {void}
	 */
	this.appendAsItems = function(itemArr){
		if(itemArr !== undefined){
			var input = Array.isArray(itemArr) ? itemArr : [itemArr],
				elements = this.getElements();
			input.forEach(function(item){
				var li = new ListItem();
				li.appendElem(item);
				elements.push(li);
			});
			this.setElements(elements);
		}
	};
}
List.prototype = Object.create(Tag.prototype);


/**
 * {{#crossLink "List"}}List{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class List is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.5
 */
List.prototype.characteristicFunction = function(n){
	if (!(n instanceof Element)){
		return false;
	}
	var tag = n.tagName.toLowerCase();
	return tag === 'ul' || tag === 'ol';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Content, ListItemStyles, Tag */

/**
 * This class is used to represent a list item.
 * @module 	    HtmlElements
 * @class  		ListItem
 * @constructor
 */
function ListItem() {
	"use strict";
	if (!(this instanceof ListItem)) {
		return new ListItem();
	}

	// inherit tag properties
	Tag.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "td"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Cell"
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to be
	 * {{#crossLink "ListItemProperties"}}ListItemProperties{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} accepts current class argument.
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('li');
	this.setName('ListItem');
	this.setProperties(new ListItemProperties());
}
ListItem.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "ListItem"}}ListItem{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class ListItem is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
ListItem.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'li';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent ordered lists.
 * @module 	           HtmlElements
 * @class  		       OList
 * @constructor
 * @extends            List
 * @since              0.0.2
 */
function OList() {
	"use strict";
	if (!(this instanceof OList)) {
		return new OList();
	}
	// inherit List properties
	List.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "ol"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "OList"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('ol');
	this.setName('OList');

}
OList.prototype = Object.create(List.prototype);

/**
 * {{#crossLink "OList"}}OList{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class OList is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
OList.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'ol';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global List */

/**
 * This class is used to represent unordered lists.
 * @module 	           HtmlElements
 * @class  		       UList
 * @constructor
 * @extends            List
 * @since              0.0.2
 */
function UList() {
	"use strict";
	if (!(this instanceof UList)) {
		return new UList();
	}
	// inherit List properties
	List.call(this);

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "ul"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "UList"
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('ul');
	this.setName('UList');

}
UList.prototype = Object.create(List.prototype);

/**
 * {{#crossLink "UList"}}UList{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class UList is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
UList.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'ul';
};
/*jslint plusplus: true, white: true */
/*global Tag, LinkProperties, Content, Regexp */

/**
* This class is represent an html link tag "a".
 * @module        HtmlElements
 * @class         Link
 * @constructor
 * @extends       Tag
*/
function Link(href) {
	"use strict";
	if (!(this instanceof Link)) {
		return new Link(href);
	}
	Tag.call(this);


	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "a"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Link"
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} to be
	 * {{#crossLink "LinkProperties"}}LinkProperties{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('a');
	this.setName('Link');
	this.setProperties(new LinkProperties());



	/**
	 * Returns value of "href" key inside {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
	 * @method    getHref
	 * @return    {String}
	 */
	this.getHref =  function(){
		return this.getProperty('href');
	};

	/**
	 * Href setter. Calles parent method  {{#crossLink "Tag/setProperty:method"}}setProperty{{/crossLink}}('href', ...).
	 * @method   setHref
	 * @param    {String}         url
	 * @return   {void}
	 */
	this.setHref =  function(url){
		this.setProperty('href', encodeURI(url));
	};

	// set url if it is given
	if(href && (typeof href === 'string')){
		this.setHref(href);
	}

	/**
	 * Sets `text-attribute` of the {{#crossLink "Link/style:property"}}`style`{{/crossLink}} property.
	 * If the argument is missing or equal to `true`, "underline" is imposed.
	 * If the argument is false, then "none" is imposed.
	 * If the argument is a string,  `text-property` will be assigned to be equal to that string.
	 * If nothing of the above holds, `text-property` remains unchanged.
	 * @method    underline
	 * @param     {String|Null|Boolean}  val
	 * @return    {void}
	 */
	this.underline = function(val){
		if (val === true || val === undefined){
			this.setStyleProperty('text-decoration', 'underline');
		} else if (val === false) {
			this.setStyleProperty('text-decoration', 'none');
		} else if (typeof val === 'string'){
			this.setStyleProperty('text-decoration', val);
		}
	};

	/**
	 * Sets `text-attribute` of the {{#crossLink "Link/style:property"}}`style`{{/crossLink}} property to be `none`.
	 * @method    dropUnderline
	 * @return    {void}
	 */
	this.dropUnderline = function(){
		this.setStyleProperty('text-decoration', 'none');
	};

	/**
	 * Apply target properties on the argument `obj`. The following cases are distinguished:
	 * <ul><li>
	 * the argument is an instance of {{#crossLink "Link"}}Link{{/crossLink}}. In this case, returns output of
	 * {{#crossLink "Link/updateLink:method"}}updateLink{{/crossLink}} method.
	 * </li><li>
	 * the argument is an instance of {{#crossLink "Content"}}Content{{/crossLink}}. In this case, returns output of
	 * {{#crossLink "Link/applyContent:method"}}applyContent{{/crossLink}} method.
	 * </li><li>
	 * the argument is an instance of {{#crossLink "Tag"}}Tag{{/crossLink}}. In this case, returns output of
	 * {{#crossLink "Link/applyTag:method"}}applyTag{{/crossLink}} method.
	 * </li></ul>
	 * If non of the above holds, result of {{#crossLink "Link/wrap:method"}}wrap{{/crossLink}} method is returned.
	 * @method         apply
	 * @param          {Any}                obj
	 * @return         {Any}                type of output depends on input argument
	 */
	this.apply = function(obj){
		if (obj instanceof Link){
			// console.log(obj, ' is a Link');
			return this.updateLink(obj);
		}
		if (obj instanceof Content){
			// console.log(obj, ' is a Content');
			return this.applyContent(obj);
		}
		if (obj instanceof Tag){
			// console.log(obj, ' is a Tag');
			return this.applyTag(obj);
		}
		// console.log(obj, ' is default');
		return this.wrap(obj);
	};

	/**
	 * Returns a copy of the target in which {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * contains the only element which is `obj`.
	 * @method         wrap
	 * @param          {Any}                obj
	 * @return         {Link}
	 */
	this.wrap = function(obj){
		/// strange thing: even though the target is a Link and the output is to be a Link,
		/// if I create object to return by means of this.clone(), somehow Content elements get
		/// overridden when I use them in apply. For this reason, "new Link()" is used to create
		/// the object which will be returned.
		var output = new Link(),
			item = (typeof obj.clone === 'function') ? obj.clone() : obj;
		output.setProperties(this.getProperties().clone());
		output.setStyles(this.getStyles().clone());
		output.setElements([item]);
		return output;

	};

	/**
	 * Converts the argument in link. Argument `tagObj` must be a {{#crossLink "Tag"}}Tag{{/crossLink}} instance.
	 * If its {{#crossLink "Tag/content"}}content{{/crossLink}} is
	 * <ol><li>
	 * non empty, then it is returned a copy of the argument in which {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * is replaced by output of {{#crossLink "Link/applyContent:method"}}applyContent{{/crossLink}} method.
	 * </li><li>
	 * empty, then a {{#crossLink "Link"}}Link{{/crossLink}} instance is returned. This instance has
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} and
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} of the target and its
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} contains `tagObj` as the only element.
	 * </li><li>
	 * </li></ol>
	 * @method         applyTag
	 * @param          {Tag}                tagObj
	 * @return         {Tag|Link}
	 */
	this.applyTag = function(tagObj){
		if (tagObj instanceof Tag){
			var result, cntn, cntnLinkified;
			if (!(tagObj.getContent().isEmpty())){
				result = tagObj.clone();
				cntn = result.getContent();
				cntnLinkified = this.applyContent(cntn);
				result.setContent(cntnLinkified);
			} else {
				result = this.wrap(tagObj);
			}
			return result;
		}
	};

	/**
	 * Modifies a Content instance in such a way that {{#crossLink "Link/apply:method"}}apply{{/crossLink}}
	 * is applied on all elements of the argumet.
	 * @method         applyContent
	 * @param          {Content}            cntn
	 * @return         {Content}
	 */
	this.applyContent = function(cntn){
		if (cntn instanceof Content){
			var result = new Content(),
				cntnElems = cntn.getElements(),
				len = cntnElems.length,
				i, current, linked, newLink;
			for (i = 0; i < len; i++){
				current = cntnElems[i];
				newLink = this.clone();
				linked = newLink.apply(current);
				result.appendElem(linked);
			}
			return result;
		}

	};

	/**
	 * Returns a new Link instance with `href` as in the target, {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * as in the argument, {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}} and
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} are as in the argument but augmented by corresponding values
	 * from the target
	 * @method         updateLink
	 * @param          {Link}               link
	 * @return         {Link}
	 */
	this.updateLink = function(link){
		if (link instanceof Link){
			var result = new Link(),
				src = this.getHref();
			result.setElements(link.getElements());
			result.setProperties(this.getProperties());
			result.setStyles(this.getStyles());
			result.appendStyle(link.getStyles());
			result.appendProperties(link.getProperties());
			result.setHref(src);
			return result;
		}
	};

	/**
	 * Returns `true` if the link's inline style {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} contain
	 * `text-decoration` key which is set to `underline`. Otherwise, `false` is returned.
	 * @method         isUnderlined
	 * @return         {Boolean}
	 * @since          0.0.6
	 */
	this.isUnderlined = function(){
		return this.getStyleProperty('text-decoration') === 'underline';
	};

	/**
	 * Link template: json object of table properties that parametrise the table. As required, overrides
	 * base class method {{#crossLink "Tag/template:method"}}Tag::template{{/crossLink}}.
	 *
	 * Returns an object with the following keys:<dl>
	 * <dt>href</dt><dd> (String) value of the link "href" attribute</dd>
	 * <dt>color</dt><dd>(String) link color</dd>
	 * <dt>isUnderlined</dt><dd>(Boolean) whether the link is underlined</dd>
	 * <dt>isTargetBlank</dt><dd>(Boolean) whether the link opens in a new window</dd>
	 * <dt>content</dt><dd> (String) string representation of the link content</dd>
	 * <dt>title</dt><dd> (String) title attribute</dd>
	 * </dl>
	 * @method         template
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.template = function(){
		var linkInfo = {
			name: 'link',
			root: {
				href:          this.getHref(),
				color:         this.getStyleProperty('color'),
				isUnderlined:  this.isUnderlined(),
				isTargetBlank: this.shouldOpenNew(),
				content:       this.getContent().toText(),
				title:         this.getProperty('title')
			}
		};
		return linkInfo;
	};

	/**
	 * Returns `true` if the link opens in a new window and `false` otherwise.
	 *
	 * The behaviour is completely defined by the value of attribute `target`.
	 * @method         shouldOpenNew
	 * @return         {Boolean}
	 * @since          0.2.1
	 */
	this.shouldOpenNew = function(){
		return this.getProperty('target') === '_blank';
	};


}
Link.prototype = Object.create(Tag.prototype);


/**
 * Splits `href` into "protocol" part and the rest.
 *
 * Returns an object with keys <ol><li>
 * `protocol` containing only alphanumeric symbols
 * </li><li>
 * `href` containing the rest of the input string without finishing slash, starting semicolon and slashes.
 * </li></ol>
 * @method        parseUri
 * @param         {String}         href
 * @return        {Object}
 * @since         0.0.6
 * @static
 *
 */
Link.parseUri = function(href){
	if (typeof href !== 'string' || href === ''){
		return {};
	}
	var items = href.match(/^((\w+):(\/\/)?)?(.+?)(\/?)$/),
		res = {};
	if (!items){
		return res;
	}
	res.protocol = items[2] || 'http';
	if (items[4]){
		res.href = items[4];
	}
	return res;
};

/**
 * {{#crossLink "Link"}}Link{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Link is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
Link.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'a';
};
/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global window */

/**
* Represents plain text. This class is intented to represent [text node](https://developer.mozilla.org/en-US/docs/Web/API/Text) elements.
* Though there is no `text` tag in HTML, it is introduced here in order to consider plain text on the same basis as other tags.
* @module             HtmlElements
* @class              PlainText
* @constructor
* @since              0.0.2
*/
function PlainText(text) {
	"use strict";
	if (!(this instanceof PlainText)) {
		return new PlainText(text);
	}

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "PlainText", while in IE, there
	 * is no `name` property.
	 * @property       {String}             className
	 * @type           {String}
	 * @default        "PlainText"
	 * @private
	 * @since          0.0.2
	 */
	var className = 'PlainText';

	/**
	 * Marker for instances of this class.
	 * @property {String}    tag
	 * @type     {String}
	 * @private
	 * @default  "text"
	 */
	var tag = 'text';


	/**
	 * {{#crossLink "Text/tag:property"}}tag{{/crossLink}} getter.
	 * @method         getTag
	 * @return         {String}
	 * @since          0.0.4
	 */
	this.getTag = function(){
		return tag;
	};

	/**
	 * {{#crossLink "Text/className:property"}}Class name{{/crossLink}} getter.
	 * @method         getName
	 * @return         {String}
	 * @since          0.0.4
	 */
	this.getName = function(){
		return className;
	};


	/**
	 * Content of the Text() instance.
	 * @property {String} content
	 * @type     {String}
	 * @private
	 */
	var content = ((typeof text) === 'string' || (typeof text) === 'number') ? text.toString() : '';

	/**
	 * Sets the `content` of the Text() instance. If the argument is neither string nor number, the `content` is set to empty string.
	 * @method         setContent
	 * @param          {String|Number}      arg
	 * @return         {void}
	 */
	this.setContent = function(arg){
		var argType = typeof arg;
		content = (argType === 'string' || argType === 'number') ? arg.toString() : '';
	};

	// content = this.setContent(text);

	/**
	 * Returns content of the Text() instance.
	 * @method    getContent
	 * @return    {String}
	 * @type      {String}
	 */
	this.getContent = function(){
		return content.toString();
	};

	/**
	 * Returns html representation of the string which is nothing but `content` property itself.
	 * @method toHtml
	 * @return {String}
	 */
	this.toHtml = function(){
		return this.getContent().toString();
	};


	/**
	 * Loads the instance of this class with info from the argument and returns `true` if the argument is
	 * a [text node](https://developer.mozilla.org/en-US/docs/Web/API/Text) or a string. In this case
	 * {{#crossLink "Text/content:property"}}content{{/crossLink}} is set to the string content of the argument.
	 * Otherwise, `false` is returned.
	 * @method         loadFromElement
	 * @param          {DOM.TEXT|String}    elem
	 * @return         {Boolean}
	 */
	this.loadFromElement = function(elem){
		if (elem === undefined || elem === null){
			return false;
		}
		var newContent = typeof elem === 'string' ? elem : elem.textContent,
			isString = typeof newContent === 'string';
		if (isString){
			this.setContent(newContent);
		}
		return isString;
	};



	/**
	 * Returns `true` if the result of {{#crossLink "PlainText/getContent:method"}}getContent(){{/crossLink}}
	 * is an empty string, null or undefined (even if it should never happen).
	 * @method isEmpty
	 * @return {Boolean}
	 */
	this.isEmpty = function(){
		var txt = this.getContent();
		return txt === null || txt === undefined || txt === '';
	};

	/**
	 * Returns an instance of  [DOM.Text](https://developer.mozilla.org/en-US/docs/Web/API/Text)
	 * corresponding to the instance of this class.
	 * @method toNode
	 * @return {DOM.Text}
	 */
	this.toNode = function(){
		// console.log('it is called toNode on a PlainText element', this.getContent());
		return document.createTextNode(this.getContent());
	};


	/**
	 * Clones the target. Parses all attributes of the target. If the attribute responds to "clone"
	 * method, then assign the result of this method to the corresponding clone attribute. Otherwise,
	 * assign the attribute value to the clone attribute (potentially problematic for what is passed
	 * by reference and not by value, like arrays).
	 * {{#crossLink "PlainText/content:property"}}content{{/crossLink}} is a private variable, so in the
	 * clone it is fed by means of {{#crossLink "PlainText/getContent:method"}}getContent(){{/crossLink}}
	 * and {{#crossLink "PlainText/setContent:method"}}setContent(){{/crossLink}} methods.
	 * @method    clone
	 * @return    {Object}
	 */
	this.clone = function(){
		var Constr = window[this.className],
			clone, attr, current,
			strContent = this.getContent();
		clone = (typeof Constr === 'function') ?  new Constr() : new PlainText();
		for (attr in this){
			if (this.hasOwnProperty(attr)){
				current = this[attr];
				if (current && typeof current.clone === 'function'){
					clone[attr] = current.clone();
				} else {
					clone[attr] = current;
				}
			}
		}
		clone.setContent(strContent);
		return clone;
	};

	/**
	 * Returns text representation.
	 *
	 * Without this method, when Content class applies "toText()" method on its children and of
	 * them turns out to be a PlainText instance, then an empty string is paradoxically returned.
	 * @method  toText
	 * @return {String}
	 * @since  0.1.0
	 */
	this.toText = function(){
		return this.toHtml();
	};


}
