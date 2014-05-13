/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, Tag */

describe('Cell-related functionality:', function() {
    var cell;

    beforeEach(function() {
        cell = new Cell();
    });

    describe('Cell::constructor: inherits properly from Tag() class', function(){
        it('instance of Cell is an instance of Tag as well', function(){
            expect(cell instanceof Tag).toBe(true);
        });
        it('does not affect parent attribute if it is changed in the child', function(){
            expect((new Cell())['dummy-attribute']).not.toBe(102);
            cell['dummy-attribute'] = 102;
            expect((new Cell())['dummy-attribute']).not.toBe(102);
            expect(cell['dummy-attribute']).toBe(102);
        });


        it('adds keyword "new" if it is missing when an object is created', function(){
            var cell2 = Cell();
            expect(cell2 instanceof Cell).toBe(true);
        });

        it('creates a Cell with empty content', function(){
            expect(cell.length()).toBe(0);
        });

        it('has class name "Cell"', function(){
            expect(cell.getName()).toBe('Cell');
        });

        it('has tag equal to "td"', function(){
            expect(cell.getTag()).toBe('td');
        });

        it('fills "content" property with the arguments passed to the constructor', function(){
            cell = new Cell();
            expect(cell.getContent().getElements()).toEqual([]);

            cell = new Cell(10.21);
            expect(cell.getContent().getElements()).toEqual([10.21]);

            cell = new Cell("a string");
            expect(cell.getContent().getElements()).toEqual(["a string"]);

            cell = new Cell({});
            expect(cell.getContent().getElements()).toEqual([{}]);

            cell = new Cell({'prop': 'val'});
            expect(cell.getContent().getElements()).toEqual([{'prop': 'val'}]);

            cell = new Cell([]);
            expect(cell.getContent().getElements()).toEqual([[]]);
        });
    });
});

