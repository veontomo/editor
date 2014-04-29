/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Attributes, Property */

describe('Attribute-related functionality', function(){
    var attr;
    beforeEach(function(){
        attr = new Attributes();
    });

    describe('Attributes::constructor(): inherits from Property', function(){
        it('is an instance of Properties', function(){
            expect(attr instanceof Properties).toBe(true);
        });
        it('sets "className" property to be equal to "Attributes"', function(){
            expect(attr.getName()).toBe('Attributes');
        });

        it('populates properties from the argument', function(){
            attr = new Attributes('a: 10; new: yes');
            expect(attr.getProperty('a')).toBe('10');
            expect(attr.getProperty('new')).toBe('yes');
        });
        it('populates properties from the argument', function(){
            attr = new Attributes({'a': 10, 'new': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(attr.getProperty('format')).toBe('A4');
            expect(attr.getProperty('a')).toBe(10);
            expect(attr.getProperty('new')).toBe('no');
            expect(attr.getProperty('update')).not.toBeDefined();
        });

        it('prevents accidental call without "new"', function(){
            var attr2 = Attributes();
            expect(attr2 instanceof Attributes).toBe(true);

        });
    });

    describe('Attributes::toString(): generates string representation', function(){
        it('if the attribute is empty, empty string is returned', function(){
            expect(attr.toString()).toBe('');
        });
        it('returns a string if the core has one string-string record', function(){
            attr.setProperty('width', 'large');
            expect(attr.toString()).toBe('width="large"');
        });

        it('returns a string if the core has one string-number record', function(){
            attr.setProperty('width', 102);
            expect(attr.toString()).toBe('width="102"');
        });
        it('returns a string if the core has one number-string record', function(){
            attr.setProperty(5, 'height');
            expect(attr.toString()).toBe('5="height"');
        });
        it('returns a string if the core has one number-number record', function(){
            attr.setProperty(1, 93);
            expect(attr.toString()).toBe('1="93"');
        });

        it('returns a string if the attributes has two properties', function(){
            attr.setProperty('width', 102);
            attr.setProperty('new', 'very');
            expect(attr.toString()).toBe('width="102" new="very"');
        });
    });

    describe('Attributes::load() load the attributes', function(){
        var root, attrMap;
        beforeEach(function(){
            root = document.createElement('span');
            root.setAttribute('class', 'footer');
            root.setAttribute('coverage', '74em');
            root.setAttribute('module', 2);
            root.setAttribute('style', 'color: green; margin: 32em;');
        });

        it('sets the attibutes', function(){
            attrMap = root.attributes;
            attr.load(attrMap);
            expect(attr.getProperty('coverage')).toBe('74em');
            expect(attr.getProperty('class')).toBe('footer');
            expect(attr.getProperty('module')).toBe('2');
        });

        it('ignores style property', function(){
            attrMap = root.attributes;
            attr.load(attrMap);
            expect(attr.hasOwnProperty('style')).toBe(false);
        });

        it('returns false if trying to override a function', function(){
            attrMap = root.attributes;
            attr.module = function(){};
            expect(attr.load(attrMap)).toBe(false);
        });
    });

    describe('Attributes::decorateElement(): sets the attributes on the element', function(){
        var el = {'setAttribute': function(){return null;}};
        beforeEach(function(){
            spyOn(el, 'setAttribute');
        });
        it('calls getCore() method to collect properties', function(){
            spyOn(attr, 'getCore').andCallFake(function(){return {};});
            attr.decorateElement(el);
            expect(attr.getCore).toHaveBeenCalled();
        });
        it('calls "setAttribute()" method to set each value obtained from "getCore()"', function(){
            spyOn(attr, 'getCore').andCallFake(function(){return {'level': 100, 'nice': 'very', 'depth': 'infinite'};});
            attr.decorateElement(el);
            expect(el.setAttribute).toHaveBeenCalledWith('level', 100);
            expect(el.setAttribute).toHaveBeenCalledWith('nice', 'very');
            expect(el.setAttribute).toHaveBeenCalledWith('depth', 'infinite');
        });
    });
});


