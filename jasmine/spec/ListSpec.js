/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, List, ListItem, Attributes, Style, ListStyle, Content, ListItemStyle, jasmine*/

describe('List-related functionality:', function(){
    var l, li1, li2, li3, li4;

    beforeEach(function(){
        l = new List();
    });

    describe('Basic properties:', function(){
        it('A list object contains nesessary attributes', function(){
            expect(l.hasOwnProperty('type')).toBe(true);
            expect(l.type === 'ol' || l.type === 'ul').toBe(true);
            expect(l.hasOwnProperty('getType')).toBe(true);
            expect(typeof l.getType).toBe('function');
            expect(l.hasOwnProperty('attr')).toBe(true);
            expect(l.hasOwnProperty('style')).toBe(true);
            expect(l.hasOwnProperty('items')).toBe(true);
            expect(Array.isArray(l.items)).toBe(true);
        });

        it('gives the number of items in the list', function(){
            l.items = [10, [], "33", {}];
            expect(l.itemNum()).toBe(4);
            l.items = [];
            expect(l.itemNum()).toBe(0);
            l.items = ["first", [{'a':2}, 'aa']];
            expect(l.itemNum()).toBe(2);
            l.items = [[[["core"]]]];
            expect(l.itemNum()).toBe(1);
        });
    });

    describe('appends items to the list', function(){
        it('throws an error if appending not a ListItem object', function(){
            l.items = [];
            expect(function(){
                l.appendItem("as");
            }).toThrow('The argument is not a ListItem instance!');
            expect(l.itemNum()).toBe(0);
        });
        it('appends a ListItem object to the empty item list', function(){
            var li = new ListItem();
            l.items = [];
            l.appendItem(li);
            expect(l.itemNum()).toBe(1);
        });
        it('appends a ListItem object', function(){
            var li = new ListItem();
            l.items = ['already', 'inserted', 'elements'];
            l.appendItem(li);
            expect(l.itemNum()).toBe(4);
        });
    });

    describe('inserts item into a given position', function(){
        it('throws an error if the index is negative', function(){
            expect(function(){
                l.insertItemAt(-2, "whatever");
            }).toThrow('Wrong index to insert the item at!');
        });
        it('throws an error if index is to big', function(){
            spyOn(l, 'itemNum').andCallFake(function(){
                return 12;
            });
            expect(function(){
                l.insertItemAt(15, "whatever");
            }).toThrow('Wrong index to insert the item at!');
        });
        it('throws an error if index is different from 0 when inserting into the empty list', function(){
            l.items = [];
            expect(function(){
                l.insertItemAt(1, "whatever");
            }).toThrow('Wrong index to insert the item at!');
            expect(function(){
                l.insertItemAt(-1, "whatever");
            }).toThrow('Wrong index to insert the item at!');
        });

        it('throws an error if trying to insert non ListItem instance at a valid position', function(){
            spyOn(l, 'itemNum').andCallFake(function(){return 5;});
            expect(function(){
                l.insertItemAt(0, "not a ListItem");
            }).toThrow('The item to insert is not a ListItem instance!');
            expect(function(){
                l.insertItemAt(3, "not a ListItem");
            }).toThrow('The item to insert is not a ListItem instance!');
            expect(function(){
                l.insertItemAt(5, "not a ListItem");
            }).toThrow(); // inserting at the end is delegated to the List::appendItem() method
        });

        it('inserts at the beginning of non-empty list', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            l.items = [li1, li2, li3];
            l.insertItemAt(0, li4);
            expect(l.itemNum()).toBe(4);
            expect(l.items[0]).toBe(li4);
            expect(l.items[1]).toBe(li1);
            expect(l.items[2]).toBe(li2);
            expect(l.items[3]).toBe(li3);
        });

        it('inserts in the middle of non-empty list', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            l.items = [li1, li2, li3];
            l.insertItemAt(1, li4);
            expect(l.itemNum()).toBe(4);
            expect(l.items[0]).toBe(li1);
            expect(l.items[1]).toBe(li4);
            expect(l.items[2]).toBe(li2);
            expect(l.items[3]).toBe(li3);
        });

        it('inserts just before-the-end non-empty list', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            l.items = [li1, li2, li3];
            l.insertItemAt(2, li4);
            expect(l.itemNum()).toBe(4);
            expect(l.items[0]).toBe(li1);
            expect(l.items[1]).toBe(li2);
            expect(l.items[2]).toBe(li4);
            expect(l.items[3]).toBe(li3);
        });

        it('calls "appendItem" when inserting at the end of the list', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            spyOn(l, 'appendItem').andCallFake(function(){
                return null;
            });
            l.items = [li1, li2, li3];
            l.insertItemAt(3, "anything");
            expect(l.appendItem).toHaveBeenCalledWith("anything");
        });
    });

    describe('creates html representation of the list', function(){
        it('gives empty string if the list has no items', function(){
            l.items = [];
            expect(l.toHtml()).toBe('');
        });

        it('if no attributes niether styles are provided:', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            var lStyle = new ListStyle(),
                lAttr = new Attributes(),
                lHtml;
            spyOn(li1, 'toHtml').andCallFake(function(){return 'item 1';});
            spyOn(li2, 'toHtml').andCallFake(function(){return 'item 2';});
            spyOn(li3, 'toHtml').andCallFake(function(){return 'item 3';});
            spyOn(li4, 'toHtml').andCallFake(function(){return 'item 4';});
            spyOn(l, 'getType').andCallFake(function(){return 'listtype';});
            spyOn(lStyle, 'toString').andCallFake(function(){return '';});
            spyOn(lAttr, 'toString').andCallFake(function(){return '';});
            l.items = [li1, li2, li3, li4];
            l.style = lStyle;
            l.attr = lAttr;
            lHtml = l.toHtml();
            expect(lHtml).toBe('<listtype>item 1item 2item 3item 4</listtype>');
        });

        it('if no attributes are provided:', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            var lStyle = new ListStyle(),
                lAttr = new Attributes(),
                lHtml;
            spyOn(li1, 'toHtml').andCallFake(function(){return 'item 1';});
            spyOn(li2, 'toHtml').andCallFake(function(){return 'item 2';});
            spyOn(li3, 'toHtml').andCallFake(function(){return 'item 3';});
            spyOn(li4, 'toHtml').andCallFake(function(){return 'item 4';});
            spyOn(l, 'getType').andCallFake(function(){return 'listtype';});
            spyOn(lStyle, 'toString').andCallFake(function(){return 'list style';});
            spyOn(lAttr, 'toString').andCallFake(function(){return '';});
            l.items = [li1, li2, li3, li4];
            l.style = lStyle;
            l.attr = lAttr;
            lHtml = l.toHtml();
            expect(lHtml).toBe('<listtype style="list style">item 1item 2item 3item 4</listtype>');
        });
        it('if no style is provided:', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            var lStyle = new ListStyle(),
                lAttr = new Attributes(),
                lHtml;
            spyOn(li1, 'toHtml').andCallFake(function(){return 'item 1';});
            spyOn(li2, 'toHtml').andCallFake(function(){return 'item 2';});
            spyOn(li3, 'toHtml').andCallFake(function(){return 'item 3';});
            spyOn(l, 'getType').andCallFake(function(){return 'listtype';});
            spyOn(lStyle, 'toString').andCallFake(function(){return '';});
            spyOn(lAttr, 'toString').andCallFake(function(){return 'list attributes';});
            l.items = [li1, li2, li3];
            l.style = lStyle;
            l.attr = lAttr;
            lHtml = l.toHtml();
            expect(lHtml).toBe('<listtype list attributes>item 1item 2item 3</listtype>');
        });
        it('if both attributes and styles are provided:', function(){
            li1 = new ListItem();
            li2 = new ListItem();
            li3 = new ListItem();
            li4 = new ListItem();
            var lStyle = new ListStyle(),
                lAttr = new Attributes(),
                lHtml;
            spyOn(li1, 'toHtml').andCallFake(function(){return 'item 1';});
            spyOn(li2, 'toHtml').andCallFake(function(){return 'item 2';});
            spyOn(li3, 'toHtml').andCallFake(function(){return 'item 3';});
            spyOn(li4, 'toHtml').andCallFake(function(){return 'item 4';});
            spyOn(l, 'getType').andCallFake(function(){return 'listtype';});
            spyOn(lStyle, 'toString').andCallFake(function(){return 'list style';});
            spyOn(lAttr, 'toString').andCallFake(function(){return 'list attributes';});
            l.items = [li1, li2, li3, li4];
            l.style = lStyle;
            l.attr = lAttr;
            lHtml = l.toHtml();
            expect(lHtml).toBe('<listtype list attributes style="list style">item 1item 2item 3item 4</listtype>');
        });
    });
});

describe('ListItem-related functionality', function(){
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

    describe('Creates ListItem object from its html representation', function(){
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
