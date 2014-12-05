/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine, Document */
describe('Document class', function() {
    var node, doc;
    beforeEach(function() {
        node = document.createElement('div');
        node.setAttribute('class', 'media');
        node.setAttribute('id', 'bodyId');
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
        node.appendChild(ch1);
        node.appendChild(ch2);
        node.appendChild(document.createTextNode('Some text'));
        ch1.appendChild(ch11);
        doc = new Document(node);
    });
    describe('has a method to clean tags that', function() {
        it('removes "class" attribute inside tags', function() {
            doc.clean(['class']);
            var doc2 = doc.getContent();
            expect(doc2.hasAttribute('class')).toBe(false);
        });
        it('removes "id" attribute inside tags', function() {
            doc.clean([new RegExp(/\bid\b/)]);
            var doc2 = doc.getContent();
            expect(doc2.hasAttribute('id')).toBe(false);
        });
        it('removes "id" attribute and does not remove "width" attribute', function() {
            doc.clean([new RegExp(/\bid/)]);
            var doc2 = doc.getContent();
            var p = doc2.firstChild;
            expect(p.tagName.toLowerCase()).toBe('p');
            expect(p.hasAttribute('id')).toBe(false);
            expect(p.getAttribute('width')).toBe('300px');
        });
        it('removes "class" attribute from nested tags', function() {
            doc.clean([new RegExp(/\bclass\b/)]);
            var doc2 = doc.getContent();
            var img = doc2.firstChild.childNodes.item(1);
            expect(img.hasAttribute('class')).toBe(false);
        });
        it('removes "id" attribute from nested tags', function() {
            doc.clean([new RegExp(/\bid/)]);
            var doc2 = doc.getContent();
            var img = doc2.firstChild.childNodes.item(1);
            expect(img.hasAttribute('id')).toBe(false);
        });
        it('leaves "style" attribute in the nested tags', function() {
            doc.clean([new RegExp(/\bid\b/), new RegExp(/\bclass\b/)]);
            var doc2 = doc.getContent();
            var img = doc2.firstChild.childNodes.item(1);
            expect(img.hasAttribute('style')).toBe(true);
        });
        it('leaves unchanged the content of attribute "style" in the nested tags', function() {
            doc.clean();
            var doc2 = doc.getContent();
            var img = doc2.firstChild.childNodes.item(1);
            expect(img.getAttribute('style')).toBe('width: 100%; color: red;');
        });
    });
    describe('has a method to calculate relative widths that', function() {
        beforeEach(function() {
            node = document.createElement('div');
            node.setAttribute('class', 'media');
            node.setAttribute('id', 'bodyId');
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
            node.appendChild(ch1);
            node.appendChild(ch2);
            node.appendChild(document.createTextNode('Some text'));
            ch1.appendChild(ch11);
            doc = new Document(node);
        });
        it('transforms fixed values into relative', function() {
            var div = document.createElement('div');
            div.setAttribute('style', 'width: 234px;');
            div.setAttribute('width', '321px');
            doc = new Document(div);
            doc.convertTo('elastic');
            // console.log(doc.getContent().outerHTML);
            pending();
        });
        it('transforms fixed values into relative 2', function() {
            doc.convertTo('elastic');
            // console.log(doc.getContent().outerHTML);
            pending();
        });
    });
    describe('has a method to find ascendant that', function() {
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
        beforeEach(function() {
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
            doc = new Document(n00);
        });
        it('throws an error if the scope is set but it does not contain the start node', function() {
            expect(function() {
                doc.findAscendant(n30, function() {}, n22);
            }).toThrow(new Error('Wrong scope!'));
        });
        it('throws an error if the criteria is either string, array, number, object, null or undefined', function() {
            var invalids = ['', 'hi', [],
                [0, 1], 0, -12.3, 234, null
            ];
            invalids.forEach(function(el) {
                expect(function() {
                    doc.findAscendant(n30, el, n10);
                }).toThrow(new Error('Criteria must be a function!'));
            });
        });
        it('returns nothing if the criteria never returns true', function() {
            expect(doc.findAscendant(n30, function() {
                return false;
            }, n10)).not.toBeDefined();
        });
        it('returns start node if it turns the criteria into true', function() {
            expect(doc.findAscendant(n31, function(n) {
                return n === n31;
            }, n10)).toBe(n31);
        });
        it('returns scope node if the criteria becomes true only for it', function() {
            expect(doc.findAscendant(n31, function(n) {
                return n === n00;
            }, n00)).toBe(n00);
        });
        it('returns intermediate node for which the criteria becomes true', function() {
            expect(doc.findAscendant(n31, function(n) {
                return n === n10;
            }, n00)).toBe(n10);
        });
        it('returns nothing if criteria function always throws exceptions', function() {
            expect(doc.findAscendant(n31, function() {
                throw new Error('an error!');
            }, n00)).not.toBeDefined();
        });
        it('returns correct node even if criteria function throws exception on previous calls', function() {
            expect(doc.findAscendant(n31, function(n) {
                if (n === n10) {
                    return true;
                }
                throw new Error('an error!');
            }, n00)).toBe(n10);
        });
    });
	describe('has setter/getter for the document content that', function(){
		it('assignes the content if the argument is a Node instance', function(){
			var n = document.createElement('span');
			doc = new Document();
			doc.setContent(n);
			expect(doc.getContent().isEqualNode(n)).toBe(true);
		});
		it('returns nothing if the content is not set', function(){
			doc = new Document();
			expect(doc.getContent()).not.toBeDefined();
		});

		it('leaves the content unchanged if the setter is given a non-Node instance', function(){
			var currentContent = doc.getContent(),
				invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
			    	function() {return;}, {}, {foo: 23}];
			invalids.forEach(function(invalid){
				doc.setContent(invalid);
				expect(doc.getContent().isEqualNode(currentContent)).toBe(true);
			});
		});
		it('returns not a node but rather its a clone', function(){
			var n = document.createElement('ol');
			doc = new Document();
			doc.setContent(n);
			expect(doc.getContent()).not.toBe(n);
			expect(doc.getContent().isEqualNode(n)).toBe(true);
		});
	});
});