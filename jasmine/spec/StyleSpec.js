/*jslint plusplus: true, white: true */
/*global describe, it, xit, expect, spyOn, beforeEach, toString, toString2, setMinMaxWidth, Cell, Row, Table,
Content, TableStyle, TableRowStyle, TableCellStyle, TableAttributes, Attributes, getProperty, Style, Grating, concat, sandwichWith, mergeObjects, concatDropSpaces, appendObject, createTableFromHtml */
describe('String representation', function() {
    it('converts object into an inline style string', function() {
        var Obj1 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {return 'dummy function';}
        },
            Obj2 = {},
            Obj3 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {
                return 'foo';
            },
            'border': 12
        };
        expect(toString(Obj1)).toEqual('width: 10px;color: red;string: 10;');
        expect(toString(Obj2)).toEqual('');
        expect(toString(Obj3)).toEqual('width: 10px;color: red;string: 10;border: 12px;');
        expect(toString(Obj3, 'mm')).toEqual('width: 10mm;color: red;string: 10;border: 12mm;');
    });
});

describe('String representation 2', function() {
    it('converts object into a string', function() {
        var Obj1 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {return 'dummy function';}
        },
            Obj2 = {},
            Obj3 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {
                return 'foo';
            },
            'border': 12
        };
        expect(toString2(Obj1)).toEqual('width="10" color="red" string="10"');
        expect(toString2(Obj2)).toEqual('');
        expect(toString2(Obj3)).toEqual('width="10" color="red" string="10" border="12"');
    });
});

describe('Hotdogs a string', function(){
    it('if a sausage is not empty, inserts it btw the left and right parts', function(){
        expect(sandwichWith('bread ', 'sausage', ' ketchup')).toBe('bread sausage ketchup');
        expect(sandwichWith('bread ', 'sausage')).toBe('bread sausagebread ');
        expect(sandwichWith('', 'sausage', '')).toBe('sausage');
        expect(sandwichWith('', 'sausage')).toBe('sausage');
    });

    it('if a sausage is empty, empty string is returned', function(){
        expect(sandwichWith('bread ', '', ' ketchup')).toBe('');
        expect(sandwichWith('bread ', '')).toBe('');
        expect(sandwichWith('', '')).toBe('');
    });
});

describe('merges two objects', function(){
    it('throws error if at least one of the arguments is not of Object type', function(){
        expect(function(){
            appendObject('a', 1);
        }).toThrow('Both arguments of appendObject must be of Object type!');
    });

    it('merges two objects with non overlapping properties', function(){
        var obj1 = {},
            obj2 = {},
            obj;
        obj1.a = 'value';
        obj1.b = 20.1;
        obj1['a-b'] = '10';
        obj2.e = true;
        obj2.f = 'test';
        obj = appendObject(obj1, obj2);
        expect(obj.a).toBe('value');
        expect(obj.b).toBe(20.1);
        expect(obj['a-b']).toBe('10');
        expect(obj.e).toBe(true);
        expect(obj.f).toBe('test');
    });
    it('merges two objects with some overlapping properties', function(){
        var obj1 = {},
            obj2 = {},
            obj;
        obj1.a = 'value';
        obj1.b = 20.1;
        obj1['a-b'] = '10';
        obj2.a = true;
        obj2.f = 'test';
        obj = appendObject(obj1, obj2);
        expect(obj.a).toBe(true);
        expect(obj.b).toBe(20.1);
        expect(obj['a-b']).toBe('10');
        expect(obj.f).toBe('test');
    });
});

describe('Concatenates elements of array, replacing a multiple spaces with a single one', function(){
    var arr;
    it('concatenates elements of a non-empty array', function(){
        arr = ['element 1', 'element 2', 'element3'];
        expect(concatDropSpaces(arr, ' ')).toBe('element 1 element 2 element3');
        expect(concatDropSpaces(arr, '-')).toBe('element 1-element 2-element3');
        expect(concatDropSpaces(arr)).toBe('element 1 element 2 element3');
        expect(concatDropSpaces(arr, '')).toBe('element 1element 2element3');
    });
    it('concatenates elements of an empty array', function(){
        arr = [];
        expect(concatDropSpaces(arr, ' ')).toBe('');
        expect(concatDropSpaces(arr, '-')).toBe('');
        expect(concatDropSpaces(arr)).toBe('');
        expect(concatDropSpaces(arr, '')).toBe('');
    });
    it('removes trailing spaces', function(){
        arr = ['        element 1', 'element 2', 'element3        '];
        expect(concatDropSpaces(arr, ' ')).toBe('element 1 element 2 element3');
        expect(concatDropSpaces(arr, '-')).toBe('element 1-element 2-element3');
        expect(concatDropSpaces(arr)).toBe('element 1 element 2 element3');
        expect(concatDropSpaces(arr, '')).toBe('element 1element 2element3');
    });
    it('removes spaces if array has a single element', function(){
        arr = ['        '];
        expect(concatDropSpaces(arr, ' ')).toBe('');
        expect(concatDropSpaces(arr, '-')).toBe('');
        expect(concatDropSpaces(arr)).toBe('');
        expect(concatDropSpaces(arr, '')).toBe('');
    });


});

describe('Transforms table attributes into a string', function() {
    it('converts object into a string', function() {
        var ta = new TableAttributes();
        expect(ta.hasOwnProperty('cellpadding')).toBe(true);
        expect(ta.hasOwnProperty('cellspacing')).toBe(true);

        ta.cellpadding = 11;
        ta.cellspacing = "2837";
        expect(ta.toString()).toEqual('cellpadding="11" cellspacing="2837"');

        ta.property = "a property";
        expect(ta.toString()).toEqual('cellpadding="11" cellspacing="2837" property="a property"');

        delete ta.cellpadding;
        expect(ta.toString()).toEqual('cellspacing="2837" property="a property"');

        ta.cellspacing = null; // only string and number valued attributes are displayed
        expect(ta.toString()).toEqual('property="a property"');
    });
});

describe('Getting property from the object', function(){
    it('gets a string-valued property of the object', function(){
        var obj = {'a property': 'property value'};
        expect(getProperty(obj, 'a property')).toEqual('property value');
    });

    it('gets an object-valued property of the object', function(){
        var value = {},
            obj = {'prop': value};
        expect(getProperty(obj, 'prop')).toEqual(value);
    });

    it('throws an error when getting a property of a non-object', function(){
        expect(function(){
            getProperty(1, 'prop');
        }).toThrow('Not an object!');
    });

    it('throws an error when omitting a property name', function(){
        expect(function(){
            getProperty({});
        }).toThrow('Property name missing!');
    });

    it('returns "undefined" if the object does not have the property', function(){
        expect(getProperty({}, 'prop')).not.toBeDefined();
    });
});

describe('creates a style object from a string', function(){
    it('creates styles from a string', function(){
        var s = new Style('a:10; color: some color; another-attr: un altro valore;');
        expect(s.hasOwnProperty('a')).toBe(true);
        expect(s.a).toBe(10);
        expect(s.hasOwnProperty('color')).toBe(true);
        expect(s.color).toBe('some color');
        expect(s.hasOwnProperty('another-attr')).toBe(true);
        expect(s['another-attr']).toBe('un altro valore');
    });
});

describe('creates a style object from an object', function(){
    it('creates styles from a string', function(){
        var s = new Style({'a':10,
            'color': 'some color',
            'another-attr': 'un altro valore',
            'func': function(){return 1;},
            'bool': true
        });
        expect(s.hasOwnProperty('a')).toBe(true);
        expect(s.a).toBe(10);
        expect(s.hasOwnProperty('color')).toBe(true);
        expect(s.color).toBe('some color');
        expect(s.hasOwnProperty('another-attr')).toBe(true);
        expect(s['another-attr']).toBe('un altro valore');
        expect(s.hasOwnProperty('func')).toBe(false);
        expect(s.hasOwnProperty('bool')).toBe(false);
    });
});


describe('creates a style object', function(){
    it('from a string', function(){
        var s = new Style('a:10; color: some color; another-attr: un altro valore;');
        expect(s.hasOwnProperty('a')).toBe(true);
        expect(s.a).toBe(10);
        expect(s.hasOwnProperty('color')).toBe(true);
        expect(s.color).toBe('some color');
        expect(s.hasOwnProperty('another-attr')).toBe(true);
        expect(s['another-attr']).toBe('un altro valore');
    });

    it('from an object', function(){
        var s = new Style({'a':10,
            'color': 'some color',
            'another-attr': 'un altro valore',
            'func': function(){return 1;},
            'bool': true
        });
        expect(s.hasOwnProperty('a')).toBe(true);
        expect(s.a).toBe(10);
        expect(s.hasOwnProperty('color')).toBe(true);
        expect(s.color).toBe('some color');
        expect(s.hasOwnProperty('another-attr')).toBe(true);
        expect(s['another-attr']).toBe('un altro valore');
        expect(s.hasOwnProperty('func')).toBe(false);
        expect(s.hasOwnProperty('bool')).toBe(false);
    });
});


describe('creates an attribute object', function(){
    it('from a string', function(){
        var attr = new Attributes('a:10; color: some color; another-attr: un altro valore;');
        expect(attr.hasOwnProperty('a')).toBe(true);
        expect(attr.a).toBe(10);
        expect(attr.hasOwnProperty('color')).toBe(true);
        expect(attr.color).toBe('some color');
        expect(attr.hasOwnProperty('another-attr')).toBe(true);
        expect(attr['another-attr']).toBe('un altro valore');
    });

    it('from an object', function(){
        var attr = new Attributes({'a':10,
            'color': 'some color',
            'another-attr': 'un altro valore',
            'func': function(){return 1;},
            'bool': true
        });
        expect(attr.hasOwnProperty('a')).toBe(true);
        expect(attr.a).toBe(10);
        expect(attr.hasOwnProperty('color')).toBe(true);
        expect(attr.color).toBe('some color');
        expect(attr.hasOwnProperty('another-attr')).toBe(true);
        expect(attr['another-attr']).toBe('un altro valore');
        expect(attr.hasOwnProperty('func')).toBe(false);
        expect(attr.hasOwnProperty('bool')).toBe(false);
    });

});


describe('appends object attributes to the style object', function(){
    it('throws an error if non-object is given', function(){
        var st = new Style();
        expect(function(){
            st.appendStyle(1);
        }).toThrow('Argument of Object type is expected!');
        expect(function(){
            st.appendStyle('string');
        }).toThrow('Argument of Object type is expected!');
        expect(function(){
            st.appendStyle({});
        }).not.toThrow('Argument of Object type is expected!');
    });

    it('appends non-overlapping properties to the styles', function(){
        var st = new Style();
        st.a = 1;
        st['a key'] = 'key value';
        st.appendStyle({'b': 3.2, 'long key': 'a string'});
        expect(st.hasOwnProperty('a')).toBe(true);
        expect(st.a).toBe(1);
        expect(st.hasOwnProperty('a key')).toBe(true);
        expect(st['a key']).toBe('key value');
        expect(st.hasOwnProperty('b')).toBe(true);
        expect(st.b).toBe(3.2);
        expect(st.hasOwnProperty('long key')).toBe(true);
        expect(st['long key']).toBe('a string');
    });

    it('appends an object that has the same properties', function(){
        var st = new Style();
        st.a = 1;
        st['a key'] = 'key value';
        st.appendStyle({'a': true, 'long key': 'a string'});
        expect(st.hasOwnProperty('a')).toBe(true);
        expect(st.a).toBe(true);
        expect(st.hasOwnProperty('a key')).toBe(true);
        expect(st['a key']).toBe('key value');
        expect(st.hasOwnProperty('long key')).toBe(true);
        expect(st['long key']).toBe('a string');
    });
});

describe('Setting the width property of an object', function(){
    it('sets the width property of an empty object to be equal ot a number', function(){
        var obj = {},
            value = 10.6;
        expect(obj.hasOwnProperty('width')).toBe(false);
        expect(obj.hasOwnProperty('min-width')).toBe(false);
        expect(obj.hasOwnProperty('max-width')).toBe(false);

        setMinMaxWidth(obj, value);
        expect(obj.width).toEqual(value);
        expect(obj.hasOwnProperty('width')).toBe(true);
        expect(obj.hasOwnProperty('min-width')).toBe(true);
        expect(obj.hasOwnProperty('max-width')).toBe(true);
        expect(obj.width).toEqual(value);
        expect(obj['min-width']).toEqual(value);
        expect(obj['max-width']).toEqual(value);
    });
    it('sets the width property of an empty object to be equal to a string', function(){
        var obj = {},
            value = "width";

        setMinMaxWidth(obj, value);
        expect(obj.hasOwnProperty('width')).toBe(true);
        expect(obj.hasOwnProperty('min-width')).toBe(true);
        expect(obj.hasOwnProperty('max-width')).toBe(true);
        expect(obj.width).toEqual(value);
        expect(obj['min-width']).toEqual(value);
        expect(obj['max-width']).toEqual(value);
    });
    it('sets the width property of an empty object to be equal to an object', function(){
        var obj = {},
            value = {name: 'foo'};

        setMinMaxWidth(obj, value);
        expect(obj.hasOwnProperty('width')).toBe(true);
        expect(obj.hasOwnProperty('min-width')).toBe(true);
        expect(obj.hasOwnProperty('max-width')).toBe(true);
        expect(obj.width).toEqual(value);
        expect(obj['min-width']).toEqual(value);
        expect(obj['max-width']).toEqual(value);
    });

    it('throws an error when width argument is not set', function(){
        var obj = {};
        expect(function(){setMinMaxWidth(obj);}).toThrow("Width value is not set!");
        expect(obj.hasOwnProperty('width')).toBe(false);
        expect(obj.hasOwnProperty('min-width')).toBe(false);
        expect(obj.hasOwnProperty('max-width')).toBe(false);
    });

    it('throws an error if the target is not of Object type', function(){
        expect(function(){setMinMaxWidth('a string');}).toThrow('Can not set a property of a non-object!');
        expect(function(){setMinMaxWidth();}).toThrow('Can not set a property of a non-object!');
    });
});

describe('Content', function() {
    var content, elem0, elem1, elem2, elem3, htmlContent;
    beforeEach(function() {
        elem0 = 10.1;
        elem1 = 'element2';
        elem2 = {'a dummy method': 1};
        elem3 = {};
        content = new Content();
        elem2.toHtml = function(){
            return 'fake';
        };
        spyOn(elem3, 'hasOwnProperty').andCallFake(function(){
            return false;
        });
    });

    it('gives the number of elements it contains', function() {
        content.elements = [];
        expect(content.length()).toEqual(0);
        content.elements = [elem0, elem1, elem2, elem3];
        expect(content.length()).toEqual(4);
        content.elements = [elem2, elem1];
        expect(content.length()).toEqual(2);
    });

    it('toHtml produces a string', function() {
        content.elements = [];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe('string');
        expect(htmlContent).toEqual('');
        content.elements = [elem0, elem1];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent).toEqual('10.1element2');
        content.elements = [elem0, elem1, elem2];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent).toBe('10.1element2fake');
    });

    it('if one of the elements has no toHtml property', function() {
        content.elements = [elem1, elem2, elem3];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent).toBe('element2fake<!-- no html representation -->');
    });

    it('if "elements" property contains a unique object with no toHtml property', function() {
        content.elements = [elem3];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent).toBe('<!-- no html representation -->');
    });
});


describe('Cell-related functionality', function() {
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

describe('Row-related functionality', function(){
    var row, rowAttr, rowStyle, cell1, cell2, cell3, cell4;
    beforeEach(function(){
        cell1 = new Cell();
        cell2 = new Cell();
        cell3 = new Cell();
        cell4 = new Cell();
        row = new Row();
        rowAttr = new Attributes();
        rowStyle = new TableRowStyle();
    });

    it('creates object with type attribute "table row object"', function(){
        expect(row.getType()).toBe("Row");
    });


    it('retrieves property of type "string" from the style', function() {
        rowStyle['a property'] = 'row property value';
        row.style = rowStyle;
        expect(row.styleProperty('a property')).toEqual('row property value');
    });

    it('retrieves property of type "Number" from the style', function() {
        rowStyle['a-property'] = 12.6;
        row.style = rowStyle;
        expect(row.styleProperty('a-property')).toEqual(12.6);
    });

    it('retrieves non-existing property from the style', function() {
        if (rowStyle.hasOwnProperty('row property')) {
            delete rowStyle['row property'];
        }
        row.style = rowStyle;
        expect(row.styleProperty('row property')).not.toBeDefined();
    });

    it('sets the width of the row', function(){
        row.setWidth(15);
        expect(row.styleProperty('width')).toEqual(15);
        expect(row.styleProperty('min-width')).toEqual(15);
        expect(row.styleProperty('max-width')).toEqual(15);
        expect(row.attr.width).toEqual(15);
    });

    it('throws exception if a non-Cell object is appended to the row cells', function(){
       var cell = new Cell();
       // prentend that the cell is not a cell
       spyOn(cell, 'getType').andCallFake(function(){
           return "not a cell";
       });
       expect(function(){
           row.appendCell(cell);
       }).toThrow('The argument is not of the Cell type!');
    });


    it('appends a cell to the existing cells', function(){
       expect(row.cells.length).toBe(0);
       row.appendCell(cell1);
       expect(row.cells.length).toBe(1);
       row.appendCell(cell2);
       expect(row.cells.length).toBe(2);
       row.appendCell(cell3);
       expect(row.cells.length).toBe(3);
    });

    it('gets widths of the cells', function(){
        spyOn(cell1, 'getWidth').andCallFake(function(){
            return 'cell 1 width';
        });
        spyOn(cell2, 'getWidth').andCallFake(function(){
            return 'cell 2 width';
        });

        row.cells = [cell1, cell2];
        expect(row.getCellWidths().length).toBe(2);
        expect(row.getCellWidths()[0]).toBe('cell 1 width');
        expect(row.getCellWidths()[1]).toBe('cell 2 width');

        row.cells = [cell1];
        expect(row.getCellWidths().length).toBe(1);
        expect(row.getCellWidths()[0]).toBe('cell 1 width');

        row.cells = [];
        expect(row.getCellWidths().length).toBe(0);
    });

    it('calls corresponding methods to set widths of the cells of the row', function(){
        spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell3, 'setWidth').andCallFake(function(){return null;});
        row.cells = [cell1, cell2, cell3];
        row.setCellWidths([1, 12, 0.11]);
        expect(cell1.setWidth).toHaveBeenCalledWith(1);
        expect(cell2.setWidth).toHaveBeenCalledWith(12);
        expect(cell3.setWidth).toHaveBeenCalledWith(0.11);
    });

    it('does not call methods to set cell widths if input array length is different from the cells number', function(){
        spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
        row.cells = [cell1, cell2];
        row.setCellWidths([235, 211, 21]);
        expect(cell1.setWidth).not.toHaveBeenCalled();
        expect(cell2.setWidth).not.toHaveBeenCalled();
    });

    it('does not call methods to set cell widths if input array length is different from the cells number', function(){
        spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell3, 'setWidth').andCallFake(function(){return null;});
        row.cells = [cell1, cell2, cell3];
        row.setCellWidths([235, 211]);
        expect(cell1.setWidth).not.toHaveBeenCalled();
        expect(cell2.setWidth).not.toHaveBeenCalled();
        expect(cell3.setWidth).not.toHaveBeenCalled();
    });

    it('deletes the right-most cell in the row', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        row.cells = [cell1, cell2, cell3];
        row.dropCell(0);
        expect(row.cells.length).toBe(2);
        expect(row.cells[0].getWidth()).toBe(310);
        expect(row.cells[1].getWidth()).toBe(150);
    });

    it('deletes a middle cell in the row', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        cell4.setWidth(50);
        row.cells = [cell1, cell2, cell3, cell4];
        row.dropCell(1);
        expect(row.cells.length).toBe(3);
        expect(row.cells[0].getWidth()).toBe(200);
        expect(row.cells[1].getWidth()).toBe(260);
        expect(row.cells[2].getWidth()).toBe(50);
    });

    it('deletes the left-most cell in the row', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        cell4.setWidth(60);
        row.cells = [cell1, cell2, cell3, cell4];
        row.dropCell(3);
        expect(row.cells.length).toBe(3);
        expect(row.cells[0].getWidth()).toBe(200);
        expect(row.cells[1].getWidth()).toBe(110);
        expect(row.cells[2].getWidth()).toBe(210);
    });

    it('when asked to delete a non-existing cell (cell number corresponds to a non-existing cell), nothing is done to the table', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        row.cells = [cell1, cell2, cell3];
        row.dropCell(row.cells.length + 10); // delete non-existing cell
        expect(row.cells.length).toBe(3);
        expect(row.cells[0].getWidth()).toBe(200);
        expect(row.cells[1].getWidth()).toBe(110);
        expect(row.cells[2].getWidth()).toBe(150);
    });

    it('gets the number of cells in the row', function(){
        row.cells = [cell1, cell2, cell3];
        expect(row.cellNum()).toBe(3);
        row.cells = [cell3, cell1];
        expect(row.cellNum()).toBe(2);
        row.cells = [];
        expect(row.cellNum()).toBe(0);
    });

    it('generates html code of the row if attributes and styles are not empty', function(){
        spyOn(cell1, 'toHtml').andCallFake(function(){
            return 'cell 1 ';
        });
        spyOn(cell2, 'toHtml').andCallFake(function(){
            return 'cell 2 html ';
        });
        spyOn(cell3, 'toHtml').andCallFake(function(){
            return 'cell 3 content';
        });

        spyOn(rowAttr, 'toString').andCallFake(function(){
            return 'row attributes';
        });
        spyOn(rowStyle, 'toString').andCallFake(function(){
            return 'row styles';
        });
        row.attr = rowAttr;
        row.style = rowStyle;
        row.cells = [cell1, cell2, cell3];
        expect(row.toHtml()).toEqual('<tr row attributes style="row styles">cell 1 cell 2 html cell 3 content</tr>');
    });

    it('generates html code of the row if attribute is empty', function(){
        cell1 = new Cell();

        spyOn(cell1, 'toHtml').andCallFake(function(){
            return 'cell 1';
        });

        spyOn(rowAttr, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(rowStyle, 'toString').andCallFake(function(){
            return 'row styles';
        });
        row.attr = rowAttr;
        row.style = rowStyle;
        row.cells = [cell1];
        expect(row.toHtml()).toEqual('<tr style="row styles">cell 1</tr>');
    });

    it('generates html code of the row if the style is empty', function(){
        // var cell1 = new Cell();

        spyOn(cell1, 'toHtml').andCallFake(function(){
            return 'cell 1';
        });

        spyOn(rowAttr, 'toString').andCallFake(function(){
            return 'row attributes';
        });
        spyOn(rowStyle, 'toString').andCallFake(function(){
            return '';
        });
        row.attr = rowAttr;
        row.style = rowStyle;
        row.cells = [cell1];
        expect(row.toHtml()).toEqual('<tr row attributes>cell 1</tr>');
    });

    it('loads info from html representation of the row', function(){
        spyOn(row, 'setStyle');
        spyOn(row, 'setAttr');
        var rowHtml = '<tr style="table row style" rowattr1="attribute value" rowattr2="another attribute value"><td></td></tr>';
        row.loadFromHtml(rowHtml);

        expect(row.setStyle).toHaveBeenCalledWith('table row style');
        expect(row.setAttr).toHaveBeenCalledWith({
            'rowattr1': "attribute value",
            'rowattr2': 'another attribute value'
        });
    });
});

describe('Table-related functionality', function(){
    var table, tableAttr, tableStyle, row1, row2, row3,
        bogusTableAttr, bogusTableStyle, bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle;
    beforeEach(function(){
        table = new Table();
        tableAttr = new Attributes();
        tableStyle = new TableStyle();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
        bogusTableAttr = new Attributes();
        bogusTableStyle = new Style();
        bogusRowAttr  = new Attributes();
        bogusRowStyle  = new Style();
        bogusCellAttr  = new Attributes();
        bogusCellStyle  = new Style();
    });

    it('creates object of type "Table"', function(){
        expect(table.getType()).toBe("Table");
    });

    it('retrieves property of type "string" from the style', function() {
         tableStyle['a property'] = 'table property value';
         table.style = tableStyle;
         expect(table.styleProperty('a property')).toEqual('table property value');
     });

    it('retrieves property of type "Number" from the style', function() {
        tableStyle['a-property'] = 12.6;
        table.style = tableStyle;
        expect(table.styleProperty('a-property')).toEqual(12.6);
    });

    it('retrieves non-existing property from the style', function() {
        if (tableStyle.hasOwnProperty('a table property')) {
            delete tableStyle['a table property'];
        }
        table.style = tableStyle;
        expect(table.styleProperty('a table property')).not.toBeDefined();
    });

    it('sets the width of the table', function(){
        table.setWidth(15);
        expect(table.styleProperty('width')).toEqual(15);
        expect(table.styleProperty('min-width')).toEqual(15);
        expect(table.styleProperty('max-width')).toEqual(15);
        expect(table.attr.width).toEqual(15);
    });

    it('throws exception if a non-Row type is appended to the rows', function(){
        // prentend that the row is not a row
        spyOn(row1, 'getType').andCallFake(function(){
            return "not a row";
        });
        expect(function(){
            table.appendRow(row1);
        }).toThrow('The argument is not of the Row type!');
     });

    it('gets "matrix" of widths', function(){
        spyOn(row1, 'getCellWidths').andCallFake(function(){
            return 'cell widths of row 1';
        });
        spyOn(row2, 'getCellWidths').andCallFake(function(){
            return 'cell widths of row 2';
        });
        spyOn(row3, 'getCellWidths').andCallFake(function(){
            return 'cell widths of row 3';
        });
        table.rows = [row1, row2, row3];
        expect(table.getMatrix().length).toBe(3);
        expect(table.getMatrix()[0]).toBe('cell widths of row 1');
        expect(table.getMatrix()[1]).toBe('cell widths of row 2');
        expect(table.getMatrix()[2]).toBe('cell widths of row 3');

        table.rows = [row1, row3];
        expect(table.getMatrix().length).toBe(2);
        expect(table.getMatrix()[0]).toBe('cell widths of row 1');
        expect(table.getMatrix()[1]).toBe('cell widths of row 3');

        table.rows = [];
        expect(table.getMatrix().length).toBe(0);
    });

    it('sets "profile" of the table', function(){
        spyOn(row1, 'setCellWidths').andCallFake(function(){return null;});
        spyOn(row2, 'setCellWidths').andCallFake(function(){return null;});
        spyOn(row3, 'setCellWidths').andCallFake(function(){return null;});
        table.rows = [row1, row2, row3];
        table.setProfile('anything');
        expect(row1.setCellWidths).toHaveBeenCalledWith('anything');
        expect(row2.setCellWidths).toHaveBeenCalledWith('anything');
        expect(row3.setCellWidths).toHaveBeenCalledWith('anything');
    });

    it('gets profile of the table with not the same cell width among the table rows', function(){
        spyOn(table, 'isSameWidths').andCallFake(function(){
            return false;
        });
        expect(table.getProfile()).toBe(null);
    });

    it('gets profile of the table with the same cell width among the table rows', function(){
        spyOn(table, 'isSameWidths').andCallFake(function(){
            return true;
        });
        // if Table::isSameWidth returns true, only first element of getMatrix will be considered
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[6, 400, 3], "whatever it is"];
        });

        var profile = table.getProfile();
        expect(profile.length).toBe(3);
        expect(profile[0]).toBe(6);
        expect(profile[1]).toBe(400);
        expect(profile[2]).toBe(3);
    });

    it('decides whether the rows have the same "cell profile"', function(){
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[1, 2, 3], [1, 2, 3]];
        });
        expect(table.isSameWidths()).toBe(true);

        table = new Table();
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[], [1, 2, 3]];
        });
        expect(table.isSameWidths()).toBe(false);

        table = new Table();
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[], []];
        });
        expect(table.isSameWidths()).toBe(true);
    });

    it('calls a method of the Row() object to delete a column', function(){
        spyOn(row1, 'dropCell').andCallFake(function(){return null;});
        spyOn(row2, 'dropCell').andCallFake(function(){return null;});
        spyOn(row3, 'dropCell').andCallFake(function(){return null;});
        table.rows = [row1, row2, row3];
        table.dropColumn(0);
        expect(row1.dropCell).toHaveBeenCalled();
        expect(row2.dropCell).toHaveBeenCalled();
        expect(row3.dropCell).toHaveBeenCalled();
        // the number of rows remains the same
        expect(table.rows.length).toBe(3);
    });

    it('appends a row to the existing rows', function(){
        expect(table.rows.length).toBe(0);
        table.appendRow(row1);
        expect(table.rows.length).toBe(1);
        table.appendRow(row3);
        expect(table.rows.length).toBe(2);
        table.appendRow(row3);
        expect(table.rows.length).toBe(3);
    });

    it('generates html code of the table if attribute and style properties are both present', function(){
        spyOn(row1, 'toHtml').andCallFake(function(){
            return 'row 1 ';
        });
        spyOn(row2, 'toHtml').andCallFake(function(){
            return 'row 2 html ';
        });
        spyOn(row3, 'toHtml').andCallFake(function(){
            return 'row 3 content';
        });

        spyOn(tableAttr, 'toString').andCallFake(function(){
            return 'attributes for the table';
        });
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return 'table styles';
        });
        table.attr = tableAttr;
        table.style = tableStyle;
        table.rows = [row1, row2, row3];
        expect(table.toHtml()).toEqual('<table attributes for the table style="table styles">row 1 row 2 html row 3 content</table>');
    });

    it('generates html code of the table if style property is empty', function(){
         spyOn(row1, 'toHtml').andCallFake(function(){
             return 'row 1 ';
         });
         spyOn(row2, 'toHtml').andCallFake(function(){
             return 'row 2 html ';
         });
         spyOn(row3, 'toHtml').andCallFake(function(){
             return 'row 3 content';
         });

         spyOn(tableAttr, 'toString').andCallFake(function(){
             return 'table attributes';
         });
         spyOn(tableStyle, 'toString').andCallFake(function(){
             return '';
         });
         table.attr = tableAttr;
         table.style = tableStyle;
         table.rows = [row1, row2, row3];
         expect(table.toHtml()).toEqual('<table table attributes>row 1 row 2 html row 3 content</table>');
    });

    it('generates html code of the table if attribute property is empty', function(){
        spyOn(row1, 'toHtml').andCallFake(function(){
            return 'row 1 ';
        });
        spyOn(row2, 'toHtml').andCallFake(function(){
            return 'row 2 html ';
        });
        spyOn(row3, 'toHtml').andCallFake(function(){
            return 'row 3 content';
        });

        spyOn(tableAttr, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return 'table styles';
        });
        table.attr = tableAttr;
        table.style = tableStyle;
        table.rows = [row1, row2, row3];
        expect(table.toHtml()).toEqual('<table style="table styles">row 1 row 2 html row 3 content</table>');
    });

    it('generates html code of the table if both attribute and style properties are empty', function(){
        spyOn(row1, 'toHtml').andCallFake(function(){
            return 'row 1 ';
        });
        spyOn(row2, 'toHtml').andCallFake(function(){
            return 'row 2 html ';
        });
        spyOn(row3, 'toHtml').andCallFake(function(){
            return 'row 3 content';
        });

        spyOn(tableAttr, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return '';
        });
        table.attr = tableAttr;
        table.style = tableStyle;
        table.rows = [row1, row2, row3];
        expect(table.toHtml()).toEqual('<table>row 1 row 2 html row 3 content</table>');
    });


    it('generates html code of the framed table: all bogus attributes and styles are present', function(){
        spyOn(row1, 'toHtml').andCallFake(function(){
            return 'row 1';
        });
        spyOn(row2, 'toHtml').andCallFake(function(){
            return 'row 2 html';
        });
        spyOn(tableAttr, 'toString').andCallFake(function(){
            return 'table attr';
        });
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return 'table styles';
        });
        spyOn(bogusTableStyle, 'toString').andCallFake(function(){
            return 'bogus table styles';
        });
        spyOn(bogusTableAttr, 'toString').andCallFake(function(){
            return 'bogus table attributes';
        });
        spyOn(bogusCellStyle, 'toString').andCallFake(function(){
            return 'bogus cell styles';
        });
        spyOn(bogusCellAttr, 'toString').andCallFake(function(){
            return 'bogus cell attributes';
        });
        spyOn(bogusRowStyle, 'toString').andCallFake(function(){
            return 'bogus row styles';
        });
        spyOn(bogusRowAttr, 'toString').andCallFake(function(){
            return 'bogus row attributes';
        });

        table.attr = tableAttr;
        table.style = tableStyle;
        table.rows = [row1, row2];
        table.bogusRowAttr = bogusRowAttr;
        table.bogusRowStyle = bogusRowStyle;
        table.bogusCellAttr = bogusCellAttr;
        table.bogusCellStyle = bogusCellStyle;
        table.bogusTableAttr = bogusTableAttr;
        table.bogusTableStyle = bogusTableStyle;

        expect(table.toHtml()).toEqual('<table table attr style="table styles"><tr bogus row attributes style="bogus row styles"><td bogus cell attributes style="bogus cell styles"><table bogus table attributes style="bogus table styles">row 1</table></td></tr><tr bogus row attributes style="bogus row styles"><td bogus cell attributes style="bogus cell styles"><table bogus table attributes style="bogus table styles">row 2 html</table></td></tr></table>');
    });


    it('generates html code of the framed table: bogus attributes are present, styles - not', function(){
        spyOn(row1, 'toHtml').andCallFake(function(){
            return 'row 1';
        });
        spyOn(row2, 'toHtml').andCallFake(function(){
            return 'row 2 html';
        });
        spyOn(tableAttr, 'toString').andCallFake(function(){
            return 'table attr';
        });
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return 'table styles';
        });
        spyOn(bogusTableStyle, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(bogusTableAttr, 'toString').andCallFake(function(){
            return 'bogus table attributes';
        });
        spyOn(bogusCellStyle, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(bogusCellAttr, 'toString').andCallFake(function(){
            return 'bogus cell attributes';
        });
        spyOn(bogusRowStyle, 'toString').andCallFake(function(){
            return '';
        });
        spyOn(bogusRowAttr, 'toString').andCallFake(function(){
            return 'bogus row attributes';
        });

        table.attr = tableAttr;
        table.style = tableStyle;
        table.rows = [row1, row2];
        table.bogusRowAttr = bogusRowAttr;
        table.bogusRowStyle = bogusRowStyle;
        table.bogusCellAttr = bogusCellAttr;
        table.bogusCellStyle = bogusCellStyle;
        table.bogusTableAttr = bogusTableAttr;
        table.bogusTableStyle = bogusTableStyle;
        expect(table.toHtml()).toEqual('<table table attr style="table styles"><tr bogus row attributes><td bogus cell attributes><table bogus table attributes>row 1</table></td></tr><tr bogus row attributes><td bogus cell attributes><table bogus table attributes>row 2 html</table></td></tr></table>');
    });


    it('sets the default values for the table border', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder();
        expect(table.style['border-width']).toBeDefined();
        expect(table.style['border-color']).toBeDefined();
        expect(table.style['border-style']).toBeDefined();
        expect(table.attr.border).toBeDefined();
    });

    it('sets a border of the table', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'width': 1, 'color': 'red', 'style': 'solid'});
        expect(table.style['border-width']).toBe(1);
        expect(table.style['border-color']).toBe('red');
        expect(table.style['border-style']).toBe('solid');
        expect(table.attr.border).toBeDefined();
    });

    it('sets a border of the table form incomplete input: no width', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'color': 'red', 'style': 'solid'});
        expect(table.style['border-width']).toBeDefined();
        expect(table.style['border-color']).toBe('red');
        expect(table.style['border-style']).toBe('solid');
        expect(table.attr.border).toBeDefined();
    });

    it('sets a border of the table form incomplete input: no color', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'width': 9, 'style': 'solid'});
        expect(table.style['border-color']).toBeDefined();
        expect(table.style['border-width']).toBe(9);
        expect(table.style['border-style']).toBe('solid');
        expect(table.attr.border).toBe(9);
    });

    it('sets a border of the table form incomplete input: no style', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'width': 19, 'color': 'nice color'});
        expect(table.style['border-width']).toBe(19);
        expect(table.style['border-color']).toBe('nice color');
        expect(table.style['border-style']).toBeDefined();
        expect(table.attr.border).toBe(19);
    });

    it('resets the border of the table', function(){
        // setting up the border-related properties to some dumb values
        table.style['border-width'] = 'border width';
        table.style['border-color'] = 'border color';
        table.style['border-style'] = 'border style';
        table.attr.border = 'border';
        // remove border
        expect(table.hasOwnProperty('removeBorder')).toBe(true);
        table.removeBorder();

        expect(table.style.hasOwnProperty('border-width')).toBe(false);
        expect(table.style.hasOwnProperty('border-color')).toBe(false);
        expect(table.style.hasOwnProperty('border-style')).toBe(true);
        expect(table.style['border-style']).toBe('none');
        expect(table.attr.hasOwnProperty('border')).toBe(false);
    });


    it('gives the number of the column in the table: all columns have the same number of cells', function(){
        spyOn(row1, 'cellNum').andCallFake(function(){
            return 5;
        });
        spyOn(row2, 'cellNum').andCallFake(function(){
            return 5;
        });
        spyOn(row3, 'cellNum').andCallFake(function(){
            return 5;
        });

        table.rows = [row1, row2, row3];
        expect(table.colNum()).toBe(5);
        expect(row1.cellNum).toHaveBeenCalled();
        expect(row2.cellNum).toHaveBeenCalled();
        expect(row3.cellNum).toHaveBeenCalled();
    });


    it('gives the number of the column in the table: columns have different number of cells', function(){
        spyOn(row1, 'cellNum').andCallFake(function(){
            return 3;
        });
        spyOn(row2, 'cellNum').andCallFake(function(){
            return 2;
        });
        spyOn(row3, 'cellNum').andCallFake(function(){
            return 3;
        });

        table.rows = [row1, row2, row3];
        expect(table.colNum()).toBe(null);
        expect(row1.cellNum).toHaveBeenCalled();
        expect(row2.cellNum).toHaveBeenCalled();
        expect(row3.cellNum).not.toHaveBeenCalled(); // not necessary
    });

    it('gives the number of the column in the table with empty rows', function(){
        spyOn(row1, 'cellNum').andCallFake(function(){
            return 0;
        });
        spyOn(row2, 'cellNum').andCallFake(function(){
            return 0;
        });

        table.rows = [row1, row2];
        expect(table.colNum()).toBe(0);
        expect(row1.cellNum).toHaveBeenCalled();
        expect(row2.cellNum).toHaveBeenCalled();
    });

    it('gives the number of the column in the table with a single row', function(){
        spyOn(row1, 'cellNum').andCallFake(function(){
            return 20;
        });
        table.rows = [row1];
        expect(table.colNum()).toBe(20);
        expect(row1.cellNum).toHaveBeenCalled();
    });

    it('says that the table is framed if at least one of the properties is set', function(){
        expect(table.isFramed()).toBe(false);
        table.bogusTableStyle = 'anything';
        expect(table.isFramed()).toBe(true);

        table = new Table();
        expect(table.isFramed()).toBe(false);
        table.bogusTableAttr = 'anything';
        table.bogusRowAttr = 'whatever';
        expect(table.isFramed()).toBe(true);

        table = new Table();
        expect(table.isFramed()).toBe(false);
        table.bogusTableAttr = 'anything';
        table.bogusTableStyle = 'whatever';
        table.bogusRowStyle = 'anything';
        table.bogusRowAttr = 'whatever';
        table.bogusCellAttr = 'anything';
        table.bogusCellStyle = 'whatever';
        expect(table.isFramed()).toBe(true);
    });

    it('removes the properties that make the table be framed', function(){
        expect(table.isFramed()).toBe(false);
        table.bogusTableAttr = 'anything';
        expect(table.isFramed()).toBe(true);

        table.removeFrame();
        expect(table.isFramed()).toBe(false);

        // remove again
        table.removeFrame();
        expect(table.isFramed()).toBe(false);
    });
});

describe('Transform html table to an object', function(){
    it('creates Table object if data-marker attribute is not set', function(){
        var htmlTable = '<table><tbody><tr><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
    });

    it('retrieves styles of the Table object', function(){
        var htmlTable = '<table style="color:red;"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
        expect(obj1.style.hasOwnProperty('color')).toBe(true);
        expect(obj1.style.color).toBe('red');
    });

    it('retrieves multiple styles of the Table object', function(){
        var htmlTable = '<table style="color:red;border-style:solid"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml(),
            style = obj1.style;
        expect(obj1.getType()).toBe('Table');
        expect(style.hasOwnProperty('color')).toBe(true);
        expect(style.color).toBe('red');
        expect(style.hasOwnProperty('border-style')).toBe(true);
        expect(style['border-style']).toBe('solid');
    });

    it('retrieves attributes of the Table object', function(){
        var htmlTable = '<table style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml(),
            attr = obj1.attr;
        expect(obj1.getType()).toBe('Table');
        expect(attr.hasOwnProperty('width')).toBe(true);
        expect(attr.width).toBe('30');
        expect(attr.hasOwnProperty('border')).toBe(true);
        expect(attr.border).toBe('table border');
    });

    it('retrieves rows', function(){
        var htmlTable = '<table data-marker="table"><tbody><tr><td>row 1 cell 1</td><td>row 1 cell 2</td></tr><tr><td>row 2 cell 1</td><td>row 2 cell 2</td></tr></tbody></table>',
            obj = htmlTable.createTableFromHtml();
        expect(obj.getType()).toBe('Table');
        expect(obj.rows.length).toBe(2);
    });

    it('recognizes framed table with all styles and attributes', function(){
        // a framed table with 2 rows and 3 cells in each row
        var framedTable = '<table cohesion="Retinoid" thermal-modulation="87"\
                                style="embrace: metrics; scenarios: orthogonal">  \
            <tbody>  \
                <tr reflex="low" honor="20" style="double-trouble: no;hierarchy: seamless;"> \
                    <td multimedia="Organic and natural" paradigm="Assimilated 24/7" \
                        style="total: interactive; secured: line; next: generation"> \
                    <table asynchronous="solid" style="digitized: systematic;  synergy: 20"> \
                        <tbody> \
                            <tr style="structure: executive; attitude: oriented" secured="line">  \
                                <td  sharable="explicit"  style="benchmark: 29px;margin: 0px;">Row 1 cell 1</td> \
                                <td  dynamic="Focused"  style="firmware: 13.21">Row 1 cell 2</td> \
                                <td  function="Progressive" moratorium="hybrid" \
                                    style="service-desk: 29px;capacity: 0px;">Row 1 cell 3</td> \
                            </tr> \
                        </tbody> \
                    </table> \
                    </td> \
                </tr> \
                <tr reflex="low" honor="20" style="double-trouble: no;hierarchy: seamless;"> \
                    <td multimedia="Organic and natural" paradigm="Assimilated 24/7" \
                        style="total: interactive; secured: line; next: generation"> \
                    <table asynchronous="solid" style="digitized: systematic;  synergy: 20"> \
                        <tbody> \
                            <tr style="workforce: oriented; width: 235px" focus="group">  \
                                <td  open="secondary"  style="upward: trending;margin: 0px;">Row 2 cell 1</td> \
                                <td  moratorium="dynamic"  style="firmware: composite; protocol: advanced">Row 2 cell 2</td> \
                                <td  complexity="regional" audio="lingual" \
                                    style="Verbarmetabola: false; retiform: enabled;">Row 2 cell 3</td> \
                            </tr> \
                        </tbody> \
                    </table> \
                    </td> \
                </tr> \
            </tbody> \
        </table>',
            tableObj        = framedTable.createTableFromHtml(),
            tableStyle      = tableObj.style,
            tableAttr       = tableObj.attr,
            bogusRowAttr    = tableObj.bogusRowAttr,
            bogusRowStyle   = tableObj.bogusRowStyle,
            bogusCellAttr   = tableObj.bogusCellAttr,
            bogusCellStyle  = tableObj.bogusCellStyle,
            bogusTableAttr  = tableObj.bogusTableAttr,
            bogusTableStyle = tableObj.bogusTableStyle,
            row1, row1Style, row1Attr, row2, row2Style, row2Attr,
            c11, c12, c13, c21, c22, c23;

            expect(tableObj.rows.length).toBe(2);
            expect(tableObj.colNum()).toBe(3);

            expect(tableStyle.embrace).toBe('metrics');
            expect(tableStyle.scenarios).toBe('orthogonal');
            expect(tableAttr.cohesion).toBe('Retinoid');
            expect(tableAttr['thermal-modulation']).toBe('87');

            expect(bogusRowStyle['double-trouble']).toBe('no');
            expect(bogusRowStyle.hierarchy).toBe('seamless');
            expect(bogusRowAttr.reflex).toBe('low');
            expect(bogusRowAttr.honor).toBe('20');

            expect(bogusCellStyle.total).toBe('interactive');
            expect(bogusCellStyle.secured).toBe('line');
            expect(bogusCellStyle.next).toBe('generation');
            expect(bogusCellAttr.multimedia).toBe('Organic and natural');
            expect(bogusCellAttr.paradigm).toBe('Assimilated 24/7');

            expect(bogusTableStyle.digitized).toBe('systematic');
            expect(bogusTableStyle.synergy).toBe(20);
            expect(bogusTableAttr.asynchronous).toBe('solid');

            // row 1:
            row1 = tableObj.rows[0];
            row1Style = row1.style;
            row1Attr = row1.attr;
            expect(row1Style.structure).toBe('executive');
            expect(row1Style.attitude).toBe('oriented');
            expect(row1Attr.secured).toBe('line');

            c11 = row1.cells[0];
            expect(c11.style.benchmark).toBe(29);
            expect(c11.style.margin).toBe('0px');
            expect(c11.attr.sharable).toBe('explicit');
            expect(c11.content.elements[0]).toBe('Row 1 cell 1');

            c12 = row1.cells[1];
            expect(c12.style.firmware).toBe(13.21);
            expect(c12.attr.dynamic).toBe('Focused');
            expect(c12.content.elements[0]).toBe('Row 1 cell 2');

            c13 = row1.cells[2];
            expect(c13.style['service-desk']).toBe(29);
            expect(c13.style.capacity).toBe('0px');
            expect(c13.attr.function).toBe('Progressive');
            expect(c13.attr.moratorium).toBe('hybrid');
            expect(c13.content.elements[0]).toBe('Row 1 cell 3');

            // row 2:
            row2 = tableObj.rows[1];
            row2Style = row2.style;
            row2Attr = row2.attr;
            expect(row2Style.workforce).toBe('oriented');
            expect(row2Style.width).toBe(235);
            expect(row2Attr.focus).toBe('group');

            c21 = row2.cells[0];
            expect(c21.style.upward).toBe('trending');
            expect(c21.style.margin).toBe('0px');
            expect(c21.attr.open).toBe('secondary');
            expect(c21.content.elements[0]).toBe('Row 2 cell 1');

            c22 = row2.cells[1];
            expect(c22.style.firmware).toBe('composite');
            expect(c22.style.protocol).toBe('advanced');
            expect(c22.attr.moratorium).toBe('dynamic');
            expect(c22.content.elements[0]).toBe('Row 2 cell 2');


            c23 = row2.cells[2];
            expect(c23.style.Verbarmetabola).toBe('false');
            expect(c23.style.retiform).toBe('enabled');
            expect(c23.attr.complexity).toBe('regional');
            expect(c23.attr.audio).toBe('lingual');
            expect(c23.content.elements[0]).toBe('Row 2 cell 3');
    });
});

describe('decides whether the html code corresponds to a framed table or not', function(){
    it('1 x 1 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('1 x 3 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('3 x 1 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell 1 1</td></tr><tr><td>cell 2 1</td></tr><tr><td>cell 3 1</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('3 x 3 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('1 x 1 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
    it('1 x 3 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
    it('3 x 1 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
    it('3 x 3 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
});

describe('Converts html row string into Row object', function(){
    it('gets styles of the row', function(){
        var rowHtml = '<tr style="color: red; width: 1; strange-attr: haha"><td></td><td></td><td></td><td></td><td></td></tr>',
            row = rowHtml.createRowFromHtml(),
            st = row.style;
        expect(st.hasOwnProperty('color')).toBe(true);
        expect(st.color).toBe('red');
        expect(st.hasOwnProperty('width')).toBe(true);
        expect(st.width).toBe(1);
        expect(st.hasOwnProperty('strange-attr')).toBe(true);
        expect(st['strange-attr']).toBe('haha');
    });

    it('gets attributes of the row', function(){
        var rowHtml = '<tr color="red" width="1" strange-attr="haha"><td></td><td></td><td></td><td></td><td></td></tr>',
            row = rowHtml.createRowFromHtml(),
            attr = row.attr;
        expect(attr.hasOwnProperty('color')).toBe(true);
        expect(attr.color).toBe('red');
        expect(attr.hasOwnProperty('width')).toBe(true);
        expect(attr.width).toBe("1");
        expect(attr.hasOwnProperty('strange-attr')).toBe(true);
        expect(attr['strange-attr']).toBe('haha');
    });

    it('gets both styles and attributes of the row', function(){
        var rowHtml = '<tr underlined="why not" width="98" strange-attr="wierd" style="color: red; width: 1; strange-param: haha"><td></td><td></td><td></td><td></td><td></td></tr>',
            row = rowHtml.createRowFromHtml(),
            st = row.style,
            attr = row.attr;
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

    it('gets correct number of the cells in non-empty row', function(){
        var rowHtml = '<tr><td></td><td></td><td></td><td></td><td></td></tr>',
            row = rowHtml.createRowFromHtml();
        expect(row.cells.length).toBe(5);

    });

    it('gets correct number of the cells in empty row', function(){
        var rowHtml = '<tr></tr>',
            row = rowHtml.createRowFromHtml();
        expect(row.cells.length).toBe(0);
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