/*jslint plusplus: true, white: true */
/*global describe, it, expect, Calculator */

describe('Calculator', function(){
    var c;
    beforeEach(function(){
        c = new Calculator();
    });
    describe('has a method calculate that', function () {
        it('returns number 5 if its input is number 5', function () {
            expect(c.calculate(5)).toBe(5);
        });
        it('returns number -2.98 if its input is number -2.98', function () {
            expect(c.calculate(-2.98)).toBe(-2.98);
        });
        it('returns number 0 if its input is number 0', function () {
            expect(c.calculate(0)).toBe(0);
        });
        it('returns string "12" if its input is string "12"', function () {
            expect(c.calculate("12")).toBe("12");
        });
        it('returns string "6" if its input is string "2 + 4"', function () {
            expect(c.calculate("2 + 4")).toBe("6");
        });
        it('returns string "7.32" if its input is string "8 - 0.68"', function () {
            expect(c.calculate("8 - 0.68")).toBe("7.32");
        });
        it('returns string "52" if its input is string "4*13"', function () {
            expect(c.calculate("13*4")).toBe("52");
        });
        it('returns string "22" if its input is string "110/5"', function () {
            expect(c.calculate("110/5")).toBe("22");
        });
        it('returns string "22" if its input is string "110:5"', function () {
            expect(c.calculate("110:5")).toBe("22");
        });







    });


});

