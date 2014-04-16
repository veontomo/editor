/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, LisItemStyles, Properties */

describe('LisItemStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new ListItemStyles();
    });

    describe('ListItemStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = ListItemStyles();
            expect(style2 instanceof ListItemStyles).toBe(true);
        });

        it('inherits from Styles', function(){
            expect(stl instanceof ListItemStyles).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new ListItemStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new ListItemStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new ListItemStyles()).getProperty('color')).toBe('#000001');
            stl = new ListItemStyles('color: whatever');
            expect(stl.getProperty('color')).toBe('whatever');
        });
        it('imposes color', function(){
            expect(stl.getProperty('color')).toBe('#000001');
        });

        it('imposes font-size', function(){
            expect(stl.getProperty('font-size')).toBe(12);
        });
        it('imposes font-weight', function(){
            expect(stl.getProperty('font-weight')).toBe('normal');
        });

        it('imposes padding', function(){
            expect(stl.getProperty('padding')).toBe(0);
        });

        it('imposes margin', function(){
            expect(stl.getProperty('margin')).toBe(0);
        });

    });

    describe('ListItemStyles::className(): gets the name of the class', function(){
        it('gives ListItemStyles', function(){
            expect(stl.className).toBe('ListItemStyles');
        });

    });
});


