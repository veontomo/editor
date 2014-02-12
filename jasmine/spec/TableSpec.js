/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Table, Row, Table, Cell,
Content, TableStyle, TableRowStyle, TableCellStyle, TableAttributes, Attributes, Style, createTableFromHtml, jasmine, Tag */

describe('Table-related functionality:', function(){
    var table, tableAttr, tableStyle, row1, row2, row3, row4, row5,
        bogusTableAttr, bogusTableStyle, bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle;
    beforeEach(function(){
        table = new Table();
        tableAttr = new Attributes();
        tableStyle = new TableStyle();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
        row4 = new Row();
        row5 = new Row();
        bogusTableAttr = new Attributes();
        bogusTableStyle = new Style();
        bogusRowAttr  = new Attributes();
        bogusRowStyle  = new Style();
        bogusCellAttr  = new Attributes();
        bogusCellStyle  = new Style();
    });

    describe('inherits properly from Tag() class', function(){
        it('instance of Table is an instance of Tag as well', function(){
            expect(table instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Table()).attr.width).not.toBe(102);
            table.attr.width = 102;
            expect((new Table()).attr.width).not.toBe(102);
            expect(table.attr.width).toBe(102);
        });
        it('does not affect parent style if it is changed in the child', function(){
            expect((new Table()).style.width).not.toBe('whatever');
            table.style.width = 'whatever';
            expect((new Table()).style.width).not.toBe('whatever');
            expect(table.style.width).toBe('whatever');
        });

        it('does not affect parent name property if it is changed in the child', function(){
            expect((new Tag()).name).toBe(null);
            expect((new Table()).name).toBe('table');
            table.name = 'whatever';
            expect((new Tag()).name).toBe(null);
            expect((new Table()).name).toBe('table');
            expect(table.name).toBe('whatever');
        });
    });

    describe('Table::name: tag name for the Table', function(){
        it('has property name set to "table"', function(){
            expect(table.name).toBe('table');
        });
    });

    describe('Table::appendRow(): appends the row', function(){
        it('throws exception if not a Row instance is appended to the table', function(){
            var foo = {};
            expect(foo instanceof Row).toBe(false);
            expect(function(){
                table.appendRow(foo);
            }).toThrow('The argument is not a Row instance!');
         });
        it('calls parent method appendElem() if a Row instance is given', function(){
            spyOn(table, 'appendElem').andCallFake(function(){return null;});
            expect(row1 instanceof Row).toBe(true);
            table.appendRow(row1);
            expect(table.appendElem).toHaveBeenCalledWith(row1);
        });
    });

    describe('Table::getMatrix(): 2-dim array of the cell widths in each row', function(){
        var matrix;
        it('gives empty array if the table has no rows', function(){
            spyOn(table, 'length').andCallFake(function(){return 0;});
            expect(table.getMatrix().length).toBe(0);
        });
        it('calls Row::getCellWidths for one-row table', function(){
            spyOn(row1, 'getCellWidths').andCallFake(function(){
                return 'array of cell widths of the unique row';
            });
            table.content.elements = [row1];
            matrix = table.getMatrix();
            expect(matrix.length).toBe(1);
            expect(row1.getCellWidths).toHaveBeenCalled();
            expect(matrix[0]).toBe('array of cell widths of the unique row');
        });
        it('calls Row::getCellWidths on each row for three-row table', function(){
            spyOn(row1, 'getCellWidths').andCallFake(function(){
                return 'array of cell widths of the first row';
            });
            spyOn(row2, 'getCellWidths').andCallFake(function(){
                return 'array of cell widths of the second row';
            });
            spyOn(row3, 'getCellWidths').andCallFake(function(){
                return 'array of cell widths of the third row';
            });
            table.content.elements = [row1, row2, row3];
            matrix = table.getMatrix();
            expect(row1.getCellWidths).toHaveBeenCalled();
            expect(row2.getCellWidths).toHaveBeenCalled();
            expect(row3.getCellWidths).toHaveBeenCalled();
            expect(matrix.length).toBe(3);
            expect(matrix[0]).toBe('array of cell widths of the first row');
            expect(matrix[1]).toBe('array of cell widths of the second row');
            expect(matrix[2]).toBe('array of cell widths of the third row');
        });


        // it('gets "matrix" of widths', function(){
        //     expect((new Table()).length()).toBe(0);
        //     expect((new Tag()).length()).toBe(0);
        //     expect((new Table()).length()).toBe(0);
        //     expect((new Row()).length()).toBe(0);

        //     spyOn(row1, 'getCellWidths').andCallFake(function(){
        //         return 'table widths of row 1';
        //     });
        //     spyOn(row2, 'getCellWidths').andCallFake(function(){
        //         return 'table widths of row 2';
        //     });
        //     spyOn(row3, 'getCellWidths').andCallFake(function(){
        //         return 'table widths of row 3';
        //     });
        //     table.content.elements = [row1, row2, row3];
        //     expect((new Table()).length()).toBe(0);
        //     expect((new Tag()).length()).toBe(0);
        //     expect((new Table()).length()).toBe(0);
        //     expect((new Row()).length()).toBe(0);

        //     expect(table.getMatrix().length).toBe(3);
        //     expect(table.getMatrix()[0]).toBe('table widths of row 1');
        //     expect(table.getMatrix()[1]).toBe('table widths of row 2');
        //     expect(table.getMatrix()[2]).toBe('table widths of row 3');

        //     table.content.elements = [row1, row3];
        //     expect(table.getMatrix().length).toBe(2);
        //     expect(table.getMatrix()[0]).toBe('table widths of row 1');
        //     expect(table.getMatrix()[1]).toBe('table widths of row 3');

        //     table.content.elements = [];
        //     expect(table.getMatrix().length).toBe(0);
        // });
    });

    describe('Table::setProfile(): sets the widths of the columns', function(){
        it('throws an error if the argument is not array', function(){
            expect(function(){
                table.setProfile('not array');
            }).toThrow('Wrong argument type: array expected.');
        });

        it('throws an error if input array length is different from the number of the columns', function(){
            spyOn(table, 'colNum').andCallFake(function(){return 20;});
            expect(function(){
                table.setProfile([1, 2]);
            }).toThrow('Wrong input array lenght!');
        });
        it('does not throw an error if input array and the table have zero lengths', function(){
            spyOn(table, 'colNum').andCallFake(function(){return 0;});
            expect(function(){
                table.setProfile([]);
            }).not.toThrow('Wrong input array lenght!');
        });

        it('calls Row::setCellWidths if the table has one row', function(){
            spyOn(row1, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 5;});
            table.content.elements = [row1];
            table.setProfile([2, 4, 6, 1, 2]);
            expect(row1.setCellWidths).toHaveBeenCalledWith([2, 4, 6, 1, 2]);
        });
        it('calls Row::setCellWidths if the table has three rows', function(){
            spyOn(row1, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(row2, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(row3, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 4;});
            table.content.elements = [row1, row2, row3];
            table.setProfile(['any', 'four', 'element', 'array']);
            expect(row1.setCellWidths).toHaveBeenCalledWith(['any', 'four', 'element', 'array']);
            expect(row2.setCellWidths).toHaveBeenCalledWith(['any', 'four', 'element', 'array']);
            expect(row3.setCellWidths).toHaveBeenCalledWith(['any', 'four', 'element', 'array']);
        });
    });

    describe('Table.getProfile(): gets table profile', function(){
        it('gets "null" if not all rows have the same cell widths', function(){
            spyOn(table, 'isSameWidths').andCallFake(function(){
                return false;
            });
            expect(table.getProfile()).toBe(null);
        });
        it('gets the first element of getMatrix() array, if all rows have the same cell widths', function(){
            spyOn(table, 'isSameWidths').andCallFake(function(){
                return true;
            });
            spyOn(table, 'getMatrix').andCallFake(function(){
                return ['profile of the first row', 'the rest'];
            });
            expect(table.getProfile()).toBe('profile of the first row');
        });
    });

    describe('Table::isSameWidths(): whether all table rows have the same profiles', function(){
        it('gets true for empty table', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [];
            });
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a table with an empty row', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[]];
            });
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a 2 x 3 table with the same row profiles', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[1, 2, 3], [1, 2, 3]];
            });
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets false for a non-rectangular table with different row profiles', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[1, 2], [1, 2, 3]];
            });
            expect(table.isSameWidths()).toBe(false);
        });

        it('gets false for a table with empty first row and non-empty second row', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[], [1, 2, 3]];
            });
            expect(table.isSameWidths()).toBe(false);
        });
        it('gets true for a 4 x 4 tables with the same row profiles', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[89, 32, 83, 1], [89, 32, 83, 1], [89, 32, 83, 1], [89, 32, 83, 1]];
            });
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a 5 x 4 tables with the same row profiles', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21]];
            });
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a 5 x 4 tables with different row profiles', function(){
            spyOn(table, 'getMatrix').andCallFake(function(){
                return [[94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 'XXX']];
            });
            expect(table.isSameWidths()).toBe(false);
        });
    });

    describe('Table::knockOutCol(): knocks out given column', function(){
        it('calls method Row::dropCell() on each row', function(){
            spyOn(row1, 'knockOutCell').andCallFake(function(){return null;});
            spyOn(row2, 'knockOutCell').andCallFake(function(){return null;});
            spyOn(row3, 'knockOutCell').andCallFake(function(){return null;});
            table.content.elements  = [row1, row2, row3];
            table.knockOutCol('cell number to knock out');
            expect(row1.knockOutCell).toHaveBeenCalledWith('cell number to knock out');
            expect(row2.knockOutCell).toHaveBeenCalledWith('cell number to knock out');
            expect(row3.knockOutCell).toHaveBeenCalledWith('cell number to knock out');
        });
    });

    describe('Table::dropColAt(): drops given column', function(){
        it('calls method Row::dropCellAt() on each row', function(){
            spyOn(row1, 'dropCellAt').andCallFake(function(){return null;});
            spyOn(row2, 'dropCellAt').andCallFake(function(){return null;});
            spyOn(row3, 'dropCellAt').andCallFake(function(){return null;});
            table.content.elements  = [row1, row2, row3];
            table.dropColAt('cell number to drop');
            expect(row1.dropCellAt).toHaveBeenCalledWith('cell number to drop');
            expect(row2.dropCellAt).toHaveBeenCalledWith('cell number to drop');
            expect(row3.dropCellAt).toHaveBeenCalledWith('cell number to drop');
        });
    });

    describe('Table::colNum(): gives the number of columns', function(){
        it('gives null, if first row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 13;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 10;});
            table.content.elements  = [row1, row2, row3, row4];
            expect(table.colNum()).toBe(null);
        });

        it('gives null, if last row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 14;});
            table.content.elements  = [row1, row2, row3, row4, row5];
            expect(table.colNum()).toBe(null);
        });
        it('gives null, if a middle row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 5;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 5;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 7;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 5;});
            table.content.elements  = [row1, row2, row3, row4];
            expect(table.colNum()).toBe(null);
        });
        it('gives null, if all rows are not of different lenght', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 12;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 5;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 98;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 3;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 14;});
            table.content.elements  = [row1, row2, row3, row4, row5];
            expect(table.colNum()).toBe(null);
        });
        it('gives zero, for empty table', function(){
            expect(table.colNum()).toBe(0);
        });
        it('gives zero, if table contains only empty rows', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 0;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 0;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 0;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 0;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 0;});
            table.content.elements  = [row1, row2, row3, row4, row5];
            expect(table.colNum()).toBe(0);
        });
        it('gives number of cells', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 4;});
            table.content.elements  = [row1, row2, row3, row4, row5];
            expect(table.colNum()).toBe(4);
        });
        it('gives number of cells if table has only one row', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 53;});
            table.content.elements  = [row1];
            expect(table.colNum()).toBe(53);
        });
    });

    describe('Table::insertColAt(): inserts column at given position', function(){
        it('Throws an error if position index is too big', function(){
            spyOn(table, 'colNum').andCallFake(function(){return 5;});
            expect(function(){
                table.insertColAt(7, "table");
            }).toThrow('Wrong index for the cell to insert!');
        });

        it('Throws an error if position index is negative', function(){
            spyOn(table, 'colNum').andCallFake(function(){return 3;});
            expect(function(){
                table.insertColAt(-2, "table");
            }).toThrow('Wrong index for the cell to insert!');
        });

        it('Throws an error if position index is greater than the number of columns', function(){
            spyOn(table, 'colNum').andCallFake(function(){return 3;});
            expect(function(){
                table.insertColAt(4, "table");
            }).toThrow('Wrong index for the cell to insert!');
        });

        it('Does not throw any error if position index is equal to the number of columns', function(){
            spyOn(table, 'colNum').andCallFake(function(){return 3;});
            expect(function(){
                table.insertColAt(3, "table");
            }).not.toThrow('Wrong index for the cell to insert!');
        });

        it('calls a method to insert table', function(){
            var c = new Cell();
            spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 3;});
            table.content.elements = [row1, row2, row3];
            table.insertColAt(1, c);
            expect(row1.insertCellAt).toHaveBeenCalledWith(1, c);
            expect(row2.insertCellAt).toHaveBeenCalledWith(1, c);
            expect(row3.insertCellAt).toHaveBeenCalledWith(1, c);
        });


        it('calls a method to insert cell at the end of the row (appending a column)', function(){
            var c = new Cell();
            spyOn(row1, 'appendCell').andCallFake(function(){return null;});
            spyOn(row2, 'appendCell').andCallFake(function(){return null;});
            spyOn(row3, 'appendCell').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 10;});
            table.content.elements = [row1, row2, row3];
            table.insertColAt(10, c);
            expect(row1.appendCell).toHaveBeenCalledWith(c);
            expect(row2.appendCell).toHaveBeenCalledWith(c);
            expect(row3.appendCell).toHaveBeenCalledWith(c);
        });

        it('calls a method to insert column at the beginning of the row', function(){
            var c = new Table();
            spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 3;});
            table.content.elements = [row1, row2, row3];
            table.insertColAt(0, c);
            expect(row1.insertCellAt).toHaveBeenCalledWith(0, c);
            expect(row2.insertCellAt).toHaveBeenCalledWith(0, c);
            expect(row3.insertCellAt).toHaveBeenCalledWith(0, c);
        });

        it('calls a method to insert column at one position before the end of the row', function(){
            var c = new Table();
            spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 10;});
            table.content.elements = [row1, row2, row3];
            table.insertColAt(9, c);
            expect(row1.insertCellAt).toHaveBeenCalledWith(9, c);
            expect(row2.insertCellAt).toHaveBeenCalledWith(9, c);
            expect(row3.insertCellAt).toHaveBeenCalledWith(9, c);
        });

        it('calls a method to insert column if cell is not provided', function(){
            spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 3;});
            table.content.elements = [row1, row2, row3];
            table.insertColAt(2);
            expect(row1.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
            expect(row2.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
            expect(row3.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
        });
    });

    describe('Table::appendStyleToCol(): Appends style to a single column:', function(){
        it('Throw an error if column number is not integer ', function(){
            spyOn(table, 'colNum').andCallFake(function(){
                return 12;
            });
            expect(function(){
                table.appendStyleToCol(10.32, "whatever");
            }).toThrow('The column is not present!');
        });

        it('Throw an error if column number is negative', function(){
            spyOn(table, 'colNum').andCallFake(function(){
                return 1;
            });
            expect(function(){
                table.appendStyleToCol(-3, "whatever");
            }).toThrow('The column is not present!');
        });

        it('Throw an error if column number is too big', function(){
            spyOn(table, 'colNum').andCallFake(function(){
                return 5;
            });
            expect(function(){
                table.appendStyleToCol(7, "whatever");
            }).toThrow('The column is not present!');
        });

        it('Throw an error if column number is equal to the number of columns', function(){
            spyOn(table, 'colNum').andCallFake(function(){
                return 6;
            });
            expect(function(){
                table.appendStyleToCol(6, "whatever");
            }).toThrow('The column is not present!');
        });

        it('Does not throw an error if column number is one less than the overall column number', function(){
            spyOn(table, 'colNum').andCallFake(function(){
                return 6;
            });
            expect(function(){
                table.appendStyleToCol(5, "whatever");
            }).not.toThrow('The column is not present!');
        });

        it('calls append style method to each row', function(){
            spyOn(table, 'colNum').andCallFake(function(){
                return 5;
            });
            spyOn(row1, 'appendStyleToCellAt').andCallFake(function(){return null;});
            spyOn(row2, 'appendStyleToCellAt').andCallFake(function(){return null;});
            spyOn(row3, 'appendStyleToCellAt').andCallFake(function(){return null;});
            table.content.elements = [row1, row2, row3];
            table.appendStyleToCol(2, "whatever");
            expect(row1.appendStyleToCellAt).toHaveBeenCalledWith(2, "whatever");
            expect(row2.appendStyleToCellAt).toHaveBeenCalledWith(2, "whatever");
            expect(row3.appendStyleToCellAt).toHaveBeenCalledWith(2, "whatever");
        });
    });

    describe('Table::toHtml(): generates html representation of the table', function(){
        it('generates html code of the table if attribute and style properties are both present', function(){
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
                return 'attributes for the table';
            });
            spyOn(tableStyle, 'toString').andCallFake(function(){
                return 'table styles';
            });
            table.attr = tableAttr;
            table.style = tableStyle;
            table.content.elements  = [row1, row2, row3];
            expect(table.toHtml()).toEqual('<table attributes for the table style="table styles">row 1 row 2 html row 3 content</table>');
        });

        it('generates html code of the table if style property is empty', function(){
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
             table.content.elements  = [row1, row2, row3];
             expect(table.toHtml()).toEqual('<table table attributes>row 1 row 2 html row 3 content</table>');
        });

        it('generates html code of the table if attribute property is empty', function(){
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
            table.content.elements  = [row1, row2, row3];
            expect(table.toHtml()).toEqual('<table style="table styles">row 1 row 2 html row 3 content</table>');
        });

        it('generates html code of the table if both attribute and style properties are empty', function(){
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
                return '';
            });
            table.attr = tableAttr;
            table.style = tableStyle;
            table.content.elements  = [row1, row2, row3];
            expect(table.toHtml()).toEqual('<table>row 1 row 2 html row 3 content</table>');
        });


        it('generates html code of the framed table: all bogus attributes and styles are present', function(){
            spyOn(row1, 'toHtml').andCallFake(function(){
                return 'row 1';
            });
            spyOn(row2, 'toHtml').andCallFake(function(){
                return 'row 2 html';
            });
            spyOn(tableAttr, 'toString').andCallFake(function(){
                return 'table attr';
            });
            spyOn(tableStyle, 'toString').andCallFake(function(){
                return 'table styles';
            });
            spyOn(bogusTableStyle, 'toString').andCallFake(function(){
                return 'bogus table styles';
            });
            spyOn(bogusTableAttr, 'toString').andCallFake(function(){
                return 'bogus table attributes';
            });
            spyOn(bogusCellStyle, 'toString').andCallFake(function(){
                return 'bogus table styles';
            });
            spyOn(bogusCellAttr, 'toString').andCallFake(function(){
                return 'bogus table attributes';
            });
            spyOn(bogusRowStyle, 'toString').andCallFake(function(){
                return 'bogus row styles';
            });
            spyOn(bogusRowAttr, 'toString').andCallFake(function(){
                return 'bogus row attributes';
            });

            table.attr = tableAttr;
            table.style = tableStyle;
            table.content.elements  = [row1, row2];
            table.bogusRowAttr = bogusRowAttr;
            table.bogusRowStyle = bogusRowStyle;
            table.bogusCellAttr = bogusCellAttr;
            table.bogusCellStyle = bogusCellStyle;
            table.bogusTableAttr = bogusTableAttr;
            table.bogusTableStyle = bogusTableStyle;

            expect(table.toHtml()).toEqual('<table table attr style="table styles"><tr bogus row attributes style="bogus row styles"><td bogus table attributes style="bogus table styles"><table bogus table attributes style="bogus table styles">row 1</table></td></tr><tr bogus row attributes style="bogus row styles"><td bogus table attributes style="bogus table styles"><table bogus table attributes style="bogus table styles">row 2 html</table></td></tr></table>');
        });


        it('generates html code of the framed table: bogus attributes are present, styles - not', function(){
            spyOn(row1, 'toHtml').andCallFake(function(){
                return 'row 1';
            });
            spyOn(row2, 'toHtml').andCallFake(function(){
                return 'row 2 html';
            });
            spyOn(tableAttr, 'toString').andCallFake(function(){
                return 'table attr';
            });
            spyOn(tableStyle, 'toString').andCallFake(function(){
                return 'table styles';
            });
            spyOn(bogusTableStyle, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(bogusTableAttr, 'toString').andCallFake(function(){
                return 'bogus table attributes';
            });
            spyOn(bogusCellStyle, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(bogusCellAttr, 'toString').andCallFake(function(){
                return 'bogus table attributes';
            });
            spyOn(bogusRowStyle, 'toString').andCallFake(function(){
                return '';
            });
            spyOn(bogusRowAttr, 'toString').andCallFake(function(){
                return 'bogus row attributes';
            });

            table.attr = tableAttr;
            table.style = tableStyle;
            table.content.elements  = [row1, row2];
            table.bogusRowAttr = bogusRowAttr;
            table.bogusRowStyle = bogusRowStyle;
            table.bogusCellAttr = bogusCellAttr;
            table.bogusCellStyle = bogusCellStyle;
            table.bogusTableAttr = bogusTableAttr;
            table.bogusTableStyle = bogusTableStyle;
            expect(table.toHtml()).toEqual('<table table attr style="table styles"><tr bogus row attributes><td bogus table attributes><table bogus table attributes>row 1</table></td></tr><tr bogus row attributes><td bogus table attributes><table bogus table attributes>row 2 html</table></td></tr></table>');
        });
    });

    describe('Table.setBorder(): sets table border', function(){
        beforeEach(function(){
                delete table.style['border-width'];
                delete table.style['border-color'];
                delete table.style['border-style'];
                delete table.attr.width;
        });
        it('sets the default values for the table border', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder();
            expect(table.style['border-width']).toBeDefined();
            expect(table.style['border-color']).toBeDefined();
            expect(table.style['border-style']).toBeDefined();
            expect(table.attr.border).toBeDefined();
        });
        it('imposes all parameters if they are passed as argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'width': 20, 'color': 'very nice color', 'style': 'modern'});
            expect(table.style['border-width']).toBe(20);
            expect(table.style['border-color']).toBe('very nice color');
            expect(table.style['border-style']).toBe('modern');
            expect(table.attr.border).toBe(20);
        });
        it('imposes default color if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'width': 20, 'style': 'modern'});
            expect(table.style['border-width']).toBe(20);
            expect(table.style['border-color']).toBeDefined();
            expect(table.style['border-style']).toBe('modern');
            expect(table.attr.border).toBe(20);
        });
        it('imposes default border width if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'color': 'green', 'style': 'modern'});
            expect(table.style['border-width']).toBeDefined();
            expect(table.style['border-color']).toBe('green');
            expect(table.style['border-style']).toBe('modern');
            expect(table.attr.border).toBeDefined(20);
        });
        it('imposes default border style if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'color': 'red', 'width': 'modern'});
            expect(table.style['border-width']).toBe('modern');
            expect(table.style['border-color']).toBe('red');
            expect(table.style['border-style']).toBeDefined();
            expect(table.attr.border).toBe('modern');
        });
    });

    describe('Table::removeBorder(): removes table border attrbutes', function(){
        it('removes existing info about border table', function(){
            table.style['border-width'] = 'width';
            table.style['border-color'] = 'color';
            table.style['border-style'] = 'style';
            table.removeBorder();
            expect(table.style['border-width']).not.toBeDefined();
            expect(table.style['border-color']).not.toBeDefined();
            expect(table.style['border-style']).toBe('none');
            expect(table.attr.border).not.toBeDefined();
        });

        it('"removes" info about border table if it was not even present', function(){
            delete table.style['border-width'];
            delete table.style['border-color'];
            delete table.style['border-style'];
            table.removeBorder();
            expect(table.style['border-width']).not.toBeDefined();
            expect(table.style['border-color']).not.toBeDefined();
            expect(table.style['border-style']).toBe('none');
            expect(table.attr.border).not.toBeDefined();
        });
    });

    describe('Table::rowNum(): gives the number of rows in the table', function(){
        it('calls parent method length', function(){
            spyOn(table, 'length').andCallFake(function(){
                return '# of rows';
            });
            expect(table.rowNum()).toBe('# of rows');
        });
    });

    describe('Table:isFramed(): whether the table is framed', function(){
        var bogusProp, len, i;
        beforeEach(function(){
            table = new Table();
            bogusProp = ['bogusTableAttr', 'bogusTableStyle', 'bogusRowStyle', 'bogusRowAttr', 'bogusCellAttr', 'bogusCellStyle'];
            len = bogusProp.length;
            for (i = 0; i < len; i++){
                if (table[bogusProp] !== undefined){
                    delete table[bogusProp];
                }
            }
        });

        it('gives false, if none of the bogus attributes is set', function(){
            expect(table.isFramed()).toBe(false);
        });

        it('gives true, if bogusTableAttr is set', function(){
            expect(table.isFramed()).toBe(false);
            table.bogusTableAttr = 'anything';
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if bogusTableStyle is set', function(){
            expect(table.isFramed()).toBe(false);
            table.bogusTableStyle = 'anything';
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if bogusCellAttr is set', function(){
            expect(table.isFramed()).toBe(false);
            table.bogusCellAttr = 'anything';
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if bogusCellStyle is set', function(){
            expect(table.isFramed()).toBe(false);
            table.bogusCellStyle = 'anything';
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if bogusRowAttr is set', function(){
            expect(table.isFramed()).toBe(false);
            table.bogusRowAttr = 'anything';
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if bogusRowStyle is set', function(){
            expect(table.isFramed()).toBe(false);
            table.bogusRowStyle = 'anything';
            expect(table.isFramed()).toBe(true);
        });
    });

    describe('Table:removeFrame(): removes all bogus properties', function(){
        var bogusProp = ['bogusTableAttr', 'bogusTableStyle', 'bogusRowStyle', 'bogusRowAttr', 'bogusCellAttr', 'bogusCellStyle'],
            len = bogusProp.length,
            i;
        afterEach(function(){
            for (i = 0; i < len; i++){
                expect(table[bogusProp[i]]).not.toBeDefined();
            }
            expect(table.isFramed()).toBe(false);

        });
        it('if they were not set', function(){
            table.resetBogus();
        });

        it('resets bogus attributes, if only bogusTableAttr was initially set', function(){
            table.bogusTableAttr = 'anything';
            expect(table.bogusTableAttr).toBeDefined();
            table.resetBogus();
        });
        it('resets bogus attributes, if only bogusTableStyle was initially set', function(){
            table.bogusTableStyle = 'anything';
            expect(table.bogusTableStyle).toBeDefined();
            table.resetBogus();
        });
        it('resets bogus attributes, if only bogusCellAttr was initially set', function(){
            table.bogusCellAttr = 'anything';
            expect(table.bogusCellAttr).toBeDefined();
            table.resetBogus();
        });
        it('resets bogus attributes, if only bogusCellStyle was initially set', function(){
            table.bogusCellStyle = 'anything';
            expect(table.bogusCellStyle).toBeDefined();
            table.resetBogus();
        });
        it('resets bogus attributes, if only bogusRowAttr was initially set', function(){
            table.bogusRowAttr = 'anything';
            expect(table.bogusRowAttr).toBeDefined();
            table.resetBogus();
        });
        it('resets bogus attributes, if only bogusRowStyle was initially set', function(){
            table.bogusRowStyle = 'anything';
            expect(table.bogusRowStyle).toBeDefined();
            table.resetBogus();
        });
    });

    xdescribe('Table::isFragmented(): whether the table looks like a framed table?', function(){
        var table1, table2, table3, table4, table5, cell1, cell2, cell3, cell4, cell5;
        beforeEach(function(){
            table1 = new Table(); cell1 = new Cell();
            table2 = new Table(); cell2 = new Cell();
            table3 = new Table(); cell3 = new Cell();
            table4 = new Table(); cell4 = new Cell();
            table5 = new Table(); cell5 = new Cell();
        });
        it('gives false for empty tables', function(){
            expect(table.isFragmented()).toBe(false);
        });
        it('gives false for empty tables', function(){
            expect(table.isFragmented()).toBe(false);
        });

        it('gives true if the only table row has a unique cell with another table inside', function(){
            cell1.appendElem(table1);
            row1.appendCell(cell1);
            table.appendRow(row1);
            expect(table.isFragmented()).toBe(true);
        });

        it('gives true if each table row has a unique cell with another table inside', function(){
            cell1.appendElem(table1);
            cell2.appendElem(table2);
            cell3.appendElem(table3);
            cell4.appendElem(table4);
            cell5.appendElem(table5);

            row1.appendCell(cell1);
            row2.appendCell(cell2);
            row3.appendCell(cell3);
            row4.appendCell(cell4);
            row5.appendCell(cell5);

            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            table.appendRow(row4);
            table.appendRow(row5);

            expect(table.isFragmented()).toBe(true);
        });

        it('gives false if the cell of the first row contains no table, while the others - contains exactly 1 table', function(){
            cell1.appendElem(new Content());
            cell2.appendElem(table2);
            cell3.appendElem(table3);

            row1.appendCell(cell1);
            row2.appendCell(cell2);
            row3.appendCell(cell3);

            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);

            expect(table.isFragmented()).toBe(false);
        });

        it('gives false if the cell of the last row contains no table, while the others - contains exactly 1 table', function(){
            cell1.appendElem(table1);
            cell2.appendElem(table2);
            cell3.appendElem(new Content());

            row1.appendCell(cell1);
            row2.appendCell(cell2);
            row3.appendCell(cell3);

            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);

            expect(table.isFragmented()).toBe(false);
        });

        it('gives false if the cell of a middle row contains no table, while the others - contains exactly 1 table', function(){
            cell1.appendElem(table1);
            cell2.appendElem(new Content());
            cell3.appendElem(table3);

            row1.appendCell(cell1);
            row2.appendCell(cell2);
            row3.appendCell(cell3);

            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);

            expect(table.isFragmented()).toBe(false);
        });


    });
});