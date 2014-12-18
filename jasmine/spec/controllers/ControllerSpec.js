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

    describe('');

});


