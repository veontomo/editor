/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, TableRowStyles, Styles */

describe('TableRowStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new TableRowStyles();
    });

    describe('TableRowStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = TableRowStyles();
            expect(style2 instanceof TableRowStyles).toBe(true);
        });

        it('inherits from Styles', function(){
            expect(stl instanceof Styles).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new TableRowStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new TableRowStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new TableRowStyles()).getProperty('border-style')).toBe('none');
            stl = new TableRowStyles('border-style: stylish');
            expect(stl.getProperty('border-style')).toBe('stylish');
        });
        it('imposes border-style', function(){
            expect(stl.getProperty('border-style')).toBe('none');
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

    describe('TableRowStyles::className(): gets the name of the class', function(){
        it('gives TableRowStyles', function(){
            expect(stl.className).toBe('TableRowStyles');
        });

    });
});


