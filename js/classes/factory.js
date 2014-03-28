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


}