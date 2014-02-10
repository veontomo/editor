/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Row, Table,
Content, TableStyle, TableRowStyle, TableCellStyle, TableAttributes, Attributes, Style, createTableFromHtml, jasmine, Tag */

describe('Table-related functionality:', function(){
    var table, tableAttr, tableStyle, row1, row2, row3,
        bogusTableAttr, bogusTableStyle, bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle;
    beforeEach(function(){
        table = new Table();
        tableAttr = new Attributes();
        tableStyle = new TableStyle();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
        bogusTableAttr = new Attributes();
        bogusTableStyle = new Style();
        bogusRowAttr  = new Attributes();
        bogusRowStyle  = new Style();
        bogusCellAttr  = new Attributes();
        bogusCellStyle  = new Style();
    });

    describe('inherits properly from Tag() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            table.attr.width = 102;
            expect((new Table()).attr.width).not.toBe(102);
            table.style.width = 34;
            expect((new Table()).style.width).not.toBe(34);
        });
    });


    it('creates object of type "Table"', function(){
        expect(table.getType()).toBe("Table");
    });

    it('has property name set to "tr"', function(){
        expect(table.name).toBe('table');
    });


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
        if (tableStyle.hasOwnProperty('a table property')) {
            delete tableStyle['a table property'];
        }
        table.style = tableStyle;
        expect(table.styleProperty('a table property')).not.toBeDefined();
    });

    it('sets the width of the table', function(){
        table.setWidth(15);
        expect(table.styleProperty('width')).toEqual(15);
        expect(table.styleProperty('min-width')).toEqual(15);
        expect(table.styleProperty('max-width')).toEqual(15);
        expect(table.attr.width).toEqual(15);
    });

    it('throws exception if a non-Row type is appended to the rows', function(){
        var foo = jasmine.any(Number);
        expect(foo instanceof Row).toBe(false);
        expect(function(){
            table.appendRow(foo);
        }).toThrow('The argument is not of the Row type!');
        foo = jasmine.any(String);
        expect(foo instanceof Row).toBe(false);
        expect(function(){
            table.appendRow(foo);
        }).toThrow('The argument is not of the Row type!');
        foo = jasmine.any(Object);
        expect(foo instanceof Row).toBe(false);
        expect(function(){
            table.appendRow(foo);
        }).toThrow('The argument is not of the Row type!');
     });

    it('gets "matrix" of widths', function(){
        expect((new Table()).length()).toBe(0);
        expect((new Tag()).length()).toBe(0);
        expect((new Cell()).length()).toBe(0);
        expect((new Row()).length()).toBe(0);

        spyOn(row1, 'getCellWidths').andCallFake(function(){
            return 'cell widths of row 1';
        });
        spyOn(row2, 'getCellWidths').andCallFake(function(){
            return 'cell widths of row 2';
        });
        spyOn(row3, 'getCellWidths').andCallFake(function(){
            return 'cell widths of row 3';
        });
        table.content.elements = [row1, row2, row3];
        expect((new Table()).length()).toBe(0);
        expect((new Tag()).length()).toBe(0);
        expect((new Cell()).length()).toBe(0);
        expect((new Row()).length()).toBe(0);

        expect(table.getMatrix().length).toBe(3);
        expect(table.getMatrix()[0]).toBe('cell widths of row 1');
        expect(table.getMatrix()[1]).toBe('cell widths of row 2');
        expect(table.getMatrix()[2]).toBe('cell widths of row 3');

        table.content.elements = [row1, row3];
        expect(table.getMatrix().length).toBe(2);
        expect(table.getMatrix()[0]).toBe('cell widths of row 1');
        expect(table.getMatrix()[1]).toBe('cell widths of row 3');

        table.content.elements = [];
        expect(table.getMatrix().length).toBe(0);
    });

    it('sets "profile" of the table', function(){
        spyOn(row1, 'setCellWidths').andCallFake(function(){return null;});
        spyOn(row2, 'setCellWidths').andCallFake(function(){return null;});
        spyOn(row3, 'setCellWidths').andCallFake(function(){return null;});
        table.content.elements = [row1, row2, row3];
        table.setProfile('anything');
        expect(row1.setCellWidths).toHaveBeenCalledWith('anything');
        expect(row2.setCellWidths).toHaveBeenCalledWith('anything');
        expect(row3.setCellWidths).toHaveBeenCalledWith('anything');
    });

    it('gets profile of the table with not the same cell width among the table.content.elements ', function(){
        expect((new Table()).length()).toBe(0);
        expect((new Tag()).length()).toBe(0);
        expect((new Cell()).length()).toBe(0);
        expect((new Row()).length()).toBe(0);

        spyOn(table, 'isSameWidths').andCallFake(function(){
            return false;
        });
        expect(table.getProfile()).toBe(null);
    });

    it('gets profile of the table with the same cell width among the table.content.elements ', function(){
        spyOn(table, 'isSameWidths').andCallFake(function(){
            return true;
        });
        // if Table::isSameWidth returns true, only first element of getMatrix will be considered
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[6, 400, 3], "whatever it is"];
        });

        var profile = table.getProfile();
        expect(profile.length).toBe(3);
        expect(profile[0]).toBe(6);
        expect(profile[1]).toBe(400);
        expect(profile[2]).toBe(3);
    });

    it('decides whether the rows have the same "cell profile"', function(){
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[1, 2, 3], [1, 2, 3]];
        });
        expect(table.isSameWidths()).toBe(true);

        table = new Table();
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[], [1, 2, 3]];
        });
        expect(table.isSameWidths()).toBe(false);

        table = new Table();
        spyOn(table, 'getMatrix').andCallFake(function(){
            return [[], []];
        });
        expect(table.isSameWidths()).toBe(true);
    });

    it('calls a method of the Row() object to delete a column', function(){
        spyOn(row1, 'dropCell').andCallFake(function(){return null;});
        spyOn(row2, 'dropCell').andCallFake(function(){return null;});
        spyOn(row3, 'dropCell').andCallFake(function(){return null;});
        table.content.elements  = [row1, row2, row3];
        table.dropColumn(0);
        expect(row1.dropCell).toHaveBeenCalled();
        expect(row2.dropCell).toHaveBeenCalled();
        expect(row3.dropCell).toHaveBeenCalled();
        // the number of rows remains the same
        expect(table.content.elements .length).toBe(3);
    });

    it('Throws an error if position index is too big', function(){
        spyOn(table, 'colNum').andCallFake(function(){return 5;});
        expect(function(){
            table.insertColumnAt(7, "cell");
        }).toThrow('Wrong index for the cell to insert!');
    });

    it('Throws an error if position index is negative', function(){
        spyOn(table, 'colNum').andCallFake(function(){return 3;});
        expect(function(){
            table.insertColumnAt(-2, "cell");
        }).toThrow('Wrong index for the cell to insert!');
    });

    it('Throws an error if position index is greater than the number of columns', function(){
        spyOn(table, 'colNum').andCallFake(function(){return 3;});
        expect(function(){
            table.insertColumnAt(4, "cell");
        }).toThrow('Wrong index for the cell to insert!');
    });

    it('Does not throw any error if position index is equal to the number of columns', function(){
        spyOn(table, 'colNum').andCallFake(function(){return 3;});
        expect(function(){
            table.insertColumnAt(3, "cell");
        }).not.toThrow('Wrong index for the cell to insert!');
    });

    it('calls a method to insert cell', function(){
        var c = new Cell();
        spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(table, 'colNum').andCallFake(function(){return 3;});
        table.content.elements = [row1, row2, row3];
        table.insertColumnAt(1, c);
        expect(row1.insertCellAt).toHaveBeenCalledWith(1, c);
        expect(row2.insertCellAt).toHaveBeenCalledWith(1, c);
        expect(row3.insertCellAt).toHaveBeenCalledWith(1, c);
    });

    it('calls a method to insert cell at the beginning of the row', function(){
        var c = new Cell();
        spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(table, 'colNum').andCallFake(function(){return 3;});
        table.content.elements = [row1, row2, row3];
        table.insertColumnAt(0, c);
        expect(row1.insertCellAt).toHaveBeenCalledWith(0, c);
        expect(row2.insertCellAt).toHaveBeenCalledWith(0, c);
        expect(row3.insertCellAt).toHaveBeenCalledWith(0, c);
    });

    it('calls a method to insert cell at one position before the end of the row', function(){
        var c = new Cell();
        spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(table, 'colNum').andCallFake(function(){return 10;});
        table.content.elements = [row1, row2, row3];
        table.insertColumnAt(9, c);
        expect(row1.insertCellAt).toHaveBeenCalledWith(9, c);
        expect(row2.insertCellAt).toHaveBeenCalledWith(9, c);
        expect(row3.insertCellAt).toHaveBeenCalledWith(9, c);
    });

    it('calls a method to insert cell at the end of the row (appending a cell)', function(){
        var c = new Cell();
        spyOn(row1, 'appendCell').andCallFake(function(){return null;});
        spyOn(row2, 'appendCell').andCallFake(function(){return null;});
        spyOn(row3, 'appendCell').andCallFake(function(){return null;});
        spyOn(table, 'colNum').andCallFake(function(){return 10;});
        table.content.elements = [row1, row2, row3];
        table.insertColumnAt(10, c);
        expect(row1.appendCell).toHaveBeenCalledWith(c);
        expect(row2.appendCell).toHaveBeenCalledWith(c);
        expect(row3.appendCell).toHaveBeenCalledWith(c);
    });


    it('calls a method to insert cell if cell is not provided', function(){
        spyOn(row1, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row2, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(row3, 'insertCellAt').andCallFake(function(){return null;});
        spyOn(table, 'colNum').andCallFake(function(){return 3;});
        table.content.elements = [row1, row2, row3];
        table.insertColumnAt(2);
        expect(row1.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
        expect(row2.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
        expect(row3.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
    });


    describe('appends style to a single column:', function(){
        it('Throw an error if column number is not integer ', function(){
            expect((new Table()).length()).toBe(0);
            expect((new Tag()).length()).toBe(0);
            expect((new Cell()).length()).toBe(0);
            expect((new Row()).length()).toBe(0);

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
            spyOn(row1, 'appendStyleToCell').andCallFake(function(){return null;});
            spyOn(row2, 'appendStyleToCell').andCallFake(function(){return null;});
            spyOn(row3, 'appendStyleToCell').andCallFake(function(){return null;});
            table.content.elements = [row1, row2, row3];
            table.appendStyleToCol(2, "whatever");
            expect(row1.appendStyleToCell).toHaveBeenCalledWith(2, "whatever");
            expect(row2.appendStyleToCell).toHaveBeenCalledWith(2, "whatever");
            expect(row3.appendStyleToCell).toHaveBeenCalledWith(2, "whatever");
        });
    });

    it('appends a row to the existing rows', function(){
        table.content.elements = [];
        expect(table.rowNum()).toBe(0);
        table.appendRow(row1);
        expect(table.rowNum()).toBe(1);
        table.appendRow(row3);
        expect(table.rowNum()).toBe(2);
        table.appendRow(row3);
        expect(table.rowNum()).toBe(3);
    });

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
            return 'bogus cell styles';
        });
        spyOn(bogusCellAttr, 'toString').andCallFake(function(){
            return 'bogus cell attributes';
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

        expect(table.toHtml()).toEqual('<table table attr style="table styles"><tr bogus row attributes style="bogus row styles"><td bogus cell attributes style="bogus cell styles"><table bogus table attributes style="bogus table styles">row 1</table></td></tr><tr bogus row attributes style="bogus row styles"><td bogus cell attributes style="bogus cell styles"><table bogus table attributes style="bogus table styles">row 2 html</table></td></tr></table>');
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
            return 'bogus cell attributes';
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
        expect(table.toHtml()).toEqual('<table table attr style="table styles"><tr bogus row attributes><td bogus cell attributes><table bogus table attributes>row 1</table></td></tr><tr bogus row attributes><td bogus cell attributes><table bogus table attributes>row 2 html</table></td></tr></table>');
    });


    it('sets the default values for the table border', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder();
        expect(table.style['border-width']).toBeDefined();
        expect(table.style['border-color']).toBeDefined();
        expect(table.style['border-style']).toBeDefined();
        expect(table.attr.border).toBeDefined();
    });

    it('sets a border of the table', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'width': 1, 'color': 'red', 'style': 'solid'});
        expect(table.style['border-width']).toBe(1);
        expect(table.style['border-color']).toBe('red');
        expect(table.style['border-style']).toBe('solid');
        expect(table.attr.border).toBeDefined();
    });

    it('sets a border of the table form incomplete input: no width', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'color': 'red', 'style': 'solid'});
        expect(table.style['border-width']).toBeDefined();
        expect(table.style['border-color']).toBe('red');
        expect(table.style['border-style']).toBe('solid');
        expect(table.attr.border).toBeDefined();
    });

    it('sets a border of the table form incomplete input: no color', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'width': 9, 'style': 'solid'});
        expect(table.style['border-color']).toBeDefined();
        expect(table.style['border-width']).toBe(9);
        expect(table.style['border-style']).toBe('solid');
        expect(table.attr.border).toBe(9);
    });

    it('sets a border of the table form incomplete input: no style', function(){
        expect(table.hasOwnProperty('setBorder')).toBe(true);
        table.setBorder({'width': 19, 'color': 'nice color'});
        expect(table.style['border-width']).toBe(19);
        expect(table.style['border-color']).toBe('nice color');
        expect(table.style['border-style']).toBeDefined();
        expect(table.attr.border).toBe(19);
    });

    it('resets the border of the table', function(){
        // setting up the border-related properties to some dumb values
        table.style['border-width'] = 'border width';
        table.style['border-color'] = 'border color';
        table.style['border-style'] = 'border style';
        table.attr.border = 'border';
        // remove border
        expect(table.hasOwnProperty('removeBorder')).toBe(true);
        table.removeBorder();

        expect(table.style.hasOwnProperty('border-width')).toBe(false);
        expect(table.style.hasOwnProperty('border-color')).toBe(false);
        expect(table.style.hasOwnProperty('border-style')).toBe(true);
        expect(table.style['border-style']).toBe('none');
        expect(table.attr.hasOwnProperty('border')).toBe(false);
    });

    describe('gives the number of the column in the table', function(){
        it('all columns have the same number of cells', function(){
            expect((new Table()).length()).toBe(0);
            expect((new Tag()).length()).toBe(0);
            expect((new Cell()).length()).toBe(0);
            expect((new Row()).length()).toBe(0);

            spyOn(row1, 'cellNum').andCallFake(function(){
                return 5;
            });
            spyOn(row2, 'cellNum').andCallFake(function(){
                return 5;
            });
            spyOn(row3, 'cellNum').andCallFake(function(){
                return 5;
            });

            table.content.elements = [row1, row2, row3];
            expect(table.colNum()).toBe(5);
            expect(row1.cellNum).toHaveBeenCalled();
            expect(row2.cellNum).toHaveBeenCalled();
            expect(row3.cellNum).toHaveBeenCalled();
        });

        it('columns have different number of cells', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){
                return 3;
            });
            spyOn(row2, 'cellNum').andCallFake(function(){
                return 2;
            });
            spyOn(row3, 'cellNum').andCallFake(function(){
                return 3;
            });

            table.content.elements = [row1, row2, row3];
            expect(table.colNum()).toBe(null);
            expect(row1.cellNum).toHaveBeenCalled();
            expect(row2.cellNum).toHaveBeenCalled();
            expect(row3.cellNum).not.toHaveBeenCalled(); // not necessary
        });

        it('if the table is made of empty rows', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){
                return 0;
            });
            spyOn(row2, 'cellNum').andCallFake(function(){
                return 0;
            });

            table.content.elements = [row1, row2];
            expect(table.colNum()).toBe(0);
            expect(row1.cellNum).toHaveBeenCalled();
            expect(row2.cellNum).toHaveBeenCalled();
        });

        it('the table is of a single row', function(){
            spyOn(row1, 'cellNum').andCallFake(function(){
                return 20;
            });
            table.content.elements = [row1];
            expect(table.colNum()).toBe(20);
            expect(row1.cellNum).toHaveBeenCalled();
        });
    });

    it('calls Content::length to calculate the number of rows in the table', function(){
        var content = new Content();
        spyOn(content, 'length').andCallFake(function(){return '# of rows';});
        table.content = content;
        expect(table.rowNum()).toBe('# of rows');
    });


    it('says that the table is framed if at least one of the properties is set', function(){
        expect(table.isFramed()).toBe(false);
        table.bogusTableStyle = 'anything';
        expect(table.isFramed()).toBe(true);

        table = new Table();
        expect(table.isFramed()).toBe(false);
        table.bogusTableAttr = 'anything';
        table.bogusRowAttr = 'whatever';
        expect(table.isFramed()).toBe(true);

        table = new Table();
        expect(table.isFramed()).toBe(false);
        table.bogusTableAttr = 'anything';
        table.bogusTableStyle = 'whatever';
        table.bogusRowStyle = 'anything';
        table.bogusRowAttr = 'whatever';
        table.bogusCellAttr = 'anything';
        table.bogusCellStyle = 'whatever';
        expect(table.isFramed()).toBe(true);
    });

    it('removes the properties that make the table be framed', function(){
        expect(table.isFramed()).toBe(false);
        table.bogusTableAttr = 'anything';
        expect(table.isFramed()).toBe(true);

        table.removeFrame();
        expect(table.isFramed()).toBe(false);

        // remove again
        table.removeFrame();
        expect(table.isFramed()).toBe(false);
    });
});