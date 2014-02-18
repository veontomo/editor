/*jslint plusplus: true, white: true */
/*global describe, it, expect, Helper, */

describe('Test helper functions', function(){
    describe("file extension", function () {
        it("gives the file extension", function () {
            expect(Helper.fileExt('c:/folder/test.exe')).toEqual('exe');
            expect(Helper.fileExt('c:/folder/testexe')).toEqual('');
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

});

