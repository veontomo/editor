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

        it('sets url if it is string without spaces', function(){
            link = new Link('http://www.two.com/again.html');
            expect(link.attr.url).toBe('http://www.two.com/again.html');
        });
        it('replaces spaces in url by %20', function(){
            link = new Link('http://three.c om');
            expect(link.attr.url).toBe('http://three.c%20om');
        });
        it('sets url if it contains & and ?', function(){
            link = new Link('http://www.three.com/level?size=20&user=Mario');
            expect(link.attr.url).toBe('http://www.three.com/level?size=20&user=Mario');
        });

        it('sets url if it contains anchor', function(){
            link = new Link('www.four.com/level#size');
            expect(link.attr.url).toBe('www.four.com/level#size');
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


    describe('Link::getUrl(): url getter', function(){
        it('calls LinkAttributes.getUrl() method', function(){
            spyOn(attr, 'getUrl').andCallFake(function(){return 'url';});
            link.attr = attr;
            expect(link.getUrl()).toBe('url');
            expect(attr.getUrl).toHaveBeenCalled();
        });
    });

    describe('Link::setUrl(): url setter', function(){
        it('calls LinkAttributes.setUrl() method', function(){
            spyOn(attr, 'setUrl').andCallFake(function(){return '';});
            link.attr = attr;
            link.setUrl('url string');
            expect(attr.setUrl).toHaveBeenCalledWith('url string');
        });
    });
});