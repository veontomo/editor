/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, Content, Table, Tag, Cell, Row, List*/

describe('Constructs a Tag object from its html representation', function(){
	var str, tag;
    it('Generates a Tag object', function(){
        str  = '<customtag>inside the first tag</customtag>';
        tag = str.createTagFromHtml();
        expect(tag instanceof Tag).toBe(true);
    });

    it('Generates a Tag object even if a subclass exists', function(){
        str  = '<table><tr><td>inside the first tag</td></tr></table>';
        tag = str.createTagFromHtml();
        expect(tag instanceof Tag).toBe(true);
        expect(tag instanceof Table).toBe(false);
    });


    it('Gets the tag name', function(){
        str  = '<customtag>content</customtag>';
        tag = str.createTagFromHtml();
        expect(tag instanceof Tag).toBe(true);
        expect(tag.name).toBe('customtag');
        expect(tag.length()).toBe(1);
        expect(tag.getElem(0)).toBe('content');
    });

    it('Gets the tag styles', function(){
        str  = '<customTag style="margin:92; modular: yes; on-load: finish"></customTag>';
        tag = str.createTagFromHtml();
        expect(tag.style.margin).toBe(92);
        expect(tag.style.modular).toBe('yes');
        expect(tag.style['on-load']).toBe('finish');
    });

    it('Gets the tag attributes', function(){
        str  = '<customTag margin="92" lesson="modular" finish="no"></customTag>';
        tag = str.createTagFromHtml();
        expect(tag.attr.margin).toBe('92');
        expect(tag.attr.lesson).toBe('modular');
        expect(tag.attr.finish).toBe('no');
    });

    it('Gets the nested tags', function(){
        str  = '<customtag>inside the first tag<nestedtag>inside the nested tag</nestedtag></customtag>';
        tag = str.createTagFromHtml();
        expect(tag.length()).toBe(2);
        expect(tag.getElem(0)).toBe('inside the first tag');
        expect(tag.getElem(1) instanceof Tag).toBe(true);
        expect(tag.getElem(1).name).toBe('nestedtag');
        expect(tag.getElem(1).length()).toBe(1);
        expect(tag.getElem(1).getElem(0)).toBe('inside the nested tag');
    });

    it('Recognizes table as a nested tag', function(){
        str  = '<customtag>inside the first tag<table><tbody><tr><td>inside the nested tag</td></tr></tbody></table></customtag>';
        tag = str.createTagFromHtml();
        expect(tag.length()).toBe(2);
        expect(tag.getElem(0)).toBe('inside the first tag');
        expect(tag.getElem(1) instanceof Table).toBe(true);
        expect(tag.getElem(1).name).toBe('table');
    });
});

xdescribe('Decides whether the html code corresponds to a framed table or not:', function(){
    it('1 x 1 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('1 x 3 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('3 x 1 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell 1 1</td></tr><tr><td>cell 2 1</td></tr><tr><td>cell 3 1</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('3 x 3 table, without frame', function(){
       var tableHtml = '<table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table>';
       expect(tableHtml.isFramedTable()).toBe(false);
    });
    it('1 x 1 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
    it('1 x 3 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
    it('3 x 1 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
    it('3 x 3 framed table', function(){
        var tableHtml = '<table><tbody><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr><tr><td><table><tbody><tr><td>cell 1</td><td>cell 2</td><td>cell 3</td></tr></tbody></table></td></tr></tbody></table>';
        expect(tableHtml.isFramedTable()).toBe(true);
    });
});

describe('Converts html table cell in to Cell object', function(){
    it('gets styles of the cell', function(){
        var cellHtml = '<td style="color: red; width: 1; strange-attr: haha"></td>',
            cell = cellHtml.createCellFromHtml(),
            st = cell.style;
        expect(st.hasOwnProperty('color')).toBe(true);
        expect(st.color).toBe('red');
        expect(st.hasOwnProperty('width')).toBe(true);
        expect(st.width).toBe(1);
        expect(st.hasOwnProperty('strange-attr')).toBe(true);
        expect(st['strange-attr']).toBe('haha');
    });

    it('gets attributes of the cell', function(){
        var cellHtml = '<td color="red" width="1" strange-attr="haha"></td>',
            cell = cellHtml.createCellFromHtml(),
            attr = cell.attr;
        expect(attr.hasOwnProperty('color')).toBe(true);
        expect(attr.color).toBe('red');
        expect(attr.hasOwnProperty('width')).toBe(true);
        expect(attr.width).toBe("1");
        expect(attr.hasOwnProperty('strange-attr')).toBe(true);
        expect(attr['strange-attr']).toBe('haha');
    });

    it('gets both styles and attributes of the cell', function(){
        var cellHtml = '<td underlined="why not" width="98" strange-attr="wierd" style="color: red; width: 1; strange-param: haha"></td>',
            cell = cellHtml.createCellFromHtml(),
            st = cell.style,
            attr = cell.attr;
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

    it('gets the correct content of the cell elements', function(){
        var cellHtml = '<td>cell content</td>',
            cell = cellHtml.createCellFromHtml();
        expect(cell.length()).toBe(1);
        expect(cell.getElem(0)).toBe('cell content');

        cellHtml = '<td><div>a</div><div>b</div></td>';
        cell = cellHtml.createCellFromHtml();
        expect(cell.length()).toBe(2);
        expect(cell.getElem(0).name).toBe('div');
        expect(cell.getElem(0).getElem(0)).toBe('a');
        expect(cell.getElem(1).name).toBe('div');
        expect(cell.getElem(1).getElem(0)).toBe('b');

        cellHtml = '<td><div>a</div>plain text<div>b</div></td>';
        cell = cellHtml.createCellFromHtml();
        expect(cell.length()).toBe(3);
        expect(cell.getElem(0).name).toBe('div');
        expect(cell.getElem(0).getElem(0)).toBe('a');
        expect(cell.getElem(1)).toBe('plain text');
        expect(cell.getElem(2).name).toBe('div');
        expect(cell.getElem(2).getElem(0)).toBe('b');
    });

    it('recognizes a nested table inside a cell', function(){
        var cellHtml = '<td><table><tr><td></td></tr></table></td>',
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
        expect(row.cellNum()).toBe(5);
    });

    it('gets correct number of the cells in empty row', function(){
        var rowHtml = '<tr></tr>',
            row = rowHtml.createRowFromHtml();
        expect(row.cellNum()).toBe(0);
    });
});

describe('Transform html table into an object:', function(){
    it('creates Table object if data-marker attribute is not set', function(){
        var htmlTable = '<table><tbody><tr><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
    });

    it('retrieves styles of the Table object', function(){
        var htmlTable = '<table style="color:red;"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml();
        expect(obj1.getType()).toBe('Table');
        expect(obj1.style.hasOwnProperty('color')).toBe(true);
        expect(obj1.style.color).toBe('red');
    });

    it('retrieves multiple styles of the Table object', function(){
        var htmlTable = '<table style="color:red;border-style:solid"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml(),
            style = obj1.style;
        expect(obj1.getType()).toBe('Table');
        expect(style.hasOwnProperty('color')).toBe(true);
        expect(style.color).toBe('red');
        expect(style.hasOwnProperty('border-style')).toBe(true);
        expect(style['border-style']).toBe('solid');
    });

    it('retrieves attributes of the Table object', function(){
        var htmlTable = '<table style="color:red;" width="30" border="table border"><tbody><tr style="first row style"><td></td><td></td></tr></tbody></table>',
            obj1 = htmlTable.createTableFromHtml(),
            attr = obj1.attr;
        expect(obj1.getType()).toBe('Table');
        expect(attr.hasOwnProperty('width')).toBe(true);
        expect(attr.width).toBe('30');
        expect(attr.hasOwnProperty('border')).toBe(true);
        expect(attr.border).toBe('table border');
    });

    it('retrieves rows', function(){
        var htmlTable = '<table data-marker="table"><tbody><tr><td>row 1 cell 1</td><td>row 1 cell 2</td></tr><tr><td>row 2 cell 1</td><td>row 2 cell 2</td></tr></tbody></table>',
        	obj = htmlTable.createTableFromHtml();
        expect(obj.getType()).toBe('Table');
        expect(obj.rowNum()).toBe(2);


    });

    xit('recognizes framed table with all styles and attributes', function(){
        // a framed table with 2 rows and 3 cells in each row
        var framedTable = '<table cohesion="Retinoid" thermal-modulation="87"\
                                style="embrace: metrics; scenarios: orthogonal">  \
            <tbody>  \
                <tr reflex="low" honor="20" style="double-trouble: no;hierarchy: seamless;"> \
                    <td multimedia="Organic and natural" paradigm="Assimilated 24/7" \
                        style="total: interactive; secured: line; next: generation"> \
                    <table asynchronous="solid" style="digitized: systematic;  synergy: 20"> \
                        <tbody> \
                            <tr style="structure: executive; attitude: oriented" secured="line">  \
                                <td  sharable="explicit"  style="benchmark: 29px;margin: 0px;">Row 1 cell 1</td> \
                                <td  dynamic="Focused"  style="firmware: 13.21">Row 1 cell 2</td> \
                                <td  function="Progressive" moratorium="hybrid" \
                                    style="service-desk: 29px;capacity: 0px;">Row 1 cell 3</td> \
                            </tr> \
                        </tbody> \
                    </table> \
                    </td> \
                </tr> \
                <tr reflex="low" honor="20" style="double-trouble: no;hierarchy: seamless;"> \
                    <td multimedia="Organic and natural" paradigm="Assimilated 24/7" \
                        style="total: interactive; secured: line; next: generation"> \
                    <table asynchronous="solid" style="digitized: systematic;  synergy: 20"> \
                        <tbody> \
                            <tr style="workforce: oriented; width: 235px" focus="group">  \
                                <td  open="secondary"  style="upward: trending;margin: 0px;">Row 2 cell 1</td> \
                                <td  moratorium="dynamic"  style="firmware: composite; protocol: advanced">Row 2 cell 2</td> \
                                <td  complexity="regional" audio="lingual" \
                                    style="Verbarmetabola: false; retiform: enabled;">Row 2 cell 3</td> \
                            </tr> \
                        </tbody> \
                    </table> \
                    </td> \
                </tr> \
            </tbody> \
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
            expect(c11.getElem(0)).toBe('Row 1 cell 1');

            c12 = row1.getElem(1);
            expect(c12.style.firmware).toBe(13.21);
            expect(c12.attr.dynamic).toBe('Focused');
            expect(c12.getElem(0)).toBe('Row 1 cell 2');

            c13 = row1.getElem(2);
            expect(c13.style['service-desk']).toBe(29);
            expect(c13.style.capacity).toBe('0px');
            expect(c13.attr.function).toBe('Progressive');
            expect(c13.attr.moratorium).toBe('hybrid');
            expect(c13.getElem(0)).toBe('Row 1 cell 3');

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
            expect(c21.getElem(0)).toBe('Row 2 cell 1');

            c22 = row2.getElem(1);
            expect(c22.style.firmware).toBe('composite');
            expect(c22.style.protocol).toBe('advanced');
            expect(c22.attr.moratorium).toBe('dynamic');
            expect(c22.getElem(0)).toBe('Row 2 cell 2');


            c23 = row2.getElem(2);
            expect(c23.style.Verbarmetabola).toBe('false');
            expect(c23.style.retiform).toBe('enabled');
            expect(c23.attr.complexity).toBe('regional');
            expect(c23.attr.audio).toBe('lingual');
            expect(c23.getElem(0)).toBe('Row 2 cell 3');
    });
});


describe('Method that converts strings into objects', function(){
	var str, obj;
	it('creates empty Content instance from empty string', function(){
		str = '';
		obj = str.inflate();
		expect(obj instanceof Content).toBe(true);
		expect(obj.length()).toBe(0);
	});

	it('inserts the target string into "elements" property, if there is no tag inside the string', function(){
		str = 'string without tags';
		obj = str.inflate();
		expect(obj instanceof Content).toBe(true);
		expect(obj.length()).toBe(1);
		expect(obj.getElem(0)).toBe('string without tags');
	});

	it('gets the elements present in the string', function(){
		str = 'text<p>inside the paragraph</p>text again';
		obj = str.inflate();
		expect(obj.length()).toBe(3);
		expect(obj.getElem(0)).toBe('text');
		expect(obj.getElem(1) instanceof Tag).toBe(true);
		expect(obj.getElem(1).length()).toBe(1);
		expect(obj.getElem(1).getElem(0)).toBe('inside the paragraph');
		expect(obj.getElem(1).name).toBe('p');


		obj = '<div>inside the<div>nested div inside div</div> paragraph</div><div>another div</div><span>span text</span>'.inflate();
		expect(obj.length()).toBe(3);
		expect(obj.getElem(0).length()).toBe(3);
		expect(obj.getElem(1).length()).toBe(1);
		expect(obj.getElem(2).length()).toBe(1);
	});

	it('gets the correct type of the nested elements', function(){
		str = 'text<div><table><tr><td></td></td></table></div>';
		obj = str.inflate();
		expect(obj instanceof Content).toBe(true);
		expect(obj.length()).toBe(2);
		expect(obj.getElem(0)).toBe('text');
		expect(obj.getElem(1) instanceof Tag).toBe(true);
		expect(obj.getElem(1).name).toBe('div');
		expect(obj.getElem(1).length()).toBe(1);
		expect(obj.getElem(1).getElem(0) instanceof Table).toBe(true);
	});

	it('grasps all elements from the string', function(){
		str = '<table cellpadding="2" cellspacing="5" data-marker="Table" style="border-style: none;margin: 54px;padding: 342px;width: \
	530px;max-width: 92px;min-width: 32px;border-spacing: 10px 9px;">\
	<tbody>\
		<tr data-marker="Row" style="border-style: some-style;margin: 32px;padding: 33px;width: 220px;max-width: 340px;min-width: 554px;">\
			<td data-marker="Cell" style="border-style: cellborder;margin: 2px;width: 49px;max-width: 29px;min-width: 249px;\
			vertical-align: top;color: rgb(0, 2221, 1);padding: 2px 4px 1px 1px;">\
				row 1 cell 1\
			</td>\
			<td data-marker="Cell2" style="margin: 221px;width: 43px;max-width: 349px;min-width: 243px;\
			vertical-align: bottom;color: rgb(21, 0, 6);some-attr: 3px 4px 5px 6px;">\
				row 1 cell 2\
			</td>\
		</tr>\
		<tr data-marker="Row second" style="border-style: 1em solid nice;margin: 3px;padding: 4px;width: 0px;max-width: 432px;min-width: 485px;">\
			<td data-marker="Cell1" style="border-style: true;margin: 3px;width: 965px;max-width: 339px;min-width: 234px;\
			vertical-align: none;color: #FFFKKLL;padding: 1px 2em 3px 33px;">\
				row 2 cell 1\
			</td>\
			<td data-marker="Cell" style="border-style: false;margin: 34px;width: 94px;max-width: 49px;min-width: 9px;\
			vertical-align: no;color: rrd;">\
<ol style="test: true; another-style-value: 100em" power="12watt" length="infinite">\
	<li style="background: none repeat scroll 0% 0% rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); \
	padding: 5px 10px;" attr1="test attribute">\
		la prima voce\
	</li>\
	<li style="background: sunshine; frame: 21px ;\
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
        expect(elem0.style['border-style']).toBe('none');
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
        expect(row0.style['border-style']).toBe('some-style');
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
        expect(cell00.style['border-style']).toBe('cellborder');
        expect(cell00.style.margin).toBe(2);
        expect(cell00.style.width).toBe(49);
        expect(cell00.style['max-width']).toBe(29);
        expect(cell00.style['min-width']).toBe(249);
        expect(cell00.style['vertical-align']).toBe('top');
        expect(cell00.style.color).toBe('rgb(0, 2221, 1)');
        expect(cell00.style.padding).toBe('2px 4px 1px 1px');
        expect(cell00.attr['data-marker']).toBe('Cell');
        expect(cell00.length()).toBe(1);
        expect(cell00.getElem(0).trim()).toBe('row 1 cell 1');
        // row 1 cell 2
        expect(cell01 instanceof Cell).toBe(true);
        expect(cell01.style['border-style']).toBe(undefined);
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

        expect(row1.style['border-style']).toBe('1em solid nice');
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
        expect(cell10.style['border-style']).toBe('true');
        expect(cell10.style.margin).toBe(3);
        expect(cell10.style.width).toBe(965);
        expect(cell10.style['max-width']).toBe(339);
        expect(cell10.style['min-width']).toBe(234);
        expect(cell10.style['vertical-align']).toBe('none');
        expect(cell10.style.color).toBe('#FFFKKLL');
        expect(cell10.style.padding).toBe('1px 2em 3px 33px');
        expect(cell10.attr['data-marker']).toBe('Cell1');
        expect(cell10.length()).toBe(1);
        expect(cell10.getElem(0).trim()).toBe('row 2 cell 1');

        // row 2 cell 2
        expect(cell11 instanceof Cell).toBe(true);
        expect(cell11.style['border-style']).toBe('false');
        expect(cell11.style.margin).toBe(34);
        expect(cell11.style.width).toBe(94);
        expect(cell11.style['max-width']).toBe(49);
        expect(cell11.style['min-width']).toBe(9);
        expect(cell11.style['vertical-align']).toBe('no');
        expect(cell11.style.color).toBe('rrd');
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
        expect(li1.style.background).toBe('none repeat scroll 0% 0% rgb(238, 238, 238)');
        expect(li1.style.border).toBe('1px solid rgb(204, 204, 204)');
        expect(li1.style.padding).toBe('5px 10px');
        expect(li1.attr.attr1).toBe('test attribute');
        expect(li1.length()).toBe(1);
        expect(li1.getElem(0).trim()).toBe('la prima voce');

        expect(li2.style.background).toBe('sunshine');
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