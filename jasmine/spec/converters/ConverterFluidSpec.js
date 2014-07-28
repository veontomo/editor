/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, ConverterFluid */

describe ('Converter to fluid format', function(){
	var c, n;
    beforeEach(function(){
    	c = new ConverterFluid();
    	n = document.createElement('span');
    	spyOn(NEWSLETTER, 'width').andCallFake(function(){return "1000px";});
    	spyOn(NEWSLETTER, 'fontsize').andCallFake(function(){return "10px";});
    });

    describe("Elaborates single node", function () {
    	it('converts width attribute if it is given without unit of measurement', function(){
    		n.setAttribute('width', '200');
    		var n2 = c.convert(n);
    		expect(n2.getAttribute('width')).toBe('20%');
    	});

    	it('converts width attribute if it is given with unit of measurement', function(){
    		n.setAttribute('width', '100px');
    		var n2 = c.convert(n);
    		expect(n2.getAttribute('width')).toBe('10%');
    	});

    	it('does not change width attribute if its unit of measurement is neither px nor empty', function(){
    		n.setAttribute('width', '75kg');
    		var n2 = c.convert(n);
    		expect(n2.getAttribute('width')).toBe('75kg');
    	});

    	it('converts width styles', function(){
    		n.setAttribute('style', 'width:20px');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.getProperty('width')).toBe('2%');
    	});

    	it('does not change width style if its unit of measurement is niether px nor empty', function(){
    		n.setAttribute('style', 'width: 12parsec');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.getProperty('width')).toBe('12parsec');
    	});

    	it('converts font size defined as style', function(){
    		n.setAttribute('style', 'font-size: 12px');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.getProperty('font-size')).toBe('120%');
    	});


    });


});


