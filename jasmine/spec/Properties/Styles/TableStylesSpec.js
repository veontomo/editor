/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, TableStyles */

describe('TableStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new TableStyles();
    });

    describe('TableStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = TableStyles();
            expect(style2 instanceof TableStyles).toBe(true);
        });

        it('inherits from Styles', function(){
            expect(stl instanceof Styles).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new TableStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new TableStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new TableStyles()).getProperty('border-style')).toBe('none');
            stl = new TableStyles('border-style: stylish');
            expect(stl.getProperty('border-style')).toBe('stylish');
        });

    });

    describe('TableStyles::className(): gets the name of the class', function(){
        it('gives TableStyles', function(){
            expect(stl.className).toBe('TableStyles');
        });

    });
});


