/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, CellProperties */

describe('CellProperties-related functionality', function(){
    var prop;
    beforeEach(function(){
        prop = new CellProperties();
    });

    describe('construction of CellProperties', function(){
        it('is an instance of Properties', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "CellProperties"', function(){
            expect(prop.getName()).toBe('CellProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = CellProperties();
            expect(prop2 instanceof CellProperties).toBe(true);

        });
    });

    describe('Sets link attribute key "style"', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        // {'border-style': 'none', 'width': 0, 'max-width': 0, 'min-width': 0, 'padding': 0,
        //  'margin': 0, 'vertical-align': 'top', 'color': '#000001', 'text-align': 'justify'};

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

        it('contains key "margin set to 0', function(){
            expect(prop.hasStyleProperty('margin')).toBe(true);
            expect(prop.getStyleProperty('margin')).toBe(0);
        });

        it('has style attribute "vertical-align" set to "top"', function(){
            expect(prop.hasStyleProperty('vertical-align')).toBe(true);
            expect(prop.getStyleProperty('vertical-align')).toBe('top');
        });

        it('has style attribute "color" set to "#000001"', function(){
            expect(prop.hasStyleProperty('color')).toBe(true);
            expect(prop.getStyleProperty('color')).toBe('#000001');
        });

        it('has style attribute "text-align" set to "justify"', function(){
            expect(prop.hasStyleProperty('text-align')).toBe(true);
            expect(prop.getStyleProperty('text-align')).toBe('justify');
        });



    });

});


