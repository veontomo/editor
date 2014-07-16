/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties, LinkProperties */

describe('LinkProperties-related functionality', function(){
    var prop;
    beforeEach(function(){
        prop = new LinkProperties();
    });

    describe('construction of LinkProperties', function(){
        it('is an instance of Properties', function(){
            expect(prop instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "LinkProperties"', function(){
            expect(prop.getName()).toBe('LinkProperties');
        });

        it('prevents accidental call without "new"', function(){
            var prop2 = LinkProperties();
            expect(prop2 instanceof LinkProperties).toBe(true);

        });
    });

    describe('Sets link attribute keys', function(){
        //  {'href': '', 'target': '_blank', 'title': ''}
        it('contains key "href" set to empty string', function(){
            expect(prop.hasProperty('href')).toBe(true);
        });
        it('contains key "target" set to "_blank"', function(){
            expect(prop.hasProperty('target')).toBe(true);
            expect(prop.getProperty('target')).toBe("_blank");
        });

        it('contains key "title" set to empty string', function(){
            expect(prop.hasProperty('title')).toBe(true);
            expect(prop.getProperty('title')).toBe('');
        });
    });

    describe('Sets link attribute key "style"', function(){
        it('is an instance of Properties', function(){
            expect(prop.getStyles() instanceof Properties).toBe(true);
        });

        // {'text-decoration': 'underline', 'font-weight': 'normal', 'padding': 0, 'margin': 0};

        it('has style attribute "text-decoration" set to "underline"', function(){
            expect(prop.hasStyleProperty('text-decoration')).toBe(true);
            expect(prop.getStyleProperty('text-decoration')).toBe('underline');
        });

        it('has style attribute "font-weight" set to "normal"', function(){
            expect(prop.hasStyleProperty('font-weight')).toBe(true);
            expect(prop.getStyleProperty('font-weight')).toBe('normal');
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


