/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, RowProperties */

describe('RowProperties-related functionality', function(){
    var prop;
    beforeEach(function(){
        prop = new RowProperties();
    });

    describe('construction of RowProperties', function(){
        it('is an instance of Properties', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "RowProperties"', function(){
            expect(prop.getName()).toBe('RowProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = RowProperties();
            expect(prop2 instanceof RowProperties).toBe(true);

        });
    });

    describe('Sets link attribute key "style"', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        // {'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0, 'margin': 0}

        it('has style attribute "border-style" set to "none"', function(){
            expect(prop.hasStyleProperty('border-style')).toBe(true);
            expect(prop.getStyleProperty('border-style')).toBe('none');
        });

        it('contains keys "width", "max-width" and "min-width" set to 0', function(){
            expect(prop.hasStyleProperty('width')).toBe(true);
            expect(prop.getStyleProperty('width')).toBe(0);
            expect(prop.hasStyleProperty('max-width')).toBe(true);
            expect(prop.getStyleProperty('max-width')).toBe(0);
            expect(prop.hasStyleProperty('min-width')).toBe(true);
            expect(prop.getStyleProperty('min-width')).toBe(0);
        });


        it('contains key "padding" set to 0', function(){
            expect(prop.hasStyleProperty('padding')).toBe(true);
            expect(prop.getStyleProperty('padding')).toBe(0);
        });

        it('contains key "margin" set to 0', function(){
            expect(prop.hasStyleProperty('margin')).toBe(true);
            expect(prop.getStyleProperty('margin')).toBe(0);
        });

    });

});


