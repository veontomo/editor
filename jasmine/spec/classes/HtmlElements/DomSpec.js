/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Dom, Node */

describe('Dom-specific functionality', function(){
    var dom;
    beforeEach(function(){
        dom = new Dom();
    });


    xdescribe('Content', function(){
        it('is set to Node', function(){
            var el = document.createElement('span');
            dom.setContent(el);
            expect(dom.getContent()).toBe(el);
        });

        it('is not set if argument is a string, array, number, non-Node object or function', function(){
            var invalids = ['a string', '', [], [1, 2, 3], 0, -3, 2.45, {}, {foo: 'bar'}, function(a){return a;}];
            invalids.forEach(function(invalid){
                var d = new Dom();
                expect(d.getContent()).toBe(undefined);
                dom.setContent(invalid);
                expect(d.getContent()).toBe(undefined);
            });
        });

    });


















});