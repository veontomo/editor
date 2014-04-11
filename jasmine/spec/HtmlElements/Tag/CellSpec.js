/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, TableCellStyle, Attributes, Style, jasmine, appendStyleToCell, Tag, Table, Row, Link */

xdescribe('Cell-related functionality:', function() {
    var cell, cellStyle, cellAttr, cellContent;

    beforeEach(function() {
        cell = new Cell();
        cellStyle = new TableCellStyle();
        cellAttr = new Attributes();
        cellContent = new Content();
    });

    describe('Cell::constructor: inherits properly from Tag() class', function(){
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
            expect((new Tag()).tag).toBe(null);
            expect((new Cell()).tag).toBe('td');
            cell.tag = 'whatever';
            expect((new Tag()).tag).toBe(null);
            expect((new Cell()).tag).toBe('td');
            expect(cell.tag).toBe('whatever');
        });

        it('adds keyword "new" if it is missing when an object is created', function(){
            var cell2 = Cell();
            expect(cell2 instanceof Cell).toBe(true);
        });

        it('creates a Cell with empty content', function(){
            expect(cell.length()).toBe(0);
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
    });

    describe('Cell::className: class name', function(){
        it('gives the name of the class', function(){
            expect(cell.className).toBe('Cell');
        });
    });

    describe('Cell::style: imposing cell style', function(){
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
    });

    describe('Cell::getStyleProp: method defined in parent class Tag', function(){
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
    });

    describe('Cell::appendStyle(): method defined in the parent class', function(){
        it('appends style if it is given as a string', function(){
            if (cell.style.hasOwnProperty('an-attribute')){
                delete cell.style['an-attribute'];
            }
            cell.appendStyle('an-attribute: attribute-value');
            expect(cell.getStyleProp('an-attribute')).toBe('attribute-value');
        });

        it('appends style if it is given as a Style object', function(){
            var st = new Style();
            st.attribute = 201.29;
            cell.appendStyle(st);
            expect(cell.getStyleProp('attribute')).toBe(201.29);
        });

        it('appends style if it is given as an object', function(){
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.getStyleProp('modular')).toBe('no');
            expect(cell.getStyleProp('speed')).toBe(21.9);
        });

        it('does not overrides non-overlapping attributes', function(){
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

        it('overrides overlapping attributes', function(){
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

    describe('Cell::toLink(): test parent method', function(){
        it('creates a link inside the cell with text content', function(){
            var link = new Link(),
                cell2;
            cell.style = cellStyle;
            cell.attr = cellAttr;
            link.setHref('url-to-world');
            cell.content.elements = ['cell content'];
            cell2 = cell.toLink(link);
            expect(cell2.style.toString()).toBe(cellStyle.toString());
            expect(cell2.attr.toString()).toBe(cellAttr.toString());
            expect(cell2.content.elements.length).toBe(1);
            expect(cell2.content.elements[0] instanceof Link).toBe(true);
            expect(cell2.content.elements[0].getHref()).toBe('url-to-world');
            expect(cell2.content.elements[0].attr).toBe(link.attr);
            expect(cell2.content.elements[0].style).toBe(link.style);
            expect(cell2.content.elements[0].content.elements.length).toBe(1);
            expect(cell2.content.elements[0].content.elements[0]).toBe('cell content');
        });
    });
});

