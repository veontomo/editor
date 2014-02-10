/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, expect, spyOn, beforeEach, List, ListItem, Attributes, Style, ListStyle, Content, ListItemStyle, jasmine*/

xdescribe('ListItem-related functionality', function(){
    var li, liStyle, liAttr, content;
    beforeEach(function(){
        li = new ListItem();
        content = new Content();
        liStyle = new ListItemStyle();
        liAttr = new Attributes();
    });
    describe('Basic properties', function(){
        it('A ListItem object contains nesessary attributes', function(){
            expect(li.hasOwnProperty('style')).toBe(true);
            expect(li.hasOwnProperty('attr')).toBe(true);
            expect(li.hasOwnProperty('content')).toBe(true);
            expect(li.hasOwnProperty('appendElem')).toBe(true);
        });

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
            li.style = liStyle;
            li.attr = liAttr;
            li.content = content;

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
            li.style = liStyle;
            li.attr = liAttr;
            li.content = content;

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
            li.style = liStyle;
            li.attr = liAttr;
            li.content = content;

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
            li.style = liStyle;
            li.attr = liAttr;
            li.content = content;

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
