/*jslint plusplus: true, white: true */
/*global CKEDITOR, LinkStyle, dropProtocol */

function target_exists(fileName) {
    $.ajax({
        url: fileName,
        type: 'GET',
        async: false,
        timeout: 1000,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.debug("An error has occurred making the request: " + errorThrown);
        },
        success: function () {
            console.debug("file " + fileName + " is found");
        }
    }).complete(function () {
        console.debug("ajax finished");
        return true;
    });
}

/**
 * Converts the first letter of the string into the upper case
 * If the string is empty, the output is empty string as well.
 * @param   str     String
 * @return          String
 */
var firstLetterUpperCase = function (str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
};

/**
 * Converts the first letter of the string into the upper case
 * If the string is empty, the output is empty string as well.
 * @param   str     String
 * @return          String
 */
var onlyFirstLetterUpperCase = function (str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    };



/**
 * transforms each element of the input array into a non-negative number.
 * If an element is negative, its absolute value is used.
 * If an element fails to be converted to a number, it is substituted by zero.
 * @module    helpers
 * @example   [1.1, 2.4, 2] -> [1.1, 2.4, 2],
 *            ["4", -3, 3.2, "a"] -> [4, 3, 3.2, 0]
 * @param    arr      Array      array of numbers
 * @return            Array      array of numbers
 */
var sanitize = function (arr) {
        var i, tmp, sanitized = [],
            len = arr.length;
        for (i = 0; i < len; i++) {
            tmp = parseFloat(arr[i]);
            sanitized[i] = isNaN(tmp) ? 0 : Math.abs(tmp);
        }
        return sanitized;
    };

/**
 * calculates the sum the array elements. The elements are supposed to be numbers. Otherwise nothing is guaranteed.
 * @module     helpers
 * @example     [1, 2, 2] -> 1 + 2 + 2 = 5
 * @param    arr    array of numbers
 * @return   number
 */
var trace = function (arr) {
        var accum = 0,
            len = arr.length,
            i;
        for (i = 0; i < len; i++) {
            accum = accum + arr[i];
        }
        return accum;
    };

/**
 * normalizes the array. If all elements are equal to zero, then the elements are to be normallized uniformally.
 * If not all the elements are equal to zero, but the trace is equal to zero, then the input array is returned.
 * @module     helpers
 * @example     [1, 3, 4]       -> [ 0.125, 0.375, 0.5 ]
 *              [2, 0, -1, -1]  -> [ 2, 0, -1, -1 ]
 *              [0, 0]          -> [ 0.5, 0.5]
 * @param    Array   array of numbers
 * @return   Array   array of numbers
 */
var normalize = function (arr) {
        var total = trace(arr),
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
    };


/**
 * Slices the first argument according to the weights given by the second argument.
 * The elements of the second array are supposed to be non-negative numbers.
 * @module     helpers
 * @example   (10, [1, 2, 2])    -> [2, 4, 4],
 *            (30, [4, 2, 3, 1]) -> [12, 6, 9, 3]
 * @param    overall     Number  a number to be splitted
 * @param    pieces      Array   array of weigths
 * @return   Array       array of numbers
 */
var splitWeighted = function (overall, pieces) {
        var norm = normalize(sanitize(pieces)),
            result = [],
            len = norm.length,
            i;
        for (i = 0; i < len; i++) {
            result[i] = overall * norm[i];
        }
        return result;
    };


/**
 * rounds each elements of the array
 * @module     helpers
 * @example [1, 2.2, 5.6, 0, 4.5] -> [1, 2, 6, 0, 5]
 * @param    arr    Array       array of numbers
 * @return          Array       array of integers
 */
var roundUp = function (arr) {
        return arr.map(function (elem) {
            return Math.round(elem);
        });
    };

/**
 * composition of roundUp and splitWeighted
 * @module     helpers
 * @param    overall     Number   table width
 * @param    pieces      Array    array of nambers
 * @return               Array    array of integers
 */
var columnWidths = function (overall, pieces) {
        return roundUp(splitWeighted(overall, pieces));
    };


/**
 * Deletes the protocol name from the url.
 * Everything until the first occurence of '://' will be removed (inclusively).
 * @module     helpers
 * @example  'http://www.test.com'      -> 'www.test.com'
 *           'www.test.com'             -> 'www.test.com'
 * @param    url     String
 * @return   String  url without protocol name
 */
var dropProtocol = function (str) {
        var delimiter = '://',
            pattern = '^[^' + delimiter + ']+' + delimiter,
            re = new RegExp(pattern, 'gi');
        return str.replace(re, '');
    };


/**
 * Gives file extension
 * @module   helpers
 * @param    fileName   String      name of file
 * @return   String     file extension
 */
var fileExt = function (str) {
        var delimiter = '.';
        return str.indexOf(delimiter) !== -1 ? str.split(delimiter).pop() : '';
    };

/**
 * Gives the validated width. If the width is given in "px" or "pt", the integer part is given.
 * If the length is given in "em" or "%", it is left as it is.
 * @module   helpers
 * @param    str    String
 * @return   String
 */
var validateWidth = function (str) {
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
    };


/**
 * Replaces special characters present in the input string by their unicodes. It is supposed to replace symbols like à, ò, è, é
 * and not a, b, c etc. For the moment it replaces any characters which unicode is outside the range [32, 125].
 * @param  {string}     str
 * @return {string}
 */
function specialChar(str){
    if (typeof str !== 'string'){
        return null;
    }
    var len, i, code, output = '';
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
}

/**
 * Splits array element at position "pos" in two parts in such a way that the trace of the original array
 * is equal to the trace of the output array. If it is the first element of the array to be splitted, then
 * it is splitted in 1/2 and 1/2 (up to the truncation). If the element has a left neighbour, then the neighbour
 * and the element are taken off 1/3 and these two parts are given to the newly created element that is inserted
 * between the neighbour and the element: [a, b, ...] -> [2/3 a, 1/3 (a + b), 2/3 b, ...]
 * @param  {Array}  arr     array of integers
 * @param  {Number} pos     index of the element, before which an element will be inserted
 * @return {Array}          array of integers
 */
function crack(arr, pos){
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
}



/**
 * Produces a string of properties in inline-style fashion
 * This function is supposed to be added to prototypes of different objects.
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @module  helpers
 * @param   {Object}        obj     an object which string reperesentation should be generated.
 * @param   {String|null}   unit    a mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
 * @return  {String}        a concatenation of substrings; each substring is of this format: "attribute: value;".
 * @example The return value is of the form: "padding: 0px;margin: 10px;color: #ababab;"
 */
var toString = function (obj, unit) {
        "use strict";
        var val, attr, styles = "";
        unit = unit || 'px';
        for (attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                // avoid adding method to the output
                val = obj[attr];
                switch (typeof val) {
                case 'string':
                    styles += attr + ': ' + val + ';';
                    break;
                case 'number':
                    styles += attr + ': ' + String(val) + unit + ';';
                    break;
                }
            }
        }
        return styles;
    };

/**
 * Produces a string of attributes and values
 * It takse into consideration only properties, methods are ignored.
 * If attribite value is a number, the measurement unit will be appended.
 * @module  helpers
 * @param   {Object}    obj
 * @return  {String}    String      a union of substrings; each substring is of this format: 'attribute="value"', between the substrings there is a separator ' '.
 */
var toString2 = function (obj) {
        "use strict";
        var val, valType, attr, output = [];
        for (attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                val = obj[attr];
                valType = typeof val;
                // avoid adding method to the output
                if (valType === 'string' || valType === 'number'){
                    output.push(attr + '="' + String(val) + '"');
                }
            }
        }
        return output.join(' ');
    };

/**
 * Flatten the object. This function was written because Node::attributes returns attributes in format.
 * Example {'1': {name: "width", value:"100", ...}, '2': {name: "color", value:"black", ...}, ...}
 * returns {"width":"100", "color":"black", ...}
 * @param {Object} obj
  */
 var flatten = function (obj){
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
 };

/**
 * Sandwiches the midlle string with the left and the right ones. If the middle one is empty, empty string is returned.
 * If the right arguments is not given, the left one is used.
 * @param  {String} left
 * @param  {String} middle
 * @param  {String} right
 * @type   String|Null
 * @return {String|Null}
 */
var sandwichWith = function (left, middle, right){
    var m, r;
    if ((typeof middle === "string") || (typeof left === "string")){
        r = right || left;
        m = middle.trim();
        return m ? left + m + r : '';
    }
};
String.prototype.sandwichWith = function (left, right){
    return sandwichWith(left, this, right);
};

/**
 * Glues all elements of the array, replace trailing spaces and repaces multiple spaces with a single one.
 * @param {Array} arr
 * @param {String} glue glue string
 * @return {String}
 */
var concatDropSpaces = function (arr, glue){
    if (glue === undefined){
        glue = ' ';
    }
    return arr.join(glue).replace(/\s+/g, ' ').trim();
};
Array.prototype.concatDropSpaces = function(glue){
    return concatDropSpaces(this, glue);
};


/**
 * Merge two objects. If non-object is given, an error is thrown.
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Object}
 */
var appendObject = function (obj1, obj2){
    if ((typeof obj1 !== 'object') || (typeof obj2 !== 'object')){
        throw new Error('Both arguments of appendObject must be of Object type!');
    }
    var output = obj1,
        attr;
    for (attr in obj2){
        if (obj2.hasOwnProperty(attr)){
            output[attr] = obj2[attr];
        }
    }
    return output;

};

/**
 * Sets width, min-width and max-width of the object.
 * @module  helpers
 * @param   {Object}    obj         object which width is to be set.
 * @param   {mixed}     w           width value
 * @return  {void}
 */
var setMinMaxWidth = function (obj, w) {
    "use strict";
    if(typeof obj !== 'object'){
        throw new Error('Can not set a property of a non-object!');
    }
    if(w === undefined){
        throw new Error("Width value is not set!");
    }
    obj.width = w;
    obj['max-width'] =  w;
    obj['min-width'] =  w;
};

/**
* Gets property value from the object.
* @module   helpers
* @param    {Object}    obj     an object
* @param    {String}    prop    property name to retrieve
* @return   {mixed}     property value of the object
*/
function getProperty(obj, prop){
    "use strict";
    if(typeof obj !== 'object'){
        throw new Error('Not an object!');
    }
    if(prop === undefined){
        throw new Error("Property name missing!");
    }
    if(obj.hasOwnProperty(prop)){
        return obj[prop];
    }
}
