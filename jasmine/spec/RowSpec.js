/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, Table, Cell, Row, Content, TableRowStyle, Attributes, Style, jasmine, Tag*/

describe('Row-related functionality:', function(){
    var row, rowStyle, cell1, cell2, cell3, cell4;
    beforeEach(function(){
        cell1 = new Cell();
        cell2 = new Cell();
        cell3 = new Cell();
        cell4 = new Cell();
        row = new Row();
        // rowAttr = new Attributes();
        rowStyle = new TableRowStyle();
    });

    describe('inherits properly from Tag() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            row.attr.width = 102;
            expect((new Row()).attr.width).not.toBe(102);
            row.style.width = 34;
            expect((new Row()).style.width).not.toBe(34);
        });
        describe('inherits properly from Tag() class', function(){
            it('instance of Row is an instance of Tag as well', function(){
                expect(row instanceof Tag).toBe(true);
            });
            it('does not affect parent attr if it is changed in the child', function(){
                expect((new Row()).attr.width).not.toBe(102);
                row.attr.width = 102;
                expect((new Row()).attr.width).not.toBe(102);
                expect(row.attr.width).toBe(102);
            });
            it('does not affect parent style if it is changed in the child', function(){
                expect((new Row()).style.width).not.toBe('whatever');
                row.style.width = 'whatever';
                expect((new Row()).style.width).not.toBe('whatever');
                expect(row.style.width).toBe('whatever');
            });

            it('does not affect parent name property if it is changed in the child', function(){
                expect((new Tag()).name).toBe(null);
                expect((new Row()).name).toBe('tr');
                row.name = 'whatever';
                expect((new Tag()).name).toBe(null);
                expect((new Row()).name).toBe('tr');
                expect(row.name).toBe('whatever');
            });
        });
    });

    it('has property name set to "tr"', function(){
        expect(row.name).toBe('tr');
    });

    describe('appends a cell', function(){
        it('throws an error if not Cell instance is provided', function(){
            var obj = {};
            expect(obj instanceof Cell).toBe(false);
            expect(function(){
                row.appendCell(obj);
            }).toThrow('The argument is not a Cell instance!');
        });

        it('call Content::appendElem when appending cell', function(){
            spyOn(row, 'appendElem');
            expect(cell1 instanceof Cell).toBe(true);
            row.appendCell(cell1);
            expect(row.appendElem).toHaveBeenCalledWith(cell1);
        });
    });

    it('calls parent method to get the number of cells in the row', function(){
        spyOn(row, 'length').andCallFake(function(){return 'parent length';});
        row.cellNum();
        expect(row.length).toHaveBeenCalled();
        expect(row.length()).toBe('parent length');
    });

    describe('retrieves the style properites', function(){
        it('if the property is a string', function() {
            rowStyle['a property'] = 'row property value';
            row.style = rowStyle;
            expect(row.styleProperty('a property')).toEqual('row property value');
        });

        it('if the property is a number', function() {
            rowStyle['a-property'] = 12.6;
            row.style = rowStyle;
            expect(row.styleProperty('a-property')).toEqual(12.6);
        });

        it('if the property is not set ', function() {
            if (rowStyle.hasOwnProperty('row property')) {
                delete rowStyle['row property'];
            }
            row.style = rowStyle;
            expect(row.styleProperty('row property')).not.toBeDefined();
        });
    });

    it('gets widths of the cells', function(){
        spyOn(cell1, 'getWidth').andCallFake(function(){
            return 'row 1 width';
        });
        spyOn(cell2, 'getWidth').andCallFake(function(){
            return 'row 2 width';
        });

        row.content.elements = [cell1, cell2];
        expect(row.getCellWidths().length).toBe(2);
        expect(row.getCellWidths()[0]).toBe('row 1 width');
        expect(row.getCellWidths()[1]).toBe('row 2 width');

        row.content.elements = [cell1];
        expect(row.getCellWidths().length).toBe(1);
        expect(row.getCellWidths()[0]).toBe('row 1 width');

        row.content.elements = [];
        expect(row.getCellWidths().length).toBe(0);
    });

    describe('sets widths of the cells of the row', function(){
        it('throws an error if the input array length is different from the row cell length', function(){
            spyOn(row, 'length').andCallFake(function(){return 10;});
            expect(function(){
                row.setCellWidths([1, 0.11]);
            }).toThrow('Incompatible array length!');
        });
        it('does not throw an error if the input array length is different from the row cell length', function(){
            spyOn(row, 'length').andCallFake(function(){return 0;});
            expect(function(){
                row.setCellWidths([]);
            }).not.toThrow('Incompatible array length!');
        });

        it('calls setWidth() of the Cell instances if the input array length is equal to the row cell length', function(){
            spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
            spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
            spyOn(row, 'length').andCallFake(function(){return 2;});
            row.content.elements = [cell1, cell2];
            row.setCellWidths([1, 0.11]);
            expect(cell1.setWidth).toHaveBeenCalledWith(1);
            expect(cell2.setWidth).toHaveBeenCalledWith(0.11);
        });
        it('does not call setWidth() of the Cell instances if the input array length and the row are both empty', function(){
            spyOn(row, 'length').andCallFake(function(){return 0;});
            spyOn(cell1, 'setWidth');
            spyOn(cell2, 'setWidth');
            row.content.elements = [cell1, cell2];
            row.setCellWidths([]);
            expect(cell1.setWidth).not.toHaveBeenCalled();
            expect(cell2.setWidth).not.toHaveBeenCalled();
        });
    });

    it('calls parent method to to delete cell', function(){
        spyOn(row, 'dropElemAt');
        row.dropCellAt('position');
        expect(row.dropElemAt).toHaveBeenCalledWith('position');
    });

    it('deletes the first cell in the row', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        row.content.elements = [cell1, cell2, cell3];
        expect(row.cellNum()).toBe(3);
        row.dropCell(0);
        expect(row.cellNum()).toBe(2);
        expect(row.getElem(0).getWidth()).toBe(310);
        expect(row.getElem(1).getWidth()).toBe(150);
    });

    it('deletes a middle cell in the row', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        cell4.setWidth(50);
        row.content.elements = [cell1, cell2, cell3, cell4];
        row.dropCell(1);
        expect(row.cellNum()).toBe(3);
        expect(row.getElem(0).getWidth()).toBe(200);
        expect(row.getElem(1).getWidth()).toBe(260);
        expect(row.getElem(2).getWidth()).toBe(50);
    });

    it('deletes the last cell in the row', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        cell4.setWidth(60);
        row.content.elements = [cell1, cell2, cell3, cell4];
        row.dropCell(3);
        expect(row.cellNum()).toBe(3);
        expect(row.getElem(0).getWidth()).toBe(200);
        expect(row.getElem(1).getWidth()).toBe(110);
        expect(row.getElem(2).getWidth()).toBe(210);
    });

    it('when asked to delete a non-existing cell, the cell widths remain unchanged', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        row.content.elements = [cell1, cell2, cell3];
        row.dropCell(row.cellNum() + 10); // delete non-existing row
        expect(row.cellNum()).toBe(3);
        expect(row.getElem(0).getWidth()).toBe(200);
        expect(row.getElem(1).getWidth()).toBe(110);
        expect(row.getElem(2).getWidth()).toBe(150);
    });


    describe('inserts cell at given position', function(){
        it('throws an error if trying to insert a non Cell instance', function(){
            var obj = {};
            expect(obj instanceof Cell).toBe(false);
            expect(function(){
                row.insertCellAt('any position', obj);
            }).toThrow('Only a Cell instance is allowed for insertion!');
        });

        it('calls parent method insertElemAt()', function(){
            var c = new Cell('new row');
            spyOn(row, 'insertElemAt');
            expect(c instanceof Cell).toBe(true);
            row.insertCellAt(21, c);
            expect(row.insertElemAt).toHaveBeenCalledWith(21, c);
        });
    });

    describe('append style to a cell:', function(){
        it('Throws an error if the cell number is negative', function(){
            expect(function(){
                row.appendStyleToCell(-1, "whatever");
            }).toThrow('Cell is not found!');
        });
        it('Throws an error if the row number is not integer', function(){
            expect(function(){
                row.appendStyleToCell(1.34, "whatever");
            }).toThrow('Cell is not found!');
        });
        it('Throws an error if the row number is too big', function(){
            spyOn(row, 'cellNum').andCallFake(function(){
                return 3;
            });
            expect(function(){
                row.appendStyleToCell(5, "whatever");
            }).toThrow('Cell is not found!');
        });
        it('Throws an error if the row number is equal to number of the cells', function(){
            spyOn(row, 'cellNum').andCallFake(function(){
                return 5;
            });
            expect(function(){
                row.appendStyleToCell(5, "whatever");
            }).toThrow('Cell is not found!');
        });
        it('Does not throw any error if the row number is one less than the number of the cells', function(){
            spyOn(row, 'cellNum').andCallFake(function(){
                return 12;
            });
            expect(function(){
                row.appendStyleToCell(11, "whatever");
            }).not.toThrow('Cell is not found!');
        });
        it('calls append Style method on a middle row of the row', function(){
            spyOn(cell1, 'appendStyle');
            spyOn(cell2, 'appendStyle');
            spyOn(cell3, 'appendStyle');
            spyOn(cell4, 'appendStyle');
            row.content.elements = [cell1, cell2, cell3, cell4];
            row.appendStyleToCell(2, "whatever");
            expect(cell1.appendStyle).not.toHaveBeenCalled();
            expect(cell2.appendStyle).not.toHaveBeenCalled();
            expect(cell3.appendStyle).toHaveBeenCalledWith("whatever");
            expect(cell4.appendStyle).not.toHaveBeenCalled();
        });

        it('calls append Style method on the first row of the row', function(){
            spyOn(cell1, 'appendStyle');
            spyOn(cell2, 'appendStyle');
            spyOn(cell3, 'appendStyle');
            row.content.elements = [cell1, cell2, cell3];
            row.appendStyleToCell(0, "whatever");
            expect(cell1.appendStyle).toHaveBeenCalledWith("whatever");
            expect(cell2.appendStyle).not.toHaveBeenCalled();
            expect(cell3.appendStyle).not.toHaveBeenCalled();
        });

        it('calls append Style method on the last row of the row', function(){
            spyOn(cell1, 'appendStyle');
            spyOn(cell2, 'appendStyle');
            spyOn(cell3, 'appendStyle');
            spyOn(cell4, 'appendStyle');
            row.content.elements = [cell1, cell2, cell3, cell4];
            row.appendStyleToCell(3, "whatever");
            expect(cell1.appendStyle).not.toHaveBeenCalled();
            expect(cell2.appendStyle).not.toHaveBeenCalled();
            expect(cell3.appendStyle).not.toHaveBeenCalled();
            expect(cell4.appendStyle).toHaveBeenCalledWith("whatever");
        });
    });

});
