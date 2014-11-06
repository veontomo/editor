/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine, Document */

describe('Document-related functionality', function(){
	var doc, d;
	beforeEach(function(){
		doc = document.createElement('div');
		doc.setAttribute('class', 'media');
		doc.setAttribute('id', 'bodyId');

		var ch1 = document.createElement('p');
		ch1.setAttribute('style', 'width: 100%; color: red;');
		ch1.setAttribute('marker', 'p');
		ch1.setAttribute('width', '300px');
		ch1.appendChild(document.createTextNode('Text inside a paragraph.'));

		var ch11 = document.createElement('img');
		ch11.setAttribute('style', 'width: 100%; color: red;');
		ch11.setAttribute('width', '200px');
		ch11.setAttribute('alt', 'no image available');
		ch11.setAttribute('id', 'imageId');
		ch11.setAttribute('class', 'big bottom');

		var ch2 = document.createElement('a');
		ch2.setAttribute('style', 'padding: 20em; width: 87%; color: navy; text-decoration: underline;');
		ch2.setAttribute('href', 'http://www.test.com');
		ch2.setAttribute('title', 'link to test');
		ch2.appendChild(document.createTextNode('This is a link.'));

		doc.appendChild(ch1);
		doc.appendChild(ch2);
		doc.appendChild(document.createTextNode('Some text'));
		ch1.appendChild(ch11);
		d = new Document(doc);
	});

	describe('Cleaning document tags from technicalities', function(){
		it('removes "class" attribute inside tags', function(){
			d.clean(['class']);
			var doc2 = d.getContent();
			expect(doc2.hasAttribute('class')).toBe(false);
		});

		it('removes "id" attribute inside tags', function(){
			d.clean([new RegExp(/\bid\b/)]);
			var doc2 = d.getContent();
			expect(doc2.hasAttribute('id')).toBe(false);
		});

		it('removes "id" attribute and does not remove "width" attribute', function(){
			d.clean([new RegExp(/\bid/)]);
			var doc2 = d.getContent();
			var p = doc2.firstChild;
			expect(p.tagName.toLowerCase()).toBe('p');
			expect(p.hasAttribute('id')).toBe(false);
			expect(p.getAttribute('width')).toBe('300px');
		});


		it('removes "class" attribute from nested tags', function(){
			d.clean([new RegExp(/\bclass\b/)]);
			var doc2 = d.getContent();
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.hasAttribute('class')).toBe(false);
		});

		it('removes "id" attribute from nested tags', function(){
			d.clean([new RegExp(/\bid/)]);
			var doc2 = d.getContent();
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.hasAttribute('id')).toBe(false);
		});

		it('leaves "style" attribute in the nested tags', function(){
			d.clean([new RegExp(/\bid\b/), new RegExp(/\bclass\b/)]);
			var doc2 = d.getContent();
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.hasAttribute('style')).toBe(true);
		});

		it('leaves unchanged the content of attribute "style" in the nested tags', function(){
			d.clean();
			var doc2 = d.getContent();
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.getAttribute('style')).toBe('width: 100%; color: red;');
		});
	});

	describe('Calculates relative widths', function(){
		beforeEach(function(){
			doc = document.createElement('div');
			doc.setAttribute('class', 'media');
			doc.setAttribute('id', 'bodyId');

			var ch1 = document.createElement('p');
			ch1.setAttribute('style', 'width: 300px; color: red;');
			ch1.setAttribute('marker', 'p');
			ch1.setAttribute('width', '300px');
			ch1.appendChild(document.createTextNode('Text inside a paragraph.'));

			var ch11 = document.createElement('img');
			ch11.setAttribute('style', 'width: 100%; color: red;');
			ch11.setAttribute('width', '200px');
			ch11.setAttribute('src', 'http://www.image.com/test.jpg');
			ch11.setAttribute('alt', 'no image available');
			ch11.setAttribute('id', 'imageId');
			ch11.setAttribute('class', 'big bottom');

			var ch2 = document.createElement('a');
			ch2.setAttribute('style', 'padding: 20em; width: 87%; color: navy; text-decoration: underline;');
			ch2.setAttribute('href', 'http://www.test.com');
			ch2.setAttribute('title', 'link to test');
			ch2.appendChild(document.createTextNode('This is a link.'));

			doc.appendChild(ch1);
			doc.appendChild(ch2);
			doc.appendChild(document.createTextNode('Some text'));
			ch1.appendChild(ch11);
			d = new Document(doc);
		});



		it('transforms fixed values into relative', function(){
			var div = document.createElement('div');
			div.setAttribute('style', 'width: 234px;');
			div.setAttribute('width', '321px');
			d = new Document(div);
			d.convertTo('elastic');
			// console.log(d.getContent().outerHTML);
			pending();
		});

		it('transforms fixed values into relative 2', function(){
			d.convertTo('elastic');
			// console.log(d.getContent().outerHTML);
			pending();

		});

	});

	describe('Method findAscendant', function(){
        var n00, n10, n11, n20, n21, n22, n23, n30, n31;
		//                    n00
		//         ____________|_________
		//         |                     |
		//        n10                   n11
		//   ______|______               |
		//   |     |      |              |
		//  n20   n21    n22            n23
		//      ___|____
		//      |       |
		//     n30     n31
		//
        beforeEach(function(){
            n00 = document.createElement('div00');
            n10 = document.createElement('div10');
            n11 = document.createElement('div11');
            n20 = document.createElement('div20');
            n21 = document.createElement('div21');
            n22 = document.createElement('div22');
            n23 = document.createElement('div23');
            n30 = document.createElement('div30');
            n31 = document.createElement('div31');
            n00.appendChild(n10);
            n00.appendChild(n11);
            n10.appendChild(n20);
            n10.appendChild(n21);
            n10.appendChild(n22);
            n21.appendChild(n30);
            n21.appendChild(n31);
            n11.appendChild(n23);
            d = new Document(n00);
        });
		it('throws an error if the scope is set but it does not contain the start node', function(){
			expect(function(){
				d.findAscendant(n30, function(){}, n22);
			}).toThrow(new Error('Wrong scope!'));
		});
		it('throws an error if the criteria is either string, array, number, object, null or undefined', function(){
			var invalids = ['', 'hi', [], [0, 1], 0, -12.3, 234, null];
			invalids.forEach(function(el){
				expect(function(){
					d.findAscendant(n30, el, n10);
				}).toThrow(new Error('Criteria must be a function!'));
			});
		});
		it('returns nothing if the criteria never returns true', function(){
			expect(d.findAscendant(n30, function(){return false;}, n10)).not.toBeDefined();
		});

		it('returns start node if it turns the criteria into true', function(){
			expect(d.findAscendant(n31, function(n){return n === n31;}, n10)).toBe(n31);
		});

		it('returns scope node if the criteria becomes true only for it', function(){
			expect(d.findAscendant(n31, function(n){return n === n00;}, n00)).toBe(n00);
		});

		it('returns intermediate node for which the criteria becomes true', function(){
			expect(d.findAscendant(n31, function(n){return n === n10;}, n00)).toBe(n10);
		});



	});

});
