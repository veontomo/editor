/*jslint plusplus: true, white: true */
/*global */

/**
 * Worker.
 *
 * An object that applies certain action if some condition meets.
 *
 * @module 	    Converter
 * @class  		Worker
 * @param       {Function}       trigger
 * @param       {Function}       action
 * @constructor
 * @since       0.0.6
 * @author      A.Shcherbakov
 */

function Worker(trigger, action){
	"use strict";
	if (!(this instanceof Worker)) {
		return new Worker(trigger, action);
	}

	// if action is not given, while trigger is given, throw an error.
	// Nevertheless, give the possibility to instantiate without both
	// action and trigger.
	if (trigger !== undefined && action === undefined) {
		throw new Error('Action is missing!');
	};

	/**
	 * A trigger that decides whether the {{#crossLink "Worker/_action:property"}}_action{{/crossLink}}
	 * is to be applied or not.
	 *
	 * It is supposed to be a boolean-valued function: if it returns `true`, corresponding
	 *  {{#crossLink "Worker/_action:property"}}_action{{/crossLink}} is applied, otherwise - not.
	 *  @property      {Function}      _trigger
	 *  @private
	 */
	var _trigger;
	if (trigger !== undefined && typeof trigger === 'function'){
		_trigger = trigger;
	}

	/**
	 * An action to be applied in case {{#crossLink "Worker/_trigger:property"}}_trigger{{/crossLink}}
	 * returns `true`.
	 * @property       {Function}      _action
	 * @private
	 */
	var _action;
	if (action !== undefined && typeof action === 'function'){
		_action = action;
	}

	/**
	 * {{#crossLink "Worker/_trigger:property"}}_trigger{{/crossLink}} setter.
	 *
	 * @method         setTrigger
	 * @param          {Function}      t         function to be used as a trigger
	 * @return         {void}
	 * @throws         {Error}   If `t` is not a function
	 */
	this.setTrigger = function(t){
		if (typeof t !== 'function'){
			throw new Error('Trigger must be a function!');
		}
		_trigger = t;
	};

	/**
	 * {{#crossLink "Worker/_trigger:property"}}_trigger{{/crossLink}} getter.
	 *
	 * @method         getTrigger
	 * @return         {Function}
	 */
	this.getTrigger = function(){
		return _trigger;
	};

	/**
	 * {{#crossLink "Worker/_action:property"}}_action{{/crossLink}} setter.
	 *
	 * @method         setAction
	 * @param          {Function}      a         function to be used as an action
	 * @return         {void}
	 * @throws         {Error}   If `a` is not a function
	 */
	this.setAction = function(a){
		if (typeof a !== 'function'){
			throw new Error('Action must be a function!');
		}
		_action = a;
	};

	/**
	 * {{#crossLink "Worker/_action:property"}}_action{{/crossLink}} getter.
	 *
	 * @method         getAction
	 * @return         {Function}
	 */
	this.getAction = function(){
		return _action;
	}

	/**
	 * Elaborates argument.
	 *
	 * If the {{#crossLink "Worker/_trigger:property"}}_trigger{{/crossLink}} evaluates to `true` on the argument `n`,
	 * then {{#crossLink "Worker/_action:property"}}_action(`n`){{/crossLink}} is returned. Otherwise, `n` is returned.
	 * @method         elaborate
	 * @param          {Any}           n
	 * @return         {Any}
	 */
	this.elaborate = function(n){
		var trigger = this.getTrigger();
		return  (trigger !== undefined && trigger(n)) ? this.getAction()(n) : n;
	}




}
