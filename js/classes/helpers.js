/*jslint plusplus: true, white: true */
/*global CKEDITOR, DOMParser */

/**
 * Set of useful functions
 * @module Helper
 * @class  Helper
 * @type {Object}
 */
var Helper = {
    /**
     * Converts the first letter of the string into the upper case
     * If the string is empty, the output is empty string as well.
     * @method  firstLetterUpperCase
     * @param   {String}  str
     * @return  {String}
     */
    'firstLetterUpperCase': function(str){
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    },

    /**
     * Converts the first letter of the string into the upper case
     * If the string is empty, the output is empty string as well.
     * @method  onlyFirstLetterUpperCase
     * @param   {String}     str
     * @return     {String}
     */

    'onlyFirstLetterUpperCase': function(str){
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    },

    /**
     * transforms each element of the input array into a non-negative number.
     * If an element is negative, its absolute value is used.
     * If an element fails to be converted to a number, it is substituted by zero.
     * @method    sanitize
     * @example   [1.1, 2.4, 2] -> [1.1, 2.4, 2],
     *            ["4", -3, 3.2, "a"] -> [4, 3, 3.2, 0]
     * @param   {Array}     arr           array of numbers
     * @return {Array}               array of numbers
     */
    'sanitize': function(arr){
        var i, tmp, sanitized = [],
            len = arr.length;
        for (i = 0; i < len; i++) {
            tmp = parseFloat(arr[i]);
            sanitized[i] = isNaN(tmp) ? 0 : Math.abs(tmp);
        }
        return sanitized;
    },

    /**
     * calculates the sum the array elements. The elements are supposed to be numbers. Otherwise nothing is guaranteed.
     * @method      trace
     * @example     [1, 2, 2] -> 1 + 2 + 2 = 5
     * @param       {Array}    arr    array of numbers
     * @return      {Number}
     */
    'trace': function(arr){
        var accum = 0,
            len = arr.length,
            i;
        for (i = 0; i < len; i++) {
            accum = accum + arr[i];
        }
        return accum;
    },

    /**
     * normalizes the array. If all elements are equal to zero, then the elements are to be normallized uniformally.
     * If not all the elements are equal to zero, but the trace is equal to zero, then the input array is returned.
     * @method      normalize
     * @example     [1, 3, 4]       -> [ 0.125, 0.375, 0.5 ]
     * @example     [2, 0, -1, -1]  -> [ 2, 0, -1, -1 ]
     * @example     [0, 0]          -> [ 0.5, 0.5]
     * @param   {array}     Array      of numbers
     * @return     {Array}   array of numbers
     */
    'normalize': function(arr){
        var total = this.trace(arr),
            len = arr.length,
            result = [],
            i,
            areAllZeroes = arr.every(function (elem) {
                return elem === 0;
            });
        if (areAllZeroes) {
            arr = arr.map(function () {
                return 1;
            });
            total = len;
        }
        if (total === 0) {
            result = arr;
        } else {
            for (i = 0; i < len; i++) {
                result[i] = arr[i] / total;
            }
        }
        return result;
    },

    /**
     * Slices the first argument according to the weights given by the second argument.
     * The elements of the second array are supposed to be non-negative numbers.
     * @method splitWeighted
     * @example   (10, [1, 2, 2])    -> [2, 4, 4],
     *            (30, [4, 2, 3, 1]) -> [12, 6, 9, 3]
     * @param   {Number}     overall       a number to be splitted
     * @param   {Array}     pieces        array of weigths
     * @return     {Array}       array of numbers
     */

    'splitWeighted': function(overall, pieces){
        var norm = this.normalize(this.sanitize(pieces)),
            result = [],
            len = norm.length,
            i;
        for (i = 0; i < len; i++) {
            result[i] = overall * norm[i];
        }
        return result;
    },

    /**
     * rounds each elements of the array
     * @method roundUp
     * @example [1, 2.2, 5.6, 0, 4.5] -> [1, 2, 6, 0, 5]
     * @param   {Array}     arr            array of numbers
     * @return     {Array}       array of integers
     */

    'roundUp': function(arr){
        return arr.map(function (elem) {
            return Math.round(elem);
        });
    },

    /**
     * composition of roundUp and splitWeighted
     * @method   columnWidths
     * @param    {Number}    overall            table width
     * @param    {Array}     pieces             array of nambers
     * @return   {Array}     array of integers
     */

    'columnWidths': function(overall, pieces){
        return this.roundUp(this.splitWeighted(overall, pieces));
    },

    /**
     * Deletes the protocol name from the url.
     * Everything until the first occurence of '://' will be removed (inclusively).
     * @method   dropProtocol
     * @param    {String}     url
     * @example  'http://www.test.com'      -> 'www.test.com'
     * @example  'www.test.com'             -> 'www.test.com'
     * @return   {String}               url without protocol name
     */
    'dropProtocol': function(str){
        var delimiter = '://',
            pattern = '^[^' + delimiter + ']+' + delimiter,
            re = new RegExp(pattern, 'gi');
        return str.replace(re, '');
    },

    /**
     * Gives file extension.
     * @method fileExt
     * @param  {String}     fileName
     * @return {String}
     */
    'fileExt': function(str){
        var delimiter = '.';
        return str.indexOf(delimiter) !== -1 ? str.split(delimiter).pop() : '';
    },

    /**
     * Gives the validated width. If the width is given in "px" or "pt", the integer part is given.
     * If the length is given in "em" or "%", it is left as it is.
     * @method validateWidth
     * @param   {String}     str
     * @return     {String}
     */
    'validateWidth': function(str){
        "use strict";
        var unit, output = false,
            units = {
                'integer': ['px', 'pt'],
                'others': ['em', '%']
            },
            number = parseFloat(str);
        if (isNaN(number)) {
            return false;
        }
        unit = str.replace(number.toString(), '').trim();
        if (units.integer.indexOf(unit) !== -1) {
            output = Math.floor(number).toString() + unit;
        }
        if (units.others.indexOf(unit) !== -1) {
            output = number.toString() + unit;
        }
        return output;
    },

    /**
     * Replaces special characters present in the input string by their unicodes. It is supposed to replace symbols like à, ò, è, é
     * and not a, b, c etc. For the moment it replaces any characters which unicode is outside the range [32, 125].
     * @method specialChar
     * @param  {string}     str
     * @return {string}
     */
    'specialChar': function(str){
        var typeStr = typeof str,
            len, i, code, output = '';
        if (typeStr === 'function' || typeStr === 'object'){
            return null;
        }
        if (typeStr === 'number'){
            return str;
        }
        len = str.length;
        for (i = 0; i < len; i++){
            code = str.charCodeAt(i);
            if(code > 31 && code < 126){
                output += str[i];
            } else {
                output += '&#' + code + ';';
            }
        }
        return output;
    },

    /**
     * Splits array element at position "pos" in two parts in such a way that the trace of the original array
     * is equal to the trace of the output array. If it is the first element of the array to be splitted, then
     * it is splitted in 1/2 and 1/2 (up to the truncation). If the element has a left neighbour, then the neighbour
     * and the element are taken off 1/3 and these two parts are given to the newly created element that is inserted
     * between the neighbour and the element: [a, b, ...] -> [2/3 a, 1/3 (a + b), 2/3 b, ...]
     * @method crack
     * @param  {Array}  arr     array of integers
     * @param  {Number} pos     index of the element, before which an element will be inserted
     * @return {Array}          array of integers
     */
    'crack': function(arr, pos){
        var orig, orig1, orig2, neighbour, neighbour1, neighbourDonor,
            output = [],
            len = arr.length,
            i;
        for(i = 0; i < len; i++){
            output[i] = arr[i];
        }
        if (pos === 0){
            orig = output[0];
            orig1 = parseInt(orig/2, 10);
            orig2 = orig - orig1;
            neighbourDonor = 0;

        }
        if(pos > 0 && pos < arr.length){
            orig = output[pos];
            orig1 = parseInt(2*orig/3, 10);
            orig2 = orig - orig1;
            neighbour = arr[pos-1];
            neighbour1 = parseInt(2 * neighbour/3, 10);
            neighbourDonor = neighbour - neighbour1;
            output[pos-1] = neighbour1;
        }
        output[pos] = orig1;
        output.splice(pos, 0, orig2 + neighbourDonor);
        return output;
    },

    /**
     * Flatten the object. This function was written because Node::attributes returns attributes in format.
      * @method  flatten
     * @param   {Object}        obj
     * @return  {Object}
     * @example {'1': {name: "width", value:"100", ...}, '2': {name: "color", value:"black", ...}, ...} -> {"width":"100", "color":"black", ...}
    */
    'flatten': function(obj){
        var attr, value, output = {};
        for (attr in obj){
            if (obj.hasOwnProperty(attr)){
                value = obj[attr];
                if (typeof value === 'object'){
                    output[value.name] = value.value;
                }
            }
        }
        return output;
    },

    /**
     * Sandwiches the midlle string with the left and the right ones. If the middle one is empty, empty string is returned.
     * If the right arguments is not given, the left one is used.
     * @method sandwichWith
     * @param  {String} left
     * @param  {String} middle
     * @param  {String} right
     * @type   String|Null
     * @return {String|Null}
     */
    'sandwichWith': function(left, middle, right){
        var m, r;
        if ((typeof middle === "string") || (typeof left === "string")){
            r = right || left;
            m = middle.trim();
            return m ? left + m + r : '';
        }
    },

    /**
     * Glues all elements of the array, replace trailing spaces and repaces multiple spaces with a single one.
     * @method concatDropSpaces
     * @param {Array} arr
     * @param {String} glue glue string
     * @return {String}
     */
    'concatDropSpaces': function(arr, glue){
        if (glue === undefined){
            glue = ' ';
        }
        return arr.join(glue).replace(/\s+/g, ' ').trim();
    },

    /**
     * Generates a string that can be used as id for the elements of the string `str`. This means that
     * the generated string must be not present among id's of the elements of the string `str`, while it might
     * be present as a content of the elements. The second argument `seed` serves as a hint to create the id:
     * if the hint string is available as id, it will be returned. Otherwise, a random symbol from 0-9, a-z
     * will be appended to the hint string until it becomes a valid id.
     * @method generateId
     * @method str
     * @param  {String|Null} seed
     * @return {String}
     */
    'generateId': function(str, seed){
        var parser = new DOMParser(),
            doc = parser.parseFromString(str, 'text/html'),
            id,
            pool = '0123456789abcdefghijklmnopqrstuvwxyz',
            poolLen = pool.length;
            id = seed || pool.substr(Math.floor(Math.random()*(poolLen+1)), 1) + pool.substr(Math.floor(Math.random()*(poolLen + 1)), 1);
        // generate a unique id for the overall document
        while(doc.getElementById(id)){
            id += pool.substr(Math.floor(Math.random()*(poolLen + 1)), 1);
        }
        return id;
    }

};

Array.prototype.concatDropSpaces = function(glue){
    return Helper.concatDropSpaces(this, glue);
};
