/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, ListItem , Tag*/

describe('ListItem-related functionality', function(){
    var li;

    beforeEach(function(){
        li = new ListItem();
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
});
