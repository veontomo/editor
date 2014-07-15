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
            expect(u.value).toEqual(1);
            expect(u.measure).toEqual('cm');
        });
        it('when value is a float, measure is a string', function () {
            u = new Unit(29.50206, 'l');
            expect(u.value).toEqual(29.50206);
            expect(u.measure).toEqual('l');
        });
        it('when value is a float, measure is missing', function () {
            u = new Unit(2.5);
            expect(u.value).toEqual(2.5);
            expect(u.measure).toEqual('');
        });
        it('when value is an integer, measure is an empty string', function () {
            u = new Unit(73, '');
            expect(u.value).toEqual(73);
            expect(u.measure).toEqual('');
        });
        it('when value is an integer, measure is a string with spaces at the end', function () {
            u = new Unit(12, 'cm ');
            expect(u.value).toEqual(12);
            expect(u.measure).toEqual('cm');
        });
        it('when value is a float, measure is a string with spaces at the beginning', function () {
            u = new Unit(23.98, ' cm');
            expect(u.value).toEqual(23.98);
            expect(u.measure).toEqual('cm');
        });
        it('when both value and measure are missing', function () {
            u = new Unit();
            expect(u.value).toEqual(0);
            expect(u.measure).toEqual('');
        });
        it('when value is a string with unit of measurement, measure is missing', function () {
            u = new Unit('345lk');
            expect(u.value).toEqual(345);
            expect(u.measure).toEqual('lk');
        });
        it('when value is a string with unit of measurement, measure is missing', function () {
            u = new Unit('0.76 cm');
            expect(u.value).toEqual(0.76);
            expect(u.measure).toEqual('cm');
        });
        it('when value is an empty string, measure is missing', function () {
            u = new Unit('');
            expect(u.value).toEqual(0);
            expect(u.measure).toEqual('');
        });
        it('throws an error if the measurement is a number', function(){
            expect(function(){
                u = new Unit(1, 8);
            }).toThrow('The unit of measurement must be a string!');
        });
        it('throws an error if the measurement is a function', function(){
            expect(function(){
                u = new Unit(1, function(x){return x;});
            }).toThrow('The unit of measurement must be a string!');
        });
        it('throws an error if the measurement is an object', function(){
            expect(function(){
                u = new Unit(1, {});
            }).toThrow('The unit of measurement must be a string!');
        });
        it('throws an error if the measurement is an array', function(){
            expect(function(){
                u = new Unit(1, [1, 'two', 3, {4: 5}]);
            }).toThrow('The unit of measurement must be a string!');
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
        it('calls to Unit()::isLikeAs() before summing', function(){
            spyOn(u, 'isLikeAs').andCallFake(function(){return 'anything';});
            u.add(stub);
            expect(u.isLikeAs).toHaveBeenCalledWith(stub);
        });
        it('throws an error if Unit::isLikeAs() gives false', function(){
            spyOn(u, 'isLikeAs').andCallFake(function(){return false;});
            expect(function(){
                u.add('anything');
            }).toThrow('These Unit instances can not be summed up!');
            expect(u.isLikeAs).toHaveBeenCalledWith('anything');
        });
        it('gives the correct sum, if isLikeAs() returns true', function(){
            u = new Unit(23, 'cm');
            var u2 = new Unit(10, 'cm');
            spyOn(u, 'isLikeAs').andCallFake(function(){return true;});
            var sum = u.add(u2);
            expect(sum.value).toBe(33);
            expect(sum.measure).toBe('cm');
            expect(u.isLikeAs).toHaveBeenCalledWith(u2);
        });
    });
    describe('Unit::sub(): subtracts two Unit objects', function(){
        it('calls Unit::add() method', function(){
            spyOn(u, 'add').andCallFake(function(){return 'the result';});
            u.sub(stub);
            expect(u.add).toHaveBeenCalled();
        });
    });

    describe('Creates string represenation of the object', function(){
        it('returns empty string if the value is not given', function(){
            spyOn(u, 'getValue');
            expect(u.toString('---')).toBe('');
        });

        it('returns string representation of value if measure unit is not set and glue is not given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 82;});
            spyOn(u, 'getMeasure');
            expect(u.toString()).toBe('82');
        });

        it('returns "0" if value is zero and measure unit is not set and glue is not given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 0;});
            spyOn(u, 'getMeasure');
            expect(u.toString()).toBe('0');
        });

        it('returns "0" if value is zero and measure unit is not set and glue is given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 0;});
            spyOn(u, 'getMeasure');
            expect(u.toString('---')).toBe('0');
        });


        it('returns string representation of value if measure unit is not set and glue is given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 23.1;});
            spyOn(u, 'getMeasure');
            expect(u.toString('glue')).toBe('23.1');
        });

        it('returns string representation of value if measure unit is empty string and and glue is not given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 4;});
            spyOn(u, 'getMeasure').andCallFake(function(){return '';});
            expect(u.toString()).toBe('4');
        });

        it('returns string representation of value if measure unit is empty string and and glue is given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 4;});
            spyOn(u, 'getMeasure').andCallFake(function(){return '';});
            expect(u.toString('glue')).toBe('4');
        });

        it('returns concatenation of value and measure unit if glue is not given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 4;});
            spyOn(u, 'getMeasure').andCallFake(function(){return 'cm';});
            expect(u.toString()).toBe('4cm');
        });

        it('returns concatenation of value and measure unit if glue is given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 43;});
            spyOn(u, 'getMeasure').andCallFake(function(){return 'bar';});
            expect(u.toString('-')).toBe('43-bar');
        });

        it('returns concatenation of zero value and measure unit if glue is given', function(){
            spyOn(u, 'getValue').andCallFake(function(){return 0;});
            spyOn(u, 'getMeasure').andCallFake(function(){return 'bar';});
            expect(u.toString('-')).toBe('0-bar');
        });

    });

});
