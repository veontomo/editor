/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, toString, toString2, setMinMaxWidth, Cell, Row, Table,
Content, TableStyle, TableRowStyle, TableCellStyle, TableAttributes, Attributes, getProperty, Style, concat, sandwichWith, mergeObjects, concatDropSpaces, appendObject, createTableFromHtml, jasmine, appendStyleToCell */
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

describe('Merges two objects', function(){
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

describe('Style functionality', function(){
    it('sets width parameters', function(){
        var st = new Style();
        expect(typeof st.setWidth).toBe('function');
        st.setWidth(200);
        expect(st.width).toBe(200);
        expect(st['min-width']).toBe(200);
        expect(st['max-width']).toBe(200);

        st.setWidth(9212);
        expect(st.width).toBe(9212);
        expect(st['min-width']).toBe(9212);
        expect(st['max-width']).toBe(9212);
    });

    it('gets the border width', function(){
        var st = new Style(),
            bord = 1;
        st['border-style'] = 'none';
        bord = st.getBorder();
        expect(bord.width).toBe(0);

        st = new Style();
        st['border-style'] = 'whatever but not none';
        st['border-width'] = 23;
        delete st['border-color'];
        bord = st.getBorder();
        expect(bord.width).toBe(23);
        expect(bord.style).toBe('whatever but not none');
        expect(bord.hasOwnProperty('color')).toBe(false);

        st = new Style();
        st['border-style'] = 'whatever but not none';
        st['border-width'] = 223;
        st['border-color'] = 'nice color';
        bord = st.getBorder();
        expect(bord.width).toBe(223);
        expect(bord.style).toBe('whatever but not none');
        expect(bord.color).toBe('nice color');


        st = new Style();
        st['border-style'] = 'whatever but not none';
        delete st['border-width'];
        delete st['border-color'];
        bord = st.getBorder();
        expect(bord.style).toBe('whatever but not none');
        expect(bord.hasOwnProperty('color')).toBe(false);
        expect(bord.hasOwnProperty('width')).toBe(false);

        st = new Style();
        delete st['border-style'];
        st['border-width'] = 43;
        delete st['border-color'];
        bord = st.getBorder();
        expect(bord.width).toBe(43);
        expect(bord.hasOwnProperty('color')).toBe(false);
        expect(bord.hasOwnProperty('style')).toBe(false);


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