/*jslint plusplus: true, white: true */
/*global jasmine, describe, it, expect, beforeEach, spyOn, Quantity */
describe('Class Quantity', function () {
    describe('sets the value and measure' , function(){
        it('to 5.32 and null correspondigly if called with 5.32', function(){
            var q = new Quantity(5.32);
            expect(q.getValue()).toBe(5.32);
            expect(q.getMeasure()).toBe(null);
        });

        it('to 5.32 and null correspondigly if called with "5.32"', function(){
            var q = new Quantity('5.32');
            expect(q.getValue()).toBe(5.32);
            expect(q.getMeasure()).toBe(null);
        });
        it('to 22 and "em" correspondigly if called with "22em"', function(){
            var q = new Quantity('22em');
            expect(q.getValue()).toBe(22);
            expect(q.getMeasure()).toBe('em');
        });

        it('to 83 and "m" correspondigly if called with 83 and "m"', function(){
            var q = new Quantity(83, 'm');
            expect(q.getValue()).toBe(83);
            expect(q.getMeasure()).toBe("m");
        });

        it('to 6 and "%" correspondigly if called with "6" and "%"', function(){
            var q = new Quantity('6', '%');
            expect(q.getValue()).toBe(6);
            expect(q.getMeasure()).toBe("%");
        });

        it('to 4.32 and "cm" correspondigly if called with "4.32px" and "cm"', function(){
            var q = new Quantity('4.32px', 'cm');
            expect(q.getValue()).toBe(4.32);
            expect(q.getMeasure()).toBe("cm");
        });

        it('to null if the argument is a string that does not start with a number', function(){
            var q = new Quantity('a string');
            expect(q.getValue()).toBe(null);
            expect(q.getMeasure()).toBe(null);
        });

        it('to null if the second argument is not a string ', function(){
            var q = new Quantity(1, 1);
            expect(q.getValue()).toBe(null);
            expect(q.getMeasure()).toBe(null);
        });


    });

    describe('has method "setValue" that', function(){
        var q;
        beforeEach(function(){
            q = new Quantity();
        });
        it('sets value to 5 if the argument is 5', function(){
            q.setValue(5);
            expect(q.getValue()).toBe(5);
        });

        it('sets value to -2.89 if the argument is -2.89', function(){
            q.setValue(-2.89);
            expect(q.getValue()).toBe(-2.89);
        });

        it('sets value to null if the argument is a string "2"', function(){
            q.setValue('2');
            expect(q.getValue()).toBe(null);
        });

        it('sets value to null if the argument is an array', function(){
            q.setValue([1, 2, 3]);
            expect(q.getValue()).toBe(null);
        });
    });

    describe('has method "setMeasure" that', function(){
        var q;
        beforeEach(function(){
            q = new Quantity();
        });

        it('sets value to "cm" if the argument is "cm"', function(){
            q.setMeasure('cm');
            expect(q.getMeasure()).toBe('cm');
        });

        it('sets value to null if the argument is an empty string', function(){
            q.setMeasure('');
            expect(q.getMeasure()).toBe(null);
        });

        it('removes leading spaces', function(){
            q.setMeasure(' m');
            expect(q.getMeasure()).toBe('m');
        });

        it('removes ending spaces', function(){
            q.setMeasure('cm ');
            expect(q.getMeasure()).toBe('cm');
        });

        it('removes leading and ending spaces', function(){
            q.setMeasure('  cm ');
            expect(q.getMeasure()).toBe('cm');
        });

        it('sets value to null if the argument is an array', function(){
            q.setMeasure([1, 2, 3]);
            expect(q.getMeasure()).toBe(null);
        });

    });




});
