/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, Attributes, Content, Styles, window, Helper, Properties */

/**
 * This class is used to represent a general html tag.
 * @module 	    HtmlElements
 * @class  		Tag
 * @constructor
 * @param      {String}        tName           html tag corresponding to the class.
 * @since       0.0.3
 * @author      A.Shcherbakov
 *
 */
function Tag(tName) {
	"use strict";
	if (!(this instanceof Tag)) {
		return new Tag();
	}

	/**
	 * Html tag corresponding to this class.
	 * @property       {String}             tag
	 * @default        null
	 * @private
	 * @since          0.0.1
	 */
	var tag = tName || null;

	/**
	 * Name of the current class.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `tag` property that returns "Tag", while in IE, there
	 * is no `tag` property.
	 * Every class that inherits from this one, should override this property.
	 * @property       {String}    className
	 * @type           {String}
	 * @default        "Tag"
	 * @private
	 * @readOnly
	 * @since          0.0.2
	 */
	var className = 'Tag';

	/**
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} getter.
	 * @method         getTag
	 * @return         {String}
	 * @since          0.0.1
	 */
	this.getTag = function(){
		return tag;
	};


	/**
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} setter. If the argument is
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
				tag = name;
			} else if (nameType === 'number'){
				tag = name.toString();
			}
		}
	};

	/**
	 * Represents all properties of the tag. Previously, it was split into Attributes and Styles.
	 * @private
	 * @property       {Properties}         _properties
	 * @type           {Properties}
	 * @default 	   Properties()
	 * @since          0.0.5
	 */
	var _properties = new Properties();

	/**
	 * Content of the tag.
	 * @property       {Content}            content
	 * @type           {Content}
	 * @default        Content()
	 * @private
	 * @since          0.0.4
	 */
	var content = new Content();



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
	 * {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}} getter.
	 *
	 * @return {String}
	 * @since  0.0.6
	 */
	this.getMarker = function(){
		return _marker;
	};

	/**
	 * {{#crossLink "Tag/_marker:property"}}_marker{{/crossLink}} setter.
	 * @param          {String}        str
	 * @since          0.0.6
	 */
	this.setMarker = function(str){
		if (typeof str === 'string' && str !== ''){
			_marker = str;
		}
	};

	/**
	 * Sets {{#crossLink "Tag/_properties:property"}}properties{{/crossLink}} of the tag. If the argument is an instance
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
	* Smart {{#crossLink "Tag/content:property"}}content{{/crossLink}} setter. If the argument is a
	* {{#crossLink "Content"}}Content{{/crossLink}} instance, then
	* {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	* is set to this value. Otherwise, the argument is passed to the constructor of new instance of
	* {{#crossLink "Content"}}Content{{/crossLink}} and the result is assigned to
	* {{#crossLink "Tag/content:property"}}content{{/crossLink}}
	* with provided and the ar
	* @method          setContent
	* @param           {any}                cntn
	* @return          {void}
	* @since           0.0.1
	*/
	this.setContent = function(cntn){
		if (cntn instanceof Content){
			content = cntn;
		} else {
			content = new Content(cntn);
		}

	};

	/**
	* Returns copy of {{#crossLink "Tag/content:property"}}Content{{/crossLink}}.
	* @method          getContent
	* @return          {Content}
	* @since           0.0.4
	*/
	this.getContent = function(){
		return content.clone();
	};

	/**
	 * {{#crossLink "Tag/className:property"}}Class name{{/crossLink}} getter.
	 * @method         getName
	 * @return         {String}
	 */
	this.getName = function(){
		return className;
	};

	/**
	 * {{#crossLink "Tag/className:property"}}Class name{{/crossLink}} setter. Use it with caution. This
	 * method is intended to be used in classes that inherite from this one in order to set the name attribute.
	 * (If only were there a late binding ...)
	 * @method         setName
	 * @param          {String} name
	 * @return         {void}
	 */
	this.setName = function(name){
		if (typeof name === 'string'){
			className = name;
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
		content.appendStyleToElemAt(pos, stl);
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
	 * to `value`. Alias for {{#crossLink "Properties/setProperty:property"}}setProperty{{/crossLink}}
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
	 * Returns `true` if {{#crossLink "Tag/styles:property"}}styles{{/crossLink}}
	 * contains attribute `key` and `false` otherwise.
	 * @method         hasStyleProperty
	 * @param          {String}             key
	 * @return         {Boolean}
	 */
	this.hasStyleProperty = function(key){
		var stl = this.getStyles();
		return (stl && stl.hasProperty(key));
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
	 * Retrieves value of `width` attribute of {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} property.
	 * If it does not exist, value of `width` key of {{#crossLink "Tag/_core:property"}}_core{{/crossLink}} is returned.
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
	 * {{#crossLink "Tag/content"}}content{{/crossLink}}.
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
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}}. If the argument
	 * is not array, not assignment occures.
	 * @method         setElements
	 * @param          {Array}              arr
	 */
	this.setElements = function(arr){
		if (Array.isArray(arr)){
			content.setElements(arr);
		}
	};

	/**
	 * Gets the element stored in {{#crossLink "Tag/content:property"}}content{{/crossLink}}. Delegates its
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
	 * Returns copy of the first element of {{#crossLink "Tag/content:property"}}content{{/crossLink}}.
	 * Alias for {{#crossLink "Content/getFirst:method"}}Content::getFirst{{/crossLink}}.
	 * @method         getFirst
	 * @return         {any}
	 * @since          0.0.1
	 */
	this.getFirst = function(){
		return this.getContent().getFirst();
	};

	/**
	 * Returns copy of the first element of {{#crossLink "Tag/content:property"}}content{{/crossLink}}.
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
		content.insertElemAt(pos, elem);
	};

	/**
	 * Appends the element to the content of the list item. Delegates its functionality to
	 * {{#crossLink "Content/appendElem:method"}}appendElem{{/crossLink}}.
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendElem = function(elem){
		content.appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its content. Delegates to Content::length().
	 * @method          length
	 * @return          {Number}
	 * @since           0.0.1
	 */
	this.length = function(){
		return this.getContent().length();
	};

	/**
	 * Deletes element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropElemAt:method}}dropElemAt{{/crossLink}}.
	 * @method         dropElemAt
	 * @param          {Any}                pos     intented to be an integer, but no check is performed
	 * @return         {Any}
	 * @since          0.0.1
	 */
	this.dropElemAt = function(pos){
		return content.dropElemAt(pos);
	};

	/**
	 * Deletes first element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropFirst:method"}}Content::dropFirst(){{/crossLink}}.
	 * @method         dropFirst
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.dropFirst = function(){
		content.dropFirst();
	};

	/**
	 * Deletes last element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropLast:method"}}Content::dropLast(){{/crossLink}}.
	 * @method         dropLast
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.dropLast = function(){
		content.dropLast();
	};


	/**
	 * If {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} is a non-empty string, then it is
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
	 * If {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} is not a non-empty string, just html comment is generated.
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
	 * Generates plain text representation of the tag content. Calls {{#crossLink "Content/toText:method"}}Content::toText(){{/crossLink}}.
	 * @method         toText
	 * @return         {String}
	 * @since          0.0.1
	 */
	this.toText = function(){
		return this.getContent().toText();
	};

	/**
	 * Returns true, if the tag is empty. Returns false otherwise.<br />
	 * The tag is considered empty if `isEmpty()` method for its {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * and {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and {{#crossLink "Content"}}content{{/crossLink}} returns true.
	 * @method         isEmpty
	 * @return         {Boolean}
	 * @since          0.0.1
	 */
	this.isEmpty = function(){
		return this.getProperties().isEmpty() && this.getContent().isEmpty();
	};

	/**
	 * Empties {{#crossLink "Tag/content:property"}}content{{/crossLink}}.
	 * @method         flushContent
	 * @return         {void}
	 */
	this.flushContent = function(){
		content.flush();
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
	 * Trims the content. Calls method {{#crossLink "Content/trim:method"}}Content::trim(){{/crossLink}} on the
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} property.
	 * @method  trim
	 * @return  {void}
	 */
	this.trim = function(){
		content.trim();
		// return this;
	};

	/**
	 * Appends element to the content. It is alias for the
	 * {{#crossLink "Content/appendElem:method"}}Content::appendElemIfNotEmpty(arg){{/crossLink}}
	 * @method appendElemIfNotEmpty
	 * @param  {any}      arg
	 * @return {void}
	 */
	this.appendElemIfNotEmpty = function(arg){
		content.appendElemIfNotEmpty(arg);
	};


	/**
	 * Creates a clone of the target. If the target has a `className` attribute corresponding to
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
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}} by calling
	 * {{#crossLink "Properties/load:method"}}load(){{/crossLink}} method.
	 * </li><li>
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} by calling
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
		var propNew,
			propSucc = false,
			contentSucc = false,
			childrenArr = [],
			children, currentChild, attr, i, len;
		if (elem && (elem.nodeType === Node.ELEMENT_NODE)){
			children = elem.childNodes;                      // gives all child nodes (including Elements, TextNodes, etc.)
			len = children.length;
			this.setTag(elem.tagName.toLowerCase());         // setting tag of the tag
			attr  = elem.attributes;
			if (attr){
				propNew = this.getProperties();
				propSucc = propNew.load(attr);
				this.setProperties(propNew);
			}
			for (i = 0; i < len; i++){
				currentChild = children.item(i);
				childrenArr.push(currentChild);
			}
			contentSucc = content.load(childrenArr);
		}
		return propSucc && contentSucc;
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
	 * Applies function `fun` to each element of {{#crossLink "Tag/content:property"}}content{{/crossLink}}.
	 *
	 * It is an alias for {{#crossLink "Content/applyToAll:method"}}Content::applyToAll(){{/crossLink}} method.
	 *
	 * @method         applyToAll
	 * @param          {Function}      fun         function to be applied to each element of content
	 * @since          0.0.6
	 */
	this.applyToAll = function(fun){
		if (content && typeof fun === 'function'){
			content.applyToAll(fun);
		}
	};

	/**
	 * Marks the target.
	 *
	 * Assign value of variable {{#crossLink "Tag/className:property"}}classname{{/crossLink}} to attribute `marker`
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
}
