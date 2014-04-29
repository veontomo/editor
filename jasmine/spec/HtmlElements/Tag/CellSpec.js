/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, TableCellStyles, Styles, jasmine, Tag, Factory */

describe('Cell-related functionality:', function() {
    var cell, cellStyle;

    beforeEach(function() {
        cell = new Cell();
        cellStyle = new TableCellStyles();
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


    describe('Cell::style: imposing cell style', function(){
        it('overrides previously set properties', function(){
            cellStyle.setProperty('a property', 'a property value');
            cell.setStyles(cellStyle);
            expect(cell.getStyleProperty('a property')).toBe('a property value');
            cell = new Cell();
            expect(cell.getStyleProperty('a property')).not.toBe('a property value');
        });

        it('overrides a previously set default property', function(){
            var prop = 'padding';
            expect(cell.getStyles().hasProperty(prop)).toBe(true);
            cell.setStyleProperty(prop, 'modified value');
            cell = new Cell();
            expect(cell.getStyleProperty(prop)).not.toBe('modified value');
        });
    });

    describe('Cell::appendStyle(): method defined in the parent class', function(){
        it('appends style if it is given as a string', function(){
            cell.appendStyle('an-attribute: attribute-value');
            expect(cell.getStyleProperty('an-attribute')).toBe('attribute-value');
        });

        it('appends style if it is given as a Style object', function(){
            var st = new Styles();
            st.setProperty('attribute', 201.29);
            console.log(st.getCore());
            cell.appendStyle(st);
            expect(cell.getStyleProperty('attribute')).toBe(201.29);
        });

        it('appends style if it is given as an object', function(){
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProperty('modular')).toBe('no');
            expect(cell.getStyleProperty('speed')).toBe(21.9);
        });

        it('does not overrides non-overlapping attributes', function(){
            var st = new Styles();
            st.setProperty('leverage', 'virtual');
            st.setProperty('help', 981.87);
            st.setProperty('knowledge-driven', '34');
            cell.setStyles(st);
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProperty('modular')).toBe('no');
            expect(cell.getStyleProperty('speed')).toBe(21.9);
            expect(cell.getStyleProperty('leverage')).toBe('virtual');
            expect(cell.getStyleProperty('help')).toBe(981.87);
            expect(cell.getStyleProperty('knowledge-driven')).toBe('34');
        });

        it('overrides overlapping attributes', function(){
            var st = new Styles();
            st.setProperty('leverage', 'virtual');
            st.setProperty('help', 981.87);
            st.setProperty('knowledge-driven', '34');
            st.setProperty('modular', 923);
            cell.setStyles(st);
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProperty('modular')).toBe('no');
            expect(cell.getStyleProperty('speed')).toBe(21.9);
            expect(cell.getStyleProperty('leverage')).toBe('virtual');
            expect(cell.getStyleProperty('help')).toBe(981.87);
            expect(cell.getStyleProperty('knowledge-driven')).toBe('34');
        });
    });
});

