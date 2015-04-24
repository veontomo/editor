/*jslint plusplus: true, white: true */
/*global */

/**
 * Calculator
 * @module  Helper
 * @class   Calculator
 * @since   0.2.7
 * @author  a.shcherbakov@ritoll.it
 */
function Calculator() {
	/**
	 * Storage for the absolute value of the result of current calculation.
	 * @type           {Number}
	 * @since          0.2.7
	 * @private
	 */
	var _memoryValue;


	/**
	 * Storage for the unit of measurement of the result of current calculation.
	 * @type           {String|Null}
	 * @since          0.2.7
	 * @private
	 */
	var _memoryUnit;

	/**
	 * {{#crossLink "Calculator/_memoryValue:property"}}_memoryValue{{/crossLink}} getter.
	 * @method         getValue
	 * @return         {Number}
	 * @since          0.2.7
	 */
	this.getValue = function(){
		return _memoryValue;
	};

	/**
	 * {{#crossLink "Calculator/_memoryUnit:property"}}_memoryUnit{{/crossLink}} getter.
	 * @method         getUnit
	 * @return         {String|Null}
	 * @since          0.2.7
	 */
	this.getUnit = function(){
		return _memoryUnit;
	};

	/**
	 * Initializes {{#crossLink "Calculator/_memoryValue:property"}}_memoryValue{{/crossLink}}
	 * and {{#crossLink "Calculator/_memoryUnit:property"}}_memoryUnit{{/crossLink}} of the calculator:
	 * if the argument is given, then the values of the above fields are set based on it,
	 * otherwise they are set to `0` and `null` correspondingly.
	 * @method         init
	 * @param          {String|Number}  x  [Optional]
	 * @return         {void}
	 */
	this.init = function(x){
		if (x !== undefined){
			var xParsed = this.parse(x);
			_memoryValue = xParsed.value;
			_memoryUnit = xParsed.unit;
		} else {
			_memoryValue = 0;
			_memoryUnit = null;
		}
	};

	/**
	 * Returns an object with keys "value" and "unit" that represents the input argument.
	 * @method         parse
	 * @param          {String|Number}    x
	 * @return         {Object|Null}
	 * @since          0.2.7
	 */
	this.parse = function(x){
		var result = {'value': null, 'unit': null};
		if (typeof x === 'number'){
			result.value = x;
			return result;
		}
		var xTrimmed = x.trim();
		var value = parseFloat(xTrimmed, 10);
		if (isNaN(value)){
			return;
		}
		result.value = value;
		var unit = xTrimmed.replace(value.toString(), '').trim();
		if (unit.length > 0){
			result.unit = unit;
		}
		return result;
	};



	/**
	 * Adds `x` to the value stored in the calculator memory.
	 * @method         add
	 * @param          {String|Number} x
	 * @since          0.2.7
	 * @throws         {Error}         If the values can not be summed up
	 * @chainable
	 */
	this.add = function(x){
		var xParsed = this.parse(x);
		if (!xParsed || _memoryUnit !== xParsed.unit){
			throw new Error('Can not add ' + x.toString());
		}
		_memoryValue += xParsed.value;
		return this;
	};

	/**
	 * Subtracts `x` from the value stored in the calculator memory.
	 * @method         sub
	 * @param          {String|Number} x
	 * @since          0.2.7
	 * @throws         {Error}         If the values can not be subtracted
	 * @chainable
	 */
	this.sub = function(x){
		var xParsed = this.parse(x);
		if (!xParsed || _memoryUnit !== xParsed.unit){
			throw new Error('Can not subtract ' + x.toString());
		}
		_memoryValue -= xParsed.value;
		return this;
	};

	/**
	 * Returns an array with two integer numbers [b, n] such that x = b * 10^n, where both b does
	 * not contain trailing zeroes.
	 * @method         canonicalForm
	 * @param          {Number}        x
	 * @return         {Array}
	 */
	this.canonicalForm = function(x){
		if (x === 0){
			return [0, 0];
		}
		var str = x.toString(),
			len = str.length,
			separ = '.',
			pointPos = str.indexOf(separ),
			base, exp;
			console.log('str: ' + str + ', len: ' + len + ', pointPos: ' + pointPos);

		if (pointPos !== -1){
			base = parseInt(str.replace(separ, ''), 10);
			exp = pointPos + 1 - len;
			console.log(base, exp);
			return [base, exp];
		}
		var pattern = new RegExp(/0*$/),
			startTrailZeroPos = str.search(pattern);
		console.log('startTrailZeroPos: ' + startTrailZeroPos);
		base = parseInt(str.replace(pattern, ''), 10);
		exp = len - startTrailZeroPos;
		console.log(base, exp);
		return [base, exp];

	};



}


