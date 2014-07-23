/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine */

describe('Document-related functionality', function(){
	var doc;
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
	});

	describe('Cleaning document tags from technicalities', function(){
		it('removes "class" attribute inside tags', function(){
			var doc2 = Document.clean(doc);
			expect(doc2.hasAttribute('class')).toBe(false);
		});

		it('removes "id" attribute inside tags', function(){
			var doc2 = Document.clean(doc);
			expect(doc2.hasAttribute('id')).toBe(false);
		});

		it('removes "class" attribute from nested tags', function(){
			var doc2 = Document.clean(doc);
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.hasAttribute('class')).toBe(false);
		});

		it('removes "id" attribute from nested tags', function(){
			var doc2 = Document.clean(doc);
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.hasAttribute('id')).toBe(false);
		});

		it('leaves "style" attribute in the nested tags', function(){
			var doc2 = Document.clean(doc);
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.hasAttribute('style')).toBe(true);
		});

		it('leaves unchanged the content of attribute "style" in the nested tags', function(){
			var doc2 = Document.clean(doc);
			var img = doc2.firstChild.childNodes.item(1);
			expect(img.getAttribute('style')).toBe('width: 100%; color: red;');
		});
	});

	describe('Calculates relative widths', function(){
		var doc;
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
		});
		it('transforms fixed values into relative', function(){
			var div = document.createElement('div');
			div.setAttribute('style', 'width: 234px;');
			div.setAttribute('width', '321px');
			console.log(Document.importToFluid(div).outerHTML);

		});

		it('transforms fixed values into relative 2', function(){
			console.log(Document.importToFluid(doc).outerHTML);

		});

	});

});
