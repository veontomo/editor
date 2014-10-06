/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, Link, LinkProperties, Content, Table, Cell, Factory, PlainText */

describe('Link-related functionality:', function() {
    var link, prop;
    beforeEach(function() {
        prop = new LinkProperties();
        // style = new LinkStyles();
        link = new Link();
        // content = new Content();
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

        it('does not affect parent prop if it is changed in the child', function(){
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

    describe('Link properties are an instance of LinkProperties', function(){
        it('has properties which ar a LinkProperties instance', function(){
            expect(link.getProperties() instanceof LinkProperties).toBe(true);
        });
    });

    describe('Link has tag equal to "a"', function(){
        it('A Link object name is set to "a"', function(){
            expect(link.getTag()).toBe('a');
        });
    });

    describe('href getter and getter', function(){
        it('calls Properties method to get value of "href" key', function(){
            spyOn(prop, 'getProperty').and.returnValue('www.test.com');
            link.setProperties(prop);
            expect(link.getHref()).toBe('www.test.com');
            expect(prop.getProperty).toHaveBeenCalledWith('href');
        });

        it('sets value of "href" key', function(){
            link.setHref('impose.url');
            expect(link.getHref()).toBe('impose.url');
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

    describe('Apply target properties on the the argument', function(){
        var arg, result, i;
        beforeEach(function(){
            link = new Link();
            link.setStyleProperty('level', 'sealevel');
            link.setStyleProperty('color', 'invisible');
            link.setStyleProperty('width', 98);
            link.setProperty('method', 'deduct');
            link.setProperty('profile', 8);
            link.setHref('www.pizza.it');
        });

        it('transforms a link into a link', function(){
            arg = new Link();
            arg.setStyleProperty('level', 'argLevel');
            arg.setStyleProperty('padding', 'minor');
            arg.setStyleProperty('width', 10);
            arg.setStyleProperty('color', 'nice');
            arg.setProperty('lesson', 'first');
            arg.setProperty('profile', 1);
            arg.setHref('vino.pane');

            result = link.apply(arg);
            var stl = result.getStyles();
            prop = result.getProperties();
            expect(result instanceof Link).toBe(true);
            expect(stl.getProperty('level')).toBe('argLevel');
            expect(stl.getProperty('color')).toBe('nice');
            expect(stl.getProperty('width')).toBe(10);
            expect(stl.getProperty('padding')).toBe('minor');
            expect(prop.getProperty('lesson')).toBe('first');
            expect(prop.getProperty('method')).toBe('deduct');
            expect(prop.getProperty('profile')).toBe(1);
            expect(result.getHref()).toBe('www.pizza.it');
        });

        it('transforms Content into linkified content', function(){
            arg = new Content();
            arg.setElements(['element 1', 'element 2', 'element 3']);
            result = link.apply(arg);
            // result.getElements().forEach(function(el){
                // console.log(el, ' ', el.getName(), ', ', el.getTag());

            // });
            expect(result instanceof Content).toBe(true);
            expect(result.length()).toBe(3);
            for (i = 0; i < 3; i++){
                expect(result.getElem(i) instanceof Tag).toBe(true);
                expect(result.getElem(i).getStyleProperty('level')).toBe('sealevel');
                expect(result.getElem(i).getStyleProperty('color')).toBe('invisible');
                expect(result.getElem(i).getStyleProperty('width')).toBe(98);
                expect(result.getElem(i).getProperty('method')).toBe('deduct');
                expect(result.getElem(i).getProperty('profile')).toBe(8);
                expect(result.getElem(i).getHref()).toBe('www.pizza.it');

                expect(typeof result.getElem(i).getElem(0)).toBe('string');
            }
            expect(result.getElem(0).getElem(0)).toBe('element 1');
            expect(result.getElem(1).getElem(0)).toBe('element 2');
            expect(result.getElem(2).getElem(0)).toBe('element 3');
        });

        it('transforms content of non-empty Tag into a Tag with linkified content', function(){
            arg = new Tag();
            // var el1 = new Tag(),
            //     el2 = new Tag();
            arg.setElements(['element 1', 'element 2']);
            // el1.setElements(['element 1']);
            // el2.setElements(['element 2']);
            // arg.setElements([el1, el2]);
            arg.setProperty('window', 'wide');
            arg.setProperty('color', 'rainbow');
            arg.setStyleProperty('mix', 8);
            arg.setStyleProperty('lead', 'astray');

            result = link.apply(arg);
            expect(result instanceof Tag).toBe(true);
            expect(result.getProperty('window')).toBe('wide');
            expect(result.getProperty('color')).toBe('rainbow');
            expect(result.getStyleProperty('mix')).toBe(8);
            expect(result.getStyleProperty('lead')).toBe('astray');
            expect(result.length()).toBe(2);
            for (i = 0; i < 2; i++){
                expect(result.getElem(i) instanceof Link).toBe(true);
                expect(result.getElem(i).getStyleProperty('level')).toBe('sealevel');
                expect(result.getElem(i).getStyleProperty('color')).toBe('invisible');
                expect(result.getElem(i).getStyleProperty('width')).toBe(98);
                expect(result.getElem(i).getProperty('method')).toBe('deduct');
                expect(result.getElem(i).getProperty('profile')).toBe(8);
                expect(result.getElem(i).getHref()).toBe('www.pizza.it');
            }
            expect(result.getElem(0).getElem(0)).toBe('element 1');
            expect(result.getElem(1).getElem(0)).toBe('element 2');
        });


        it('transforms Tag with empty content into a Link', function(){
            arg = new Tag();
            arg.setProperty('window', 'wide');
            arg.setProperty('color', 'rainbow');
            arg.setStyleProperty('mix', 8);
            arg.setStyleProperty('lead', 'astray');

            result = link.apply(arg);
            expect(result instanceof Link).toBe(true);
            expect(result.getHref()).toBe('www.pizza.it');
            expect(result.getProperty('method')).toBe('deduct');
            expect(result.getProperty('profile')).toBe(8);
            expect(result.getStyleProperty('level')).toBe('sealevel');
            expect(result.getStyleProperty('color')).toBe('invisible');
            expect(result.getStyleProperty('width')).toBe(98);
            expect(result.length()).toBe(1);

            expect(result.getElem(0) instanceof Tag).toBe(true);
            expect(result.getElem(0).getStyleProperty('mix')).toBe(8);
            expect(result.getElem(0).getStyleProperty('lead')).toBe('astray');
            expect(result.getElem(0).getProperty('window')).toBe('wide');
            expect(result.getElem(0).getProperty('color')).toBe('rainbow');
        });

        it('transforms an object into a Link', function(){
            arg = {'key': 'value'};

            result = link.apply(arg);
            expect(result instanceof Link).toBe(true);
            expect(result.getHref()).toBe('www.pizza.it');
            expect(result.getProperty('method')).toBe('deduct');
            expect(result.getProperty('profile')).toBe(8);
            expect(result.getStyleProperty('level')).toBe('sealevel');
            expect(result.getStyleProperty('color')).toBe('invisible');
            expect(result.getStyleProperty('width')).toBe(98);
            expect(result.length()).toBe(1);

            expect(result.getElem(0)).toBe(arg);
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

    describe('Parsing uri', function(){
        it('returns empty object if input is missing', function(){
            expect(Object.keys(Link.parseUri('')).length).toBe(0);
        });

        it('returns empty object if input is an empty string', function(){
            expect(Object.keys(Link.parseUri('')).length).toBe(0);
        });

        it('returns object with key "protocol", if input is pure protocol name', function(){
            var obj = Link.parseUri('http://');
            expect(obj.protocol).toBe('http');
        });

        it('parses http://abc.com', function(){
            var res = Link.parseUri('http://abc.com');
            expect(res.protocol).toBe('http');
            expect(res.href).toBe('abc.com');
        });

        it('parses uri without protocol names', function(){
            var res = Link.parseUri('abc.com');
            expect(res.protocol).toBe('http');
            expect(res.href).toBe('abc.com');
        });

        it('parses https://abc.com', function(){
            var res = Link.parseUri('https://abc.com');
            expect(res.protocol).toBe('https');
            expect(res.href).toBe('abc.com');
        });

        it('drops final slashes', function(){
            var res = Link.parseUri('https://abc.com/');
            expect(res.protocol).toBe('https');
            expect(res.href).toBe('abc.com');
        });


        it('parses mailto:admin@google.com', function(){
            var res = Link.parseUri('mailto:admin@google.com');
            expect(res.protocol).toBe('mailto');
            expect(res.href).toBe('admin@google.com');
        });

        it('parses links with parameters', function(){
            var res = Link.parseUri('http://google.com/i?r=1');
            expect(res.protocol).toBe('http');
            expect(res.href).toBe('google.com/i?r=1');
        });



    });

});
