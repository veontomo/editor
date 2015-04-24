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

    describe('has a method "init" that', function(){
        it('sets value and unit to 0 and null if no argument is given', function(){
            c.init();
            expect(c.getValue()).toBe(0);
            expect(c.getUnit()).toBe(null);
        });
        it('sets value and unit to values that method "parse" returns if the argument is given', function(){
            spyOn(c, 'parse').and.returnValue({'value': 201, 'unit': 'cm'});
            c.init('whatever');
            expect(c.getValue()).toBe(201);
            expect(c.getUnit()).toBe('cm');
        });
    });

    describe('has a method "add" that', function() {
        it('makes the state to be 20px if adding "6px" to initial state with "14px"', function(){
            c.init('14px');
            c.add('6px');
            expect(c.getValue()).toBe(20);
            expect(c.getUnit()).toBe('px');
        });
        it('makes the state to be 4.5 if adding 2.9 to initial state with 1.6', function(){
            c.init(1.6);
            c.add(2.9);
            expect(c.getValue()).toBe(4.5);
            expect(c.getUnit()).toBe(null);
        });
        it('can sum up two numbers', function(){
            c.init('2px');
            c.add('2.1px').add('32px');
            expect(c.getValue()).toBe(36.1);
            expect(c.getUnit()).toBe('px');
        });

        it('throws an error if adding 5px to initial state with 3pt', function(){
            c.init('3pt');
            expect(function(){
                c.add('5px');
            }).toThrow(new Error('Can not add 5px'));
        });
    });

    describe('has a method "sub" that', function() {
        it('makes the state to be 2.4pt if subtracting "0.7pt" from initial state with "3.1pt"', function(){
            c.init('3.1pt');
            c.sub('0.7pt');
            expect(c.getValue()).toBe(2.4);
            expect(c.getUnit()).toBe('pt');
        });
        it('makes the state to be -5 if subtracting 10 from initial state with 5', function(){
            c.init(5);
            c.sub(10);
            expect(c.getValue()).toBe(-5);
            expect(c.getUnit()).toBe(null);
        });
        it('can subtract two numbers', function(){
            c.init('2px');
            c.sub('1.5px').sub('2.6px');
            expect(c.getValue()).toBe(-2.1);
            expect(c.getUnit()).toBe('px');
        });

        it('throws an error if subtracting 10cm from initial state with 3pt', function(){
            c.init('3pt');
            expect(function(){
                c.sub('10cm');
            }).toThrow(new Error('Can not subtract 10cm'));
        });
    });


    describe('has a method "canonicalForm" that', function(){
        var result;
        afterEach(function(){
            expect(result.length).toBe(2);
        });
        it('returns array [0, 0] if the input is 0', function(){
            result = c.canonicalForm(0);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
        });

        it('returns array [5, 0] if the input is 5', function(){
            result = c.canonicalForm(5);
            expect(result[0]).toBe(5);
            expect(result[1]).toBe(0);
        });


        it('returns array [335, -4] if the input is 0.0335', function(){
            result = c.canonicalForm(0.0335);
            expect(result[0]).toBe(335);
            expect(result[1]).toBe(-4);
        });

        it('returns array [1234, 4] if the input is 1230000', function(){
            result = c.canonicalForm(12340000);
            expect(result[0]).toBe(1234);
            expect(result[1]).toBe(4);
        });

        it('returns array [100001, -3] if the input is 100.001', function(){
            result = c.canonicalForm(100.001);
            expect(result[0]).toBe(100001);
            expect(result[1]).toBe(-3);
        });



    });

});

