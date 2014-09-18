/*jslint plusplus: true, white: true */
/*global describe, it, xit, expect, spyOn, beforeEach, afterEach, Table, Row, Cell, Properties,
Content, TableProperties, RowProperties, CellProperties, TableAttributes, Properties, jasmine, Tag */

describe('Table-related functionality:', function(){
    var table, tableAttr, tableStyle, row1, row2, row3, row4, row5,
        bogusTableAttr,
        bogusTableStyle,
        bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle;
    beforeEach(function(){
        table = new Table();
        tableAttr = new TableProperties();
        tableStyle = new TableProperties();
        row1 = new Row();
        row2 = new Row();
        row3 = new Row();
        row4 = new Row();
        row5 = new Row();
        bogusTableAttr = new TableProperties();
        // bogusTableStyle = new Properties();
        bogusRowAttr  = new RowProperties();
        // bogusRowStyle  = new Properties();
        bogusCellAttr  = new CellProperties();
        // bogusCellStyle  = new Properties();
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

    describe('Table::tag: tag for the Table', function(){
        it('has property tag set to "table"', function(){
            expect(table.getTag()).toBe('table');
        });
    });

    describe('Table::className: class tag', function(){
        it('gives the tag of the class', function(){
            expect(table.getName()).toBe('Table');
        });
    });

    describe('Phantom cell styles setter/getter', function(){
        beforeEach(function(){
            table.setPhantomCellStyles(new RowProperties());
        });

        it('returns instance of Properties class', function(){
            expect(table.getPhantomCellStyles() instanceof Properties).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            table.setPhantomCellStyles('level: 1em; home: big');
            var stl = table.getPhantomCellStyles();
            expect(stl.getProperty('level')).toBe('1em');
            expect(stl.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            table.setPhantomCellStyles({level: 4.6, sky: 'blue'});
            var stl = table.getPhantomCellStyles();
            expect(stl.getProperty('level')).toBe(4.6);
            expect(stl.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Properties instance', function(){
            var seed = new Properties();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            table.setPhantomCellStyles(seed);
            var stl = table.getPhantomCellStyles();
            expect(stl.getProperty('a')).toBe('high');
            expect(stl.getProperty('b')).toBe('low');
            expect(stl.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom row style setter/getter', function(){
        beforeEach(function(){
            table.setPhantomRowStyles(new RowProperties());
        });

        it('returns instance of Properties class', function(){
            expect(table.getPhantomRowStyles() instanceof Properties).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            table.setPhantomRowStyles('new: 1em; home: big');
            var stl = table.getPhantomRowStyles();
            expect(stl.getProperty('new')).toBe('1em');
            expect(stl.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            table.setPhantomRowStyles({level: 0.23, sky: 'blue'});
            var stl = table.getPhantomRowStyles();
            expect(stl.getProperty('level')).toBe(0.23);
            expect(stl.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Properties instance', function(){
            var seed = new Properties();
            seed.setProperty('a', 'high');
            seed.setProperty('x', 4);
            seed.setProperty('z', 100.1);
            table.setPhantomRowStyles(seed);
            var stl = table.getPhantomRowStyles();
            expect(stl.getProperty('a')).toBe('high');
            expect(stl.getProperty('x')).toBe(4);
            expect(stl.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom table styles setter/getter', function(){
        beforeEach(function(){
            table.setPhantomTableStyles(new TableProperties());
        });
        it('returns instance of Properties class', function(){
            expect(table.getPhantomTableStyles() instanceof Properties).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            table.setPhantomTableStyles('level: 1em; home: big');
            var stl = table.getPhantomTableStyles();
            expect(stl.getProperty('level')).toBe('1em');
            expect(stl.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            table.setPhantomTableStyles({level: 4.6, sky: 'blue'});
            var stl = table.getPhantomTableStyles();
            expect(stl.getProperty('level')).toBe(4.6);
            expect(stl.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Properties instance', function(){
            var seed = new Properties();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            table.setPhantomTableStyles(seed);
            var stl = table.getPhantomTableStyles();
            expect(stl.getProperty('a')).toBe('high');
            expect(stl.getProperty('b')).toBe('low');
            expect(stl.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom cell attributes setter/getter', function(){
        beforeEach(function(){
            table.setPhantomCellAttributes(new Properties());
        });

        it('returns instance of Properties class', function(){
            expect(table.getPhantomCellAttributes() instanceof Properties).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            table.setPhantomCellAttributes('level: 1em; home: big');
            var attr = table.getPhantomCellAttributes();
            expect(attr.getProperty('level')).toBe('1em');
            expect(attr.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            table.setPhantomCellAttributes({level: 4.6, sky: 'blue'});
            var attr = table.getPhantomCellAttributes();
            expect(attr.getProperty('level')).toBe(4.6);
            expect(attr.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Properties instance', function(){
            var seed = new Properties();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            table.setPhantomCellAttributes(seed);
            var attr = table.getPhantomCellAttributes();
            expect(attr.getProperty('a')).toBe('high');
            expect(attr.getProperty('b')).toBe('low');
            expect(attr.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom row attributes setter/getter', function(){
        beforeEach(function(){
            table.setPhantomRowProperties(new Properties());
        });
        it('returns instance of Properties class', function(){
            expect(table.getPhantomRowAttributes() instanceof Properties).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            table.setPhantomRowProperties('new: 1em; home: big');
            var attr = table.getPhantomRowAttributes();
            expect(attr.getProperty('new')).toBe('1em');
            expect(attr.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            table.setPhantomRowProperties({level: 0.23, sky: 'blue'});
            var attr = table.getPhantomRowAttributes();
            expect(attr.getProperty('level')).toBe(0.23);
            expect(attr.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Properties instance', function(){
            var seed = new Properties();
            seed.setProperty('a', 'high');
            seed.setProperty('x', 4);
            seed.setProperty('z', 100.1);
            table.setPhantomRowProperties(seed);
            var attr = table.getPhantomRowAttributes();
            expect(attr.getProperty('a')).toBe('high');
            expect(attr.getProperty('x')).toBe(4);
            expect(attr.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom table attributes setter/getter', function(){
        beforeEach(function(){
            table.setPhantomTableProperties(new Properties());
        });
        it('returns instance of Properties class', function(){
            expect(table.getPhantomTableAttributes() instanceof Properties).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            table.setPhantomTableProperties('level: 1em; home: big');
            var attr = table.getPhantomTableProperties();
            expect(attr.getProperty('level')).toBe('1em');
            expect(attr.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            table.setPhantomTableProperties({level: 4.6, sky: 'blue'});
            var attr = table.getPhantomTableProperties();
            expect(attr.getProperty('level')).toBe(4.6);
            expect(attr.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Properties instance', function(){
            var seed = new Properties();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            table.setPhantomTableProperties(seed);
            var attr = table.getPhantomTableProperties();
            expect(attr.getProperty('a')).toBe('high');
            expect(attr.getProperty('b')).toBe('low');
            expect(attr.getProperty('z')).toBe(100.1);
        });
    });

    describe('Opening/closing tag for phantom elements', function(){
        beforeEach(function(){
            table.unsetPhantom();
        });

        describe('The first argument must be a string not a string', function(){
            it('returns undefined if the first argument is a number', function(){
                expect(table.getPhantomTag(5)).not.toBeDefined();
            });
            it('returns undefined if the first argument is a function', function(){
                expect(table.getPhantomTag(function(){return null;})).not.toBeDefined();
            });
            it('returns undefined if the first argument is an object', function(){
                expect(table.getPhantomTag({foo: 1})).not.toBeDefined();
            });

        });

        describe('If the phantom elements are not defined', function(){
            it('gives undefined if the first argument is "cell"', function(){
                expect(table.getPhantomTag('cell', 'anything')).not.toBeDefined();
            });

            it('gives undefined if the first argument is "row"', function(){
                expect(table.getPhantomTag('row', 'anything')).not.toBeDefined();
            });

            it('gives undefined if the first argument is "table"', function(){
                expect(table.getPhantomTag('table', 'anything')).not.toBeDefined();
            });

        });

        describe('If phantom elements are defined', function(){
            beforeEach(function(){
                table.setPhantomTableProperties({class: 'media'});
                table.setPhantomTableStyles({mass: '2kg', 'os': 'win'});

                table.setPhantomRowProperties({length: 335, 'dim': 'large'});
                table.setPhantomRowStyles({spec: 'agile'});

                table.setPhantomCellProperties({block: 'media', type: 'school', nod: 'left'});
                table.setPhantomCellStyles({lep: 'r'});

            });
            it('gives undefined if phantom elements exits and the first argument is niether "row" nor "cell" nor "table"', function(){
                expect(table.getPhantomTableAttributes()).toBeDefined();
                expect(table.getPhantomTag('dumb name', 'anything')).not.toBeDefined();
            });
            it('gives opening tag if arguments are "table" and "open"', function(){
                expect(table.getPhantomTag('table', 'open')).toBe('<table class="media" style="mass: 2kg; os: win;">');
            });
            it('gives opening tag if arguments are "row" and "open"', function(){
                expect(table.getPhantomTag('row', 'open')).toBe('<tr length="335" dim="large" style="spec: agile;">');
            });
            it('gives opening tag if arguments are "cell" and "open"', function(){
                expect(table.getPhantomTag('cell', 'open')).toBe('<td block="media" type="school" nod="left" style="lep: r;">');
            });
            it('gives opening tag if firts argument is "cell" and the second is missing', function(){
                expect(table.getPhantomTag('cell')).toBe('<td block="media" type="school" nod="left" style="lep: r;">');
            });
            it('gives closing tag if arguments are "cell" and "close"', function(){
                expect(table.getPhantomTag('cell', 'close')).toBe('</td>');
            });
            it('gives closing tag if arguments are "row" and "close"', function(){
                expect(table.getPhantomTag('row', 'close')).toBe('</tr>');
            });
            it('gives closing tag if arguments are "table" and "close"', function(){
                expect(table.getPhantomTag('table', 'close')).toBe('</table>');
            });


        });
    });

    describe('table body getter/setter', function(){
        it('returns empty array if table content property does not contain "tbody" element', function(){
            var tbody = table.getBody();
            expect(Array.isArray(tbody)).toBe(true);
            expect(tbody.length).toBe(0);
        });
        it('throws an error if the argument of the setter is non-table-row object', function(){
            var invalids = ['span', 'div', 'a', 'td', 'h1'];
            var tag;
            invalids.forEach(function(invalid){
                tag = new Tag(invalid);
                expect(function(){
                    return table.setBody(tag);
                }).toThrow(new Error('Instance of Row class is required to be set as tbody!'));
            });
        });
        it('throws an error if the argument of the setter is an array which first element is a non-table-row object', function(){
            var invalids = ['span', 'div', 'a', 'td', 'h1'];
            invalids.forEach(function(invalid){
                expect(function(){
                    return table.setBody([new Tag(invalid), new Row(), new Row()]);
               }).toThrow(new Error('Instance of Row class is required to be set as tbody!'));
            });
        });

        it('throws an error if the argument of the setter is an array which middle element is a non-table-row object', function(){
            var invalids = ['span', 'div', 'a', 'td', 'h1'];
            invalids.forEach(function(invalid){
                expect(function(){
                    return table.setBody([new Row(), new Tag(invalid), new Row(), new Row(), new Row()]);
               }).toThrow(new Error('Instance of Row class is required to be set as tbody!'));
            });
        });


        it('throws an error if the argument of the setter is an array which last element is a non-table-row object', function(){
            var invalids = ['span', 'div', 'a', 'td', 'h1'];
            invalids.forEach(function(invalid){
                expect(function(){
                    return table.setBody([new Row(), new Row(), new Row(), new Tag(invalid)]);
               }).toThrow(new Error('Instance of Row class is required to be set as tbody!'));
            });
        });

        it('sets table body if the argument is a Row instance', function(){
            var fakeRow = new Row();
            table.setBody(fakeRow);
            expect(table.getBody()[0].toHtml()).toBe(fakeRow.toHtml());
        });

        it('sets table body if the argument is an array whose all elements are Row instances', function(){
            var fakeRow1 = new Row(),
                fakeRow2 = new Row(),
                fakeRow3 = new Row();
            fakeRow1.setProperty('id', 'first');
            fakeRow1.setProperty('id', 'second');
            fakeRow1.setProperty('id', 'third');
            table.setBody([fakeRow1, fakeRow2, fakeRow3]);
            var tbody = table.getBody();
            expect(tbody.length).toBe(3);
            expect(tbody[0].toHtml()).toBe(fakeRow1.toHtml());
            expect(tbody[1].toHtml()).toBe(fakeRow2.toHtml());
            expect(tbody[2].toHtml()).toBe(fakeRow3.toHtml());
        });
    });

    describe('Getting table first row', function(){
        it('returns nothing, if table has no rows', function(){
            expect(table.getFirstRow()).not.toBeDefined();
        });

        it('returns the row, if it is unique', function(){
            var r1 = new Row();
            r1.setProperty('data', 32);
            table.setBody([r1]);
            expect(table.getFirstRow().toHtml()).toBe(r1.toHtml());
        });

        it('returns the first row, if table has three rows', function(){
            var r1 = new Row(),
                r2 = new Row(),
                r3 = new Row();
            r1.setProperty('marker', 'kjhy1');
            r2.setProperty('marker', 'kjhy2');
            r3.setProperty('marker', 'kjhy3');
            table.setBody([r1, r2, r3]);
            expect(table.getFirstRow().toHtml()).toBe(r1.toHtml());
        });
    });

    describe('Getting table last row', function(){
        it('returns nothing, if table has no rows', function(){
            expect(table.getLastRow()).not.toBeDefined();
        });

        it('returns the row, if it is unique', function(){
            var r1 = new Row();
            r1.setProperty('data', 32);
            table.setBody([r1]);
            expect(table.getLastRow().toHtml()).toBe(r1.toHtml());
        });

        it('returns the last row, if table has three rows', function(){
            var r1 = new Row(),
                r2 = new Row(),
                r3 = new Row();
            r1.setProperty('marker', 'kjhy1');
            r2.setProperty('marker', 'kjhy2');
            r3.setProperty('marker', 'kjhy3');
            table.setBody([r1, r2, r3]);
            expect(table.getLastRow().toHtml()).toBe(r3.toHtml());
        });
    });

    describe('Getting table row', function(){
        var t0, t3, r1, r2, r3;
        beforeEach(function(){
            t0 = new Table();   /// empty table
            t0.setBody([]);

            t3 = new Table();   /// 3-row table
            r1 = new Row();
            r2 = new Row();
            r3 = new Row();
            r1.setProperty('marker', 'kjhy1');
            r2.setProperty('marker', 'kjhy2');
            r3.setProperty('marker', 'kjhy3');
            t3.setBody([r1, r2, r3]);

        });
        it('returns nothing, if row number is not provided and table is empty', function(){
            expect(t0.getRow()).not.toBeDefined();
        });
        it('returns nothing, if row number is not provided and table is not empty', function(){
            expect(t3.getRow()).not.toBeDefined();
        });
        it('returns nothing, if row number is provided and table is empty', function(){
            expect(t0.getRow(5)).not.toBeDefined();
        });
        it('returns first row, if it is requested row number 0', function(){
            expect(t3.getRow(0).toHtml()).toBe(r1.toHtml());
        });
        it('returns middle row', function(){
            expect(t3.getRow(1).toHtml()).toBe(r2.toHtml());
        });
        it('returns last rows', function(){
            expect(t3.getRow(2).toHtml()).toBe(r3.toHtml());
        });
        it('returns nothing, if requested row does not exist', function(){
            expect(t3.getRow(5)).not.toBeDefined();
        });
    });


    describe('Creates html representation', function(){
        var attrs;
        beforeEach(function(){
            attrs = {toString: function(){return '"attributes"';}};
            row1 = new Row();
            row2 = new Row();
            row3 = new Row();
            row4 = new Row();       // object with no 'toHtml' method
            spyOn(row1, 'toHtml').and.returnValue('"row 1"');
            spyOn(row2, 'toHtml').and.returnValue('"row 2"');
            spyOn(row3, 'toHtml').and.returnValue('"row 3"');
            spyOn(row4, 'toHtml').and.returnValue('"row 4"');
        });

        it('generates html string for a table with empty body', function(){
            spyOn(table, 'isFramed').and.returnValue(false);
            spyOn(table, 'getProperties').and.returnValue(attrs);
            table.setBody([]);
            expect(table.toHtml()).toBe('<table "attributes"><tbody></tbody></table>');
        });


        it('generates html string for non-framed table', function(){
            spyOn(table, 'isFramed').and.returnValue(false);
            spyOn(table, 'getProperties').and.returnValue(attrs);
            table.setBody([row1, row2]);
            expect(table.toHtml()).toBe('<table "attributes"><tbody>"row 1""row 2"</tbody></table>');
        });


        it('generates html string for framed table', function(){
            spyOn(table, 'isFramed').and.returnValue(true);
            spyOn(table, 'getPhantomTag').and.callFake(function(elem, type){return '<'  + elem + ' ' + type +'>';});
            spyOn(table, 'getProperties').and.returnValue(attrs);
            table.setBody([row1, row2, row3]);

            expect(table.toHtml()).toBe('<table "attributes"><tbody>\
<row open><cell open><table open>"row 1"<table close><cell close><row close>\
<row open><cell open><table open>"row 2"<table close><cell close><row close>\
<row open><cell open><table open>"row 3"<table close><cell close><row close>\
</tbody></table>');
        });
    });



    describe('Table::appendRow(): appends the row', function(){
        it('throws exception if not a Row instance is appended to the table', function(){
            var foo = {};
            expect(foo instanceof Row).toBe(false);
            expect(function(){
                return table.appendRow(foo);
            }).toThrow(new Error('The argument is not a Row instance!'));
         });
        // it('calls parent method appendElem() if a Row instance is given', function(){
        //     spyOn(table, 'appendElem').and.returnValue(null);
        //     expect(row1 instanceof Row).toBe(true);
        //     table.appendRow(row1);
        //     // expect(table.appendElem).toHaveBeenCalledWith(row1);
        // });
        it('appends row to a table without rows', function(){
            row1 = new Row();
            row1.setProperty('marker', '@w');
            expect(table.rowNum()).toBe(0);
            table.appendRow(row1);
            expect(table.rowNum()).toBe(1);
            expect(table.getBody()[0].toHtml()).toBe(row1.toHtml());
        });
        it('appends row to a table with two rows', function(){
            row1 = new Row();
            row2 = new Row();
            row3 = new Row();
            table.setBody([row1, row2]);
            row1.setProperty('marker', '@w');
            row2.setProperty('marker', '@s');
            row3.setProperty('marker', '@x');
            expect(table.rowNum()).toBe(2);
            table.appendRow(row3);
            expect(table.rowNum()).toBe(3);
            expect(table.getBody()[0].toHtml()).toBe(row1.toHtml());
            expect(table.getBody()[1].toHtml()).toBe(row2.toHtml());
            expect(table.getBody()[2].toHtml()).toBe(row3.toHtml());
        });
    });

    describe('Table::getMatrix(): 2-dim array of the cell widths in each row', function(){
        var matrix;
        it('gives empty array if the table has no rows', function(){
            spyOn(table, 'length').and.returnValue(0);
            expect(table.getMatrix().length).toBe(0);
        });
        it('calls Row::getCellWidths for one-row table', function(){
            spyOn(row1, 'getCellWidths').and.returnValue('array of cell widths of the unique row');
            table.appendRow(row1);
            matrix = table.getMatrix();
            expect(matrix.length).toBe(1);
            expect(row1.getCellWidths).toHaveBeenCalled();
            expect(matrix[0]).toBe('array of cell widths of the unique row');
        });
        it('calls Row::getCellWidths on each row for three-row table', function(){
            spyOn(row1, 'getCellWidths').and.returnValue('array of cell widths of the first row');
            spyOn(row2, 'getCellWidths').and.returnValue('array of cell widths of the second row');
            spyOn(row3, 'getCellWidths').and.returnValue('array of cell widths of the third row');
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
                return table.setProfile('not array');
            }).toThrow(new Error('Wrong argument type: array expected.'));
        });

        it('throws an error if input array length is different from the number of the columns', function(){
            spyOn(table, 'colNum').and.returnValue(20);
            expect(function(){
                return table.setProfile([1, 2]);
            }).toThrow(new Error('Wrong input array length!'));
        });
        it('does not throw an error if input array and the table have zero lengths', function(){
            spyOn(table, 'colNum').and.returnValue(0);
            expect(function(){
                table.setProfile([]);
            }).not.toThrow('Wrong input array lenght!');
        });

        it('calls Row::setCellWidths if the table has one row', function(){
            spyOn(row1, 'setCellWidths').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(5);
            table.appendRow(row1);
            table.setProfile([2, 4, 6, 1, 2]);
            expect(row1.setCellWidths).toHaveBeenCalledWith([2, 4, 6, 1, 2]);
        });
        it('calls Row::setCellWidths if the table has three rows', function(){
            spyOn(row1, 'setCellWidths').and.returnValue(null);
            spyOn(row2, 'setCellWidths').and.returnValue(null);
            spyOn(row3, 'setCellWidths').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(4);
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
            spyOn(table, 'isSameWidths').and.returnValue(false);
            expect(table.getProfile()).toBe(null);
        });
        it('gets the first element of getMatrix() array, if all rows have the same cell widths', function(){
            spyOn(table, 'isSameWidths').and.returnValue(true);
            spyOn(table, 'getMatrix').and.returnValue(['profile of the first row', 'the rest']);
            expect(table.getProfile()).toBe('profile of the first row');
        });
    });

    describe('Table::isSameWidths(): whether all table rows have the same profiles', function(){
        it('gets true for empty table', function(){
            spyOn(table, 'getMatrix').and.returnValue([]);
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a table with an empty row', function(){
            spyOn(table, 'getMatrix').and.returnValue([[]]);
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a 2 x 3 table with the same row profiles', function(){
            spyOn(table, 'getMatrix').and.returnValue([[1, 2, 3], [1, 2, 3]]);
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets false for a non-rectangular table with different row profiles', function(){
            spyOn(table, 'getMatrix').and.returnValue([[1, 2], [1, 2, 3]]);
            expect(table.isSameWidths()).toBe(false);
        });

        it('gets false for a table with empty first row and non-empty second row', function(){
            spyOn(table, 'getMatrix').and.returnValue([[], [1, 2, 3]]);
            expect(table.isSameWidths()).toBe(false);
        });
        it('gets true for a 4 x 4 tables with the same row profiles', function(){
            spyOn(table, 'getMatrix').and.returnValue([[89, 32, 83, 1], [89, 32, 83, 1], [89, 32, 83, 1], [89, 32, 83, 1]]);
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a 5 x 4 tables with the same row profiles', function(){
            spyOn(table, 'getMatrix').and.returnValue([[94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21]]);
            expect(table.isSameWidths()).toBe(true);
        });
        it('gets true for a 5 x 4 tables with different row profiles', function(){
            spyOn(table, 'getMatrix').and.returnValue([[94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 21], [94, 354, 74.1, 'XXX']]);
            expect(table.isSameWidths()).toBe(false);
        });
    });

    describe('Table::knockOutCol(): knocks out given column', function(){
        it('calls method Row::dropCell() on each row', function(){
            spyOn(row1, 'knockOutCell').and.returnValue(null);
            spyOn(row2, 'knockOutCell').and.returnValue(null);
            spyOn(row3, 'knockOutCell').and.returnValue(null);
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
            spyOn(row1, 'dropCellAt').and.returnValue(null);
            spyOn(row2, 'dropCellAt').and.returnValue(null);
            spyOn(row3, 'dropCellAt').and.returnValue(null);
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
            spyOn(row1, 'cellNum').and.returnValue(13);
            spyOn(row2, 'cellNum').and.returnValue(10);
            spyOn(row3, 'cellNum').and.returnValue(10);
            spyOn(row4, 'cellNum').and.returnValue(10);
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            table.appendRow(row4);
            // table.setElements([row1, row2, row3, row4]);
            expect(table.colNum()).toBe(null);
        });

        it('gives null, if last row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').and.returnValue(10);
            spyOn(row2, 'cellNum').and.returnValue(10);
            spyOn(row3, 'cellNum').and.returnValue(10);
            spyOn(row4, 'cellNum').and.returnValue(10);
            spyOn(row5, 'cellNum').and.returnValue(14);
            table.appendRow(row1);
            table.appendRow(row2);
            table.appendRow(row3);
            table.appendRow(row4);
            table.appendRow(row5);
            expect(table.colNum()).toBe(null);
        });
        it('gives null, if a middle row is not of the same lenght as others', function(){
            spyOn(row1, 'cellNum').and.returnValue(5);
            spyOn(row2, 'cellNum').and.returnValue(5);
            spyOn(row3, 'cellNum').and.returnValue(7);
            spyOn(row4, 'cellNum').and.returnValue(5);
            table.setBody([row1, row2, row3, row4]);
            expect(table.colNum()).toBe(null);
        });
        it('gives null, if all rows are not of different lenght', function(){
            spyOn(row1, 'cellNum').and.returnValue(12);
            spyOn(row2, 'cellNum').and.returnValue(5);
            spyOn(row3, 'cellNum').and.returnValue(98);
            spyOn(row4, 'cellNum').and.returnValue(3);
            spyOn(row5, 'cellNum').and.returnValue(14);
            table.setBody([row1, row2, row3, row4, row5]);
            expect(table.colNum()).toBe(null);
        });
        it('gives zero, for empty table', function(){
            expect(table.colNum()).toBe(0);
        });
        it('gives zero, if table contains only empty rows', function(){
            spyOn(row1, 'cellNum').and.returnValue(0);
            spyOn(row2, 'cellNum').and.returnValue(0);
            spyOn(row3, 'cellNum').and.returnValue(0);
            spyOn(row4, 'cellNum').and.returnValue(0);
            spyOn(row5, 'cellNum').and.returnValue(0);
            table.setBody([row1, row2, row3, row4, row5]);
            expect(table.colNum()).toBe(0);
        });
        it('gives number of cells', function(){
            spyOn(row1, 'cellNum').and.returnValue(4);
            spyOn(row2, 'cellNum').and.returnValue(4);
            spyOn(row3, 'cellNum').and.returnValue(4);
            spyOn(row4, 'cellNum').and.returnValue(4);
            spyOn(row5, 'cellNum').and.returnValue(4);
            table.setBody([row1, row2, row3, row4, row5]);
            expect(table.colNum()).toBe(4);
        });
        it('gives number of cells if table has only one row', function(){
            spyOn(row1, 'cellNum').and.returnValue(53);
            table.setBody([row1]);
            expect(table.colNum()).toBe(53);
        });
    });

    describe('Table::insertColAt(): inserts column at given position', function(){
        it('Throws an error if position index is too big', function(){
            spyOn(table, 'colNum').and.returnValue(5);
            expect(function(){
                return table.insertColAt(7, "table");
            }).toThrow(new Error('Wrong index for the cell to insert!'));
        });

        it('Throws an error if position index is negative', function(){
            spyOn(table, 'colNum').and.returnValue(3);
            expect(function(){
                return table.insertColAt(-2, "table");
            }).toThrow(new Error('Wrong index for the cell to insert!'));
        });

        it('Throws an error if position index is greater than the number of columns', function(){
            spyOn(table, 'colNum').and.returnValue(3);
            expect(function(){
                return table.insertColAt(4, "table");
            }).toThrow(new Error('Wrong index for the cell to insert!'));
        });

        it('Does not throw any error if position index is equal to the number of columns', function(){
            spyOn(table, 'colNum').and.returnValue(3);
            expect(function(){
                table.insertColAt(3, "table");
            }).not.toThrow('Wrong index for the cell to insert!');
        });

        it('calls a method to insert table', function(){
            var c = new Cell();
            spyOn(row1, 'insertCellAt').and.returnValue(null);
            spyOn(row2, 'insertCellAt').and.returnValue(null);
            spyOn(row3, 'insertCellAt').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(3);
            table.setBody([row1, row2, row3]);
            table.insertColAt(1, c);
            expect(row1.insertCellAt).toHaveBeenCalledWith(1, c);
            expect(row2.insertCellAt).toHaveBeenCalledWith(1, c);
            expect(row3.insertCellAt).toHaveBeenCalledWith(1, c);
        });


        it('calls a method to insert cell at the end of the row (appending a column)', function(){
            var c = new Cell();
            spyOn(row1, 'appendCell').and.returnValue(null);
            spyOn(row2, 'appendCell').and.returnValue(null);
            spyOn(row3, 'appendCell').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(10);
            table.setBody([row1, row2, row3]);
            table.insertColAt(10, c);
            expect(row1.appendCell).toHaveBeenCalledWith(c);
            expect(row2.appendCell).toHaveBeenCalledWith(c);
            expect(row3.appendCell).toHaveBeenCalledWith(c);
        });

        it('calls a method to insert column at the beginning of the row', function(){
            var c = new Table();
            spyOn(row1, 'insertCellAt').and.returnValue(null);
            spyOn(row2, 'insertCellAt').and.returnValue(null);
            spyOn(row3, 'insertCellAt').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(3);
            table.setBody([row1, row2, row3]);
            table.insertColAt(0, c);
            expect(row1.insertCellAt).toHaveBeenCalledWith(0, c);
            expect(row2.insertCellAt).toHaveBeenCalledWith(0, c);
            expect(row3.insertCellAt).toHaveBeenCalledWith(0, c);
        });

        it('calls a method to insert column at one position before the end of the row', function(){
            var c = new Table();
            spyOn(row1, 'insertCellAt').and.returnValue(null);
            spyOn(row2, 'insertCellAt').and.returnValue(null);
            spyOn(row3, 'insertCellAt').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(10);
            table.setBody([row1, row2, row3]);
            table.insertColAt(9, c);
            expect(row1.insertCellAt).toHaveBeenCalledWith(9, c);
            expect(row2.insertCellAt).toHaveBeenCalledWith(9, c);
            expect(row3.insertCellAt).toHaveBeenCalledWith(9, c);
        });

        it('calls a method to insert column if cell is not provided', function(){
            spyOn(row1, 'insertCellAt').and.returnValue(null);
            spyOn(row2, 'insertCellAt').and.returnValue(null);
            spyOn(row3, 'insertCellAt').and.returnValue(null);
            spyOn(table, 'colNum').and.returnValue(3);
            table.setBody([row1, row2, row3]);
            table.insertColAt(2);
            expect(row1.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
            expect(row2.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
            expect(row3.insertCellAt).toHaveBeenCalledWith(2, jasmine.any(Cell));
        });
    });

    describe('Table::appendStyleToCol(): Appends style to a single column:', function(){
        it('Throw an error if column number is not integer ', function(){
            spyOn(table, 'colNum').and.returnValue(12);
            expect(function(){
                return table.appendStyleToCol(10.32, "whatever");
            }).toThrow(new Error('The column is not present!'));
        });

        it('Throw an error if column number is negative', function(){
            spyOn(table, 'colNum').and.returnValue(1);
            expect(function(){
                return table.appendStyleToCol(-3, "whatever");
            }).toThrow(new Error('The column is not present!'));
        });

        it('Throw an error if column number is too big', function(){
            spyOn(table, 'colNum').and.returnValue(5);
            expect(function(){
                return table.appendStyleToCol(7, "whatever");
            }).toThrow(new Error('The column is not present!'));
        });

        it('Throw an error if column number is equal to the number of columns', function(){
            spyOn(table, 'colNum').and.returnValue(6);
            expect(function(){
                return table.appendStyleToCol(6, "whatever");
            }).toThrow(new Error('The column is not present!'));
        });

        it('Does not throw an error if column number is one less than the overall column number', function(){
            spyOn(table, 'colNum').and.returnValue(6);
            expect(function(){
                table.appendStyleToCol(5, "whatever");
            }).not.toThrow('The column is not present!');
        });

        it('calls append style method to each row', function(){
            spyOn(table, 'colNum').and.returnValue(5);
            spyOn(row1, 'appendStyleToCellAt').and.returnValue(null);
            spyOn(row2, 'appendStyleToCellAt').and.returnValue(null);
            spyOn(row3, 'appendStyleToCellAt').and.returnValue(null);
            table.setElements([row1, row2, row3]);
            table.appendStyleToCol(2, "whatever");
            expect(row1.appendStyleToCellAt).toHaveBeenCalledWith(2, "whatever");
            expect(row2.appendStyleToCellAt).toHaveBeenCalledWith(2, "whatever");
            expect(row3.appendStyleToCellAt).toHaveBeenCalledWith(2, "whatever");
        });
    });

    describe('Table::toHtml(): generates html representation of the table', function(){
        it('generates html code of the table if attribute and style properties are both present', function(){
            spyOn(row1, 'toHtml').and.returnValue('row 1 ');
            spyOn(row2, 'toHtml').and.returnValue('row 2 html ');
            spyOn(row3, 'toHtml').and.returnValue('row 3 content');

            spyOn(tableAttr, 'toString').and.returnValue('attributes for the table');
            table.setProperties(tableAttr);
            table.setElements([row1, row2, row3]);
            expect(table.toHtml()).toEqual('<table attributes for the table><tbody>row 1 row 2 html row 3 content</tbody></table>');
        });


        it('generates html code of the table if attribute property is empty', function(){
            spyOn(row1, 'toHtml').and.returnValue('row 1 ');
            spyOn(row2, 'toHtml').and.returnValue('row 2 html ');
            spyOn(row3, 'toHtml').and.returnValue('row 3 content');

            spyOn(tableAttr, 'toString').and.returnValue('');
            table.setProperties(tableAttr);
            table.setElements([row1, row2, row3]);
            expect(table.toHtml()).toEqual('<table><tbody>row 1 row 2 html row 3 content</tbody></table>');
        });

        it('generates html code of the table if both attribute and style properties are empty', function(){
            spyOn(row1, 'toHtml').and.returnValue('row 1 ');
            spyOn(row2, 'toHtml').and.returnValue('row 2 html ');
            spyOn(row3, 'toHtml').and.returnValue('row 3 content');

            spyOn(tableAttr, 'toString').and.returnValue('');
            table.setProperties(tableAttr);
            tableAttr.setStyles(tableStyle);
            table.setElements([row1, row2, row3]);
            expect(table.toHtml()).toEqual('<table><tbody>row 1 row 2 html row 3 content</tbody></table>');
        });


        xit('generates html code of the framed table: all bogus attributes and styles are present (pending test)', function(){
            spyOn(row1, 'toHtml').and.returnValue('row 1');
            spyOn(row2, 'toHtml').and.returnValue('row 2 html');
            spyOn(tableAttr, 'toString').and.returnValue('table attr');
            spyOn(tableStyle, 'toString').and.returnValue('table styles');
            spyOn(bogusTableStyle, 'toString').and.returnValue('bogus table styles');
            spyOn(bogusTableAttr, 'toString').and.returnValue('bogus table attributes');
            spyOn(bogusCellStyle, 'toString').and.returnValue('bogus table styles');
            spyOn(bogusCellAttr, 'toString').and.returnValue('bogus table attributes');
            spyOn(bogusRowStyle, 'toString').and.returnValue('bogus row styles');
            spyOn(bogusRowAttr, 'toString').and.returnValue('bogus row attributes');

            table.setProperties(tableAttr);
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


        xit('generates html code of the framed table: bogus attributes are present, styles - not (pending test)', function(){
            spyOn(row1, 'toHtml').and.returnValue('row 1');
            spyOn(row2, 'toHtml').and.returnValue('row 2 html');
            spyOn(tableAttr, 'toString').and.returnValue('table attr');
            spyOn(tableStyle, 'toString').and.returnValue('table styles');
            spyOn(bogusTableStyle, 'toString').and.returnValue('');
            spyOn(bogusTableAttr, 'toString').and.returnValue('bogus table attributes');
            spyOn(bogusCellStyle, 'toString').and.returnValue('');
            spyOn(bogusCellAttr, 'toString').and.returnValue('bogus table attributes');
            spyOn(bogusRowStyle, 'toString').and.returnValue('');
            spyOn(bogusRowAttr, 'toString').and.returnValue('bogus row attributes');

            table.setProperties(tableAttr);
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
            table.setProperties(new Properties()); // flushing styles
        });
        it('sets the default values for the table border', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder();
            expect(table.getStyleProperty('border-width')).toBeDefined();
            expect(table.getStyleProperty('border-color')).toBeDefined();
            expect(table.getStyleProperty('border-style')).toBeDefined();
            expect(table.getProperty('border')).toBeDefined();
        });
        it('imposes all parameters if they are passed as argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'width': 20, 'color': 'very nice color', 'style': 'modern'});
            expect(table.getStyleProperty('border-width')).toBe(20);
            expect(table.getStyleProperty('border-color')).toBe('very nice color');
            expect(table.getStyleProperty('border-style')).toBe('modern');
            expect(table.getProperty('border')).toBe(20);
        });
        it('imposes default color if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'width': 20, 'style': 'modern'});
            expect(table.getStyleProperty('border-width')).toBe(20);
            expect(table.getStyleProperty('border-color')).toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('modern');
            expect(table.getProperty('border')).toBe(20);
        });
        it('imposes default border width if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'color': 'green', 'style': 'modern'});
            expect(table.getStyleProperty('border-width')).toBeDefined();
            expect(table.getStyleProperty('border-color')).toBe('green');
            expect(table.getStyleProperty('border-style')).toBe('modern');
            expect(table.getProperty('border')).toBeDefined(20);
        });
        it('imposes default border style if it is missing in the argument', function(){
            expect(table.hasOwnProperty('setBorder')).toBe(true);
            table.setBorder({'color': 'red', 'width': 'modern'});
            expect(table.getStyleProperty('border-width')).toBe('modern');
            expect(table.getStyleProperty('border-color')).toBe('red');
            expect(table.getStyleProperty('border-style')).toBeDefined();
            expect(table.getProperty('border')).toBe('modern');
        });
    });

    describe('Table::removeBorder(): removes table border', function(){
        it('"removes" info about border table from the styles if it was not even present', function(){
            table.dropStyleProperty('border-width');
            table.dropStyleProperty('border-color');
            table.dropStyleProperty('border-style');
            table.removeBorder();
            expect(table.getStyleProperty('border-width')).not.toBeDefined();
            expect(table.getStyleProperty('border-color')).not.toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('none');
            expect(table.getProperty('border')).not.toBeDefined();
        });

        it('removes existing info about border table from the styles', function(){
            table.setStyleProperty('border-width', 'width');
            table.setStyleProperty('border-color', 'color');
            table.setStyleProperty('border-style', 'style');
            table.removeBorder();
            expect(table.getStyleProperty('border-width')).not.toBeDefined();
            expect(table.getStyleProperty('border-color')).not.toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('none');
            expect(table.getProperty('border')).not.toBeDefined();
        });

        it('removes existing info about border table from the attributes', function(){
            table.setProperty('border', 2);
            table.removeBorder();
            expect(table.getStyleProperty('border-width')).not.toBeDefined();
            expect(table.getStyleProperty('border-color')).not.toBeDefined();
            expect(table.getStyleProperty('border-style')).toBe('none');
            expect(table.getProperty('border')).not.toBeDefined();
        });
    });

    describe('Table::rowNum(): gives the number of rows in the table', function(){
        it('returns zero if table has no tbody, no thead, no tfoot and no caption', function(){
            expect(table.length()).toBe(0);
            expect(table.rowNum()).toBe(0);
        });
        it('returns zero if table has thead only', function(){
            var tHead = new Tag('thead');
            tHead.setContent('table head');
            table.appendElem(tHead);
            expect(table.rowNum()).toBe(0);
        });

        it('returns zero if table has tfoot only', function(){
            var tFoot = new Tag('tfoot');
            tFoot.setContent('table head');
            table.appendElem(tFoot);
            expect(table.rowNum()).toBe(0);
        });

        it('returns zero if table has empty tbody', function(){
            table.setBody([]);
            expect(table.rowNum()).toBe(0);
        });

        it('returns 1 if table body has one row', function(){
            table.setBody([new Row()]);
            expect(table.rowNum()).toBe(1);
        });

        it('returns 3 if table body has three rows', function(){
            table.setBody([new Row(), new Row(), new Row()]);
            expect(table.rowNum()).toBe(3);
        });
    });

    describe('Table:isFramed(): whether the table is framed', function(){
        it('gives false, if none of the phantom styles and attributes are set', function(){
            expect(table.isFramed()).toBe(false);
        });

        it('gives true, if phantomTableAttributes is set', function(){
            table.setPhantomTableProperties(new Properties());
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if phantomTableStyle is set', function(){
            table.setPhantomTableStyles(new Properties());
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if phantomCellAttributes is set', function(){
            table.setPhantomCellAttributes(new Properties());
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if phantomCellStyles is set', function(){
            table.setPhantomCellStyles(new Properties());
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if phantomRowAttr is set', function(){
            table.setPhantomRowProperties(new Properties());
            expect(table.isFramed()).toBe(true);
        });

        it('gives true, if phantomRowStyle is set', function(){
            table.setPhantomRowProperties(new Properties());
            expect(table.isFramed()).toBe(true);
        });
    });

    describe('Table:unsetPhantom(): removes phantom cell/row/table styles and attributes', function(){
        var phantomGetters, len, i, stl, attr;
        beforeEach(function(){
            phantomGetters = ['getPhantomTableStyles', 'getPhantomTableAttributes', 'getPhantomCellStyles',
                'getPhantomCellAttributes', 'getPhantomRowStyles', 'getPhantomRowAttributes'];
            len = phantomGetters.length;
            stl = new Properties();
            attr = new Properties();
        });

        afterEach(function(){
            for (i = 0; i < len; i++){
                expect(table[phantomGetters[i]]()).not.toBeDefined();
            }
        });

        it('if they were not set', function(){
            table.unsetPhantom();
        });

        it('unsets phantoms, if only phantom table attributes are set', function(){
            table.setPhantomTableProperties(attr);
            expect(table.getPhantomTableAttributes()).toBeDefined();
            table.unsetPhantom();
        });

        it('unsets phantom attributes, if only phantomTableStyle was initially set', function(){
            table.setPhantomTableStyles(stl);
            expect(table.getPhantomTableStyles()).toBeDefined();
            table.unsetPhantom();
        });
        it('unsets phantom attributes, if only phantomCellAttr was initially set', function(){
            table.setPhantomCellAttributes(attr);
            expect(table.getPhantomCellAttributes()).toBeDefined();
            table.unsetPhantom();
        });
        it('unsets phantom attributes, if only phantomCellStyle was initially set', function(){
            table.setPhantomCellStyles(stl);
            expect(table.getPhantomCellStyles()).toBeDefined();
            table.unsetPhantom();
        });
        it('unsets phantom attributes, if only phantomRowAttr was initially set', function(){
            table.setPhantomRowProperties(attr);
            expect(table.getPhantomRowAttributes()).toBeDefined();
            table.unsetPhantom();
        });
        it('unsets phantom attributes, if only phantomRowStyle was initially set', function(){
            table.setPhantomRowStyles(stl);
            expect(table.getPhantomRowStyles()).toBeDefined();
            table.unsetPhantom();
        });
    });

    describe('Table::isFragmented(): whether the table looks like a framed table?', function(){
        it('gives false for empty tables', function(){
            spyOn(table, 'rowNum').and.returnValue(0);
            expect(table.isFragmented()).toBe(false);
            expect(table.rowNum).toHaveBeenCalled();
        });
        it('gives true for a table with one row that is framed', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(true);
            table.setBody([row1]);
            expect(table.isFragmented()).toBe(true);
            expect(row1.onlyTableInside).toHaveBeenCalled();
        });
        it('gives false for a table with one row that is not framed', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(false);
            table.setElements([row1]);
            expect(table.isFragmented()).toBe(false);
            expect(row1.onlyTableInside).toHaveBeenCalled();
        });

        it('gives false for a table with 3 rows, where only the last is not framed', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(true);
            spyOn(row2, 'onlyTableInside').and.returnValue(true);
            spyOn(row3, 'onlyTableInside').and.returnValue(false);
            table.setElements([row1, row2, row3]);
            expect(table.isFragmented()).toBe(false);
        });

        it('gives false for a table with 3 rows, where only the first is not framed', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(false);
            spyOn(row2, 'onlyTableInside').and.returnValue(true);
            spyOn(row3, 'onlyTableInside').and.returnValue(true);
            table.setElements([row1, row2, row3]);
            expect(table.isFragmented()).toBe(false);
        });

        it('gives false for a table with 4 rows, where only the second is not framed', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(true);
            spyOn(row2, 'onlyTableInside').and.returnValue(false);
            spyOn(row3, 'onlyTableInside').and.returnValue(true);
            spyOn(row4, 'onlyTableInside').and.returnValue(true);
            table.setElements([row1, row2, row3, row4]);
            expect(table.isFragmented()).toBe(false);
        });

        it('calls Row() methods until the first row which is the first that returns false', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(false);
            spyOn(row2, 'onlyTableInside').and.returnValue(true);
            spyOn(row3, 'onlyTableInside').and.returnValue(true);
            spyOn(row4, 'onlyTableInside').and.returnValue(false);
            table.setElements([row1, row2, row3, row4]);
            table.isFragmented();
            expect(row1.onlyTableInside).toHaveBeenCalled();
            expect(row2.onlyTableInside).not.toHaveBeenCalled();
            expect(row3.onlyTableInside).not.toHaveBeenCalled();
            expect(row4.onlyTableInside).not.toHaveBeenCalled();
        });

        it('calls Row() methods until the second row which is the first that returns false', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(true);
            spyOn(row2, 'onlyTableInside').and.returnValue(false);
            spyOn(row3, 'onlyTableInside').and.returnValue(false);
            spyOn(row4, 'onlyTableInside').and.returnValue(true);
            table.setElements([row1, row2, row3, row4]);
            table.isFragmented();
            expect(row1.onlyTableInside).toHaveBeenCalled();
            expect(row2.onlyTableInside).toHaveBeenCalled();
            expect(row3.onlyTableInside).not.toHaveBeenCalled();
            expect(row4.onlyTableInside).not.toHaveBeenCalled();
        });

        it('calls Row() methods until the last row which is the first that returns false', function(){
            spyOn(row1, 'onlyTableInside').and.returnValue(true);
            spyOn(row2, 'onlyTableInside').and.returnValue(true);
            spyOn(row3, 'onlyTableInside').and.returnValue(true);
            spyOn(row4, 'onlyTableInside').and.returnValue(false);
            table.setElements([row1, row2, row3, row4]);
            table.isFragmented();
            expect(row1.onlyTableInside).toHaveBeenCalled();
            expect(row2.onlyTableInside).toHaveBeenCalled();
            expect(row3.onlyTableInside).toHaveBeenCalled();
            expect(row4.onlyTableInside).toHaveBeenCalled();
        });
    });




    describe('Table::desintangle(): converts table from fragmented into a framed', function(){
        xit('sets bogus cell attributes, if the table is fragmented', function(){
            var obj = {};
            spyOn(table, 'getPhantomCellAttributes').and.returnValue(obj);
            spyOn(table, 'getPhantomCellStyles');
            spyOn(table, 'getPhantomRowAttributes');
            spyOn(table, 'getPhantomRowStyles');
            spyOn(table, 'getPhantomTableAttributes');
            spyOn(table, 'getPhantomTableStyles');
            spyOn(table, 'isFragmented').and.returnValue(true);
            expect(table.bogusCellAttr).toBe(null);
            table.disentangle();
            expect(table.bogusCellAttr).toBe(obj);
        });

        xit('sets bogus row attributes, if the table is fragmented (pending test)', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr').and.returnValue(obj);
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');
            spyOn(table, 'isFragmented').and.returnValue(true);
            expect(table.bogusRowAttr).toBe(null);
            table.disentangle();
            expect(table.bogusRowAttr).toBe(obj);
        });

        xit('sets bogus table attributes, if the table is fragmented (pending test)', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr').and.returnValue(obj);
            spyOn(table, 'getBogusTableStyle');

            spyOn(table, 'isFragmented').and.returnValue(true);
            expect(table.bogusTableAttr).toBe(null);
            table.disentangle();
            expect(table.bogusTableAttr).toBe(obj);
        });

        xit('sets bogus cell style, if the table is fragmented (pending test)', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle').and.returnValue(obj);
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');

            spyOn(table, 'isFragmented').and.returnValue(true);
            expect(table.bogusCellStyle).toBe(null);
            table.disentangle();
            expect(table.bogusCellStyle).toBe(obj);
        });

        xit('sets bogus row style, if the table is fragmented (pending test)', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle').and.returnValue(obj);
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle');

            spyOn(table, 'isFragmented').and.returnValue(true);
            expect(table.bogusRowStyle).toBe(null);
            table.disentangle();
            expect(table.bogusRowStyle).toBe(obj);
        });

        xit('sets bogus table style, if the table is fragmented (pending test)', function(){
            var obj = {};
            spyOn(table, 'getBogusCellAttr');
            spyOn(table, 'getBogusCellStyle');
            spyOn(table, 'getBogusRowAttr');
            spyOn(table, 'getBogusRowStyle');
            spyOn(table, 'getBogusTableAttr');
            spyOn(table, 'getBogusTableStyle').and.returnValue(obj);

            spyOn(table, 'isFragmented').and.returnValue(true);
            expect(table.bogusTableStyle).toBe(null);
            table.disentangle();
            expect(table.bogusTableStyle).toBe(obj);
        });

        xit('rearrange the table if it is fragmented (pending test)', function(){
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

            spyOn(table, 'isFragmented').and.returnValue(true);
            spyOn(table, 'getBogusRowAttr').and.returnValue(bogusRowAttr);
            spyOn(table, 'getBogusRowStyle').and.returnValue(bogusRowStyle);
            spyOn(table, 'getBogusCellAttr').and.returnValue(bogusCellAttr);
            spyOn(table, 'getBogusCellStyle').and.returnValue(bogusCellStyle);
            spyOn(table, 'getBogusTableAttr').and.returnValue(bogusTableAttr);
            spyOn(table, 'getBogusTableStyle').and.returnValue(bogusTableStyle);

            spyOn(row1, 'getFirst').and.returnValue(c1);
            spyOn(row2, 'getFirst').and.returnValue(c2);
            spyOn(row3, 'getFirst').and.returnValue(c3);
            spyOn(c1, 'getFirst').and.returnValue(t1);
            spyOn(c2, 'getFirst').and.returnValue(t2);
            spyOn(c3, 'getFirst').and.returnValue(t3);

            spyOn(t1, 'getFirst').and.returnValue(innerRow1);
            spyOn(t2, 'getFirst').and.returnValue(innerRow2);
            spyOn(t3, 'getFirst').and.returnValue(innerRow3);

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

    describe('Loading element into table', function(){
        var t00, t10, t11, t13, t23; //t20, t22, t23;
        beforeEach(function(){
            var tRow, tCell, thead, tbody, tfoot, capt;
            // table 0 x 0 (no rows and hence no cells)
            t00 = document.createElement('table');
            t00.setAttribute('class', 'highest');
            t00.setAttribute('style', 'width: 80%; color: blue');

            // table 1 x 0 (single row without cells, header and caption)
            t10 = document.createElement('table');
            thead = document.createElement('thead');
            thead.appendChild(document.createTextNode('table header'));
            t10.appendChild(thead);

            capt = document.createElement('caption');
            capt.appendChild(document.createTextNode('table caption'));
            t10.appendChild(capt);

            tbody = document.createElement('tbody');
            tRow = document.createElement('tr');
            tRow.setAttribute('data', 'table-row');
            tRow.setAttribute('id', '#uniqueElem');
            t10.appendChild(tbody);
            tbody.appendChild(tRow);

            // table 1 x 1 (single row with one cells)
            tRow = document.createElement('tr');
            tRow.setAttribute('width', '200');
            tRow.setAttribute('style', 'uniqueElem: true');
            tCell = document.createElement('td');
            tCell.setAttribute('border', '2');
            tCell.setAttribute('style', 'text-align: right; font-size: 12px');
            t11 = document.createElement('table');
            t11.appendChild(tRow);
            tRow.appendChild(tCell);


            // table 1 x 3 (one row with three cells)
            t13 = document.createElement('table');
            thead = document.createElement('thead');
            tbody = document.createElement('tbody');
            tfoot = document.createElement('tfoot');
            t13.appendChild(thead);
            t13.appendChild(tfoot);
            t13.appendChild(tbody);

            // first row
            tRow = document.createElement('tr');
            tbody.appendChild(tRow);
            tRow.setAttribute('width', '200');
            tRow.setAttribute('style', 'uniqueElem: true');
            // first cell
            tCell = document.createElement('td');
            tCell.setAttribute('border', '2');
            tCell.setAttribute('style', 'text-align: right; font-size: 12px');
            tCell.appendChild(document.createTextNode('cell 1.1'));
            tRow.appendChild(tCell);
            // second cell
            tCell = document.createElement('td');
            tCell.setAttribute('width', '150');
            tCell.setAttribute('style', 'text-align: center; font-size: 12px');
            tCell.appendChild(document.createTextNode('cell 1.2'));
            tRow.appendChild(tCell);
            // third cell
            tCell = document.createElement('td');
            tCell.setAttribute('width', '20');
            tCell.setAttribute('style', 'text-align: justify; font-size: 11px');
            tCell.appendChild(document.createTextNode('cell 1.3'));
            tRow.appendChild(tCell);

            // table 2 x 3 (two rows and with three cells each, caption, header, footer)
            t23 = document.createElement('table');

            // first row
            tRow = document.createElement('tr');
            t23.appendChild(tRow);
            tRow.setAttribute('width', '200');
            tRow.setAttribute('style', 'uniqueElem: true');
            // first cell
            tCell = document.createElement('td');
            tCell.setAttribute('border', '2');
            tCell.setAttribute('style', 'text-align: right; font-size: 12px');
            tCell.appendChild(document.createTextNode('cell 1.1'));
            tRow.appendChild(tCell);
            // second cell
            tCell = document.createElement('td');
            tCell.setAttribute('width', '150');
            tCell.setAttribute('style', 'text-align: center; font-size: 12px');
            tCell.appendChild(document.createTextNode('cell 1.2'));
            tRow.appendChild(tCell);
            // third cell
            tCell = document.createElement('td');
            tCell.setAttribute('width', '20');
            tCell.setAttribute('style', 'text-align: justify; font-size: 11px');
            tCell.appendChild(document.createTextNode('cell 1.3'));
            tRow.appendChild(tCell);

            // second row
            tRow = document.createElement('tr');
            t23.appendChild(tRow);
            tRow.setAttribute('width', '220');
            tRow.setAttribute('style', 'uniqueElem: true');
            // first cell
            tCell = document.createElement('td');
            tCell.setAttribute('class', 'second-row');
            tCell.setAttribute('style', 'text-align: right; font-size: 15px');
            tCell.appendChild(document.createTextNode('cell 2.1'));
            tRow.appendChild(tCell);
            // second cell
            tCell = document.createElement('td');
            tCell.setAttribute('width', '350');
            tCell.setAttribute('style', 'text-align: center; font-size: 12px');
            tCell.appendChild(document.createTextNode('cell 2.2'));
            tRow.appendChild(tCell);
            // third cell
            tCell = document.createElement('td');
            tCell.setAttribute('width', '50');
            tCell.setAttribute('style', 'text-align: justify; font-size: 9px');
            tCell.appendChild(document.createTextNode('cell 2.3'));
            tRow.appendChild(tCell);
            // setting header, footer and caption
            thead = document.createElement('thead');
            thead.appendChild(document.createTextNode('table header'));
            tfoot = document.createElement('tfoot');
            tfoot.appendChild(document.createTextNode('table footer'));
            capt = document.createElement('caption');
            capt.appendChild(document.createTextNode('table caption'));
            t23.appendChild(thead);
            t23.appendChild(tfoot);
            t23.appendChild(capt);
        });

        it('loads empty table', function(){
            table.load(t00);
            expect(table.length()).toBe(0);
            expect(table.getProperty('class')).toBe('highest');
            expect(table.getStyleProperty('width')).toBe('80%');
            expect(table.getStyleProperty('color')).toBe('blue');
        });

        it('loads a table with single row and no cells', function(){
            table.load(t10);
            expect(table.rowNum()).toBe(1);
            var row = table.getBody()[0];
            expect(row instanceof Row).toBe(true);
            expect(row.length()).toBe(0);
            expect(row.getProperty('data')).toBe('table-row');
            expect(row.getProperty('id')).toBe('#uniqueElem');
        });

        it('loads a table with single row and three cells', function(){
            table.load(t13);
            expect(table.rowNum()).toBe(1);
            expect(table.colNum()).toBe(3);
            var row = table.getRow(0);
            expect(row instanceof Row).toBe(true);
            expect(row.length()).toBe(3);

            expect(row.getElem(0) instanceof Cell).toBe(true);
            expect(row.getElem(1) instanceof Cell).toBe(true);
            expect(row.getElem(2) instanceof Cell).toBe(true);

            expect(row.getElem(0).getFirst().toHtml()).toBe('cell 1.1');
            expect(row.getElem(1).getFirst().toHtml()).toBe('cell 1.2');
            expect(row.getElem(2).getFirst().toHtml()).toBe('cell 1.3');
        });

        it('loads table header', function(){
            var thead = t13.getElementsByTagName('thead')[0];
            thead.appendChild(document.createTextNode('table header'));
            table.load(t13);
            expect(table.getHeader().length()).toBe(1);
            expect(table.getHeader().getFirst().toHtml()).toBe('table header');
        });

        it('loads table footer', function(){
            var tfoot = t13.getElementsByTagName('tfoot')[0];
            tfoot.appendChild(document.createTextNode('table footer'));
            table.load(t13);
            expect(table.getFooter().length()).toBe(1);
            expect(table.getFooter().getFirst().toHtml()).toBe('table footer');
        });

        it('loads table caption', function(){
            table.load(t10);
            expect(table.getCaption().length()).toBe(1);
            expect(table.getCaption().getFirst().toHtml()).toBe('table caption');
        });


    });

    describe('Inserting rows and columns into table', function(){
        it('throws an error if no arguments are given', function(){
            expect(function(){
                return table.makeShape();
            }).toThrow(new Error('Number of rows and columns are missing.'));
        });

        it('throws an error if second argument is missing', function(){
            expect(function(){
                return table.makeShape(3);
            }).toThrow(new Error('Number of cells is missing.'));
        });

        it('throws an error if first argument is negative', function(){
            expect(function(){
                return table.makeShape(-4, 3);
            }).toThrow(new Error('Number of rows must be positive integer.'));
        });

        it('throws an error if first argument is zero', function(){
            expect(function(){
                return table.makeShape(0, 3);
            }).toThrow(new Error('Number of rows must be positive integer.'));
        });

        it('throws an error if first argument is not integer', function(){
            expect(function(){
                return table.makeShape(9.4, 7);
            }).toThrow(new Error('Number of rows must be positive integer.'));
        });

        it('throws an error if second argument is negative', function(){
            expect(function(){
                return table.makeShape(2, -3);
            }).toThrow(new Error('Number of cells must be positive integer.'));
        });

        it('throws an error if second argument is not integer', function(){
            expect(function(){
                return table.makeShape(9, 4.3);
            }).toThrow(new Error('Number of cells must be positive integer.'));
        });

        it('throws an error if second argument is not integer', function(){
            expect(function(){
                return table.makeShape(9, 4.3);
            }).toThrow(new Error('Number of cells must be positive integer.'));
        });

        it('throws an error if second argument is zero', function(){
            expect(function(){
                return table.makeShape(4, 0);
            }).toThrow(new Error('Number of cells must be positive integer.'));
        });

        it('inserts 1 row and 1 column', function(){
            table.makeShape(1, 1);
            expect(table.rowNum()).toBe(1);
            expect(table.colNum()).toBe(1);
        });

        it('inserts 4 row1 and 1 column', function(){
            table.makeShape(4, 1);
            expect(table.rowNum()).toBe(4);
            expect(table.colNum()).toBe(1);
        });

        it('inserts 1 row and 5 column', function(){
            table.makeShape(1, 5);
            expect(table.rowNum()).toBe(1);
            expect(table.colNum()).toBe(5);
        });

        it('inserts 5 row and 6 column', function(){
            table.makeShape(5, 6);
            expect(table.rowNum()).toBe(5);
            expect(table.colNum()).toBe(6);
        });

        it('inserts square table with 4 row and 4 column', function(){
            table.makeShape(4, 4);
            expect(table.rowNum()).toBe(4);
            expect(table.colNum()).toBe(4);
        });
    });

    describe('Formats output as border info object', function(){
        it('calls for getStylePropertyOfBlock method', function(){
           spyOn(table, 'getStylePropertyOfBlock');
           table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
           expect(table.getStylePropertyOfBlock).toHaveBeenCalledWith('name', 'rowRange', 'colRange');
        });

        it('returns empty object if underlying method returns null', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue(null);
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(1);
        });

        it('returns a 3-key object if underlying method returns "1px solid red"', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue("1px solid red");
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(3);
            expect(obj.style).toBe('solid');
            expect(obj.width).toBe('1px');
            expect(obj.color).toBe('red');
        });

        it('returns single-key object if underlying method returns "none"', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue('none');
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(1);
            expect(obj.style).toBe('none');
        });

        it('returns a 3-key object if underlying method returns color as rgb value', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue('5em dashed rgb(1,3,4)');
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(3);
            expect(obj.style).toBe('dashed');
            expect(obj.width).toBe('5em');
            expect(obj.color).toBe('rgb(1,3,4)');
        });

        it('returns a 3-key object if underlying method returns the color as rgb value with extra spaces', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue('5em dashed rgb(1, 3,   4)');
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(3);
            expect(obj.style).toBe('dashed');
            expect(obj.width).toBe('5em');
            expect(obj.color).toBe('rgb(1, 3, 4)');
        });


        it('returns a 3-key object if underlying method returns color as hex value', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue('5.43em dotted #AABBCC');
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(3);
            expect(obj.style).toBe('dotted');
            expect(obj.width).toBe('5.43em');
            expect(obj.color).toBe('#AABBCC');
        });

        it('returns a 3-key object if underlying method outputs has multiple spaces', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue('5em    dashed   blue');
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(3);
            expect(obj.style).toBe('dashed');
            expect(obj.width).toBe('5em');
            expect(obj.color).toBe('blue');
        });

        it('returns a 3-key object if underlying method outputs has trailing spaces', function(){
            spyOn(table, 'getStylePropertyOfBlock').and.returnValue(' 7.3%   dashed   blue ');
            var obj = table.getStylePropertyOfRangeAsBorderInfo('name', 'rowRange', 'colRange');
            expect(Object.keys(obj).length).toBe(3);
            expect(obj.style).toBe('dashed');
            expect(obj.width).toBe('7.3%');
            expect(obj.color).toBe('blue');
        });






    });

});