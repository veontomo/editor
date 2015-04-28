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


    });



});
