/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Row, Content, TableRowStyle, Attributes, Style, jasmine*/

describe('Row-related functionality:', function(){
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

    it('throws an error if trying to insert non-cell object into a valid position', function(){
        spyOn(row, 'cellNum').andCallFake(function(){return 8;});
        expect(function(){
            row.insertCellAt(0, 'not a cell');
        }).toThrow('Trying to insert non-cell object!');
        expect(function(){
            row.insertCellAt(1, 'not a cell');
        }).toThrow('Trying to insert non-cell object!');
        expect(function(){
            row.insertCellAt(4, 'not a cell');
        }).toThrow('Trying to insert non-cell object!');
        expect(function(){
            row.insertCellAt(7, 'not a cell');
        }).toThrow('Trying to insert non-cell object!');
    });

    it('does not throw an error if trying to insert non-cell object into non valid position', function(){
        spyOn(row, 'cellNum').andCallFake(function(){return 20;});
        expect(function(){
            row.insertCellAt(-1, 'not a cell');
        }).not.toThrow('Trying to insert non-cell object!');
        expect(function(){
            row.insertCellAt(21, 'not a cell');
        }).not.toThrow('Trying to insert non-cell object!');
    });


    it('inserts a cell in the middle position', function(){
        row.cells = [cell1, cell2, cell3];
        var c = new Cell('new cell');
        row.insertCellAt(1, c);
        expect(row.cells[0]).toBe(cell1);
        expect(row.cells[1]).toBe(c);
        expect(row.cells[2]).toBe(cell2);
        expect(row.cells[3]).toBe(cell3);
    });

    it('inserts a cell at the beginning', function(){
        row.cells = [cell1, cell2, cell3];
        var c = new Cell('new cell');
        row.insertCellAt(0, c);
        expect(row.cells[0]).toBe(c);
        expect(row.cells[1]).toBe(cell1);
        expect(row.cells[2]).toBe(cell2);
        expect(row.cells[3]).toBe(cell3);
    });

    it('inserts a cell before the end', function(){
        row.cells = [cell1, cell2, cell3];
        var c = new Cell('new cell');
        row.insertCellAt(2, c);
        expect(row.cells[0]).toBe(cell1);
        expect(row.cells[1]).toBe(cell2);
        expect(row.cells[2]).toBe(c);
        expect(row.cells[3]).toBe(cell3);
    });

    it('inserts a cell at the end', function(){
        row.cells = [cell1, cell2, cell3];
        var c = new Cell('new cell');
        row.insertCellAt(3, c);
        expect(row.cells[0]).toBe(cell1);
        expect(row.cells[1]).toBe(cell2);
        expect(row.cells[2]).toBe(cell3);
        expect(row.cells[3]).toBe(c);
    });


    describe('append style to a cell:', function(){
        it('Throws an error if the cell number is negative', function(){
            expect(function(){
                row.appendStyleToCell(-1, "whatever");
            }).toThrow('The cell is not found!');
        });
        it('Throws an error if the cell number is not integer', function(){
            expect(function(){
                row.appendStyleToCell(1.34, "whatever");
            }).toThrow('The cell is not found!');
        });
        it('Throws an error if the cell number is too big', function(){
            spyOn(row, 'cellNum').andCallFake(function(){
                return 3;
            });
            expect(function(){
                row.appendStyleToCell(5, "whatever");
            }).toThrow('The cell is not found!');
        });
        it('Throws an error if the cell number is equal to number of the cells', function(){
            spyOn(row, 'cellNum').andCallFake(function(){
                return 5;
            });
            expect(function(){
                row.appendStyleToCell(5, "whatever");
            }).toThrow('The cell is not found!');
        });
        it('Does not throw any error if the cell number is one less than the number of the cells', function(){
            spyOn(row, 'cellNum').andCallFake(function(){
                return 12;
            });
            expect(function(){
                row.appendStyleToCell(11, "whatever");
            }).not.toThrow('The cell is not found!');
        });
        it('calls append Style method on a middle cell of the row', function(){
            spyOn(cell1, 'appendStyle');
            spyOn(cell2, 'appendStyle');
            spyOn(cell3, 'appendStyle');
            spyOn(cell4, 'appendStyle');
            row.cells = [cell1, cell2, cell3, cell4];
            row.appendStyleToCell(2, "whatever");
            expect(cell1.appendStyle).not.toHaveBeenCalled();
            expect(cell2.appendStyle).not.toHaveBeenCalled();
            expect(cell3.appendStyle).toHaveBeenCalledWith("whatever");
            expect(cell4.appendStyle).not.toHaveBeenCalled();
        });

        it('calls append Style method on the first cell of the row', function(){
            spyOn(cell1, 'appendStyle');
            spyOn(cell2, 'appendStyle');
            spyOn(cell3, 'appendStyle');
            row.cells = [cell1, cell2, cell3];
            row.appendStyleToCell(0, "whatever");
            expect(cell1.appendStyle).toHaveBeenCalledWith("whatever");
            expect(cell2.appendStyle).not.toHaveBeenCalled();
            expect(cell3.appendStyle).not.toHaveBeenCalled();
        });

        it('calls append Style method on the last cell of the row', function(){
            spyOn(cell1, 'appendStyle');
            spyOn(cell2, 'appendStyle');
            spyOn(cell3, 'appendStyle');
            spyOn(cell4, 'appendStyle');
            row.cells = [cell1, cell2, cell3, cell4];
            row.appendStyleToCell(3, "whatever");
            expect(cell1.appendStyle).not.toHaveBeenCalled();
            expect(cell2.appendStyle).not.toHaveBeenCalled();
            expect(cell3.appendStyle).not.toHaveBeenCalled();
            expect(cell4.appendStyle).toHaveBeenCalledWith("whatever");
        });



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
