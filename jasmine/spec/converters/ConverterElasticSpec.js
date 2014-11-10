/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, ConverterElastic, Properties, NEWSLETTER */

xdescribe ('Converter to elastic format', function(){
	var c, n;
    beforeEach(function(){
    	c = new ConverterElastic();
    	n = document.createElement('span');
    	spyOn(NEWSLETTER, 'width').and.returnValue("1000px");
    	spyOn(NEWSLETTER, 'fontsize').and.returnValue("10px");
    });

    describe('Elaborates node without children', function () {
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
    		n.setAttribute('style', 'width: 12pt');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.getProperty('width')).toBe('12pt');
    	});

    	it('converts font size defined as style', function(){
    		n.setAttribute('style', 'font-size: 12px');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.getProperty('font-size')).toBe('120%');
    	});

    	it('eliminates max-width', function(){
    		n = document.createElement('td');
    		n.setAttribute('style', 'border-style: none; width: 249px; max-width: 249px; min-width: 249px; margin: 0px; vertical-align: top; color: #000001; text-align: justify; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px;');
    		n.setAttribute('width', '249');
    		var n2 = c.convert(n);
    		var style = new Properties(n2.getAttribute('style'));
    		expect(style.hasProperty('max-width')).toBe(false);
    		expect(style.hasProperty('min-width')).toBe(false);
    		expect(style.getProperty('width')).toBe('24.9%');
    	});

        it('elaborates padding attribute if parent node has width attribute', function(){
            n.setAttribute('style', 'padding: 12px');
            n.setAttribute('width', '100');
            var nParent = document.createElement('div');
            nParent.setAttribute('width', '120px');
            nParent.appendChild(n);
            var n2 = c.convert(n, nParent);
            // console.log(nParent.outerHTML);
            // console.log(n2.outerHTML);
            var style = new Properties(n2.getAttribute('style'));
            expect(style.getProperty('padding')).toBe('10%');
        });

        it('elaborates padding attribute if parent node has width style', function(){
            n.setAttribute('style', 'padding: 12px');
            n.setAttribute('width', '100');
            var nParent = document.createElement('div');
            nParent.setAttribute('style', 'width: 120px;');
            nParent.appendChild(n);
            var n2 = c.convert(n, nParent);
            var style = new Properties(n2.getAttribute('style'));
            expect(style.getProperty('padding')).toBe('10%');
        });

        it('elaborates padding attribute if node has no parent', function(){
            n.setAttribute('style', 'padding: 21px');
            n.setAttribute('width', '100px');
            var n2 = c.convert(n);
            var style = new Properties(n2.getAttribute('style'));
            expect(style.getProperty('padding')).toBe('2.1%');
        });


        it('elaborates padding attribute if node has no parent', function(){
            n.setAttribute('style', 'padding: 21px');
            n.setAttribute('width', '100px');
            var n2 = c.convert(n);
            var style = new Properties(n2.getAttribute('style'));
            expect(style.getProperty('padding')).toBe('2.1%');
        });

        it('elaborates padding in ordered list (pending test)', function(){
            n = document.createElement('ol');
            n.setAttribute('style', 'width: 100px; padding: 0px; margin-left: 40px; margin-right: 0px; margin-top: 0px; margin-bottom: 0px;');
            var li1 = document.createElement('li'),
                li2 = document.createElement('li');
            n.appendChild(li1);
            n.appendChild(li2);
            li1.setAttribute('style', 'padding: 10px; margin: 20px; width: 70px');
            li2.setAttribute('style', 'padding: 15px; margin: 25px; width: 70px');
            li1.appendChild(document.createTextNode('list item 1'));
            li2.appendChild(document.createTextNode('list item 2'));

            var n2 = c.convert(n);
            pending();

        });
    });

    describe('Elabotates node with children', function(){
        var child1, child2, child3;
        beforeEach(function(){
            child1 = document.createElement('div');
            child2 = document.createElement('span');
            child3 = document.createElement('a');
            n.setAttribute('width', 100);
            child1.setAttribute('width', 50);
            child2.setAttribute('width', 20);
            child3.setAttribute('width', 30);
            n.appendChild(child1);
            n.appendChild(child2);
            n.appendChild(child3);
        });

        it('preserves the number of child nodes', function(){
            var n2 = c.convert(n);
            expect(n2.childNodes.length).toBe(3);
        });

        it('modifies all children width', function(){
            var n2 = c.convert(n),
                children = n2.childNodes,
                style = new Properties(n2.getAttribute('style')),
                style1 = new Properties(children.item(0).getAttribute('style')),
                style2 = new Properties(children.item(1).getAttribute('style')),
                style3 = new Properties(children.item(2).getAttribute('style'));
            expect(style.getProperty('width')).toBe('10%');   /// because overall default width is 1000px
            expect(style1.getProperty('width')).toBe('50%');
            expect(style2.getProperty('width')).toBe('20%');
            expect(style3.getProperty('width')).toBe('30%');
        });
    });


});


