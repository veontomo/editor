/*jslint plusplus: true, white: true */
/*global */

/**
 * Calculator
 * @module  Helper
 * @class   Calculator
 * @since   0.2.7
 * @author  a.shcherbakov@ritoll.it
 */
function Calculator(){
	"use strict";
	if (!(this instanceof Calculator)) {
		return new Calculator();
	}
	/**
	 * Supported operations
	 * @property       {Array}         _operations     array of strings representing suppored operations
	 * @since          0.2.7
	 * @private
	 */
	var _operations = ['+', '-'];

	/**
	 * Calculates expression `expr`.
	 * @method         calculate
	 * @param          {String|Number} expr
	 * @return         {String|Number}
	 * @since         0.2.7
	 */
	this.calculate = function(expr){
		if (typeof expr === 'number'){
			return expr;
		}
		if (typeof expr === 'string'){
			return _calculateAsString(expr);
		}
	};

	/**
	 * Calculates expression given as a string
	 * @method         _calculateAsString
	 * @param          {String}        expr
	 * @return         {String}
	 * @since          0.2.7
	 */
	var _calculateAsString = function(expr){
		var splitted = _cutString(expr, _operations);
		var accum = parseInt(splitted.shift(), 10);
		return _perform(splitted, accum).toString();
	};

	var _perform = function(arr, accum){
		if (arr.length === 0){
			return accum;
		}
		var oper = arr.shift();
		var accum2 = parseInt(arr.shift(), 10);
		switch (oper){
			case '+':
				return accum + _perform(arr, accum2);
			case '-':
				return accum - _perform(arr, accum2);

		}
	}

	/**
	 * Cuts string into pieces. Places of cuts are given by array `marks`.
	 * @method         _split
	 * @param          {String}        str
	 * @param          {Array}         marks
	 * @return         {Array}
	 * @since          0.2.7
	 */
	var _cutString = function(str, marks){
		var output = [],
			pos = _positions(str, marks),
			len = pos.length,
			i,
			pointer = 0;
		console.log(pos);
		if (len === 0){
			return [str];
		}
		for (i = 0; i < len; i++){
			console.log(i, pos[i], pointer);
			output.push(str.slice(pointer, pos[i]).trim());
			output.push(str.charAt(pos[i]));
			pointer = pos[i] + 1;
		}
		output.push(str.slice(pointer).trim());
		return output;
	};

	/**
	 * Returns array of increasing integers that indicate positions at which
	 * single-symbol strings in `marks` occur in `str`.
	 * @method         _positions
	 * @param          {String}        str
	 * @param          {Array}         marks
	 * @return         {Array}
	 * @since          0.2.7
	 */
	var _positions = function(str, marks){
		var i,
			len = str.length,
			output = [];
		for (i = 0; i < len; i++){
			if (marks.indexOf(str.charAt(i)) !== -1){
				output.push(i);
			}
		}
		return output;


	};



}