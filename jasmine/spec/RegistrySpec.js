/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Registry */

describe('Registry-related functionality', function(){
    var reg;
    beforeEach(function(){
        reg = new Registry();
    });

    describe('Registry construction', function(){
        it('prevents accidental call without "new"', function(){
            var reg2 = Registry();
            expect(reg2 instanceof Registry).toBe(true);
        });
    });

    describe('Registry::classes: contains names of the classes', function(){
        it('contains classes Tag, Table, Row, Cell, Link, List, ListItem', function(){
            var classes = ["Tag", "Table", "Row", "Cell", "Link", "List", "ListItem", "Text"],
                cName;
            classes.forEach(function(cName){
                expect(reg.classes.indexOf(cName) !== -1).toBe(true);
            });
        });
    });

    describe('Registry::map: gives the mapping of the exisitng classes into tag names', function(){
        it('gives "td" for Cell', function(){
            expect(reg.map.Cell.length).toBe(1);
            expect(reg.map.Cell[0]).toBe('td');
        });
        it('gives "tr" for Row', function(){
            expect(reg.map.Row.length).toBe(1);
            expect((reg.map.Row)[0]).toBe('tr');
        });
        it('gives "table" for Table', function(){
            console.log(reg.map);
            expect(reg.map.Table.length).toBe(1);
            expect(reg.map.Table[0]).toBe('table');
        });
        it('gives "td" for Tag', function(){
            expect(reg.map.Tag).not.toBeDefined();
        });
        it('gives "a" for Link', function(){
            expect(reg.map.Link.length).toBe(1);
            expect(reg.map.Link[0]).toBe('a');
        });
        it('gives ["ol", "ul"] for List', function(){
            expect(reg.map.List.length).toBe(2);
            expect(reg.map.List.indexOf('ol') !== -1).toBe(true);
            expect(reg.map.List.indexOf('ul') !== -1).toBe(true);
        });
        it('gives "li" for ListItem', function(){
            expect(reg.map.ListItem.length).toBe(1);
            expect(reg.map.ListItem[0]).toBe('li');
        });
        it('gives "text" for Text', function(){
            expect(reg.map.Text.length).toBe(1);
            expect(reg.map.Text[0]).toBe('text');
        });






    });


});