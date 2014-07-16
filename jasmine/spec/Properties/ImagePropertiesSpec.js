/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Attributes, Property */

describe('ImageProperties-related functionality', function(){
    var prop;
    beforeEach(function(){
        prop = new ImageProperties();
    });

    describe('construction of ImageProperties', function(){
        it('is an instance of Properties', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "ImageProperties"', function(){
            expect(prop.getName()).toBe('ImageProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = ImageProperties();
            expect(prop2 instanceof ImageProperties).toBe(true);

        });
    });

    describe('Sets image attribute keys', function(){
        it('contains key "src" set to empty string', function(){
            expect(prop.hasProperty('src')).toBe(true);
            expect(prop.getProperty('src')).toBe(null);
        });
        // 'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0
        it('contains key "width" set to 0', function(){
            expect(prop.hasProperty('width')).toBe(true);
            expect(prop.getProperty('width')).toBe(0);
        });

        it('contains key "height" set to 0', function(){
            expect(prop.hasProperty('height')).toBe(true);
            expect(prop.getProperty('height')).toBe(0);
        });

        it('contains key "title" set to empty string', function(){
            expect(prop.hasProperty('title')).toBe(true);
            expect(prop.getProperty('title')).toBe('');
        });
    });

    describe('Sets image attribute key "style"', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        // 'border-style': 'none', 'width': 0, 'padding': 0, 'margin': 0, 'height': 0

        it('has style attribute "border-style" set to "none"', function(){
            expect(prop.hasStyleProperty('border-style')).toBe(true);
            expect(prop.getStyleProperty('border-style')).toBe('none');
        });

        it('has style attribute "width" set to 0', function(){
            expect(prop.hasStyleProperty('width')).toBe(true);
            expect(prop.getStyleProperty('width')).toBe(0);
        });

        it('has style attribute "height" set to 0', function(){
            expect(prop.hasStyleProperty('height')).toBe(true);
            expect(prop.getStyleProperty('height')).toBe(0);
        });

        it('contains key "padding" set to 0', function(){
            expect(prop.hasStyleProperty('padding')).toBe(true);
            expect(prop.getStyleProperty('padding')).toBe(0);
        });

        it('contains key "margin set to 0', function(){
            expect(prop.hasStyleProperty('margin')).toBe(true);
            expect(prop.getStyleProperty('margin')).toBe(0);
        });

    });

});


