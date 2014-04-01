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
        var classes = ["Table", "Row", "Cell", "Link", "OList", "UList", "ListItem", "Text"];
        it('contains classes ' + classes, function(){
            classes.forEach(function(cName){
                expect(reg.classes.indexOf(cName) !== -1).toBe(true);
            });
        });
        it('does not contain Tag class', function(){
            expect(reg.classes.indexOf('Tag')).toBe(-1);
        });
    });

    describe('Registry::map: gives the mapping of the exisitng classes into tag names', function(){
        it('gives "td" for Cell', function(){
            expect(reg.map.Cell[0]).toBe('td');
        });
        it('gives "tr" for Row', function(){
            expect(reg.map.Row[0]).toBe('tr');
        });
        it('gives "table" for Table', function(){
            expect(reg.map.Table[0]).toBe('table');
        });
        it('gives "td" for Tag', function(){
            expect(reg.map.Tag).not.toBeDefined();
        });
        it('gives "a" for Link', function(){
            expect(reg.map.Link[0]).toBe('a');
        });
        it('gives "ol" for OList', function(){
            expect(reg.map.OList[0]).toBe('ol');
        });
        it('gives "ul" for UList', function(){
            expect(reg.map.UList[0]).toBe('ul');
        });

        it('gives "li" for ListItem', function(){
            expect(reg.map.ListItem[0]).toBe('li');
        });
        it('gives "text" for Text', function(){
            expect(reg.map.Text[0]).toBe('text');
        });

    });


});