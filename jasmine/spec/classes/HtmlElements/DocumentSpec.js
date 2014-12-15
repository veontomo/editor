/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine, Document, Text, Properties, Node */
var emptyArrayMatcher = {
  toBeEmptyArray: function(util, customEqualityTesters) {
    return {
      compare: function(actual) {
      	return {'pass': (Array.isArray(actual) && (actual.length === 0))};
      }
    };
  }
};

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

        jasmine.addMatchers(emptyArrayMatcher);
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
    describe('has a method to find ancestor that', function() {
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
                doc.findAncestor(n30, function() {}, n22);
            }).toThrow(new Error('Wrong scope!'));
        });
        it('throws an error if the criteria is either string, array, number, object, null or undefined', function() {
            var invalids = ['', 'hi', [],
                [0, 1], 0, -12.3, 234, null
            ];
            invalids.forEach(function(el) {
                expect(function() {
                    doc.findAncestor(n30, el, n10);
                }).toThrow(new Error('Criteria must be a function!'));
            });
        });
        it('returns nothing if the criteria never returns true', function() {
            expect(doc.findAncestor(n30, function() {
                return false;
            }, n10)).not.toBeDefined();
        });
        it('returns start node if it turns the criteria into true', function() {
            expect(doc.findAncestor(n31, function(n) {
                return n === n31;
            }, n10)).toBe(n31);
        });
        it('returns scope node if the criteria becomes true only for it', function() {
            expect(doc.findAncestor(n31, function(n) {
                return n === n00;
            }, n00)).toBe(n00);
        });
        it('returns intermediate node for which the criteria becomes true', function() {
            expect(doc.findAncestor(n31, function(n) {
                return n === n10;
            }, n00)).toBe(n10);
        });
        it('returns nothing if criteria function always throws exceptions', function() {
            expect(doc.findAncestor(n31, function() {
                throw new Error('an error!');
            }, n00)).not.toBeDefined();
        });
        it('returns correct node even if criteria function throws exception on previous calls', function() {
            expect(doc.findAncestor(n31, function(n) {
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
	describe('has a method to get string representation of a node that', function(){
		it('returns empty string if the argument is not a Node instance', function(){
			var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
			    	function() {return;}, {}, {foo: 23}];
			invalids.forEach(function(invalid){
				expect(doc.nodeToText(invalid)).toBe('');
			});
		});
		it('returns text content of the argument if it is a Text instance', function(){
			var t = document.createTextNode('this is a text node');
			expect(doc.nodeToText(t)).toBe('this is a text node');
		});
		it('returns inner html code of the argument if it is an Element instance', function(){
			var e = document.createElement('span');
			e.innerHTML = 'text inside span';
			expect(doc.nodeToText(e)).toBe('text inside span');
		});
	});

    describe('Getting common parent', function(){
        var n00, n10, n11, n20, n21, n22, n23, n30, n31, m00, m10, m11;
//                    n00                                m00
//         ____________|_________                    _____|____
//         |                     |                   |         |
//        n10                   n11                 m10       m11
//   ______|______               |
//   |     |      |              |
//  n20   n21    n22            n23
//      ___|____
//      |       |
//     n30     n31
//
        beforeEach(function(){
            doc = new Document();
            n00 = document.createElement('div00');
            n10 = document.createElement('div10');
            n11 = document.createElement('div11');
            n20 = document.createElement('div20');
            n21 = document.createElement('div21');
            n22 = document.createElement('div22');
            n23 = document.createElement('div23');
            n30 = document.createElement('div30');
            n31 = document.createElement('div31');
            m00 = document.createElement('div');
            m10 = document.createElement('div');
            m11 = document.createElement('div');
            n00.appendChild(n10);
            n00.appendChild(n11);
            n10.appendChild(n20);
            n10.appendChild(n21);
            n10.appendChild(n22);
            n21.appendChild(n30);
            n21.appendChild(n31);
            n11.appendChild(n23);
            m00.appendChild(m10);
            m00.appendChild(m11);
        });

        it('returns the first argument if it contains the second argument', function(){
            expect(doc.commonAncestor(n10, n31)).toBe(n10);
        });

        it('returns the second argument if it contains the first argument', function(){
            expect(doc.commonAncestor(n23, n00)).toBe(n00);
        });


        it('returns null if the nodes have no common parent', function(){
            expect(doc.commonAncestor(n23, m10)).toBe(null);
        });

        it('returns the common parent if the nodes are siblings of each other', function(){
            expect(doc.commonAncestor(n21, n22)).toBe(n10);
        });

        it('returns the common parent if the first argument is located deeper than the second', function(){
            expect(doc.commonAncestor(n21, n22)).toBe(n10);
        });

        it('returns the common parent if the second argument is located deeper than the first', function(){
            expect(doc.commonAncestor(n30, n23)).toBe(n00);
        });
    });

    describe('Finds proxy node', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31;
//                    e00
//         ____________|_________
//         |                     |
//        e10                   e11
//   ______|______ ________      |
//   |     |      |    |   |     |
//  t20   e21    t22  e23 t24   t25
//      ___|____
//      |       |
//     e30     t31

        beforeEach(function(){
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            t25 = document.createTextNode('text node 2.5');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(t25);
        });

        it('gets proxy of an element node', function(){
            expect(doc.proxy(e21)).toBe(e21);
        });

        it('gets proxy of a text node without siblings', function(){
            expect(doc.proxy(t25)).toBe(e11);
        });

        it('gets proxy of a middle (among its siblings) text node', function(){
            expect(doc.proxy(t22)).toBe(t22);
        });

        it('gets proxy of the first (among its siblings) text node', function(){
            expect(doc.proxy(t20)).toBe(t20);
        });
        it('gets proxy of the last (among its siblings) text node', function(){
            expect(doc.proxy(t24)).toBe(t24);
        });
    });

    describe('Finds mentor node', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31;

//                             e00 (block: wide)
//         ____________________________|_________
//         |                                     |
//        e10                                   e11 (block: narrow)
//   ______|_______________________________      |
//   |     |                      |    |   |     |
//  t20   e21 (block: narrow)    t22  e23 t24   t25
//      ___|_________________
//      |                    |
//     e30 (block: wide)    t31

        beforeEach(function(){
            var stl1 = 'class: media; block: wide;',
                stl2 = 'size: biggest; block: narrow;';
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            t25 = document.createTextNode('text node 2.5');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(t25);
            e00.setAttribute('style', stl1);
            e30.setAttribute('style', stl1);
            e11.setAttribute('style', stl2);
            e21.setAttribute('style', stl2);
        });

        it('returns null if mentor does not exist', function(){
            expect(doc.getMentor('width', e30)).not.toBeDefined();
        });

        it('returns node itself if has the property imposed', function(){
            expect(doc.getMentor('block', e30)).toBe(e30);
        });

        it('returns the parent node if it has the property imposed', function(){
            expect(doc.getMentor('block', e10)).toBe(e00);
        });

        it('returns the parent node of text node if it has the property imposed', function(){
            expect(doc.getMentor('block', t31)).toBe(e21);
        });
    });

    describe('Finds style in the ascendants', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31;

//                             e00 (block: wide)
//         ____________________________|_________
//         |                                     |
//        e10                                   e11 (block: narrow)
//   ______|_______________________________      |
//   |     |                      |    |   |     |
//  t20   e21 (block: narrow)    t22  e23 t24   t25
//      ___|_________________
//      |                    |
//     e30 (block: wide)    t31

        beforeEach(function(){
            var stl1 = 'class: media; padding: 5em;',
                stl2 = 'size: biggest; padding: 31px;';
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            t25 = document.createTextNode('text node 2.5');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(t25);
            e00.setAttribute('style', stl1);
            e30.setAttribute('style', stl1);
            e11.setAttribute('style', stl2);
            e21.setAttribute('style', stl2);
        });

        it('returns the value of the attribute if the element has this property and limit node is set', function(){
            expect(doc.getInheritedStyleProp('padding', e30, e00)).toBe('5em');
        });

        it('returns the value of the attribute if the element has this property and limit node is not set', function(){
            expect(doc.getInheritedStyleProp('padding', e30)).toBe('5em');
        });

        it('returns the node style property if the limit node is equal to the node', function(){
            expect(doc.getInheritedStyleProp('padding', e11, e11)).toBe('31px');
        });

        it('returns null if the node has no style property if the limit node is equal to the node', function(){
            expect(doc.getInheritedStyleProp('padding', e23, e23)).not.toBeDefined();
        });

        it('returns parent node style property which when the parent is the limit node', function(){
            expect(doc.getInheritedStyleProp('padding', t31, e21)).toBe('31px');
        });

        it('returns parent node style property if the limit node is not set', function(){
            expect(doc.getInheritedStyleProp('padding', t31)).toBe('31px');
        });

        it('returns style property of one of the parents if the limit node is not a parent of the start node', function(){
            expect(doc.getInheritedStyleProp('padding', t22, e11)).toBe('5em');
        });

    });


    describe('Toggles element style properties', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31;

//                                     e00
//          ____________________________|________
//         |                                     |
//        e10 (font: bold)                  e11 (block: narrow)
//    _____|_______________________________      |_________
//   |     |                      |    |   |     |         |
//  t20   e21 (width: large)     t22  e23 t24   e25    e26 (font: normal)
//      ___|___
//     |       |
//     e30    t31

        beforeEach(function(){
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            e25 = document.createElement('div25');
            e26 = document.createElement('div26');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(e25);
            e11.appendChild(e26);
            e10.setAttribute('style', 'font-weight: bold;');
            e26.setAttribute('style', 'font-weight: normal;');
            e11.setAttribute('style', 'block: narrow;');
            e21.setAttribute('style', 'width: 100em;');
        });

        it('sets "width" to alternative value if the element has it set to primary value', function(){
            doc.toggleElementStyle(e21, 'width', '100em', '300em');
            var stl = e21.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '300em';
            })).toBe(true);
        });

        it('sets "width" to primary value if the element has it different from primary value', function(){
            doc.toggleElementStyle(e21, 'width', '50px', '200px');
            var stl = e21.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '50px';
            })).toBe(true);
        });

        it('sets "font" to alternative value if the element inherites "font" to  primary value"', function(){
            doc.toggleElementStyle(e30, 'font-weight', 'bold', 'normal');
            var stl = e30.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === 'normal';
            })).toBe(true);
        });

         it('sets "font" to primary value if the element inherites "font" to not a primary value', function(){
            doc.toggleElementStyle(e30, 'font-weight', 'normal', 'anything');
            var stl = e30.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === 'normal';
            })).toBe(true);
        });
    });


    describe('Creates an element node from a text one with a "toggled" style property', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31;

//                                     e00
//          ____________________________|________
//         |                                     |
//        e10 (font: bold)                  e11 (block: narrow)
//    _____|_______________________________      |_________
//   |     |                      |    |   |     |         |
//  t20   e21 (width: large)     t22  e23 t24   e25    e26 (font: normal)
//      ___|___
//     |       |
//     e30    t31

        beforeEach(function(){
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            e25 = document.createElement('div25');
            e26 = document.createElement('div26');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(e25);
            e11.appendChild(e26);
            e10.setAttribute('style', 'font-weight: bold;');
            e26.setAttribute('style', 'font-weight: normal;');
            e11.setAttribute('style', 'block: narrow;');
            e21.setAttribute('style', 'width: 20px;');
        });

        it('creates an element node with "width" set to secondary value if the text node inherited "width" is equal to primary value', function(){
            var n = doc.createToggledElemFromText(t31, 'width', '20px', '600px'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '600px';
            })).toBe(true);
        });

        it('creates an element node with "width" set to primary value if text node inherited "width" is different from primary value', function(){
            var n = doc.createToggledElemFromText(t31, 'width', '300em', '20em'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '300em';
            })).toBe(true);
        });

        it('creates an element node with "font-weight" set to alternative value if the text node inherited "font-weight" is equal to primary value', function(){
            var n = doc.createToggledElemFromText(t22, 'font-weight', 'bold', '600');
            var stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === '600';
            })).toBe(true);
        });

        it('creates an element node with "font-weight" set to primary value if the text element inherited "font-weight" is different from primary value', function(){
            var n = doc.createToggledElemFromText(t22, 'font-weight', 'normal', 'large'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === 'normal';
            })).toBe(true);
        });

        it('creates an element whose text representation is the original text node', function(){
            var n = doc.createToggledElemFromText(t22, 'font-weight', 'normal', 'large');
            expect(n.childNodes.length).toBe(1);
            expect(n.firstChild.nodeValue).toBe(t22.nodeValue);
        });
    });


    describe('Gets complement nodes', function(){
        var e00, e10, e11, e20, e21, e22, e23, e24, e30, e31, e32, e33, e34, e40,
            e41, e50, e51, e60, e61, e62, e63;
//                                                   e00
//                        ____________________________|________
//                       |                                     |
//                      e10                                   e11
//            ___________|________                             |_________
//           |           |       |                             |         |
//          e20         e21     e22                           e23       e24
//      _____|____    ___|___
//      |    |    |  |       |
//     e30  e31  e32 e33    e34
//                   |       |
//                  e40     e41
//          _________|
//         |         |
//        e50       e51
//     ____|      ___|___
//    |    |     |       |
//   e60  e61   e62     e63
//
        beforeEach(function(){
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            e20 = document.createElement('div20');
            e21 = document.createElement('div21');
            e22 = document.createElement('div22');
            e23 = document.createElement('div23');
            e24 = document.createElement('div24');
            e30 = document.createElement('div30');
            e31 = document.createElement('div31');
            e32 = document.createElement('div32');
            e33 = document.createElement('div33');
            e34 = document.createElement('div34');
            e40 = document.createElement('div40');
            e41 = document.createElement('div41');
            e50 = document.createElement('div50');
            e51 = document.createElement('div51');
            e60 = document.createElement('div60');
            e61 = document.createElement('div61');
            e62 = document.createElement('div62');
            e63 = document.createElement('div63');

            e00.appendChild(e10);
            e00.appendChild(e11);

            e10.appendChild(e20);
            e10.appendChild(e21);
            e10.appendChild(e22);
            e11.appendChild(e23);
            e11.appendChild(e24);

            e20.appendChild(e30);
            e20.appendChild(e31);
            e20.appendChild(e32);
            e21.appendChild(e33);
            e21.appendChild(e34);

            e33.appendChild(e40);
            e34.appendChild(e41);

            e40.appendChild(e50);
            e40.appendChild(e51);

            e50.appendChild(e60);
            e50.appendChild(e61);
            e51.appendChild(e62);
            e51.appendChild(e63);
        });

        it('returns empty array if start node and end node coincide', function(){
            var res = doc.complementNodes(e21, e21);
            expect(res).toBeEmptyArray();
        });

        it('returns empty array if end node is a unique child of the start node', function(){
            var res = doc.complementNodes(e34, e41);
            expect(res).toBeEmptyArray();
        });

        it('throws an error if the start node is not a parent of the end node', function(){
            expect(function(){
                return doc.complementNodes(e11, e40);
            }).toThrow(new Error("Start node must contain the end one!"));
        });

        it('returns array with two nodes if the start node has three children and the end node is one of them', function(){
            var res = doc.complementNodes(e20, e31);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e30) !== -1).toBe(true);
            expect(res.indexOf(e32) !== -1).toBe(true);
        });

        it('returns array containing a sibling of the end node and its "high level cousins"', function(){
            var res = doc.complementNodes(e10, e30);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(4);
            expect(res.indexOf(e31) !== -1).toBe(true);
            expect(res.indexOf(e32) !== -1).toBe(true);
            expect(res.indexOf(e21) !== -1).toBe(true);
            expect(res.indexOf(e22) !== -1).toBe(true);
        });

        it('does not loose any node even if path from start node to end node contains a node with unique child', function(){
            var res = doc.complementNodes(e21, e50);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e51) !== -1).toBe(true);
            expect(res.indexOf(e34) !== -1).toBe(true);
        });
    });

    describe('Nailing style property', function(){
        var e00, e10, e11, e20, e21, e22, e23, e24, e30, e31, e32, e33, e34, e40,
            e41, e50, e51, e60, e61, e62, e63;
//                                                   e00
//                        ____________________________|________
//                       |                                     |
//                      e10  (font: nice)                     e11
//            ___________|_______                              |_________
//           |           |       |                             |         |
//          e20         e21     e22                           e23       e24
//      _____|____    ___|___
//      |    |    |  |       |
//     e30  e31  e32 e33    e34
//                   |       |
//                  e40     e41
//          _________|
//         |         |
//        e50       e51
//     ____|      ___|___
//    |    |     |       |
//   e60  e61   e62     e63
//
        beforeEach(function(){
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            e20 = document.createElement('div20');
            e21 = document.createElement('div21');
            e22 = document.createElement('div22');
            e23 = document.createElement('div23');
            e24 = document.createElement('div24');
            e30 = document.createElement('div30');
            e31 = document.createElement('div31');
            e32 = document.createElement('div32');
            e33 = document.createElement('div33');
            e34 = document.createElement('div34');
            e40 = document.createElement('div40');
            e41 = document.createElement('div41');
            e50 = document.createElement('div50');
            e51 = document.createElement('div51');
            e60 = document.createElement('div60');
            e61 = document.createElement('div61');
            e62 = document.createElement('div62');
            e63 = document.createElement('div63');

            e00.appendChild(e10);
            e00.appendChild(e11);

            e10.appendChild(e20);
            e10.appendChild(e21);
            e10.appendChild(e22);
            e11.appendChild(e23);
            e11.appendChild(e24);

            e20.appendChild(e30);
            e20.appendChild(e31);
            e20.appendChild(e32);
            e21.appendChild(e33);
            e21.appendChild(e34);

            e33.appendChild(e40);
            e34.appendChild(e41);

            e40.appendChild(e50);
            e40.appendChild(e51);

            e50.appendChild(e60);
            e50.appendChild(e61);
            e51.appendChild(e62);
            e51.appendChild(e63);
        });

        it('calls getMentor method to find out whether the style key is imposed', function(){
            spyOn(doc, 'getMentor');
            doc.nailStyleProperty(e34, 'whatever', 'primary', 'secondary');
            expect(doc.getMentor).toHaveBeenCalledWith('whatever', e34);
        });

        it('calls "setStyleProperty" with primary value of the style property on the target if it has no mentor', function(){
            spyOn(doc, 'getMentor');
            spyOn(doc, 'setStyleProperty');
            doc.nailStyleProperty(e50, 'src', 'primary', 'secondary');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e50, 'src', 'primary');
        });

        it('calls "setStyleProperty" with mentor (assuming it exists) inline style property value on all complement nodes', function(){
            spyOn(doc, 'getMentor').and.returnValue(e10);
            spyOn(doc, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(doc, 'dropStyleProperty');
            spyOn(doc, 'setStyleProperty');
            spyOn(doc, 'getStyleProperty').and.returnValue('nice');
            doc.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e50, 'font', 'nice');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e34, 'font', 'nice');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e20, 'font', 'nice');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e22, 'font', 'nice');
        });

        it('calls "dropStyleProperty" for mentor (assuming it exists) inline style property', function(){
            spyOn(doc, 'getMentor').and.returnValue(e10);
            spyOn(doc, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(doc, 'dropStyleProperty');
            spyOn(doc, 'setStyleProperty');
            doc.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(doc.dropStyleProperty).toHaveBeenCalledWith(e10, 'font');
        });

        it('calls "dropStyleProperty" on the mentor and "setStyleProperty" on the node, if complement node array is empty', function(){
            spyOn(doc, 'getMentor').and.returnValue(e21);
            spyOn(doc, 'complementNodes').and.returnValue([]);
            spyOn(doc, 'dropStyleProperty');
            spyOn(doc, 'setStyleProperty');
            doc.nailStyleProperty(e63, 'font', 'good', 'ugly');
            expect(doc.dropStyleProperty).toHaveBeenCalledWith(e21, 'font');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e63, 'font', 'good');
        });



        it('calls "setStyleProperty" with primary inline style property value on target node if mentor exists', function(){
            spyOn(doc, 'getMentor').and.returnValue(e10);
            spyOn(doc, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(doc, 'setStyleProperty');
            spyOn(doc, 'getStyleProperty').and.returnValue('nice'); // mentor inline style
            doc.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e51, 'font', 'good');
        });

        it('calls "setStyleProperty" with secondary inline style property value on target node if mentor style property is equal to primary', function(){
            spyOn(doc, 'getMentor').and.returnValue(e10);
            spyOn(doc, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(doc, 'setStyleProperty');
            spyOn(doc, 'getStyleProperty').and.returnValue('good'); // mentor inline style
            doc.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(e51, 'font', 'ugly');
        });
    });

    describe('Managing inline style property of nodes', function(){
    	var e0, e1, t2, e3, e4;
//                    e0 (font: nice; color: red)           e4 (size: 5)
//            ___________|_______
//           |           |       |
//          e1          t2     e3 (width: big; border: 2)
//
        beforeEach(function(){
            e0 = document.createElement('div0');
            e1 = document.createElement('div1');
            t2 = document.createTextNode('text node');
            e3 = document.createElement('div3');
            e4 = document.createElement('div4');

            e0.setAttribute('style', 'font-size: 20px; padding: 20em');
            e3.setAttribute('style', 'width: 200px; border: 2');
            e4.setAttribute('style', 'padding: 5em');

            e0.appendChild(e1);
            e0.appendChild(t2);
            e0.appendChild(e3);
        });

        describe('Getting property', function(){
            it('returns undefined if asked about a text node', function(){
                expect(doc.getStyleProperty(t2, 'whatever')).not.toBeDefined();
            });

            it('returns undefined if the node does not have that property', function(){
                expect(doc.getStyleProperty(e3, 'height')).not.toBeDefined();
            });

            it('returns undefined if the node does not have any property', function(){
                expect(doc.getStyleProperty(e1, 'height')).not.toBeDefined();
            });

            it('returns property value if the node has that property', function(){
                expect(doc.getStyleProperty(e0, 'padding')).toBe('20em');
            });
        });

        describe('Deleting property', function(){
            it('returns false if the argument does not support attributes (like a text node)', function(){
                expect(doc.dropStyleProperty(t2, 'any')).toBe(false);
            });

            it('returns false if the argument does not have that property', function(){
                expect(doc.dropStyleProperty(e3, 'excellence')).toBe(false);
            });

            it('returns false if the argument has no inline style properties', function(){
                expect(doc.dropStyleProperty(e1, 'width')).toBe(false);
            });

            it('returns true if the argument has required inline style property', function(){
                expect(doc.dropStyleProperty(e3, 'width')).toBe(true);
            });

            it('removes the required inline style property if the argument has that property', function(){
                expect(e0.getAttribute('style').indexOf('font-size')).not.toBe(-1);
                doc.dropStyleProperty(e0, 'font-size');
                expect(e0.getAttribute('style').indexOf('font-size')).toBe(-1);
            });

            it('does not remove other inline style properties', function(){
                expect(e0.getAttribute('style').indexOf('font-size')).not.toBe(-1);
                doc.dropStyleProperty(e0, 'padding');
                expect(e0.getAttribute('style').indexOf('font-size')).not.toBe(-1);
            });

            it('removes \"style\" attribute if after deleting requested key it remains empty', function(){
                expect(e4.getAttribute('style').indexOf('padding')).not.toBe(-1);
                doc.dropStyleProperty(e4, 'padding');
                expect(e4.getAttribute('style')).toBe(null);
            });
        });

        describe('Setting property', function(){
            it('return node itself (modified) if the target is an element node', function(){
                var n = doc.setStyleProperty(e3, 'color', 'blue');
                expect(n.nodeType).toBe(Node.ELEMENT_NODE);
                expect(n.isEqualNode(e3)).toBe(true);
            });

            it('returns a wrapping node if the target is a text node', function(){
                var n = doc.setStyleProperty(t2, 'color', 'blue');
                expect(n.nodeType).toBe(Node.ELEMENT_NODE);
            });

            it('appends the property to the node with inline style', function(){
                doc.setStyleProperty(e0, 'position', 'absolute');
                var styles = e0.getAttribute('style').split(';'),
                    // splitting style in pieces and look for the presence of "position: absolute"
                    res = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'position' && tmp[1].trim() === 'absolute';
                    });
                expect(res).toBe(true);
            });

            it('sets the property to the node without inline style', function(){
                doc.setStyleProperty(e1, 'position', 'absolute');
                var styles = e1.getAttribute('style').split(';'),
                    // splitting style in pieces and look for the presence of "position: absolute"
                    res = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'position' && tmp[1].trim() === 'absolute';
                    });
                expect(res).toBe(true);
            });


            it('overrides the property of the node', function(){
                doc.setStyleProperty(e0, 'color', 'green');
                var styles = e0.getAttribute('style').split(';'),
                    // splitting style in pieces and look for the presence of "position: absolute"
                    isPresentNew = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'green';
                    }),
                    isPresentOld = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'red';
                    });
                expect(isPresentNew).toBe(true);
                expect(isPresentOld).toBe(false);
            });

            it('sets inline property of the wrapping node when calling on a text node', function(){
                var n = doc.setStyleProperty(t2, 'color', 'blue');
                var styles = n.getAttribute('style').split(';'),
                    res = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'blue';
                    });
                expect(res).toBe(true);

            });

            it('inserts wrapping node in the DOM at place of the text node', function(){
                var n = doc.setStyleProperty(t2, 'color', 'blue');
                expect(n.nextSibling).toBe(e3);
                expect(n.previousSibling).toBe(e1);
                expect(n.firstChild.nodeValue).toBe('text node');

            });


        });
    });

    describe('Switching class attributes', function(){
        it('creates class attribute if no class attribute is present', function(){
            var el = document.createElement('div');
            doc.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('new_class');
        });

        it('switches class attribute if the element has only that class attribute', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'old_class');
            doc.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('new_class');
        });

        it('appends class attribute if the element has other class attributes and no secondary-switch', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'some_other_class another-one');
            doc.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('some_other_class another-one new_class');
        });

        it('leaves class attribute unchanged if it is already set to primary-switch', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'class1');
            doc.switchClassProperty(el, 'class1', 'class2');
            expect(el.getAttribute('class')).toBe('class1');
        });

        it('replaces the secondary-switch class attribute if the element has other attributes', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'some_other_class old_class another-one');
            doc.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('some_other_class new_class another-one');
        });
    });

    describe('Getting inherited properties', function(){
        var n00, n10, n11, n20, n21, n22, n23, n30, n31, m00, m10, m11;
//                    n00                                m00
//         ____________|_________                    _____|____
//         |                     |                   |         |
//        n10                   n11                 m10       m11
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
            m00 = document.createElement('div');
            m10 = document.createElement('div');
            m11 = document.createElement('div');
            n00.appendChild(n10);
            n00.appendChild(n11);
            n10.appendChild(n20);
            n10.appendChild(n21);
            n10.appendChild(n22);
            n21.appendChild(n30);
            n21.appendChild(n31);
            n11.appendChild(n23);
            m00.appendChild(m10);
            m00.appendChild(m11);
        });

        it('returns a Properties instance if the scope is not set', function(){
            var prop = doc.getInheritedProperties(n11);
            expect(prop instanceof Properties).toBe(true);
        });

        it('returns a Properties instance if the node is  within the scope', function(){
            var prop = doc.getInheritedProperties(n11, n00);
            expect(prop instanceof Properties).toBe(true);
        });

        it('returns a Properties instance if the node is not within the scope', function(){
            var prop = doc.getInheritedProperties(n11, n10);
            expect(prop instanceof Properties).toBe(true);
        });


        it('returns current node properties if the scope is not set', function(){
            n30.setAttribute('class', 'media');
            var prop = doc.getInheritedProperties(n30);
            expect(prop.propNum()).toBe(1);
            expect(prop.getProperty('class')).toBe('media');
        });

        it('returns current node properties if the node is not scope node descendant', function(){
            n21.setAttribute('data-user', 'content');
            var prop = doc.getInheritedProperties(n21, n11);
            expect(prop.propNum()).toBe(1);
            expect(prop.getProperty('data-user')).toBe('content');

        });

        it('returns properties if the node is within scope', function(){
            n30.setAttribute('style', 'padding: 23em;margin: 5px;');
            n21.setAttribute('href', 'a link');
            n10.setAttribute('src', 'image.jpg');
            n00.setAttribute('color', 'red');
            var prop = doc.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(4);        // 'style', 'href', 'src' and 'color'
            expect(prop.getProperty('color')).toBe('red');
            expect(prop.getProperty('src')).toBe('image.jpg');
            expect(prop.getProperty('href')).toBe('a link');
            expect(prop.getStyleProperty('padding')).toBe('23em');
            expect(prop.getStyleProperty('margin')).toBe('5px');
        });

        it('considers nodes up to the root if the scope is not set', function(){
            n30.setAttribute('style', 'padding: 23em;margin: 5px;');
            n21.setAttribute('href', 'a link');
            n10.setAttribute('src', 'image.jpg');
            n00.setAttribute('color', 'red');
            var prop = doc.getInheritedProperties(n30);
            expect(prop.propNum()).toBe(4);        // 'style', 'href', 'src' and 'color'
            expect(prop.getProperty('color')).toBe('red');
            expect(prop.getProperty('src')).toBe('image.jpg');
            expect(prop.getProperty('href')).toBe('a link');
            expect(prop.getStyleProperty('padding')).toBe('23em');
            expect(prop.getStyleProperty('margin')).toBe('5px');
        });


        it('assignes the first occurence of attributes', function(){
            n21.setAttribute('font-size', '12px');
            n10.setAttribute('font-size', '2em;');
            var prop = doc.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(1);
            expect(prop.getProperty('font-size')).toBe('12px');
        });

        it('assignes the first occurence of styles', function(){
            n21.setAttribute('style', 'font-weight: bold');
            n10.setAttribute('style', 'font-weight: normal');
            var prop = doc.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(1);
            expect(prop.getStyleProperty('font-weight')).toBe('bold');
        });

        it('assignes the first occurence of multiple styles', function(){
            n21.setAttribute('style', 'color: red; width: 20em');
            n21.setAttribute('text-align', 'center');
            n21.setAttribute('src', 'local');
            n10.setAttribute('style', 'width: 100px; font-weight: normal');
            n10.setAttribute('title', 'tag title');
            n10.setAttribute('src', 'external');

            var prop = doc.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(4);
            expect(prop.getProperty('text-align')).toBe('center');
            expect(prop.getProperty('src')).toBe('local');
            expect(prop.getProperty('title')).toBe('tag title');
            expect(prop.getStyleProperty('width')).toBe('20em');
            expect(prop.getStyleProperty('color')).toBe('red');
            expect(prop.getStyleProperty('font-weight')).toBe('normal');
        });

    });

	describe('works with Selection that has', function() {
	    // it seems that when activating these suits makes the page with test
	    // output freeze for some seconds
	    var range, e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31, e32, n00, n10, n11;
	    beforeEach(function() {
	        doc = new Document();
	        range = document.createRange();
	        //                                     e00                                  n00
	        //          ____________________________|________                       _____|_____
	        //         |                                     |                     |           |
	        //        e10 (font: bold)                  e11 (block: narrow)       n10         n11
	        //    _____|_______________________________      |_________
	        //   |     |                      |    |   |     |         |
	        //  t20   e21 (width: large)     t22  e23 t24   e25    e26 (font: normal)
	        //      ___|___                                  |
	        //     |       |                                e32
	        //     e30    t31
	        e00 = document.createElement('div');
	        e10 = document.createElement('div');
	        e11 = document.createElement('div');
	        t20 = document.createTextNode('text node 2.0');
	        e21 = document.createElement('div');
	        t22 = document.createTextNode('text node 2.2');
	        e23 = document.createElement('div');
	        t24 = document.createTextNode('text node 2.4');
	        e25 = document.createElement('div');
	        e26 = document.createElement('div');
	        e30 = document.createElement('div');
	        t31 = document.createTextNode('text node 3.1');
	        e32 = document.createElement('div');
	        e00.appendChild(e10);
	        e00.appendChild(e11);
	        e10.appendChild(t20);
	        e10.appendChild(e21);
	        e10.appendChild(t22);
	        e10.appendChild(e23);
	        e10.appendChild(t24);
	        e21.appendChild(e30);
	        e21.appendChild(t31);
	        e11.appendChild(e25);
	        e11.appendChild(e26);
	        e25.appendChild(e32);
	        e10.setAttribute('style', 'font-weight: bold;');
	        e26.setAttribute('style', 'font-weight: normal;');
	        e11.setAttribute('style', 'block: narrow;');
	        e21.setAttribute('style', 'width: 20px;');
	        n00 = document.createElement('div');
	        n10 = document.createElement('div');
	        n11 = document.createElement('div');
	        n00.appendChild(n10);
	        n00.appendChild(n11);
	    });
	    describe('a range related functionality that', function() {
	        describe('has method isRange which', function() {
	            it('returns true if argument is a Range instance', function() {
	                expect(doc.isRange(range)).toBe(true);
	            });
	            it('returns false if argument is a string, array, number, function or an object', function() {
	                var invalids = ['', 'a string', [],
	                    [1, 2, 3], 0, 1, 4.32, -2, -5.96,
	                    function() {
	                        return;
	                    }, {}, {
	                        foo: 23
	                    }
	                ];
	                invalids.forEach(function(invalid) {
	                    expect(doc.isRange(invalid)).toBe(false);
	                });
	            });
	        });
	        describe('has method appendRange', function() {
	            it('that does not call setRanges method if the argument is not a valid range', function() {
	                spyOn(doc, 'getRanges');
	                spyOn(doc, 'setRanges');
	                spyOn(doc, 'isRange').and.returnValue(false);
	                doc.appendRange('anything');
	                expect(doc.getRanges).not.toHaveBeenCalled();
	                expect(doc.setRanges).not.toHaveBeenCalled();
	            });
	            describe('which in case when the argument is a valid range,', function() {
	                beforeEach(function() {
	                    spyOn(doc, 'isRange').and.returnValue(true);
	                    spyOn(doc, 'setRanges');
	                });
	                describe('present in _ranges,', function() {
	                    beforeEach(function() {
	                        spyOn(doc, 'containsRange').and.returnValue(true);
	                    });
	                    it('does not call setRanges method if the argument is already among _ranges', function() {
	                        spyOn(doc, 'getRanges');
	                        doc.appendRange('anything');
	                        expect(doc.getRanges).not.toHaveBeenCalled();
	                        expect(doc.setRanges).not.toHaveBeenCalled();
	                    });
	                });
	                describe('not present in _ranges,', function() {
	                    beforeEach(function() {
	                        spyOn(doc, 'containsRange').and.returnValue(false);
	                    });
	                    it('calls setRanges method if _ranges array is not defined', function() {
	                        spyOn(doc, 'getRanges');
	                        doc.appendRange('anything');
	                        expect(doc.getRanges).toHaveBeenCalled();
	                        expect(doc.setRanges).toHaveBeenCalledWith(['anything']);
	                    });
	                    it('calls setRanges method if _ranges array is empty', function() {
	                        spyOn(doc, 'getRanges').and.returnValue([]);
	                        doc.appendRange('anything');
	                        expect(doc.getRanges).toHaveBeenCalled();
	                        expect(doc.setRanges).toHaveBeenCalledWith(['anything']);
	                    });
	                    it('calls setRanges method if _ranges array is not empty', function() {
	                        spyOn(doc, 'getRanges').and.returnValue([1, 2, '3']);
	                        doc.appendRange('a valid range');
	                        expect(doc.getRanges).toHaveBeenCalled();
	                        expect(doc.setRanges).toHaveBeenCalledWith([1, 2, '3', 'a valid range']);
	                    });
	                });
	            });
	        });
	        describe('method containsRange', function() {
	            it('throws an error if isRange return false', function() {
	                spyOn(doc, 'isRange').and.returnValue(false);
	                expect(function() {
	                    doc.containsRange('whatever');
	                }).toThrow(new Error('The argument must be a Range instance!'));
	            });
	            it('returns false if _ranges is not set', function() {
	                spyOn(doc, 'isRange').and.returnValue(true);
	                spyOn(doc, 'getRanges');
	                expect(doc.containsRange('anything')).toBe(false);
	            });
	            it('returns false if _ranges is empty', function() {
	                spyOn(doc, 'isRange').and.returnValue(true);
	                spyOn(doc, 'getRanges').and.returnValue([]);
	                expect(doc.containsRange('range')).toBe(false);
	            });
	            it('calls "areEqual" to compare the ranges', function() {
	                spyOn(doc, 'isRange').and.returnValue(true);
	                spyOn(doc, 'areEqual').and.returnValue(false);
	                spyOn(doc, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
	                doc.containsRange('range');
	                expect(doc.areEqual).toHaveBeenCalledWith('r1', 'range');
	                expect(doc.areEqual).toHaveBeenCalledWith('r2', 'range');
	                expect(doc.areEqual).toHaveBeenCalledWith('r3', 'range');
	            });
	            it('returns false if method "areEqual" always returns false', function() {
	                spyOn(doc, 'isRange').and.returnValue(true);
	                spyOn(doc, 'areEqual').and.returnValue(false);
	                spyOn(doc, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
	                expect(doc.containsRange(range)).toBe(false);
	            });
	            it('returns true if "areEqual" returns "true" during the first execution', function() {
	                spyOn(doc, 'areEqual').and.callFake(function() {
	                    return true;
	                }); // always returns true
	                spyOn(doc, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
	                expect(doc.containsRange(range)).toBe(true);
	            });
	            it('calls "areEqual" for first two elements if it returns "true" during the second execution', function() {
	                spyOn(doc, 'isRange').and.returnValue(true);
	                spyOn(doc, 'areEqual').and.callFake(function(x, y) {
	                    return x === 'r2' || y === 'r2';
	                }); // returns true only for the second range
	                spyOn(doc, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
	                doc.containsRange('range');
	                expect(doc.areEqual).toHaveBeenCalledWith('r1', 'range');
	                expect(doc.areEqual).toHaveBeenCalledWith('r2', 'range');
	                expect(doc.areEqual).not.toHaveBeenCalledWith('r3', 'range');
	            });
	            it('returns true if "areEqual" returns "true" during last (third) execution', function() {
	                spyOn(doc, 'areEqual').and.callFake(function(x) {
	                    return x === 'r3';
	                }); // returns true only for the third range
	                spyOn(doc, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
	                expect(doc.containsRange(range)).toBe(true);
	            });
	        });
	        describe('method areEqual', function() {
	            it('returns false if called with one argument that is not a Range instance', function() {
	                spyOn(doc, 'isRange').and.returnValue(false);
	                expect(doc.areEqual('anything')).toBe(false);
	                expect(doc.isRange).toHaveBeenCalledWith('anything');
	            });
	            it('returns false if called with one argument that is a Range instance', function() {
	                spyOn(doc, 'isRange').and.callFake(function(r) {
	                    return r !== undefined;
	                });
	                expect(doc.areEqual('anything')).toBe(false);
	                expect(doc.isRange).toHaveBeenCalledWith('anything');
	            });
	            it('returns false if both arguments are not Range instances', function() {
	                spyOn(doc, 'isRange').and.callFake(function() {
	                    return false;
	                });
	                expect(doc.areEqual('not range', 'niether this')).toBe(false);
	            });
	            it('returns false if first arg is a Range instance, the second - not', function() {
	                spyOn(doc, 'isRange').and.callFake(function(r) {
	                    return r === 'range';
	                });
	                expect(doc.areEqual('range', 'not range')).toBe(false);
	                expect(doc.isRange).toHaveBeenCalledWith('range');
	                expect(doc.isRange).toHaveBeenCalledWith('not range');
	            });
	            it('returns true, if both ranges are identical', function() {
	                expect(doc.areEqual(range, range)).toBe(true);
	            });
	            it('returns true, if the ranges start and end in element nodes and have the same offsets', function() {
	                var range2 = document.createRange();
	                range.setStart(e21, 0);
	                range.setEnd(e23, 0);
	                range2.setStart(e21, 0);
	                range2.setEnd(e23, 0);
	                expect(doc.areEqual(range, range2)).toBe(true);
	            });
	            it('returns true, if the ranges start and end in the same text node and have the same offsets', function() {
	                var range2 = document.createRange();
	                range.setStart(t22, 2);
	                range.setEnd(t22, 5);
	                range2.setStart(t22, 2);
	                range2.setEnd(t22, 5);
	                expect(doc.areEqual(range, range2)).toBe(true);
	            });
	            it('returns false, if the ranges start and end in the same text node and have different offsets', function() {
	                var range2 = document.createRange();
	                range.setStart(t22, 1);
	                range.setEnd(t22, 4);
	                range2.setStart(t22, 3);
	                range2.setEnd(t22, 5);
	                expect(doc.areEqual(range, range2)).toBe(false);
	            });
	            it('returns false, if the ranges start and end in the same text node and have different offsets', function() {
	                var range2 = document.createRange();
	                range.setStart(t22, 1);
	                range.setEnd(t22, 4);
	                range2.setStart(t22, 3);
	                range2.setEnd(t22, 5);
	                expect(doc.areEqual(range, range2)).toBe(false);
	            });
	            it('returns false, if the ranges start and end in the same element node and have different offsets', function() {
	                var range2 = document.createRange();
	                range.setStart(e21, 1);
	                range.setEnd(e21, 2);
	                range2.setStart(e21, 0);
	                range2.setEnd(e21, 1);
	                expect(doc.areEqual(range, range2)).toBe(false);
	            });
	        });
	        describe('has method rangeCount that', function() {
	            it('returns 0, if the "ranges" is not set', function() {
	                spyOn(doc, 'getRanges');
	                expect(doc.rangeCount()).toBe(0);
	            });
	            it('returns 0, if the "ranges" is an empty array ([])', function() {
	                spyOn(doc, 'getRanges').and.returnValue([]);
	                expect(doc.rangeCount()).toBe(0);
	            });
	            it('returns 2, if the "ranges" is an array containing two elements ([..., ...])', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['1', '2']);
	                expect(doc.rangeCount()).toBe(2);
	            });
	            it('returns 3, if the "ranges" is an array containing three elements ([..., ..., ...])', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['1', 'second range', ['3']]);
	                expect(doc.rangeCount()).toBe(3);
	            });
	        });
	        describe('has method setRanges that', function() {
	            it('sets ranges to empty array if it is called without argument', function() {
	                doc.setRanges();
	                var res = doc.getRanges();
	                expect(res).toBeEmptyArray();
	            });
	            it('sets ranges to empty array if the argument is invalid', function() {
	                // pending();
	                var invalids = [0, 5, -1, 2.1, -2.3, '', 'string', {}, {
	                        foo: 1
	                    },
	                    function() {
	                        return;
	                    }
	                ];
	                invalids.forEach(function(invalid) {
	                    doc = new Document();
	                    doc.setRanges(invalid);
	                    var res = doc.getRanges();
	                    expect(res).toBeEmptyArray();
	                });
	            });
	            it('sets ranges to empty array if the argument is an empty array', function() {
	                // pending();
	                doc.setRanges([]);
	                var res = doc.getRanges();
	                expect(res).toBeEmptyArray();
	               });
	            it('appends ranges if they are all valid', function() {
	                spyOn(doc, 'isRange').and.returnValue(true);
	                spyOn(doc, 'appendRange');
	                doc.setRanges(['r1', 'r2', 'r3']);
	                var r = doc.getRanges();
	                expect(Array.isArray(r)).toBe(true);
	                expect(r.length).toBe(3);
	                expect(r[0]).toBe('r1');
	                expect(r[1]).toBe('r2');
	                expect(r[2]).toBe('r3');
	            });
	            it('does not call append range method on first argument if it is not a valid range', function() {
	                spyOn(doc, 'isRange').and.callFake(function(r) {
	                    return r !== 'r1';
	                });
	                spyOn(doc, 'appendRange');
	                doc.setRanges(['r1', 'r2', 'r3']);
	                var r = doc.getRanges();
	                expect(Array.isArray(r)).toBe(true);
	                expect(r.length).toBe(2);
	                expect(r[0]).toBe('r2');
	                expect(r[1]).toBe('r3');
	            });
	            it('does not call append range method on a middle argument if it is not a valid range', function() {
	                spyOn(doc, 'isRange').and.callFake(function(r) {
	                    return r !== 'rMiddle';
	                });
	                spyOn(doc, 'appendRange');
	                doc.setRanges(['r1', 'r2', 'rMiddle', 'rLast']);
	                var r = doc.getRanges();
	                expect(Array.isArray(r)).toBe(true);
	                expect(r.length).toBe(3);
	                expect(r[0]).toBe('r1');
	                expect(r[1]).toBe('r2');
	                expect(r[2]).toBe('rLast');
	            });
	            it('does not call append range method on last argument if it is not a valid range', function() {
	                spyOn(doc, 'isRange').and.callFake(function(r) {
	                    return r !== 'rLast';
	                });
	                spyOn(doc, 'appendRange');
	                doc.setRanges(['r1', 'r2', 'r3', 'rMiddle', 'rLast']);
	                var r = doc.getRanges();
	                expect(Array.isArray(r)).toBe(true);
	                expect(r.length).toBe(4);
	                expect(r[0]).toBe('r1');
	                expect(r[1]).toBe('r2');
	                expect(r[2]).toBe('r3');
	                expect(r[3]).toBe('rMiddle');
	            });
	        });
	        describe('has nextRange method that', function() {
	            it('is undefined, if "ranges" is undefined', function() {
	                spyOn(doc, 'getRanges');
	                expect(doc.nextRange()).not.toBeDefined();
	            });
	            it('returns undefiend after the second call, if "ranges" is undefined', function() {
	                spyOn(doc, 'getRanges');
	                doc.nextRange();
	                expect(doc.nextRange()).not.toBeDefined();
	            });
	            it('is undefined, if "ranges" is an empty array', function() {
	                spyOn(doc, 'getRanges');
	                expect(doc.nextRange()).not.toBeDefined();
	            });
	            it('returns first range, if "ranges" contains single  element', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['range1']);
	                spyOn(doc, 'rangeCount').and.returnValue(1);
	                expect(doc.nextRange()).toBe('range1');
	            });
	            it('returns nothing when executed twice, if "ranges" contains single element', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['range1']);
	                spyOn(doc, 'rangeCount').and.returnValue(1);
	                doc.nextRange();
	                expect(doc.nextRange()).not.toBeDefined();
	            });
	            it('returns four elements when executed 4 times and when "ranges" contains 5 elements', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['range1', 'range2', 'range3', 'range4', 'range5']);
	                spyOn(doc, 'rangeCount').and.returnValue(5);
	                expect(doc.nextRange()).toBe('range1');
	                expect(doc.nextRange()).toBe('range2');
	                expect(doc.nextRange()).toBe('range3');
	                expect(doc.nextRange()).toBe('range4');
	            });
	            it('returns undefined for last three calls when executed 6 times, if "ranges" contains only three elements', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['range1', 'range2', 'range3']);
	                spyOn(doc, 'rangeCount').and.returnValue(3);
	                expect(doc.nextRange()).toBeDefined();
	                expect(doc.nextRange()).toBeDefined();
	                expect(doc.nextRange()).toBeDefined();
	                expect(doc.nextRange()).not.toBeDefined();
	                expect(doc.nextRange()).not.toBeDefined();
	                expect(doc.nextRange()).not.toBeDefined();
	            });
	            it('starts over after resetting if ranges is not defined', function() {
	                spyOn(doc, 'getRanges');
	                doc.startOver();
	                expect(doc.nextRange()).not.toBeDefined();
	            });
	            it('starts over after two calls, if "ranges" contains three elements', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['range1', 'range2', 'range3']);
	                spyOn(doc, 'rangeCount').and.returnValue(3);
	                expect(doc.nextRange()).toBe('range1');
	                expect(doc.nextRange()).toBe('range2');
	                doc.startOver();
	                expect(doc.nextRange()).toBe('range1');
	                expect(doc.nextRange()).toBe('range2');
	                expect(doc.nextRange()).toBe('range3');
	            });
	            it('starts over, if "ranges" contains single element', function() {
	                spyOn(doc, 'getRanges').and.returnValue(['range1']);
	                spyOn(doc, 'rangeCount').and.returnValue(1);
	                expect(doc.nextRange()).toBe('range1');
	                expect(doc.nextRange()).not.toBeDefined();
	                doc.startOver();
	                expect(doc.nextRange()).toBe('range1');
	                expect(doc.nextRange()).not.toBeDefined();
	                expect(doc.nextRange()).not.toBeDefined();
	                doc.startOver();
	                doc.startOver();
	                expect(doc.nextRange()).toBe('range1');
	            });
	        });
	        describe('has method nodesBetween that', function() {
	            it('returns an empty array if it is called without arguments', function() {
	                var nodes = doc.nodesBetween();
	                expect(nodes).toBeEmptyArray();
	            });
	            it('returns empty array if pathTo() returns nothing', function() {
	                spyOn(doc, 'pathTo');
	                var nodes = doc.nodesBetween('any node', 'another node');
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(0);
	            });
	            it('returns nothing if nodes can not be compared', function() {
	                spyOn(doc, 'compare');
	                expect(doc.nodesBetween(e21, e23)).not.toBeDefined();
	            });
	            it('returns array with one of the arguments if they are the same element node', function() {
	                var nodes = doc.nodesBetween(e21, e21);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(1);
	                expect(nodes[0]).toBe(e21);
	            });
	            it('returns array with one of the arguments if they are the same text node', function() {
	                var nodes = doc.nodesBetween(t22, t22);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(1);
	                expect(nodes[0]).toBe(t22);
	            });
	            it('returns array with input arguments if they are neighbouring siblings', function() {
	                var nodes = doc.nodesBetween(t22, e23);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(2);
	                expect(nodes[0]).toBe(t22);
	                expect(nodes[1]).toBe(e23);
	            });
	            it('returns array with all siblings of node A if the arguments are the first and last nodes of A', function() {
	                var nodes = doc.nodesBetween(t20, t24);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(5);
	                expect(nodes[0]).toBe(t20);
	                expect(nodes[1]).toBe(e21);
	                expect(nodes[2]).toBe(t22);
	                expect(nodes[3]).toBe(e23);
	                expect(nodes[4]).toBe(t24);
	            });
	            it('returns array with a fraction of siblings of a node if arguments have the same parent', function() {
	                var nodes = doc.nodesBetween(e21, e23);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(3);
	                expect(nodes[0]).toBe(e21);
	                expect(nodes[1]).toBe(t22);
	                expect(nodes[2]).toBe(e23);
	            });
	            it('returns array of nodes in order as they appear in DOM if the arguments are in inverse order', function() {
	                var nodes = doc.nodesBetween(e23, e21);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(3);
	                expect(nodes[0]).toBe(e21);
	                expect(nodes[1]).toBe(t22);
	                expect(nodes[2]).toBe(e23);
	            });

	            it('returns array with the second argument if it contains the first argument', function() {
	                var nodes = doc.nodesBetween(e23, e10);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(1);
	                expect(nodes[0]).toBe(e10);
	            });
	            it('returns array with the first argument if it contains the second argument', function() {
	                var nodes = doc.nodesBetween(e11, e32);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(1);
	                expect(nodes[0]).toBe(e11);
	            });
	            it('returns correct nodes if parent of the first argument is a neighbour sibling of the second argument', function() {
	                var nodes = doc.nodesBetween(e23, e11);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(3);
	                expect(nodes[0]).toBe(e23);
	                expect(nodes[1]).toBe(t24);
	                expect(nodes[2]).toBe(e11);
	            });
	            it('returns correct nodes if parent of the second argument is a neighbour sibling of the first argument', function() {
	                var nodes = doc.nodesBetween(t20, e30);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(2);
	                expect(nodes[0]).toBe(t20);
	                expect(nodes[1]).toBe(e30);
	            });
	            it('returns correct nodes if the arguments have the root node as a common ancestor', function() {
	                var nodes = doc.nodesBetween(e21, e26);
	                expect(Array.isArray(nodes)).toBe(true);
	                expect(nodes.length).toBe(6);
	                expect(nodes[0]).toBe(e21);
	                expect(nodes[1]).toBe(t22);
	                expect(nodes[2]).toBe(e23);
	                expect(nodes[3]).toBe(t24);
	                expect(nodes[4]).toBe(e25);
	                expect(nodes[5]).toBe(e26);
	            });
	            it('returns empty array if the arguments have no common ancestor', function() {
	                spyOn(doc, 'commonAncestor');
	                var nodes = doc.nodesBetween(e21, e10);
	                expect(nodes).toBeEmptyArray();
	                expect(doc.commonAncestor).toHaveBeenCalledWith(e21, e10);
	            });
	        });
	    });
	    describe('a method to compare paths that', function() {
	        it('returns undefined if the first argument is a string', function() {
	            expect(doc.compare('a string', [2, 6])).not.toBeDefined();
	        });
	        it('returns 0 if both paths are empty arrays', function() {
	            expect(doc.compare([], [])).toBe(0);
	        });
	        it('returns 0 if both paths are equal non-empty arrays', function() {
	            expect(doc.compare([3, 2, 5, 2], [3, 2, 5, 2])).toBe(0);
	        });
	        it('returns -1 if first path is empty while the second is not', function() {
	            expect(doc.compare([], [3, 2, 5, 2])).toBe(-1);
	        });
	        it('returns 1 if first path is not empty while the second is empty', function() {
	            expect(doc.compare([3, 2, 5, 2], [])).toBe(1);
	        });
	        it('returns -1 if both paths are not empty but first path is less than the second', function() {
	            expect(doc.compare([3, 0], [3, 2, 5, 2])).toBe(-1);
	        });
	        it('is an antisymmetric function', function() {
	            expect(doc.compare([3, 0], [3, 2, 5, 2])).toBe(-doc.compare([3, 2, 5, 2], [3, 0]));
	        });
	        it('returns nothing if the comparator fails to compare a pair of elements', function() {
	            expect(doc.compare([3, 0], [3, 2, 5, 2], function() {
	                return;
	            })).not.toBeDefined();
	        });
	        it('returns 0 for equal length paths if the comparator always returns 0', function() {
	            expect(doc.compare([3, 2, 1], [4, 5, 6], function() {
	                return 0;
	            })).toBe(0);
	        });
	        it('returns -1 if first path is "shorter" than the second and the comparator always returns 0', function() {
	            expect(doc.compare([3], [4, 5, 6], function() {
	                return 0;
	            })).toBe(-1);
	        });
	        it('returns 1 if first path is "longer" than the second and the comparator always returns 0', function() {
	            expect(doc.compare([3, 5, 6], [6], function() {
	                return 0;
	            })).toBe(1);
	        });
	        it('returns -1 if the comparator always returns -1', function() {
	            expect(doc.compare([3, 1], [4, 5, 6], function() {
	                return -1;
	            })).toBe(-1);
	        });
	        it('returns 1 if the comparator always returns 1', function() {
	            expect(doc.compare([3, 2, 1], [4, 5], function() {
	                return 1;
	            })).toBe(1);
	        });
	        it('does not modify the content of the input arrays', function(){
	            var p1 = [2, 3, 0],
	                p2 = [9, 7];
	            doc.compare(p1, p2);
	            expect(p1.length).toBe(3);
	            expect(p1[0]).toBe(2);
	            expect(p1[1]).toBe(3);
	            expect(p1[2]).toBe(0);
	            expect(p2.length).toBe(2);
	            expect(p2[0]).toBe(9);
	            expect(p2[1]).toBe(7);
	        });
	    });
	    describe('a method commonAncestor that', function() {
	        it('returns nothing if it is called without arguments', function() {
	            expect(doc.commonAncestor()).not.toBeDefined();
	        });
	        it('returns nothing if it is called with one argument', function() {
	            expect(doc.commonAncestor(e10)).not.toBeDefined();
	        });
	        it('returns the first argument if it is a parent of the second which is an element node', function() {
	            expect(doc.commonAncestor(e10, e23)).toBe(e10);
	        });
	        it('returns the first argument if it is a parent of the second which is a text node', function() {
	            expect(doc.commonAncestor(e21, t31)).toBe(e21);
	        });
	        it('returns the second argument if it is a parent of the first which is an element node', function() {
	            expect(doc.commonAncestor(e25, e11)).toBe(e11);
	        });
	        it('returns the second argument if it is a parent of the first which is a text node', function() {
	            expect(doc.commonAncestor(t20, e10)).toBe(e10);
	        });
	        it('returns null if the nodes have no common parent', function() {
	            expect(doc.commonAncestor(e23, n11)).toBe(null);
	        });
	        it('returns the common parent if the arguments are element nodes and are siblings of each other', function() {
	            expect(doc.commonAncestor(e21, e23)).toBe(e10);
	        });
	        it('returns the common parent if the first argument is located deeper than the second', function() {
	            expect(doc.commonAncestor(e21, e11)).toBe(e00);
	        });
	        it('returns the common parent if the second argument is located deeper than the first', function() {
	            expect(doc.commonAncestor(e10, e25)).toBe(e00);
	        });
	    });
	    describe('a method to find the root node that', function() {
	        it('returns nothing if the argument is an undefined, string, number, array, function or a non-Node object', function() {
	            var invalids = [undefined, null, '', 'a string', [],
	                [1, 2, 3], 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.rootOf(invalid)).not.toBeDefined();
	            });
	        });
	        it('returns root node of a text node', function() {
	            expect(doc.rootOf(t22)).toBe(e00);
	        });
	        it('returns root node of an element node', function() {
	            expect(doc.rootOf(e25)).toBe(e00);
	        });
	        it('returns the argument if it is its own root', function() {
	            expect(doc.rootOf(e00)).toBe(e00);
	        });
	    });
	    describe('a method to calculate path to an element that', function() {
	        it('returns nothing if no argument is given', function(){
	            expect(doc.pathTo()).not.toBeDefined();
	        });
	        it('returns empty array if the argument is the root element', function() {
	            var path = doc.pathTo(e00, e00);
	            expect(Array.isArray(path)).toBe(true);
	            expect(path.length).toBe(0);
	        });

	        it('returns nothing if the scope (2nd argument) does not contain the node (first argument)', function() {
	            expect(doc.pathTo(e23, e11)).not.toBeDefined();
	        });
	        it('returns path from the root if the second argument is not defined', function() {
	            var path = doc.pathTo(t31);
	            expect(Array.isArray(path)).toBe(true);
	            expect(path.length).toBe(3);
	            expect(path[0]).toBe(0);
	            expect(path[1]).toBe(1);
	            expect(path[2]).toBe(1);
	        });
	        it('returns [0] if the first argument is the first child of the second argument', function() {
	            var path = doc.pathTo(t20, e10);
	            expect(Array.isArray(path)).toBe(true);
	            expect(path.length).toBe(1);
	            expect(path[0]).toBe(0);
	        });
	        it('returns [1] if the first argument is the second child of the second argument', function() {
	            var path = doc.pathTo(e21, e10);
	            expect(Array.isArray(path)).toBe(true);
	            expect(path.length).toBe(1);
	            expect(path[0]).toBe(1);
	        });
	        it('returns [4] if the first argument is the last child among 5 children of the second argument', function() {
	            var path = doc.pathTo(t24, e10);
	            expect(Array.isArray(path)).toBe(true);
	            expect(path.length).toBe(1);
	            expect(path[0]).toBe(4);
	        });
	        it('returns three element array if the first argument lays at "depth" 3', function() {
	            var path = doc.pathTo(t31, e00);
	            expect(Array.isArray(path)).toBe(true);
	            expect(path.length).toBe(3);
	            expect(path[0]).toBe(0);
	            expect(path[1]).toBe(1);
	            expect(path[2]).toBe(1);
	        });
	    });
	    describe('a method contains that', function() {
	        it('throws an error if the second argument is invalid and the first is a Node instance', function() {
	            var invalids = [undefined, null, '', 'a string', [],
	                [1, 2, 3], 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(function() {
	                    doc.contains(t20, invalid);
	                }).toThrow(new Error('Both arguments must be Node instances!'));
	            });
	        });
	        it('throws an error if the first argument is invalid and the second is a Node instance', function() {
	            var invalids = [undefined, null, '', 'a string', [],
	                [1, 2, 3], 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(function() {
	                    doc.contains(invalid, e10);
	                }).toThrow(new Error('Both arguments must be Node instances!'));
	            });
	        });
	        it('returns true if the arguments are equal text nodes', function() {
	            expect(doc.contains(t24, t24)).toBe(true);
	        });
	        it('returns true if the arguments are equal element nodes', function() {
	            expect(doc.contains(e11, e11)).toBe(true);
	        });
	        it('returns true if the second argument is an element-node child of the first one', function() {
	            expect(doc.contains(e10, e23)).toBe(true);
	        });
	        it('returns true if the second argument is a text-node child of the first one', function() {
	            expect(doc.contains(e10, t24)).toBe(true);
	        });
	        it('returns true if the second argument is a text-node descendant of the first one', function() {
	            expect(doc.contains(e00, t31)).toBe(true);
	        });
	        it('returns true if the second argument is a element-node descendant of the first one', function() {
	            expect(doc.contains(e00, e32)).toBe(true);
	        });
	        it('returns false if the the arguments are siblings', function() {
	            expect(doc.contains(e21, t22)).toBe(false);
	        });
	        it('returns false if the second argument is not discendant of the first one', function() {
	            expect(doc.contains(t22, e25)).toBe(false);
	        });
	        it('returns false if the first argument is discendant of the second one', function() {
	            expect(doc.contains(e32, e11)).toBe(false);
	        });
	    });
	    describe('a method to get an element by path that', function(){
	        it('returns nothing if the path is not defined or given as a string, a number, a function or an object', function(){
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
	            invalids.forEach(function(invalid){
	                expect(doc.getNodeByPath(invalid)).not.toBeDefined();
	            });
	        });
	        it('returns nothing if the reference is not given or given as a string, a number, an array, a function or a non-node object', function(){
	            var invalids = ['', 'a string', 0, 1, 4.32, -2, -5.96, [], [1, 2, 3], function(){return;}, {}, {foo: 23}];
	            invalids.forEach(function(invalid){
	                expect(doc.getNodeByPath([], invalid)).not.toBeDefined();
	            });
	        });
	        it('returns the reference node if the path is an empty array', function(){
	            expect(doc.getNodeByPath([], e10)).toBe(e10);
	        });
	        it('returns the first child of the reference node if the path is [0]', function(){
	            expect(doc.getNodeByPath([0], e21)).toBe(e30);
	        });
	        it('returns the last child of the reference node', function(){
	            expect(doc.getNodeByPath([1], e11)).toBe(e26);
	        });
	        it('returns third-generation child', function(){
	            expect(doc.getNodeByPath([0, 1, 1], e00)).toBe(t31);
	        });
	        it('returns nothing if the path contains reference to a non-existent node', function(){
	            expect(doc.getNodeByPath([3, 2, 0], e10)).not.toBeDefined();
	        });
	        it('returns nothing if the path passes through a text node', function(){
	            expect(doc.getNodeByPath([2, 1], e10)).not.toBeDefined();
	        });
	    });
	    describe('a method to find common "head" part of two arrays that' , function(){
	        it('does not modify the content of the input arrays if they have common head', function(){
	            var p1 = [9, 3, 0],
	                p2 = [9, 7];
	            doc.commonHead(p1, p2);
	            expect(p1.length).toBe(3);
	            expect(p1[0]).toBe(9);
	            expect(p1[1]).toBe(3);
	            expect(p1[2]).toBe(0);
	            expect(p2.length).toBe(2);
	            expect(p2[0]).toBe(9);
	            expect(p2[1]).toBe(7);
	        });

	        it('returns nothing if the first argument is a string and the second is not set', function(){
	            expect(doc.commonHead('str')).not.toBeDefined();
	        });

	        it('returns nothing if the first argument is a string and the second is an empty array', function(){
	            expect(doc.commonHead('str', [])).not.toBeDefined();
	        });

	        it('returns nothing if the first argument is an array and the second is a string', function(){
	            expect(doc.commonHead([], 'a string')).not.toBeDefined();
	        });

	        it('returns empty array if both arguments are empty arrays', function(){
	            var res = doc.commonHead([], []);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns empty array if the first argument is an empty array and the second is not', function(){
	            var res = doc.commonHead([], [1, 2, 4]);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns empty array if the second argument is an empty array and the first is not', function(){
	            var res = doc.commonHead([1, 0, 0], []);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns empty array if the arguments have no common head', function(){
	            var res = doc.commonHead([1, 0, 0], [0, 2, 3]);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns empty array if the arguments have no common head', function(){
	            var res = doc.commonHead([1, 0, 0], [0, 2, 3, 3, 1]);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns the input array if the arguments are equal non-empty arrays', function(){
	            var res = doc.commonHead([1, 2, 3], [1, 2, 3]);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(3);
	            expect(res[0]).toBe(1);
	            expect(res[1]).toBe(2);
	            expect(res[2]).toBe(3);
	        });
	        it('returns the first argument if the second array is a concatenation of the first and another array', function(){
	            var res = doc.commonHead([0, 2], [0, 2, 3]);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(2);
	            expect(res[0]).toBe(0);
	            expect(res[1]).toBe(2);
	        });
	        it('returns the second argument if the first array is a concatenation of the second and another array', function(){
	            var res = doc.commonHead([7, 4, 1, 6], [7, 4, 1]);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(3);
	            expect(res[0]).toBe(7);
	            expect(res[1]).toBe(4);
	            expect(res[2]).toBe(1);
	        });
	    });
	    describe('a method to find previous siblings that', function() {
	        it('returns nothing if the argument is not defined or is a string, a number, a function or a non-Node object', function() {
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.prevSiblings(invalid)).not.toBeDefined();
	            });
	        });
	        it('returns empty array if the argument is a unique child', function() {
	            var res = doc.prevSiblings(e32);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns empty array if the argument is a first but not unique child', function() {
	            var res = doc.prevSiblings(e10);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns array with one Node if the argument is a second child', function() {
	            var res = doc.prevSiblings(e26);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(1);
	            expect(res[0]).toBe(e25);
	        });
	        it('returns array with three Nodes if the argument is a fourth child', function() {
	            var res = doc.prevSiblings(e23);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(3);
	            expect(res[0]).toBe(t22);
	            expect(res[1]).toBe(e21);
	            expect(res[2]).toBe(t20);
	        });
	    });
	    describe('a method to find next siblings that', function() {
	        it('returns nothing if the argument is not defined or is a string, a number, a function or a non-Node object', function() {
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.nextSiblings(invalid)).not.toBeDefined();
	            });
	        });
	        it('returns empty array if the argument is a unique child', function() {
	            var res = doc.nextSiblings(e32);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns empty array if the argument is a last but not unique child', function() {
	            var res = doc.nextSiblings(e26);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns array with one Node if the argument is a before-last child', function() {
	            var res = doc.nextSiblings(e23);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(1);
	            expect(res[0]).toBe(t24);
	        });
	        it('returns array with two Nodes if the argument is a second-from-the-end child', function() {
	            var res = doc.nextSiblings(t22);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(2);
	            expect(res[0]).toBe(e23);
	            expect(res[1]).toBe(t24);
	        });
	    });
	    describe('a method to find previous ascendants in given scope that', function() {
	        it('returns nothing if called without arguments', function() {
	            expect(doc.bunchPrevSiblings()).not.toBeDefined();
	        });
	        it('returns nothing if the first argument is invalid one and the second is a valid one', function() {
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.bunchPrevSiblings(invalid, e25)).not.toBeDefined();
	            });
	        });
	        it('returns nothing if the second argument is invalid one and the first is a valid one', function() {
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.bunchPrevSiblings(t20, invalid)).not.toBeDefined();
	            });
	        });
	        it('returns nothing if the input node does not belong to the scope node', function() {
	            expect(doc.bunchPrevSiblings(e21, e11)).not.toBeDefined();
	        });
	        it('returns an empty array if the input node is equal to the scope node', function() {
	            var res = doc.bunchPrevSiblings(e10, e10);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns an array with the node previous siblings if the scope node is the node\'s parent one', function() {
	            var res = doc.bunchPrevSiblings(e23, e10);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(3);
	            expect(res.indexOf(t22) !== -1).toBe(true);
	            expect(res.indexOf(e21) !== -1).toBe(true);
	            expect(res.indexOf(t20) !== -1).toBe(true);
	        });
	        it('returns an empty array if the input node is a unique child of the scope node', function() {
	            var res = doc.bunchPrevSiblings(e32, e25);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns an empty array if the input node is a unique child of unique child of the scope node', function() {
	            var res = doc.bunchPrevSiblings(e32, e11);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns an array with single node if the branch of the input node has no previous siblings', function() {
	            var res = doc.bunchPrevSiblings(e32, e00);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(1);
	            expect(res[0]).toBe(e10);
	        });
	    });
	    describe('a method to find next ascendants in given scope that', function() {
	        it('returns nothing if called without arguments', function() {
	            expect(doc.bunchNextSiblings()).not.toBeDefined();
	        });
	        it('returns nothing if the first argument is invalid one and the second is a valid one', function() {
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.bunchNextSiblings(invalid, e25)).not.toBeDefined();
	            });
	        });
	        it('returns nothing if the second argument is invalid one and the first is a valid one', function() {
	            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.bunchNextSiblings(e23, invalid)).not.toBeDefined();
	            });
	        });
	        it('returns nothing if the input node does not belong to the scope node', function() {
	            expect(doc.bunchNextSiblings(e30, e26)).not.toBeDefined();
	        });
	        it('returns an empty array if the input node is equal to the scope node', function() {
	            var res = doc.bunchNextSiblings(e10, e10);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns an array with the node next siblings if the scope node is the node\'s parent one', function() {
	            var res = doc.bunchNextSiblings(t22, e10);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(2);
	            expect(res.indexOf(e23) !== -1).toBe(true);
	            expect(res.indexOf(t24) !== -1).toBe(true);
	        });
	        it('returns an empty array if the input node is a unique child of the scope node', function() {
	            var res = doc.bunchNextSiblings(e32, e25);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(0);
	        });
	        it('returns an array with single node if the input node has no next siblings in its branch', function() {
	            var res = doc.bunchNextSiblings(t24, e00);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(1);
	            expect(res[0]).toBe(e11);
	        });
	        it('returns an array with different-depth nodes', function() {
	            var res = doc.bunchNextSiblings(e30, e00);
	            expect(Array.isArray(res)).toBe(true);
	            expect(res.length).toBe(5);
	            expect(res.indexOf(t31) !== -1).toBe(true);
	            expect(res.indexOf(t22) !== -1).toBe(true);
	            expect(res.indexOf(e23) !== -1).toBe(true);
	            expect(res.indexOf(t24) !== -1).toBe(true);
	            expect(res.indexOf(e11) !== -1).toBe(true);
	        });
	    });
	    describe('a method indexOf that', function() {
	        it('throws exception if argument either string, number, array, function or non-Node element', function() {
	            var invalids = [undefined, null, '', 'a string', [],
	                [1, 2, 3], 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(function() {
	                    doc.indexOf(invalid);
	                }).toThrow(new Error('The argument must be a Node instance!'));
	            });
	        });
	        it('returns 0 if the element is the first child of its parent', function() {
	            expect(doc.indexOf(e10)).toBe(0);
	        });
	        it('returns 1 for the second child', function() {
	            expect(doc.indexOf(e21)).toBe(1);
	        });
	        it('returns 4 for the last child (among four)', function() {
	            expect(doc.indexOf(t24)).toBe(4);
	        });
	    });
	    describe('a method isTextNode', function() {
	        it('returns true if the argument is a text node with non-empty content', function() {
	            expect(doc.isTextNode(t20)).toBe(true);
	        });
	        it('returns true if the argument is a text node with empty content', function() {
	            expect(doc.isTextNode(document.createTextNode(''))).toBe(true);
	        });
	        it('returns false if the argument is a text node without children', function() {
	            expect(doc.isTextNode(e23)).toBe(false);
	        });
	        it('returns false if the argument is an element node with children', function() {
	            expect(doc.isTextNode(e10)).toBe(false);
	        });
	        it('returns false if the argument is a string', function() {
	            expect(doc.isTextNode('string')).toBe(false);
	        });
	        it('returns false if the argument is missing', function() {
	            expect(doc.isTextNode()).toBe(false);
	        });
	        it('returns false if the argument is a number', function() {
	            expect(doc.isTextNode(34.3)).toBe(false);
	        });
	        it('returns false if the argument is an object', function() {
	            expect(doc.isTextNode({
	                1: 4
	            })).toBe(false);
	        });
	    });
	    describe('a method detachBoundaries that', function() {
	        it('throws an error if its argument is a string, number, function, array or non-Range object', function() {
	            var invalids = ['', 'a string', [],
	                [1, 2, 3], 0, 1, 4.32, -2, -5.96,
	                function() {
	                    return;
	                }, {}, {
	                    foo: 23
	                }
	            ];
	            invalids.forEach(function(invalid) {
	                expect(function() {
	                    doc.detachBoundaries(invalid);
	                }).toThrow(new Error('The argument must be a Range instance!'));
	            });
	        });
	        it('calls "spliceText" with two breakpoints if the range starts and ends in the same text node', function() {
	            range.setStart(t22, 2);
	            range.setEnd(t22, 6);
	            spyOn(doc, 'spliceText');
	            doc.detachBoundaries(range);
	            expect(doc.spliceText).toHaveBeenCalledWith(t22, [2, 6]);
	        });
	        it('returns single text node if the range starts and ends in the same text node', function() {
	            range.setStart(t22, 2);
	            range.setEnd(t22, 6);
	            var nodes = doc.detachBoundaries(range);
	            expect(Array.isArray(nodes)).toBe(true);
	            expect(nodes.length).toBe(1);
	            expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
	            expect(nodes[0].textContent).toBe('xt n');
	        });
	        it('does not call "spliceText" if the range starts and ends in the same element node', function() {
	            range.setStart(e11, 0);
	            range.setEnd(e11, 2);
	            spyOn(doc, 'spliceText');
	            doc.detachBoundaries(range);
	            expect(doc.spliceText).not.toHaveBeenCalled();
	        });
	        it('does not call "spliceText" if the range starts and ends in different element nodes', function() {
	            range.setStart(e00, 0);
	            range.setEnd(e25, 1);
	            spyOn(doc, 'spliceText');
	            doc.detachBoundaries(range);
	            // expect(1).toBe(0);
	            expect(doc.spliceText).not.toHaveBeenCalled();
	        });
	        it('calls "spliceText" for end container if the range starts in the element node but ends in text node', function() {
	            range.setStart(e21, 0);
	            range.setEnd(t24, 4);
	            spyOn(doc, 'spliceText');
	            doc.detachBoundaries(range);
	            expect(doc.spliceText).toHaveBeenCalledWith(t24, [4]);
	        });
	        it('calls "spliceText" for start container if the range starts in the text node but ends in element node', function() {
	            range.setStart(t31, 6);
	            range.setEnd(e11, 1);
	            spyOn(doc, 'spliceText');
	            doc.detachBoundaries(range);
	            expect(doc.spliceText).toHaveBeenCalledWith(t31, [6]);
	        });
	        it('returns boundary nodes', function() {
	            range.setStart(t20, 3);
	            range.setEnd(t24, 1);
	            var nodes = doc.detachBoundaries(range);
	            expect(Array.isArray(nodes)).toBe(true);
	            expect(nodes.length).toBe(2);
	            expect(nodes[0].textContent).toBe('t node 2.0');
	            expect(nodes[1].textContent).toBe('t');
	        });
	    });
	    describe('a method spliceText that', function() {
	        it('returns nothing if the first argument is not Text node', function(){
	            var invalids = ['', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96, function() {return;},
	                {}, {foo: 23}
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.spliceText(invalid)).not.toBeDefined();
	            });
	        });
	        it('does not modify parent of the text node if the breakpoints array is empty', function() {
	            doc.spliceText(t20, []);
	            expect(e10.childNodes.length).toBe(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the breakpoints array is [0]', function() {
	            doc.spliceText(t20, [0]);
	            expect(e10.childNodes.length).toBe(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the breakpoints array is [0, 0, 0]', function() {
	            doc.spliceText(t24, [0]);
	            expect(e10.childNodes.length).toBe(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the unique breakpoint corresponds to the end of the text node', function() {
	            doc.spliceText(t22, [t22.textContent.length]);
	            expect(e10.childNodes.length).toBe(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the breakpoint lays beyond the end of the text node', function() {
	            doc.spliceText(t22, [t22.textContent.length + 10]);
	            expect(e10.childNodes.length).toBe(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('splits the text node in two parts if the breakpoint lays inside the node', function() {
	            doc.spliceText(t22, [7]);
	            expect(e10.childNodes.length).toBe(6);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2] instanceof Text).toBe(true);
	            expect(e10.childNodes[3] instanceof Text).toBe(true);
	            expect(e10.childNodes[2].textContent).toBe('text no');
	            expect(e10.childNodes[3].textContent).toBe('de 2.2');
	            expect(e10.childNodes[4]).toBe(e23);
	            expect(e10.childNodes[5]).toBe(t24);
	        });
	        it('splits the text node in four pieces if the breakpoint contains three increasing numbers', function() {
	            doc.spliceText(t22, [4, 7, 10]);
	            expect(e10.childNodes.length).toBe(8);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2] instanceof Text).toBe(true);
	            expect(e10.childNodes[3] instanceof Text).toBe(true);
	            expect(e10.childNodes[4] instanceof Text).toBe(true);
	            expect(e10.childNodes[5] instanceof Text).toBe(true);
	            expect(e10.childNodes[2].textContent).toBe('text');
	            expect(e10.childNodes[3].textContent).toBe(' no');
	            expect(e10.childNodes[4].textContent).toBe('de ');
	            expect(e10.childNodes[5].textContent).toBe('2.2');
	            expect(e10.childNodes[6]).toBe(e23);
	            expect(e10.childNodes[7]).toBe(t24);
	        });
	        it('splits the text node in three pieces if the breakpoint contains two coincident numbers', function() {
	            doc.spliceText(t22, [4, 4, 10]);
	            expect(e10.childNodes.length).toBe(7);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2] instanceof Text).toBe(true);
	            expect(e10.childNodes[3] instanceof Text).toBe(true);
	            expect(e10.childNodes[4] instanceof Text).toBe(true);
	            expect(e10.childNodes[2].textContent).toBe('text');
	            expect(e10.childNodes[3].textContent).toBe(' node ');
	            expect(e10.childNodes[4].textContent).toBe('2.2');
	            expect(e10.childNodes[5]).toBe(e23);
	            expect(e10.childNodes[6]).toBe(t24);
	        });
	    });
		describe('setter and getter methods for selected nodes that', function(){
			it('getter returns null if the setter is given no input', function(){
				doc.setSelectedNodes();
				expect(doc.getSelectedNodes()).toBe(null);
			});
			it('getter returns null if the setter input is an empty array', function(){
				doc.setSelectedNodes([]);
				expect(doc.getSelectedNodes()).toBe(null);
			});
			it('getter returns null if the setter input is an array containing an empty array', function(){
				doc.setSelectedNodes([[]]);
				expect(doc.getSelectedNodes()).toBe(null);
			});
			it('getter returns array of nodes if the setter input is an array containing non-empty array of nodes', function(){
				doc.setSelectedNodes([[e10, e11]]);
				var arr = doc.getSelectedNodes();
				expect(Array.isArray(arr)).toBe(true);
				expect(arr.length).toBe(1);
				var nodes = arr[0];
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0]).toBe(e10);
				expect(nodes[1]).toBe(e11);
			});
			it('getter returns array of nodes even if the setter innermost array contains non-Node instances ', function(){
				doc.setSelectedNodes([[t20, e21, 'a string', e25]]);
				var arr = doc.getSelectedNodes();
				expect(Array.isArray(arr)).toBe(true);
				expect(arr.length).toBe(1);
				var nodes = arr[0];
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(3);
				expect(nodes[0]).toBe(t20);
				expect(nodes[1]).toBe(e21);
				expect(nodes[2]).toBe(e25);
			});
			it('getter returns array of nodes even if the setter input array contains non-arrays', function(){
				doc.setSelectedNodes([[t20, e21, e25], {foo: 1}, [t31, e32]]);
				var arr = doc.getSelectedNodes();
				expect(Array.isArray(arr)).toBe(true);
				expect(arr.length).toBe(2);
				var nodes0 = arr[0];
				expect(Array.isArray(nodes0)).toBe(true);
				expect(nodes0.length).toBe(3);
				expect(nodes0[0]).toBe(t20);
				expect(nodes0[1]).toBe(e21);
				expect(nodes0[2]).toBe(e25);

				var nodes1 = arr[1];
				expect(Array.isArray(nodes1)).toBe(true);
				expect(nodes1.length).toBe(2);
				expect(nodes1[0]).toBe(t31);
				expect(nodes1[1]).toBe(e32);
			});
		});
		describe('a method flushSelection that', function(){
			it('imposes selected nodes to null if previously nothing was selected', function(){
				expect(doc.getSelectedNodes()).toBe(null);
				doc.flushSelection();
				expect(doc.getSelectedNodes()).toBe(null);
			});
			it('imposes selected nodes to null if previously selection was not emoty', function(){
				doc.setSelectedNodes([[e21, e23], [e32]]);
				expect(doc.getSelectedNodes()).not.toBe(null);
				doc.flushSelection();
				expect(doc.getSelectedNodes()).toBe(null);
			});
		});
		describe('a method nodesOfRange that', function(){
			it('throws an error if the argument is a string, a number, an array, a function or a non-Range instance', function(){
				var invalids = [undefined, null, '', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96,
					function() {return;}, {}, {foo: 23}];
				invalids.forEach(function(invalid) {
				    expect(function(){
				    	doc.nodesOfRange(invalid);
				    }).toThrow(new Error('The argument must be a Range instance!'));
				});
			});
			it('calls method detachBoundaries', function(){
				spyOn(doc, 'detachBoundaries').and.returnValue([]);
				doc.nodesOfRange(range);
				expect(doc.detachBoundaries).toHaveBeenCalledWith(range);
			});
			it('calls method nodesBetween with arguments taken from detachBoundaries output if it returns two element array', function(){
				spyOn(doc, 'detachBoundaries').and.returnValue([e21, e25]);
				spyOn(doc, 'nodesBetween');
				doc.nodesOfRange(range);
				expect(doc.detachBoundaries).toHaveBeenCalledWith(range);
				expect(doc.nodesBetween).toHaveBeenCalledWith(e21, e25);
			});
			it('returns an array with single node if detachBoundaries outputs just one node', function(){
				spyOn(doc, 'detachBoundaries').and.returnValue([t22]);
				spyOn(doc, 'nodesBetween');
				var nodes = doc.nodesOfRange(range);
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(1);
				expect(nodes[0]).toBe(t22);
				expect(doc.detachBoundaries).toHaveBeenCalledWith(range);
			});

			it('returns output of method nodesBetween', function(){
				spyOn(doc, 'detachBoundaries').and.returnValue([t20, e26]);
				spyOn(doc, 'nodesBetween').and.returnValue('whatever');
				expect(doc.nodesOfRange(range)).toBe('whatever');
				expect(doc.detachBoundaries).toHaveBeenCalledWith(range);
				expect(doc.nodesBetween).toHaveBeenCalledWith(t20, e26);
			});
		});
		describe('a method nodesOfSelection that', function(){
			it('returns an empty array if the input is undefined, a null, a string, a number, a function or an object', function(){
				var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
					function() {return;}, {}, {foo: 23}];
				invalids.forEach(function(invalid) {
					var nodes = doc.nodesOfSelection(invalid);
				    expect(nodes).toBeEmptyArray();
				});
			});
			it('returns single element array if the selection is determined by a single range', function(){
				range.setStart(e10, 1);
				range.setEnd(e11, 1);
				var nodes = doc.nodesOfSelection([range]);
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(1);
				var nodes0 = nodes[0];
				expect(nodes0.length).toBe(5);
				expect(nodes0[0]).toBe(e21);
				expect(nodes0[1]).toBe(t22);
				expect(nodes0[2]).toBe(e23);
				expect(nodes0[3]).toBe(t24);
				expect(nodes0[4]).toBe(e25);
			});
			it('returns array with two elements if the selection is determined by two ranges', function(){
				range.setStart(e00, 0);
				range.setEnd(e00, 1);
				var range2 = document.createRange();
				range2.setStart(e11, 1);
				range2.setEnd(e11, 2);
				var nodes = doc.nodesOfSelection([range, range2]);
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(2);
				var nodes0 = nodes[0],
					nodes1 = nodes[1];
				expect(nodes0.length).toBe(1);
				expect(nodes0[0]).toBe(e10);

				expect(nodes1.length).toBe(1);
				expect(nodes1[0]).toBe(e26);
			});
			it('ignores non-array type elements inside input argument', function(){
				range.setStart(e00, 0);
				range.setEnd(e00, 1);
				var range2 = document.createRange();
				range2.setStart(e11, 1);
				range2.setEnd(e11, 2);
				var nodes = doc.nodesOfSelection([range, 'a string', range2]);
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(2);
				var nodes0 = nodes[0],
					nodes1 = nodes[1];
				expect(nodes0.length).toBe(1);
				expect(nodes0[0]).toBe(e10);

				expect(nodes1.length).toBe(1);
				expect(nodes1[0]).toBe(e26);
			});
		});
		describe('a method selectedNodesToText that', function(){
			beforeEach(function(){
				spyOn(doc, 'nodeToText').and.callFake(function(n){
					if (n === t20){return 't20 node';}
					if (n === e21){return 'e21 node';}
					if (n === e23){return 'e23 node';}
					return 'unforeseen node';
				});
			});
			it('returns empty string if getSelectedNodes returns null', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue(null);
				expect(doc.selectedNodesToText()).toBe('');
			});
			it('returns empty string if getSelectedNodes returns an empty array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([]);
				expect(doc.selectedNodesToText()).toBe('');
			});
			it('returns space-concatenated strings if getSelectedNodes returns a single element array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[t20, e21, e23]]);
				expect(doc.selectedNodesToText()).toBe('t20 node e21 node e23 node');
			});
			it('returns strings glued by means of the first argument if getSelectedNodes returns a single element array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[t20, e21, e23]]);
				expect(doc.selectedNodesToText('---')).toBe('t20 node---e21 node---e23 node');
			});
			it('uses default block and element separators if getSelectedNodes returns a two element array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[t20, e21], [e23]]);
				expect(doc.selectedNodesToText()).toBe('t20 node e21 node e23 node');
			});
			it('uses block and element separators if getSelectedNodes returns a two element array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[t20, e21], [e23]]);
				expect(doc.selectedNodesToText('|', '-')).toBe('t20 node|e21 node-e23 node');
			});
		});
		describe('has a method isSelectionEmpty that', function(){
			it('returns true if the selectedNodes is null', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue(null);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns true if the selectedNodes is an empty array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([]);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns true if the selectedNodes contains single element that is an empty array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[]]);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns true if the selectedNodes contains two elements that are empty arrays', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[], []]);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns false if the selectedNodes contains single element that is a non-empty array', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[e10]]);
				expect(doc.isSelectionEmpty()).toBe(false);
			});
			it('returns false if the selectedNodes contains an empty and a non-empty arrays', function(){
				spyOn(doc, 'getSelectedNodes').and.returnValue([[], [e10, t20]]);
				expect(doc.isSelectionEmpty()).toBe(false);
			});
		});
	});

	describe('has a method castToTag that', function(){
		it('returns nothing if the constructor is not provided', function(){
			expect(doc.castTo()).not.toBeDefined();
		});
		it('returns nothing if the costructor is a null, a string, a number, an array or an object', function(){
			var invalids = [null, '', 'hi', 0, -12.3, 234, [], [0, 1], {}, {1: 2}];
			invalids.forEach(function(invalid) {
			    expect(doc.castTo(invalid)).not.toBeDefined();
			});
		});
		it('returns a class instance whose constructor is given by the argument', function(){
			var FakedClass = function(){};
			expect(doc.castTo(FakedClass) instanceof FakedClass).toBe(true);
		});
		it('returns nothing if the constructor throws an error', function(){
			var FakedClass = function(){throw new Error('an error');};
			expect(doc.castTo(FakedClass)).not.toBeDefined();
		});
		it('returns "bare" class instance if it the loader is not provided', function(){
			var FakedClass = function(){};
			expect(doc.castTo(FakedClass) instanceof FakedClass).toBe(true);
		});

		it('returns "bare" class instance if the loader does not exist', function(){
			var FakedClass = function(){};
			expect(doc.castTo(FakedClass, 'loader') instanceof FakedClass).toBe(true);
		});

		it('calls method "loadMultiple" of the constructed class instance', function(){
			var FakedClass = function(){this.loader = function(data){this.a = data.a, this.b = data.b;};};
			var result = doc.castTo(FakedClass, 'loader', {a: 1, b: 2});
			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
		});

		it('returns "bare" instance if the loader throws an exception', function(){
			var FakedClass = function(){this.loader = function(data){throw new Error('error');};};
			var result = doc.castTo(FakedClass, 'loader', {a: 1, b: 2});
			expect(result instanceof FakedClass).toBe(true);
		});

		it('sends a message into a console.log stream if the loader throws an exception', function(){
			var FakedClass = function(){this.loader = function(data){throw new Error('error');};};
			console.log = jasmine.createSpy('log');
			var result = doc.castTo(FakedClass, 'loader', {a: 1, b: 2});
			expect(console.log).toHaveBeenCalled();
		});



	});

});