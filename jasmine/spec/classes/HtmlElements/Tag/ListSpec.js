/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, List, ListItem, Attributes, Style, ListStyle, Content, ListItemStyle, jasmine, Tag*/

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
            spyOn(l, 'length').and.returnValue('item number');
            expect(l.itemNum()).toBe('item number');
            expect(l.length).toHaveBeenCalled();
        });
    });

    describe('List::appendItem(): appends items to the list', function(){
        it('throws an error if appending not a ListItem object', function(){
            expect(function(){
                return l.appendItem("as");
            }).toThrow(new Error('The argument is not a ListItem instance!'));
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
                return l.insertItemAt('whatever position', "not a ListItem");
            }).toThrow(new Error('The item to insert is not a ListItem instance!'));
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
                return l.appendList(foo);
            }).toThrow(new Error('The argument must be a List instance!'));
        });
        it('calls List::appendItem() for each list item in the target list', function(){
            var l2 = new List();
            spyOn(l, 'appendItem');
            li1 = 'aaa';
            li2 = 'bbb';
            li3 = 'ccc';
            l2.setElements([li1, li2, li3]);
            l.appendList(l2);
            expect(l.appendItem).toHaveBeenCalledWith(li1);
            expect(l.appendItem).toHaveBeenCalledWith(li2);
            expect(l.appendItem).toHaveBeenCalledWith(li3);
        });
        it('if list to append has zero length, nothing is called.', function(){
            var l2 = new List();
            spyOn(l, 'appendItem');
            spyOn(l2, 'length').and.returnValue(0);
            l.appendList(l2);
            expect(l.appendItem).not.toHaveBeenCalled();
        });
    });

    describe('Returns allowed list types', function(){
        it ('contains value "ul"', function(){
            expect(l.getAllowedTags().indexOf('ul') !== -1).toBe(true);
        });
        it ('contains value "ol"', function(){
            expect(l.getAllowedTags().indexOf('ol') !== -1).toBe(true);
        });
        it('returns a copy: changes in it do not affect the array of allowed tag stored in the class', function(){
            var allowed = l.getAllowedTags();
            allowed.push("new tag");
            expect(l.getAllowedTags().indexOf("new tag") === -1).toBe(true);
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
            l.setElements(['first item', 'second']);
            expect(l.length()).toBe(2);
            l.appendAsItems();
            expect(l.length()).toBe(2);
        });
        it('transforms argument into ListItem and increases non-empty content by one if the argument is a string', function(){
            l.setElements(['first item', 'second']);
            expect(l.length()).toBe(2);
            l.appendAsItems('third');
            expect(l.length()).toBe(3);
            expect(l.getElem(2) instanceof ListItem).toBe(true);
            expect(l.getElem(2).getElem(0)).toBe('third');
        });
        it('transforms argument into ListItem and increases non-empty content by one if the argument is a 2-element array', function(){
            l.setElements(['first item', 'second']);
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

