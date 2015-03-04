/*jslint plusplus: true, white: true */

/**
 * This class associates different types of object. It is intended to be used along with
 * {{#crossLink "Factory"}}Factory{{/crossLink}} class.
 * The idea is to have criteria on which decide what type of objects should be constructed.
 * This class is responsible for these criteria.
 * @module 	    HtmlElements
 * @class  		Mapper
 * @constructor
 * @since       0.0.3
 * @author      A.Shcherbakov
 *
 */
function Mapper(){
	"use strict";
	if (!(this instanceof Mapper)) {
		return new Mapper();
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
	 * {{#crossLink "Mapper/defaultTarget:property"}}Default target{{/crossLink}} setter. Assigns only
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
	 * {{#crossLink "Mapper/defaultTarget:property"}}Default target{{/crossLink}} getter.
	 * @method   getDefaultTarget
	 * @return   {Function|Null}
	 */
	this.getDefaultTarget = function(){
		return defaultTarget;
	};


	/**
	 * Forms an object {'criterion': crit, 'target': target} from the input and it it
	 * turns out to be a valid mapping, then this mapping is
	 * appended to {{#crossLink "Mapper/mappings:property"}}mappings{{/crossLink}}
	 * and the `true` is returned. Otherwise, `false` is returned.<br>
	 * A mapping is a valid one if method
	 * {{#crossLink "Mapper/isValidMapping:method"}}isValidMapping(){{/crossLink}} returns `true`.
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
	 * Returns a copy of the {{#crossLink "Mapper/mappings:property"}}mappings{{/crossLink}}.
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
	 * Reset {{#crossLink "Mapper/mappings:property"}}mappings{{/crossLink}} to an empty array.
	 * @method   flush
	 * @return   {void}
	 */
	this.flush = function(){
		mappings = [];
	};

	/**
	 * Finds target for the argument. It parses array {{#crossLink "Mapper/mappings:property"}}mappings{{/crossLink}}
	 * and calls `criterion` function of the array element. Value of `target` key of first `criterion` that returns
	 * `true`, is returned. If not found and the second argument is different from `true`,
	 * {{#crossLink "Mapper/getDefaultTarget:method"}}getDefaultTarget(){{/crossLink}} is returned. Otherwise, nothing is
	 * returned.
	 * @method     findTargetFor
	 * @param      {Any}           needle              this variable is to be given as input for `criterion` function
	 *                                                 of each array of mappings.
	 * @param      {Boolean}       returnDefault       whether default target should be returned in case no criteria
	 *                                                 returns `true`
	 * @return     {Function|void}
	 */
	this.findTargetFor = function(needle, returnDefault){
		var mapCopy = this.getMappings(),
			len = mapCopy.length,
			i = 0, current, result;
		for (i = 0; i < len; i++){
			console.log(i, mapCopy[i]);
			current = mapCopy[i];
			result = current.criterion(needle);
			console.log(current.criterion, ' -> ', result);
			if (result){
				return current.target;
			}
		}
		if (!returnDefault){
			return this.getDefaultTarget();
		}

	};

}