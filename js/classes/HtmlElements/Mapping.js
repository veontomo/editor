/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global  */

/**
 * This class associates different types of object. It is intended to be used along with
 * {{#crossLink "Factory"}}Factory{{/crossLink}} class.
 * The idea is to have criteria on which decide what type of objects should be constructed.
 * This class is responsible for these criteria.
 * @module 	    HtmlElements
 * @class  		Factory
 * @since       0.0.3
 * @author      A.Shcherbakov
 *
 */
function Mapping(){
	"use strict";
	if (!(this instanceof Mapping)) {
		return new Mapping();
	}
	/**
	 * Array of mappings. Each array element is an object with two keys: `criterion` and `target`.
	 * Value of `criterion` must be a boolean-valued function, while `target` must be a class.
	 * @property    {Array}     mappings
	 * @type        {Array}
	 * @private
	 * @default     []
	 */
	var mappings = [];

	/**
	 * If the argument is a valid mapping, then appends it to {{#crossLink "Mapping/mappings:property"}}mappings{{/crossLink}}
	 * and return `true`. Otherwise, `false` is returned. A mapping is a valid one if method
	 * {{#crossLink "Mapping/isValidMapping:method"}}isValidMapping(){{/crossLink}} returns `true`.
	 * @method    addCriterion
	 * @param     {Object}         map
	 * @return 	  {Boolean}
	 */
	this.add = function(map){
		var isValid = this.isValidMapping(map);
		if (isValid){
			mappings.push(map);
		}
		return isValid;
	};

	/**
	 * Returns a copy of the {{#crossLink "Mapping/mappings:property"}}mappings{{/crossLink}}.
	 * @method    getCriteria
	 * @return    {Array}
	 */
	this.getMappings = function(){
		// returns a clone
		return mappings.slice(0);

	};

	/**
	 * Returns `true` if the argument is an object with function-valued keys `criterion` and `target`.
	 * Returns `false` otherwise.
	 * @method  isValidMapping
	 * @param   {Object}    map
	 * @return  {Boolean}
	 */
	this.isValidMapping = function(map){
		return (map !== undefined) && (typeof map.criterion === 'function') && (typeof map.target === 'function');
	};

	/**
	 * Reset {{#crossLink "Mapping/mappings:property"}}mappings{{/crossLink}} to an empty array.
	 * @return {[type]} [description]
	 */
	this.flush = function(){
		mappings = [];
	}

}