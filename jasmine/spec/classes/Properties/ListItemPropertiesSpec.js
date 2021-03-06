/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, ListItemProperties */

describe('Class ListItemProperties', function(){
    var prop;
    beforeEach(function(){
        prop = new ListItemProperties();
    });

    describe('has a constructor that', function(){
        it('returns an object that is an instance of Properties class', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "ListItemProperties"', function(){
            expect(prop.getName()).toBe('ListItemProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = ListItemProperties();
            expect(prop2 instanceof ListItemProperties).toBe(true);

        });
    });

    describe('has field "style" that', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        it('contains key "padding" set to 0', function(){
            expect(prop.hasStyleProperty('padding')).toBe(true);
            expect(prop.getStyleProperty('padding')).toBe(0);
        });

        it('contains key "margin" set to 0', function(){
            expect(prop.hasStyleProperty('margin')).toBe(true);
            expect(prop.getStyleProperty('margin')).toBe(0);
        });

        it('has style attribute "font-size" set to 12', function(){
            expect(prop.hasStyleProperty('font-weight')).toBe(true);
            expect(prop.getStyleProperty('font-size')).toBe(12);
        });

        it('has style attribute "font-weight" set to "normal"', function(){
            expect(prop.hasStyleProperty('font-weight')).toBe(true);
            expect(prop.getStyleProperty('font-weight')).toBe('normal');
        });

        it('contains key "color" set to "#000001"', function(){
            expect(prop.hasStyleProperty('color')).toBe(true);
            expect(prop.getStyleProperty('color')).toBe('#000001');
        });



    });

});


