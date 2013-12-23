describe('String representation', function() {
    it('converts object into a string', function() {
        var Obj1 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {},
        };
        var Obj2 = {};
        var Obj3 = {
            'width': 10,
            'color': 'red',
            'string': '10',
            'function': function() {
                return 'foo';
            },
            'border': 12,
        };
        expect(toString(Obj1)).toEqual('width: 10px;color: red;string: 10;');
        expect(toString(Obj2)).toEqual('');
        expect(toString(Obj3)).toEqual('width: 10px;color: red;string: 10;border: 12px;');
        expect(toString(Obj3, 'mm')).toEqual('width: 10mm;color: red;string: 10;border: 12mm;');
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
        expect(function(){setMinMaxWidth(obj)}).toThrow("Width value is not set!");
        expect(obj.hasOwnProperty('width')).toBe(false);
        expect(obj.hasOwnProperty('min-width')).toBe(false);
        expect(obj.hasOwnProperty('max-width')).toBe(false);
    });

    it('throws an error if the target is not of Object type', function(){
        expect(function(){setMinMaxWidth('a string')}).toThrow('Can not set a property of a non-object!');
        expect(function(){setMinMaxWidth()}).toThrow('Can not set a property of a non-object!');
    });
})

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
        var elem0 = 1;
        var elem1 = 'element2';
        var elem2 = {
            'a dummy method': 1
        };
        content.elements = [elem0, elem1];
        var htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent).toEqual('1element2');

        content.elements = [elem0, elem1, elem2];
        htmlContent = content.toHtml();
        expect(typeof htmlContent).toBe("string");
        expect(htmlContent.indexOf(elem1) !== -1).toBe(true);
    });


})


describe('Cell-related code', function() {
    var cell;
    var cellAttr;

    beforeEach(function() {
        cell = new Cell();
        cellAttr = new TableCellStyle();
    });


    it('retrieves the width from the style attribute', function() {
        cellAttr.width = 11;
        cell.style = cellAttr;
        expect(cell.width()).toEqual(11);

        cellAttr.width = 0;
        cell.style = cellAttr;
        expect(cell.width()).toEqual(0);

        cellAttr.width = '';
        cell.style = cellAttr;
        expect(cell.width()).toEqual('');
    });

    it('gets html representation of the cell', function() {
        cellAttr.dummyAttr = "it has to be ignored";
        spyOn(cellAttr, 'toString').andCallFake(function() {
            return 'stub for styles';
        });
        spyOn(cell, 'width').andCallFake(function() {
            return 'stub for width';
        });

        cell.style = cellAttr;
        cell.content = new Content();
        expect(cell.toHtml()).toEqual('<td style="stub for styles"></td>');
        expect(cellAttr.toString).toHaveBeenCalled();


        var content = new Content();
        cell.content = content;
        spyOn(content, 'toHtml').andCallFake(function() {
            return 'content';
        });
        expect(cell.toHtml()).toEqual('<td style="stub for styles">content</td>');
    });

});


describe('Row-related code', function() {
    var row;
    beforeEach(function() {
        row = new Row();
    });


    it('gets the width from the styles', function() {
        row.style = {
            'width': 15,
            'foo': 'xxx'
        };
        expect(row.width()).toEqual(15);
        row.style = {
            'foo': 'xxx'
        };
        expect(row.width()).toEqual('');

    });

    it('gives the number of cells in the row', function() {
        expect(row.numOfCells()).toEqual(0);
        row.content = [1, 1, 1, 1];
        expect(row.numOfCells()).toEqual(4);

        row.content = [1, 1];
        expect(row.numOfCells()).toEqual(2);

        row.content = [];
        expect(row.numOfCells()).toEqual(0);
    });

    it('gives the cells of the row', function(){
        var style = new TableRowStyle();
        var content = ['c1', 'c2'];
        var cell0Style = new TableCellStyle();
        var cell1Style = new TableCellStyle();

        row.content = content;
        row.style = style;
        row.cellStyles = [cell0Style, cell1Style];

        var cells = row.cells();
        expect(cells.length).toEqual(2);
        expect(cells[0].style).toBe(cell0Style);
        expect(cells[0].content).toBe(content[0]);
        expect(cells[1].style).toBe(cell1Style);
        expect(cells[1].content).toBe(content[1]);
    })

    xit('deletes the cell', function() {
        row.cells = [1, 2, 3, 'a', 'b'];
        expect(row.dropCell(0)).toEqual(1);
        expect(row.cells).toEqual([2, 3, 'a', 'b']);
        expect(row.dropCell(100)).toEqual(null);
        expect(row.cells).toEqual([2, 3, 'a', 'b']);
        expect(row.dropCell(2)).toEqual('a');
        expect(row.cells).toEqual([2, 3, 'b']);
        expect(row.dropCell(2)).toEqual('b');
        expect(row.cells).toEqual([2, 3]);

        row.cells = [1];
        expect(row.dropCell(2)).toEqual(null);
        expect(row.cells).toEqual([1]);

        expect(row.dropCell(0)).toEqual(1);
        expect(row.cells).toEqual([]);
        expect(row.dropCell(0)).toEqual(null);
        expect(row.cells).toEqual([]);
    });

    xit('inserts the cell', function() {
        row.content = [];
        expect(row.numOfCells()).toEqual(0);

        row.insertCell('cell1', 1);
        expect(row.numOfCells()).toEqual(1);
        expect(row.content).toEqual(['cell1']);

        row.cells = [1, 2, 3, 'a', 'b'];
        expect(row.numOfCells()).toEqual(5);

        row.insertCell('cell1', 1);
        expect(row.numOfCells()).toEqual(6);
        expect(row.content).toEqual([1, 'cell1', 2, 3, 'a', 'b']);

        row.insertCell('cell2', 0);
        expect(row.numOfCells()).toEqual(7);
        expect(row.content).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b']);

        row.insertCell('cell3', 1.2);
        expect(row.length()).toEqual(8);
        expect(row.content).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b', 'cell3']);

        row.insertCell('cell4', 100);
        expect(row.numOfCells()).toEqual(9);
        expect(row.content).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b', 'cell3', 'cell4']);
    });

    xit('adds the cell', function() {
        row.content = [1, 2, 3, 'a', 'b'];
        row.appendCell('cell');
        expect(row.content).toEqual([1, 2, 3, 'a', 'b', 'cell']);
        row.content = [];
        row.appendCell('cell');
        expect(row.content).toEqual(['cell']);
    });


    it('gets html representation of the row', function() {
        var c1 = new Content(),
            c2 = new Content(),
            rowStyle = new TableRowStyle();

        rowStyle.width = 'row width';
        spyOn(c1, 'toHtml').andCallFake(function() {
            return 'cell1 html code';
        });
        spyOn(c2, 'toHtml').andCallFake(function() {
            return 'cell2 html code';
        });
        spyOn(rowStyle, 'toString').andCallFake(function() {
            return 'row styles';
        });

        spyOn(row, 'cells').andCallFake(function(){
            return [c1, c2];
        });

        row.style = rowStyle;
        row.content = [c1, c2];

        var htmlRow = row.toHtml();
        expect(c1.toHtml).toHaveBeenCalled();
        expect(c2.toHtml).toHaveBeenCalled();
        expect(rowStyle.toString).toHaveBeenCalled();
        //expect(htmlRow).toEqual('<tr width="row width" style="row styles">cell1 html codecell2 html code</tr>');
        expect(htmlRow).toEqual('<tr style="row styles">cell1 html codecell2 html code</tr>');
    });
});

describe('Table-related code', function() {
    var table;
    beforeEach(function() {
        table = new Table();
    });

    it('gives the number of the columns', function() {
        table.content = [
            [1, 2, 3],
            ['a', 'b', 0]
        ]; // regular table
        expect(table.numOfCols()).toEqual(3);
        table.content = [
            [],
            []
        ]; // regular empty table
        expect(table.numOfCols()).toEqual(0);

        table.content = [
            [1],
            ['a', 'b']
        ]; // irregular table
        expect(table.numOfCols()).toEqual(1);
    });

    it('gives the number of the rows', function() {
        table.content = [
            [1, 2, 3],
            ['a', 'b', 0]
        ];
        expect(table.numOfRows()).toEqual(2);
        table.content = [
            [],
            [],
            []
        ];
        expect(table.numOfRows()).toEqual(3);

    });


    it('checks whether all table rows have the same number of cells', function() {
        table.content = [
            [1, 2, 3]
        ]; // regular table
        expect(table.isRegular()).toBe(true);

        table.content = [
            [1, 2, 3],
            ['a', 'b', 0]
        ]; // regular table
        expect(table.isRegular()).toBe(true);
        table.content = [
            [],
            []
        ]; // regular empty table
        expect(table.isRegular()).toBe(true);

        table.content = [
            [1],
            ['a', 'b']
        ]; // irregular table
        expect(table.isRegular()).toBe(false);
        table.content = [
            [],
            ['a']
        ]; // irregular table
        expect(table.isRegular()).toBe(false);

        table.content = [
            [1, 2],
            ['a'],
            [1]
        ]; // irregular table
        expect(table.isRegular()).toBe(false);
        table.content = [
            [1, 2],
            []
        ]; // irregular table
        expect(table.isRegular()).toBe(false);

        table.content = [1, 2]; // irregular table
        expect(table.isRegular()).toBe(false);
    });


    it('gets the width from the styles', function() {
        table.style = {
            'width': 15,
            'foo': 'xxx'
        };
        expect(table.width()).toEqual(15);
        table.style = {
            'foo': 'xxx'
        };
        expect(table.width()).toEqual('');

    });

    it('gets the rows of the table', function() {
        var cell0Style = new TableCellStyle();
        var cell1Style = new TableCellStyle();
        var cell2Style = new TableCellStyle();
        var rowStyle = new TableRowStyle();

        var content = [
            ['c00', 'c01', 'c02'],
            ['c10', 'c11', 'c12']
        ];
        var cellStyles = [cell0Style, cell1Style, cell2Style];

        table.content = content;
        table.rowStyle = rowStyle;
        table.cellStyles = cellStyles;

        var rows = table.rows();
        expect(rows.length).toEqual(2);
        expect(rows[0] instanceof Row).toBe(true);
        expect(rows[0].style).toEqual(rowStyle);
        expect(rows[0].cellStyles).toEqual(cellStyles);
        expect(rows[0].content).toEqual(content[0]);


        expect(rows[1] instanceof Row).toBe(true);
        expect(rows[1].style).toEqual(rowStyle);
        expect(rows[1].cellStyles).toEqual(cellStyles);
        expect(rows[1].content).toEqual(content[1]);
    })

    it('gets html representation of the table', function() {
        var tableStyle = new TableStyle();

        var row0 = new Row();
        var row1 = new Row();
        spyOn(row0, 'toHtml').andCallFake(function() {
            return 'zero row html';
        });
        spyOn(row1, 'toHtml').andCallFake(function() {
            return 'first row html';
        });

        table.style = tableStyle;

        spyOn(tableStyle, 'toString').andCallFake(function() {
            return 'table styles';
        });
        spyOn(table, 'width').andCallFake(function() {
            return 'table width';
        });
        spyOn(table, 'rows').andCallFake(function() {
            return [row0, row1];
        });

        expect(table.toHtml()).toEqual('<table width="table width" style="table styles"><tbody>zero row htmlfirst row html</tbody></table>');


    });

    it('creates complete table', function(){
        var table1 = new Table();
        var table1Style = new TableStyle();
        var table1rowStyle = new TableRowStyle();
        var table1cell1Style = new TableCellStyle();
        var table1cell2Style = new TableCellStyle();
        var table1cell3Style = new TableCellStyle();
        var table1content1 = new Content();
        var table1content2 = new Content();
        var table1content3 = new Content();

        spyOn(table1, 'width').andCallFake(function(){
            return 'first table width';
        });
        spyOn(table1Style, 'toString').andCallFake(function(){
            return 'first table style';
        });
        table1rowStyle.setWidth('table 1 row width');
        spyOn(table1rowStyle, 'toString').andCallFake(function(){
            return 'first row style';
        });

        table1cell1Style.setWidth('cell 1 width');
        spyOn(table1cell1Style, 'toString').andCallFake(function(){
            return 'first cell style';
        });
        table1cell2Style.setWidth('cell 2 width');
        spyOn(table1cell2Style, 'toString').andCallFake(function(){
            return 'second cell style';
        });
        table1cell3Style.setWidth('cell 1 width');
        spyOn(table1cell3Style, 'toString').andCallFake(function(){
            return 'third cell style';
        });

        table1content1.elements.push('content of cell 1');
        table1content2.elements.push('content of cell 2');
        table1content3.elements.push('content of cell 3');

        table1.style = table1Style;
        table1.rowStyle = table1rowStyle;
        table1.cellStyles = [table1cell1Style, table1cell2Style, table1cell3Style];
        table1.content = [[table1content1, table1content2, table1content3]];
        expect(table1.toHtml()).toEqual('<table width="first table width" style="first table style"><tbody><tr style="first row style"><td style="first cell style">content of cell 1</td><td style="second cell style">content of cell 2</td><td style="third cell style">content of cell 3</td></tr></tbody></table>');
    });

it('creates nested tables', function(){
    var table1 = new Table();
    var table1Style = new TableStyle();
    var table1rowStyle = new TableRowStyle();
    var table1cell1Style = new TableCellStyle();
    var table1cell2Style = new TableCellStyle();
    var table1cell3Style = new TableCellStyle();
    var table1content1 = new Content();
    var table1content2 = new Content();
    var table1content3 = new Content();

    spyOn(table1, 'width').andCallFake(function(){
        return 'first table width';
    });
    spyOn(table1Style, 'toString').andCallFake(function(){
        return 'first table style';
    });

    table1rowStyle.setWidth('table 1 row width');
    spyOn(table1rowStyle, 'toString').andCallFake(function(){
        return 'first row style';
    });

    table1cell1Style.setWidth('cell 1 width');
    spyOn(table1cell1Style, 'toString').andCallFake(function(){
        return 'first cell style';
    });
    table1cell2Style.setWidth('cell 2 width');
    spyOn(table1cell2Style, 'toString').andCallFake(function(){
        return 'second cell style';
    });
    table1cell3Style.setWidth('cell 1 width');
    spyOn(table1cell3Style, 'toString').andCallFake(function(){
        return 'third cell style';
    });

    var table2 = new Table();
    var table2Style = new TableStyle();
    var table2rowStyle = new TableRowStyle();
    var table2cell1Style = new TableCellStyle();
    var table2content1 = new Content();

    spyOn(table2, 'width').andCallFake(function(){
        return 'second table width';
    });
    spyOn(table2Style, 'toString').andCallFake(function(){
        return 'second table style';
    });
    table2rowStyle.setWidth('table 2 row width');
    spyOn(table2rowStyle, 'toString').andCallFake(function(){
        return 'table 2 row style';
    });

    table2cell1Style.setWidth('cell 1 width');
    spyOn(table2cell1Style, 'toString').andCallFake(function(){
        return 'first cell of the second table style';
    });


    table2content1.elements.push('content of unique cell of table 2');

    table2.style = table2Style;
    table2.rowStyle = table2rowStyle;
    table2.cellStyles = [table2cell1Style];
    table2.content = [[table2content1]];

    table1.style = table1Style;
    table1.rowStyle = table1rowStyle;
    table1.cellStyles = [table1cell1Style, table1cell2Style, table1cell3Style];
    table1.content = [[table1content1, table1content2, table1content3]];

    table1content1.elements.push('content of cell 1');
    table1content1.elements.push(table2);
    table1content1.elements.push({'an object without toHtml() method': 0})
    table1content2.elements.push('content of cell 2');
    table1content3.elements.push('content of cell 3');

    expect(table1.toHtml()).toEqual('<table width="first table width" style="first table style"><tbody><tr style="first row style"><td style="first cell style">content of cell 1<table width="second table width" style="second table style"><tbody><tr style="table 2 row style"><td style="first cell of the second table style">content of unique cell of table 2</td></tr></tbody></table> no string representation for the element! </td><td style="second cell style">content of cell 2</td><td style="third cell style">content of cell 3</td></tr></tbody></table>');
});
});