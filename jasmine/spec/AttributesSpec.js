/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Attributes, Property */

describe('Attribute-related functionality', function(){
    var attr;
    beforeEach(function(){
        attr = new Attributes();
    });
    describe('Attribute::constructor(): inherits from Property', function(){
        it('is an instance of Property', function(){
            expect(attr instanceof Property).toBe(true);
        });
        it('populates properties from the argument', function(){
            attr = new Attributes('a: 10; new: yes');
            expect(attr.a).toBe(10);
            expect(attr.new).toBe('yes');
        });
        it('populates properties from the argument', function(){
            attr = new Attributes({'a': 10, 'new': 'no', 'update': function(){return null;}, 'format': 'A4'});
            expect(attr.format).toBe('A4');
            expect(attr.a).toBe(10);
            expect(attr.new).toBe('no');
            expect(attr.hasOwnProperty('update')).toBe(false);
        });
    });
    describe('Attributes::toString(): generates string representation', function(){
        it('if the attribute is empty, empty string is returned', function(){
            expect(attr.toString()).toBe('');
        });
        it('if the attributes has only a method, empty string is returned', function(){
            attr.fun = function(){return null;};
            expect(attr.toString()).toBe('');
        });
        it('if the attributes has 2 properties, a string is returned', function(){
            attr.width = 'width';
            attr.new = 10;
            expect(attr.toString()).toBe('width="width" new="10"');
        });

        it('if the attributes has 2 properties and a method, a string is returned', function(){
            attr.width = 20;
            attr['last-author'] = 'A.M.R';
            attr.update = function(foo){return foo;};
            expect(attr.toString()).toBe('width="20" last-author="A.M.R"');
        });
    });
});


