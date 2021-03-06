/*jslint plusplus: true, white: true */
/*global Node, window */

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

/**
 * {{#crossLink "PlainText"}}PlainText{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class PlainText is designed
 * to represent.  Inheriting classes (if any) are supposed to implement their own characteristic functions.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.6
 */
PlainText.prototype.characteristicFunction = function(n){
	return (n instanceof Node) && (n.nodeType === Node.TEXT_NODE);
};
