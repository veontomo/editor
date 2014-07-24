/*jslint plusplus: true, white: true */

/**
 * This class is responsable for deciding which converter must be used in order to
 * transform into specific format.
 * @module 	    HtmlElements
 * @class  		FormatMapper
 * @constructor
 * @since       0.0.5
 * @author      A.Shcherbakov
 *
 */
function FormatMapper(){
	"use strict";
	if (!(this instanceof FormatMapper)) {
		return new FormatMapper();
	}

	/**
	 * Array of objects of the form `{crit: ..., target: }`.
	 *
	 * Each function takes one argument and returns a class
	 * @property       {Array}              _map
	 * @type           {Array}
	 * @private
	 */
	var _map = [];


}