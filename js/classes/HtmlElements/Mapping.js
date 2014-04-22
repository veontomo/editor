/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global  */

/**
 * This class associates different types of object. It is intended to be used along with
 * {{#crossLink "Factory"}}Factory{{/crossLink}} class.
 * The idea is to have criteria on which decide what type of objects should be constructed.
 * This class is responsible for these criteria.
 * @module 	    HtmlElements
 * @class  		Mapping
 * @constructor
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
	 * Default target.
	 * @property    {Function|Null}     defaultTarget
	 * @private
	 * @default     null
	 */
	var defaultTarget = null;

	/**
	 * {{#crossLink "Mapping/defaultTarget:property"}}Default target{{/crossLink}} setter. Assigns only
	 * if the argument is a function.
	 * @method   setDefaultTarget
	 * @param    {Function}     fun
	 * @return   {void}
	 */
	this.setDefaultTarget = function(fun){
		if (typeof fun === 'function'){
			defaultTarget = fun;
		}
	};

	/**
	 * {{#crossLink "Mapping/defaultTarget:property"}}Default target{{/crossLink}} getter.
	 * @method   getDefaultTarget
	 * @return   {Function|Null}
	 */
	this.getDefaultTarget = function(){
		return defaultTarget;
	}


	/**
	 * Forms an object {'criterion': crit, 'target': target} from the input and it it
	 * turns out to be a valid mapping, then this mapping is
	 * appended to {{#crossLink "Mapping/mappings:property"}}mappings{{/crossLink}}
	 * and the `true` is returned. Otherwise, `false` is returned.<br>
	 * A mapping is a valid one if method
	 * {{#crossLink "Mapping/isValidMapping:method"}}isValidMapping(){{/crossLink}} returns `true`.
	 * @method    add
	 * @param     {Function}         criterion
	 * @param     {Function}         target
	 * @return 	  {Boolean}
	 */
	this.add = function(crit, target){
		var map = {}, isValid;
		if (crit !== undefined){
			map.criterion = crit;
		}
		if (target !== undefined){
			map.target = target;
		}
		isValid = this.isValidMapping(map);
		if (isValid){
			mappings.push(map);
		}
		return isValid;
	};

	/**
	 * Returns a copy of the {{#crossLink "Mapping/mappings:property"}}mappings{{/crossLink}}.
	 * @method    getMappings
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
	 * @method   flush
	 * @return   {void}
	 */
	this.flush = function(){
		mappings = [];
	};

	/**
	 * Finds target for the argument. It parses array {{#crossLink "Mapping/mappings:property"}}mappings{{/crossLink}}
	 * and calls `criterion` function of the array element. Value of `target` key of first `criterion` that returns
	 * `true`, is returned. If not found,
	 * {{#crossLink "Mapping/getDefaultTarget:method"}}getDefaultTarget(){{/crossLink}} is returned.
	 * @method     findTargetFor
	 * @param      {Any}           needle              this variable is to be given as input for `criterion` function
	 *                                                 of each array of mappings.
	 * @return     {Function|Null}
	 */
	this.findTargetFor = function(needle){
		var mappings = this.getMappings(),
			len = mappings.length,
			i = 0, current;
		for (i = 0; i < len; i++){
			current = mappings[i];
			if (current.criterion(needle)){
				return current.target;
			}
		}
		return this.getDefaultTarget();

	};

}