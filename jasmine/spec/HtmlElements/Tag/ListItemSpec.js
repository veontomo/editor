/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, expect, spyOn, beforeEach, List, ListItem, Attributes, Styles, ListStyles, Content, Tag, ListItemStyles, jasmine*/

describe('ListItem-related functionality', function(){
    var li, liStyle, liAttr, content;
    beforeEach(function(){
        li = new ListItem();
        content = new Content();
        liStyle = new ListItemStyles();
        liAttr = new Attributes();
    });
    describe('ListItem::constructor(): inherits from Tag() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            li.foo = 102;
            expect((new ListItem()).foo).not.toBe(102);
        });
        it('ListItem is an instance of ListItem class', function(){
            expect(li instanceof ListItem).toBe(true);
        });
        it('ListItem is an instance of Tag class', function(){
            expect(li instanceof Tag).toBe(true);
        });
        it('adds keyword "new" if it is missing when an object is created', function(){
            var li2 = ListItem();
            expect(li2 instanceof ListItem).toBe(true);
        });
    });

    describe('ListItem::className: class name', function(){
        it('gives the name of the class', function(){
            expect(li.getName()).toBe('ListItem');
        });
    });

    describe('ListItem::tag: tag name', function(){
        it('A ListItem object name is set to "li"', function(){
            expect(li.getTag()).toBe('li');
        });
    });


    describe('Basic properties', function(){
        it('appends element to its content', function(){
            expect(li.length()).toBe(0);
            li.appendElem(1222.332);
            expect(li.length()).toBe(1);
            li.appendElem("a string");
            expect(li.length()).toBe(2);
        });
    });
    describe('Generates html representation of the list item', function(){
        it('if no style neither attributes are given', function(){
            spyOn(liAttr, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(liStyle, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(content, 'toHtml').andCallFake(function(){
                return 'content html';
            });
            li.setStyles(liStyle);
            li.setAttributes(liAttr);
            li.setContent(content);

            var liHtml = li.toHtml();
            expect(liHtml).toBe('<li>content html</li>');
        });
        it('if no style is given', function(){
            spyOn(liAttr, 'toString').andCallFake(function(){
                return 'attributes of the list item';
            });
            spyOn(liStyle, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(content, 'toHtml').andCallFake(function(){
                return 'content html';
            });
            li.setStyles(liStyle);
            li.setAttributes(liAttr);
            li.setContent(content);

            var liHtml = li.toHtml();
            expect(liHtml).toBe('<li attributes of the list item>content html</li>');
        });
        it('if no attributes are given', function(){
            spyOn(liAttr, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(liStyle, 'toString').andCallFake(function(){
                return 'styles of the list item';
            });
            spyOn(content, 'toHtml').andCallFake(function(){
                return 'content html';
            });
            li.setStyles(liStyle);
            li.setAttributes(liAttr);
            li.setContent(content);


            var liHtml = li.toHtml();
            expect(liHtml).toBe('<li style="styles of the list item">content html</li>');
        });
        it('if both attributes and styles are present', function(){
            spyOn(liAttr, 'toString').andCallFake(function(){
                return 'attributes of the list item';
            });
            spyOn(liStyle, 'toString').andCallFake(function(){
                return 'styles of the list item';
            });
            spyOn(content, 'toHtml').andCallFake(function(){
                return 'content html';
            });
            li.setStyles(liStyle);
            li.setAttributes(liAttr);
            li.setContent(content);


            var liHtml = li.toHtml();
            expect(liHtml).toBe('<li attributes of the list item style="styles of the list item">content html</li>');
        });
    });

    xdescribe('Creates ListItem object from its html representation', function(){
        it('creates from the simple string', function(){
            var liStr = '<li>text</li>',
                liObj = liStr.createListItemFromHtml();
            expect(liObj instanceof ListItem).toBe(true);
            console.log(liObj.toHtml());
        });

        it('creates from the simple string', function(){
            var liStr = '<li>text<table><tbody></tbody><tr><td>aaa</td><td>bbb</td></tr></table></li>',
                liObj = liStr.createListItemFromHtml();
            expect(liObj instanceof ListItem).toBe(true);
            console.log(liObj.length());
            console.log(liObj);
        });

    });


});
