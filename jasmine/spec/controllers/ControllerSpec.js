/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, */

describe ('Base controller class', function(){
	var c;
    beforeEach(function(){
    	c = new Controller();
    });

    describe('Controller', function(){
    	it('sets selection if the argument is not provided', function(){
    		c.setSelection();
    		expect(c.getSelection()).toBe(undefined) ;
    	});

    	it('sets selection to the given argument', function(){
    		var sel = {foo: 'dumb'};
    		c.setSelection(sel);
    		expect(c.getSelection()).toBe(sel) ;
    	});

    });

});


