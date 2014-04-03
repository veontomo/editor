/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Tag, Content */

/**
* Represents plain text. This class is intented to represent [text node](https://developer.mozilla.org/en-US/docs/Web/API/Text) elements
* @module  HtmlElements
* @class   Text
* @since 0.0.2
*/
function Text(text) {
	// "use strict";
	if (!(this instanceof Text)) {
		return new Text(text);
	}

	/**
	 * Returns the class name.  This property is introduced for compatibility with IE: i.e.
	 * in FF, `this.constructor.name` returns "Table", while IE, it returns "undefined".
	 * This property must be overridden in all inherited classes.
	 * @property {String}    className
	 * @type     {String}
	 * @default  "Table"
	 * @since    0.0.2
	 */
	this.className = 'Text';

	/**
	 * Marker for instances of this class.
	 * @property {String}    name
	 * @type     {String}
	 * @default  "text"
	 */
	this.name = 'text';

	/**
	 * Sets the `content` of the Text() instance. If the argument is niether string nor number, the `content` is set to empty string.
	 * @method    setContent
	 * @param     {String|Number}   arg
	 * @return    {void}
	 */
	this.setContent = function(arg){
		var argType = typeof arg;
		content = (argType === 'string' || argType === 'number') ? arg.toString() : '';
		return content;

	};

	/**
	 * Content of the Text() instance.
	 * @property {String} content
	 * @type     {String}
	 * @private
	 */
	var content = this.setContent(text);

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
		return this.getContent();
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
		var content = typeof elem === 'string' ? elem : elem.textContent,
			isString = typeof content === 'string';
		if (isString){
			this.setContent(content);
		}
		return isString;
	}




}
