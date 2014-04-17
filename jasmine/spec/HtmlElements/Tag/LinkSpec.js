/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, Link, LinkStyles, LinkAttributes, Content, Table, Factory, Registry */

describe('Link-related functionality:', function() {
    var link, attr, style, content;
    beforeEach(function() {
        attr = new LinkAttributes();
        style = new LinkStyles();
        link = new Link();
        content = new Content();
        delete link.dumbAttribute;
    });


    describe('Link::className: class name', function(){
        it('gives the name of the class', function(){
            expect(link.className).toBe('Link');
        });
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
            expect(link.attr.getHref()).toBe('http://www.two.com/again.html');
        });
        it('replaces spaces in href', function(){
            link = new Link('http://three.c om');
            expect(link.attr.getHref().indexOf(' ')).toBe(-1);
        });
        it('sets href if it contains & and ?', function(){
            link = new Link('http://www.three.com/level?size=20&user=Mario');
            expect(link.attr.getHref()).toBe('http://www.three.com/level?size=20&user=Mario');
        });

        it('sets href if it contains anchor', function(){
            link = new Link('www.four.com/level#size');
            expect(link.attr.getHref()).toBe('www.four.com/level#size');
        });
    });

    describe('Link::tag: tag name', function(){
        it('A Link object name is set to "a"', function(){
            expect(link.tag).toBe('a');
        });
    });

    describe('Link::attr is an instance of LinkAttr', function(){
        it('has attr property which is a LinkAttr instance', function(){
            expect(link.attr instanceof LinkAttributes).toBe(true);
        });
    });

    describe('Link::style is an instance of LinkStyle', function(){
        it('has style property which is a LinkStyle instance', function(){
            expect(link.style instanceof LinkStyles).toBe(true);
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

    describe('Link::toHtml(): creates html link', function(){
        it('creates link with styles and attributes', function(){
            spyOn(attr, 'toString').andCallFake(function(){return 'attributes';});
            spyOn(style, 'toString').andCallFake(function(){return 'styles';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'content';});
            link.attr = attr;
            link.style = style;
            link.content = content;
            expect(link.toHtml()).toBe('<a attributes style="styles">content</a>');
        });
    });

    describe('Link::underline(): underline the link', function(){
        it('imposes the text-decoration to be "underline", called without argument', function(){
            delete link.style['text-decoration'];
            link.underline();
            expect(link.style['text-decoration']).toBe('underline');
        });
        it('imposes the text-decoration to be "underline", if the argument is true', function(){
            link.underline(true);
            expect(link.style['text-decoration']).toBe('underline');
        });
        it('imposes the text-decoration if the argument is a string', function(){
            link.underline('whatever');
            expect(link.style['text-decoration']).toBe('whatever');
        });

        it('imposes the text-decoration to "none" if the argument is false', function(){
            link.underline(false);
            expect(link.style['text-decoration']).toBe('none');
        });

        it('does not set text-decoration if the argument is a number, function, object or array', function(){
            delete link.style['text-decoration'];
            link.underline(102);
            expect(link.style['text-decoration']).not.toBeDefined();
        });

        it('does not set text-decoration if the argument is a function', function(){
            delete link.style['text-decoration'];
            link.underline(function(){return null;});
            expect(link.style['text-decoration']).not.toBeDefined();
        });

        it('does not set text-decoration if the argument is an object', function(){
            delete link.style['text-decoration'];
            link.underline({'a': 1});
            expect(link.style['text-decoration']).not.toBeDefined();
        });

        it('does not set text-decoration if the argument is an array', function(){
            delete link.style['text-decoration'];
            link.underline([2, 'str']);
            expect(link.style['text-decoration']).not.toBeDefined();
        });


        it('does not change text-decoration if the argument is a number', function(){
            link.style['text-decoration'] = 'whatever';
            link.underline(102);
            expect(link.style['text-decoration']).toBe('whatever');
        });

        it('does not change text-decoration if the argument is a function', function(){
            link.style['text-decoration'] = 'whatever';
            link.underline(function(){return null;});
            expect(link.style['text-decoration']).toBe('whatever');
        });

        it('does not change text-decoration if the argument is an object', function(){
            link.style['text-decoration'] = 'whatever';
            link.underline({'a': 1});
            expect(link.style['text-decoration']).toBe('whatever');
        });

        it('does not change text-decoration if the argument is an array', function(){
            link.style['text-decoration'] = 'whatever';
            link.underline([2, 'str']);
            expect(link.style['text-decoration']).toBe('whatever');
        });
    });

    xdescribe('Link::toLink(): overrides parent class', function(){
        var linkExample;
        beforeEach(function(){
            link.setFactory(new Factory(new Registry({classes: [Link, LinkAttributes, LinkStyles]})));
            linkExample = new Link();
            linkExample.setFactory(new Factory(new Registry({classes: [Link, LinkAttributes, LinkStyles]})));
            linkExample.style.setProperty('level', 'sealevel');
            linkExample.style.setProperty('color', 'invisible');
            linkExample.style.setProperty('width', 98);
            linkExample.attr.setProperty('method', 'deduct');
            linkExample.attr.setProperty('profile', 8);
            linkExample.setHref('www.pizza.it');
        });


        it('returns an instance of Link if the argument is a Link instance', function(){
            expect(link.toLink(linkExample) instanceof Link).toBe(true);
        });

        it('returns an instance of Link if the argument is not a Link instance', function(){
            expect(link.toLink(linkExample) instanceof Link).toBe(true);
        });

        it('calls "clone" on the target if the argument is not a Link instance', function(){
            var invalides = ['', 'non-empty string', 0, 48, -92, 1.98, [], [0], ['str', 9], {}];
            spyOn(link, 'clone');
            invalides.forEach(function(invalid){
                link.toLink(invalid);
                expect(link.clone).toHaveBeenCalled();
            });
        });

        it('returns output of "clone" called on the target if the argument is not a Link instance', function(){
            var invalides = ['', 'non-empty string', 0, 48, -92, 1.98, [], [0], ['str', 9], {}];
            spyOn(link, 'clone').andCallFake(function(){return 'target clone';});
            invalides.forEach(function(invalid){
                var clone = link.toLink(invalid);
                expect(clone).toBe('target clone');
            });
        });

        it('calls "clone" on the argument if it is a Link instance', function(){
            // console.log('argument is link');
            var linkExampleClone = new Link(),
                linkClone = new Link();
            spyOn(linkExample, 'clone').andCallFake(function(){return linkExampleClone;});
            spyOn(link, 'clone').andCallFake(function(){return linkClone;});
            link.toLink(linkExample);
            expect(linkExample.clone).toHaveBeenCalled();
            expect(link.clone).wasNotCalled();
        });

        // it('does not call parent Tag::toLink() method', function(){
        //     spyOn(link.prototype, 'toLink');
        //     link.toLink(linkExample);
        //     expect(link.prototype.toLink).not.toHaveBeenCalled();
        // });

        it('substitutes the url with that of the argument', function(){
            var obj = link.toLink(linkExample);
            expect(obj.getHref()).toBe('www.pizza.it');
        });
        it('imposes styles of the argument', function(){
            var obj = link.toLink(linkExample);
            expect(obj.style.getProperty('level')).toBe('sealevel');
            expect(obj.style.getProperty('color')).toBe('invisible');
            expect(obj.style.getProperty('width')).toBe(98);
        });
        it('imposes attributes of the argument', function(){
            var obj = link.toLink(linkExample);
            expect(obj.attr.getProperty('method')).toBe('deduct');
            expect(obj.attr.getProperty('profile')).toBe(8);
        });
        it('imposes factory attribute', function(){
            var obj = link.toLink(linkExample);
            expect(obj.factory).toBeDefined();
        });
        it('leaves unchanged "content" property of the target', function(){
            content.elements = ['first', 'second'];
            link.content = content;
            var obj = link.toLink(linkExample);
            expect(obj.content.elements[0]).toBe('first');
            expect(obj.content.elements[1]).toBe('second');
        });
    });


});