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






    });
    // describe('has a method calculate that', function () {
    //     it('returns number 5 if its input is number 5', function () {
    //         expect(c.calculate(5)).toBe(5);
    //     });
    //     it('returns number -2.98 if its input is number -2.98', function () {
    //         expect(c.calculate(-2.98)).toBe(-2.98);
    //     });
    //     it('returns number 0 if its input is number 0', function () {
    //         expect(c.calculate(0)).toBe(0);
    //     });
    //     it('returns string "12" if its input is string "12"', function () {
    //         expect(c.calculate("12")).toBe("12");
    //     });
    //     it('returns string "6" if its input is string "2 + 4"', function () {
    //         expect(c.calculate("2 + 4")).toBe("6");
    //     });
    //     it('returns string "7.32" if its input is string "8 - 0.68"', function () {
    //         expect(c.calculate("8 - 0.68")).toBe("7.32");
    //     });
    //     it('returns string "52" if its input is string "4*13"', function () {
    //         expect(c.calculate("13*4")).toBe("52");
    //     });
    //     it('returns string "22" if its input is string "110/5"', function () {
    //         expect(c.calculate("110/5")).toBe("22");
    //     });
    //     it('returns string "22" if its input is string "110:5"', function () {
    //         expect(c.calculate("110:5")).toBe("22");
    //     });
    // });


});

