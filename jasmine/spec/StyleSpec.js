/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Style, LinkStyle, Properties */

describe('Style-related functionality', function(){
    var stl;

    beforeEach(function(){
        stl = new Style();
    });

    describe('Style::constructor(): inherits from Properties', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = Style();
            expect(style2 instanceof Style).toBe(true);
        });

        it('is an instance of Properties', function(){
            expect(stl instanceof Properties).toBe(true);
        });

        it('sets "className" Properties to be equal to "Attributes"', function(){
            expect(stl.className).toBe('Style');
        });

        it('populates properties from the argument', function(){
            stl = new Style('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties from the argument', function(){
            stl = new Style({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
    });

    describe('Style::toString(): generates string representation', function(){
        it('if the object is empty, empty string is returned', function(){
            expect(stl.toString()).toBe('');
        });
        it('if the object has only a method, empty string is returned', function(){
            stl.fun = function(foo){return foo;};
            expect(stl.toString()).toBe('');
        });
        it('if the object has 2 properties, a string is returned', function(){
            stl.width = 439;
            stl.title = 'Spec';
            expect(stl.toString()).toBe('width: 439px; title: Spec');
        });

        it('if the attributes has 2 properties and a method, a string is returned', function(){
            stl.width = 20;
            stl['last-author'] = 'A.M.R';
            stl.update = function(foo){return foo;};
            expect(stl.toString()).toBe('width: 20px; last-author: A.M.R');
        });
    });

    describe('Style::getBorderInfo(): returns the border info ', function(){
        beforeEach(function(){
            stl = new Style();
        });

        it('style is "none", if it is not present in Style', function(){
            stl.dropProperty('border-style');
            expect(stl.getBorderInfo().style).toBe('none');
        });
        it('style is equal to value of border-style Properties in Style', function(){
            stl.setProperty('border-style', 'nice style');
            expect(stl.getBorderInfo().style).toBe('nice style');
        });
        it('width is 0, if border-width is not present in Style', function(){
            stl.dropProperty('border-width');
            expect(stl.getBorderInfo().width).toBe(0);
        });
        it('width is equal to value of border-width in Style', function(){
            stl.setProperty('border-width', 102);
            expect(stl.getBorderInfo().width).toBe(102);
        });
        it('color missing if it is missing in Style', function(){
            stl.dropProperty('border-color');
            expect(stl.getBorderInfo().hasOwnProperty('color')).toBe(false);
        });

        it('color is equal to value of border-color in Style', function(){
            stl.setProperty('border-color', 'nice color');
            expect(stl.getBorderInfo().color).toBe('nice color');
        });
    });

    describe('Style::appendStyle(): appends style', function(){
        it('calls parent method Propery::appendProperty()', function(){
            spyOn(stl, 'appendProperty').andCallFake(function(){return null;});
            stl.appendStyle('styles to append');
            expect(stl.appendProperty).toHaveBeenCalledWith('styles to append');
        });
    });

    describe('Style::setWidth(): sets width, min-width, max-width', function(){
        it('sets width as a number, if the width was not defined before', function(){
            stl.dropProperty('width');
            stl.dropProperty('min-width');
            stl.dropProperty('max-width');
            stl.setWidth(97);
            expect(stl.getProperty('width')).toBe(97);
            expect(stl.getProperty('max-width')).toBe(97);
            expect(stl.getProperty('min-width')).toBe(97);
        });
        it('sets width as a string, if the width was not defined before', function(){
            stl.dropProperty('width');
            stl.dropProperty('min-width');
            stl.dropProperty('max-width');
            stl.setWidth('20px');
            expect(stl.getProperty('width')).toBe('20px');
            expect(stl.getProperty('max-width')).toBe('20px');
            expect(stl.getProperty('min-width')).toBe('20px');
        });
        it('overrides width as a number, if the width was defined before', function(){
            stl.setProperty('width', 'dumb value');
            stl.setProperty('max-width', 1029239.221);
            stl.setWidth(97);
            expect(stl.getProperty('width')).toBe(97);
            expect(stl.getProperty('min-width')).toBe(97);
            expect(stl.getProperty('max-width')).toBe(97);
        });
        it('overrides width as a string, if the width was defined before', function(){
            stl.width = 98;
            stl['max-width'] = 'another dumb value';
            stl.setWidth('20px');
            expect(stl.getProperty('width')).toBe('20px');
            expect(stl.getProperty('min-width')).toBe('20px');
            expect(stl.getProperty('max-width')).toBe('20px');
        });
    });

    describe('Style::load(): loads the style', function(){
        it('returns true, if the argument is empty', function(){
            expect(stl.load()).toBe(true);
        });

        it('returns false if the argument is not a string or an object without "getNamedItem()" method', function(){
            var probes = [0, 3.22, -4, [], ["a", "b", 2], {}, {foo: 1}, {getNamedItem: 2}];
            probes.forEach(function(el){
                expect(stl.load(el)).toBe(false);
            });
        });

        it('calls appendStyle method if the argument is a string', function(){
            spyOn(stl, 'appendStyle');
            stl.load('a string');
            expect(stl.appendStyle).toHaveBeenCalledWith('a string');
        });

        it('returns true if the argument is a string', function(){
            expect(stl.load('a string')).toBe(true);
        });

        it('calls appendStyle method if the argument is an object with getNamedItem() method', function(){
            var seed = {getNamedItem: function(){}};
            spyOn(seed, 'getNamedItem').andCallFake(function(){return {value: 'a string'};});
            spyOn(stl, 'appendStyle');
            stl.load(seed);
            expect(seed.getNamedItem).toHaveBeenCalledWith('style');
            expect(stl.appendStyle).toHaveBeenCalledWith('a string');
        });

        it('returns true if the argument is an object with getNamedItem() method', function(){
            var seed = {getNamedItem: function(){}};
            spyOn(seed, 'getNamedItem').andCallFake(function(){return 'a string';});
            expect(stl.load(seed)).toBe(true);
            expect(seed.getNamedItem).toHaveBeenCalledWith('style');
        });
    });

    describe('Style::decorateElement(): applies the style to the argument', function(){
        var elem = {'setAttribute': function(){return null;}};
        beforeEach(function(){
            spyOn(elem, 'setAttribute');
            spyOn(stl, 'toString').andCallFake(function(){return 'style to string output';});
        });
        it('calls "toString()" method', function(){
            stl.decorateElement(elem);
            expect(stl.toString).toHaveBeenCalled();
        });
        it('applies the output of "toString()" method to the argument', function(){
            stl.decorateElement(elem);
            expect(elem.setAttribute).toHaveBeenCalledWith('style', 'style to string output');
        });

    });

});

describe('LinkStyle-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new LinkStyle();
    });

    describe('LinkStyle::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = LinkStyle();
            expect(style2 instanceof LinkStyle).toBe(true);
        });

        it('inherits from Style', function(){
            expect(stl instanceof Style).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new LinkStyle('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new LinkStyle({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new LinkStyle()).getProperty('text-decoration')).toBe('underline');
            stl = new LinkStyle('text-decoration: none');
            expect(stl.getProperty('text-decoration')).toBe('none');
        });

    });
});


