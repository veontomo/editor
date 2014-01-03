/*global describe, it, xit, expect, spyOn, beforeEach, toString, toString2, setMinMaxWidth, Cell, Row, Table, 
Content, TableStyle, TableRowStyle, TableCellStyle, TableAttributes, Attributes, getProperty */
describe('String representation', function() {
    it('converts object into an inline style string', function() {
        var Obj1 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {}
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
            'function': function() {}
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
    var content;
    beforeEach(function() {
        content = new Content();
    });

    it('gives the number of elements it contains', function() {
        content.elements = [];
        expect(content.length()).toEqual(0);

        content.elements = [1, 2, 'a',
        {}];
        expect(content.length()).toEqual(4);

        content.elements = ['a',
        {
            id: 'some id'
        }];
        expect(content.length()).toEqual(2);
    });

    it('has toHtml method', function() {
        var elem0 = 1,
            elem1 = 'element2',
            elem2 = {
                'a dummy method': 1
            },
            htmlContent;
        content.elements = [elem0, elem1];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent).toEqual('1element2');

        content.elements = [elem0, elem1, elem2];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent.indexOf(elem1) !== -1).toBe(true);
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
    var row, rowAttr, rowStyle, cells;
    beforeEach(function(){
        row = new Row();
        rowAttr = new Attributes();
        rowStyle = new TableRowStyle();
        cells = [];
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
});

describe('Table-related code', function(){
    var table = new Table(),
        tableAttr = new Attributes(),
        tableStyle = new TableStyle(),
        row1 = new Row(),
        row2 = new Row(),
        row3 = new Row();
    
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
         if (tableStyle.hasOwnProperty('row property')) {
             delete tableStyle['row property'];
         }
         table.style = tableStyle;
         expect(table.styleProperty('row property')).not.toBeDefined();
     });

     it('sets the width of the row', function(){
         table.setWidth(15);
         expect(table.styleProperty('width')).toEqual(15);
         expect(table.styleProperty('min-width')).toEqual(15);
         expect(table.styleProperty('max-width')).toEqual(15);
         expect(table.attr.width).toEqual(15);
     });

     it('generates html code of the row if attributes and styles are not empty', function(){
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


     it('generates html code of the row if attribute is empty', function(){
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

     it('generates html code of the row if style is empty', function(){
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

     
});

// describe('Row-related code', function() {
//     var row;
//     beforeEach(function() {
//         row = new Row();
//     });


//     it('gets the width from the styles', function() {
//         row.style = {
//             'width': 15,
//             'foo': 'xxx'
//         };
//         expect(row.width()).toEqual(15);
//         row.style = {
//             'foo': 'xxx'
//         };
//         expect(row.width()).toEqual('');

//     });

//     it('gives the number of cells in the row', function() {
//         expect(row.numOfCells()).toEqual(0);
//         row.content = [1, 1, 1, 1];
//         expect(row.numOfCells()).toEqual(4);

//         row.content = [1, 1];
//         expect(row.numOfCells()).toEqual(2);

//         row.content = [];
//         expect(row.numOfCells()).toEqual(0);
//     });

//     it('gives the cells of the row', function(){
//         var style = new TableRowStyle(),
//             content = ['c1', 'c2'],
//             cell0Style = new TableCellStyle(),
//             cell1Style = new TableCellStyle(),
//             cells;

//         row.content = content;
//         row.style = style;
//         row.cellStyles = [cell0Style, cell1Style];

//         cells = row.cells();
//         expect(cells.length).toEqual(2);
//         expect(cells[0].style).toBe(cell0Style);
//         expect(cells[0].content).toBe(content[0]);
//         expect(cells[1].style).toBe(cell1Style);
//         expect(cells[1].content).toBe(content[1]);
//     });

//     xit('deletes the cell', function() {
//         row.cells = [1, 2, 3, 'a', 'b'];
//         expect(row.dropCell(0)).toEqual(1);
//         expect(row.cells).toEqual([2, 3, 'a', 'b']);
//         expect(row.dropCell(100)).toEqual(null);
//         expect(row.cells).toEqual([2, 3, 'a', 'b']);
//         expect(row.dropCell(2)).toEqual('a');
//         expect(row.cells).toEqual([2, 3, 'b']);
//         expect(row.dropCell(2)).toEqual('b');
//         expect(row.cells).toEqual([2, 3]);

//         row.cells = [1];
//         expect(row.dropCell(2)).toEqual(null);
//         expect(row.cells).toEqual([1]);

//         expect(row.dropCell(0)).toEqual(1);
//         expect(row.cells).toEqual([]);
//         expect(row.dropCell(0)).toEqual(null);
//         expect(row.cells).toEqual([]);
//     });

//     xit('inserts the cell', function() {
//         row.content = [];
//         expect(row.numOfCells()).toEqual(0);

//         row.insertCell('cell1', 1);
//         expect(row.numOfCells()).toEqual(1);
//         expect(row.content).toEqual(['cell1']);

//         row.cells = [1, 2, 3, 'a', 'b'];
//         expect(row.numOfCells()).toEqual(5);

//         row.insertCell('cell1', 1);
//         expect(row.numOfCells()).toEqual(6);
//         expect(row.content).toEqual([1, 'cell1', 2, 3, 'a', 'b']);

//         row.insertCell('cell2', 0);
//         expect(row.numOfCells()).toEqual(7);
//         expect(row.content).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b']);

//         row.insertCell('cell3', 1.2);
//         expect(row.length()).toEqual(8);
//         expect(row.content).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b', 'cell3']);

//         row.insertCell('cell4', 100);
//         expect(row.numOfCells()).toEqual(9);
//         expect(row.content).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b', 'cell3', 'cell4']);
//     });

//     xit('adds the cell', function() {
//         row.content = [1, 2, 3, 'a', 'b'];
//         row.appendCell('cell');
//         expect(row.content).toEqual([1, 2, 3, 'a', 'b', 'cell']);
//         row.content = [];
//         row.appendCell('cell');
//         expect(row.content).toEqual(['cell']);
//     });


//     it('gets html representation of the row', function() {
//         var c1 = new Content(),
//             c2 = new Content(),
//             rowStyle = new TableRowStyle(),
//             rowAttr = new Attributes(),
//             htmlRow;

//         rowStyle.width = 'row width';

//         spyOn(c1, 'toHtml').andCallFake(function() {
//             return 'cell1 html code';
//         });
//         spyOn(c2, 'toHtml').andCallFake(function() {
//             return 'cell2 html code';
//         });
//         spyOn(rowStyle, 'toString').andCallFake(function() {
//             return 'row styles';
//         });
//         spyOn(rowAttr, 'toString').andCallFake(function() {
//             return 'row attributes';
//         });


//         spyOn(row, 'cells').andCallFake(function(){
//             return [c1, c2];
//         });

//         row.style = rowStyle;
//         row.content = [c1, c2];
//         row.attributes = rowAttr;

//         htmlRow = row.toHtml();
//         expect(c1.toHtml).toHaveBeenCalled();
//         expect(c2.toHtml).toHaveBeenCalled();
//         expect(rowStyle.toString).toHaveBeenCalled();
//         //expect(htmlRow).toEqual('<tr width="row width" style="row styles">cell1 html codecell2 html code</tr>');
//         expect(htmlRow).toEqual('<tr row attributes style="row styles">cell1 html codecell2 html code</tr>');
//     });
// });

// describe('Table-related code', function() {
//     var table;
//     beforeEach(function() {
//         table = new Table();
//     });

//     it('gives the number of the columns', function() {
//         table.content = [
//             [1, 2, 3],
//             ['a', 'b', 0]
//         ]; // regular table
//         expect(table.numOfCols()).toEqual(3);
//         table.content = [
//             [],
//             []
//         ]; // regular empty table
//         expect(table.numOfCols()).toEqual(0);

//         table.content = [
//             [1],
//             ['a', 'b']
//         ]; // irregular table
//         expect(table.numOfCols()).toEqual(1);
//     });

//     it('gives the number of the rows', function() {
//         table.content = [
//             [1, 2, 3],
//             ['a', 'b', 0]
//         ];
//         expect(table.numOfRows()).toEqual(2);
//         table.content = [
//             [],
//             [],
//             []
//         ];
//         expect(table.numOfRows()).toEqual(3);

//     });


//     it('checks whether all table rows have the same number of cells', function() {
//         table.content = [
//             [1, 2, 3]
//         ]; // regular table
//         expect(table.isRegular()).toBe(true);

//         table.content = [
//             [1, 2, 3],
//             ['a', 'b', 0]
//         ]; // regular table
//         expect(table.isRegular()).toBe(true);
//         table.content = [
//             [],
//             []
//         ]; // regular empty table
//         expect(table.isRegular()).toBe(true);

//         table.content = [
//             [1],
//             ['a', 'b']
//         ]; // irregular table
//         expect(table.isRegular()).toBe(false);
//         table.content = [
//             [],
//             ['a']
//         ]; // irregular table
//         expect(table.isRegular()).toBe(false);

//         table.content = [
//             [1, 2],
//             ['a'],
//             [1]
//         ]; // irregular table
//         expect(table.isRegular()).toBe(false);
//         table.content = [
//             [1, 2],
//             []
//         ]; // irregular table
//         expect(table.isRegular()).toBe(false);

//         table.content = [1, 2]; // irregular table
//         expect(table.isRegular()).toBe(false);
//     });


//     it('gets the width from the styles', function() {
//         table.style = {
//             'width': 15,
//             'foo': 'xxx'
//         };
//         expect(table.width()).toEqual(15);
//         table.style = {
//             'foo': 'xxx'
//         };
//         expect(table.width()).toEqual('');
//     });

//     it('gets the rows of the table', function() {
//         var cell0Style = new TableCellStyle(),
//             cell1Style = new TableCellStyle(),
//             cell2Style = new TableCellStyle(),
//             rowStyle = new TableRowStyle(),
//             content = [
//                 ['c00', 'c01', 'c02'],
//                 ['c10', 'c11', 'c12']
//             ],
//             cellStyles = [cell0Style, cell1Style, cell2Style],
//             rows;

//         table.content = content;
//         table.rowStyle = rowStyle;
//         table.cellStyles = cellStyles;

//         rows = table.rows();
//         expect(rows.length).toEqual(2);
//         expect(rows[0] instanceof Row).toBe(true);
//         expect(rows[0].style).toEqual(rowStyle);
//         expect(rows[0].cellStyles).toEqual(cellStyles);
//         expect(rows[0].content).toEqual(content[0]);

//         expect(rows[1] instanceof Row).toBe(true);
//         expect(rows[1].style).toEqual(rowStyle);
//         expect(rows[1].cellStyles).toEqual(cellStyles);
//         expect(rows[1].content).toEqual(content[1]);
//     });

//     it('gets html representation of the table', function() {
//         var tableStyle = new TableStyle(),
//             row0 = new Row(),
//             row1 = new Row();
//         spyOn(row0, 'toHtml').andCallFake(function() {
//             return 'zero row html';
//         });
//         spyOn(row1, 'toHtml').andCallFake(function() {
//             return 'first row html';
//         });

//         table.style = tableStyle;

//         spyOn(tableStyle, 'toString').andCallFake(function() {
//             return 'table styles';
//         });
//         spyOn(table, 'attributesString').andCallFake(function() {
//             return 'all-table-attributes';
//         });
//         spyOn(table, 'rows').andCallFake(function() {
//             return [row0, row1];
//         });

//         expect(table.toHtml()).toEqual('<table all-table-attributes style="table styles"><tbody>zero row htmlfirst row html</tbody></table>');


//     });

//     it('creates complete table', function(){
//         var table1 = new Table(),
//             table1Style = new TableStyle(),
//             table1rowStyle = new TableRowStyle(),
//             table1cell1Style = new TableCellStyle(),
//             table1cell2Style = new TableCellStyle(),
//             table1cell3Style = new TableCellStyle(),
//             table1cell1Attr = new Attributes(),
//             table1cell2Attr = new Attributes(),
//             table1cell3Attr = new Attributes(),

//             table1content1 = new Content(),
//             table1content2 = new Content(),
//             table1content3 = new Content();

//         spyOn(table1, 'attributesString').andCallFake(function(){
//             return 'first-table-attributes';
//         });
//         spyOn(table1Style, 'toString').andCallFake(function(){
//             return 'first table style';
//         });
//         table1rowStyle.setWidth('table 1 row width');
//         spyOn(table1rowStyle, 'toString').andCallFake(function(){
//             return 'first row style';
//         });

//         table1cell1Style.setWidth('cell 1 width');
//         spyOn(table1cell1Style, 'toString').andCallFake(function(){
//             return 'first cell style';
//         });
//         table1cell2Style.setWidth('cell 2 width');
//         spyOn(table1cell2Style, 'toString').andCallFake(function(){
//             return 'second cell style';
//         });
//         table1cell3Style.setWidth('cell 1 width');
//         spyOn(table1cell3Style, 'toString').andCallFake(function(){
//             return 'third cell style';
//         });

//         spyOn(table1cell1Attr, 'toString').andCallFake(function(){
//             return 'first cell attr';
//         });
//         spyOn(table1cell2Attr, 'toString').andCallFake(function(){
//             return 'second cell attr';
//         });
//         spyOn(table1cell3Attr, 'toString').andCallFake(function(){
//             return 'third cell attr';
//         });


//         table1content1.elements.push('content of cell 1');
//         table1content2.elements.push('content of cell 2');
//         table1content3.elements.push('content of cell 3');

//         table1.style = table1Style;
//         table1.rowStyle = table1rowStyle;
//         table1.cellStyles = [table1cell1Style, table1cell2Style, table1cell3Style];
//         table1.cellAttrs = [table1cell1Attr, table1cell2Attr, table1cell3Attr];
//         table1.content = [[table1content1, table1content2, table1content3]];
//         expect(table1.toHtml()).toEqual('<table first-table-attributes style="first table style"><tbody><tr style="first row style"><td style="first cell style">content of cell 1</td><td style="second cell style">content of cell 2</td><td style="third cell style">content of cell 3</td></tr></tbody></table>');
//     });

//     it('creates proper table attributes', function(){
//         var ts = new TableStyle(),
//             ta = new TableAttributes();
//         ts.width = 112;
//         ta.cellpadding = 14;
//         ta.cellspacing = '19';
//         table.style = ts;
//         table.attributes = ta;
//         expect(table.attributesString()).toEqual('cellpadding="14" cellspacing="19" width="112"');
//     });

//     it('creates nested tables', function(){
//         var table1 = new Table(),
//             table1Style = new TableStyle(),
//             table1rowStyle = new TableRowStyle(),
//             table1cell1Style = new TableCellStyle(),
//             table1cell2Style = new TableCellStyle(),
//             table1cell3Style = new TableCellStyle(),
//             table1content1 = new Content(),
//             table1content2 = new Content(),
//             table1content3 = new Content(),
//             table2 = new Table(),
//             table2Style = new TableStyle(),
//             table2rowStyle = new TableRowStyle(),
//             table2cell1Style = new TableCellStyle(),
//             table2content1 = new Content();


//         spyOn(table1, 'attributesString').andCallFake(function(){
//             return 'first-table-attributes';
//         });
//         spyOn(table1Style, 'toString').andCallFake(function(){
//             return 'first table style';
//         });

//         table1rowStyle.setWidth('table 1 row width');
//         spyOn(table1rowStyle, 'toString').andCallFake(function(){
//             return 'first row style';
//         });

//         table1cell1Style.setWidth('cell 1 width');
//         spyOn(table1cell1Style, 'toString').andCallFake(function(){
//             return 'first cell style';
//         });
//         table1cell2Style.setWidth('cell 2 width');
//         spyOn(table1cell2Style, 'toString').andCallFake(function(){
//             return 'second cell style';
//         });
//         table1cell3Style.setWidth('cell 1 width');
//         spyOn(table1cell3Style, 'toString').andCallFake(function(){
//             return 'third cell style';
//         });


//         spyOn(table2, 'attributesString').andCallFake(function(){
//             return 'second-table-attributes';
//         });
//         spyOn(table2Style, 'toString').andCallFake(function(){
//             return 'second table style';
//         });
//         table2rowStyle.setWidth('table 2 row width');
//         spyOn(table2rowStyle, 'toString').andCallFake(function(){
//             return 'table 2 row style';
//         });

//         table2cell1Style.setWidth('cell 1 width');
//         spyOn(table2cell1Style, 'toString').andCallFake(function(){
//             return 'first cell of the second table style';
//         });


//         table2content1.elements.push('content of unique cell of table 2');

//         table2.style = table2Style;
//         table2.rowStyle = table2rowStyle;
//         table2.cellStyles = [table2cell1Style];
//         table2.content = [[table2content1]];

//         table1.style = table1Style;
//         table1.rowStyle = table1rowStyle;
//         table1.cellStyles = [table1cell1Style, table1cell2Style, table1cell3Style];
//         table1.content = [[table1content1, table1content2, table1content3]];

//         table1content1.elements.push('content of cell 1');
//         table1content1.elements.push(table2);
//         table1content1.elements.push({'an object without toHtml() method': 0});
//         table1content2.elements.push('content of cell 2');
//         table1content3.elements.push('content of cell 3');

//         expect(table1.toHtml()).toEqual('<table first-table-attributes style="first table style"><tbody><tr style="first row style"><td style="first cell style">content of cell 1<table second-table-attributes style="second table style"><tbody><tr style="table 2 row style"><td style="first cell of the second table style">content of unique cell of table 2</td></tr></tbody></table> no string representation for the element! </td><td style="second cell style">content of cell 2</td><td style="third cell style">content of cell 3</td></tr></tbody></table>');
//     });
// });