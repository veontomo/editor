/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Styles, LinkStyles, Properties */

describe('Style-related functionality', function(){
    var stl;

    beforeEach(function(){
        stl = new Styles();
    });

    describe('Style::constructor(): inherits from Properties', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = Styles();
            expect(style2 instanceof Styles).toBe(true);
        });

        it('is an instance of Properties', function(){
            expect(stl instanceof Properties).toBe(true);
        });

        it('sets "className" Properties to be equal to "Attributes"', function(){
            expect(stl.getName()).toBe('Styles');
        });

        it('populates properties from the argument', function(){
            stl = new Styles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties from the argument', function(){
            stl = new Styles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
    });

    describe('Style::toString(): generates string representation', function(){
        it('if the core is empty, empty string is returned', function(){
            spyOn(stl, 'getCore').andCallFake(function(){return {};});
            expect(stl.toString()).toBe('');
        });
        it('if the core has just one record, a string is returned', function(){
            spyOn(stl, 'getCore').andCallFake(function(){return {'mode': 'off'};});
            expect(stl.toString()).toBe('mode: off');
        });
        it('if the core has two records, a semi-column separated string is returned', function(){
            spyOn(stl, 'getCore').andCallFake(function(){return {width: 'full', 'title': 'Spec'};});
            expect(stl.toString()).toBe('width: full; title: Spec');
        });
        it('if the core has number-valued record, the default unit measure is appended to that number', function(){
            spyOn(stl, 'getCore').andCallFake(function(){return {width: 439};});
            expect(stl.toString()).toBe('width: 439px');
        });
        it('if the core has number-valued record, that number is augmented by the argument', function(){
            spyOn(stl, 'getCore').andCallFake(function(){return {'mass': 439};});
            expect(stl.toString('kg')).toBe('mass: 439kg');
        });


    });

    describe('Style::getBorderInfo(): returns the border info ', function(){
        beforeEach(function(){
            stl = new Styles();
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
            stl.setProperty('width', 98);
            stl.setProperty('max-width', 'another dumb value');
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
            var seed = {getNamedItem: function(){return null;}};
            spyOn(seed, 'getNamedItem').andCallFake(function(){return {value: 'a string'};});
            spyOn(stl, 'appendStyle');
            stl.load(seed);
            expect(seed.getNamedItem).toHaveBeenCalledWith('style');
            expect(stl.appendStyle).toHaveBeenCalledWith('a string');
        });

        it('returns true if the argument is an object with getNamedItem() method', function(){
            var seed = {getNamedItem: function(){return null;}};
            spyOn(seed, 'getNamedItem').andCallFake(function(){return 'a string';});
            expect(stl.load(seed)).toBe(true);
            expect(seed.getNamedItem).toHaveBeenCalledWith('style');
        });

        it('sets the styles if given as NamedNodeMap', function(){
            var root = document.createElement('span');
            root.setAttribute('style', 'color: green; margin: 32em;');
            stl.load(root.attributes);
            expect(stl.getProperty('color')).toBe('green');
            expect(stl.getProperty('margin')).toBe('32em');
        });
        it('sets the styles, but not attributes if given as NamedNodeMap', function(){
            var root = document.createElement('span');
            root.setAttribute('style', 'color: blue; margin: 1px;');
            root.setAttribute('color', 'red');
            root.setAttribute('margin', '3px');
            stl.load(root.attributes);
            expect(stl.getProperty('color')).toBe('blue');
            expect(stl.getProperty('margin')).toBe('1px');
        });

        it('sets the styles, if given as a string', function(){
            stl.load('module: top; level: 2em;');
            expect(stl.getProperty('module')).toBe('top');
            expect(stl.getProperty('level')).toBe('2em');
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

