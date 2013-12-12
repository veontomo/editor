describe("String representation", function() {
    it("coverts object into a string", function() {
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

describe("Cell properties", function() {
    it("gets html string to represent the cell", function() {
        var cell = new Cell();
        var cellAttr = new TableCellAttributes();
        cellAttr.width = 10;
        cellAttr.dummyAttr = "it has to be ignored";
        spyOn(cellAttr, 'toString').andCallFake(function() {
            return 'stub for styles';
        });

        cell.setStyle(cellAttr);
        expect(cell.toHtml()).toEqual('<td width="10" style="stub for styles"></td>');
        expect(cellAttr.toString).toHaveBeenCalled();
    });
});