/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Link, Factory */

/**
* Represents plain text. This class is intented to represent [text node](https://developer.mozilla.org/en-US/docs/Web/API/Text) elements.
* Though there is no `text` tag in HTML, it is introduced here in order to consider plain text on the same basis as other tags.
* @module  HtmlElements
* @class   PlainText
* @since 0.0.2
*/
function PlainText(text) {
	// "use strict";
	if (!(this instanceof PlainText)) {
		return new PlainText(text);
	}

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor` has `name` property that returns "PlainText", while in IE, there
	 * is no `name` property.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "PlainText"
	 * @since    0.0.2
	 */
	this.className = 'PlainText';

	/**
	 * Marker for instances of this class.
	 * @property {String}    tag
	 * @type     {String}
	 * @default  "text"
	 */
	this.tag = 'text';

	/**
	 * This property is required in order to be able to recreate itself.
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
	 * Sets `factory` property. Returns `true` if the argument is an instance of
	 * {{#crossLink "Factory"}}Factory{{/crossLink}}, `false` otherwise.
	 * @method  setFactory
	 * @param   {Factory}    factory        instance of  {{#crossLink "Factory"}}Factory{{/crossLink}} class.
	 * @return  {Boolean}
	 * @since   0.0.3
	 */
	this.setFactory = function(factory){
		if(factory instanceof Factory){
			this.factory = factory;
			return true;
		}
		return false;
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
	 * @method    setContent
	 * @param     {String|Number}   arg
	 * @return    {void}
	 */
	this.setContent = function(arg){
		var argType = typeof arg;
		content = (argType === 'string' || argType === 'number') ? arg.toString() : '';
		// return content;
	};

	// content = this.setContent(text);

	/**
	 * Returns content of the Text() instance.
	 * @method    getContent
	 * @return    {String}
	 * @type      {String}
	 */
	this.getContent = function(){
		return content;
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
	 * @method  load
	 * @param {DOM.TEXT|String} elem
	 * @return  {Boolean}
	 */
	this.load = function(elem){
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
	 * Returns a link which properties are equal to those of the argument and `content` has
	 * the only elements which is equal to the target. If the argument is not a Link instance,
	 * an error is thrown.
	 * @param  {Link}       link     it is served as a template to create a link. Its
	 *                               `content` property is to be replaced by the copy of
	 *                               target object.
	 * @return {Link}
	 */
	this.toLink = function(link){
		if (!(link instanceof Link)){
			throw new Error('The argument must be a Link instance!');
		}
		var newLink, newText;
		newLink = new Link();
		newText = new PlainText(this.getContent());
		newLink.attr  = link.attr;
		newLink.style = link.style;
		newLink.appendElem(newText);
		return newLink;
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
		return document.createTextNode(this.getContent());
	};

}