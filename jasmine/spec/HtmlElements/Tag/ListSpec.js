/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, expect, spyOn, beforeEach, List, ListItem, Attributes, Style, ListStyle, Content, ListItemStyle, jasmine, Tag*/

describe('List-related functionality:', function(){
    var l, li1, li2, li3, li4;

    beforeEach(function(){
        l = new List();
    });

    describe('List::constructor(): inherits from Tag() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            l.boo = 102;
            expect((new List()).boo).not.toBe(102);
            l.boo = 34;
            expect((new List()).boo).not.toBe(34);
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

    describe('List::getName(): class name', function(){
        it('gives the name of the class', function(){
            expect(l.getName()).toBe('List');
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
            l2.getContent().setElements([li1, li2, li3]);
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

    describe('List::name imposes list type', function(){
        it('imposes name to be "ul" (it is among allowed ones)', function(){
            expect((new List('ul')).getTag()).toBe('ul');
        });
        it('imposes name to be "ol" (it is among allowed ones)', function(){
            expect((new List('ol')).getTag()).toBe('ol');
        });
        it('imposes name to be one of allowed if tried to set non-allowed', function(){
            expect(['ol', 'ul'].indexOf((new List('non allowed type')).getTag()) !== -1).toBe(true);
        });
    });

    describe('List::rename(): imposes list type name', function(){
        it('imposes name to be "ul" (it is among allowed ones)', function(){
            l.switchName('ul');
            expect(l.getTag()).toBe('ul');
        });
        it('imposes name to be "ol" (it is among allowed ones)', function(){
            l.switchName('ol');
            expect(l.getTag()).toBe('ol');
        });
        it('imposes name to be one of allowed if tried to set non-allowed', function(){
            l.switchName('ololololo');
            expect(l.getTag()).not.toBe('ololololo');
        });
    });

    describe('List::appendAsItems() appends array elements to the list content', function(){
        it('leaves empty content unchanged if the argument is missing', function(){
            expect(l.length()).toBe(0);
            l.appendAsItems();
            expect(l.length()).toBe(0);
        });
        it('leaves non-empty content unchanged if the argument is missing', function(){
            l.getContent().setElements(['first item', 'second']);
            expect(l.length()).toBe(2);
            l.appendAsItems();
            expect(l.length()).toBe(2);
        });
        it('transforms argument into ListItem and increases non-empty content by one if the argument is a string', function(){
            l.getContent().setElements(['first item', 'second']);
            expect(l.length()).toBe(2);
            l.appendAsItems('third');
            expect(l.length()).toBe(3);
            expect(l.getElem(2) instanceof ListItem).toBe(true);
            expect(l.getElem(2).getElem(0)).toBe('third');
        });
        it('transforms argument into ListItem and increases non-empty content by one if the argument is a 2-element array', function(){
            l.getContent().setElements(['first item', 'second']);
            expect(l.length()).toBe(2);
            l.appendAsItems(['third', 4]);
            expect(l.length()).toBe(4);
            expect(l.getElem(2) instanceof ListItem).toBe(true);
            expect(l.getElem(2).getElem(0)).toBe('third');
            expect(l.getElem(3) instanceof ListItem).toBe(true);
            expect(l.getElem(3).getElem(0)).toBe(4);
        });
    });
});

