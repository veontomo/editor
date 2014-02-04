/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, TableCellStyle, Attributes, Style, jasmine, appendStyleToCell */

describe('Cell-related functionality:', function() {
    var cell, cellStyle, cellAttr, cellContent;

    beforeEach(function() {
        cell = new Cell();
        cellStyle = new TableCellStyle();
        cellAttr = new Attributes();
        cellContent = new Content();
    });

    it('creates object with type attribute "Cell"', function(){
        expect(cell.getType()).toBe("Cell");
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
        expect(cell.styleProperty('a property')).toEqual('cell property value');
    });

    it('retrieves property of type "Number" from the style', function() {
        cellStyle['a-property'] = 12.6;
        cell.style = cellStyle;
        expect(cell.styleProperty('a-property')).toEqual(12.6);
    });

    it('retrieves non-existing property from the style', function() {
        if (cellStyle.hasOwnProperty('cell property')) {
            delete cellStyle['cell property'];
        }
        cell.style = cellStyle;
        expect(cell.styleProperty('cell property')).not.toBeDefined();
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
        cell.insert('an item');
        expect(cell.content.elements.length).toBe(1);
        cell.insert('another item');
        expect(cell.content.elements.length).toBe(2);
    });

    describe('appends style to the cell:', function(){
        it('throws an error if the argument is a number', function(){
            expect(function(){
                cell.appendStyle(122321);
            }).toThrow('Wrong argument type! Style, string or Object expected.');
        });
        it('throws an error if the argument is a Boolean', function(){
            expect(function(){
                cell.appendStyle(true);
            }).toThrow('Wrong argument type! Style, string or Object expected.');
            expect(function(){
                cell.appendStyle(false);
            }).toThrow('Wrong argument type! Style, string or Object expected.');
        });
        it('Does not throw an error if the argument is an object', function(){
            expect(function(){
                cell.appendStyle({'a': 10});
            }).not.toThrow('Wrong argument type! Style, string or Object expected.');
        });
        it('Does not throw an error if the argument is a Style object', function(){
            expect(function(){
                cell.appendStyle({'a': 10});
            }).not.toThrow('Wrong argument type! Style, string or Object expected.');
        });
        it('Does not throw an error if the argument is a string', function(){
            expect(function(){
                cell.appendStyle('a string');
            }).not.toThrow('Wrong argument type! Style, string or Object expected.');
        });

        it('Appends style if it is given as a string', function(){
            if (cell.style.hasOwnProperty('an-attribute')){
                delete cell.style['an-attribute'];
            }
            cell.appendStyle('an-attribute: attribute-value');
            expect(cell.styleProperty('an-attribute')).toBe('attribute-value');
        });

        it('Appends style if it is given as a Style object', function(){
            var st = new Style();
            st.attribute = 201.29;
            cell.appendStyle(st);
            expect(cell.styleProperty('attribute')).toBe(201.29);
        });

        it('Appends style if it is given as an object', function(){
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.styleProperty('modular')).toBe('no');
            expect(cell.styleProperty('speed')).toBe(21.9);
        });

        it('Does not overrides non-overlapping attributes', function(){
            var st = new Style();
            st.leverage = 'virtual';
            st.help = 981.87;
            st['knowledge-driven'] = '34';
            cell.style = st;
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.styleProperty('modular')).toBe('no');
            expect(cell.styleProperty('speed')).toBe(21.9);
            expect(cell.styleProperty('leverage')).toBe('virtual');
            expect(cell.styleProperty('help')).toBe(981.87);
            expect(cell.styleProperty('knowledge-driven')).toBe('34');
        });

        it('Overrides overlapping attributes', function(){
            var st = new Style();
            st.leverage = 'virtual';
            st.help = 981.87;
            st['knowledge-driven'] = '34';
            st.modular = 923;
            cell.style = st;
            cell.appendStyle({'modular': 'no', 'speed': 21.9});
            expect(cell.styleProperty('modular')).toBe('no');
            expect(cell.styleProperty('speed')).toBe(21.9);
            expect(cell.styleProperty('leverage')).toBe('virtual');
            expect(cell.styleProperty('help')).toBe(981.87);
            expect(cell.styleProperty('knowledge-driven')).toBe('34');
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

describe('Converts html table cell in to Cell object', function(){
    it('gets styles of the cell', function(){
        var cellHtml = '<td style="color: red; width: 1; strange-attr: haha"></td>',
            cell = cellHtml.createCellFromHtml(),
            st = cell.style;
        expect(st.hasOwnProperty('color')).toBe(true);
        expect(st.color).toBe('red');
        expect(st.hasOwnProperty('width')).toBe(true);
        expect(st.width).toBe(1);
        expect(st.hasOwnProperty('strange-attr')).toBe(true);
        expect(st['strange-attr']).toBe('haha');
    });

    it('gets attributes of the cell', function(){
        var cellHtml = '<td color="red" width="1" strange-attr="haha"></td>',
            cell = cellHtml.createCellFromHtml(),
            attr = cell.attr;
        expect(attr.hasOwnProperty('color')).toBe(true);
        expect(attr.color).toBe('red');
        expect(attr.hasOwnProperty('width')).toBe(true);
        expect(attr.width).toBe("1");
        expect(attr.hasOwnProperty('strange-attr')).toBe(true);
        expect(attr['strange-attr']).toBe('haha');
    });

    it('gets both styles and attributes of the cell', function(){
        var cellHtml = '<td underlined="why not" width="98" strange-attr="wierd" style="color: red; width: 1; strange-param: haha"></td>',
            cell = cellHtml.createCellFromHtml(),
            st = cell.style,
            attr = cell.attr;
        expect(st.hasOwnProperty('color')).toBe(true);
        expect(st.color).toBe('red');
        expect(st.hasOwnProperty('width')).toBe(true);
        expect(st.width).toBe(1);
        expect(st.hasOwnProperty('strange-param')).toBe(true);
        expect(st['strange-param']).toBe('haha');
        expect(attr.hasOwnProperty('underlined')).toBe(true);
        expect(attr.underlined).toBe('why not');
        expect(attr.hasOwnProperty('width')).toBe(true);
        expect(attr.width).toBe("98");
        expect(attr.hasOwnProperty('strange-attr')).toBe(true);
        expect(attr['strange-attr']).toBe('wierd');
    });

    it('gets the correct content of the cell elements', function(){
        var cellHtml = '<td>cell content</td>',
            cell = cellHtml.createCellFromHtml();
        expect(cell.content.elements.length).toBe(1);
        expect(cell.content.elements[0]).toBe('cell content');

        cellHtml = '<td><div>a</div><div>b</div></td>';
        cell = cellHtml.createCellFromHtml();
        expect(cell.content.elements.length).toBe(2);
        expect(cell.content.elements[0]).toBe('<div>a</div>');
        expect(cell.content.elements[1]).toBe('<div>b</div>');

        cellHtml = '<td><div>a</div>plain text<div>b</div></td>';
        cell = cellHtml.createCellFromHtml();
        expect(cell.content.elements.length).toBe(3);
        expect(cell.content.elements[0]).toBe('<div>a</div>');
        expect(cell.content.elements[1]).toBe('plain text');
        expect(cell.content.elements[2]).toBe('<div>b</div>');


        cellHtml = '<td><div>a</div><div>b</div><table><tr><td></td></tr></table></td>';
        cell = cellHtml.createCellFromHtml();
        expect(cell.content.elements.length).toBe(3);
        expect(cell.content.elements[0]).toBe('<div>a</div>');
        expect(cell.content.elements[1]).toBe('<div>b</div>');
    });

    it('recognizes a nested table inside a cell', function(){
        var cellHtml = '<td><table><tr><td></td></tr></table></td>',
            cell = cellHtml.createCellFromHtml();
        expect(cell.content.elements.length).toBe(1);
        expect(cell.content.elements[0].hasOwnProperty('getType')).toBe(true);
        expect(cell.content.elements[0].getType()).toBe('Table');

        cellHtml = '<td>text outside<table><tr><td></td></tr></table></td>';
        cell = cellHtml.createCellFromHtml();
        expect(cell.content.elements.length).toBe(2);
        expect(cell.content.elements[0]).toBe('text outside');
        expect(cell.content.elements[1].hasOwnProperty('getType')).toBe(true);
        expect(cell.content.elements[1].getType()).toBe('Table');
    });
});