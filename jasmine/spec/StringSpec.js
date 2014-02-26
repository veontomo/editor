/*jslint plusplus: true, white: true */
/*global describe, it, it, expect, spyOn, beforeEach, Content, Table, Tag, Cell, Row, List, ListItem, Link*/

describe('String-related functionality', function(){

    describe('String::createTagFromHtml(): constructs a Tag object from its html representation', function(){
        var str, tag;
        beforeEach(function(){
            str = '<customtag margin="92" lesson="modular" finish="no" id="logo" style="margin:92; modular: yes; on-load: finish">content</customtag>';
            tag = str.createTagFromHtml();
        });

        it('Generates a Tag object from a custom tag', function(){
            expect(tag instanceof Tag).toBe(true);
        });
        it('Populates Tag::name', function(){
            expect(tag.name).toBe('customtag');
        });
        it('Populates Tag::styles', function(){
            expect(tag.style.margin).toBe(92);
            expect(tag.style.modular).toBe('yes');
            expect(tag.style['on-load']).toBe('finish');
        });
        it('Tag::style contains only imposed properties', function(){
            var prop = tag.style,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();
            expect(propNames[0]).toBe('margin');
            expect(propNames[1]).toBe('modular');
            expect(propNames[2]).toBe('on-load');
        });
        it('Populates tag::attr', function(){
            expect(tag.attr.margin).toBe('92');
            expect(tag.attr.lesson).toBe('modular');
            expect(tag.attr.finish).toBe('no');
            expect(tag.attr.id).toBe('logo');
        });
        it('Tag::attr contains only imposed properties', function(){
            var prop = tag.attr,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();
            expect(propNames[0]).toBe('finish');
            expect(propNames[1]).toBe('id');
            expect(propNames[2]).toBe('lesson');
            expect(propNames[3]).toBe('margin');

        });
        it('Recognizes nested tags', function(){
            str  = '<customtag>inside the first tag<nestedtag>inside the nested tag</nestedtag></customtag>';
            tag = str.createTagFromHtml();
            expect(tag.length()).toBe(2);
            expect(tag.getElem(0)).toBe('inside the first tag');
            expect(tag.getElem(1) instanceof Tag).toBe(true);
            expect(tag.getElem(1).name).toBe('nestedtag');
            expect(tag.getElem(1).length()).toBe(1);
            expect(tag.getElem(1).getElem(0)).toBe('inside the nested tag');
        });
    });

    describe('String::createCellFromHtml(): constructs a Cell object from its html representation', function(){
        var cellHtml, cell, st, attr;
        beforeEach(function(){
            cellHtml = '<td style="color: red; width: 1; strange-attr: haha" underlined="why not" width="98">cell</td>';
            cell = cellHtml.createCellFromHtml();
            st = cell.style;
            attr = cell.attr;
        });
        it('Populates Cell::style of the cell', function(){
            expect(st.color).toBe('red');
            expect(st.width).toBe(1);
            expect(st['strange-attr']).toBe('haha');
        });
        it('Cell::style contains only imposed properties', function(){
            var prop = st,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();

            expect(propNames[0]).toBe('color');
            expect(propNames[1]).toBe('strange-attr');
            expect(propNames[2]).toBe('width');
        });

        it('Populates Cell::attr of the cell', function(){
            expect(attr.underlined).toBe('why not');
            expect(attr.width).toBe('98');
        });
        it('Cell::attr contains only imposed properties', function(){
            var prop = attr,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();

            expect(propNames[0]).toBe('underlined');
            expect(propNames[1]).toBe('width');
        });

        it('Cell::content has a string if the target tag contains only one string', function(){
            expect(cell.length()).toBe(1);
            expect(cell.getElem(0)).toBe('cell');
        });
        it('Cell::content contains two objects if the target tag contains two divs', function(){
            cellHtml = '<td><div>a</div><div>b</div></td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.length()).toBe(2);
            expect(cell.getElem(0).name).toBe('div');
            expect(cell.getElem(0).getElem(0)).toBe('a');
            expect(cell.getElem(1).name).toBe('div');
            expect(cell.getElem(1).getElem(0)).toBe('b');
        });

        it('Cell::content has a string and objects, if the target tag contains a string, a div and a custom tag', function(){
            cellHtml = '<td><div>a</div>plain text<customtag>b</customtag></td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.length()).toBe(3);
            expect(cell.getElem(0).name).toBe('div');
            expect(cell.getElem(0).getElem(0)).toBe('a');
            expect(cell.getElem(1)).toBe('plain text');
            expect(cell.getElem(2).name).toBe('customtag');
            expect(cell.getElem(2).getElem(0)).toBe('b');
        });

        it('Cell::content is empty if the target tag contains only white spaces', function(){
            cellHtml = '<td>    </td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.content.elements.length).toBe(0);
        });

        it('Cell::content contains one objects if the target tag contains white spaces before div', function(){
            cellHtml = '<td>    <div>a</div></td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.length()).toBe(1);
            expect(cell.getElem(0).name).toBe('div');
            expect(cell.getElem(0).getElem(0)).toBe('a');
        });



        it('recognizes a nested table inside a cell', function(){
            cellHtml = '<td><table><tr><td></td></tr></table></td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.length()).toBe(1);
            expect(cell.getElem(0).hasOwnProperty('getType')).toBe(true);
            expect(cell.getElem(0).getType()).toBe('Table');

            cellHtml = '<td>text outside<table><tr><td></td></tr></table></td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.length()).toBe(2);
            expect(cell.getElem(0)).toBe('text outside');
            expect(cell.getElem(1).name).toBe('table');

            cellHtml = '<td><div>a</div><div>b</div><table><tr><td></td></tr></table></td>';
            cell = cellHtml.createCellFromHtml();
            expect(cell.content.length()).toBe(3);
            expect(cell.getElem(0).name).toBe('div');
            expect(cell.getElem(0).getElem(0)).toBe('a');
            expect(cell.getElem(1).name).toBe('div');
            expect(cell.getElem(1).getElem(0)).toBe('b');
            expect(cell.getElem(2).name).toBe('table');
        });
    });

    describe('String::createRowFromHtml(): constructs a Row object from its html representation', function(){
        var rowHtml, row, st, attr;
        beforeEach(function(){
            rowHtml = '<tr style="color: red; width: 1; strange-attr: haha" color="red" width="1" strange-attr="haha"><td></td><td></td><td></td><td></td><td></td></tr>';
            row = rowHtml.createRowFromHtml();
            st = row.style;
            attr = row.attr;
        });
        it('Populates Row::style of the row', function(){
            expect(st.color).toBe('red');
            expect(st.width).toBe(1);
            expect(st['strange-attr']).toBe('haha');
        });

        it('Cell::style contains only imposed properties', function(){
            var prop = st,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();
            expect(propNames[0]).toBe('color');
            expect(propNames[1]).toBe('strange-attr');
            expect(propNames[2]).toBe('width');
        });


        it('Populates Row::attr of the row', function(){
            expect(attr.color).toBe('red');
            expect(attr.width).toBe("1");
            expect(attr['strange-attr']).toBe('haha');
        });

        it('Cell::attr contains only imposed properties', function(){
            var prop = attr,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();
            expect(propNames[0]).toBe('color');
            expect(propNames[1]).toBe('strange-attr');
            expect(propNames[2]).toBe('width');
        });

        describe('Row::cellNum(): gets the number of cells in the row', function(){
            // var rowHtml, row;
            it('Row::cellNum(): returns zero for empty row', function(){
                rowHtml = '<tr></tr>';
                row = rowHtml.createRowFromHtml();
                expect(row.content.elements.length).toBe(0);
            });
            it('Row::cellNum(): returns one for a row with one empty cell ', function(){
                rowHtml = '<tr><td></td></tr>';
                row = rowHtml.createRowFromHtml();
                expect(row.content.elements.length).toBe(1);
            });
            it('Row::cellNum(): returns one for a row with one non-empty cell ', function(){
                rowHtml = '<tr><td>text<div>inside div</div></td></tr>';
                row = rowHtml.createRowFromHtml();
                expect(row.content.elements.length).toBe(1);
            });
            it('Row::cellNum(): returns 2 for a row with two empty cells', function(){
                rowHtml = '<tr><td></td><td></td></tr>';
                row = rowHtml.createRowFromHtml();
                expect(row.content.elements.length).toBe(2);
            });
            it('Row::cellNum(): returns 2 for a row with two non-empty cells', function(){
                rowHtml = '<tr><td>hello</td><td><span>ciao!</span></td></tr>';
                row = rowHtml.createRowFromHtml();
                expect(row.content.elements.length).toBe(2);
            });
            it('Row::cellNum(): returns 5 for a row with two non-empty cells', function(){
                rowHtml = '<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>';
                row = rowHtml.createRowFromHtml();
                expect(row.content.elements.length).toBe(5);
            });
        });
    });

    describe('String::createTableFromHtml(): constructs a Table object from its html representation', function(){
        var htmlTable, table, st, attr;
        beforeEach(function(){
             htmlTable = '<table style="color:red;border-style:solid" data-marker="30" border="table border"><tbody><tr><td>row 1 cell 1</td><td>row 1 cell 2</td></tr><tr><td>row 2 cell 1</td><td>row 2 cell 2</td></tr></tbody></table>';
             table = htmlTable.createTableFromHtml();
             st = table.style;
             attr = table.attr;
        });
        it('creates Table object from a string', function(){
            expect(table instanceof Table).toBe(true);
        });

        it('Populates Table::style of the table', function(){
            expect(st.color).toBe('red');
            expect(st['border-style']).toBe('solid');
        });

        it('Table::style contains only imposed properties', function(){
            var prop = st,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();
            expect(propNames[0]).toBe('border-style');
            expect(propNames[1]).toBe('color');
        });


        it('Populates Table::attr of the table', function(){
            expect(attr.border).toBe('table border');
            expect(attr['data-marker']).toBe('30');
        });

        it('Table::attr contains only imposed properties', function(){
            var prop = attr,
                propNames = Object.getOwnPropertyNames(prop).filter(function(el){
                    return (prop[el] && ((typeof prop[el]) !== 'function'));
                }).sort();
            expect(propNames[0]).toBe('border');
            expect(propNames[1]).toBe('data-marker');
        });

        it('Table::content is empty for empty table', function(){
            htmlTable = '<table></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(0);
            htmlTable = '<table><tbody></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(0);
        });

        it('Table::content has one element for 1 x 1 table', function(){
            htmlTable = '<table><tbody><tr><td></td></tr></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(1);
        });

        it('Table::content has one element for 1 x 2 table', function(){
            htmlTable = '<table><tbody><tr><td>cell 1</td><td>cell 2</td></tr></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(1);
        });


        it('Table::content has two elements for 2 x 1 table', function(){
            htmlTable = '<table><tbody><tr><td>cell 1</td></tr><tr><td>cell 2</td></tr></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(2);
        });

        it('Table::content has two elements for 2 x 0 table', function(){
            htmlTable = '<table><tbody><tr></tr><tr></tr></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(2);
        });


        it('Table::content has two elements for 2 x 3 table', function(){
            htmlTable = '<table><tbody><tr><td>cell 1 1</td><td>cell 1 2</td><td>cell 1 3</td></tr>\
                <tr><td>cell 2 1</td><td>cell 2 2</td><td>cell 2 3</td></tr></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(2);
        });

        it('Table::content has three elements for 4 x 1 table', function(){
            htmlTable = '<table><tbody><tr><td>cell 1 1</td></tr>\
                <tr><td>cell 2 1</td></tr>\
                <tr><td>cell 3 1</td></tr>\
                <tr><td>cell 4 1</td></tr></tbody></table>';
            table = htmlTable.createTableFromHtml();
            expect(table.content.elements.length).toBe(4);
        });


        it('recognizes framed table with all styles and attributes', function(){
            // a framed table with 2 rows and 3 cells in each row
            var framedTable = '<table cohesion="Retinoid" thermal-modulation="87" style="embrace: metrics; scenarios: orthogonal">\
            <tbody>\
                <tr reflex="low" honor="20" style="double-trouble: no; hierarchy: seamless">\
                    <td multimedia="Organic and natural" paradigm="Assimilated 24/7" style="total: interactive; secured: line; next: generation">\
                    <table asynchronous="solid" style="digitized: systematic; synergy: 20">\
                        <tbody>\
                            <tr style="structure: executive; attitude: oriented" secured="line">\
                                <td style="benchmark: 29; margin: 0px" sharable="explicit">cell 1 1</td>\
                                <td style="firmware: 13.21" dynamic="Focused">cell 1 2</td>\
                                <td style="service-desk: 29; capacity: 0px" function="Progressive" moratorium="hybrid" >cell 1 3</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                    </td>\
                </tr>\
                <tr reflex="low" honor="20" style="double-trouble: no; hierarchy: seamless">\
                    <td multimedia="Organic and natural" paradigm="Assimilated 24/7" style="total: interactive; secured: line; next: generation">\
                    <table asynchronous="solid" style="digitized: systematic; synergy: 20">\
                        <tbody>\
                            <tr style="workforce: oriented; width: 235px" focus="group">\
                                <td style="upward: trending; margin: 0px" open="secondary">cell 2 1</td>\
                                <td style="firmware: composite; protocol: advanced" moratorium="dynamic">cell 2 2</td>\
                                <td style="Verbarmetabola: false; retiform: enabled" complexity="regional" audio="lingual">cell 2 3</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                    </td>\
                </tr>\
            </tbody>\
        </table>',
            tableObj        = framedTable.createTableFromHtml(),
            tableStyle      = tableObj.style,
            tableAttr       = tableObj.attr,
            bogusRowAttr    = tableObj.bogusRowAttr,
            bogusRowStyle   = tableObj.bogusRowStyle,
            bogusCellAttr   = tableObj.bogusCellAttr,
            bogusCellStyle  = tableObj.bogusCellStyle,
            bogusTableAttr  = tableObj.bogusTableAttr,
            bogusTableStyle = tableObj.bogusTableStyle,
            row1, row1Style, row1Attr, row2, row2Style, row2Attr,
            c11, c12, c13, c21, c22, c23;

            expect(tableObj instanceof Table).toBe(true);

            expect(tableObj.length()).toBe(2);
            expect(tableObj.colNum()).toBe(3);

            expect(tableStyle.embrace).toBe('metrics');
            expect(tableStyle.scenarios).toBe('orthogonal');
            expect(tableAttr.cohesion).toBe('Retinoid');
            expect(tableAttr['thermal-modulation']).toBe('87');

            expect(bogusRowStyle['double-trouble']).toBe('no');
            expect(bogusRowStyle.hierarchy).toBe('seamless');
            expect(bogusRowAttr.reflex).toBe('low');
            expect(bogusRowAttr.honor).toBe('20');

            expect(bogusCellStyle.total).toBe('interactive');
            expect(bogusCellStyle.secured).toBe('line');
            expect(bogusCellStyle.next).toBe('generation');
            expect(bogusCellAttr.multimedia).toBe('Organic and natural');
            expect(bogusCellAttr.paradigm).toBe('Assimilated 24/7');

            expect(bogusTableStyle.digitized).toBe('systematic');
            expect(bogusTableStyle.synergy).toBe(20);
            expect(bogusTableAttr.asynchronous).toBe('solid');

            // row 1:
            row1 = tableObj.getElem(0);
            row1Style = row1.style;
            row1Attr = row1.attr;
            expect(row1Style.structure).toBe('executive');
            expect(row1Style.attitude).toBe('oriented');
            expect(row1Attr.secured).toBe('line');

            c11 = row1.getElem(0);
            expect(c11.style.benchmark).toBe(29);
            expect(c11.style.margin).toBe('0px');
            expect(c11.attr.sharable).toBe('explicit');
            expect(c11.getElem(0)).toBe('cell 1 1');

            c12 = row1.getElem(1);
            expect(c12.style.firmware).toBe(13.21);
            expect(c12.attr.dynamic).toBe('Focused');
            expect(c12.getElem(0)).toBe('cell 1 2');


            c13 = row1.getElem(2);
            expect(c13.style['service-desk']).toBe(29);
            expect(c13.style.capacity).toBe('0px');
            expect(c13.attr.function).toBe('Progressive');
            expect(c13.attr.moratorium).toBe('hybrid');
            expect(c13.getElem(0)).toBe('cell 1 3');

            // row 2:
            row2 = tableObj.getElem(1);
            row2Style = row2.style;
            row2Attr = row2.attr;
            expect(row2Style.workforce).toBe('oriented');
            expect(row2Style.width).toBe(235);
            expect(row2Attr.focus).toBe('group');



            c21 = row2.getElem(0);
            expect(c21.style.upward).toBe('trending');
            expect(c21.style.margin).toBe('0px');
            expect(c21.attr.open).toBe('secondary');
            expect(c21.getElem(0)).toBe('cell 2 1');

            c22 = row2.getElem(1);
            expect(c22.style.firmware).toBe('composite');
            expect(c22.style.protocol).toBe('advanced');
            expect(c22.attr.moratorium).toBe('dynamic');
            expect(c22.getElem(0)).toBe('cell 2 2');


            c23 = row2.getElem(2);
            expect(c23.style.Verbarmetabola).toBe('false');
            expect(c23.style.retiform).toBe('enabled');
            expect(c23.attr.complexity).toBe('regional');
            expect(c23.attr.audio).toBe('lingual');
            expect(c23.getElem(0)).toBe('cell 2 3');
                });
            });

            describe('String::inflate(): creates Content object', function(){
                var str, obj;
                it('creates a Content instance from empty string', function(){
                    str = '';
                    obj = str.inflate();
                    expect(obj instanceof Content).toBe(true);
                });
                it('creates a Content instance from plain-text string', function(){
                    str = 'this is a string without tags';
                    obj = str.inflate();
                    expect(obj instanceof Content).toBe(true);
                });
                it('creates a Content instance from a string with tags', function(){
                    str = 'this is a <i>string</i> with <span>tags</span>';
                    obj = str.inflate();
                    expect(obj instanceof Content).toBe(true);
                });

                it('creates empty Content instance from empty string', function(){
                    str = '';
                    obj = str.inflate();
                    expect(obj.length()).toBe(0);
                });
                it('if the target string a plain-text one, inserts it into "elements" property', function(){
                    str = 'string without tags';
                    obj = str.inflate();
                    expect(obj.getElem(0)).toBe('string without tags');
                });
                it('recognizes elements at the beginning of the string', function(){
                    str = '<customtag>start</customtag> continue';
                    obj = str.inflate();
                    expect(obj.length()).toBe(2);
                    expect(obj.getElem(0) instanceof Tag).toBe(true);
                    expect(obj.getElem(0).name).toBe('customtag');
                    expect(obj.getElem(0).getElem(0)).toBe('start');
                    expect(obj.getElem(1)).toBe('continue');
                });

                it('recognizes elements in the middle of the string', function(){
                    str = 'text<p>inside the paragraph</p>text again';
                    obj = str.inflate();
                    expect(obj.length()).toBe(3);
                    expect(obj.getElem(0)).toBe('text');
                    expect(obj.getElem(1) instanceof Tag).toBe(true);
                    expect(obj.getElem(1).length()).toBe(1);
                    expect(obj.getElem(1).getElem(0)).toBe('inside the paragraph');
                    expect(obj.getElem(1).name).toBe('p');
                });

                it('recognizes elements at the end of the string', function(){
                    str = 'rainbow <arch> over the river</arch>';
                    obj = str.inflate();
                    expect(obj.getElem(0)).toBe('rainbow');
                    expect(obj.getElem(1) instanceof Tag).toBe(true);
                    expect(obj.getElem(1).name).toBe('arch');
                    expect(obj.getElem(1).getElem(0)).toBe(' over the river');
                });

                it('recognizes table inside the target string', function(){
                    str = 'text<div><table><tr><td></td></td></table></div>';
                    obj = str.inflate();
                    expect(obj.getElem(0)).toBe('text');
                    expect(obj.getElem(1) instanceof Tag).toBe(true);
                    expect(obj.getElem(1).name).toBe('div');
                    expect(obj.getElem(1).getElem(0) instanceof Table).toBe(true);
                });

                it('grasps all elements from the string', function(){
                    str = '<table cellpadding="2" cellspacing="5" data-marker="Table" style="border-style: outset;margin: 54px;padding: 342px;width: \
                530px;max-width: 92px;min-width: 32px;border-spacing: 10px 9px;">\
                <tbody>\
                    <tr data-marker="Row" style="border-style: solid;margin: 32px;padding: 33px;width: 220px;max-width: 340px;min-width: 554px;">\
                        <td data-marker="Cell" style="border-style: dotted;margin: 2px;width: 49px;max-width: 29px;min-width: 249px;\
                        vertical-align: top;color: rgb(10, 20, 30);padding: 2px 4px 1px 1px;">\
                            row 1 cell 1\
                        </td>\
                        <td data-marker="Cell2" style="margin: 221px;width: 43px;max-width: 349px;min-width: 243px;\
                        vertical-align: bottom;color: rgb(21, 0, 6);some-attr: 3px 4px 5px 6px;">\
                            row 1 cell 2\
                        </td>\
                    </tr>\
                    <tr data-marker="Row second" style="border-style: groove;margin: 3px;padding: 4px;width: 0px;max-width: 432px;min-width: 485px;">\
                        <td data-marker="Cell1" style="border-style: dashed;margin: 3px;width: 965px;max-width: 339px;min-width: 234px;\
                        vertical-align: middle;color: yellow;padding: 1px 2em 3px 33px;">\
                            row 2 cell 1\
                        </td>\
                        <td data-marker="Cell" style="border-style: double;margin: 34px;width: 94px;max-width: 49px;min-width: 9px;\
                        vertical-align: baseline;color: red;">\
            <ol style="test: true; another-style-value: 100em" power="12watt" length="infinite">\
                <li style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); \
                padding: 5px 10px;" attr1="test attribute">\
                    la prima voce\
                </li>\
                <li style="background: blue; frame: 21px ;\
                funny: 5px 10px;">\
                    la seconda voce\
                </li>\
            </ol>\
            </td>\
            </tbody>\
            </table>\
            <a href="http://test.com" style="text-decoration: underline;font-size: 12px;color: blue;font-weight: normal;\
            padding: 13px;margin: 32px;" visited="maybe">the best image </a>';
                    obj = str.inflate();
                    expect(obj instanceof Content).toBe(true);
                    expect(obj.length()).toBe(2);
                    var elem0 = obj.getElem(0);
                    var elem1 = obj.getElem(1);
                    expect(elem0 instanceof Table).toBe(true);
                    expect(elem0.name).toBe('table');
                    // table attrs
                    expect(elem0.attr.cellpadding).toBe('2');
                    expect(elem0.attr.cellspacing).toBe('5');
                    expect(elem0.attr['data-marker']).toBe('Table');
                    // table styles
                    expect(elem0.style['border-style']).toBe('outset');
                    expect(elem0.style.margin).toBe(54);
                    expect(elem0.style.padding).toBe(342);
                    expect(elem0.style.width).toBe(530);
                    expect(elem0.style['min-width']).toBe(32);
                    expect(elem0.style['max-width']).toBe(92);
                    expect(elem0.style['border-spacing']).toBe('10px 9px');

                    expect(elem0.rowNum()).toBe(2);
                    expect(elem0.colNum()).toBe(2);

                    var row0 = elem0.getElem(0);
                    expect(row0 instanceof Row).toBe(true);

                    expect(row0.style['border-style']).toBe('solid');
                    expect(row0.style.margin).toBe(32);
                    expect(row0.style.padding).toBe(33);
                    expect(row0.style.width).toBe(220);
                    expect(row0.style['max-width']).toBe(340);
                    expect(row0.style['min-width']).toBe(554);
                    expect(row0.attr['data-marker']).toBe('Row');

                    var cell00 = row0.getElem(0),
                        cell01 = row0.getElem(1);
                    // row 1 cell 1
                    expect(cell00 instanceof Cell).toBe(true);
                    expect(cell00.style['border-style']).toBe('dotted');
                    expect(cell00.style.margin).toBe(2);
                    expect(cell00.style.width).toBe(49);
                    expect(cell00.style['max-width']).toBe(29);
                    expect(cell00.style['min-width']).toBe(249);
                    expect(cell00.style['vertical-align']).toBe('top');
                    expect(cell00.style.color).toBe('rgb(10, 20, 30)');
                    expect(cell00.style.padding).toBe('2px 4px 1px 1px');
                    expect(cell00.attr['data-marker']).toBe('Cell');
                    expect(cell00.length()).toBe(1);
                    expect(cell00.getElem(0).trim()).toBe('row 1 cell 1');
                    // row 1 cell 2
                    expect(cell01 instanceof Cell).toBe(true);
                    expect(cell01.style['border-style']).not.toBeDefined();
                    expect(cell01.style.margin).toBe(221);
                    expect(cell01.style.width).toBe(43);
                    expect(cell01.style['max-width']).toBe(349);
                    expect(cell01.style['min-width']).toBe(243);
                    expect(cell01.style['vertical-align']).toBe('bottom');
                    expect(cell01.style.color).toBe('rgb(21, 0, 6)');
                    expect(cell01.style['some-attr']).toBe('3px 4px 5px 6px');
                    expect(cell01.attr['data-marker']).toBe('Cell2');
                    expect(cell01.length()).toBe(1);
                    expect(cell01.getElem(0).trim()).toBe('row 1 cell 2');


                    // row 2
                    var row1 = elem0.getElem(1);

                    expect(row1 instanceof Row).toBe(true);
                    expect(row1.cellNum()).toBe(2);

                    expect(row1.style['border-style']).toBe('groove');
                    expect(row1.style.margin).toBe(3);
                    expect(row1.style.padding).toBe(4);
                    expect(row1.style.width).toBe('0px');
                    expect(row1.style['max-width']).toBe(432);
                    expect(row1.style['min-width']).toBe(485);
                    expect(row1.attr['data-marker']).toBe('Row second');

                    var cell10 = row1.getElem(0),
                        cell11 = row1.getElem(1);
                    // row 2 cell 1
                    expect(cell10 instanceof Cell).toBe(true);
                    expect(cell10.style['border-style']).toBe('dashed');
                    expect(cell10.style.margin).toBe(3);
                    expect(cell10.style.width).toBe(965);
                    expect(cell10.style['max-width']).toBe(339);
                    expect(cell10.style['min-width']).toBe(234);
                    expect(cell10.style['vertical-align']).toBe('middle');
                    expect(cell10.style.color).toBe('yellow');
                    expect(cell10.style.padding).toBe('1px 2em 3px 33px');
                    expect(cell10.attr['data-marker']).toBe('Cell1');
                    expect(cell10.length()).toBe(1);
                    expect(cell10.getElem(0).trim()).toBe('row 2 cell 1');

                    // row 2 cell 2
                    expect(cell11 instanceof Cell).toBe(true);
                    expect(cell11.style['border-style']).toBe('double');
                    expect(cell11.style.margin).toBe(34);
                    expect(cell11.style.width).toBe(94);
                    expect(cell11.style['max-width']).toBe(49);
                    expect(cell11.style['min-width']).toBe(9);
                    expect(cell11.style['vertical-align']).toBe('baseline');
                    expect(cell11.style.color).toBe('red');
                    expect(cell11.attr['data-marker']).toBe('Cell');
                    expect(cell11.length()).toBe(1);
                    expect(cell11.getElem(0) instanceof List).toBe(true);

                    var list = cell11.getElem(0);
                    // style="test: true; another-style-value: 100em" power="12watt" length="infinite"
                    expect(list.style.test).toBe('true');
                    expect(list.style['another-style-value']).toBe(100);
                    expect(list.attr.power).toBe('12watt');
                    expect(list.attr.length).toBe('infinite');

                    expect(list.length()).toBe(2);
                    var li1 = list.getElem(0),
                        li2 = list.getElem(1);
                    expect(li1.style.background).toBe('rgb(238, 238, 238)');
                    expect(li1.style.border).toBe('1px solid rgb(204, 204, 204)');
                    expect(li1.style.padding).toBe('5px 10px');
                    expect(li1.attr.attr1).toBe('test attribute');
                    expect(li1.length()).toBe(1);
                    expect(li1.getElem(0).trim()).toBe('la prima voce');

                    expect(li2.style.background).toBe('blue');
                    expect(li2.style.frame).toBe(21);
                    expect(li2.style.funny).toBe('5px 10px');
                    expect(li2.length()).toBe(1);
                    expect(li2.getElem(0).trim()).toBe('la seconda voce');

                    expect(elem1 instanceof Tag).toBe(true);
                    expect(elem1.name).toBe('a');
                    expect(elem1.style['text-decoration']).toBe('underline');
                    expect(elem1.style['font-size']).toBe(12);
                    expect(elem1.style.color).toBe('blue');
                    expect(elem1.style['font-weight']).toBe('normal');
                    expect(elem1.style.padding).toBe(13);
                    expect(elem1.style.margin).toBe(32);
                    expect(elem1.attr.visited).toBe('maybe');
                });
    });

    describe('String::createListItemFromHtml(): constructs a Table object from its html representation', function(){
        var li, liHtml;
        it('Returns null, if the target string is empty', function(){
            liHtml = '';
            li = liHtml.createListItemFromHtml();
            expect(li).toBe(null);
        });
        it('Returns null, if the target string is not a list item html', function(){
            liHtml = '<tag>not a list item</tag>';
            li = liHtml.createListItemFromHtml();
            expect(li).toBe(null);
        });

        it('Returns null, if the target string is not a list item html', function(){
            liHtml = '<tag>not a list item</tag>';
            li = liHtml.createListItemFromHtml();
            expect(li).toBe(null);
        });
        it('Returns empty ListItem, if the target string is <li></li>', function(){
            liHtml = '<li></li>';
            li = liHtml.createListItemFromHtml();
            expect(li instanceof ListItem).toBe(true);
            expect(li.content.elements.length).toBe(0);
        });

        it('The second list item is ignored', function(){
            liHtml = '<li>first list item content</li><li>second list item content</li>';
            li = liHtml.createListItemFromHtml();
            expect(li.content.elements.length).toBe(1);
            expect(li.getFirst()).toBe('first list item content');
        });
        it('Populates ListItem::style', function(){
            liHtml = '<li style="nice: yes; high: no; max-width: 87px">first list item content</li>';
            li = liHtml.createListItemFromHtml();
            expect(li.style.nice).toBe('yes');
            expect(li.style.high).toBe('no');
            expect(li.style['max-width']).toBe(87);
        });
        it('Populates ListItem::attr', function(){
            liHtml = '<li module="first" class="highlight">first list item content</li>';
            li = liHtml.createListItemFromHtml();
            expect(li.attr.module).toBe('first');
            expect(li.attr.class).toBe('highlight');
        });
        it('Returns instance with two elements in the content, if the target string is a plain text and a custom tag', function(){
            liHtml = '<li>item content <data>this is a data tag</data></li>';
            li = liHtml.createListItemFromHtml();
            expect(li.content.elements.length).toBe(2);
            expect(li.getFirst()).toBe('item content ');
            expect(li.getElem(1).name).toBe('data');
            expect(li.getElem(1).getFirst()).toBe('this is a data tag');
        });
    });

    describe('String::createLinkFromHtml(): constructs a link from its html representation', function(){
        var linkHtml = '<a href="http://www.test.com" title="link descr" style="text-decoration:none">this is a link</a>',
            link = linkHtml.createLinkFromHtml();
        it('creates an instance of Link() class', function(){
            expect(link instanceof Link).toBe(true);
        });
        it('sets attributes of the link', function(){
            expect(link.attr.href).toBe('http://www.test.com');
            expect(link.attr.title).toBe('link descr');
        });

        it('sets styles of the link', function(){
            expect(link.style['text-decoration']).toBe('none');
        });
    });
});