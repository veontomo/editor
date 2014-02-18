/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Style, Property */

describe('Style-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new Style();
    });

    describe('Style::constructor(): inherits from Property', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var style2 = Style();
            expect(style2 instanceof Style).toBe(true);
        });

        it('is an instance of Property', function(){
            expect(stl instanceof Property).toBe(true);
        });
        it('populates properties from the argument', function(){
            stl = new Style('a: 10; new: yes');
            expect(stl.a).toBe(10);
            expect(stl.new).toBe('yes');
        });
        it('populates properties from the argument', function(){
            stl = new Style({'a': 10, 'new': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(stl.format).toBe('A4');
            expect(stl.a).toBe(10);
            expect(stl.new).toBe('no');
            expect(stl.hasOwnProperty('update')).toBe(false);
        });
    });

    describe('Style::toString(): generates string representation', function(){
        it('if the object is empty, empty string is returned', function(){
            expect(stl.toString()).toBe('');
        });
        it('if the object has only a method, empty string is returned', function(){
            stl.fun = function(foo){return foo;};
            expect(stl.toString()).toBe('');
        });
        it('if the object has 2 properties, a string is returned', function(){
            stl.width = 439;
            stl.title = 'Spec';
            expect(stl.toString()).toBe('width: 439px; title: Spec');
        });

        it('if the attributes has 2 properties and a method, a string is returned', function(){
            stl.width = 20;
            stl['last-author'] = 'A.M.R';
            stl.update = function(foo){return foo;};
            expect(stl.toString()).toBe('width: 20px; last-author: A.M.R');
        });
    });

    describe('Style::appendStyle(): appends style', function(){
        it('calls parent method Propery::appendProperty()', function(){
            spyOn(stl, 'appendProperty').andCallFake(function(){return null;});
            stl.appendStyle('styles to append');
            expect(stl.appendProperty).toHaveBeenCalledWith('styles to append');
        });
    });

    describe('Style::setWidth(): sets width, min-width, max-width', function(){
        it('sets width as a number, if the width was not defined before', function(){
            delete stl.width;
            delete stl['min-width'];
            delete stl['max-width'];
            stl.setWidth(97);
            expect(stl.width).toBe(97);
            expect(stl['max-width']).toBe(97);
            expect(stl['min-width']).toBe(97);
        });
        it('sets width as a string, if the width was not defined before', function(){
            delete stl.width;
            delete stl['min-width'];
            delete stl['max-width'];
            stl.setWidth('20px');
            expect(stl.width).toBe('20px');
            expect(stl['max-width']).toBe('20px');
            expect(stl['min-width']).toBe('20px');
        });
        it('overrides width as a number, if the width was defined before', function(){
            stl.width = 'dumb value';
            stl['max-width'] = 1029239.221;
            stl.setWidth(97);
            expect(stl.width).toBe(97);
            expect(stl['max-width']).toBe(97);
            expect(stl['min-width']).toBe(97);
        });
        it('overrides width as a string, if the width was defined before', function(){
            stl.width = 98;
            stl['max-width'] = 'another dumb value';
            stl.setWidth('20px');
            expect(stl.width).toBe('20px');
            expect(stl['max-width']).toBe('20px');
            expect(stl['min-width']).toBe('20px');
        });

    });
});


