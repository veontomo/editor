/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, ConverterSimpleText */

describe ('Converter to plain text format', function(){
	var c;
    beforeEach(function(){
    	c = new ConverterSimpleText();
    });

    describe("Elaborates single node document", function () {
    	it('does not modify text node content', function(){
            var t = document.createTextNode('this is a simple text node');
    		var t2 = c.convert(t);
    		expect(t2.nodeValue).toBe('this is a simple text node');
    	});

        it('converts a link into plain text', function(){
            var link = document.createElement('a');
            link.setAttribute('href', 'www.test.com');
            link.innerHTML = 'this is a link';
            var link2 = c.convert(link);
            expect(link2.nodeValue).toBe('this is a link');
        });


    });


});


