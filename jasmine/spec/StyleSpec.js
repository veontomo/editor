/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Style, Property */

describe('Style-related functionality', function(){
    var stl;
    beforeEach(function(){
        stl = new Style();
    });
    describe('Style::constructor(): inherits from Property', function(){
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
        it('if the attribute is empty, empty string is returned', function(){
            expect(stl.toString()).toBe('');
        });
        it('if the attributes has only a method, empty string is returned', function(){
            stl.fun = function(){return null;};
            expect(stl.toString()).toBe('');
        });
        it('if the attributes has 2 properties, a string is returned', function(){
            stl.width = 'width';
            stl.new = 10;
            expect(stl.toString()).toBe('width="width" new="10"');
        });

        it('if the attributes has 2 properties and a method, a string is returned', function(){
            stl.width = 20;
            stl['last-author'] = 'A.M.R';
            stl.update = function(foo){return foo;};
            expect(stl.toString()).toBe('width="20" last-author="A.M.R"');
        });
    });

    describe('Style::appendStyle(): appends style', function(){
        it('calls parent method Propery::appendProperty()', function(){
            spyOn(stl, 'appendProperty').andCallFake(function(){return null;});
            stl.appendStyle('styles to append');
            expect(stl.appendProperty).toHaveBeenCalledWith('styles to append');
        });
    });
});


