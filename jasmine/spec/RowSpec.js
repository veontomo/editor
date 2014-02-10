/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, expect, spyOn, beforeEach, Cell, Row, Content, TableRowStyle, Attributes, Style, jasmine, Tag*/

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

    describe('inherits properly from Tag() class', function(){
        it('does not affect parent class if an inherited property is changed', function(){
            row.attr.width = 102;
            expect((new Row()).attr.width).not.toBe(102);
            row.style.width = 34;
            expect((new Row()).style.width).not.toBe(34);
        });
    });


    it('creates a Row with empty content', function(){
        expect((new Table()).length()).toBe(0);
        expect((new Tag()).length()).toBe(0);
        expect((new Cell()).length()).toBe(0);
        expect((new Row()).length()).toBe(0);

        expect(row.cellNum()).toBe(0);
        expect(row.length()).toBe(0);
    });

    it('creates object with type attribute "table row object"', function(){
        expect(row.getType()).toBe("Row");
    });

    it('has property name set to "tr"', function(){
        expect(row.name).toBe('tr');
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
       // var cell = new Cell();
       // prentend that the cell is not a cell
       // spyOn(cell, 'getType').andCallFake(function(){
           // return "not a cell";
       // });
        var foo = jasmine.any(String);
        expect(foo instanceof Cell).toBe(false);
        expect(function(){
           row.appendCell(foo);
        }).toThrow('The argument is not of the Cell type!');

        foo = jasmine.any(Number);
        expect(foo instanceof Cell).toBe(false);
        expect(function(){
           row.appendCell(foo);
        }).toThrow('The argument is not of the Cell type!');

        foo = jasmine.any(Object);
        expect(foo instanceof Cell).toBe(false);
        expect(function(){
           row.appendCell(foo);
        }).toThrow('The argument is not of the Cell type!');


        expect(function(){
           row.appendCell(new Tag());
        }).toThrow('The argument is not of the Cell type!');

    });


    it('appends a cell to the existing cells', function(){
        row.content.elements = [];
        expect(row.cellNum()).toBe(0);
        row.appendCell(cell1);
        expect(row.cellNum()).toBe(1);
        row.appendCell(cell2);
        expect(row.cellNum()).toBe(2);
        row.appendCell(cell3);
        expect(row.cellNum()).toBe(3);
    });

    it('gets widths of the cells', function(){
        spyOn(cell1, 'getWidth').andCallFake(function(){
            return 'cell 1 width';
        });
        spyOn(cell2, 'getWidth').andCallFake(function(){
            return 'cell 2 width';
        });

        row.content.elements = [cell1, cell2];
        expect(row.getCellWidths().length).toBe(2);
        expect(row.getCellWidths()[0]).toBe('cell 1 width');
        expect(row.getCellWidths()[1]).toBe('cell 2 width');

        row.content.elements = [cell1];
        expect(row.getCellWidths().length).toBe(1);
        expect(row.getCellWidths()[0]).toBe('cell 1 width');

        row.content.elements = [];
        expect(row.getCellWidths().length).toBe(0);
    });

    it('calls corresponding methods to set widths of the cells of the row', function(){
        spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell3, 'setWidth').andCallFake(function(){return null;});
        row.content.elements = [cell1, cell2, cell3];
        row.setCellWidths([1, 12, 0.11]);
        expect(cell1.setWidth).toHaveBeenCalledWith(1);
        expect(cell2.setWidth).toHaveBeenCalledWith(12);
        expect(cell3.setWidth).toHaveBeenCalledWith(0.11);
    });

    it('does not call methods to set cell widths if input array length is different from the cells number', function(){
        spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
        row.content.elements = [cell1, cell2];
        row.setCellWidths([235, 211, 21]);
        expect(cell1.setWidth).not.toHaveBeenCalled();
        expect(cell2.setWidth).not.toHaveBeenCalled();
    });

    it('does not call methods to set cell widths if input array length is different from the cells number', function(){
        spyOn(cell1, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell2, 'setWidth').andCallFake(function(){return null;});
        spyOn(cell3, 'setWidth').andCallFake(function(){return null;});
        row.content.elements = [cell1, cell2, cell3];
        row.setCellWidths([235, 211]);
        expect(cell1.setWidth).not.toHaveBeenCalled();
        expect(cell2.setWidth).not.toHaveBeenCalled();
        expect(cell3.setWidth).not.toHaveBeenCalled();
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

    it('when asked to delete a non-existing cell (cell number corresponds to a non-existing cell), nothing is done to the table', function(){
        cell1.setWidth(200);
        cell2.setWidth(110);
        cell3.setWidth(150);
        row.content.elements = [cell1, cell2, cell3];
        row.dropCell(row.cellNum() + 10); // delete non-existing cell
        expect(row.cellNum()).toBe(3);
        expect(row.getElem(0).getWidth()).toBe(200);
        expect(row.getElem(1).getWidth()).toBe(110);
        expect(row.getElem(2).getWidth()).toBe(150);
    });

    it('calls Content::length() method to calculate the number of cells in the row', function(){
        var content = new Content();
        spyOn(content, 'length').andCallFake(function(){return 'content output';});
        row.content = content;
        expect(row.cellNum()).toBe('content output');
    });

    describe('inserts cell at given position', function(){
        it('throws an error if trying to insert non-cell object into a valid position', function(){
            spyOn(row, 'cellNum').andCallFake(function(){return 8;});
            expect(function(){
                row.insertCellAt(0, {});
            }).toThrow('Trying to insert non-cell object!');
            expect(function(){
                row.insertCellAt(1, 'foo');
            }).toThrow('Trying to insert non-cell object!');
            expect(function(){
                row.insertCellAt(4, 'not a cell');
            }).toThrow('Trying to insert non-cell object!');
            expect(function(){
                row.insertCellAt(7, 'not a cell');
            }).toThrow('Trying to insert non-cell object!');
            expect(function(){
                row.insertCellAt(7, new Tag());
            }).toThrow('Trying to insert non-cell object!');

        });

        it('throw an error if trying to insert non-cell object into an invalid position', function(){
            spyOn(row, 'cellNum').andCallFake(function(){return 20;});
            expect(function(){
                row.insertCellAt(-1, 'not a cell');
            }).toThrow('Trying to insert non-cell object!');
            expect(function(){
                row.insertCellAt(21, 'not a cell');
            }).toThrow('Trying to insert non-cell object!');
        });

        it('calls Content::insertElemAt method to insert a Cell', function(){
            var content = new Content(),
                c = new Cell('new cell');
            spyOn(content, 'insertElemAt');
            row.content = content;
            row.insertCellAt('whatever', c);
            expect(content.insertElemAt).toHaveBeenCalledWith('whatever', c);
        });
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
            row.content.elements = [cell1, cell2, cell3, cell4];
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
            row.content.elements = [cell1, cell2, cell3];
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
            row.content.elements = [cell1, cell2, cell3, cell4];
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
        row.content.elements = [cell1, cell2, cell3];
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
        row.content.elements = [cell1];
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
        row.content.elements = [cell1];
        expect(row.toHtml()).toEqual('<tr row attributes>cell 1</tr>');
    });
    // the code below logically must be part of String functionality
    // it('loads info from html representation of the row', function(){
    //     spyOn(row, 'setStyle');
    //     spyOn(row, 'setAttr');
    //     var rowHtml = '<tr style="table row style" rowattr1="attribute value" rowattr2="another attribute value"><td></td></tr>';
    //     row.loadFromHtml(rowHtml);

    //     expect(row.setStyle).toHaveBeenCalledWith('table row style');
    //     expect(row.setAttr).toHaveBeenCalledWith({
    //         'rowattr1': "attribute value",
    //         'rowattr2': 'another attribute value'
    //     });
    // });


});
