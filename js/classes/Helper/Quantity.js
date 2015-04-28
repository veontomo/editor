/*jslint plusplus: true, white: true */
/*global  */

/**
 * Represents a quantity divided in "value" and "measure".
 * @module       Helper
 * @class        Quantity
 * @param        {String|Number|null}        value
 * @param        {String|null}               measure
 * @since        0.2.8
 */

function Quantity(value, measure) {
    "use strict";

    if (!(this instanceof Quantity)) {
        return new Quantity(value, measure);
    }

    /**
     * Absolute value.
     * @property       {Number}             _value
     * @private
     * @since          0.2.8
     */
    var _value;

    /**
     * Measurement unit.
     * @property       {String}        _measure
     * @private
     * @since          0.2.8
     */
    var _measure;


    /**
     * Returns an object with keys "value" and "measure" that represents the input argument.
     * @method         parse
     * @param          {String|Number}    x
     * @return         {Object|Null}
     * @since          0.2.7
     */
    this.parse = function(x) {
        var xType = typeof x;
        if (xType !== 'string' && xType !== 'number') {
            return;
        }
        var result = {
            'value': null,
            'measure': null
        };
        if (typeof x === 'number') {
            result.value = x;
            return result;
        }
        var xTrimmed = x.trim();
        var xValue = parseFloat(xTrimmed, 10);
        if (isNaN(xValue)) {
            return;
        }
        result.value = xValue;
        var xMeasure = xTrimmed.replace(xValue.toString(), '').trim();
        if (xMeasure.length > 0) {
            result.measure = xMeasure;
        }
        return result;
    };

    /**
     * {{#crossLink "Quantity/_value:property"}}_value{{/crossLink}} getter.
     * @method         getValue
     * @return         {Number}
     * @since          0.0.5
     */
    this.getValue = function() {
        return _value;
    };

    /**
     * {{#crossLink "Quantity/_value:property"}}_value{{/crossLink}} setter.
     * @method         setValue
     * @param          {Number}             val
     * @return         {void}
     * @since          0.0.5
     */
    this.setValue = function(val) {
        _value = null;
        if (typeof val === 'number') {
            _value = val;
        }

    };

    /**
     * {{#crossLink "Quantity/_measure:property"}}_measure{{/crossLink}} getter.
     * @method         getMeasure
     * @return         {String}
     * @since          0.0.5
     */
    this.getMeasure = function() {
        return _measure;
    };


    /**
     * {{#crossLink "Quantity/_measure:property"}}_measure{{/crossLink}} setter.
     * @method         setMeasure
     * @param          {String}             m
     * @return         {void}
     * @since          0.0.5
     */
    this.setMeasure = function(m) {
        _measure = null;
        if (typeof m === 'string') {
            var trimmed = m.trim();
            if (trimmed.length > 0){
                _measure = trimmed;
            }
        }
    };



    /**
     * Initializes properties {{#crossLink "Quantity/_value:property"}}_value{{/crossLink}} and
     * {{#crossLink "Quantity/_measure:property"}}_measure{{/crossLink}}. The order is as follows:
     * <ol><li>
     * If `value` is an instance of {{#crossLink "Quantity"}}Quantity{{/crossLink}}, then its value and measure
     * are used to initialize corresponding properties of the current instance.
     * </li><li>
     * In case `measure` is provided and it is not an empty string, its value is assigned to
     * {{#crossLink "Quantity/_measure:property"}}_measure{{/crossLink}}.
     * </li><li>
     * If `value` is a number, then {{#crossLink "Quantity/_value:property"}}_value{{/crossLink}} is set to that value.
     * </li><li>
     * If `value` is a string, it is parsed into a float number which is then assigned to
     * {{#crossLink "Quantity/_value:property"}}_value{{/crossLink}}. Then it is tried to pick up eventual information
     * about dimension from that string and if the dimensiomnturns out to be non-empty string and
     * {{#crossLink "Quantity/_measure:property"}}_measure{{/crossLink}} turns out to be not initialized,
     * the found dimension is assigned to {{#crossLink "Quantity/_measure:property"}}_measure{{/crossLink}}.
     * </li></oi>
     *
     * @method    constructor
     * @param     {Any}                  value
     * @param     {String|Null}          measure
     */
    (function(v, m, context) {
        var parsed = context.parse(v);
        console.log(parsed);
        if (!parsed) {
            return;
        }

        var val = parsed.value,
            mes = parsed.measure;
        if (val === undefined) {
            return;
        }
        if (m !== undefined && typeof m !== 'string') {
            return;
        }
        context.setValue(val);
        if (m !== undefined) {
            console.log('defined', m);
            context.setMeasure(m);
        } else {
            console.log('m is undefined', mes);
            context.setMeasure(mes);
        }
    }
    (value, measure, this));




}
