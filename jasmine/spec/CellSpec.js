/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, TableCellStyle, Attributes, Style, jasmine, appendStyleToCell, Tag, Table, Row */

describe('Cell-related functionality:', function() {
    var cell, cellStyle, cellAttr, cellContent;

    beforeEach(function() {
        cell = new Cell();
        cellStyle = new TableCellStyle();
        cellAttr = new Attributes();
        cellContent = new Content();
    });

    describe('Cell::className: class name', function(){
        it('gives the name of the class', function(){
            expect(cell.className).toBe('Cell');
        });
    });


    describe('inherits properly from Tag() class', function(){
        it('instance of Cell is an instance of Tag as well', function(){
            expect(cell instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Cell()).attr.width).not.toBe(102);
            cell.attr.width = 102;
            expect((new Cell()).attr.width).not.toBe(102);
            expect(cell.attr.width).toBe(102);
        });
        it('does not affect parent style if it is changed in the child', function(){
            expect((new Cell()).style.width).not.toBe('whatever');
            cell.style.width = 'whatever';
            expect((new Cell()).style.width).not.toBe('whatever');
            expect(cell.style.width).toBe('whatever');
        });

        it('does not affect parent name property if it is changed in the child', function(){
            expect((new Tag()).name).toBe(null);
            expect((new Cell()).name).toBe('td');
            cell.name = 'whatever';
            expect((new Tag()).name).toBe(null);
            expect((new Cell()).name).toBe('td');
            expect(cell.name).toBe('whatever');
        });

        it('adds keyword "new" if it is missing when an object is created', function(){
            var cell2 = Cell();
            expect(cell2 instanceof Cell).toBe(true);
        });
    });

    it('creates object with type attribute "Cell"', function(){
        expect((new Table()).length()).toBe(0);
        expect((new Tag()).length()).toBe(0);
        expect((new Cell()).length()).toBe(0);
        expect((new Row()).length()).toBe(0);

        expect(cell.getType()).toBe("Cell");
    });

    it('creates a Cell with empty content', function(){
        expect((new Table()).length()).toBe(0);
        expect((new Tag()).length()).toBe(0);
        expect((new Cell()).length()).toBe(0);
        expect((new Row()).length()).toBe(0);

        expect(cell.length()).toBe(0);
    });

    it('creates a Cell with 1 element inside', function(){
        cell = new Cell('test string');
        expect(cell.length()).toBe(1);
    });

    it('overrides previously set properties', function(){
        cellStyle['a property'] = 'a property value';
        cell.style = cellStyle;
        expect(cell.style.hasOwnProperty('a property')).toBe(true);
        expect(cell.style['a property']).toBe('a property value');
        cell = new Cell();
        expect(cell.style.hasOwnProperty('a property')).toBe(false);
    });

    it('overrides a previously set default property', function(){
        var prop = 'padding';
        expect(cell.style.hasOwnProperty(prop)).toBe(true);
        cell.style[prop] = 'modified value';
        cell = new Cell();
        expect(cell.style.hasOwnProperty(prop)).toBe(true);
        expect(cell.style[prop]).not.toBe('modified value');
    });

    it('retrieves property of type "string" from the style', function() {
        cellStyle['a property'] = 'cell property value';
        cell.style = cellStyle;
        expect(cell.getStyleProp('a property')).toEqual('cell property value');
    });

    it('retrieves property of type "Number" from the style', function() {
        cellStyle['a-property'] = 12.6;
        cell.style = cellStyle;
        expect(cell.getStyleProp('a-property')).toEqual(12.6);
    });

    it('retrieves non-existing property from the style', function() {
        if (cellStyle.hasOwnProperty('cell property')) {
            delete cellStyle['cell property'];
        }
        cell.style = cellStyle;
        expect(cell.getStyleProp('cell property')).not.toBeDefined();
    });

    it('sets the width of the cell', function(){
        cell.setWidth(10);
        expect(cell.attr.width).toEqual(10);
        expect(cell.style.width).toEqual(10);
        expect(cell.style['min-width']).toEqual(10);
        expect(cell.style['max-width']).toEqual(10);

        cell.setWidth(0.992);
        expect(cell.attr.width).toEqual(0.992);
        expect(cell.style.width).toEqual(0.992);
        expect(cell.style['min-width']).toEqual(0.992);
        expect(cell.style['max-width']).toEqual(0.992);
    });

    it('gets the width of the cell', function(){
        cell.style.width = 20;
        expect(cell.getWidth()).toBe(20);

        cell.style.width = 20.3;
        expect(cell.getWidth()).toBe(20.3);

        cell.style.width = '31';
        expect(cell.getWidth()).toBe(31);

        cell.style.width = '192px';
        expect(cell.getWidth()).toBe(192);

        cell.style.width = '192em';
        expect(cell.getWidth()).toBe('192em');
    });

    it('fills "content" property with the arguments passed to the constructor', function(){
        cell = new Cell();
        expect(cell.content.elements).toEqual([]);

        cell = new Cell(10.21);
        expect(cell.content.elements).toEqual([10.21]);

        cell = new Cell("a string");
        expect(cell.content.elements).toEqual(["a string"]);

        cell = new Cell({});
        expect(cell.content.elements).toEqual([{}]);

        cell = new Cell({'prop': 'val'});
        expect(cell.content.elements).toEqual([{'prop': 'val'}]);

        cell = new Cell([]);
        expect(cell.content.elements).toEqual([[]]);
    });

    it('appends elements to the cell content', function(){
        expect(cell.content.elements.length).toBe(0);
        cell.appendElem('an item');
        expect(cell.content.elements.length).toBe(1);
        cell.appendElem('another item');
        expect(cell.content.elements.length).toBe(2);
    });

    describe('appends style to the cell:', function(){
        it('Appends style if it is given as a string', function(){
            if (cell.style.hasOwnProperty('an-attribute')){
                delete cell.style['an-attribute'];
            }
            cell.appendStyle('an-attribute: attribute-value');
            expect(cell.getStyleProp('an-attribute')).toBe('attribute-value');
        });

        it('Appends style if it is given as a Style object', function(){
            var st = new Style();
            st.attribute = 201.29;
            cell.appendStyle(st);
            expect(cell.getStyleProp('attribute')).toBe(201.29);
        });

        it('Appends style if it is given as an object', function(){
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProp('modular')).toBe('no');
            expect(cell.getStyleProp('speed')).toBe(21.9);
        });

        it('Does not overrides non-overlapping attributes', function(){
            var st = new Style();
            st.leverage = 'virtual';
            st.help = 981.87;
            st['knowledge-driven'] = '34';
            cell.style = st;
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProp('modular')).toBe('no');
            expect(cell.getStyleProp('speed')).toBe(21.9);
            expect(cell.getStyleProp('leverage')).toBe('virtual');
            expect(cell.getStyleProp('help')).toBe(981.87);
            expect(cell.getStyleProp('knowledge-driven')).toBe('34');
        });

        it('Overrides overlapping attributes', function(){
            var st = new Style();
            st.leverage = 'virtual';
            st.help = 981.87;
            st['knowledge-driven'] = '34';
            st.modular = 923;
            cell.style = st;
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProp('modular')).toBe('no');
            expect(cell.getStyleProp('speed')).toBe(21.9);
            expect(cell.getStyleProp('leverage')).toBe('virtual');
            expect(cell.getStyleProp('help')).toBe(981.87);
            expect(cell.getStyleProp('knowledge-driven')).toBe('34');
        });
    });

    it('generates html code of the cell if both attributes and styles are present', function(){
        spyOn(cellStyle, 'toString').andCallFake(function(){
            return 'cell style';
        });
        spyOn(cellAttr, 'toString').andCallFake(function(){
            return 'cell attributes';
        });
        spyOn(cellContent, 'toHtml').andCallFake(function(){
            return 'cell content';
        });
        cell.attr = cellAttr;
        cell.style = cellStyle;
        cell.content = cellContent;
        expect(cell.toHtml()).toEqual('<td cell attributes style="cell style">cell content</td>');
    });

    it('generates html code of the cell there are no attributes', function(){
        spyOn(cellStyle, 'toString').andCallFake(function(){
            return 'cell style';
        });
        spyOn(cellAttr, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(cellContent, 'toHtml').andCallFake(function(){
            return 'cell content';
        });
        cell.attr = cellAttr;
        cell.style = cellStyle;
        cell.content = cellContent;
        expect(cell.toHtml()).toEqual('<td style="cell style">cell content</td>');
    });

    it('generates html code of the cell there are no styles', function(){
        spyOn(cellStyle, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(cellAttr, 'toString').andCallFake(function(){
            return 'cell attributes';
        });
        spyOn(cellContent, 'toHtml').andCallFake(function(){
            return 'cell content';
        });
        cell.attr = cellAttr;
        cell.style = cellStyle;
        cell.content = cellContent;
        expect(cell.toHtml()).toEqual('<td cell attributes>cell content</td>');
    });
});

