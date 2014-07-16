/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, ListProperties */

describe('ListProperties-related functionality', function(){
    var prop;
    beforeEach(function(){
        prop = new ListProperties();
    });

    describe('construction of ListProperties', function(){
        it('is an instance of Properties', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "ListProperties"', function(){
            expect(prop.getName()).toBe('ListProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = ListProperties();
            expect(prop2 instanceof ListProperties).toBe(true);

        });
    });

    describe('Sets list styles', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        // {'padding': 0, 'margin-left': 40, 'margin-right': 0, 'margin-top': 0, 'margin-bottom': 0

        it('contains key "padding" set to 0', function(){
            expect(prop.hasStyleProperty('padding')).toBe(true);
            expect(prop.getStyleProperty('padding')).toBe(0);
        });

        it('contains keys "margin-top", "margin-bottom", "margin-right", "margin-left" set to 0', function(){
            expect(prop.hasStyleProperty('margin-bottom')).toBe(true);
            expect(prop.getStyleProperty('margin-bottom')).toBe(0);
            expect(prop.hasStyleProperty('margin-top')).toBe(true);
            expect(prop.getStyleProperty('margin-top')).toBe(0);
            expect(prop.hasStyleProperty('margin-left')).toBe(true);
            expect(prop.getStyleProperty('margin-left')).toBe(40);
            expect(prop.hasStyleProperty('margin-right')).toBe(true);
            expect(prop.getStyleProperty('margin-right')).toBe(0);

        });
    });

});


