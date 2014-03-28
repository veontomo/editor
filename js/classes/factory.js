/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global */

/**
 * This class is used to generate instances of Tag class, its children or of Content class.
 * @module 	    HtmlElements
 * @class  		Factory
 * @since       0.0.2
 * @author      A.Shcherbakov
 *
 */
function Factory(){
	"use strict";
	if (!(this instanceof Factory)) {
		return new Factory();
	}




	/**
	 * Object collecting info about available classes.
	 * @property {Array}  register
	 * @type     {Array}
	 */
	this.register = {'td': 'Cell', 'tr': 'Row', 'table': 'Table', 'li': 'ListItem', 'ol': 'List', 'ul': 'List', 'a': 'Link'};


	/**
	 * Returns a Tag instance. The argument is of [https://developer.mozilla.org/en-US/docs/Web/API/element](DOM.Element) type.
	 * @param  {DOM.Element}                elem    what the element is to be created from
	 * @return {Tag}
	 * @since  0.0.2
	 */
	this.produceTag = function(elem){
		var tag = new Tag();
		if(elem !== undefined){
			tag.load(elem);
		}
		return tag;
	};


}