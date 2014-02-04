/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, List, Attributes, Style, jasmine*/

describe('List-related functionality:', function(){

    describe('Basic properties:', function(){
        it('List object contains nesessary attributes', function(){
            var l = new List();
            expect(l.hasOwnProperty('type')).toBe(true);
            expect(l.type === 'ol' || l.type === 'ul').toBe(true);
            expect(l.hasOwnProperty('getType')).toBe(true);
            expect(typeof l.getType).toBe('function');
            expect(l.hasOwnProperty('attr')).toBe(true);
            expect(l.hasOwnProperty('style')).toBe(true);
            expect(l.hasOwnProperty('items')).toBe(true);
            expect(typeof l.items).toBe('array');
        });
    });


});
