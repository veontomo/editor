/*jslint plusplus: true, white: true */
/*global describe, describe, it, expect, beforeEach, OList, List*/

describe('OList-related functionality:', function(){
    var ol;
    beforeEach(function(){
        ol = new OList();
    });

    describe('OList::constructor(): inherits from List() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            ol.bla = 102;
            expect((new OList()).bla).not.toBe(102);
        });
        it('OList is an instance of OList class', function(){
            expect(ol instanceof OList).toBe(true);
        });
        it('OList is an instance of List class', function(){
            expect(ol instanceof List).toBe(true);
        });
        it('adds keyword "new" if it is missing when an object is created', function(){
            var ol2 = OList();
            expect(ol2 instanceof OList).toBe(true);
        });
    });

    describe('OList::className: class name', function(){
        it('gives the name of the class', function(){
            expect(ol.getName()).toBe('OList');
        });
    });


    describe('OList::name: tag name', function(){
        it('A OList object name is set to "ol"', function(){
            expect(ol.getTag()).toBe('ol');
        });
    });



});

