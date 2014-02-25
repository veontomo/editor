/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, LinkAttributes, Attributes */

describe('LinkAttributes-related functionality:', function() {
    var attr;
    beforeEach(function() {
        attr = new LinkAttributes();
        if (attr.hasOwnProperty('dumb')){
            delete attr.dumb;
        }
    });

    describe('LinkAttributes::constuctor() inherits from Attributes', function(){
        it('is an instance of Attributes() as well ', function(){
            expect(attr instanceof Attributes).toBe(true);
        });

        it('adds keyword "new" if it is missing when an object is created', function(){
            attr = LinkAttributes();
            expect(attr instanceof LinkAttributes).toBe(true);
        });

        it('does not affect parent attr if it is changed in the child', function(){
            expect((new LinkAttributes()).dumb).not.toBe('dumb value');
            attr.dumb = 'dumb value';
            expect((new LinkAttributes()).dumb).not.toBe('dumb value');
            expect(attr.dumb).toBe('dumb value');
        });
    });

    describe('LinkAttributes::setHref(): sets href', function(){
        it('sets href if it is string without spaces', function(){
            attr.setHref('http://www.two.com/again.html');
            expect(attr.href).toBe('http://www.two.com/again.html');
        });
        it('replaces spaces in href by %20', function(){
            attr.setHref('http://three.c om');
            expect(attr.href).toBe('http://three.c%20om');
        });
        it('sets href if it contains & and ?', function(){
            attr.setHref('http://www.three.com/level?size=20&user=Mario');
            expect(attr.href).toBe('http://www.three.com/level?size=20&user=Mario');
        });

        it('sets href if it contains anchor', function(){
            attr.setHref('www.four.com/level#size');
            expect(attr.href).toBe('www.four.com/level#size');
        });
    });

    describe('LinkAttributes::getHref(): gets href', function(){
        it('returns undefined if href is not set', function(){
            attr.href = 'whatever';
            expect(attr.getHref()).toBe('whatever');
        });
    });

});