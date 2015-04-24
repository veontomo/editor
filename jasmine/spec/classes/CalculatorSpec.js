/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, Calculator */

describe('Calculator', function(){
    var c;
    beforeEach(function(){
        c = new Calculator();
    });
    describe('has a method "parse" that', function(){
        it('returns object {value: 43, unit: "px"} if the input is a string "43px"', function(){
            var obj = c.parse('43px');
            expect(obj.value).toBe(43);
            expect(obj.unit).toBe('px');
        });
        it('returns object {value: 0.121, unit: "em"} if the input is a string "0.121em"', function(){
            var obj = c.parse('0.121em');
            expect(obj.value).toBe(0.121);
            expect(obj.unit).toBe('em');
        });

        it('returns object {value: 85.2, unit: "px"} if the input is a string "85.2 px"', function(){
            var obj = c.parse('85.2 px');
            expect(obj.value).toBe(85.2);
            expect(obj.unit).toBe('px');
        });

        it('returns object {value: -21.3, unit: "em"} if the input is a string "-21.3em"', function(){
            var obj = c.parse('-21.3em');
            expect(obj.value).toBe(-21.3);
            expect(obj.unit).toBe('em');
        });

        it('returns object {value: 4.6, unit: null} if the input is a string "4.6"', function(){
            var obj = c.parse('4.6');
            expect(obj.value).toBe(4.6);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: 32, unit: null} if the input is a number 32', function(){
            var obj = c.parse(32);
            expect(obj.value).toBe(32);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: 4.6, unit: null} if the input is a number 4.6', function(){
            var obj = c.parse(4.6);
            expect(obj.value).toBe(4.6);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: 4.6, unit: null} if the input is a number 4.6', function(){
            var obj = c.parse(4.6);
            expect(obj.value).toBe(4.6);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: -75.2, unit: null} if the input is a number -75.2', function(){
            var obj = c.parse(-75.2);
            expect(obj.value).toBe(-75.2);
            expect(obj.unit).toBe(null);
        });
        it('returns nothing if the input is a string "aaa"', function(){
            var obj = c.parse("aaa");
            expect(obj).not.toBeDefined();
        });

    });

});

