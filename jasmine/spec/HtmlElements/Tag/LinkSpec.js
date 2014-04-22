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


    describe('Link::shower(): propagates the link on the argument', function(){
        var arg, result;
        beforeEach(function(){
            link = new Link();
            link.style.setProperty('level', 'sealevel');
            link.style.setProperty('color', 'invisible');
            link.style.setProperty('width', 98);
            link.attr.setProperty('method', 'deduct');
            link.attr.setProperty('profile', 8);
            link.setHref('www.pizza.it');
        });

        it('returns a Link instance if the argument is a Link', function(){
            arg = new Link();
            expect(link.shower(arg) instanceof Link).toBe(true);
        });

        it('concatenates properties if the argument is a Link', function(){
            arg = new Link();
            arg.style.setProperty('level', 'mountain');
            arg.style.setProperty('color', 'blue');
            arg.style.setProperty('module', 'top');
            arg.attr.setProperty('method', 'get');
            arg.attr.setProperty('screen', 'hd');
            arg.setHref('www.beer.de');
            result = link.shower(arg);
            expect(result.style.getProperty('level')).toBe('sealevel');
            expect(result.style.getProperty('color')).toBe('invisible');
            expect(result.style.getProperty('width')).toBe(98);
            expect(result.style.getProperty('module')).toBe('top');
            expect(result.attr.getProperty('method')).toBe('deduct');
            expect(result.attr.getProperty('screen')).toBe('hd');
            expect(result.attr.getProperty('profile')).toBe(8);
            expect(result.getHref()).toBe('www.pizza.it');
        });

        it('preserves the content of the argument if it is a Link', function(){
            arg = new Link();
            arg.content.elements = ["first", "second"];
            result = link.shower(arg);
            expect(result.content.elements.length).toBe(2);
            expect(result.content.getElem(0)).toBe('first');
            expect(result.content.getElem(1)).toBe('second');

        });

        it('returns a Link instance if the argument is a Tag with empty content', function(){
            arg = new Tag();
            spyOn(arg.content, 'isEmpty').andCallFake(function(){return true;});
            result = link.shower(arg);
            expect(result instanceof Link).toBe(true);
            expect(arg.content.isEmpty).toHaveBeenCalled();
        });

        it('inserts a clone of the argument into the output if the argument is a Tag with empty content', function(){
            arg = new Tag();
            var clone = {};
            spyOn(arg.content, 'isEmpty').andCallFake(function(){return true;});
            spyOn(arg, 'clone').andCallFake(function(){return clone;});
            result = link.shower(arg);
            expect(result.content.elements.length).toBe(1);
            expect(result.content.elements[0]).toBe(clone);
        });

        it('populates properties if the argument is a Tag with empty content', function(){
            arg = new Tag();
            spyOn(arg.content, 'isEmpty').andCallFake(function(){return true;});
            result = link.shower(arg);
            expect(result.style.getProperty('level')).toBe('sealevel');
            expect(result.style.getProperty('color')).toBe('invisible');
            expect(result.style.getProperty('width')).toBe(98);
            expect(result.attr.getProperty('method')).toBe('deduct');
            expect(result.attr.getProperty('profile')).toBe(8);
        });

        it('returns a clone of the argument if it is a Tag instance with non-empty content', function(){
            arg = new Tag();
            var clone = new Tag();
            spyOn(arg.content, 'isEmpty').andCallFake(function(){return false;});
            spyOn(arg, 'clone').andCallFake(function(){return clone;});
            result = link.shower(arg);
            expect(result).toBe(clone);
        });

        it('populates properties if the argument is a Tag with non empty content', function(){
            arg = new Tag();
            arg.style.setProperty('module', 5);
            arg.style.setProperty('mass', '1 kg');
            arg.attr.setProperty('length', '100mm');
            spyOn(arg.content, 'isEmpty').andCallFake(function(){return false;});
            result = link.shower(arg);
            expect(result.style.getProperty('module')).toBe(5);
            expect(result.style.getProperty('mass')).toBe('1 kg');
            expect(result.attr.getProperty('length')).toBe('100mm');
        });



        it('calls clone method on the argument if it is a Tag instance with non empty content', function(){
            arg = new Tag();
            var clone = new Tag();
            spyOn(arg.content, 'isEmpty').andCallFake(function(){return false;});
            spyOn(arg, 'clone').andCallFake(function(){return clone;});
            result = link.shower(arg);
            expect(arg.clone).toHaveBeenCalled();
        });

        it('returns a clone of the argument if it is a Content instance', function(){
            arg = new Content();
            var contentClone = new Content();
            spyOn(arg, 'clone').andCallFake(function(){return contentClone;});
            result = link.shower(arg);
            expect(result instanceof Content).toBe(true);
        });

        it('calls "shower" method on each element of the argument if it is a Content instance', function(){
            arg = new Content();
            var contentClone = new Content(),
                c1 = {shower: function(){return null;}},
                c2 = {shower: function(){return null;}};
            arg.elements = [c1, c2];
            contentClone.elements = [c1, c2];
            spyOn(arg, 'clone').andCallFake(function(){return contentClone;});
            result = link.shower(arg);
            expect(result.elements.length).toBe(2);
        });

    });

    describe('Link::dropUnderline() removes the underlining of the link', function(){
        it('no underline if the link was originally underlined', function(){
            link.style.setProperty('text-decoration', 'underline');
            link.dropUnderline();
            expect(link.style.getProperty('text-decoration')).toBe('none');
        });

        it('no underline if the link was not originally', function(){
            link.style.setProperty('text-decoration', 'none');
            link.dropUnderline();
            expect(link.style.getProperty('text-decoration')).toBe('none');
        });

    });


});