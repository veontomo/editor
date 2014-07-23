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
     * @property       {Number}             _value
     * @private
     * @since          0.0.5
     */
    var _value;

    /**
     * Measurement unit of the Unit instance.
     * @property       {String}        _measure
     * @private
     * @since          0.0.5
     */
    var _measure;


    if (value instanceof Unit) {
        return value;
    }
    if ((typeof measure !== 'string') && (measure !== undefined)) {
        throw new Error('The unit of measurement must be a string!');
    }
    measure = (measure || '').trim();
    switch (typeof value) {
    case 'number':
        _value = value;
        _measure = measure;
        break;
    case 'string':
        parsedValue = value === '' ? 0 : parseFloat(value);
        if (isNaN(parsedValue)) {
            throw new Error("Can not convert into a Unit object!");
        }
        parsedMeasure = value.replace(parsedValue.toString(), '').trim();
        _value = parsedValue;
        _measure = measure || parsedMeasure;
        break;
    default:
        _value = 0;
        _measure = '';
    }

    /**
     * {{#crossLink "Unit/_value:property"}}_value{{/crossLink}} getter.
     * @method         getValue
     * @return         {Number}
     * @since          0.0.5
     */
    this.getValue = function(){
        return _value;
    };

    /**
     * {{#crossLink "Unit/_value:property"}}_value{{/crossLink}} setter.
     * @method         setValue
     * @param          {Number}             val
     * @return         {void}
     * @since          0.0.5
     */
    this.setValue = function(val){
        if (typeof val !== 'number'){
            throw new Error('Value attribute of Unit instance must be a number!');
        }
        _value = val;

    };

    /**
     * {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}} getter.
     * @method         getMeasure
     * @return         {String}
     * @since          0.0.5
     */
    this.getMeasure = function(){
        return _measure;
    };


    /**
     * {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}} setter.
     * @method         setMeasure
     * @param          {String}             m
     * @return         {void}
     * @since          0.0.5
     */
    this.setMeasure = function(m){
        if (typeof m !== 'string'){
            throw new Error('Measure attribute of Unit instance must be a string!');
        }
        _measure = m;
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
        return this.getMeasure() === obj.getMeasure();
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
        return new Unit(this.getValue() + unit.getValue(), this.getMeasure());

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
            negative = new Unit(-unit.getValue(), unit.getMeasure());
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
            res.setValue(this.getValue() / u);
            res.setMeasure(this.getMeasure());
            return res;
        }
        if (u instanceof Unit){
            var uVal = u.getValue();
            if (uVal === 0){
                throw new Error('Can not divide by zero!');
            }
            res.setValue(this.getValue() / uVal);
            if (!u.hasMeasure()){
                res.setMeasure(this.getMeasure());
            } else if (this.isLikeAs(u)){
               res.setMeasure('');
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
     * Returns an instance of {{#crossLink "Unit"}}Unit{{/crossLink}} that represents
     * the target in percentage form if it is a dimensionless number.
     * If instead it has a dimension, an error is thrown.
     * @method         toPercent
     * @return         {Unit}
     * @since          0.0.5
     */
    this.toPercent = function(){
        if (this.hasMeasure()){
            throw new Error('Only dimensionless numbers can be representred as percents!');
        }
        return new Unit(this.getValue() * 100, '%');
    };

    /**
     * Returns an instance of {{#crossLink "Unit"}}Unit{{/crossLink}} that represents
     * the target in percentage form if it is a dimensionless number.
     * If instead it has a dimension, an error is thrown.
     * @method         fromPercent
     * @return         {Unit}
     * @since          0.0.5
     */
    this.fromPercent = function(){
        if (this.getMeasure() !== '%'){
            throw new Error('The target must be in percentage form!');
        }
        return new Unit(this.getValue()/100);
    };
}
