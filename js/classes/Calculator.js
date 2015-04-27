/*jslint plusplus: true, white: true */
/*global */

/**
 * Calculator.
 *
 * Naive version of calculator that is able to perform operations with
 * quantities with dimensions (i.e. 1px + 6px, 7em*2).
 * @module  Helper
 * @class   Calculator
 * @since   0.2.7
 * @author  a.shcherbakov@ritoll.it
 */
function Calculator() {
    /**
     * Storage for the absolute value of the result of current calculation.
     * @property       {Number}        _memoryValue
     * @since          0.2.7
     * @private
     */
    var _memoryValue;


    /**
     * Storage for the unit of measurement of the result of current calculation.
     * @property       {String|Null}   _memoryUnit
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
    this.getValue = function() {
        return _memoryValue;
    };

    /**
     * {{#crossLink "Calculator/_memoryUnit:property"}}_memoryUnit{{/crossLink}} getter.
     * @method         getUnit
     * @return         {String|Null}
     * @since          0.2.7
     */
    this.getUnit = function() {
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
    this.init = function(x) {
        if (x !== undefined) {
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
    this.parse = function(x) {
        var result = {
            'value': null,
            'unit': null
        };
        if (typeof x === 'number') {
            result.value = x;
            return result;
        }
        var xTrimmed = x.trim();
        var value = parseFloat(xTrimmed, 10);
        if (isNaN(value)) {
            return;
        }
        result.value = value;
        var unit = xTrimmed.replace(value.toString(), '').trim();
        if (unit.length > 0) {
            result.unit = unit;
        }
        return result;
    };


    /**
     * Sums up two numbers in such a way that javascript artefact
     * zeroes do not appear.
     * @method          preciseSum
     * @param           {Number}       x
     * @param           {Number}       y
     * @return          {Number}
     * @since           0.2.7
     */
    this.preciseSum = function(x, y) {
        var xCan = this.toBaseExp(x),
            yCan = this.toBaseExp(y),
            minExp, result,
            x1, y1;
        minExp = xCan[1] > yCan[1] ? yCan[1] : xCan[1];
        x1 = this.toStandard([xCan[0], xCan[1] - minExp]);
        y1 = this.toStandard([yCan[0], yCan[1] - minExp]);
        result =  this.toStandard([x1 + y1, minExp]);
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
    this.add = function(x) {
        var xParsed = this.parse(x);
        if (!xParsed || _memoryUnit !== xParsed.unit) {
            throw new Error('Can not add ' + x.toString());
        }
        _memoryValue = this.preciseSum(_memoryValue, xParsed.value);
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
    this.sub = function(x) {
        var xParsed = this.parse(x);
        if (!xParsed || _memoryUnit !== xParsed.unit) {
            throw new Error('Can not subtract ' + x.toString());
        }
        _memoryValue = this.preciseSum(_memoryValue, -xParsed.value);
        return this;
    };

    /**
     * Returns an array with two integer numbers [b, n] such that x = b * 10^n, where both b does
     * not contain trailing zeroes.
     * @method         toBaseExp
     * @param          {Number}        x
     * @return         {Array}
     * @since          0.2.7
     */
    this.toBaseExp = function(x) {
        if (x === 0) {
            return [0, 0];
        }
        var str = x.toString(),
            len = str.length,
            separ = '.',
            pointPos = str.indexOf(separ),
            base, exp;
        if (pointPos !== -1) {
            base = parseInt(str.replace(separ, ''), 10);
            exp = pointPos + 1 - len;
            return [base, exp];
        }
        var pattern = new RegExp(/0*$/),
            startTrailZeroPos = str.search(pattern);
        base = parseInt(str.replace(pattern, ''), 10);
        exp = len - startTrailZeroPos;
        return [base, exp];
    };

    /**
     * Convert base-exp representation of a number into the standard one: [b, n] -> b*10^n
     *
     * In order to avoid ofthen JS results like 2.4/10 = 0.240000...004, the method performs operations
     * by means of String class functionality (padding original number with required number of zeroes).
     * @method         toStandard
     * @param          {Array}         baseExp
     * @return         {Number}
     * @since          0.2.7
     */
    this.toStandard = function(baseExp) {
        var exp = baseExp[1],
            base = baseExp[0],
            baseStr = base.toString(),
            baseLen, shift;
        if (exp === 0) {
            return base;
        }
        if (exp > 0) {
            return parseInt(baseStr + (new Array(1 + exp).join('0')), 10);
        }
        baseLen = baseStr.length;
        shift = baseLen + exp;
        if (shift > 0) {
            return parseFloat(baseStr.slice(0, shift) + '.' + baseStr.slice(shift), 10);
        }
        return parseFloat('0.' + (new Array(1 - shift).join('0')) + baseStr, 10);
    };

    /**
     * Multiplies {{#crossLink "Calculate/_memoryValue:property"}}_memoryValue{{/crossLink}}
     * by `x`.
     * @method         mult
     * @param          {Number}        x
     * @return         {Calculator}          Current instance with updated state
     * @chainable
     * @since          0.2.7
     */
    this.mult = function(x){
    	_memoryValue *= x;
    	return this;
    };


    /**
     * Divide {{#crossLink "Calculate/_memoryValue:property"}}_memoryValue{{/crossLink}}
     * by `x`.
     * @method         div
     * @param          {Number}        x
     * @return         {Calculator}    Current instance with updated state
     * @chainable
     * @since          0.2.7
     * @throws         {Error} If argument is equal to zero
     */
    this.div = function(x){
    	if (x === 0){
    		throw new Error('Division by zero!');
    	}
    	_memoryValue /= x;
    	return this;
    };

    /**
     * String representation of the calculator state.
     * @method         toString
     * @return         {String}
     * @since          0.2.7
     */
    this.toString = function(){
    	var value = this.getValue(),
    		unit = this.getUnit();
    	var result = (typeof value === 'number') ? value.toString() : '';
    	result += (typeof unit === 'string') ? unit : '';
    	return result;
    };


}
