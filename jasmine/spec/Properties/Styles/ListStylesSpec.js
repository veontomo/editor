/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, ListStyles, Properties */

describe('ListStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new ListStyles();
    });

    describe('ListStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = ListStyles();
            expect(style2 instanceof ListStyles).toBe(true);
        });

        it('inherits from Styles', function(){
            expect(stl instanceof Styles).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new ListStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new ListStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new ListStyles()).getProperty('margin-left')).toBe(40);
            stl = new ListStyles('margin-left: 102');
            expect(stl.getProperty('margin-left')).toBe('102');
        });

    });

    describe('ListStyles::className(): gets the name of the class', function(){
        it('gives ListStyles', function(){
            expect(stl.className).toBe('ListStyles');
        });

    });
});


