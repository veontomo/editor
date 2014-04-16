/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Styles, ImageStyles, Properties */

describe('LinkStyles-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new ImageStyles();
    });

    describe('ImageStyles::constructor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = ImageStyles();
            expect(style2 instanceof ImageStyles).toBe(true);
        });
        it('inherits from Styles', function(){
            expect(stl instanceof Styles).toBe(true);
        });

        it('populates properties if they are given as a string', function(){
            stl = new ImageStyles('a: 10; b: yes');
            expect(stl.getProperty('a')).toBe('10');
            expect(stl.getProperty('b')).toBe('yes');
        });

        it('populates properties if they are given as an object', function(){
            stl = new ImageStyles({'a': 10, 'b': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.getProperty('format')).toBe('A4');
            expect(stl.getProperty('a')).toBe(10);
            expect(stl.getProperty('b')).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });

        it('does not override Properties by a default value', function(){
            expect((new ImageStyles()).getProperty('border-style')).toBe('none');
            stl = new ImageStyles('border-style: yes');
            expect(stl.getProperty('border-style')).toBe('yes');
        });

        it('imposes border-style', function(){
            expect(stl.getProperty('border-style')).toBe('none');
        });

        it('imposes width', function(){
            expect(stl.getProperty('width')).toBe(0);
        });
        it('imposes height', function(){
            expect(stl.getProperty('height')).toBe(0);
        });

        it('imposes padding', function(){
            expect(stl.getProperty('padding')).toBe(0);
        });

        it('imposes margin', function(){
            expect(stl.getProperty('margin')).toBe(0);
        });
    });

    describe('ImageStyles::className(): gets the name of the class', function(){
        it('gives LinkStyles', function(){
            expect(stl.className).toBe('ImageStyles');
        });

    });
});


