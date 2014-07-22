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
		it('removes css classes inside tags', function(){
			var doc2 = Document.clean(doc);
			expect(doc2.hasAttribute('class')).toBe(false);
		});
		it('removes id attributes inside tags', function(){
			var doc2 = Document.clean(doc);
			console.log(doc2.outerHTML);
			expect(doc2.hasAttribute('id')).toBe(false);
		});

	});

});
