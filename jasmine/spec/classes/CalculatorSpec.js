/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, afterEach, Calculator */

describe('Calculator', function() {
    var c;
    beforeEach(function() {
        c = new Calculator();
    });
    describe('has a method "parse" that', function() {
        it('returns object {value: 43, unit: "px"} if the input is a string "43px"', function() {
            var obj = c.parse('43px');
            expect(obj.value).toBe(43);
            expect(obj.unit).toBe('px');
        });
        it('returns object {value: 0.121, unit: "em"} if the input is a string "0.121em"', function() {
            var obj = c.parse('0.121em');
            expect(obj.value).toBe(0.121);
            expect(obj.unit).toBe('em');
        });

        it('returns object {value: 85.2, unit: "px"} if the input is a string "85.2 px"', function() {
            var obj = c.parse('85.2 px');
            expect(obj.value).toBe(85.2);
            expect(obj.unit).toBe('px');
        });

        it('returns object {value: -21.3, unit: "em"} if the input is a string "-21.3em"', function() {
            var obj = c.parse('-21.3em');
            expect(obj.value).toBe(-21.3);
            expect(obj.unit).toBe('em');
        });

        it('returns object {value: 4.6, unit: null} if the input is a string "4.6"', function() {
            var obj = c.parse('4.6');
            expect(obj.value).toBe(4.6);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: 32, unit: null} if the input is a number 32', function() {
            var obj = c.parse(32);
            expect(obj.value).toBe(32);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: 4.6, unit: null} if the input is a number 4.6', function() {
            var obj = c.parse(4.6);
            expect(obj.value).toBe(4.6);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: 4.6, unit: null} if the input is a number 4.6', function() {
            var obj = c.parse(4.6);
            expect(obj.value).toBe(4.6);
            expect(obj.unit).toBe(null);
        });
        it('returns object {value: -75.2, unit: null} if the input is a number -75.2', function() {
            var obj = c.parse(-75.2);
            expect(obj.value).toBe(-75.2);
            expect(obj.unit).toBe(null);
        });
        it('returns nothing if the input is a string "aaa"', function() {
            var obj = c.parse("aaa");
            expect(obj).not.toBeDefined();
        });

    });

    describe('has a method "init" that', function() {
        it('returns reference to itself', function() {
            expect(c.init()).toBe(c);
        });
        it('sets value and unit to 0 and null if no argument is given', function() {
            c.init();
            expect(c.getValue()).toBe(0);
            expect(c.getUnit()).toBe(null);
        });
        it('sets value and unit to values that method "parse" returns if the argument is given', function() {
            spyOn(c, 'parse').and.returnValue({
                'value': 201,
                'unit': 'cm'
            });
            c.init('whatever');
            expect(c.getValue()).toBe(201);
            expect(c.getUnit()).toBe('cm');
        });
    });

    describe('has a method "add" that', function() {
        it('makes the state to be 20px if adding "6px" to initial state with "14px"', function() {
            c.init('14px');
            c.add('6px');
            expect(c.getValue()).toBe(20);
            expect(c.getUnit()).toBe('px');
        });
        it('makes the state to be 4.5 if adding 2.9 to initial state with 1.6', function() {
            c.init(1.6);
            c.add(2.9);
            expect(c.getValue()).toBe(4.5);
            expect(c.getUnit()).toBe(null);
        });
        it('can sum up two numbers', function() {
            c.init('2px');
            c.add('2.1px').add('32px');
            expect(c.getValue()).toBe(36.1);
            expect(c.getUnit()).toBe('px');
        });

        it('throws an error if adding 5px to initial state with 3pt', function() {
            c.init('3pt');
            expect(function() {
                c.add('5px');
            }).toThrow(new Error('Can not add 5px'));
        });
    });

    describe('has a method "sub" that', function() {
        it('makes the state to be 2.4pt if subtracting "0.7pt" from initial state with "3.1pt"', function() {
            c.init('3.1pt');
            c.sub('0.7pt');
            expect(c.getValue()).toBe(2.4);
            expect(c.getUnit()).toBe('pt');
        });
        it('makes the state to be -5 if subtracting 10 from initial state with 5', function() {
            c.init(5);
            c.sub(10);
            expect(c.getValue()).toBe(-5);
            expect(c.getUnit()).toBe(null);
        });
        it('can subtract two numbers', function() {
            c.init('2px');
            c.sub('1.5px').sub('2.6px');
            expect(c.getValue()).toBe(-2.1);
            expect(c.getUnit()).toBe('px');
        });

        it('throws an error if subtracting 10cm from initial state with 3pt', function() {
            c.init('3pt');
            expect(function() {
                c.sub('10cm');
            }).toThrow(new Error('Can not subtract 10cm'));
        });
    });


    describe('has a method "toBaseExp" that', function() {
        var result;
        afterEach(function() {
            expect(result.length).toBe(2);
        });
        it('returns array [0, 0] if the input is 0', function() {
            result = c.toBaseExp(0);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
        });

        it('returns array [5, 0] if the input is 5', function() {
            result = c.toBaseExp(5);
            expect(result[0]).toBe(5);
            expect(result[1]).toBe(0);
        });


        it('returns array [335, -4] if the input is 0.0335', function() {
            result = c.toBaseExp(0.0335);
            expect(result[0]).toBe(335);
            expect(result[1]).toBe(-4);
        });

        it('returns array [1234, 4] if the input is 1230000', function() {
            result = c.toBaseExp(12340000);
            expect(result[0]).toBe(1234);
            expect(result[1]).toBe(4);
        });

        it('returns array [100001, -3] if the input is 100.001', function() {
            result = c.toBaseExp(100.001);
            expect(result[0]).toBe(100001);
            expect(result[1]).toBe(-3);
        });
    });

    describe('has a method "toStandard" that', function() {
        it('returns 20 if the input is [20, 0]', function() {
            expect(c.toStandard([20, 0])).toBe(20);
        });
        it('returns 0.053 if the input is [53, -3]', function() {
            expect(c.toStandard([53, -3])).toBe(0.053);
        });
        it('returns 174000 if the input is [174, 3]', function() {
            expect(c.toStandard([174, 3])).toBe(174000);
        });
    });

    describe('has a method "mult" that', function() {
        it('returns Calculator instance', function() {
            c.init('100px');
            expect(c.mult(4) instanceof Calculator).toBe(true);
        });
        it('returns 10.2px if argument is 2 and initial state is 5.1px', function() {
            c.init('5.1px');
            var result = c.mult(2);
            expect(result.getValue()).toBe(10.2);
            expect(result.getUnit()).toBe('px');
        });
        it('returns 42 if argument is 6 and initial state is 7', function() {
            c.init(7);
            var result = c.mult(6);
            expect(result.getValue()).toBe(42);
            expect(result.getUnit()).toBe(null);
        });
    });

    describe('has a method "div" that', function() {
        it('returns Calculator instance', function() {
            c.init('20sq');
            expect(c.div(4) instanceof Calculator).toBe(true);
        });
        it('returns 0.5px if argument is 5 and initial state is 2.5px', function() {
            c.init('2.5px');
            var result = c.div(5);
            expect(result.getValue()).toBe(0.5);
            expect(result.getUnit()).toBe('px');
        });
        it('returns 23 if argument is 3 and initial state is 69', function() {
            c.init(69);
            var result = c.div(3);
            expect(result.getValue()).toBe(23);
            expect(result.getUnit()).toBe(null);
        });
        it('throws an error if attempting to divide by zero', function() {
            c.init(2);
            expect(function() {
                c.div(0);
            }).toThrow(new Error('Division by zero!'));
        });
    });

    describe('has a method "toString"', function() {
        it('returns empty string if the instance is not initalized', function() {
            expect(c.toString()).toBe('');
        });

        it('returns "25" if the value and measure are 25 and null', function() {
            spyOn(c, 'getValue').and.returnValue(25);
            spyOn(c, 'getUnit').and.returnValue(null);
            expect(c.toString()).toBe('25');
        });
        it('returns "10px" if the value and measure are 10 and px', function() {
            spyOn(c, 'getValue').and.returnValue(10);
            spyOn(c, 'getUnit').and.returnValue('px');
            expect(c.toString()).toBe('10px');
        });
        it('returns "0px" if the value and measure are 0 and px', function() {
            spyOn(c, 'getValue').and.returnValue(0);
            spyOn(c, 'getUnit').and.returnValue('px');
            expect(c.toString()).toBe('0px');
        });
        it('returns "0.02" if the value and measure are 0.02 and null', function() {
            spyOn(c, 'getValue').and.returnValue(0.02);
            spyOn(c, 'getUnit').and.returnValue(null);
            expect(c.toString()).toBe('0.02');
        });
        it('returns "-0.01em" if the value and measure are -0.01 and em', function() {
            spyOn(c, 'getValue').and.returnValue(-0.01);
            spyOn(c, 'getUnit').and.returnValue('em');
            expect(c.toString()).toBe('-0.01em');
        });
    });

});
