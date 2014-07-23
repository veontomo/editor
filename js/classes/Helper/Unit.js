/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, getProperty, TableStyle, TableAttributes, Row, setMinMaxWidth, Tag */

/**
 * Represents a quantity divided in "value" and "measure".
 * @module       Helper
 * @class        Unit
 * @param        {Number}            value
 * @param        {String|null}       measure
 */

function Unit(value, measure) {
    "use strict";
    // console.log(value, measure);
    var parsedValue, parsedMeasure;
    if (!(this instanceof Unit)) {
        return new Unit(value, measure);
    }

    /**
     * Absolute value of the Unit instance.
     * @property       {Number}             value
     */
    this.value = undefined;

    /**
     * Measurement unit of the Unit instance.
     * @property       {String|null}        measure
     * @default        null
     */
    this.measure = null;


    if (value instanceof Unit) {
        return value;
    }
    if ((typeof measure !== 'string') && (measure !== undefined)) {
        throw new Error('The unit of measurement must be a string!');
    }
    measure = (measure || '').trim();
    switch (typeof value) {
    case 'number':
        this.value = value;
        this.measure = measure;
        break;
    case 'string':
        parsedValue = value === '' ? 0 : parseFloat(value);
        if (isNaN(parsedValue)) {
            throw new Error("Can not convert into a Unit object!");
        }
        parsedMeasure = value.replace(parsedValue.toString(), '').trim();
        this.value = parsedValue;
        this.measure = measure || parsedMeasure;
        break;
    default:
        this.value = 0;
        this.measure = '';
    }

    /**
     * {{#crossLink "Unit/value:property"}}value{{/crossLink}} getter.
     * @method         getValue
     * @return         {Number}
     * @since          0.0.5
     */
    this.getValue = function(){
        return this.value;
    };

    /**
     * {{#crossLink "Unit/value:property"}}measure{{/crossLink}} getter.
     * @method         getMeasure
     * @return         {String}
     * @since          0.0.5
     */
    this.getMeasure = function(){
        return this.measure;
    };

    /**
     * Compares the target with the argument. Returns `true`, if the argument can be coverted into Unit instance
     * with {{#crossLink "Unit/measure:property"}}measure{{/crossLink}} attribute being equal to the target's one.
     * Otherwise, returns `false`.
     * @method         isLikeAs
     * @param          {obj}                obj
     * @return         {Boolean}
     */
    this.isLikeAs = function (obj) {
        if (!(obj instanceof Unit)) {
            try {
                obj = new Unit(obj);
            } catch (err) {
                return false;
            }
        }
        return this.measure === obj.measure;
    };

    /**
     * Sums up the target and the argument. If they have different units of measurement, an error is thrown.
     * @method  add
     * @param   {Unit}   unit
     * @return  {Unit}   the sum of the target and the argument.
     */
    this.add = function (unit) {
        if (!this.isLikeAs(unit)) {
            throw new Error("These Unit instances can not be summed up!");
        }
        unit = new Unit(unit);
        return new Unit(this.value + unit.value, this.measure);

    };


    /**
     * Subtracts the argument from the target. The argument is converted to a Unit object,
     * then its sign is changed and the method Unit::add() is called.
     * @method   sub
     * @param   {Unit}   obj         it will be first converted to a Unit instance.
     * @return  {Unit}   the difference between target and the argument.
     */
    this.sub = function (obj) {
        var unit = new Unit(obj),
            negative = new Unit(-unit.value, unit.measure);
        return this.add(negative);
    };


    /**
     * Returns string representation of the instance: join absolute value and unit of measurement.
     * If parameter is provided, it is used as a separator between the abs.value and unit of
     * measurement.
     * @method         toString
     * @param          {String|null}        sep
     * @return         {String}
     * @since          0.0.5
     */
    this.toString = function(sep){
        var out = '',
            abs = this.getValue();
        if (typeof abs !== 'number'){
            return out;
        }
        out += abs.toString();
        var meas = this.getMeasure();
        if (typeof meas === 'string' && meas.length > 0){
            out += (sep || '') + meas;
        }
        return out;
    };

    /**
     * Returns the result of division of the target by the argument.
     *
     * The following cases are distinguished (in order of processing):
     * <ol><li>
     * If the argument is a non-zero number, then {{#crossLink "Unit/value:property"}}value{{/crossLink}}
     * of the target is divided by this number. If it is zero, an error is thrown.
     * </li><li>
     * If the argument is an instance of {{#crossLink "Unit"}}Unit{{/crossLink}}:
     * <ul><li>
     * if the denominator is dimensionless or has the same dimensionality as the numerator,
     * then division is performed normally
     * </li><li>
     * if the numerator and  denominator have different dimesions, then an error is thrown.
     * </li></ul>
     * </li></ol>
     * If the argument is not an instance of {{#crossLink "Unit"}}Unit{{/crossLink}} class, then
     * the method is called again with argument being converted into Unit instance.
     * @method         frac
     * @param          {Unit}               u
     * @return         {Unit}
     */
    this.frac = function(u){
        if (u === undefined){
            throw new Error('Can not divide by nothing!');
        }
        var res = new Unit();
        if (typeof u === 'number'){
            if (u === 0){
                throw new Error('Can not divide by zero!');
            }
            res.value = this.getValue() / u;
            res.measure = this.getMeasure();
            return res;
        }
        if (u instanceof Unit){
            var uVal = u.getValue();
            if (uVal === 0){
                throw new Error('Can not divide by zero!');
            }
            res.value = this.getValue() / uVal;
            if (!u.hasMeasure()){
                res.measure = this.getMeasure();
            } else if (this.isLikeAs(u)){
               res.measure = '';
            } else {
                throw new Error('Can not divide these objects!');
            }
            return res;
        }
        return this.frac(new Unit(u));
    };


    /**
     * Returns `true` if the target's unit of measurement is a non-empty string. Otherwise,
     * returns `false`.
     * @method         hasMeasure
     * @since          0.0.5
     * @return         {Boolean}
     */
    this.hasMeasure = function(){
        var meas = this.getMeasure();
        return (typeof meas === 'string') && (meas.length > 0);
    };

    /**
     * [toPercentage description]
     * @return {[type]} [description]
     */
    this.toPercentage = function(){

    };
}
