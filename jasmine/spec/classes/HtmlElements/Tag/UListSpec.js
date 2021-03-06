/*jslint plusplus: true, white: true */
/*global describe, describe, it, expect, beforeEach, UList, List*/

describe('UList-related functionality:', function(){
    var ul;
    beforeEach(function(){
        ul = new UList();
    });

    describe('UList::constructor(): inherits from List() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            ul.boo = 102;
            expect((new UList()).boo).not.toBe(102);
        });
        it('UList is an instance of UList class', function(){
            expect(ul instanceof UList).toBe(true);
        });
        it('UList is an instance of List class', function(){
            expect(ul instanceof List).toBe(true);
        });
        it('adds keyword "new" if it is missing when an object is created', function(){
            var ul2 = UList();
            expect(ul2 instanceof UList).toBe(true);
        });
    });

    describe('UList::className: class name', function(){
        it('gives the name of the class', function(){
            expect(ul.getName()).toBe('UList');
        });
    });

    describe('UList::tag: tag name', function(){
        it('A UList object name is set to "ul"', function(){
            expect(ul.getTag()).toBe('ul');
        });
    });
});

