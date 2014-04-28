/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, LisItemStyles, Properties */

describe('TableCellStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new TableCellStyles();
    });

    describe('ListItemStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = TableCellStyles();
            expect(style2 instanceof TableCellStyles).toBe(true);
        });

        it('inherits from Styles', function(){
            expect(stl instanceof Styles).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new TableCellStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new TableCellStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new TableCellStyles()).getProperty('vertical-align')).toBe('top');
            stl = new TableCellStyles('vertical-align: any');
            expect(stl.getProperty('vertical-align')).toBe('any');
        });

        it('imposes border-style', function(){
            expect(stl.getProperty('border-style')).toBe('none');
        });
        it('imposes vertical-align', function(){
            expect(stl.getProperty('vertical-align')).toBe('top');
        });
        it('imposes color', function(){
            expect(stl.getProperty('color')).toBe('#000001');
        });
        it('imposes widths', function(){
            expect(stl.getProperty('width')).toBe(0);
            expect(stl.getProperty('min-width')).toBe(0);
            expect(stl.getProperty('max-width')).toBe(0);
        });
        it('imposes padding', function(){
            expect(stl.getProperty('padding')).toBe(0);
        });

        it('imposes margin', function(){
            expect(stl.getProperty('margin')).toBe(0);
        });


    });

    describe('TableCellStyles::getName(): gets the name of the class', function(){
        it('gives TableCellStyles', function(){
            expect(stl.getName()).toBe('TableCellStyles');
        });

    });
});


