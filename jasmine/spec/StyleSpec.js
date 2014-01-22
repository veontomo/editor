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
    var row, rowAttr, rowStyle;
    beforeEach(function(){
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
        var cell1 = new Cell(),
            cell2 = new Cell(),
            cell3 = new Cell();

       expect(row.cells.length).toBe(0);
       row.appendCell(cell1);
       expect(row.cells.length).toBe(1);
       row.appendCell(cell2);
       expect(row.cells.length).toBe(2);
       row.appendCell(cell3);
       expect(row.cells.length).toBe(3);
    });

    it('generates html code of the row if attributes and styles are not empty', function(){
        var cell1 = new Cell(),
            cell2 = new Cell(),
            cell3 = new Cell();

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
        var cell1 = new Cell();

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
        var cell1 = new Cell();

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
    var table, tableAttr, tableStyle, row1, row2, row3;
    beforeEach(function(){
        table = new Table();
        tableAttr = new Attributes();
        tableStyle = new TableStyle();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
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


     it('appends a row to the existing rows', function(){
        expect(table.rows.length).toBe(0);
        table.appendRow(row1);
        expect(table.rows.length).toBe(1);
        table.appendRow(row3);
        expect(table.rows.length).toBe(2);
        table.appendRow(row3);
        expect(table.rows.length).toBe(3);
     });

     it('generates html code of the table if attributes and styles are not empty', function(){
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
             return 'table styles';
         });
         table.attr = tableAttr;
         table.style = tableStyle;
         table.rows = [row1, row2, row3];
         expect(table.toHtml()).toEqual('<table table attributes style="table styles">row 1 row 2 html row 3 content</table>');
     });

     it('generates html code of the table if attribute is empty', function(){
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

    it('generates html code of the table if style is empty', function(){
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

});

describe('Grating-related functionality', function(){
    var table, row1, row2, row3, tableAttr, tableStyle, nestedRowStyle, nestedCellStyle, nestedTableStyle, nestedCellAttr, nestedRowAttr, nestedTableAttr;
    beforeEach(function(){
        table = new Grating();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
        tableAttr =  new TableAttributes();
        tableStyle = new TableStyle();
        nestedRowStyle =    new Style();
        nestedCellStyle =   new Style();
        nestedTableStyle =  new Style();
        nestedRowAttr =    new Attributes();
        nestedCellAttr =   new Attributes();
        nestedTableAttr =  new Attributes();

        spyOn(row1, 'toHtml').andCallFake(function(){
            return 'row 1';
        });
        spyOn(row2, 'toHtml').andCallFake(function(){
            return 'row 2';
        });
        spyOn(row3, 'toHtml').andCallFake(function(){
            return 'row 3 content';
        });

    });

    it('inherits from Table()', function(){
        expect(Grating.prototype instanceof Table).toBe(true);
    });

    it('has additional property for the nested row', function(){
        var ft = new Grating();
        expect(ft.hasOwnProperty('bogusRowStyle')).toBe(true);
        expect(ft.bogusRowStyle.constructor.name).toBe('Style');
        expect(ft.hasOwnProperty('bogusRowAttr')).toBe(true);
        expect(ft.bogusRowAttr.constructor.name).toBe('Attributes');

    });

    it('has additional property for the nested cell', function(){
        var ft = new Grating();
        expect(ft.hasOwnProperty('bogusCellStyle')).toBe(true);
        expect(ft.bogusCellStyle.constructor.name).toBe('Style');
        expect(ft.hasOwnProperty('bogusCellAttr')).toBe(true);
        expect(ft.bogusCellAttr.constructor.name).toBe('Attributes');

    });

    it('has additional property for the nested table', function(){
        var ft = new Grating();
        expect(ft.hasOwnProperty('bogusTableStyle')).toBe(true);
        expect(ft.bogusTableStyle.constructor.name).toBe('Style');
        expect(ft.hasOwnProperty('bogusTableAttr')).toBe(true);
        expect(ft.bogusTableAttr.constructor.name).toBe('Attributes');
    });

    it('generates html code of the framed rows if all nested elements have non-empty styles and attributes', function(){
        spyOn(tableAttr, 'toString').andCallFake(function(){
            return 'table attributes';
        });
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return 'table styles';
        });
        spyOn(nestedRowStyle, 'toString').andCallFake(function(){
            return 'nested row styles';
        });
        spyOn(nestedCellStyle, 'toString').andCallFake(function(){
            return 'nested cell styles';
        });
        spyOn(nestedTableStyle, 'toString').andCallFake(function(){
            return 'nested table styles';
        });
        spyOn(nestedRowAttr, 'toString').andCallFake(function(){
            return 'nested row attr ';
        });
        spyOn(nestedCellAttr, 'toString').andCallFake(function(){
            return 'nested cell attr ';
        });
        spyOn(nestedTableAttr, 'toString').andCallFake(function(){
            return 'nested table attr ';
        });



        table.attr = tableAttr;
        table.style = tableStyle;
        table.rows = [row1, row2];
        table.bogusRowStyle = nestedRowStyle;
        table.bogusCellStyle = nestedCellStyle;
        table.bogusTableStyle = nestedTableStyle;
        table.bogusRowAttr = nestedRowAttr;
        table.bogusCellAttr = nestedCellAttr;
        table.bogusTableAttr = nestedTableAttr;

        expect(table.toHtml()).toEqual('<table table attributes style="table styles"><tr nested row attr style="nested row styles"><td nested cell attr style="nested cell styles"><table nested table attr style="nested table styles">row 1</table></td></tr><tr nested row attr style="nested row styles"><td nested cell attr style="nested cell styles"><table nested table attr style="nested table styles">row 2</table></td></tr></table>');
    });
});

describe('Transform html table to an object', function(){
    it('creates Table object if data-marker attribute is equal to "table"', function(){
        var htmlTable = '<table data-marker="table" style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
    });

    it('creates Grating object if data-marker attribute is equal to "grating"', function(){
        var htmlTable = '<table data-marker="grating" style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Grating');
    });

    it('creates Table object if data-marker attribute is not set', function(){
        var htmlTable = '<table style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
    });

    it('sets styles if data-marker attribute is equal to "table"', function(){
        var htmlTable = '<table data-marker="table" style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
        expect(obj1.style.hasOwnProperty('color')).toBe(true);
        expect(obj1.style.color).toBe('red');
    });

    it('sets multiple styles if data-marker attribute is equal to "table"', function(){
        var htmlTable = '<table data-marker="table" style="color:red;border-style:solid" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml(),
            style = obj1.style;
        expect(obj1.getType()).toBe('Table');
        expect(style.hasOwnProperty('color')).toBe(true);
        expect(style.color).toBe('red');
        expect(style.hasOwnProperty('border-style')).toBe(true);
        expect(style['border-style']).toBe('solid');

    });

    it('sets attributes if data-marker attribute is equal to "table"', function(){
        var htmlTable = '<table data-marker="table" style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml(),
            attr = obj1.attr;
        expect(obj1.getType()).toBe('Table');
        expect(attr.hasOwnProperty('data-marker')).toBe(true);
        expect(attr['data-marker']).toBe('table');
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