/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Table, Cell, Row, Tag*/

describe('Row-related functionality:', function(){
    var row, cell1, cell2, cell3, cell4;
    beforeEach(function(){
        cell1 = new Cell();
        cell2 = new Cell();
        cell3 = new Cell();
        cell4 = new Cell();
        row = new Row();
    });

    describe('inherits properly from Tag() class', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            row = Row();
            expect(row instanceof Row).toBe(true);
        });

        it('instance of Row is an instance of Tag as well', function(){
            expect(row instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Row()).attr).not.toBe(102);
            row.attr = 102;
            expect((new Row()).attr).not.toBe(102);
            expect(row.attr).toBe(102);
        });
        it('does not affect parent style if it is changed in the child', function(){
            expect((new Row()).getStyleProperty('width')).not.toBe('whatever');
            row.setStyleProperty('width', 'whatever');
            expect((new Row()).getStyleProperty('width')).not.toBe('whatever');
            expect(row.getStyleProperty('width')).toBe('whatever');
        });
    });

    describe('Row::tag: tag name for the Row', function(){
        it('has the property name set to "tr"', function(){
            expect(row.getTag()).toBe('tr');
        });
    });

    describe('Row::className: class name', function(){
        it('gives the name of the class', function(){
            expect(row.getName()).toBe('Row');
        });
    });

    describe('Row::appendCell(): appends a cell', function(){
        it('throws an error if not Cell instance is provided', function(){
            var obj = {};
            expect(obj instanceof Cell).toBe(false);
            expect(function(){
                return row.appendCell(obj);
            }).toThrow(new Error('The argument is not a Cell instance!'));
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
            spyOn(row, 'length').and.returnValue('parent length');
            row.cellNum();
            expect(row.length).toHaveBeenCalled();
            expect(row.length()).toBe('parent length');
        });
    });

    describe('Row::getCellWidths(): gets widths of the cells', function(){
        it('gives empty array if the row content is empty', function(){
            var fakeContent = {length: function(){return null;}};
            spyOn(row, 'getContent').and.returnValue(fakeContent);
            spyOn(fakeContent, 'length').and.returnValue(0);
            expect(row.getCellWidths().length).toBe(0);
        });
        it('returns 1-element array with cell width', function(){
            spyOn(cell1, 'getWidthValue').and.returnValue('row 1 width');
            row.appendElem(cell1);
            expect(row.getCellWidths().length).toBe(1);
            expect(row.getCellWidths()[0]).toBe('row 1 width');
        });
        it('returns 2-element array with cell widths if the row has two cells', function(){
            spyOn(cell1, 'getWidthValue').and.returnValue('row 1 width');
            spyOn(cell2, 'getWidthValue').and.returnValue('row 2 width');
            row.appendElem(cell1);
            row.appendElem(cell2);
            expect(row.getCellWidths().length).toBe(2);
            expect(row.getCellWidths()[0]).toBe('row 1 width');
            expect(row.getCellWidths()[1]).toBe('row 2 width');
        });
    });

    describe('Row::setCellWidths(): sets widths of the cells of the row', function(){
        it('throws an error if the input array and the row have equal lengths', function(){
            spyOn(row, 'length').and.returnValue(10);
            expect(function(){
                return row.setCellWidths([1, 0.11]);
            }).toThrow(new Error('Incompatible array length!'));
        });
        it('does not throw an error if the input array and the row are both empty', function(){
            spyOn(row, 'length').and.returnValue(0);
            expect(function(){
                row.setCellWidths([]);
            }).not.toThrow('Incompatible array length!');
        });

        it('calls Cell::setWidth() on the Cell instances if the input array and the row have the same length', function(){
            spyOn(cell1, 'setWidth').and.returnValue(null);
            spyOn(cell2, 'setWidth').and.returnValue(null);
            spyOn(row, 'length').and.returnValue(2);
            row.appendElem(cell1);
            row.appendElem(cell2);
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

    xdescribe('Row::knockOutCell(): deletes a cell and resizes the remaining ones', function(){
        it('deletes the first cell', function(){
            cell1.setWidth(200);
            cell2.setWidth(110);
            cell3.setWidth(150);
            row.appendElem(cell1);
            row.appendElem(cell2);
            row.appendElem(cell3);

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
            row.appendElem(cell1);
            row.appendElem(cell2);
            row.appendElem(cell3);
            row.appendElem(cell4);


            // row.content.elements = [cell1, cell2, cell3, cell4];
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
            // row.content.elements = [cell1, cell2, cell3, cell4];
            row.appendElem(cell1);
            row.appendElem(cell2);
            row.appendElem(cell3);
            row.appendElem(cell4);

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
            row.appendElem(cell1);
            row.appendElem(cell2);
            row.appendElem(cell3);

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
                return row.insertCellAt('any position', obj);
            }).toThrow(new Error('Only a Cell instance is allowed for insertion!'));
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
            spyOn(row, 'appendStyleToElemAt').and.returnValue(null);
            row.appendStyleToCellAt(213, 'style stub');
            expect(row.appendStyleToElemAt).toHaveBeenCalledWith(213, 'style stub');

        });
    });

    describe('Row::onlyTableInside(): whether the row admits defragmentation', function(){
        it('gives false, if the row is empty', function(){
            spyOn(row, 'cellNum').and.returnValue(0);
            expect(row.onlyTableInside()).toBe(false);
            expect(row.cellNum).toHaveBeenCalled();
        });
        it('gives false, if the row contains more than one cell', function(){
            spyOn(row, 'cellNum').and.returnValue(25);
            expect(row.onlyTableInside()).toBe(false);
            expect(row.cellNum).toHaveBeenCalled();
        });
        it('gives false, if the row contains one cell and the cell has more than one element', function(){
            spyOn(row, 'cellNum').and.returnValue(1);
            spyOn(row, 'getFirst').and.returnValue(cell1);
            spyOn(cell1, 'length').and.returnValue(2);
            expect(row.onlyTableInside()).toBe(false);
            expect(cell1.length).toHaveBeenCalled();
            expect(row.getFirst).toHaveBeenCalled();
            expect(row.cellNum).toHaveBeenCalled();
        });


        it('gives true, if the row has unique cell and this cell has a table and nothing more', function(){
            spyOn(row, 'cellNum').and.returnValue(1);
            spyOn(row, 'getFirst').and.returnValue(cell1);
            spyOn(cell1, 'length').and.returnValue(1);
            spyOn(cell1, 'getFirst').and.returnValue(new Table());
            expect(row.onlyTableInside()).toBe(true);
            expect(cell1.length).toHaveBeenCalled();
            expect(row.getFirst).toHaveBeenCalled();
            expect(row.cellNum).toHaveBeenCalled();
            expect(cell1.getFirst).toHaveBeenCalled();
        });
    });

    describe('Gets phantom cell styles/attributes', function(){
        describe('If method onlyTableInside() returns false', function(){
            beforeEach(function(){
                spyOn(row, 'onlyTableInside').and.returnValue(false);
            });
            it('returns undefined if onlyTableInside() returns false', function(){
                expect(row.getPhantomCellProp('whatever')).not.toBeDefined();
            });
        });
        describe('If method onlyTableInside() returns true', function(){
            beforeEach(function(){
                spyOn(row, 'onlyTableInside').and.returnValue(true);
            });
            it('returns undefined if called with neither "attr" nor "style"', function(){
                expect(row.getPhantomCellProp('foo')).not.toBeDefined();
            });
            it('returns styles of the first element if called with argument "style"', function(){
                spyOn(row, 'getFirst').and.returnValue({getStyles: function(){return 'first element styles';}});
                expect(row.getPhantomCellProp('style')).toBe('first element styles');
            });
            it('returns styles of the first element if called with argument "attr"', function(){
                spyOn(row, 'getFirst').and.returnValue({getProperties: function(){return 'first element attributes';}});
                expect(row.getPhantomCellProp('attr')).toBe('first element attributes');
            });

        });
    });

    describe('Getting attributes of the phantom cell', function(){
        it('is an alias for getPhantomCellAttr("attr")', function(){
            spyOn(row, 'getPhantomCellProp');
            row.phantomCellAttr();
            expect(row.getPhantomCellProp).toHaveBeenCalledWith('attr');
        });
    });

    describe('Getting style of the phantom cell', function(){
        it('calls Row::getPhantomCellProp("style")', function(){
            spyOn(row, 'getPhantomCellProp');
            row.phantomCellStyles();
            expect(row.getPhantomCellProp).toHaveBeenCalledWith('style');
        });
    });

    describe('Retrieving styles of phantom table inside the row', function(){
        it('returns undefined, if onlyTableInside returns false', function(){
            spyOn(row, 'onlyTableInside').and.returnValue(false);
            expect(row.phantomTableStyles()).not.toBeDefined();
        });
        it('returns styles, if onlyTableInside returns true', function(){
            var c = new Cell(),
                t = {'getStyles': function(){return 'fake style object';}};
            spyOn(row, 'onlyTableInside').and.returnValue(true);
            spyOn(row, 'getFirst').and.returnValue(c);
            spyOn(c, 'getFirst').and.returnValue(t);
            expect(row.phantomTableStyles()).toBe('fake style object');
            expect(row.onlyTableInside).toHaveBeenCalled();
            expect(row.getFirst).toHaveBeenCalled();
            expect(c.getFirst).toHaveBeenCalled();
        });
    });

    describe('Row::phantomTableStyle(): gets styles of phantom table', function(){
        it('calls Row::phantomTableProp("style")', function(){
            spyOn(row, 'getPhantomTableProp');
            row.phantomTableStyles();
            expect(row.getPhantomTableProp).toHaveBeenCalledWith('style');
        });
    });

    describe('Row::phantomTableAttr(): gets attributes of the phantom table', function(){
        it('calls Row::getPhantomTableProp("attr")', function(){
            spyOn(row, 'getPhantomTableProp');
            row.phantomTableAttr();
            expect(row.getPhantomTableProp).toHaveBeenCalledWith('attr');
        });
    });

    describe('Gets phantom table styles/attributes', function(){
        describe('If method onlyTableInside() returns false', function(){
            beforeEach(function(){
                spyOn(row, 'onlyTableInside').and.returnValue(false);
            });
            it('returns undefined if onlyTableInside() returns false', function(){
                expect(row.getPhantomTableProp('whatever')).not.toBeDefined();
            });
        });
        describe('If method onlyTableInside() returns true', function(){
            var tableMock, cellMock;
            beforeEach(function(){
                tableMock = {getStyles: function(){return 'table styles';}, getProperties: function(){return 'table attributes';}};
                cellMock = {getFirst: function(){return tableMock;}};
                spyOn(row, 'onlyTableInside').and.returnValue(true);
                spyOn(row, 'getFirst').and.returnValue(cellMock);

            });
            it('returns undefined if called with neither "attr" nor "style"', function(){
                expect(row.getPhantomTableProp('foo')).not.toBeDefined();
            });
            it('returns styles of the first element if called with argument "style"', function(){
                expect(row.getPhantomTableProp('style')).toBe('table styles');
            });
            it('returns styles of the first element if called with argument "attr"', function(){
                expect(row.getPhantomTableProp('attr')).toBe('table attributes');
            });

        });
    });


});
