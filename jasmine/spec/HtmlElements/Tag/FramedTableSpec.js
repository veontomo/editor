/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, FramedTable, Table, Styles, Attributes, Tag */

describe('Table-related functionality:', function(){
    var ft;
    beforeEach(function(){
        ft = new FramedTable();
    });

    describe('inherits from Table class', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var table2 = FramedTable();
            expect(table2 instanceof FramedTable).toBe(true);
        });

        it('is an instance of FramedTable class', function(){
            expect(ft instanceof FramedTable).toBe(true);
        });

        it('is an instance of Table class as well', function(){
            expect(ft instanceof Tag).toBe(true);
        });

        it('has className property equal to "FramedTable"', function(){
            expect(ft.getName()).toBe('FramedTable');
        });

        it('has tag property equal to "table"', function(){
            expect(ft.getTag()).toBe('table');
        });
    });

    describe('Phantom cell attributes setter/getter', function(){
        it('returns instance of Styles class', function(){
            expect(ft.getPhantomCellStyles() instanceof Styles).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            ft.setPhantomCellStyles('level: 1em; home: big');
            var stl = ft.getPhantomCellStyles();
            expect(stl.getProperty('level')).toBe('1em');
            expect(stl.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            ft.setPhantomCellStyles({level: 4.6, sky: 'blue'});
            var stl = ft.getPhantomCellStyles();
            expect(stl.getProperty('level')).toBe(4.6);
            expect(stl.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Styles instance', function(){
            var seed = new Styles();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            ft.setPhantomCellStyles(seed);
            var stl = ft.getPhantomCellStyles();
            expect(stl.getProperty('a')).toBe('high');
            expect(stl.getProperty('b')).toBe('low');
            expect(stl.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom row attributes setter/getter', function(){
        it('returns instance of Styles class', function(){
            expect(ft.getPhantomRowStyles() instanceof Styles).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            ft.setPhantomRowStyles('new: 1em; home: big');
            var stl = ft.getPhantomRowStyles();
            expect(stl.getProperty('new')).toBe('1em');
            expect(stl.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            ft.setPhantomRowStyles({level: 0.23, sky: 'blue'});
            var stl = ft.getPhantomRowStyles();
            expect(stl.getProperty('level')).toBe(0.23);
            expect(stl.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Styles instance', function(){
            var seed = new Styles();
            seed.setProperty('a', 'high');
            seed.setProperty('x', 4);
            seed.setProperty('z', 100.1);
            ft.setPhantomRowStyles(seed);
            var stl = ft.getPhantomRowStyles();
            expect(stl.getProperty('a')).toBe('high');
            expect(stl.getProperty('x')).toBe(4);
            expect(stl.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom cell attributes setter/getter', function(){
        it('returns instance of Styles class', function(){
            expect(ft.getPhantomTableStyles() instanceof Styles).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            ft.setPhantomTableStyles('level: 1em; home: big');
            var stl = ft.getPhantomTableStyles();
            expect(stl.getProperty('level')).toBe('1em');
            expect(stl.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            ft.setPhantomTableStyles({level: 4.6, sky: 'blue'});
            var stl = ft.getPhantomTableStyles();
            expect(stl.getProperty('level')).toBe(4.6);
            expect(stl.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Styles instance', function(){
            var seed = new Styles();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            ft.setPhantomTableStyles(seed);
            var stl = ft.getPhantomTableStyles();
            expect(stl.getProperty('a')).toBe('high');
            expect(stl.getProperty('b')).toBe('low');
            expect(stl.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom cell attributes setter/getter', function(){
        it('returns instance of Attributes class', function(){
            expect(ft.getPhantomCellAttributes() instanceof Attributes).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            ft.setPhantomCellAttributes('level: 1em; home: big');
            var attr = ft.getPhantomCellAttributes();
            expect(attr.getProperty('level')).toBe('1em');
            expect(attr.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            ft.setPhantomCellAttributes({level: 4.6, sky: 'blue'});
            var attr = ft.getPhantomCellAttributes();
            expect(attr.getProperty('level')).toBe(4.6);
            expect(attr.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Attributes instance', function(){
            var seed = new Attributes();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            ft.setPhantomCellAttributes(seed);
            var attr = ft.getPhantomCellAttributes();
            expect(attr.getProperty('a')).toBe('high');
            expect(attr.getProperty('b')).toBe('low');
            expect(attr.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom row attributes setter/getter', function(){
        it('returns instance of Attributes class', function(){
            expect(ft.getPhantomRowAttributes() instanceof Attributes).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            ft.setPhantomRowAttributes('new: 1em; home: big');
            var attr = ft.getPhantomRowAttributes();
            expect(attr.getProperty('new')).toBe('1em');
            expect(attr.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            ft.setPhantomRowAttributes({level: 0.23, sky: 'blue'});
            var attr = ft.getPhantomRowAttributes();
            expect(attr.getProperty('level')).toBe(0.23);
            expect(attr.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Attributes instance', function(){
            var seed = new Attributes();
            seed.setProperty('a', 'high');
            seed.setProperty('x', 4);
            seed.setProperty('z', 100.1);
            ft.setPhantomRowAttributes(seed);
            var attr = ft.getPhantomRowAttributes();
            expect(attr.getProperty('a')).toBe('high');
            expect(attr.getProperty('x')).toBe(4);
            expect(attr.getProperty('z')).toBe(100.1);
        });
    });

    describe('Phantom cell attributes setter/getter', function(){
        it('returns instance of Attributes class', function(){
            expect(ft.getPhantomTableAttributes() instanceof Attributes).toBe(true);
        });

        it('sets the attributes of the the phantom cell if provided as a string', function(){
            ft.setPhantomTableAttributes('level: 1em; home: big');
            var attr = ft.getPhantomTableAttributes();
            expect(attr.getProperty('level')).toBe('1em');
            expect(attr.getProperty('home')).toBe('big');
        });

        it('sets the attributes of the the phantom cell if provided as a general object', function(){
            ft.setPhantomTableAttributes({level: 4.6, sky: 'blue'});
            var attr = ft.getPhantomTableAttributes();
            expect(attr.getProperty('level')).toBe(4.6);
            expect(attr.getProperty('sky')).toBe('blue');
        });

        it('sets the attributes of the the phantom cell if provided as a Attributes instance', function(){
            var seed = new Attributes();
            seed.setProperty('a', 'high');
            seed.setProperty('b', 'low');
            seed.setProperty('z', 100.1);
            ft.setPhantomTableAttributes(seed);
            var attr = ft.getPhantomTableAttributes();
            expect(attr.getProperty('a')).toBe('high');
            expect(attr.getProperty('b')).toBe('low');
            expect(attr.getProperty('z')).toBe(100.1);
        });
    });

    describe('Creates html representation', function(){
        it('generates string', function(){
            var phTableAttrs = new Attributes(),
                phTableStyles = new Styles(),
                phCellAttrs = new Attributes(),
                phCellStyles = new Styles(),
                phRowAttrs = new Attributes(),
                phRowStyles = new Styles(),
                attrs = new Attributes(),
                stls = new Styles(),
                t1 = new Tag(),
                t2 = new Tag(),
                t3 = new Tag();
            spyOn(ft, 'getPhantomTableAttributes').andCallFake(function(){return phTableAttrs;});
            spyOn(ft, 'getPhantomTableStyles').andCallFake(function(){return phTableStyles;});
            spyOn(ft, 'getPhantomCellAttributes').andCallFake(function(){return phCellAttrs;});
            spyOn(ft, 'getPhantomCellStyles').andCallFake(function(){return phCellStyles;});
            spyOn(ft, 'getPhantomRowAttributes').andCallFake(function(){return phRowAttrs;});
            spyOn(ft, 'getPhantomRowStyles').andCallFake(function(){return phRowStyles;});
            spyOn(ft, 'getStyles').andCallFake(function(){return stls;});
            spyOn(ft, 'getAttributes').andCallFake(function(){return attrs;});

            ft.setElements([t1, t2, t3]);

            spyOn(t1, 'toHtml').andCallFake(function(){return 't1 string';});
            spyOn(t2, 'toHtml').andCallFake(function(){return 't2 string';});
            spyOn(t3, 'toHtml').andCallFake(function(){return 't3 string';});
            spyOn(stls, 'toString').andCallFake(function(){return '"table styles"';});
            spyOn(attrs, 'toString').andCallFake(function(){return '"table attributes"';});
            spyOn(phTableAttrs, 'toString').andCallFake(function(){return '"ph-table-attrs"';});
            spyOn(phTableStyles, 'toString').andCallFake(function(){return '"ph-table-styles"';});
            spyOn(phRowAttrs, 'toString').andCallFake(function(){return '"ph-row-attrs"';});
            spyOn(phRowStyles, 'toString').andCallFake(function(){return '"ph-row-styles"';});
            spyOn(phCellAttrs, 'toString').andCallFake(function(){return  '"ph-cell-attrs"';});
            spyOn(phCellStyles, 'toString').andCallFake(function(){return '"ph-cell-styles"';});


            var html = ft.toHtml();
            expect(html).toBe('<table "table attributes" "table styles">\
<tr "ph-row-attrs" "ph-row-styles"><td "ph-cell-attrs" "ph-cell-styles">\
<table "ph-table-attrs" "ph-table-styles">t1 string</table>\
</td></tr>\
<tr "ph-row-attrs" "ph-row-styles"><td "ph-cell-attrs" "ph-cell-styles">\
<table "ph-table-attrs" "ph-table-styles">t2 string</table>\
</td></tr>\
<tr "ph-row-attrs" "ph-row-styles"><td "ph-cell-attrs" "ph-cell-styles">\
<table "ph-table-attrs" "ph-table-styles">t3 string</table>\
</td></tr>\
</table>');
        });
    });


});