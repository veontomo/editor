/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, TableProperties */

describe('TableProperties-related functionality', function(){
    var prop;
    beforeEach(function(){
        prop = new TableProperties();
    });

    describe('construction of TableProperties', function(){
        it('is an instance of Properties', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "TableProperties"', function(){
            expect(prop.getName()).toBe('TableProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = TableProperties();
            expect(prop2 instanceof TableProperties).toBe(true);

        });
    });

    describe('Sets table attribute keys', function(){
        // {'cellpadding': 0, 'cellspacing': 0}
        it('contains key "cellpadding" set to "_blank"', function(){
            expect(prop.hasProperty('cellpadding')).toBe(true);
            expect(prop.getProperty('cellpadding')).toBe(0);
        });

        it('contains key "cellspacing" set to empty string', function(){
            expect(prop.hasProperty('cellspacing')).toBe(true);
            expect(prop.getProperty('cellspacing')).toBe(0);
        });
    });

    describe('Sets table attribute key "style"', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        // {'border-style': 'none', 'padding': 0, 'margin': 0, 'width': 0, 'max-width': 0, 'min-width': 0, 'border-spacing': '0px 0px', 'font-size': 13, 'text-align': 'justify', 'font-family': 'Arial, sans-serif'};

        it('has style attribute "border-style" set to "underline"', function(){
            expect(prop.hasStyleProperty('border-style')).toBe(true);
            expect(prop.getStyleProperty('border-style')).toBe('none');
        });

        it('has style attribute "font-family" set', function(){
            expect(prop.hasStyleProperty('font-family')).toBe(true);
            expect(prop.getStyleProperty('font-family')).toBe('Arial, sans-serif');
        });

        it('has style attribute "font-size" set to 13', function(){
            expect(prop.hasStyleProperty('font-size')).toBe(true);
            expect(prop.getStyleProperty('font-size')).toBe(13);
        });

        it('has style attribute "text-align" set to "justify', function(){
            expect(prop.hasStyleProperty('text-align')).toBe(true);
            expect(prop.getStyleProperty('text-align')).toBe('justify');
        });


        it('contains keys "width" set to 0', function(){
            expect(prop.hasStyleProperty('width')).toBe(true);
            expect(prop.getStyleProperty('width')).toBe(0);
        });

        it('contains key "padding" set to 0', function(){
            expect(prop.hasStyleProperty('padding')).toBe(true);
            expect(prop.getStyleProperty('padding')).toBe(0);
        });

        it('contains key "margin" set to 0', function(){
            expect(prop.hasStyleProperty('margin')).toBe(true);
            expect(prop.getStyleProperty('margin')).toBe(0);
        });

        it('contains key "border-spacing" set to "0px 0px"', function(){
            expect(prop.hasStyleProperty('border-spacing')).toBe(true);
            expect(prop.getStyleProperty('border-spacing')).toBe("0px 0px");
        });

    });

});


