/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, expect, spyOn, beforeEach, List, ListItem, Attributes, Style, ListStyle, Content, ListItemStyle, jasmine, Tag*/

describe('List-related functionality:', function(){
    var l, li1, li2, li3, li4;

    beforeEach(function(){
        l = new List();
    });

    describe('List::constructor(): inherits from Tag() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            l.attr.width = 102;
            expect((new List()).attr.width).not.toBe(102);
            l.style.width = 34;
            expect((new List()).style.width).not.toBe(34);
        });
        it('List is an instance of List class', function(){
            expect(l instanceof List).toBe(true);
        });
        it('List is an instance of Tag class', function(){
            expect(l instanceof Tag).toBe(true);
        });
        it('adds keyword "new" if it is missing when an object is created', function(){
            var l2 = List();
            expect(l2 instanceof List).toBe(true);
        });
    });

    describe('Basic properties:', function(){
        it('A list object contains nesessary attributes', function(){
            expect(l.hasOwnProperty('name')).toBe(true);
            expect(l.name === 'ol' || l.name === 'ul').toBe(true);
            expect(l.hasOwnProperty('attr')).toBe(true);
            expect(l.hasOwnProperty('style')).toBe(true);
            expect(l.hasOwnProperty('content')).toBe(true);
        });
    });

    describe('List::itemNum(): gives the number of items in the list', function(){
        it('calls parent method Tag::length()', function(){
            spyOn(l, 'length').andCallFake(function(){
                return 'item number';
            });
            expect(l.itemNum()).toBe('item number');
            expect(l.length).toHaveBeenCalled();
        });
    });

    describe('List::appendItem(): appends items to the list', function(){
        it('throws an error if appending not a ListItem object', function(){
            expect(function(){
                l.appendItem("as");
            }).toThrow('The argument is not a ListItem instance!');
            expect(l.itemNum()).toBe(0);
        });
        it('calls parent method Tag::appendElem', function(){
            li1 = new ListItem();
            spyOn(l, 'appendElem');
            l.appendItem(li1);
            expect(l.appendElem).toHaveBeenCalledWith(li1);
        });
    });

    describe('List::insertItemAt(): inserts item into a given position', function(){
        it('throws an error if trying to insert non ListItem instance', function(){
            expect(function(){
                l.insertItemAt('whatever position', "not a ListItem");
            }).toThrow('The item to insert is not a ListItem instance!');
        });

        it('calls parent method Tag::insertElemAt()', function(){
            li1 = new ListItem();
            spyOn(l, 'insertElemAt');
            l.insertItemAt('pos', li1);
            expect(l.insertElemAt).toHaveBeenCalledWith('pos', li1);
        });
    });

    xdescribe('creates html representation of the list', function(){
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

    describe('List::appendList(): appends a list', function(){
        it('throws an error if the argument is not a List instance', function(){
            var foo = '';
            expect(foo instanceof List).toBe(false);
            expect(function(){
                l.appendList(foo);
            }).toThrow('The argument must be a List instance!');
        });
        it('calls List::appendItem() for each list item in the target list', function(){
            var l2 = new List();
            spyOn(l, 'appendItem');
            li1 = 'aaa';
            li2 = 'bbb';
            li3 = 'ccc';
            l2.content.elements = [li1, li2, li3];
            l.appendList(l2);
            expect(l.appendItem).toHaveBeenCalledWith(li1);
            expect(l.appendItem).toHaveBeenCalledWith(li2);
            expect(l.appendItem).toHaveBeenCalledWith(li3);
        });
        it('if list to append has zero length, nothing is called.', function(){
            var l2 = new List();
            spyOn(l, 'appendItem');
            spyOn(l2, 'length').andCallFake(function(){return 0;});
            l.appendList(l2);
            expect(l.appendItem).not.toHaveBeenCalled();
        });


    });
});

