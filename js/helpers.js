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
            var output = true;
        }
    }).complete(function () {
        console.debug("ajax finished");
        return true;
    });
}


/**
 * transforms each element of the input array into a non-negative number. 
 * If an element is negative, its absolute value is used.
 * If an element fails to be converted to a number, it is substituted by zero.
 * @example   [1.1, 2.4, 2] -> [1.1, 2.4, 2],  
 *            ["4", -3, 3.2, "a"] -> [4, 3, 3.2, 0]
 * @param    arr      Array      array of numbers
 * @return            Array      array of numbers
 */
var sanitize = function (arr) {
        var sanitized = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var tmp = parseFloat(arr[i]);
            sanitized[i] = isNaN(tmp) ? 0 : Math.abs(tmp);
        }
        return sanitized;
    };

/**
 * calculates the sum the array elements. The elements are supposed to be numbers. Otherwise nothing is guaranteed.
 * @example     [1, 2, 2] -> 1 + 2 + 2 = 5
 * @param arr    array of numbers
 * @return   number
 */
var trace = function (arr) {
        var accum = 0;
        for (num in arr) {
            accum = accum + arr[num];
        }
        return accum;
    };

/**
 * normalizes the array. If all elements are equal to zero, then the elements are to be normallized uniformally.
 * If not all the elements are equal to zero, but the trace is equal to zero, then the input array is returned.
 * @example     [1, 3, 4]       -> [ 0.125, 0.375, 0.5 ]
 *              [2, 0, -1, -1]  -> [ 2, 0, -1, -1 ]   
 *              [0, 0]          -> [ 0.5, 0.5]
 * @param    Array   array of numbers
 * @return   Array   array of numbers 
 */
var normalize = function (arr) {
        var total = trace(arr);
        var len = arr.length;
        var areAllZeroes = arr.every(function (elem) {
            return elem === 0;
        });
        if (areAllZeroes) {
            arr = arr.map(function (arg) {
                return 1;
            });
            total = len;
        }
        var result = [];
        if (total === 0) {
            result = arr;
        } else {
            for (var i = 0; i < len; i++) {
                result[i] = arr[i] / total;
            }
        }
        return result;
    };


/**
 * Slices the first argument according to the weights given by the second argument.
 * The elements of the second array are supposed to be non-negative numbers. 
 * @example   (10, [1, 2, 2])    -> [2, 4, 4],  
 *            (30, [4, 2, 3, 1]) -> [12, 6, 9, 3]
 * @param    overall     Number  a number to be splitted
 * @param    pieces      Array   array of weigths
 * @return   Array       array of numbers
 */
var splitWeighted = function (overall, pieces) {
        var norm = normalize(sanitize(pieces));
        var result = [];
        var len = norm.length;
        for (var i = 0; i < len; i++) {
            result[i] = overall * norm[i];
        }
        return result;
    };


/**
 * rounds each elements of the array
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
 * @param    overall     Number   table width
 * @param    pieces      Array    array of nambers
 * @return               Array    array of integers    
 */
var columnWidths = function (overall, pieces) {
        return roundUp(splitWeighted(overall, pieces));
    }


    /**
     * Deletes the protocol name from the url.
     * Everything until the first occurence of '://' will be removed (inclusively).
     * @example  'http://www.test.com'      -> 'www.test.com'
     *           'www.test.com'             -> 'www.test.com'
     * @param    url     String
     * @return   String  url without protocol name
     */
var dropProtocol = function (str) {
        var delimiter = '://';
        var pattern = '^[^' + delimiter + ']+' + delimiter;
        var re = new RegExp(pattern, 'gi');
        return str.replace(re, '');
    };


/** 
 * Gives file extension
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
 * Represents a quantity divided in "value" and "measure".
 * @param        value       Number
 * @param        measure     String|null
 * @property     value       Number
 * @property     measure     String
 */

function Unit(value, measure) {
    "use strict";
    if (!(this instanceof Unit)) {
        return new Unit(value, measure);
    }
    if (isNaN(value) && (value !== undefined)) {
        throw new Error('the first arg is a not a number!');
    }
    if ((typeof measure !== 'string') && (measure !== undefined)) {
        throw new Error('the second arg is a not a string!');
    }

    this.value = value || 0;
    this.measure = measure ? measure.trim() : '';

    this.add = function(unit){
        var result;
        if(!(unit instanceof Unit)) {
            unit = toUnit(unit);
        };
        if(unit.measure !== this.measure){
            throw new Error("these Unit instances can not be summed up!");
        }
        return new Unit(this.value + unit.value, unit.measure);
    };
    this.sub = function(unit){
        var result;
        if(!(unit instanceof Unit)) {
            unit = toUnit(unit);
        };
        if(unit.measure !== this.measure){
            throw new Error("these Unit instances can not be subtracted!");
        }
        return new Unit(this.value - unit.value, unit.measure);
    }

}

/**
 * Divide the string into the value and the measurement unit.
 * If the length is given in "em" or "%", it is left as it is.
 * @param    str    String      '12px', '10m', '12.1 s', '32.2r'
 * @return   Object     object with keys "value" and "unit"
 */
var toUnit = function (str) {
        "use strict";
        str = str ? str.toString() : '0';
        var number = parseFloat(str);
        if (isNaN(number)) {
            return false;
        }
        var unit = str.replace(number.toString(), '').trim();
        return new Unit(number, unit);
    };