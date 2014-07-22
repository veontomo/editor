/*jslint plusplus: true, white: true */
/*global describe, it, expect, Helper */

describe('Test helper functions', function(){
    describe("file extension", function () {
        it("gives the file extension", function () {
            expect(Helper.fileExt('c:/folder/test.exe')).toEqual('exe');
            expect(Helper.fileExt('c:/folder/testexe')).toEqual('');
        });
    });

    describe('Helper::firstLetterUpperCase(): converts first letter to upper case', function(){
        it('Returns empty string for empty input', function(){
            expect(Helper.firstLetterUpperCase('')).toBe('');
        });
        it('Returns a space if the input is a space', function(){
            expect(Helper.firstLetterUpperCase(' ')).toBe(' ');
        });
        it('Returns "D" in called on "d"', function(){
            expect(Helper.firstLetterUpperCase('d')).toBe('D');
        });
        it('Returns "K" in called on "K"', function(){
            expect(Helper.firstLetterUpperCase('K')).toBe('K');
        });
        it('Returns "9" in called on "9"', function(){
            expect(Helper.firstLetterUpperCase('9')).toBe('9');
        });
        it('Returns "Abcd" in called on "abcd"', function(){
            expect(Helper.firstLetterUpperCase('abcd')).toBe('Abcd');
        });
        it('Returns "LKM" in called on "KLM"', function(){
            expect(Helper.firstLetterUpperCase('KLM')).toBe('KLM');
        });
        it('Returns "Tata6" in called on "tata6"', function(){
            expect(Helper.firstLetterUpperCase('tata6')).toBe('Tata6');
        });


    });



    describe("table2 helper functions", function () {
        it("transforms each element of the input array into a non-negative number", function () {
            expect(Helper.sanitize([1, 2, 3])).toEqual([1, 2, 3]);
            expect(Helper.sanitize([1.1, 2.4, 2])).toEqual([1.1, 2.4, 2]);
            expect(Helper.sanitize(["4", -3, 3.2, "a"])).toEqual([4, 3, 3.2, 0]);
        });

        it("calculates the trace of the array", function () {
            expect(Helper.trace([1, 3, 5])).toEqual(9);
            expect(Helper.trace([])).toEqual(0);
            expect(Helper.trace([1.1, 2.3, -10])).toEqual(1.1 + 2.3 - 10);
        });

        it("normalizes the array", function () {
            expect(Helper.normalize([1, 2, 2])).toEqual([0.2, 0.4, 0.4]);
            expect(Helper.normalize([0, 0, 0, 0])).toEqual([0.25, 0.25, 0.25, 0.25]); // all zeroes in the array
            expect(Helper.normalize([2, -2])).toEqual([2, -2]); // zero trace
        });

        it("splits the number in terms with specified weights", function () {
            expect(Helper.splitWeighted(10, [1, 2, 2])).toEqual([2, 4, 4]);
            expect(Helper.splitWeighted(30, [4, 2, 3, 1])).toEqual([12, 6, 9, 3]);
            expect(Helper.splitWeighted(30, [4, 2, 0])).toEqual([20, 10, 0]);
        });

        it("rounds each elements of the array", function () {
            expect(Helper.roundUp([1, 2, 5, 0, 4])).toEqual([1, 2, 5, 0, 4]);
            expect(Helper.roundUp([2.2, 5.6, 0, 4.5])).toEqual([2, 6, 0, 5]);
            expect(Helper.roundUp([-2.8, 3.4, 4.993])).toEqual([-3, 3, 5]);
        });
    });

    describe('it transforms the first letter of the string into upper case, the rest - in lower', function(){
         it('does its work', function(){
             expect(Helper.onlyFirstLetterUpperCase('alllowercase')).toBe('Alllowercase');
             expect(Helper.onlyFirstLetterUpperCase('f')).toBe('F');
             expect(Helper.onlyFirstLetterUpperCase('')).toBe('');
             expect(Helper.onlyFirstLetterUpperCase('MiXeD')).toBe('Mixed');
             expect(Helper.onlyFirstLetterUpperCase('iNvErSe')).toBe('Inverse');
        });
    });

    describe("drop protocol", function () {
        it("drops protocol", function () {
            expect(Helper.dropProtocol('http://www.test.com')).toEqual("www.test.com");
            expect(Helper.dropProtocol('https://www.test.com')).toEqual("www.test.com");
            expect(Helper.dropProtocol('ftp://www.test.com')).toEqual("www.test.com");
            expect(Helper.dropProtocol('www.test.com')).toEqual("www.test.com");
            expect(Helper.dropProtocol('http://www.test.com://')).toEqual("www.test.com://");
            expect(Helper.dropProtocol('http://www.cercoagenti.it/homepage_vetrina.asp?vetrina/1746000004-1.txt')).toEqual('www.cercoagenti.it/homepage_vetrina.asp?vetrina/1746000004-1.txt');
        });
    });

    describe('Validation the calculated width', function () {
        it('makes the width to be valid', function () {
            expect(Helper.validateWidth('10px')).toEqual('10px');
            expect(Helper.validateWidth('20.92px ')).toEqual('20px');
            expect(Helper.validateWidth('340 px')).toEqual('340px');
            expect(Helper.validateWidth('320.7 px')).toEqual('320px');
            expect(Helper.validateWidth('10pt')).toEqual('10pt');
            expect(Helper.validateWidth('20.32pt')).toEqual('20pt');
            expect(Helper.validateWidth('340 pt')).toEqual('340pt');

            expect(Helper.validateWidth('320.1 em')).toEqual('320.1em');
            expect(Helper.validateWidth('10em')).toEqual('10em');
            expect(Helper.validateWidth('20.92em ')).toEqual('20.92em');
            expect(Helper.validateWidth('340 %')).toEqual('340%');
            expect(Helper.validateWidth('320.1 %')).toEqual('320.1%');
            expect(Helper.validateWidth('320.6%')).toEqual('320.6%');
            expect(Helper.validateWidth('10% ')).toEqual('10%');


            expect(Helper.validateWidth('320.1 em1')).toBe(false);
            expect(Helper.validateWidth('pt320.1')).toBe(false);
        });
    });

    describe('Escaping special characters', function(){
        it('returns input, if zero is given as input', function(){
            expect(Helper.specialChar(1)).toBe(1);
        });
        it('returns input, if a positive integer number is given as input', function(){
            expect(Helper.specialChar(5)).toBe(5);
        });
        it('returns input, if a negative integer number is given as input', function(){
            expect(Helper.specialChar(-45)).toBe(-45);
        });
        it('returns input, if a positive float number is given as input', function(){
            expect(Helper.specialChar(9.81)).toBe(9.81);
        });

        it('returns input, if a positive float number is given as input', function(){
            expect(Helper.specialChar(-45.1)).toBe(-45.1);
        });

        it('returns null, if a function is given as input', function(){
            expect(Helper.specialChar(function(i){return i;})).toBe(null);
        });

        it('returns null, if an object is given as input', function(){
            expect(Helper.specialChar({'foo': true})).toBe(null);
        });


        it('does not change "safe" characters', function(){
            var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]!?.,;:%&\\/^\"'<>_";
            expect(Helper.specialChar(str)).toBe(str);
        });

        it('does not change "safe" characters', function(){
            var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]!?.,;:%&\\/^\"'<>_";
            expect(Helper.specialChar(str)).toBe(str);
        });

        it('escapes single character à', function(){
            var str = 'à';
            expect(Helper.specialChar(str)).toBe("&#224;");
        });

        it('leaves & untouched', function(){
            expect(Helper.specialChar('&')).toBe('&');
            expect(Helper.specialChar('abcd&ef')).toBe('abcd&ef');
            expect(Helper.specialChar('&ef')).toBe('&ef');
            expect(Helper.specialChar('abc&')).toBe('abc&');
        });

        it('escapes special characters', function(){
            var str = "à ò è";
            expect(Helper.specialChar(str)).toBe("&#224; &#242; &#232;");
        });

        it('escapes only special characters in mixed strings', function(){
            var str = "<div style=\"color:red;\">01 à A ò (È) è</div>";
            expect(Helper.specialChar(str)).toBe("<div style=\"color:red;\">01 &#224; A &#242; (&#200;) &#232;</div>");
        });
    });

    describe('cracking array element:', function(){
        it('cracks the only element in two integers', function(){
            var arr = [10],
                arr2 = Helper.crack(arr, 0);
            expect(arr2.length).toBe(2);
            expect(parseInt(arr2[0], 10)).toBe(arr2[0]);
            expect(parseInt(arr2[1], 10)).toBe(arr2[1]);
            expect(Helper.trace(arr2)).toBe(Helper.trace(arr));

            arr = [27];
            arr2 = Helper.crack(arr, 0);
            expect(arr2.length).toBe(2);
            expect(Helper.trace(arr2)).toBe(27);
        });

        it('cracks the very first element in two integer parts', function(){
            var arr = [11, 20, 10],
                arr2 = Helper.crack(arr, 0);
            expect(arr2.length).toBe(4);
            expect(arr2.every(function(el){
                return el === parseInt(el, 10);
            }));
            expect(Helper.trace(arr2)).toBe(Helper.trace(arr));

            arr = [34, 20, 10];
            arr2 = Helper.crack(arr, 0);
            expect(arr2.length).toBe(4);
            expect(arr2.every(function(el){
                return el === parseInt(el, 10);
            }));
            expect(Helper.trace(arr2)).toBe(Helper.trace(arr));
        });

        it('cracks the second element in two integer parts', function(){
            var arr = [11, 20, 10],
                arr2 = Helper.crack(arr, 1);
            expect(arr2.length).toBe(4);
            expect(arr2.every(function(el){
                return el === parseInt(el, 10);
            }));
            expect(Helper.trace(arr2)).toBe(Helper.trace(arr));

            arr = [34, 20, 10];
            arr2 = Helper.crack(arr, 1);
            expect(arr.length).toBe(3);
            expect(arr2.length).toBe(4);
            expect(arr2.every(function(el){
                return el === parseInt(el, 10);
            }));
            expect(Helper.trace(arr2)).toBe(Helper.trace(arr));
        });
    });

    describe('concatDropSpaces', function(){
        it('returns empty string for empty array and non-defined glue', function(){
            expect(Helper.concatDropSpaces([])).toBe('');
        });
        it('returns empty string for empty array and non-empty glue', function(){
            expect(Helper.concatDropSpaces([], 'a glue')).toBe('');
        });
        it('default glue is a space', function(){
            expect(Helper.concatDropSpaces(['a', 'b', 'c']) === Helper.concatDropSpaces(['a', 'b', 'c'], ' '));
        });
        it('returns array element for one-element array and non-defined glue', function(){
            expect(Helper.concatDropSpaces(['elem'])).toBe('elem');
        });
        it('returns array element for one-element array and non-empty glue', function(){
            expect(Helper.concatDropSpaces(['elem'], 'a glue')).toBe('elem');
        });
        it('returns string for three-element array of strings and empty glue', function(){
            expect(Helper.concatDropSpaces(['elem', 'abcd', 'def' ], '')).toBe('elemabcddef');
        });
        it('returns string for three-element array of strings and default glue', function(){
            expect(Helper.concatDropSpaces(['elem', 'abcd', 'def' ])).toBe('elem abcd def');
        });

        it('returns string for three-element array of strings and non-empty glue', function(){
            expect(Helper.concatDropSpaces(['elem', 'abcd', 'def' ], '-')).toBe('elem-abcd-def');
        });
        it('returns string for [1, "abcd"]', function(){
            expect(Helper.concatDropSpaces([1, 'abcd'])).toBe('1 abcd');
        });
        it('returns string for [1, "abcd"] and non-empty glue', function(){
            expect(Helper.concatDropSpaces([1, 'abcd', ], ';')).toBe('1;abcd');
        });
    });

    describe('generates unique id for the string', function(){
        it('if the target string is a plain text', function(){
            var str = 'Pink shore, serene breeze. The flat, upright sparkle shines. Lost moon, velvet spirit.';
            expect(Helper.generateId(str).length > 0).toBe(true);
            expect(Helper.generateId(str,'moon')).toBe('moon');
            expect(Helper.generateId(str,'shore')).toBe('shore');
        });
        it('if the target string is a valid html text', function(){
            var str = 'Indeed, an <div id="id">incinerated</div> mortician bestows great honor upon a prime\
                minister about the tape recorder. For example, a tomato <span id="id1">indicates that\
                the traffic light</span> is a big fan of a salad dressing of a light bulb. A traffic \
                <p id="id2">light</p> toward a fairy sanitizes a radioactive avocado pit. Furthermore,\
                a demon toward a senator wakes up, and a fire hydrant for a cough syrup goes deep sea\
                fishing with a grand piano.',
                allIds = ['id', 'id1', 'id2'],
                id1 = Helper.generateId(str),
                id2 = Helper.generateId(str,'id'),
                id3 = Helper.generateId(str,'id1');

            expect(id1.length > 0).toBe(true);
            expect(allIds.indexOf(id1)).toBe(-1);
            expect(allIds.indexOf(id2)).toBe(-1);
            expect(allIds.indexOf(id3)).toBe(-1);
        });
        it('if the target string is not well formed html text', function(){
            var str = 'Indeed, an <div id="id">incinerated</div> mortician bestows great honor upon a prime\
                minister about the tape recorder. For example, a tomato <span id="id1">NO CLOSING SPAN TAG!\
                indicates that the traffic light is a big fan of a salad dressing of a light bulb. A traffic \
                <p id="id2">light</p> toward a fairy sanitizes a radioactive avocado pit. Furthermore,\
                a demon toward a senator wakes up, and a fire hydrant for a cough syrup goes deep sea\
                fishing with a grand piano.',
                allIds = ['id', 'id1', 'id2'],
                id1 = Helper.generateId(str),
                id2 = Helper.generateId(str,'id'),
                id3 = Helper.generateId(str,'id1');

                expect(id1.length > 0).toBe(true);
                expect(allIds.indexOf(id1)).toBe(-1);
                expect(allIds.indexOf(id2)).toBe(-1);
                expect(allIds.indexOf(id3)).toBe(-1);
        });
    });

    describe('Helper::pushBeforeLast(): inserts element before last element of the array', function(){
        it('does not modify empty array if there is nothing to insert', function(){
            var arr = [];
            Helper.pushBeforeLast(arr);
            expect(arr.length).toBe(0);
        });
        it('does not modify 2-element array if there is nothing to insert', function(){
            var arr = [1, 'str'];
            Helper.pushBeforeLast(arr);
            expect(arr.length).toBe(2);
            expect(arr[0]).toBe(1);
            expect(arr[1]).toBe('str');
        });
        it('inserts an object if the target array is empty', function(){
            var arr = [],
                obj = {'foo': 'new'};
            Helper.pushBeforeLast(arr, obj);
            expect(arr.length).toBe(1);
            expect(arr[0]).toBe(obj);
        });

        it('inserts an object if the target array has one element', function(){
            var arr = ['str'],
                obj = {'foo': 'new'};
            Helper.pushBeforeLast(arr, obj);
            expect(arr.length).toBe(2);
            expect(arr[0]).toBe(obj);
            expect(arr[1]).toBe('str');
        });

        it('inserts an object if the target array has three elements', function(){
            var arr = ['str', 94.2, 'dumb'],
                obj = {'foo': 'new'};
            Helper.pushBeforeLast(arr, obj);
            expect(arr.length).toBe(4);
            expect(arr[0]).toBe('str');
            expect(arr[1]).toBe(94.2);
            expect(arr[2]).toBe(obj);
            expect(arr[3]).toBe('dumb');
        });
    });

    describe('Helper::isSemanticallyValid(): whether the argument is a semantically valid html', function(){
        it('returns true for empty string', function(){
            expect(Helper.isSemanticallyValid('')).toBe(true);
        });
        it('returns true for a string', function(){
            expect(Helper.isSemanticallyValid('a string')).toBe(true);
        });
        it('returns false for <div>abc</p>', function(){
            expect(Helper.isSemanticallyValid('<div>abc</p>')).toBe(false);
        });
        it('returns true for <div>abc</div>', function(){
            expect(Helper.isSemanticallyValid('<div>abc</div>')).toBe(true);
        });
        it('returns true for nested tags <div>abc<p>123</p></div>', function(){
            expect(Helper.isSemanticallyValid('<div>abc<p>123</p></div>')).toBe(true);
        });
        it('returns false for stand alone table cells', function(){
            expect(Helper.isSemanticallyValid('<td>abc</td>')).toBe(false);
        });
        it('returns false for stand alone table rows', function(){
            expect(Helper.isSemanticallyValid('<tr><td>abc</td></tr>')).toBe(false);
        });
        it('returns false for incomplete table', function(){
            expect(Helper.isSemanticallyValid('<table><tbody><td>abc</td></tbody></table>')).toBe(false);
            expect(Helper.isSemanticallyValid('<table><tr></tr></table>')).toBe(false);
            expect(Helper.isSemanticallyValid('<table><tbody><tr>abc</tr></tbody></table>')).toBe(false);
            expect(Helper.isSemanticallyValid('<table><tbody>string<tr></tr></tbody></table>')).toBe(false);
            expect(Helper.isSemanticallyValid('<table>string<td></table>')).toBe(false);
            expect(Helper.isSemanticallyValid('<table><tr><td>abc</td></tr><tr>string</tr></table>')).toBe(false);
        });
        it('returns true for complete table', function(){
            expect(Helper.isSemanticallyValid('<table><tbody><tr><td>abc</td></tr></tbody></table>')).toBe(true);
            expect(Helper.isSemanticallyValid('<table><tbody><tr><td>abc</td></tr><tr><td></td></tr></tbody></table>')).toBe(true);
        });
        it('returns true for lists', function(){
            expect(Helper.isSemanticallyValid('<ul><li>first item</li></ul>')).toBe(true);
            expect(Helper.isSemanticallyValid('<ol><li></li></ol>')).toBe(true);
        });
    });

    describe('Getting tag styles', function(){
        var css1, css2, css3;
        beforeEach(function(){
            css1 = "div{width: 100px; color: #00AABB;} span {font: 14em;font-weight:bold;}";
            css2 = "#wrapper {width: 100px; color: #00AABB;} body {min-width: 20em;} body {color: red;}";
            css3 = "div {width: 100px; color: #00AABB}div {min-width: 20em;} div{padding: 1px}";
        });

        it('returns empty string if selector is not found', function(){
            expect(Helper.cssOfSelector('a', css1)).toBe('');
        });

        it('concatenates strings if selector is found two times', function(){
            expect(Helper.cssOfSelector('body', css2)).toBe('min-width: 20em; color: red;');
        });

        it('delimiters concatenated strings by semicolon', function(){
            expect(Helper.cssOfSelector('div', css3)).toBe('width: 100px; color: #00AABB; min-width: 20em; padding: 1px;');
        });

    });


});

