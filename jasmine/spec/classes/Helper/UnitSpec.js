/*jslint plusplus: true, white: true */
/*global jasmine, describe, it, expect, beforeEach, spyOn, Unit */
describe('Unit-related functionality', function () {
    var u, stub;
    beforeEach(function(){
        u = new Unit();
        stub = jasmine.createSpyObj('Unit', ['add', 'sub', 'isLikeAs']);
    });

    describe('Unit::constructor: creates instances of Unit class' , function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var u2 = Unit();
            expect(u2 instanceof Unit).toBe(true);
        });

        it('when value is an integer, measure is a string', function () {
            u = new Unit(1, 'cm');
            expect(u.getValue()).toEqual(1);
            expect(u.getMeasure()).toEqual('cm');
        });
        it('when value is a float, measure is a string', function () {
            u = new Unit(29.50206, 'l');
            expect(u.getValue()).toEqual(29.50206);
            expect(u.getMeasure()).toEqual('l');
        });
        it('when value is a float, measure is missing', function () {
            u = new Unit(2.5);
            expect(u.getValue()).toEqual(2.5);
            expect(u.getMeasure()).not.toBeDefined();
        });
        it('when value is an integer, measure is an empty string', function () {
            u = new Unit(73, '');
            expect(u.getValue()).toEqual(73);
            expect(u.getMeasure()).not.toBeDefined();
        });
        it('when value is an integer, measure is a string with spaces at the end', function () {
            u = new Unit(12, 'cm ');
            expect(u.getValue()).toEqual(12);
            expect(u.getMeasure()).toEqual('cm');
        });
        it('when value is a float, measure is a string with spaces at the beginning', function () {
            u = new Unit(23.98, ' cm');
            expect(u.getValue()).toEqual(23.98);
            expect(u.getMeasure()).toEqual('cm');
        });
        it('when both value and measure are missing', function () {
            u = new Unit();
            expect(u.getValue()).toEqual(0);
            expect(u.getMeasure()).not.toBeDefined();
        });
        it('when value is a string with unit of measurement, measure is missing', function () {
            u = new Unit('345lk');
            expect(u.getValue()).toEqual(345);
            expect(u.getMeasure()).toEqual('lk');
        });
        it('when value is a string with unit of measurement, measure is missing', function () {
            u = new Unit('0.76 cm');
            expect(u.getValue()).toEqual(0.76);
            expect(u.getMeasure()).toEqual('cm');
        });
        it('when value is an empty string, measure is missing', function () {
            u = new Unit('');
            expect(u.getValue()).toEqual(0);
            expect(u.getMeasure()).not.toBeDefined();
        });
        it('throws an error if the measurement is a number', function(){
            var u1 = function(){
                return new Unit(1, 8);
            };
            expect(u1).toThrow(new Error('The unit of measurement must be a string!'));
            // expect(function(){
            //     u = new Unit(1, 8);
            // }).toThrow('The unit of measurement must be a string!');
        });
        it('throws an error if the measurement is a function', function(){
            u = function(){return new Unit(1, function(x){return x;});};
            expect(u).toThrow(new Error('The unit of measurement must be a string!'));
        });
        it('throws an error if the measurement is an object', function(){
            u = function(){return new Unit(1, {});};
            expect(u).toThrow(new Error('The unit of measurement must be a string!'));
        });
        it('throws an error if the measurement is an array', function(){
            u = function(){return new Unit(1, [1, 'two', 3, {4: 5}]);};
            expect(u).toThrow(new Error('The unit of measurement must be a string!'));
        });
    });

    describe('Unit::isLikeAs(): whether two Unit objects have the same unit of measurements', function(){
        it('gives false if argument can not be converted into a Unit object', function(){
            u = new Unit(1, 'cm');
            expect(u.isLikeAs("strign")).toBe(false);
        });

        it('gives true when comparing with itself', function(){
            u = new Unit(1, 'cm');
            expect(u.isLikeAs(u)).toBe(true);
            u = new Unit('23px');
            expect(u.isLikeAs(u)).toBe(true);
        });
        it('gives false when values are equal, measures are different', function(){
            u = new Unit(23, 'cm');
            expect(u.isLikeAs(new Unit(23, 'l'))).toBe(false);
        });
        it('gives true when values are different, measures are equal', function(){
            u = new Unit(32, 'p');
            expect(u.isLikeAs(new Unit(23.8, 'p'))).toBe(true);
        });
        it('gives true when values are different, measures are missing', function(){
            u = new Unit(32);
            expect(u.isLikeAs(new Unit(23.8))).toBe(true);
        });
        it('gives false when values are different, one measure is missing', function(){
            u = new Unit(32, 'px');
            expect(u.isLikeAs(new Unit(23.8))).toBe(false);
        });
        it('gives true when argument is a join of target', function(){
            u = new Unit(32, 'px');
            expect(u.isLikeAs(new Unit('32px'))).toBe(true);
        });
    });

    describe('Unit::add(): adds two Unit objects', function(){
        it('throws an error when calculating 1px + 4cm', function(){
            expect(function(){
                var u1 = new Unit(1, 'px'),
                    u2 = new Unit(4, 'cm');
                return u1.add(u2);
            }).toThrow(new Error('These Unit instances can not be summed up!'));
        });

        it('calculates 1px + 0sec to be 1px', function(){
            var u1 = new Unit(1, 'px'),
                u2 = new Unit(0, 'sec'),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(1);
            expect(u3.getMeasure()).toBe('px');
        });

        it('calculates 4 + 7 to be 11', function(){
            var u1 = new Unit(4),
                u2 = new Unit(7),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(11);
            expect(u3.getMeasure()).not.toBeDefined();
        });


        it('calculates 1px + 0 to be 1px', function(){
            var u1 = new Unit(1, 'px'),
                u2 = new Unit(0),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(1);
            expect(u3.getMeasure()).toBe('px');
        });


        it('calculates 0px + 5cm to be 5cm', function(){
            var u1 = new Unit(0, 'px'),
                u2 = new Unit(5, 'cm'),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(5);
            expect(u3.getMeasure()).toBe('cm');
        });

        it('calculates 0 + 5cm to be 5cm', function(){
            var u1 = new Unit(0),
                u2 = new Unit(5, 'cm'),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(5);
            expect(u3.getMeasure()).toBe('cm');
        });

        it('calculates 0 + 0 to be 0', function(){
            var u1 = new Unit(0),
                u2 = new Unit(0),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(0);
            expect(u3.getMeasure()).not.toBeDefined();
        });


        it('calculates 0cm + 0 to be 0', function(){
            var u1 = new Unit(0, 'cm'),
                u2 = new Unit(0),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(0);
            expect(u3.getMeasure()).not.toBeDefined();
        });

        it('calculates 0 + 0px to be 0', function(){
            var u1 = new Unit(0),
                u2 = new Unit(0, 'px'),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(0);
            expect(u3.getMeasure()).not.toBeDefined();
        });

        it('calculates 0cm + 0px to be 0', function(){
            var u1 = new Unit(0, 'cm'),
                u2 = new Unit(0, 'px'),
                u3 = u1.add(u2);
            expect(u3.getValue()).toBe(0);
            expect(u3.getMeasure()).not.toBeDefined();
        });

        it('sums up 23cm and 10cm', function(){
            u = new Unit(23, 'cm');
            var u2 = new Unit(10, 'cm');
            var sum = u.add(u2);
            expect(sum.getValue()).toBe(33);
            expect(sum.getMeasure()).toBe('cm');
        });
    });

    describe('Unit::sub(): subtracts two Unit objects', function(){
        it('calls Unit::add() method', function(){
            spyOn(u, 'add').and.returnValue('the result');
            u.sub(stub);
            expect(u.add).toHaveBeenCalled();
        });
    });


    describe('Multiplies Unit instance', function(){
        it('throws an error if no argument is given', function(){
            expect(function(){
                return u.times();
            }).toThrow(new Error('Argument is missing!'));
        });

        it('throws an error if no argument is a string', function(){
            expect(function(){
                return u.times('some string');
            }).toThrow(new Error('Argument must be a number!'));
        });

        it('calculates 8px * 0 to be 0px', function(){
            u = new Unit(8, 'px');
            var u2 = u.times(0);
            expect(u2.getValue()).toBe(0);
            expect(u2.getMeasure()).toBe('px');
        });

        it('calculates 5.2 * 0 to be 0', function(){
            u = new Unit(5.2);
            var u2 = u.times(0);
            expect(u2.getValue()).toBe(0);
            expect(u2.getMeasure()).not.toBeDefined();
        });

        it('calculates 5px * 3.4 to be 17px', function(){
            u = new Unit(5, 'px');
            var u2 = u.times(3.4);
            expect(u2.getValue()).toBe(17);
            expect(u2.getMeasure()).toBe('px');
        });

        it('calculates 0cm * 5 to be 0cm', function(){
            u = new Unit(0, 'cm');
            var u2 = u.times(5);
            expect(u2.getValue()).toBe(0);
            expect(u2.getMeasure()).toBe('cm');
        });

    });

    describe('Has unit of measurement or not?', function(){
        it('returns true if object\'s unit of measurement is a non-empty string', function(){
            u = new Unit();
            spyOn(u, 'getMeasure').and.returnValue('abc');
            expect(u.hasMeasure()).toBe(true);
        });
        it('returns false if object\'s unit of measurement is an empty string', function(){
            u = new Unit();
            spyOn(u, 'getMeasure').and.returnValue('');
            expect(u.hasMeasure()).toBe(false);
        });
        it('returns false if object\'s unit of measurement is null', function(){
            u = new Unit();
            spyOn(u, 'getMeasure').and.returnValue(null);
            expect(u.hasMeasure()).toBe(false);
        });
        it('returns false if object\'s unit of measurement is undefined', function(){
            u = new Unit();
            spyOn(u, 'getMeasure').and.returnValue();
            expect(u.hasMeasure()).toBe(false);
        });


    });


    describe('Unit division of two Unit objects', function(){
        var u1, u2, u3, u4, u5;
        beforeEach(function(){
            u1 = new Unit(12, 'px');
            u2 = new Unit(5, 'px');
            u3 = new Unit(10);
            u4 = new Unit(20, 'cm');
            u5 = new Unit(4);
        });

        it('divides two Unit objects with the same measure', function(){
            var res = u1.frac(u2);
            expect(res.getValue()).toBe(2.4);
            expect(u.getMeasure()).not.toBeDefined();
        });

        it('divides two Unit objects without measure', function(){
            var res = u5.frac(u3);
            expect(res.getValue()).toBe(0.4);
            expect(u.getMeasure()).not.toBeDefined();
        });

        it('divides a Unit object with measure by a Unit without measure', function(){
            var res = u1.frac(u3);
            expect(res.getValue()).toBe(1.2);
            expect(res.getMeasure()).toBe('px');
        });

        it('divides a Unit object by a number', function(){
            var res = u1.frac(3);
            expect(res.getValue()).toBe(4);
            expect(res.getMeasure()).toBe('px');
        });

        it('divides a Unit object by a dimensionless number represented as a string ', function(){
            var res = u1.frac('3');
            expect(res.getValue()).toBe(4);
            expect(res.getMeasure()).toBe('px');
        });

        it('divides a Unit object by a dimension number represented as a string ', function(){
            var res = u1.frac('2px');
            expect(res.getValue()).toBe(6);
            expect(u.getMeasure()).not.toBeDefined();
        });

        it('throws an error when dividing two objects with different units', function(){
            expect(function(){
                return u4.frac(u1);
            }).toThrow(new Error('Can not divide these objects!'));
        });

        it('throws an error when dividing by zero', function(){
            expect(function(){
                return u4.frac(0);
            }).toThrow(new Error("Can not divide by zero!"));
        });

        it('throws an error when argument is missing', function(){
            expect(function(){
                return u4.frac();
            }).toThrow(new Error("Can not divide by nothing!"));
        });

        it('divides with requested precision', function(){
            var u6 = u2.frac(new Unit(3, 'px'), 3);
            expect(u6.getValue()).toBe(1.666);
            expect(u6.getMeasure()).not.toBeDefined();
        });
    });

    describe('Creates string represenation of the object', function(){
        it('returns empty string if the value is not given', function(){
            spyOn(u, 'getValue');
            expect(u.toString('---')).toBe('');
        });

        it('returns string representation of value if measure unit is not set and glue is not given', function(){
            spyOn(u, 'getValue').and.returnValue(82);
            spyOn(u, 'getMeasure');
            expect(u.toString()).toBe('82');
        });

        it('returns "0" if value is zero and measure unit is not set and glue is not given', function(){
            spyOn(u, 'getValue').and.returnValue(0);
            spyOn(u, 'getMeasure');
            expect(u.toString()).toBe('0');
        });

        it('returns "0" if value is zero and measure unit is not set and glue is given', function(){
            spyOn(u, 'getValue').and.returnValue(0);
            spyOn(u, 'getMeasure');
            expect(u.toString('---')).toBe('0');
        });


        it('returns string representation of value if measure unit is not set and glue is given', function(){
            spyOn(u, 'getValue').and.returnValue(23.1);
            spyOn(u, 'getMeasure');
            expect(u.toString('glue')).toBe('23.1');
        });

        it('returns string representation of value if measure unit is empty string and and glue is not given', function(){
            spyOn(u, 'getValue').and.returnValue(4);
            spyOn(u, 'getMeasure').and.returnValue('');
            expect(u.toString()).toBe('4');
        });

        it('returns string representation of value if measure unit is empty string and and glue is given', function(){
            spyOn(u, 'getValue').and.returnValue(4);
            spyOn(u, 'getMeasure').and.returnValue('');
            expect(u.toString('glue')).toBe('4');
        });

        it('returns concatenation of value and measure unit if glue is not given', function(){
            spyOn(u, 'getValue').and.returnValue(4);
            spyOn(u, 'getMeasure').and.returnValue('cm');
            expect(u.toString()).toBe('4cm');
        });

        it('returns concatenation of value and measure unit if glue is given', function(){
            spyOn(u, 'getValue').and.returnValue(43);
            spyOn(u, 'getMeasure').and.returnValue('bar');
            expect(u.toString('-')).toBe('43-bar');
        });

        it('returns concatenation of zero value and measure unit if glue is given', function(){
            spyOn(u, 'getValue').and.returnValue(0);
            spyOn(u, 'getMeasure').and.returnValue('bar');
            expect(u.toString('-')).toBe('0-bar');
        });

    });

    describe('Percentage representation', function(){
        it('throws exception if the target has dimension', function(){
            spyOn(u, 'hasMeasure').and.returnValue(true);
            expect(function(){
                return u.toPercent();
            }).toThrow(new Error('Only dimensionless numbers can be representred as percents!'));
        });

        it('converts zero into percent', function(){
            u.setValue(0);
            spyOn(u, 'hasMeasure').and.returnValue(false);
            var res = u.toPercent();
            expect(res.getValue()).toBe(0);
            expect(res.getMeasure()).toBe('%');
        });

        it('converts integer into percent', function(){
            u.setValue(3);
            spyOn(u, 'hasMeasure').and.returnValue(false);
            var res = u.toPercent();
            expect(res.getValue()).toBe(300);
            expect(res.getMeasure()).toBe('%');
        });

        it('converts float into percent', function(){
            u.setValue(0.1234567);
            spyOn(u, 'hasMeasure').and.returnValue(false);
            var res = u.toPercent();
            expect(res.getValue()).toBe(12.34567);
            expect(res.getMeasure()).toBe('%');
        });

        it('converts negative into percent', function(){
            u.setValue(-1.232);
            spyOn(u, 'hasMeasure').and.returnValue(false);
            var res = u.toPercent();
            expect(res.getValue()).toBe(-123.2);
            expect(res.getMeasure()).toBe('%');
        });

        it('does not add artificial zeros', function(){
            u.setValue(0.164);
            var res = u.toPercent();
            expect(res.getValue()).toBe(16.4);
        });
    });

    describe('Convert from % to a dimensionless number', function(){
        it('throws an exception if the target\'s measure is not %', function(){
            spyOn(u, 'getMeasure').and.returnValue("anything not equal to %");
            expect(function(){
                return u.fromPercent();
            }).toThrow(new Error('The target must be in percentage form!'));
        });
        it('returns 0 for 0%', function(){
            u.setValue(0);
            u.setMeasure('%');
            var res = u.fromPercent();
            expect(res.getValue()).toBe(0);
            expect(res.hasMeasure()).toBe(false);
        });
        it('returns 1 for 100%', function(){
            u.setValue(100);
            u.setMeasure('%');
            var res = u.fromPercent();
            expect(res.getValue()).toBe(1);
            expect(res.hasMeasure()).toBe(false);

        });
        it('returns 3.23 for 323%', function(){
            u.setValue(323);
            u.setMeasure('%');
            var res = u.fromPercent();
            expect(res.getValue()).toBe(3.23);
            expect(res.hasMeasure()).toBe(false);

        });
        it('returns 0.43287 for 43.287%', function(){
            u.setValue(43.287);
            u.setMeasure('%');
            var res = u.fromPercent();
            expect(res.getValue()).toBe(0.43287);
            expect(res.hasMeasure()).toBe(false);

        });
    });

});
