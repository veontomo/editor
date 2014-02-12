/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, Table, Cell, Row, Content, TableRowStyle, Attributes, Style, jasmine, Tag*/

describe('Row-related functionality:', function(){
    var row, cell1, cell2, cell3, cell4, table;
    beforeEach(function(){
        cell1 = new Cell();
        cell2 = new Cell();
        cell3 = new Cell();
        cell4 = new Cell();
        row = new Row();
        table = new Table();
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

    describe('Row::name: tag name for the Row', function(){
        it('has the property name set to "tr"', function(){
            expect(row.name).toBe('tr');
        });
    });

    describe('Row::appendCell(): appends a cell', function(){
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

    describe('Row::cellNum(): gets the number of cells', function(){
        it('calls parent method length()', function(){
            spyOn(row, 'length').andCallFake(function(){return 'parent length';});
            row.cellNum();
            expect(row.length).toHaveBeenCalled();
            expect(row.length()).toBe('parent length');
        });
    });

    describe('Row::getCellWidths(): gets widths of the cells', function(){
        it('if the row has no cells', function(){
            row.content.elements = [];
            expect(row.getCellWidths().length).toBe(0);
        });
        it('if the row has one cell', function(){
            spyOn(cell1, 'getWidth').andCallFake(function(){
                return 'row 1 width';
            });
            row.content.elements = [cell1];
            expect(row.getCellWidths().length).toBe(1);
            expect(row.getCellWidths()[0]).toBe('row 1 width');
        });
        it('if the row has two cells', function(){
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
        });
    });

    describe('Row::setCellWidths(): sets widths of the cells of the row', function(){
        it('throws an error if the input array and the row have equal lengths', function(){
            spyOn(row, 'length').andCallFake(function(){return 10;});
            expect(function(){
                row.setCellWidths([1, 0.11]);
            }).toThrow('Incompatible array length!');
        });
        it('does not throw an error if the input array and the row are both empty', function(){
            spyOn(row, 'length').andCallFake(function(){return 0;});
            expect(function(){
                row.setCellWidths([]);
            }).not.toThrow('Incompatible array length!');
        });

        it('calls Cell::setWidth() on the Cell instances if the input array and the row have the same length', function(){
            spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
            spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
            spyOn(row, 'length').andCallFake(function(){return 2;});
            row.content.elements = [cell1, cell2];
            row.setCellWidths([1, 0.11]);
            expect(cell1.setWidth).toHaveBeenCalledWith(1);
            expect(cell2.setWidth).toHaveBeenCalledWith(0.11);
        });
    });


    describe('Row::dropCellAt(): deletes the cell', function(){
        it('calls parent method to delete the cell', function(){
            spyOn(row, 'dropElemAt');
            row.dropCellAt('position');
            expect(row.dropElemAt).toHaveBeenCalledWith('position');
        });
    });

    describe('Row::knockOutCell(): deletes a cell and resizes the remaining ones', function(){
        it('deletes the first cell', function(){
            cell1.setWidth(200);
            cell2.setWidth(110);
            cell3.setWidth(150);
            row.content.elements = [cell1, cell2, cell3];
            expect(row.cellNum()).toBe(3);
            row.knockOutCell(0);
            expect(row.cellNum()).toBe(2);
            expect(row.getElem(0).getWidth()).toBe(310);
            expect(row.getElem(1).getWidth()).toBe(150);
        });

        it('deletes a middle cell', function(){
            cell1.setWidth(200);
            cell2.setWidth(110);
            cell3.setWidth(150);
            cell4.setWidth(50);
            row.content.elements = [cell1, cell2, cell3, cell4];
            row.knockOutCell(1);
            expect(row.cellNum()).toBe(3);
            expect(row.getElem(0).getWidth()).toBe(200);
            expect(row.getElem(1).getWidth()).toBe(260);
            expect(row.getElem(2).getWidth()).toBe(50);
        });

        it('deletes the last cell', function(){
            cell1.setWidth(200);
            cell2.setWidth(110);
            cell3.setWidth(150);
            cell4.setWidth(60);
            row.content.elements = [cell1, cell2, cell3, cell4];
            row.knockOutCell(3);
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
            row.knockOutCell(row.cellNum() + 10); // delete non-existing row
            expect(row.cellNum()).toBe(3);
            expect(row.getElem(0).getWidth()).toBe(200);
            expect(row.getElem(1).getWidth()).toBe(110);
            expect(row.getElem(2).getWidth()).toBe(150);
        });
    });


    describe('Row::insertCellAt(): inserts cell at given position', function(){
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

    describe('Row::appendStyleToCellAt(): append style to the cell:', function(){
        it('Throws an error if the cell number is negative', function(){
            spyOn(row, 'appendStyleToElemAt').andCallFake(function(){
                return null;
            });
            row.appendStyleToCellAt(213, 'style stub');
            expect(row.appendStyleToElemAt).toHaveBeenCalledWith(213, 'style stub');

        });
    });

    describe('Row::onlyTableInside(): whether the row admits defragmentation', function(){
        it('gives false, if the row is empty', function(){
            spyOn(row, 'cellNum').andCallFake(function(){return 0;});
            expect(row.onlyTableInside()).toBe(false);
            expect(row.cellNum).toHaveBeenCalled();
        });
        it('gives false, if the row contains more than one cell', function(){
            spyOn(row, 'cellNum').andCallFake(function(){return 25;});
            expect(row.onlyTableInside()).toBe(false);
            expect(row.cellNum).toHaveBeenCalled();
        });
        it('gives false, if the row contains one cell and the cell has more than one element', function(){
            spyOn(row, 'cellNum').andCallFake(function(){return 1;});
            spyOn(row, 'getFirst').andCallFake(function(){return cell1;});
            spyOn(cell1, 'length').andCallFake(function(){return 2;});
            expect(row.onlyTableInside()).toBe(false);
            expect(cell1.length).toHaveBeenCalled();
            expect(row.getFirst).toHaveBeenCalled();
            expect(row.cellNum).toHaveBeenCalled();
        });


        it('gives true, if the row has unique cell and this cell has a table and nothing more', function(){
            spyOn(row, 'cellNum').andCallFake(function(){return 1;});
            spyOn(row, 'getFirst').andCallFake(function(){return cell1;});
            spyOn(cell1, 'length').andCallFake(function(){return 1;});
            spyOn(cell1, 'getFirst').andCallFake(function(){return new Table;});
            expect(row.onlyTableInside()).toBe(true);
            expect(cell1.length).toHaveBeenCalled();
            expect(row.getFirst).toHaveBeenCalled();
            expect(row.cellNum).toHaveBeenCalled();
            expect(cell1.getFirst).toHaveBeenCalled();
        });
    });

});
