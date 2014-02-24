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

    describe('LinkAttributes::setUrl(): sets url', function(){
        it('sets url if it is string without spaces', function(){
            attr.setUrl('http://www.two.com/again.html');
            expect(attr.url).toBe('http://www.two.com/again.html');
        });
        it('replaces spaces in url by %20', function(){
            attr.setUrl('http://three.c om');
            expect(attr.url).toBe('http://three.c%20om');
        });
        it('sets url if it contains & and ?', function(){
            attr.setUrl('http://www.three.com/level?size=20&user=Mario');
            expect(attr.url).toBe('http://www.three.com/level?size=20&user=Mario');
        });

        it('sets url if it contains anchor', function(){
            attr.setUrl('www.four.com/level#size');
            expect(attr.url).toBe('www.four.com/level#size');
        });
    });

    describe('LinkAttributes::getUrl(): gets url', function(){
        it('returns undefined if url is not set', function(){
            attr.url = 'whatever';
            expect(attr.getUrl()).toBe('whatever');
        });
    });

});