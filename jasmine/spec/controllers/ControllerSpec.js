/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, */

describe ('Base controller class has', function(){
	var c;
    beforeEach(function(){
    	c = new Controller();
    });

    describe('selection setter/getter methods such that', function(){
    	it('the getter returns nothing if the setter was called with no argument', function(){
    		c.setSelection();
    		expect(c.getSelection()).toBe(undefined) ;
    	});

    	it('the getter returns what was given to the setter', function(){
    		var sel = {foo: 'dumb'};
    		c.setSelection(sel);
    		expect(c.getSelection()).toBe(sel) ;
    	});
    });

    describe('editor content setter/getter such that', function(){
        it('the getter returns nothing if the setter was given non-Node instance', function(){
            var invalids = [null, undefined, '', 'hi', 0, -12.3, 234, [], ['a', 'b'], {}, {1: 2}, function(){return;}];
            invalids.forEach(function(invalid) {
                c.setContent(invalid);
                expect(c.getContent()).not.toBeDefined();
            });
        });

        it('the getter returns an Element instance that was given to the setter', function(){
            var n = document.createElement('div');
            c.setContent(n);
            expect(c.getContent()).toBe(n) ;
        });

        it('the getter returns a Text instance that was given to the setter', function(){
            var n = document.createTextNode('this is a text node');
            c.setContent(n);
            expect(c.getContent()).toBe(n) ;
        });

        it('the getter returns undefined if first the setter was given valid value and then a non-valid one', function(){
            var invalids = [null, undefined, '', 'hi', 0, -12.3, 234, [], ['a', 'b'], {}, {1: 2}, function(){return;}];
            invalids.forEach(function(invalid) {
                c = new Controller();
                var n = document.createElement('div');
                c.setContent(n);
                c.setContent(invalid);
                expect(c.getContent()).not.toBeDefined();
            });
        });
    });

    describe('has a worker setter/getter such that', function(){
        it('the getter returns an argument that has been given to the setter', function(){
            var foo = {};
            c.setWorker(foo);
            expect(c.getWorker()).toBe(foo);
        });
    });

    describe('has an editor adapter setter/getter such that', function(){
        it('the getter returns an argument that has been given to the setter', function(){
            var foo = {};
            c.setEditorAdapter(foo);
            expect(c.getEditorAdapter()).toBe(foo);
        });
    });


});


