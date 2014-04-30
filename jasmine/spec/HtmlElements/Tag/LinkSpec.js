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
            expect(link.getName()).toBe('Link');
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
            expect(link.getHref()).toBe('http://www.two.com/again.html');
        });
        it('replaces spaces in href', function(){
            link = new Link('http://three.c om');
            expect(link.getHref().indexOf(' ')).toBe(-1);
        });
        it('sets href if it contains & and ?', function(){
            link = new Link('http://www.three.com/level?size=20&user=Mario');
            expect(link.getHref()).toBe('http://www.three.com/level?size=20&user=Mario');
        });

        it('sets href if it contains anchor', function(){
            link = new Link('www.four.com/level#size');
            expect(link.getHref()).toBe('www.four.com/level#size');
        });
    });

    describe('Link has tag equal to "a"', function(){
        it('A Link object name is set to "a"', function(){
            expect(link.getTag()).toBe('a');
        });
    });

    describe('Link attribute is an instance of LinkAttributes', function(){
        it('has attribute property which is a LinkAttr instance', function(){
            expect(link.getAttributes() instanceof LinkAttributes).toBe(true);
        });
    });

    describe('Link style is an instance of LinkStyles', function(){
        it('has a style property which is a LinkStyle instance', function(){
            expect(link.getStyles() instanceof LinkStyles).toBe(true);
        });
    });

    describe('href getter and getter', function(){
        it('calls LinkAttributes.getHref() method', function(){
            spyOn(attr, 'getHref').andCallFake(function(){return 'href';});
            link.setAttributes(attr);
            expect(link.getHref()).toBe('href');
            expect(attr.getHref).toHaveBeenCalled();
        });
    });


    describe('Link::toHtml(): creates html link', function(){
        it('creates link with styles and attributes', function(){
            spyOn(attr, 'toString').andCallFake(function(){return 'attributes';});
            spyOn(style, 'toString').andCallFake(function(){return 'styles';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'content';});
            spyOn(link, 'getContent').andCallFake(function(){return content;});
            spyOn(link, 'getStyles').andCallFake(function(){return style;});
            spyOn(link, 'getAttributes').andCallFake(function(){return attr;});

            expect(link.toHtml()).toBe('<a attributes style="styles">content</a>');
        });
    });

    describe('Link::underline(): underline the link', function(){
        it('imposes the text-decoration to be "underline", called without argument', function(){
            link.dropStyleProperty('text-decoration');
            link.underline();
            expect(link.getStyleProperty('text-decoration')).toBe('underline');
        });
        it('imposes the text-decoration to be "underline", if the argument is true', function(){
            link.underline(true);
            expect(link.getStyleProperty('text-decoration')).toBe('underline');
        });
        it('imposes the text-decoration if the argument is a string', function(){
            link.underline('whatever');
            expect(link.getStyleProperty('text-decoration')).toBe('whatever');
        });

        it('imposes the text-decoration to "none" if the argument is false', function(){
            link.underline(false);
            expect(link.getStyleProperty('text-decoration')).toBe('none');
        });

        it('does not set text-decoration if the argument is a number, function, object or array', function(){
            link.dropStyleProperty('text-decoration');
            link.underline(102);
            expect(link.getStyleProperty('text-decoration')).not.toBeDefined();
        });

        it('does not set text-decoration if the argument is a function', function(){
            link.dropStyleProperty('text-decoration');
            link.underline(function(){return null;});
            expect(link.getStyleProperty('text-decoration')).not.toBeDefined();
        });

        it('does not set text-decoration if the argument is an object', function(){
            link.dropStyleProperty('text-decoration');
            link.underline({'a': 1});
            expect(link.getStyleProperty('text-decoration')).not.toBeDefined();
        });

        it('does not set text-decoration if the argument is an array', function(){
            link.dropStyleProperty('text-decoration');
            link.underline([2, 'str']);
            expect(link.getStyleProperty('text-decoration')).not.toBeDefined();
        });


        it('does not change text-decoration if the argument is a number', function(){
            link.setStyleProperty('text-decoration', 'whatever');
            link.underline(102);
            expect(link.getStyleProperty('text-decoration')).toBe('whatever');
        });

        it('does not change text-decoration if the argument is a function', function(){
            link.setStyleProperty('text-decoration', 'whatever');
            link.underline(function(){return null;});
            expect(link.getStyleProperty('text-decoration')).toBe('whatever');
        });

        it('does not change text-decoration if the argument is an object', function(){
            link.setStyleProperty('text-decoration', 'whatever');
            link.underline({'a': 1});
            expect(link.getStyleProperty('text-decoration')).toBe('whatever');
        });

        it('does not change text-decoration if the argument is an array', function(){
            link.setStyleProperty('text-decoration', 'whatever');
            link.underline([2, 'str']);
            expect(link.getStyleProperty('text-decoration')).toBe('whatever');
        });
    });


    describe('Link::shower(): propagates the link on the argument', function(){
        var arg, result;
        beforeEach(function(){
            link = new Link();
            link.setStyleProperty('level', 'sealevel');
            link.setStyleProperty('color', 'invisible');
            link.setStyleProperty('width', 98);
            link.setAttrProperty('method', 'deduct');
            link.setAttrProperty('profile', 8);
            link.setHref('www.pizza.it');
        });

        it('returns a Link instance if the argument is a Link', function(){
            arg = new Link();
            expect(link.shower(arg) instanceof Link).toBe(true);
        });

        it('concatenates properties if the argument is a Link', function(){
            arg = new Link();
            arg.setStyleProperty('level', 'mountain');
            arg.setStyleProperty('color', 'blue');
            arg.setStyleProperty('module', 'top');
            arg.setAttrProperty('method', 'get');
            arg.setAttrProperty('screen', 'hd');
            arg.setHref('www.beer.de');
            result = link.shower(arg);
            expect(result.getStyleProperty('level')).toBe('sealevel');
            expect(result.getStyleProperty('color')).toBe('invisible');
            expect(result.getStyleProperty('width')).toBe(98);
            expect(result.getStyleProperty('module')).toBe('top');
            expect(result.getAttrProperty('method')).toBe('deduct');
            expect(result.getAttrProperty('screen')).toBe('hd');
            expect(result.getAttrProperty('profile')).toBe(8);
            expect(result.getHref()).toBe('www.pizza.it');
        });

        it('preserves the content of the argument if it is a Link', function(){
            arg = new Link();
            arg.setElements(["first", "second"]);
            result = link.shower(arg);
            expect(result.getContent().length()).toBe(2);
            expect(result.getContent().getElem(0)).toBe('first');
            expect(result.getContent().getElem(1)).toBe('second');

        });

        it('returns a Link instance if the argument is a Tag with empty content', function(){
            arg = new Tag();
            var cntn = new Content();
            spyOn(cntn, 'isEmpty').andCallFake(function(){return true;});
            spyOn(arg, 'getContent').andCallFake(function(){return cntn;});
            result = link.shower(arg);
            expect(result instanceof Link).toBe(true);
            expect(arg.getContent().isEmpty).toHaveBeenCalled();
        });

        it('inserts a clone of the argument into the output if the argument is a Tag with empty content', function(){
            arg = new Tag();
            var clone = {};
            spyOn(arg.getContent(), 'isEmpty').andCallFake(function(){return true;});
            spyOn(arg, 'clone').andCallFake(function(){return clone;});
            result = link.shower(arg);
            expect(result.getContent().length()).toBe(1);
            expect(result.getContent().getElem(0)).toBe(clone);
        });

        it('populates properties if the argument is a Tag with empty content', function(){
            arg = new Tag();
            spyOn(arg.getContent(), 'isEmpty').andCallFake(function(){return true;});
            result = link.shower(arg);
            expect(result.getStyleProperty('level')).toBe('sealevel');
            expect(result.getStyleProperty('color')).toBe('invisible');
            expect(result.getStyleProperty('width')).toBe(98);
            expect(result.getAttrProperty('method')).toBe('deduct');
            expect(result.getAttrProperty('profile')).toBe(8);
        });

        it('returns a clone of the argument if it is a Tag instance with non-empty content', function(){
            arg = new Tag();
            var clone = new Tag();
            var cntn = new Content();
            spyOn(cntn, 'isEmpty').andCallFake(function(){return false;});
            spyOn(arg, 'getContent').andCallFake(function(){return cntn;});
            spyOn(arg, 'clone').andCallFake(function(){return clone;});
            result = link.shower(arg);
            expect(result).toBe(clone);
        });

        it('populates properties if the argument is a Tag with non empty content', function(){
            arg = new Tag();
            arg.setStyleProperty('module', 5);
            arg.setStyleProperty('mass', '1 kg');
            arg.setAttrProperty('length', '100mm');
            var cntn = new Content();
            spyOn(cntn, 'isEmpty').andCallFake(function(){return false;});
            spyOn(arg, 'getContent').andCallFake(function(){return cntn;});
            result = link.shower(arg);
            expect(result.getStyleProperty('module')).toBe(5);
            expect(result.getStyleProperty('mass')).toBe('1 kg');
            expect(result.getAttrProperty('length')).toBe('100mm');
        });

        it('calls clone method on the argument if it is a Tag instance with non empty content', function(){
            arg = new Tag();
            var clone = new Tag();
            spyOn(arg.getContent(), 'isEmpty').andCallFake(function(){return false;});
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


    });

    describe('Link::dropUnderline() removes the underlining of the link', function(){
        it('no underline if the link was originally underlined', function(){
            link.setStyleProperty('text-decoration', 'underline');
            link.dropUnderline();
            expect(link.getStyles().getProperty('text-decoration')).toBe('none');
        });

        it('no underline if the link was not originally', function(){
            link.setStyleProperty('text-decoration', 'none');
            link.dropUnderline();
            expect(link.getStyleProperty('text-decoration')).toBe('none');
        });

    });


});