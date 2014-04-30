/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Table, Row, Cell, Styles,
Content, TableStyles, TableRowStyles, TableCellStyles, TableAttributes, Attributes, jasmine, Tag */

describe('Table-related functionality:', function(){
    var table, tableAttr, tableStyle, row1, row2, row3, row4, row5,
        bogusTableAttr, bogusTableStyle, bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle;
    beforeEach(function(){
        table = new Table();
        tableAttr = new Attributes();
        tableStyle = new TableStyles();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
        row4 = new Row();
        row5 = new Row();
        bogusTableAttr = new Attributes();
        bogusTableStyle = new Attributes();
        bogusRowAttr  = new Attributes();
        bogusRowStyle  = new Attributes();
        bogusCellAttr  = new Attributes();
        bogusCellStyle  = new Attributes();
    });

    describe('inherits properly from Tag() class', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var table2 = Table();
            expect(table2 instanceof Table).toBe(true);
        });

        it('instance of Table is an instance of Tag as well', function(){
            expect(table instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Table()).foo).not.toBe(102);
            table.foo = 102;
            expect((new Table()).foo).not.toBe(102);
            expect(table.foo).toBe(102);
        });

    });

    describe('Table::tag: tag tag for the Table', function(){
        it('has property tag set to "table"', function(){
            expect(table.getTag()).toBe('table');
        });
    });

    describe('Table::className: class tag', function(){
        it('gives the tag of the class', function(){
            expect(table.getName()).toBe('Table');
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
            table.appendRow(row1);
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
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            // table.setElements([row1, row2, row3]);
            matrix = table.getMatrix();
            expect(row1.getCellWidths).toHaveBeenCalled();
            expect(row2.getCellWidths).toHaveBeenCalled();
            expect(row3.getCellWidths).toHaveBeenCalled();
            expect(matrix.length).toBe(3);
            expect(matrix[0]).toBe('array of cell widths of the first row');
            expect(matrix[1]).toBe('array of cell widths of the second row');
            expect(matrix[2]).toBe('array of cell widths of the third row');
        });
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
            table.appendRow(row1);
            table.setProfile([2, 4, 6, 1, 2]);
            expect(row1.setCellWidths).toHaveBeenCalledWith([2, 4, 6, 1, 2]);
        });
        it('calls Row::setCellWidths if the table has three rows', function(){
            spyOn(row1, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(row2, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(row3, 'setCellWidths').andCallFake(function(){return null;});
            spyOn(table, 'colNum').andCallFake(function(){return 4;});
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            // table.setElements([row1, row2, row3]);
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
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            // table.setElements([row1, row2, row3]);
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
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            // table.setElements([row1, row2, row3]);
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
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            table.appendRow(row4);
            // table.setElements([row1, row2, row3, row4]);
            expect(table.colNum()).toBe(null);
        });

        it('gives null, if last row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 10;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 14;});
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            table.appendRow(row4);
            table.appendRow(row5);
            expect(table.colNum()).toBe(null);
        });
        it('gives null, if a middle row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 5;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 5;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 7;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 5;});
            table.setElements([row1, row2, row3, row4]);
            expect(table.colNum()).toBe(null);
        });
        it('gives null, if all rows are not of different lenght', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 12;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 5;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 98;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 3;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 14;});
            table.setElements([row1, row2, row3, row4, row5]);
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
            table.setElements([row1, row2, row3, row4, row5]);
            expect(table.colNum()).toBe(0);
        });
        it('gives number of cells', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row2, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row3, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row4, 'cellNum').andCallFake(function(){return 4;});
            spyOn(row5, 'cellNum').andCallFake(function(){return 4;});
            table.setElements([row1, row2, row3, row4, row5]);
            expect(table.colNum()).toBe(4);
        });
        it('gives number of cells if table has only one row', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){return 53;});
            table.setElements([row1]);
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
            table.setElements([row1, row2, row3]);
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
            table.setElements([row1, row2, row3]);
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
            table.setElements([row1, row2, row3]);
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
            table.setElements([row1, row2, row3]);
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
            table.setElements([row1, row2, row3]);
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
            table.setElements([row1, row2, row3]);
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
            table.setAttributes(tableAttr);
            table.setStyles(tableStyle);
            table.setElements([row1, row2, row3]);
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
             table.setAttributes(tableAttr);
             table.setStyles(tableStyle);
             table.setElements([row1, row2, row3]);
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
            table.setAttributes(tableAttr);
            table.setStyles(tableStyle);
            table.setElements([row1, row2, row3]);
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
            table.setAttributes(tableAttr);
            table.setStyles(tableStyle);
            table.setElements([row1, row2, row3]);
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

            table.setAttributes(tableAttr);
            table.setStyles(tableStyle);
            table.setElements([row1, row2]);
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

            table.setAttributes(tableAttr);
            table.setStyles(tableStyle);
            table.setElements([row1, row2]);
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
                delete table.getStyles()['border-width'];
                delete table.getStyles()['border-color'];
                delete table.getStyles()['border-style'];
                delete table.getAttributes().width;
        });
        it('sets the default values for the table border', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder();
            expect(table.getStyleProperty('border-width')).toBeDefined();
            expect(table.getStyleProperty('border-color')).toBeDefined();
            expect(table.getStyleProperty('border-style')).toBeDefined();
            expect(table.getAttrProperty('border')).toBeDefined();
        });
        it('imposes all parameters if they are passed as argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'width': 20, 'color': 'very nice color', 'style': 'modern'});
            expect(table.getStyleProperty('border-width')).toBe(20);
            expect(table.getStyleProperty('border-color')).toBe('very nice color');
            expect(table.getStyleProperty('border-style')).toBe('modern');
            expect(table.getAttrProperty('border')).toBe(20);
        });
        it('imposes default color if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'width': 20, 'style': 'modern'});
            expect(table.getStyleProperty('border-width')).toBe(20);
            expect(table.getStyleProperty('border-color')).toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('modern');
            expect(table.getAttrProperty('border')).toBe(20);
        });
        it('imposes default border width if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'color': 'green', 'style': 'modern'});
            expect(table.getStyleProperty('border-width')).toBeDefined();
            expect(table.getStyleProperty('border-color')).toBe('green');
            expect(table.getStyleProperty('border-style')).toBe('modern');
            expect(table.getAttrProperty('border')).toBeDefined(20);
        });
        it('imposes default border style if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'color': 'red', 'width': 'modern'});
            expect(table.getStyleProperty('border-width')).toBe('modern');
            expect(table.getStyleProperty('border-color')).toBe('red');
            expect(table.getStyleProperty('border-style')).toBeDefined();
            expect(table.getAttrProperty('border')).toBe('modern');
        });
    });

    describe('Table::removeBorder(): removes table border attrbutes', function(){
        it('removes existing info about border table', function(){
            table.setStyleProperty('border-width', 'width');
            table.setStyleProperty('border-color', 'color');
            table.setStyleProperty('border-style', 'style');
            table.removeBorder();
            expect(table.getStyleProperty('border-width')).not.toBeDefined();
            expect(table.getStyleProperty('border-color')).not.toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('none');
            expect(table.getAttrProperty('border')).not.toBeDefined();
        });

        it('"removes" info about border table if it was not even present', function(){
            table.getStyles().dropProperty('border-width');
            table.getStyles().dropProperty('border-color');
            table.getStyles().dropProperty('border-style');
            table.removeBorder();
            expect(table.getStyleProperty('border-width')).not.toBeDefined();
            expect(table.getStyleProperty('border-color')).not.toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('none');
            expect(table.getAttrProperty('border')).not.toBeDefined();
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

    describe('Table::isFragmented(): whether the table looks like a framed table?', function(){
        it('gives false for empty tables', function(){
            spyOn(table, 'rowNum').andCallFake(function(){return 0;});
            expect(table.isFragmented()).toBe(false);
            expect(table.rowNum).toHaveBeenCalled();
        });
        it('gives true for a table with one row that is framed', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return true;});
            table.setElements([row1]);
            expect(table.isFragmented()).toBe(true);
            expect(row1.onlyTableInside).toHaveBeenCalled();
        });
        it('gives false for a table with one row that is not framed', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return false;});
            table.setElements([row1]);
            expect(table.isFragmented()).toBe(false);
            expect(row1.onlyTableInside).toHaveBeenCalled();
        });

        it('gives false for a table with 3 rows, where only the last is not framed', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row2, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row3, 'onlyTableInside').andCallFake(function(){return false;});
            table.setElements([row1, row2, row3]);
            expect(table.isFragmented()).toBe(false);
            // expect(row1.onlyTableInside).toHaveBeenCalled();
            // expect(row2.onlyTableInside).toHaveBeenCalled();
            // expect(row3.onlyTableInside).toHaveBeenCalled();
        });

        it('gives false for a table with 3 rows, where only the first is not framed', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return false;});
            spyOn(row2, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row3, 'onlyTableInside').andCallFake(function(){return true;});
            table.setElements([row1, row2, row3]);
            expect(table.isFragmented()).toBe(false);
            // expect(row1.onlyTableInside).toHaveBeenCalled();
            // expect(row2.onlyTableInside).toHaveBeenCalled();
            // expect(row3.onlyTableInside).toHaveBeenCalled();
        });

        it('gives false for a table with 4 rows, where only the second is not framed', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row2, 'onlyTableInside').andCallFake(function(){return false;});
            spyOn(row3, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row4, 'onlyTableInside').andCallFake(function(){return true;});
            table.setElements([row1, row2, row3, row4]);
            expect(table.isFragmented()).toBe(false);
        });

        it('calls Row() methods until the first row which is the first that returns false', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return false;});
            spyOn(row2, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row3, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row4, 'onlyTableInside').andCallFake(function(){return false;});
            table.setElements([row1, row2, row3, row4]);
            table.isFragmented();
            expect(row1.onlyTableInside).toHaveBeenCalled();
            expect(row2.onlyTableInside).not.toHaveBeenCalled();
            expect(row3.onlyTableInside).not.toHaveBeenCalled();
            expect(row4.onlyTableInside).not.toHaveBeenCalled();
        });

        it('calls Row() methods until the second row which is the first that returns false', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row2, 'onlyTableInside').andCallFake(function(){return false;});
            spyOn(row3, 'onlyTableInside').andCallFake(function(){return false;});
            spyOn(row4, 'onlyTableInside').andCallFake(function(){return true;});
            table.setElements([row1, row2, row3, row4]);
            table.isFragmented();
            expect(row1.onlyTableInside).toHaveBeenCalled();
            expect(row2.onlyTableInside).toHaveBeenCalled();
            expect(row3.onlyTableInside).not.toHaveBeenCalled();
            expect(row4.onlyTableInside).not.toHaveBeenCalled();
        });

        it('calls Row() methods until the last row which is the first that returns false', function(){
            spyOn(row1, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row2, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row3, 'onlyTableInside').andCallFake(function(){return true;});
            spyOn(row4, 'onlyTableInside').andCallFake(function(){return false;});
            table.setElements([row1, row2, row3, row4]);
            table.isFragmented();
            expect(row1.onlyTableInside).toHaveBeenCalled();
            expect(row2.onlyTableInside).toHaveBeenCalled();
            expect(row3.onlyTableInside).toHaveBeenCalled();
            expect(row4.onlyTableInside).toHaveBeenCalled();
        });
    });

    describe('Table::getBogusRowStyle(): gets the style of the bogus row', function(){
        it('calls method Table::getBogusRowProp("style")', function(){
            spyOn(table, 'getBogusRowProp').andCallFake(function(){return 'result';});
            expect(table.getBogusRowStyle()).toBe('result');
            expect(table.getBogusRowProp).toHaveBeenCalledWith('style');
        });
    });

    describe('Table::getBogusRowAttr(): gets the attribute of the bogus row', function(){
        it('calls method Table::getBogusRowProp("attr")', function(){
            spyOn(table, 'getBogusRowProp').andCallFake(function(){return 'attributes';});
            expect(table.getBogusRowAttr()).toBe('attributes');
            expect(table.getBogusRowProp).toHaveBeenCalledWith('attr');
        });

    });

    describe('Table::getBogusRowProp(): gets the requested property of the bogus row', function(){
        var row1Prop, stl;
        beforeEach(function(){
            stl = new Styles();
        });
        it('returns null, if Table::isFragmented returns false', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return false;});
            expect(table.getBogusRowProp()).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
        });
        it('returns null, if Table::isFragmented returns true, but requested property does not exist', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(stl, 'hasProperty').andCallFake(function(){return false;});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});
            table.setElements([row1]);
            expect(table.getBogusRowProp('wierd-property')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(stl.hasProperty).toHaveBeenCalledWith('wierd-property');
        });
        it('returns row property, if table is fragmented, has one row and requested property exists', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(stl, 'hasProperty').andCallFake(function(propName){return propName === 'fakeProp';});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});
            table.setElements([row1]);
            row1Prop = {'fake object': true};
            row1.fakeProp = row1Prop;
            expect(table.getBogusRowProp('fakeProp')).toBe(row1Prop);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(stl.hasProperty).toHaveBeenCalledWith('fakeProp');
        });
        it('returns row prop, if two-row table is fragmented and the rows have equal requested properties', function(){
            row1Prop = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1Prop, 'isTheSameAs').andCallFake(function(){return true;});
            spyOn(stl, 'hasProperty').andCallFake(function(propName){return propName === 'fakeProp';});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});
            table.setElements([row1, row2]);
            row1.fakeProp = row1Prop;
            row2.fakeProp = 'any object';
            expect(table.getBogusRowProp('fakeProp')).toBe(row1Prop);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('any object');
        });
        it('returns null, if two-row table is fragmented and the rows have different requested properties', function(){
            row1Prop = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1Prop, 'isTheSameAs').andCallFake(function(){return false;});
            spyOn(stl, 'hasProperty').andCallFake(function(propName){return propName === 'fakeProp';});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});

            table.setElements([row1, row2]);
            row1.fakeProp = row1Prop;
            row2.fakeProp = 'any object';
            expect(table.getBogusRowProp('fakeProp')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('any object');
        });

        it('returns null, if three-row table is fragmented and the second row property is different from the first', function(){
            row1Prop = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1Prop, 'isTheSameAs').andCallFake(function(){return false;});
            spyOn(stl, 'hasProperty').andCallFake(function(propName){return propName === 'fakeProp';});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});

            table.setElements([row1, row2, row3]);
            row1.fakeProp = row1Prop;
            row2.fakeProp = 'row 2 fake property';
            row3.fakeProp = 'row 3 fake property';
            expect(table.getBogusRowProp('fakeProp')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('row 2 fake property');
            // no need to consider the third row, if the second one is different from the first
            expect(row1Prop.isTheSameAs).not.toHaveBeenCalledWith('row 3 fake property');
        });

        it('returns null, if three-row table is fragmented and the third row property is different from the first', function(){
            row1Prop = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1Prop, 'isTheSameAs').andCallFake(function(prop){return prop === 'row 2 fake property';});
            spyOn(stl, 'hasProperty').andCallFake(function(propName){return propName === 'fakeProp';});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});
            table.setElements([row1, row2, row3]);
            row1.fakeProp = row1Prop;
            row2.fakeProp = 'row 2 fake property';
            row3.fakeProp = 'row 3 fake property';
            expect(table.getBogusRowProp('fakeProp')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('row 2 fake property');
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('row 3 fake property');
        });

        it('returns first row property, if three-row table is fragmented and all rows have equal property', function(){
            row1Prop = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1Prop, 'isTheSameAs').andCallFake(function(){return true;});
            spyOn(stl, 'hasProperty').andCallFake(function(propName){return propName === 'fakeProp';});
            spyOn(row1, 'getStyles').andCallFake(function(){return stl;});

            table.setElements([row1, row2, row3]);
            row1.fakeProp = row1Prop;
            row2.fakeProp = 'row 2 fake property';
            row3.fakeProp = 'row 3 fake property';
            expect(table.getBogusRowProp('fakeProp')).toBe(row1Prop);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('row 2 fake property');
            expect(row1Prop.isTheSameAs).toHaveBeenCalledWith('row 3 fake property');
        });
    });

    describe('Table::getBogusCellProp(): gets the requested property of the bogus cell', function(){
        var row1CellProp;
        it('returns null, if Table::isFragmented returns false', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return false;});
            spyOn(row1, 'getBogusCellProp');
            expect(table.getBogusCellProp('anything')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusCellProp).not.toHaveBeenCalled();
        });
        it('returns requested property, if table is fragmented and has unique row', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusCellProp').andCallFake(function(){return 'requested property';});
            table.setElements([row1]);
            expect(table.getBogusCellProp('prop tag')).toBe('requested property');
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusCellProp).toHaveBeenCalledWith('prop tag');
        });
        it('returns requested property, if table is fragmented and has two rows with equal requested property', function(){
            row1CellProp = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusCellProp').andCallFake(function(){return row1CellProp;});
            spyOn(row2, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 2';});
            spyOn(row1CellProp, 'isTheSameAs').andCallFake(function(){return true;});
            table.setElements([row1, row2]);
            expect(table.getBogusCellProp('prop tag')).toBe(row1CellProp);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusCellProp).toHaveBeenCalledWith('prop tag');
            expect(row1CellProp.isTheSameAs).toHaveBeenCalledWith('bogus prop of row 2');
        });
        it('returns requested property, if table is fragmented and has three rows with equal requested property', function(){
            row1CellProp = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusCellProp').andCallFake(function(){return row1CellProp;});
            spyOn(row2, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 2';});
            spyOn(row3, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 3';});
            // isTheSameAs always return true, so that all properties are equal
            spyOn(row1CellProp, 'isTheSameAs').andCallFake(function(){return true;});
            table.setElements([row1, row2, row3]);
            expect(table.getBogusCellProp('prop tag')).toBe(row1CellProp);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusCellProp).toHaveBeenCalledWith('prop tag');
            expect(row1CellProp.isTheSameAs).toHaveBeenCalledWith('bogus prop of row 2');
            expect(row1CellProp.isTheSameAs).toHaveBeenCalledWith('bogus prop of row 3');
        });
        it('returns requested property, if table is fragmented and has three rows, the second row has different property', function(){
            row1CellProp = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusCellProp').andCallFake(function(){return row1CellProp;});
            spyOn(row2, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 2';});
            spyOn(row3, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 3';});
            // gives false for the second row
            spyOn(row1CellProp, 'isTheSameAs').andCallFake(function(prop){return prop !== 'bogus prop of row 2';});
            table.setElements([row1, row2, row3]);
            expect(table.getBogusCellProp('prop tag')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusCellProp).toHaveBeenCalledWith('prop tag');
            expect(row1CellProp.isTheSameAs).toHaveBeenCalledWith('bogus prop of row 2');
            expect(row1CellProp.isTheSameAs).not.toHaveBeenCalledWith('bogus prop of row 3');
        });
        it('returns requested property, if table is fragmented and has three rows, the third row has different property', function(){
            row1CellProp = {'isTheSameAs': function(){return null;}};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusCellProp').andCallFake(function(){return row1CellProp;});
            spyOn(row2, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 2';});
            spyOn(row3, 'getBogusCellProp').andCallFake(function(){return 'bogus prop of row 3';});
            // gives false for the second row
            spyOn(row1CellProp, 'isTheSameAs').andCallFake(function(prop){return prop !== 'bogus prop of row 3';});
            table.setElements([row1, row2, row3]);
            expect(table.getBogusCellProp('prop tag')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusCellProp).toHaveBeenCalledWith('prop tag');
            expect(row1CellProp.isTheSameAs).toHaveBeenCalledWith('bogus prop of row 2');
            expect(row1CellProp.isTheSameAs).toHaveBeenCalledWith('bogus prop of row 3');
        });
    });
    describe('Table::getBogusCellAttr(): gets bogus cell attributes', function(){
        it('calls Table::getBogusCellProp("attr")', function(){
            spyOn(table, 'getBogusCellProp').andCallFake(function(){return 'dumb attr';});
            expect(table.getBogusCellAttr()).toBe('dumb attr');
            expect(table.getBogusCellProp).toHaveBeenCalledWith('attr');
        });
    });

    describe('Table::getBogusCellStyle(): gets bogus cell style', function(){
        it('calls Table::getBogusCellProp("style")', function(){
            spyOn(table, 'getBogusCellProp').andCallFake(function(){return 'dumb style';});
            expect(table.getBogusCellStyle()).toBe('dumb style');
            expect(table.getBogusCellProp).toHaveBeenCalledWith('style');
        });
    });


    describe('Table::getBogusTableProp(): gets the requested property of the bogus table', function(){
        it('returns null, if Table::isFragmented returns false', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return false;});
            expect(table.getBogusTableProp('anything')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
        });
        it('returns requested property, if table is fragmented and has unique row', function(){
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusTableProp').andCallFake(function(){return 'requested property';});
            table.setElements([row1]);
            expect(table.getBogusTableProp('prop tag')).toBe('requested property');
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusTableProp).toHaveBeenCalledWith('prop tag');
        });
        it('returns requested property, if table is fragmented and has two rows with the equal properties', function(){
            var row1FakeProp = {'isTheSameAs': function(){return true;}},
                row2FakeProp = {'dumb': true};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusTableProp').andCallFake(function(){return row1FakeProp;});
            spyOn(row2, 'getBogusTableProp').andCallFake(function(){return row2FakeProp;});
            table.setElements([row1, row2]);
            expect(table.getBogusTableProp('prop tag')).toBe(row1FakeProp);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row2.getBogusTableProp).toHaveBeenCalledWith('prop tag');
        });

        it('returns null, if table is fragmented and has two rows with not equal properties', function(){
            var row1FakeProp = {'isTheSameAs': function(){return false;}},
                row2FakeProp = {'dumb': true};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusTableProp').andCallFake(function(){return row1FakeProp;});
            spyOn(row2, 'getBogusTableProp').andCallFake(function(){return row2FakeProp;});
            table.setElements([row1, row2]);
            expect(table.getBogusTableProp('prop tag')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row2.getBogusTableProp).toHaveBeenCalledWith('prop tag');
        });

        it('returns null, if table is fragmented and has three rows and the second row has different (from the first row one\'s) property', function(){
            var row1FakeProp = {'isTheSameAs': function(){return null;}}, // stub
                row2FakeProp = {'dumb': 1}, // stub
                row3FakeProp = {'dumb': 2}; // stub
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusTableProp').andCallFake(function(){return row1FakeProp;});
            spyOn(row2, 'getBogusTableProp').andCallFake(function(){return row2FakeProp;});
            spyOn(row3, 'getBogusTableProp').andCallFake(function(){return row3FakeProp;});
            // returns false when given the second row fake
            spyOn(row1FakeProp, 'isTheSameAs').andCallFake(function(obj){return obj !== row2FakeProp;});
            table.setElements([row1, row2, row3]);
            expect(table.getBogusTableProp('prop tag')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row2.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row3.getBogusTableProp).not.toHaveBeenCalledWith('prop tag');
            expect(row1FakeProp.isTheSameAs).toHaveBeenCalledWith(row2FakeProp);
            expect(row1FakeProp.isTheSameAs).not.toHaveBeenCalledWith(row3FakeProp);
        });

        it('returns null, if table is fragmented and has three rows and the third row has different (from the previous rows\') property', function(){
            var row1FakeProp = {'isTheSameAs': function(){return null;}},
                row2FakeProp = {'dumb': 2},
                row3FakeProp = {'dumb': 3};
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(row1, 'getBogusTableProp').andCallFake(function(){return row1FakeProp;});
            spyOn(row2, 'getBogusTableProp').andCallFake(function(){return row2FakeProp;});
            spyOn(row3, 'getBogusTableProp').andCallFake(function(){return row3FakeProp;});
            // this spy returns true for row2FakeProp and false otherwise
            spyOn(row1FakeProp, 'isTheSameAs').andCallFake(function(prop){return prop === row2FakeProp;});
            table.setElements([row1, row2, row3]);
            expect(table.getBogusTableProp('prop tag')).toBe(null);
            expect(table.isFragmented).toHaveBeenCalled();
            expect(row1.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row2.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row3.getBogusTableProp).toHaveBeenCalledWith('prop tag');
            expect(row1FakeProp.isTheSameAs).toHaveBeenCalledWith(row2FakeProp);
            expect(row1FakeProp.isTheSameAs).toHaveBeenCalledWith(row3FakeProp);
        });
    });

    describe('Table::getBogusTableAttr(): gets bogus table attributes', function(){
        it('calls Table::getBogusTableProp("attr")', function(){
            spyOn(table, 'getBogusTableProp').andCallFake(function(){return 'dumb attr';});
            expect(table.getBogusTableAttr()).toBe('dumb attr');
            expect(table.getBogusTableProp).toHaveBeenCalledWith('attr');
        });
    });

    describe('Table::getBogusTableStyle(): gets bogus table style', function(){
        it('calls Table::getBogusTableProp("style")', function(){
            spyOn(table, 'getBogusTableProp').andCallFake(function(){return 'dumb style';});
            expect(table.getBogusTableStyle()).toBe('dumb style');
            expect(table.getBogusTableProp).toHaveBeenCalledWith('style');
        });
    });


    describe('Table::desintangle(): converts table from fragmented into a framed', function(){
        it('does not add bogus cell, row, table properties if the table is not fragmented', function(){
            expect(table.bogusRowStyle).toBe(null);
            expect(table.bogusRowAttr).toBe(null);
            expect(table.bogusCellStyle).toBe(null);
            expect(table.bogusCellAttr).toBe(null);
            expect(table.bogusTableStyle).toBe(null);
            expect(table.bogusTableAttr).toBe(null);
            spyOn(table, 'isFragmented').andCallFake(function(){return false;});
            table.disentangle();
            expect(table.bogusRowStyle).toBe(null);
            expect(table.bogusRowAttr).toBe(null);
            expect(table.bogusCellStyle).toBe(null);
            expect(table.bogusCellAttr).toBe(null);
            expect(table.bogusTableStyle).toBe(null);
            expect(table.bogusTableAttr).toBe(null);
        });

        it('sets bogus cell attributes, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr').andCallFake(function(){return obj;});
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            expect(table.bogusCellAttr).toBe(null);
            table.disentangle();
            expect(table.bogusCellAttr).toBe(obj);
        });

        it('sets bogus row attributes, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr').andCallFake(function(){return obj;});
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');
            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            expect(table.bogusRowAttr).toBe(null);
            table.disentangle();
            expect(table.bogusRowAttr).toBe(obj);
        });

        it('sets bogus table attributes, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr').andCallFake(function(){return obj;});
            spyOn(table, 'getBogusTableStyle');

            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            expect(table.bogusTableAttr).toBe(null);
            table.disentangle();
            expect(table.bogusTableAttr).toBe(obj);
        });

        it('sets bogus cell style, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle').andCallFake(function(){return obj;});
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');

            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            expect(table.bogusCellStyle).toBe(null);
            table.disentangle();
            expect(table.bogusCellStyle).toBe(obj);
        });

        it('sets bogus row style, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle').andCallFake(function(){return obj;});
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');

            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            expect(table.bogusRowStyle).toBe(null);
            table.disentangle();
            expect(table.bogusRowStyle).toBe(obj);
        });

        it('sets bogus table style, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle').andCallFake(function(){return obj;});

            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            expect(table.bogusTableStyle).toBe(null);
            table.disentangle();
            expect(table.bogusTableStyle).toBe(obj);
        });

        it('rearrange the table if it is fragmented', function(){
            var c1 = new Cell(), // bogusRowAttr = {},
                c2 = new Cell(), // bogusRowStyle = {},
                c3 = new Cell(), // bogusCellAttr = {},
                t1 = new Table(),// bogusCellStyle = {},
                t2 = new Table(),// bogusTableAttr = {},
                t3 = new Table(),// bogusTableStyle = {};
                // rowStyle = jasmine.createSpy('rowStyle'),
                // rowAttr  = jasmine.createSpy('rowAttr'),
                // cellStyle = jasmine.createSpy('cellStyle'),
                // cellAttr  = jasmine.createSpy('cellAttr'),
                // tableStyle = jasmine.createSpy('tableStyle'),
                // tableAttr  = jasmine.createSpy('tableAttr'),
                innerRow1 = {},
                innerRow2 = {},
                innerRow3 = {};

            spyOn(table, 'isFragmented').andCallFake(function(){return true;});
            spyOn(table, 'getBogusRowAttr').andCallFake(function(){return bogusRowAttr;});
            spyOn(table, 'getBogusRowStyle').andCallFake(function(){return bogusRowStyle;});
            spyOn(table, 'getBogusCellAttr').andCallFake(function(){return bogusCellAttr;});
            spyOn(table, 'getBogusCellStyle').andCallFake(function(){return bogusCellStyle;});
            spyOn(table, 'getBogusTableAttr').andCallFake(function(){return bogusTableAttr;});
            spyOn(table, 'getBogusTableStyle').andCallFake(function(){return bogusTableStyle;});

            spyOn(row1, 'getFirst').andCallFake(function(){return c1;});
            spyOn(row2, 'getFirst').andCallFake(function(){return c2;});
            spyOn(row3, 'getFirst').andCallFake(function(){return c3;});
            spyOn(c1, 'getFirst').andCallFake(function(){return t1;});
            spyOn(c2, 'getFirst').andCallFake(function(){return t2;});
            spyOn(c3, 'getFirst').andCallFake(function(){return t3;});

            spyOn(t1, 'getFirst').andCallFake(function(){return innerRow1;});
            spyOn(t2, 'getFirst').andCallFake(function(){return innerRow2;});
            spyOn(t3, 'getFirst').andCallFake(function(){return innerRow3;});

            table.setElements([row1, row2, row3]);

            table.disentangle();
            expect(table.bogusRowAttr).toBe(bogusRowAttr);
            expect(table.bogusRowStyle).toBe(bogusRowStyle);
            expect(table.bogusCellAttr).toBe(bogusCellAttr);
            expect(table.bogusCellStyle).toBe(bogusCellStyle);
            expect(table.bogusTableAttr).toBe(bogusTableAttr);
            expect(table.bogusTableStyle).toBe(bogusTableStyle);
            // expect(table.getElem(0)).toBe(innerRow1);
            // expect(table.getElem(1)).toBe(innerRow2);
            // expect(table.getElem(2)).toBe(innerRow3);


        });
    });


});