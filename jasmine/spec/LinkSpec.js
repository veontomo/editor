/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, Link, LinkStyle, LinkAttributes, Content, Table */

describe('Link-related functionality:', function() {
    var link, attr;
    beforeEach(function() {
        attr = new LinkAttributes();
        link = new Link();
        delete link.dumbAttribute;
    });

    describe('Link::constuctor() inherits from Tag', function(){
        it('is an instance of Tag() as well ', function(){
            expect(link instanceof Link).toBe(true);
        });

        it('adds keyword "new" if it is missing when an object is created', function(){
            var link2 = Link();
            expect(link2 instanceof Link).toBe(true);
        });

        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Link()).dumbAttribute).not.toBe('www.one.com');
            link.dumbAttribute = 'www.one.com';
            expect((new Link()).dumbAttribute).not.toBe('www.one.com');
            expect(link.dumbAttribute).toBe('www.one.com');
        });

        it('sets href if it is string without spaces', function(){
            link = new Link('http://www.two.com/again.html');
            expect(link.attr.href).toBe('http://www.two.com/again.html');
        });
        it('replaces spaces in href by %20', function(){
            link = new Link('http://three.c om');
            expect(link.attr.href).toBe('http://three.c%20om');
        });
        it('sets href if it contains & and ?', function(){
            link = new Link('http://www.three.com/level?size=20&user=Mario');
            expect(link.attr.href).toBe('http://www.three.com/level?size=20&user=Mario');
        });

        it('sets href if it contains anchor', function(){
            link = new Link('www.four.com/level#size');
            expect(link.attr.href).toBe('www.four.com/level#size');
        });
    });

    describe('Link::attr is an instance of LinkAttr', function(){
        it('has attr property which is a LinkAttr instance', function(){
            expect(link.attr instanceof LinkAttributes).toBe(true);
        });
    });

    describe('Link::style is an instance of LinkStyle', function(){
        it('has style property which is a LinkStyle instance', function(){
            expect(link.style instanceof LinkStyle).toBe(true);
        });
    });


    describe('Link::getHref(): href getter', function(){
        it('calls LinkAttributes.getHref() method', function(){
            spyOn(attr, 'getHref').andCallFake(function(){return 'href';});
            link.attr = attr;
            expect(link.getHref()).toBe('href');
            expect(attr.getHref).toHaveBeenCalled();
        });
    });

    describe('Link::setHref(): href setter', function(){
        it('calls LinkAttributes.setHref() method', function(){
            spyOn(attr, 'setHref').andCallFake(function(){return '';});
            link.attr = attr;
            link.setHref('href string');
            expect(attr.setHref).toHaveBeenCalledWith('href string');
        });
    });
});