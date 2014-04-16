/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Styles, LinkStyles, Properties */

describe('LinkStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new LinkStyles();
    });

    describe('LinkStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = LinkStyles();
            expect(style2 instanceof LinkStyles).toBe(true);
        });

        it('inherits from Styles', function(){
            expect(stl instanceof Styles).toBe(true);
        });
        it('populates properties if they are given as a string', function(){
            stl = new LinkStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });
        it('populates properties if they are given as an object', function(){
            stl = new LinkStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
        it('does not override Properties by a default value', function(){
            expect((new LinkStyles()).getProperty('text-decoration')).toBe('underline');
            stl = new LinkStyles('text-decoration: none');
            expect(stl.getProperty('text-decoration')).toBe('none');
        });
        it('imposes text-decoration', function(){
            expect(stl.getProperty('text-decoration')).toBe('underline');
        });

        it('imposes font-size', function(){
            expect(stl.getProperty('font-size')).toBe(14);
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

    describe('LinkStyles::className(): gets the name of the class', function(){
        it('gives LinkStyles', function(){
            expect(stl.className).toBe('LinkStyles');
        });

    });
});


