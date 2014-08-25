/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, Properties, ConverterFixed, NEWSLETTER */

describe ('Converter to fixed format', function(){
	var c, n;
    beforeEach(function(){
    	c = new ConverterFixed();
    	n = document.createElement('span');
    	spyOn(NEWSLETTER, 'width').and.returnValue("1000px");
    	spyOn(NEWSLETTER, 'fontsize').and.returnValue("10px");
    });

    describe("Elaborates single node", function () {
    	it('adds max-width into styles', function(){
    		n.setAttribute('width', '200');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.hasProperty('max-width')).toBe(true);
    		expect(style.getProperty('max-width')).toBe("200px");
    	});
    	it('adds min-width into styles', function(){
    		n.setAttribute('width', '341');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.hasProperty('min-width')).toBe(true);
    		expect(style.getProperty('min-width')).toBe("341px");
    	});
    	it('leaves width into styles', function(){
    		n.setAttribute('width', '836');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.hasProperty('width')).toBe(true);
    		expect(style.getProperty('width')).toBe("836px");
    	});
    	it('adds min-width into styles', function(){
    		n.setAttribute('width', '341');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.hasProperty('max-width')).toBe(true);
    		expect(style.getProperty('max-width')).toBe("341px");
    	});
        it('adds min-width into styles', function(){
            n.setAttribute('width', '341');
            var n2 = c.convert(n);
            var style = new Properties(n2.getAttribute('style'));
            expect(style.hasProperty('min-width')).toBe(true);
            expect(style.getProperty('min-width')).toBe("341px");
        });
        it('adds margin-left into styles of unordered list', function(){
            n = document.createElement('ul');
            var n2 = c.convert(n);
            var style = new Properties(n2.getAttribute('style'));
            expect(style.hasProperty('margin-left')).toBe(true);
            expect(style.getProperty('margin-left')).toBe("40px");



        });


    });


});


