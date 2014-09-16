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

    /**
     * Initializes properties {{#crossLink "Unit/_value:property"}}_value{{/crossLink}} and
     * {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}}. The order is as follows:
     * <ol><li>
     * If `value` is an instance of {{#crossLink "Unit"}}Unit{{/crossLink}}, then its value and measure
     * are used to initialize corresponding properties of the current instance.
     * </li><li>
     * In case `measure` is provided and it is not an empty string, its value is assigned to
     * {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}}.
     * </li><li>
     * If `value` is a number, then {{#crossLink "Unit/_value:property"}}_value{{/crossLink}} is set to that value.
     * </li><li>
     * If `value` is a string, it is parsed into a float number which is then assigned to
     * {{#crossLink "Unit/_value:property"}}_value{{/crossLink}}. Then it is tried to pick up eventual information
     * about dimension from that string and if the dimensiomnturns out to be non-empty string and
     * {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}} turns out to be not initialized,
     * the found dimension is assigned to {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}}.
     * </li></oi>
     *
     * @method    constructor
     * @param     {Any}                  value
     * @param     {String|Null}          measure
     */
    (function(v, m){
        if (v instanceof Unit) {
            _measure = v.getMeasure();
            _value = v.getValue();
            return;
        }
        if (!v){
            _value = 0;
        }
        if ((typeof m !== 'string') && (m !== undefined)) {
            throw new Error('The unit of measurement must be a string!');
        }
        if (m && m.trim() !== ''){
            _measure = m.trim();
        }
        switch (typeof v) {
        case 'number':
            _value = v;
            break;
        case 'string':
            parsedValue = v === '' ? 0 : parseFloat(v);
            if (isNaN(parsedValue)) {
                console.log('input: v = ' + v + ', m = ' + m);
                throw new Error("Can not convert into a Unit object!");
            }
            parsedMeasure = v.replace(parsedValue.toString(), '').trim();
            _value = parsedValue;
            if(_measure === undefined && parsedMeasure !== ''){
                _measure = parsedMeasure;
            }
            break;
        default:
            // _value = 0;
            // _measure = '';
        }
    }(value, measure));

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
        if (typeof m !== 'string' || m.trim() === ''){
            throw new Error('Measure attribute of Unit instance must be a non-empty string!');
        }
        _measure = m;
    };

    /**
     * Returns a new Unit instance whose {{#crossLink "Unit/_value:property"}}_value{{/crossLink}} and
     * {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}} are equal to the target ones.
     * @since          0.0.6
     * @method         clone
     * @return         {Unit}          target clone
     */
    this.clone = function(){
        return new Unit(this.getValue(), this.getMeasure());
    };

    /**
     * Compares the target with the argument. Returns `true`, if the argument can be converted into Unit instance
     * with {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}} attribute being equal to the target's one.
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
     * Returns `true` if the instance is equal to zero, otherwise returns `false`.
     *
     * An instance is said to be equal to zero if its {{#crossLink "Unit/_value:property"}}_value{{/crossLink}}
     * is equal to zero.
     * @method         isZero
     * @return         {Boolean}
     * @since          0.0.6
     */
    this.isZero = function(){
        return this.getValue() === 0;
    };

    /**
     * Sums up the target and `unit`.
     *
     * If they have different units of measurement, an error is thrown unless at least of the operands
     * is different from zero.
     *
     * Examples:<ol>
     * <li>1cm + 2cm  =  3cm </li>
     * <li>1cm + 2px  =  error </li>
     * <li>4 + 7  =  11 </li>
     * <li>0px + 2cm  =  2cm </li>
     * <li>1px + 0cm  =  1px </li>
     * <li>0 + 2cm  =  2cm </li>
     * <li>1px + 0  =  1px </li>
     * <li>0px + 0cm  =  0</li>
     * <li>0 + 0cm  =  0</li>
     * <li>0px + 0  =  0</li>
     * <li>0 + 0  =  0</li>
     * </ol>
     * @method  add
     * @param   {Unit}   unit
     * @return  {Unit}   the sum of the target and the argument.
     */
    this.add = function (unit) {
        if (!(unit instanceof Unit)){
            return this.add(new Unit(unit));
        }
        if (this.isLikeAs(unit)) {
            return new Unit(this.getValue() + unit.getValue(), this.getMeasure());
        }
        if (this.isZero()){
            if (unit.isZero()){
                return new Unit(0);
            }
            return new Unit(unit.getValue(), unit.getMeasure());
        }
        if (unit.isZero()){
            return new Unit(this.getValue(), this.getMeasure());
        }
        throw new Error("These Unit instances can not be summed up!");
    };


    /**
     * Subtracts the argument from the target. The argument is converted to a Unit object,
     * then its sign is changed and the method {{#crossLink "Unit/add:method"}}add(){{/crossLink}} is called.
     * @method   sub
     * @param   {Any}    obj         it will be first converted to a Unit instance.
     * @return  {Unit}   the difference between target and the argument.
     */
    this.sub = function (obj) {
        var unit = (obj instanceof Unit) ? obj : new Unit(obj),
            negative = new Unit(-unit.getValue(), unit.getMeasure());
        return this.add(negative);
    };

    /**
     * Multiplies target by `n`.
     *
     * Returns new instance of {{#crossLink "Unit"}}Unit{{/crossLink}}.
     * @method         times
     * @param          {Number}        n
     * @return         {Unit}
     */
    this.times = function(n){
        if (n === undefined){
            throw new Error('Argument is missing!');
        }
        if (typeof n !== 'number'){
            throw new Error('Argument must be a number!');
        }
        return new Unit(n*this.getValue(), this.getMeasure());
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
     * Returns the result of division of `n` by `m` with `p` digits after point.
     * @method         _fracWithPresicion
     * @param          {Number}              n
     * @param          {Number}              m        Non-zero number
     * @param          {Integer}             p        Non-negative integer number
     * @return         {Number}
     * @since          0.0.5
     * @private
     */
    var _fracWithPresicion = function(n, m, p){
        if (typeof n !== 'number' || typeof m !== 'number' || m === 0){
            throw new Error('Numerator must be a number, denumerator must be a non-zero number.');
        }
        var frac = n / m;
        if (p === undefined){
            return frac;
        }
        if (!Number.isInteger(p) || p < 0){
            throw new Error('Precision must be non-negative integer.');
        }
        var base = Math.pow(10, p),
            res = parseInt(frac*base, 10)/base;
        return res;
    };




    /**
     * Returns the result of division of the target by the argument.
     *
     * The following cases are distinguished (in order of processing):
     * <ol><li>
     * If the argument is a non-zero number, then {{#crossLink "Unit/_value:property"}}_value{{/crossLink}}
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
     * @param          {Integer}            p            Precision (optional). Number of digits after the decimal point
     * @return         {Unit}
     */
    this.frac = function(u, p){
        if (u === undefined){
            throw new Error('Can not divide by nothing!');
        }
        var uUnit;
        try {
            uUnit = (u instanceof Unit) ? u : new Unit(u);
        } catch(e){
            throw new Error("Encountered error when converting argument into Unit instance: " + e);
        }
        var res = new Unit();
        var uVal = uUnit.getValue();
        if (uVal === 0){
            throw new Error('Can not divide by zero!');
        }
        if (!uUnit.hasMeasure() && this.hasMeasure()){
            res.setMeasure(this.getMeasure());
        } else if (this.getMeasure() !== uUnit.getMeasure()){
             throw new Error('Can not divide these objects!');
        }
        res.setValue(_fracWithPresicion(this.getValue(), uVal, p));
        return res;
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
     *
     * Some additional code is added in order to suppres possible artificial digits
     * pertinent to javascript. For example, in javascript 0.164 * 100 is equal to
     * something like 16.40000...02.
     * @method         toPercent
     * @return         {Unit}
     * @since          0.0.5
     */
    this.toPercent = function(){
        if (this.hasMeasure()){
            throw new Error('Only dimensionless numbers can be representred as percents!');
        }
        var newVal,
            currVal = this.getValue();
        if (Number.isInteger(currVal)) {
            newVal = currVal * 100;
        } else {
            var str = currVal.toString() + '00';
            var parts = str.split('.');
            newVal = parts[0] + parts[1].substr(0, 2) + '.' + parts[1].substr(2);
            newVal = parseFloat(newVal, 10);
        }
        return new Unit(newVal, '%');
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

    /**
     * If the instance has no {{#crossLink "Unit/_measure:property"}}_measure{{/crossLink}}, then
     * calls method {{#crossLink "Unit/setMeasure:method"}}setMeasure{{/crossLink}} to impose it
     * to value `m`.
     * @method         suggestMeasure
     * @param          {Any}            m
     * @return         {void}
     */
    this.suggestMeasure = function(m){
        if (!this.hasMeasure()){
            try {
                this.setMeasure(m);
            } catch(e){
                console.log("Suggested measure was not set. Reason: " + e.toString());
            }
        }
    };

    /**
     * Returns a new Unit instance with {{#crossLink "Unit/_value:property"}}_value{{/crossLink}}
     * being "floored".
     * @method         floor
     * @return         {Unit}
     * @since          0.0.6
     */
    this.floor = function(){
        return new Unit(Math.floor(this.getValue()), this.getMeasure());
    };
}
