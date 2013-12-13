describe('creates attribute object with required attributes', function(){
    var textAtt = new TextAttributes();
    var textAttDefault = new TextAttributes();

});

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

describe('Cell-related code', function() {
    var cell;
    var cellAttr;

    beforeEach(function(){
        cell        = new Cell();
        cellAttr    = new TableCellAttributes();
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
        expect(cell.toHtml()).toEqual('<td width="stub for width" style="stub for styles"></td>');
        expect(cellAttr.toString).toHaveBeenCalled();
    });
});


describe('Row-related code', function(){
    var row;
    beforeEach(function(){
        row = new Row();
    });


    it('gets the width from the styles', function(){
        row.style = {'width': 15, 'foo': 'xxx'};
        expect(row.width()).toEqual(15);
        row.style = {'foo': 'xxx'};
        expect(row.width()).toEqual('');

    });

    it('gives the number of cells in the row', function(){
        expect(row.length()).toEqual(0);
        row.cells = [1,1,1,1];
        expect(row.length()).toEqual(4);

        row.cells = [1,1];
        expect(row.length()).toEqual(2);

        row.cells = [];
        expect(row.length()).toEqual(0);
    });

    it('deletes the cell', function(){
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

    it('inserts the cell', function(){
        row.cells = [];
        expect(row.length()).toEqual(0);

        row.insertCell('cell1', 1);
        expect(row.length()).toEqual(1);
        expect(row.cells).toEqual(['cell1']);

        row.cells = [1, 2, 3, 'a', 'b'];
        expect(row.length()).toEqual(5);

        row.insertCell('cell1', 1);
        expect(row.length()).toEqual(6);
        expect(row.cells).toEqual([1, 'cell1', 2, 3, 'a', 'b']);

        row.insertCell('cell2', 0);
        expect(row.length()).toEqual(7);
        expect(row.cells).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b']);

        row.insertCell('cell3', 1.2);
        expect(row.length()).toEqual(8);
        expect(row.cells).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b', 'cell3']);

        row.insertCell('cell4', 100);
        expect(row.length()).toEqual(9);
        expect(row.cells).toEqual(['cell2', 1, 'cell1', 2, 3, 'a', 'b', 'cell3', 'cell4']);
    });

    it('adds the cell', function(){
        row.cells = [1, 2, 3, 'a', 'b'];
        row.appendCell('cell');
        expect(row.cells).toEqual([1, 2, 3, 'a', 'b', 'cell']);
        row.cells = [];
        row.appendCell('cell');
        expect(row.cells).toEqual(['cell']);
    });



    it('gets html representation of the row', function(){
        var c1 = new Cell(),
            c2 = new Cell(),
            rowStyle = new TableRowAttributes();
            rowStyle.width = '18';
        spyOn(c1, 'toHtml').andCallFake(function(){
            return 'cell1 html code';
        });
        spyOn(c2, 'toHtml').andCallFake(function(){
            return 'cell2 html code';
        });
        spyOn(rowStyle, 'toString').andCallFake(function(){
            return 'row styles';
        });
        row.style = rowStyle;
        row.cells = [c1, c2];
        var htmlRow = row.toHtml();
        expect(c1.toHtml).toHaveBeenCalled();
        expect(c2.toHtml).toHaveBeenCalled();
        expect(rowStyle.toString).toHaveBeenCalled();
        expect(htmlRow).toEqual('<tr width="18" style="row styles">cell1 html codecell2 html code</tr>' );
    });
});

describe('Table-related code', function(){
    var table;
    beforeEach(function(){
        table = new Table();
    });

    it('gives the number of the columns', function(){
        var row = new Row();
        spyOn(row, 'length').andCallFake(function(){
            return 5;
        });
        table.row = row;
        expect(table.cols()).toEqual(5);
        expect(row.length).toHaveBeenCalled();
    });

    it('gets the width from the styles', function(){
        table.style = {'width': 15, 'foo': 'xxx'};
        expect(table.width()).toEqual(15);
        table.style = {'foo': 'xxx'};
        expect(table.width()).toEqual('');

    });

    it('gets html representation of the table', function(){
        var row = new Row();
        spyOn(row, 'toHtml').andCallFake(function(){
            return 'row html code';
        });
        var tableStyle = new TableAttributes();
        spyOn(tableStyle, 'toString').andCallFake(function(){
            return 'table style';
        });
        table.row = row;
        table.style = tableStyle;
        spyOn(table, 'width').andCallFake(function(){
            return 'table width';
        });
        table.rows = 1;
        var result = table.toHtml();
        expect(result).toEqual('<table width="table width" style="table style"><tbody>' + Array(table.rows + 1).join("row html code") + '</tbody></table>');
        expect(table.width).toHaveBeenCalled();

        table.rows = 0;
        var result = table.toHtml();
        expect(result).toEqual('<table width="table width" style="table style"><tbody>' + Array(table.rows + 1).join("row html code") + '</tbody></table>');
        expect(table.width).toHaveBeenCalled();

        table.rows = 3;
        var result = table.toHtml();
        expect(result).toEqual('<table width="table width" style="table style"><tbody>' + Array(table.rows + 1).join("row html code") + '</tbody></table>');
        expect(table.width).toHaveBeenCalled();
    });

});