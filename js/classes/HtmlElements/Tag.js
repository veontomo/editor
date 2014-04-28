/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, Attributes, Content, Styles, window, Helper */

/**
 * This class is used to represent a general html tag.
 * @module 	    HtmlElements
 * @class  		Tag
 * @constructor
 * @since       0.0.3
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
	 * @property   {String}          tag
	 * @default    null
	 * @private
	 * @since      0.0.1
	 */
	var tag = null;

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
	 * Attributes of the tag.
	 * @property       {Attributes}         attributes
	 * @type           {Attributes}
	 * @default        Attributes()
	 * @private
	 * @since          0.0.4
	 */
	var attributes = new Attributes();

	/**
	 * Tag styles
	 * @property       {Styles}             styles
	 * @type           {Styles}
	 * @default        Styles()
	 * @private
	 * @since          0.0.4
	 */
	var styles = new Styles();


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
	* {{#crossLink "Tag/attributes:property"}}Attributes{{/crossLink}} setter.
	* @method          setAttributes
	* @param           {String|Object}      attr
	* @return          {void}
	* @since           0.0.1
	*/
	this.setAttributes = function(attr){
		attributes = new Attributes(attr);
	};

	/**
	* {{#crossLink "Tag/attributes:property"}}Attributes{{/crossLink}} getter.
	* @method          getAttributes
	* @return          {Attributes}
	* @since           0.0.4
	*/
	this.getAttributes = function(){
		return attributes;
	};



	/**
	* Smart {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} setter.
	* @method          setStyles
	* @param           {any}                stl
	* @return          {void}
	* @since           0.0.4
	*/
	this.setStyles = function(stl){
		if (stl instanceof Styles){
			styles = stl;
		} else {
			styles = new Styles(stl);
		}

	};


	/**
	* {{#crossLink "Tag/styles:property"}}Styles{{/crossLink}} getter.
	* @method          getStyle
	* @return          {Styles}
	* @since           0.0.4
	*/
	this.getStyles = function(){
		return styles;
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
	* {{#crossLink "Tag/content:property"}}Content{{/crossLink}} getter.
	* @method          getContent
	* @return          {Content}
	* @since           0.0.4
	*/
	this.getContent = function(){
		return content;
	};

	/**
	 * {{#crossLink "Tag/className:property"}}Class name{{/crossLink}} getter.
	 * @return         {String}
	 */
	this.getName = function(){
		return className;
	};

	/**
	 * {{#crossLink "Tag/className:property"}}Class name{{/crossLink}} setter.
	 * @method         setName
	 * @param          {String} name
	 * @return         {void}
	 */
	this.setName = function(name){
		className = name;
	};



	/**
	 * Appends style to the cell. Alias for Style::appendStyle().
	 * @method         appendStyle
	 * @param          {Style|Obj}   stl   style to be appended
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.appendStyle = function(stl){
		this.getStyles().appendStyle(stl);
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
		this.getContent().appendStyleToElemAt(pos, stl);
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
		return this.getStyles().getProperty(prop);
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
		return this.getStyles().setProperty(key, value);
	};

	/**
	 * Retrieves requested property from {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * property of the current object.
	 * @method         getAttrProperty
	 * @param          {String} 	        prop 	property name to be retrieved from the attributes
	 * @return         {Any}
	 * @since          0.0.4
	 */
	this.getAttrProperty = function(prop) {
		return this.getAttributes().getProperty(prop);
	};

	/**
	 * Imposes requested property value in {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * property of the current object.
	 * @method         setAttrProperty
	 * @param          {String} 	        key 	   property name to be set
	 * @param          {String} 	        value 	   property value
	 * @return         {Any}
	 * @since          0.0.4
	 */
	this.setAttrProperty = function(key, value) {
		return this.getAttributes().setProperty(key, value);
	};



	/**
	 * Calls {{#crossLink "Styles/setWidth:method"}}setWidth(){{/crossLink}} and
	 * {{#crossLink "Attributes/setProperty:method"}}setProperty(){{/crossLink}} methods to set the widths.
	 * @method         setWidth
	 * @param          {String|Number} 	    w
	 * @return         {void}
	 * @since          0.0.1
	 */
	this.setWidth = function(w){
		if (w !== undefined){
		    this.getStyles().setWidth(w);
			this.getAttributes().setProperty('width', w);
		}
	};

	/**
	 * Retieves `width` of {{#crossLink "Tag/style:property"}}style{{/crossLink}} property.
	 * @method         getWidth
	 * @return         {mixed}
	 * @since          0.0.4
	 */
	this.getWidth = function(){
		return this.getStyles().getProperty('width');
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
	 * Gets the first element stored in property "content". Delegates its functionality to the class
	 * {{#crossLink "Content"}}Content{{/crossLink}}.
	 * @method  getFirst
	 * @return  {any}
	 * @since   0.0.1
	 */
	this.getFirst = function(){
		return this.getContent().getFirst();
	};

	/**
	 * Gets the last element stored in property "content". Delegates its functionality to
	 * the class {{#crossLink "Content"}}Content{{/crossLink}}.
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
		this.getContent().insertElemAt(pos, elem);
	};

	/**
	 * Appends the element to the content of the list item. Delegates to Content::appendElem().
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 * @since  0.0.1
	 */
	this.appendElem = function(elem){
		this.getContent().appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its content. Delegates to Content::length().
	 * @method   length
	 * @return   {Number}
	 * @since    0.0.1
	 */
	this.length = function(){
		return this.getContent().length();
	};

	/**
	 * Deletes element from "content" property. Delegates its functionalality to Content::dropElemAt().
	 * @method dropElemAt
	 * @param  {Number}     pos
	 * @return {void}
	 * @since  0.0.1
	 */
	this.dropElemAt = function(pos){
		this.getContent().dropElemAt(pos);
	};

	/**
	 * Deletes first element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropFirst:method"}}Content::dropFirst(){{/crossLink}}.
	 * @method   dropFirst
	 * @return   {void}
	 * @since    0.0.1
	 */
	this.dropFirst = function(){
		this.getContent().dropFirst();
	};

	/**
	 * Deletes last element from "content" property. Delegates its functionalality to
	 * {{#crossLink "Content/dropLast:method"}}Content::dropLast(){{/crossLink}}.
	 * @method   dropLast
	 * @return   {void}
	 * @since    0.0.1
	 */
	this.dropLast = function(){
		this.getContent().dropLast();
	};


	/**
	 * Gives html representation of the instance. If tag tag is undefined or empty, just html comment is generated.
	 * @method         toHtml
	 * @return         {String}             html representation of an instance of this class.
	 * @since          0.0.1
	 */
	this.toHtml = function(){
		// //console.log('Tag::toHtml(): ', this.getContent(), Array.isArray(this.getContent()));
		var styleStr = this.getStyles().toString(),
			attrStr = this.getAttributes().toString(),
			tagStr = this.getTag(),
			constStr = this.getContent().toHtml(),
			html;
		if (tagStr){
			styleStr = Helper.sandwichWith('style="', styleStr, '"');
			html = '<' + [tagStr, attrStr, styleStr].concatDropSpaces() + '>' + constStr + '</' + tagStr + '>';
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
		return this.getAttributes().isEmpty() && this.getStyles().isEmpty() && this.getContent().isEmpty();
	};

	/**
	 * Trims the content. Calls method {{#crossLink "Content/trim:method"}}Content::trim(){{/crossLink}} on the
	 * {{#crossLink "Tag/content:property"}}content{{/crossLink}} property.
	 * @method  trim
	 * @return  {void}
	 */
	this.trim = function(){
		this.getContent().trim();
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
		this.getContent().appendElemIfNotEmpty(arg);
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
		var Constr = window[this.className],
			clone, attr, current;
		clone = (typeof Constr === 'function') ?  new Constr : new Tag();
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
		return clone;
	};

	/**
	 * Populates the following properties of the target object
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}}
	 * </li><li>
	 * {{#crossLink "Tag/attr:property"}}attr{{/crossLink}} by calling
	 * {{#crossLink "Attribute/load:method"}}Attribute::load(){{/crossLink}} method.
	 * </li><li>
	 * {{#crossLink "Tag/style:property"}}style{{/crossLink}} by calling
	 * {{#crossLink "Style/load:method"}}Style::load(){{/crossLink}} method.
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
			this.setTag(elem.tagName.toLowerCase());         // setting tag of the tag
			attr  = elem.attributes;                        // NamedNodeMap
			// //console.info(rnd, 'Tag::load is calling Attribute::load with argument ', attr);
			attrSucc = this.getAttributes().load(attr);
			// //console.info(rnd, 'Tag::load is calling Style::load with argument ', attr);
			styleSucc = this.getStyles().load(attr);
			for (i = 0; i < len; i++){
				currentChild = children.item(i);
				childrenArr.push(currentChild);
			}
			// console.info(rnd, 'Tag::load is calling Content::load with argument ', childrenArr);
			contentSucc = this.getContent().load(childrenArr);
		}
		// console.info(rnd, 'attrSucc = ', attrSucc, ', styleSucc = ', attrSucc,', contentSucc = ', contentSucc);
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
		var rnd = parseInt(Math.random()*1000, 10);
		console.info(rnd, 'Tag::toNode() called', this.tag);
		var el = document.createElement(this.getTag());
		this.getStyles().decorateElement(el);
		this.getAttributes().decorateElement(el);
		console.info(rnd, 'Tag::toNode() el before this.getContent().stickTo', el);
		this.getContent().stickTo(el);
		console.info(rnd, 'Tag::toNode() returns ', el);
		return el;

	};
}

