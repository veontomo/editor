/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, LinkAttributes, Attributes */

describe('TableAttributes-related functionality:', function() {
    var attr;
    beforeEach(function() {
        attr = new TableAttributes();
    });

    describe('TableAttributes::constuctor() inherits from Attributes', function(){
        it('is an instance of Attributes() as well ', function(){
            expect(attr instanceof Attributes).toBe(true);
        });
        it('sets "className" property to be equal to "TableAttributes"', function(){
            expect(attr.className).toBe('TableAttributes');
        });
        it('adds keyword "new" if it is missing when an object is created', function(){
            attr = TableAttributes();
            expect(attr instanceof TableAttributes).toBe(true);
        });

    });
});