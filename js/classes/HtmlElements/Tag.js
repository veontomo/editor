/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, Attributes, Content, ListItemStyle, Helper, Styles, Link, Factory, window*/

/**
 * This class is used to represent a general html tag.
 * @module 	    HtmlElements
 * @class  		Tag
 * @since       0.0.2
 * @author      A.Shcherbakov
 *
 */
function Tag() {
	"use strict";
	if (!(this instanceof Tag)) {
		return new Tag();
	}

	/**
	 * Html tag that the class represents.
	 * @property {String}          tag
	 * @default  null
	 * @since 0.0.1
	 */
	this.tag = null;

	/**
	 * This property is required in order to be able to recreate itself or its child.
	 * It is supposed to be an instance of {{#crossLink "Factory"}}Factory{{/crossLink}} class.
	 * Its value will be initialized properly when creating a clone of this element (or of one
	 * of its child). If it is not present, {{#crossLink "Factory"}}Factory{{/crossLink}} will
	 * not be able to initialize it.
	 * @property   {Object|Null}   factory
	 * @default    Null
	 * @since      0.0.3
	 */
	this.factory = null;


	/**
	 * Sets the factory. Takes care of setting `factory` property of <ol><li>
	 * {{#crossLink "Tag/attr:property"}}attr{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/style:property"}}style{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	 * </li></ol>
	 * Imposes the `factory` if the corresponding element has "factory" property.
	 * Returns `true` if the argument is an instance of {{#crossLink "Factory"}}Factory{{/crossLink}}
	 * and `false` otherwise.
	 * @method  setFactory
	 * @param   {Factory}           factory             instance of {{#crossLink "Factory"}}Factory{{/crossLink}}
	 */
	this.setFactory = function(factory){
		var that = this;
		if (factory instanceof Factory){
			this.factory = factory;
			// list of properties to take care of
			var pool = ['attr', 'style', 'content'];
			pool.forEach(function(prop){
				if(typeof that[prop].setFactory === 'function'){
					that[prop].setFactory(factory);
				}
			});
			return true;
		}
		return false;
	};

	/**
	 * Returns the class tag.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `tag` property that returns "ListItem", while in IE, there
	 * is no `tag` property.
	 * Every class that inherits from this one, should override this property.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "Tag"
	 * @since    0.0.2
	 */
	this.className = "Tag";

	/**
	 * Returns value of the attribute `tag`.
	 * @method  getName
	 * @return  {String}
	 * @since 0.0.1
	 */
	this.getName = function(){
		return this.tag;
	};


	/**
	 * Tag attributes
	 * @property {Attributes}          attr
	 * @type     {Attributes}
	 * @default  Attributes()
	 * @since 0.0.1
	 */
	this.attr = new Attributes();

	/**
	* Attribute setter.
	* @method setAttr
	* @param {String|Object} attr
	* @return {void}
	* @since 0.0.1
	*/
	this.setAttr = function(attr){
		this.attr = attr;
	};

	/**
	 * Appends style to the cell. Alias for Style::appendStyle().
	 * @method appendStyle
	 * @param  {Style|Obj}   stl   style to be appended
	 * @return {void}
	 * @since 0.0.1
	 */
	this.appendStyle = function(stl){
		this.style.appendStyle(stl);
		return null;
	};

	/**
	 * Appends style to the element at position pos. It is supposed that such an element exists
	 * and it has a property "style" which is a Style instance. In this case method
	 * Style::appendStyle() will be called on this element.
	 * Otherwise, an error is thrown.
	 * @method  appendStyleToElemAt
	 * @param  {Number}   pos
	 * @param  {any}      stl
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendStyleToElemAt = function(pos, stl){
		var elem = this.getElem(pos);
		if (elem && (elem.style instanceof Styles)){
			elem.appendStyle(stl);
		} else {
			throw new Error('Can not append style to requested element.');
		}
	};

	/**
	 * Tag styles
	 * @property {ListItemStyle}       style
	 * @type     {ListItemStyle}
	 * @default  ListItemStyle()
	 * @since    0.0.1
	 */
	this.style = new Styles();

	/**
	* Style setter.
	* @method setStyle
	* @param {String|Object} stl
	* @return {void}
	* @since 0.0.1
	*/
	this.setStyle = function(stl){
		this.style = stl;
	};

	/**
	 * Retrieves requested property from the "style" property of the current object.
	 * @method getStyleProp
	 * @param  {String} 	prop 	property tag which value should be retrieved
	 * @return {Any}
	 * @since  0.0.1
	 */
	this.getStyleProp = function(prop) {
		if (this.style.hasOwnProperty(prop)){
			return this.style[prop];
		}
	};


	/**
	 * Imposes the value of the width of the "attr" and "style" properties. In the latter, "min-width"
	 * and "max-width" are imposed as well. It is better to use with an integer argument and without
	 * unit of measurement (as attr property should not have unit of measurement in its string representation
	 * when convirting it in html form).
	 * @method      setWidth
	 * @param       {String|Number} 	w
	 * @return      {void}
	 * @since       0.0.1
	 */
	this.setWidth = function(w){
	    if(w === undefined || w === ''){
	        throw new Error('Width value is not set!');
	    }
	    this.style.setWidth(w);
		this.attr.width = w;
	};



	/**
	 * Gets the width of the object as it is present in the style property. It tends to return a number:
	 * if it is measured in "px", then the measurment unit is removed and the number is returned.
	 * @method getWidth
	 * @return {Number|String}
	 * @since 0.0.1
	 */
	this.getWidth = function(){
		var raw = this.style.getProperty('width'),
			raw2;
		if (raw){
			raw = raw.toString().trim().replace(/px$/, '');
			// try to parse it to a number. Under this operation whatever string at the end gets removed
			raw2 = parseFloat(raw, 10);
			if (raw2.toString() === raw){
				raw = raw2;
			}
		}
		//console.log('Tag::getWidth() returns ', raw);
		return raw;
	};


	/**
	 * Content of the tag.
	 * @property {Content}             content
	 * @type     {Content}
	 * @default  Content()
	 * @since    0.0.1
	 */
	this.content = new Content();

	/**
	 * Gets the element stored in property "content". Delegates its functionality to the class Content.
	 * @method getElem
	 * @param  {Number}    pos
	 * @return {any}
	 * @since  0.0.1
	 */
	this.getElem = function(pos){
		return this.content.getElem(pos);
	};

	/**
	 * Gets the first element stored in property "content". Delegates its functionality to the class Content.
	 * @method  getFirst
	 * @return  {any}
	 * @since   0.0.1
	 */
	this.getFirst = function(){
		return this.content.getFirst();
	};

	/**
	 * Gets the last element stored in property "content". Delegates its functionality to the class Content.
	 * @method  getLast
	 * @return {any}
	 * @since  0.0.1
	 */
	this.getLast = function(){
		return this.content.getLast();
	};

	/**
	 * Inserts an element into given position. Delegates its functionality to the class Content.
	 * @method  insertElemAt
	 * @param  {Number} pos
	 * @param  {any}    elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.insertElemAt = function(pos, elem){
		this.content.insertElemAt(pos, elem);
	};

	/**
	 * Appends the element to the content of the list item. Delegates to Content::appendElem().
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendElem = function(elem){
		this.content.appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its content. Delegates to Content::length().
	 * @method   length
	 * @return   {Number}
	 * @since    0.0.1
	 */
	this.length = function(){
		return this.content.length();
	};

	/**
	 * Deletes element from "content" property. Delegates its functionalality to Content::dropElemAt().
	 * @method dropElemAt
	 * @param  {Number}     pos
	 * @return {void}
	 * @since  0.0.1
	 */
	this.dropElemAt = function(pos){
		this.content.dropElemAt(pos);
	};

	/**
	 * Deletes first element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropFirst:method"}}Content::dropFirst(){{/crossLink}}.
	 * @method   dropFirst
	 * @return   {void}
	 * @since    0.0.1
	 */
	this.dropFirst = function(){
		this.content.dropFirst();
	};

	/**
	 * Deletes last element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropLast:method"}}Content::dropLast(){{/crossLink}}.
	 * @method   dropLast
	 * @return   {void}
	 * @since    0.0.1
	 */
	this.dropLast = function(){
		this.content.dropLast();
	};


	/**
	 * Gives html representation of the instance. If tag tag is undefined or empty, just html comment is generated.
	 * @method  toHtml
	 * @return  {String}                html representation of an instance of this class.
	 * @since   0.0.1
	 */
	this.toHtml = function(){
		// //console.log('Tag::toHtml(): ', this.content, Array.isArray(this.content));
		var tag = this.tag,
			style, attr, html;
		if (tag){
			style = Helper.sandwichWith('style="', this.style.toString(), '"');
			attr = this.attr.toString();
			html = '<' + [tag, attr, style].concatDropSpaces() + '>' + this.content.toHtml() + '</' + tag + '>';
		} else {
			html = '<!-- tag name is missing -->';
		}
		return html;
	};

	/**
	 * Generates plain text representation of the tag content. Calls {{#crossLink "Content/toText:method"}}Content::toText(){{/crossLink}}.
	 * @method   toText
	 * @return   {String}
	 * @since    0.0.1
	 */
	this.toText = function(){
		return this.content.toText();
	};

	/**
	 * Returns true, if the tag is empty. Returns false otherwise.
	 * <br />The tag is considered empty if `toString()` method for its {{#crossLink "Tag/attr:property"}}attr{{/crossLink}}
	 * and {{#crossLink "Tag/style:property"}}style{{/crossLink}} properties returns empty string and
	 * the {{#crossLink "Content/isEmpty:method"}}content.isEmpty(){{/crossLink}} returns true.
	 * @method  isEmpty
	 * @return  {Boolean}
	 * @since   0.0.1
	 */
	this.isEmpty = function(){
		return this.attr.toString() === '' && this.style.toString() === '' && this.content.isEmpty();
	};

	/**
	 * Trims the content. Calls method {{#crossLink "Content/trim:method"}}Content::trim(){{/crossLink}} on the
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} property.
	 * @method  trim
	 * @return  {void}
	 */
	this.trim = function(){
		this.content.trim();
		return this;
	};

	/**
	 * Appends element to the content. It is alias for the
	 * {{#crossLink "Content/appendElemIfNotEmpty:method"}}Content::appendElemIfNotEmpty(arg){{/crossLink}}
	 * @method appendElemIfNotEmpty
	 * @param  {any}      arg
	 * @return {void}
	 */
	this.appendElemIfNotEmpty = function(arg){
		this.content.appendElemIfNotEmpty(arg);
	};

	/**
	 * Returns an object transformed in a link defined in the argument. If the argument is not a Link instance, an
	 * error is thrown.
	 * <ol><li>If the target is a Link instance, then target content is copied inside the new link.</li>
	 * <li>If the target is empty (in the sense of its {{#crossLink "Tag/isEmpty:method"}}isEmpty(){{/crossLink}} method),
	 * then the target is returned without changes</li>
	 * <li>If the target is not empty, but its {{#crossLink "Tag/content:property"}}content{{/crossLink}} is empty
	 * (in the sense of its {{#crossLink "Content/isEmpty:method"}}isEmpty(){{/crossLink}} method), then a Link
	 * instance is returned. This instance wraps the target object.</li>
	 * <li>If the target {{#crossLink "Tag/content:property"}}content{{/crossLink}} is not empty, then `toLink()` is applied to
	 * each element that responds to this method. Otherwise, the element is copied without changes.</li></ol>
	 * @method  toLink
	 * @param   {Link}       link      If not a Link instance, an error is thrown.
	 * @return  {Tag|Link}             depending on the target, the result either a Link (if the target is a Link instance
	 *                                 or has empty content) or Tag (in other cases).
	 * @since  0.0.2
	 */
	this.toLink = function(link){
		if (!(link instanceof Link)){
			throw new Error('The argument must be a Link instance!');
		}
		var output, className;
		// Link transformed into a Link by changing href
		if (this instanceof Link){
			output = new Link();
			output.style = link.style;
			output.attr = link.attr;
			output.content.elements = this.content.elements;
			output.factory = this.factory;
			return output;
		}
		if (this.isEmpty()){
			return this;
		}
		if (this.content.isEmpty()){
			output = new Link();
			output.style = link.style;
			output.attr = link.attr;
			output.content.appendElem(this);
			output.factory = this.factory;
			return output;
		}
		// clone the target without 'content' property
		className = this.className;
		// //console.log('className: ', className);
		if(className) {
			output = this.factory.createInstanceByTag(className);
			if (output){
				output.tag = this.tag;
				output.factory = this.factory.clone();
				if(output.attr !== undefined){
					output.attr = this.attr;
				}
				if(output.style !== undefined){
					output.style = this.style;
				}
				if(output.content !== undefined){
					output.content = this.content.toLink(link);
				}
				output.factory = this.factory;
				return output;
			}
		}
	};

	/**
	 * Creates a clone of the target. Uses {{#crossLink "Factory/createInstanceOf:method"}}Factory::createInstanceOf(){{/crossLink}}
	 * in order to produce an instance. Parses all the attributes of the target and if the attribute
	 * <ol><li>
	 * is a string or a number, then assigns this value to the corresponding attribute of the cloned instance,
	 * </li><li>
	 * responds to an "clone" method, then calls it and assigns its result to the corresponding
	 * attribute of the cloned instance.
	 * </li></ol>
	 * Otherwise, the atttibute is ignored.
	 * @method    clone
	 * @return    {Object}
	 */
	this.clone = function(){
		var factory = this.factory,
			output, attr, current, currentType, clone;
		console.log('Tag::clone() has factory ', factory)
		if (factory){
			output = factory.createInstanceOf(this.className);
			if (output){
				for (attr in this){
					// if (this.hasOwnProperty(attr)){
						console.log('Parsing ' + attr);
						current = this[attr];
						currentType = typeof current;
						if (current && (typeof current.clone === 'function')){
							console.log(attr + ' has clone() and it is used');
							clone = current.clone();
							console.log('clone: ', clone);
							output[attr] = clone;
						} else if (currentType === 'string' || currentType === 'number'){
							console.log(attr + ' is a string or number and it is copied');
							output[attr] = current;
						} else {
							console.log(attr + ' is ignored, it is ', current );
						}
					// }
				}
			}

		}
		return output || null;
	};

	/**
	 * Populates the following properties of the target object
	 * <ol><li>
	 * {{/crossLink "Tag/tag:property"}}tag{{/crossLink}}
	 * </li><li>
	 * {{/crossLink "Tag/attr:property"}}attr{{/crossLink}} by calling
	 * {{#crossLink "Attribute/load:method"}}Attribute::load(){{/crossLink}} method.
	 * </li><li>
	 * {{/crossLink "Tag/style:property"}}style{{/crossLink}} by calling
	 * {{#crossLink "Style/load:method"}}Style::load(){{/crossLink}} method.
	 * </li><li>
	 * {{/crossLink "Tag/content:property"}}content{{/crossLink}} by calling
	 * {{#crossLink "Content/load:method"}}Content::load(){{/crossLink}} method.
	 * </li></ol>
	 * from the argument which must be an instance of
	 * [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) class. Returns `true` if
	 * the argument is of required type and the above mentioned  `load` methods return `true`. Otherwise,
	 * `false` is returned.<br />
	 * NB: DOM.Element.attributes has the form `{1: {tag: "width", value:"100", ...}, 2: {tag: "color", value:"black", ...}, ...}`
	 * @method     load
	 * @param      {Element}            elem           origin from which the element properties are to be loaded
	 * @return     {Boolean}
	 */
	this.load = function(elem){
		// var rnd = parseInt(Math.random()*1000, 10);
		// //console.info(rnd, 'Tag::load is called with argument ', elem);
		// assure that the argument is an Element instance
		var attrSucc = false,
			styleSucc = false,
			contentSucc = false,
			childrenArr = [],
			children, currentChild, attr, i, len;
		if (elem && (elem.nodeType === Node.ELEMENT_NODE)){
			children = elem.childNodes;                     // gives all child nodes (including Elements, TextNodes, etc.)
			len = children.length;
			this.tag  = elem.tagName.toLowerCase();         // setting tag of the tag
			attr  = elem.attributes;                        // NamedNodeMap
			// //console.info(rnd, 'Tag::load is calling Attribute::load with argument ', attr);
			attrSucc = this.attr.load(attr);
			// //console.info(rnd, 'Tag::load is calling Style::load with argument ', attr);
			styleSucc = this.style.load(attr);
			for (i = 0; i < len; i++){
				currentChild = children.item(i);
				childrenArr.push(currentChild);
			}
			// //console.info(rnd, 'Tag::load is calling Content::load with argument ', childrenArr);
			contentSucc = this.content.load(childrenArr);
		}
		// //console.info(rnd, 'attrSucc = ', attrSucc, ', styleSucc = ', attrSucc,', contentSucc = ', contentSucc);
		return attrSucc && styleSucc && contentSucc;
	};

	/**
	 * Returns [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)  object corresponding to the current object.
	 * Calls methods {{#crossLink "Attributes/decorateElement:method"}}Attributes::decorateElement(){{/crossLink}} to apply attributes,
	 * {{#crossLink "Style/decorateElement:method"}}Style::decorateElement(){{/crossLink}} to apply styles and
	 * {{#crossLink "Content/stickTo:method"}}Content::stickTo(){{/crossLink}} to append elements from the
	 * {{#crossLink "Tag/content:property"}}Tag::content{{/crossLink}}.
	 * @method  toNode
	 * @return  {DOM.Element}
	 */
	this.toNode = function(){
		var el = document.createElement(this.tag);
		this.style.decorateElement(el);
		this.attr.decorateElement(el);
		this.content.stickTo(el);
		return el;
	};
}

