/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, Content, Table, Tag*/

describe('generates unique id for the target string', function(){
	it('if the target string is a plain text', function(){
		var str = 'Pink shore, serene breeze. The flat, upright sparkle shines. Lost moon, velvet spirit.';
		expect(str.generateId().length > 0).toBe(true);
		expect(str.generateId('moon')).toBe('moon');
		expect(str.generateId('shore')).toBe('shore');
	});
	it('if the target string is a valid html text', function(){
		var str = 'Indeed, an <div id="id">incinerated</div> mortician bestows great honor upon a prime\
			minister about the tape recorder. For example, a tomato <span id="id1">indicates that\
			the traffic light</span> is a big fan of a salad dressing of a light bulb. A traffic \
			<p id="id2">light</p> toward a fairy sanitizes a radioactive avocado pit. Furthermore,\
			a demon toward a senator wakes up, and a fire hydrant for a cough syrup goes deep sea\
			fishing with a grand piano.',
			allIds = ['id', 'id1', 'id2'],
			id1 = str.generateId(),
			id2 = str.generateId('id'),
			id3 = str.generateId('id1');

		expect(id1.length > 0).toBe(true);
		expect(allIds.indexOf(id1)).toBe(-1);
		expect(allIds.indexOf(id2)).toBe(-1);
		expect(allIds.indexOf(id3)).toBe(-1);
	});
	it('if the target string is not well formed html text', function(){
		var str = 'Indeed, an <div id="id">incinerated</div> mortician bestows great honor upon a prime\
			minister about the tape recorder. For example, a tomato <span id="id1">NO CLOSING SPAN TAG!\
			indicates that the traffic light is a big fan of a salad dressing of a light bulb. A traffic \
			<p id="id2">light</p> toward a fairy sanitizes a radioactive avocado pit. Furthermore,\
			a demon toward a senator wakes up, and a fire hydrant for a cough syrup goes deep sea\
			fishing with a grand piano.',
			allIds = ['id', 'id1', 'id2'],
			id1 = str.generateId(),
			id2 = str.generateId('id'),
			id3 = str.generateId('id1');

			expect(id1.length > 0).toBe(true);
			expect(allIds.indexOf(id1)).toBe(-1);
			expect(allIds.indexOf(id2)).toBe(-1);
			expect(allIds.indexOf(id3)).toBe(-1);
	});
});

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

describe('Decides whether the html code corresponds to a framed table or not:', function(){
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
    	console.log(JSON.stringify(new Table()));
        var htmlTable = '<table data-marker="table"><tbody><tr><td>row 1 cell 1</td><td>row 1 cell 2</td></tr><tr><td>row 2 cell 1</td><td>row 2 cell 2</td></tr></tbody></table>',
        	obj = htmlTable.createTableFromHtml();
        expect(obj.getType()).toBe('Table');
        expect(obj.rowNum()).toBe(2);


    });

    it('recognizes framed table with all styles and attributes', function(){
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
		str = '<table cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: none;margin: 0px;padding: 0px;width: \
	500px;max-width: 500px;min-width: 500px;border-spacing: 0px 0px;">\
	<tbody>\
		<tr data-marker="Row" style="border-style: none;margin: 0px;padding: 0px;width: 500px;max-width: 500px;min-width: 500px;">\
			<td data-marker="Cell" style="border-style: none;margin: 0px;width: 249px;max-width: 249px;min-width: 249px;\
			vertical-align: top;color: rgb(0, 0, 1);padding: 0px 0px 1px 1px;">\
				cell\
			</td>\
			<td data-marker="Cell" style="border-style: none;margin: 0px;width: 249px;max-width: 249px;min-width: 249px;\
			vertical-align: top;color: rgb(0, 0, 1);padding: 0px 1px 1px 0px;">\
				cell\
			</td>\
		</tr>\
		<tr data-marker="Row" style="border-style: none;margin: 0px;padding: 0px;width: 500px;max-width: 500px;min-width: 500px;">\
			<td data-marker="Cell" style="border-style: none;margin: 0px;width: 249px;max-width: 249px;min-width: 249px;\
			vertical-align: top;color: rgb(0, 0, 1);padding: 0px 0px 1px 1px;">\
				cell\
			</td>\
			<td data-marker="Cell" style="border-style: none;margin: 0px;width: 249px;max-width: 249px;min-width: 249px;\
			vertical-align: top;color: rgb(0, 0, 1);padding: 0px 1px 1px 0px;">\
			<ol>\
				<li style="background: none repeat scroll 0% 0% rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); \
				padding: 5px 10px;">\
					la prima voce\
				</li>\
				<li style="background: none repeat scroll 0% 0% rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204);\
				padding: 5px 10px;">\
					la seconda voce\
				</li>\
			</ol>\
			</td>\
		</tr>\
		<tr style="">\
			<td data-marker="Cell" style="border-style: none;margin: 0px;width: 249px;max-width: 249px;\
			min-width: 249px;vertical-align: top;color: rgb(0, 0, 1);padding: 0px 0px 1px 1px;">\
				nuova riga\
			</td>\
			<td data-marker="Cell" style="border-style: none;margin: 0px;width: 249px;max-width: 249px;min-width: 249px;\
				vertical-align: top;color: rgb(0, 0, 1);padding: 0px 1px 1px 0px;">	\
				modulation\
			</td>\
		</tr>\
	</tbody>\
</table>\
<a href="http://test.com" style="text-decoration: underline;font-size: 12px;color: blue;font-weight: normal;\
padding: 0px;margin: 0px;">the best image </a>';
	obj = str.inflate();
	expect(obj instanceof Content).toBe(true);
	expect(obj.length()).toBe(2);
	expect(obj.getElem(0) instanceof Table).toBe(true);
	expect(obj.getElem(0).name).toBe('table');
	expect(obj.getElem(1) instanceof Tag).toBe(true);
	expect(obj.getElem(1).name).toBe('a');

	});


});