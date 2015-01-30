/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine, Document, Text, Properties, Node, Element, Range, xdescribe */
var emptyArrayMatcher = {
  toBeEmptyArray: function() {
    return {
      compare: function(actual) {
      	return {'pass': (Array.isArray(actual) && (actual.length === 0))};
      }
    };
  }
};

var nullOrUndefinedMatcher = {
  toBeNullOrUndefined: function(util, customEqualityTesters) {
    return {
      compare: function(actual) {
        return {'pass': (actual === undefined || actual === null), 'message': 'actual value is ' + actual};
      }
    };
  }
};

var numberOfChildrenMatcher = {
  hasChildNodes: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        return {'pass': (actual instanceof Element && actual.childNodes.length === expected)};
      }
    };
  }
};

var tagNameMatcher = {
  hasTagName: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        return {'pass': (actual instanceof Element && actual.tagName.toLowerCase() === expected)};
      }
    };
  }
};



describe('Class "Document"', function() {
    var dom1_div0, doc, dom1_p0, dom1_img0, dom1_a0, dom1_text1, dom1_text2, dom1_text0,
        dom1_div1, dom1_span0, dom1_text3, dom1_ol0, dom1_li0, dom1_li1, dom1_li2, dom1_text4,
        dom1_ul0, dom1_li3, dom1_li4, dom1_br0,
        // disconnected part
        dom2_m00, dom2_m10, dom2_m11,
        clone;


    beforeEach(function() {
        jasmine.addMatchers(emptyArrayMatcher);
        jasmine.addMatchers(nullOrUndefinedMatcher);
        jasmine.addMatchers(numberOfChildrenMatcher);
        jasmine.addMatchers(tagNameMatcher);


        //                    div0
        //         ____________|_________
        //         |           |         |
        //        p0          a0       text0
        //     ____|____       |
        //    |    |    |    text2
        //  text1 img0 div1
        //       _______|______
        //      |       |      |
        //    span0   text3   ol0
        //                 ____|____
        //                |    |    |
        //               li0  li1  li2
        //                |    |
        //             text4  ul0
        //                  ___|____
        //                 |        |
        //                li3      li4
        //                 |
        //                br0


        dom1_div0 = document.createElement('div');
        dom1_p0 = document.createElement('p');
        dom1_text1 = document.createTextNode('Text inside a paragraph.');
        dom1_img0 = document.createElement('img');
        dom1_a0 = document.createElement('a');
        dom1_text2 = document.createTextNode('This is a link.');
        dom1_text0 = document.createTextNode('Some text');
        dom1_div1 = document.createElement('div');
        dom1_span0 = document.createElement('span');
        dom1_text3 = document.createTextNode('middle text node');
        dom1_ol0 = document.createElement('ol');
        dom1_li0 = document.createElement('li');
        dom1_li1 = document.createElement('li');
        dom1_li2 = document.createElement('li');
        dom1_text4 = document.createTextNode('ordered list first item text node');
        dom1_ul0 = document.createElement('ul');
        dom1_li3 = document.createElement('li');
        dom1_li4 = document.createElement('li');
        dom1_br0 = document.createElement('br');


        dom2_m00 = document.createElement('div');
        dom2_m10 = document.createElement('div');
        dom2_m11 = document.createElement('div');


        dom1_div0.appendChild(dom1_p0);
        dom1_div0.appendChild(dom1_a0);
        dom1_div0.appendChild(dom1_text0);
        dom1_p0.appendChild(dom1_text1);
        dom1_p0.appendChild(dom1_img0);
        dom1_p0.appendChild(dom1_div1);
        dom1_a0.appendChild(dom1_text2);

        dom1_div1.appendChild(dom1_span0);
        dom1_div1.appendChild(dom1_text3);
        dom1_div1.appendChild(dom1_ol0);

        dom1_ol0.appendChild(dom1_li0);
        dom1_ol0.appendChild(dom1_li1);
        dom1_ol0.appendChild(dom1_li2);

        dom1_li0.appendChild(dom1_text4);
        dom1_li1.appendChild(dom1_ul0);
        dom1_ul0.appendChild(dom1_li3);
        dom1_ul0.appendChild(dom1_li4);

        dom1_li3.appendChild(dom1_br0);

        dom1_div0.setAttribute('class', 'media');
        dom1_div0.setAttribute('id', 'bodyId');

        dom1_p0.setAttribute('style', 'width: 100%; color: red;');
        dom1_p0.setAttribute('marker', 'p');
        dom1_p0.setAttribute('width', '300px');

        dom1_img0.setAttribute('style', 'width: 100%; color: red;');
        dom1_img0.setAttribute('width', '200px');
        dom1_img0.setAttribute('alt', 'no image available');
        dom1_img0.setAttribute('id', 'imageId');
        dom1_img0.setAttribute('class', 'big bottom');
        dom1_a0.setAttribute('style', 'padding: 20em; width: 87%; color: navy; text-decoration: underline;');
        dom1_a0.setAttribute('href', 'http://www.test.com');
        dom1_a0.setAttribute('title', 'link to test');
        dom1_ol0.setAttribute('style', 'color: yellow;');
        dom1_li0.setAttribute('style', 'background-color: blue');
        dom1_li2.setAttribute('style', 'color: green');

        dom2_m00.appendChild(dom2_m10);
        dom2_m00.appendChild(dom2_m11);

        doc = new Document(dom1_div0);
        clone = dom1_div0.cloneNode(true);

        doc.setFactory(NEWSLETTER.factory);
    });
    xdescribe('has a method "clean" that', function() {
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
            expect(p).hasTagName('p');
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
    xdescribe('has a method to calculate relative widths that', function() {
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
    describe('has a method "findAncestor" that', function() {
        it('throws an error if the scope is set but it does not contain the start node', function() {
            expect(function() {
                doc.findAncestor(dom1_p0, function(){return;}, dom1_a0);
            }).toThrow(new Error('Wrong scope!'));
        });
        it('throws an error if the criteria is either string, array, number, object, null or undefined', function() {
            var invalids = ['', 'hi', [],
                [0, 1], 0, -12.3, 234, null
            ];
            invalids.forEach(function(invalid) {
                expect(function() {
                    doc.findAncestor(dom1_text1, invalid, dom1_p0);
                }).toThrow(new Error('Criteria must be a function!'));
            });
        });
        it('returns nothing if the criteria never returns true', function() {
            expect(doc.findAncestor(dom1_a0, function() {
                return false;
            }, dom1_div0)).not.toBeDefined();
        });
        it('returns the argument if it turns the criteria into true', function() {
            expect(doc.findAncestor(dom1_text1, function(n) {
                return n === dom1_text1;
            }, dom1_div0)).toBe(dom1_text1);
        });
        it('returns scope node if the criteria becomes true only for it and not before', function() {
            expect(doc.findAncestor(dom1_text1, function(n) {
                return n === dom1_div0;
            }, dom1_div0)).toBe(dom1_div0);
        });
        it('returns intermediate node for which the criteria becomes true', function() {
            expect(doc.findAncestor(dom1_img0, function(n) {
                return n === dom1_p0;
            }, dom1_div0)).toBe(dom1_p0);
        });
        it('returns nothing if criteria function always throws exceptions', function() {
            expect(doc.findAncestor(dom1_p0, function() {
                throw new Error('an error!');
            }, dom1_div0)).not.toBeDefined();
        });
        it('returns correct node even if criteria function throws exception on previous calls', function() {
            expect(doc.findAncestor(dom1_text1, function(n) {
                if (n === dom1_p0) {
                    return true;
                }
                throw new Error('manually generated error!');
            }, dom1_div0)).toBe(dom1_p0);
        });
    });

    describe('has a method "findAncestorsOfMany" that returns', function(){
        it('undefined if called without arguments', function(){
            expect(doc.findAncestorsOfMany()).not.toBeDefined();
        });
        it('undefined if called with single argument that is not an array', function(){
            var invalids = [0, -1, 3.11, 9.87, '', 'a string', {}, {'key': 992}, function(){return;}, document.createTextNode('text')];
            invalids.forEach(function(invalid){
                expect(doc.findAncestorsOfMany(invalid)).not.toBeDefined();
            });
        });
        it('undefined if the first argument that is not an array and the second is a function', function(){
            var invalids = [0, -1, 3.11, 9.87, '', 'a string', {}, {'key': 992}, function(){return;}, document.createTextNode('text')];
            var crit = function(){return true;};
            invalids.forEach(function(invalid){
                expect(doc.findAncestorsOfMany(invalid, crit)).not.toBeDefined();
            });
        });
        it('an empty array if the first argument is an empty array while the second is a function', function(){
            var crit = function(){return true;};
            expect(doc.findAncestorsOfMany([], crit)).toBeEmptyArray();
        });
        it('the first argument if it is a duplicate-free array of elements and the criteria always returns true', function(){
            var crit  = function(){return true;};
            var nodes = [dom1_img0, dom1_ol0];
            var res = doc.findAncestorsOfMany(nodes, crit);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(dom1_img0) !== -1).toBe(true);
            expect(res.indexOf(dom1_ol0) !== -1).toBe(true);
        });

        it('a single element array with parent element of the nodes if the criteria evaluates to true on that element', function(){
            var crit  = function(n){return dom1_p0.isEqualNode(n);};
            var nodes = [dom1_img0, dom1_ol0];
            var res = doc.findAncestorsOfMany(nodes, crit);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
            expect(res[0] === dom1_p0).toBe(true);
        });
        it('an empty array if the criteria always evaluates to false', function(){
            expect(doc.findAncestorsOfMany([dom1_img0, dom1_text2, dom1_li4], function(){return false;})).toBeEmptyArray();
        });


    });

	xdescribe('has setter/getter for the document content that', function(){
		it('assignes the content if the argument is a node instance', function(){
			var n = document.createElement('span');
			doc = new Document();
			doc.setContent(n);
			expect(doc.getContent().isEqualNode(n)).toBe(true);
		});
		it('returns nothing if the content is not set', function(){
			doc = new Document();
			expect(doc.getContent()).not.toBeDefined();
		});

		it('leaves the content unchanged if the setter is given a non-node instance', function(){
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
	xdescribe('has a method "nodeToText" that', function(){
		it('returns empty string if the argument is not a node instance', function(){
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

    xdescribe('has a method "commonAncestor" that', function(){
        it('returns the first argument if it contains the second argument', function(){
            expect(doc.commonAncestor(dom1_a0, dom1_text2)).toBe(dom1_a0);
        });

        it('returns the second argument if it contains the first argument', function(){
            expect(doc.commonAncestor(dom1_p0, dom1_div0)).toBe(dom1_div0);
        });

        it('returns null if the nodes have no common parent', function(){
            expect(doc.commonAncestor(dom1_img0, dom2_m10)).toBe(null);
        });

        it('returns the common parent if the nodes are siblings of each other', function(){
            expect(doc.commonAncestor(dom1_text1, dom1_img0)).toBe(dom1_p0);
        });

        it('returns the common parent if the first argument is located deeper than the second', function(){
            expect(doc.commonAncestor(dom1_text1, dom1_a0)).toBe(dom1_div0);
        });

        it('returns the common parent if the second argument is located deeper than the first', function(){
            expect(doc.commonAncestor(dom1_p0, dom1_text2)).toBe(dom1_div0);
        });
    });

    xdescribe('has a method "proxy" that', function(){
        it('returns the argument if it is an Element instance', function(){
            expect(doc.proxy(dom1_p0)).toBe(dom1_p0);
        });

        it('returns the parent node of the argument if it is a text node without siblings', function(){
            expect(doc.proxy(dom1_text2)).toBe(dom1_a0);
        });

        it('returns the argument if it is a text node having next and previous siblings', function(){
            expect(doc.proxy(dom1_text3)).toBe(dom1_text3);
        });

        it('returns the argument if it is a text node having only next siblings', function(){
            expect(doc.proxy(dom1_text1)).toBe(dom1_text1);
        });
        it('returns the argument if it is a text node having only previous siblings', function(){
            expect(doc.proxy(dom1_text0)).toBe(dom1_text0);
        });
    });

    xdescribe('has a method "getMentor" that', function(){
        it('returns null if none of the ancestors has the property set', function(){
            expect(doc.getMentor('text-decoration', dom1_div1)).not.toBeDefined();
        });

        it('returns the second argument if it has the property imposed', function(){
            expect(doc.getMentor('color', dom1_a0)).toBe(dom1_a0);
        });

        it('returns the parent node if it has the property imposed', function(){
            expect(doc.getMentor('color', dom1_img0)).toBe(dom1_img0);
        });

        it('returns the parent node of text node if it has the property imposed', function(){
            expect(doc.getMentor('padding', dom1_text2)).toBe(dom1_a0);
        });
    });

    xdescribe('has a method "getInheritedStyleProp" that', function(){
        it('returns the value of the attribute if the second argument has this property set and the scope node is provided', function(){
            expect(doc.getInheritedStyleProp('color', dom1_img0, dom1_div0)).toBe('red');
        });

        it('returns the value of the attribute if the element has this property and limit node is not set', function(){
            expect(doc.getInheritedStyleProp('padding', dom1_a0)).toBe('20em');
        });

        it('returns the node style property if the limit node is equal to the node', function(){
            expect(doc.getInheritedStyleProp('width', dom1_p0, dom1_p0)).toBe('100%');
        });

        it('returns undefined if the node has no style property if the limit node is equal to the node', function(){
            expect(doc.getInheritedStyleProp('bizzareAttribute', dom1_span0, dom1_span0)).not.toBeDefined();
        });

        it('returns property value of the scope node if no node before has the property set', function(){
            expect(doc.getInheritedStyleProp('color', dom1_li0, dom1_p0)).toBe('red');
        });

        it('returns property value of an ancestor node if the scope node is not provided', function(){
            expect(doc.getInheritedStyleProp('color', dom1_text1)).toBe('red');
        });

        it('returns property value of an ancestor if the scope node does not contain the start node', function(){
            expect(doc.getInheritedStyleProp('width', dom1_div1, dom1_a0)).toBe('100%');
        });

    });


    xdescribe('has a method "toggleElementStyle" that', function(){
        it('sets "color" to alternative value if the element has it set to primary value', function(){
            doc.toggleElementStyle(dom1_p0, 'color', 'red', 'black');
            var stl = dom1_p0.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'black';
            })).toBe(true);
        });

        it('sets "padding" to primary value if the element has it different from primary value', function(){
            doc.toggleElementStyle(dom1_a0, 'padding', '100px', '200px');
            var stl = dom1_a0.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'padding' && tmp[1].trim() === '100px';
            })).toBe(true);
        });

        it('sets "font" to alternative value if the element has no "font" but inherits it to primary value"', function(){
            doc.toggleElementStyle(dom1_div1, 'color', 'red', 'yellow');
            var stl = dom1_div1.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'yellow';
            })).toBe(true);
        });

         it('sets "font" to primary value if the element inherites "font" to not a primary value', function(){
            doc.toggleElementStyle(dom1_div1, 'width', '450px', 'anything');
            var stl = dom1_div1.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '450px';
            })).toBe(true);
        });
    });


    xdescribe('has a method "createToggledElemFromText" that', function(){

        it('creates an element node with "color" property set to secondary value if the text node has it inherited to primary value', function(){
            var n = doc.createToggledElemFromText(dom1_text1, 'color', 'red', 'white'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'white';
            })).toBe(true);
        });

        it('creates an element node with "width" property set to primary value if text node inherits it to a value different from primary value', function(){
            var n = doc.createToggledElemFromText(dom1_text1, 'width', '300em', '20em'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '300em';
            })).toBe(true);
        });

        it('creates an element node with "width" set to alternative value if the text node inherited "font-weight" is equal to primary value', function(){
            var n = doc.createToggledElemFromText(dom1_text2, 'width', '87%', '25pt');
            var stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '25pt';
            })).toBe(true);
        });

        it('creates an element node with "width" set to primary value if the text element inherited "font-weight" is different from primary value', function(){
            var n = doc.createToggledElemFromText(dom1_text2, 'width', '132px', 'anything'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '132px';
            })).toBe(true);
        });

        it('creates an element whose text representation is the original text node', function(){
            var n = doc.createToggledElemFromText(dom1_text1, 'font-weight', 'normal', 'large');
            expect(n).hasChildNodes(1);
            expect(n.firstChild.nodeValue).toBe(dom1_text1.nodeValue);
        });
    });


    xdescribe('has a method "complementNodes" that', function(){
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

    xdescribe('has a method "nailStyleProperty" that', function(){
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

    describe('has a method "dropStyleProperty" that', function(){
        it('does not change DOM if the first argument is a Node that has no style property', function(){
            doc.dropStyleProperty(dom1_span0, 'color');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not change DOM if the first argument is a Text node', function(){
            doc.dropStyleProperty(dom1_text1, 'color');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not change DOM if the first argument is a Node without requested style property', function(){
            doc.dropStyleProperty(dom1_p0, 'text-decoration');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('removes only requested style property', function(){
            doc.dropStyleProperty(dom1_a0, 'color');
            expect(dom1_a0.getAttribute('style').search(/color/) === -1).toBe(true);
            expect(dom1_a0.style.getPropertyValue('padding')).toBe('20em');
            expect(dom1_a0.style.getPropertyValue('width')).toBe('87%');
            expect(dom1_a0.style.getPropertyValue('text-decoration')).toBe('underline');
        });
        it('does not change node\'s attributes', function(){
            doc.dropStyleProperty(dom1_p0, 'color');
            expect(dom1_p0.getAttribute('marker')).toBe('p');
            expect(dom1_p0.getAttribute('width')).toBe('300px');
        });
        it('removes the whole style property if it becomes empty', function(){
            doc.dropStyleProperty(dom1_li0, 'background-color');
            expect(dom1_li0.getAttribute('style')).toBeNull();
        });

    });

    xdescribe('has a method "getStyleProperty" that', function(){
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

        xdescribe('does the following when getting a property', function(){
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



        xdescribe('does the following when setting a property', function(){
            it('return node itself (modified) if the target is an element node', function(){
                var n = doc.setStyleProperty(e3, 'color', 'blue');
                expect(n.nodeType).toBe(dom1_div0.ELEMENT_NODE);
                expect(n.isEqualNode(e3)).toBe(true);
            });

            it('returns a wrapping node if the target is a text node', function(){
                var n = doc.setStyleProperty(t2, 'color', 'blue');
                expect(n.nodeType).toBe(dom1_div0.ELEMENT_NODE);
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

    xdescribe('has a method "switchClassProperty" that', function(){
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

    xdescribe('has a method "getInheritedProperties" that', function(){
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

	xdescribe('works with selection that has', function() {
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
	    xdescribe('a range related functionality that', function() {
	        xdescribe('has a method "isRange" which', function() {
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
	        xdescribe('has a method "appendRange"', function() {
	            it('that does not call setRanges method if the argument is not a valid range', function() {
	                spyOn(doc, 'getRanges');
	                spyOn(doc, 'setRanges');
	                spyOn(doc, 'isRange').and.returnValue(false);
	                doc.appendRange('anything');
	                expect(doc.getRanges).not.toHaveBeenCalled();
	                expect(doc.setRanges).not.toHaveBeenCalled();
	            });
	            xdescribe('which in case when the argument is a valid range,', function() {
	                beforeEach(function() {
	                    spyOn(doc, 'isRange').and.returnValue(true);
	                    spyOn(doc, 'setRanges');
	                });
	                xdescribe('present in _ranges,', function() {
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
	                xdescribe('not present in _ranges,', function() {
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
	        xdescribe('method containsRange', function() {
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
	        xdescribe('method areEqual', function() {
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
	        xdescribe('has a method "rangeCount" that', function() {
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
	        xdescribe('has a method "setRanges" that', function() {
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
	        xdescribe('has nextRange method that', function() {
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
	        xdescribe('has a method "nodesBetween" that', function() {
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
	    xdescribe('a method to compare paths that', function() {
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
	    xdescribe('a method commonAncestor that', function() {
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
	    xdescribe('a method to find the root node that', function() {
	        it('returns nothing if the argument is an undefined, string, number, array, function or a non-node object', function() {
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
	    xdescribe('a method to calculate path to an element that', function() {
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
	    xdescribe('a method contains that', function() {
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
	    xdescribe('a method to get an element by path that', function(){
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
	    xdescribe('a method to find common "head" part of two arrays that' , function(){
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
	    xdescribe('a method to find previous siblings that', function() {
	        it('returns nothing if the argument is not defined or is a string, a number, a function or a non-node object', function() {
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
	        it('returns array with one node if the argument is a second child', function() {
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
	    xdescribe('a method to find next siblings that', function() {
	        it('returns nothing if the argument is not defined or is a string, a number, a function or a non-node object', function() {
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
	        it('returns array with one node if the argument is a before-last child', function() {
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
	    xdescribe('a method to find previous ascendants in given scope that', function() {
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
	    xdescribe('a method to find next ascendants in given scope that', function() {
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
	    xdescribe('a method indexOf that', function() {
	        it('throws exception if argument either string, number, array, function or non-node element', function() {
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
	    xdescribe('a method isTextNode', function() {
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
	    xdescribe('a method detachBoundaries that', function() {
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
	            expect(nodes[0].nodeType).toBe(dom1_div0.TEXT_NODE);
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
	    xdescribe('a method spliceText that', function() {
	        it('returns nothing if the first argument is not text node', function(){
	            var invalids = ['', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96, function() {return;},
	                {}, {foo: 23}
	            ];
	            invalids.forEach(function(invalid) {
	                expect(doc.spliceText(invalid)).not.toBeDefined();
	            });
	        });
	        it('does not modify parent of the text node if the breakpoints array is empty', function() {
	            doc.spliceText(t20, []);
	            expect(e10).hasChildNodes(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the breakpoints array is [0]', function() {
	            doc.spliceText(t20, [0]);
	            expect(e10).hasChildNodes(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the breakpoints array is [0, 0, 0]', function() {
	            doc.spliceText(t24, [0]);
	            expect(e10).hasChildNodes(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the unique breakpoint corresponds to the end of the text node', function() {
	            doc.spliceText(t22, [t22.textContent.length]);
	            expect(e10).hasChildNodes(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('does not modify parent of the text node if the breakpoint lays beyond the end of the text node', function() {
	            doc.spliceText(t22, [t22.textContent.length + 10]);
	            expect(e10).hasChildNodes(5);
	            expect(e10.childNodes[0]).toBe(t20);
	            expect(e10.childNodes[1]).toBe(e21);
	            expect(e10.childNodes[2]).toBe(t22);
	            expect(e10.childNodes[3]).toBe(e23);
	            expect(e10.childNodes[4]).toBe(t24);
	        });
	        it('splits the text node in two parts if the breakpoint lays inside the node', function() {
	            doc.spliceText(t22, [7]);
	            expect(e10).hasChildNodes(6);
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
	            expect(e10).hasChildNodes(8);
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
	            expect(e10).hasChildNodes(7);
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
		xdescribe('setter and getter methods for selected nodes that', function(){
			it('getter returns null if the setter is given no input', function(){
				doc.setSelection();
				expect(doc.getSelection()).toBe(null);
			});
			it('getter returns null if the setter input is an empty array', function(){
				doc.setSelection([]);
				expect(doc.getSelection()).toBe(null);
			});
			it('getter returns null if the setter input is an array containing an empty array', function(){
				doc.setSelection([[]]);
				expect(doc.getSelection()).toBe(null);
			});
			it('getter returns array of nodes if the setter input is an array containing non-empty array of nodes', function(){
				doc.setSelection([[e10, e11]]);
				var arr = doc.getSelection();
				expect(Array.isArray(arr)).toBe(true);
				expect(arr.length).toBe(1);
				var nodes = arr[0];
				expect(Array.isArray(nodes)).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0]).toBe(e10);
				expect(nodes[1]).toBe(e11);
			});
			it('getter returns array of nodes even if the setter innermost array contains non-node instances ', function(){
				doc.setSelection([[t20, e21, 'a string', e25]]);
				var arr = doc.getSelection();
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
				doc.setSelection([[t20, e21, e25], {foo: 1}, [t31, e32]]);
				var arr = doc.getSelection();
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
            it('setter overrides the previous values', function(){
                doc.setSelection([[t20], [t31, e32]]);
                doc.setSelection([[e21, e25]]);
                var arr = doc.getSelection();
                expect(Array.isArray(arr)).toBe(true);
                expect(arr.length).toBe(1);
                var nodes0 = arr[0];
                expect(Array.isArray(nodes0)).toBe(true);
                expect(nodes0.length).toBe(2);
                expect(nodes0[0]).toBe(e21);
                expect(nodes0[1]).toBe(e25);


            });
		});
		xdescribe('a method getSelectionPlain that', function(){
			it('calls getSelection method', function(){
				spyOn(doc, 'getSelection');
				doc.getSelectionPlain();
				expect(doc.getSelection).toHaveBeenCalled();
			});
			it('calls flatten method with output of method getSelection()', function(){
				spyOn(doc, 'getSelection').and.returnValue([1, 2, 3]);
				spyOn(doc, 'flatten');
				doc.getSelectionPlain();
				expect(doc.flatten).toHaveBeenCalledWith([1, 2, 3]);
			});

		});
		xdescribe('a method flushSelection that', function(){
			it('imposes selected nodes to null if previously nothing was selected', function(){
				expect(doc.getSelection()).toBe(null);
				doc.flushSelection();
				expect(doc.getSelection()).toBe(null);
			});
			it('imposes selected nodes to null if previously selection was not empty', function(){
				doc.setSelection([[e21, e23], [e32]]);
				expect(doc.getSelection()).not.toBe(null);
				doc.flushSelection();
				expect(doc.getSelection()).toBe(null);
			});
		});
		xdescribe('a method nodesOfRange that', function(){
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
		xdescribe('a method freezeSelection that', function(){
			it('does not call setSelection if the input is undefined, a null, a string, a number, a function or an object', function(){
				spyOn(doc, 'setSelection');
				var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
					function() {return;}, {}, {foo: 23}];
				invalids.forEach(function(invalid) {
					doc.freezeSelection(invalid);
				});
				expect(doc.setSelection).not.toHaveBeenCalled();
			});

			it('does not set selection if the range is collapsed (=empty) and it is inside an element node', function(){
				range.setStart(e10, 1);
				range.setEnd(e10, 1);
				doc.freezeSelection([range]);
				var nodes = doc.getSelection();
				expect(nodes).toBe(null);
			});

			it('does not set selection if the range is collapsed (=empty) and it is  inside a text node', function(){
				range.setStart(t22, 5);
				range.setEnd(t22, 5);
				doc.freezeSelection([range]);
				var nodes = doc.getSelection();
				expect(nodes).toBe(null);
			});


			it('sets selection if the selection is determined by a single range', function(){
				range.setStart(e10, 1);
				range.setEnd(e11, 1);
				doc.freezeSelection([range]);
				var nodes = doc.getSelection();
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
				doc.freezeSelection([range, range2]);
				var nodes = doc.getSelection();
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
				doc.freezeSelection([range, 'a string', range2]);
				var nodes = doc.getSelection();
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
		xdescribe('a method selectedNodesToText that', function(){
			beforeEach(function(){
				spyOn(doc, 'nodeToText').and.callFake(function(n){
					if (n === t20){return 't20 node';}
					if (n === e21){return 'e21 node';}
					if (n === e23){return 'e23 node';}
					return 'unforeseen node';
				});
			});
			it('returns empty string if getSelection returns null', function(){
				spyOn(doc, 'getSelection').and.returnValue(null);
				expect(doc.selectedNodesToText()).toBe('');
			});
			it('returns empty string if getSelection returns an empty array', function(){
				spyOn(doc, 'getSelection').and.returnValue([]);
				expect(doc.selectedNodesToText()).toBe('');
			});
			it('returns space-concatenated strings if getSelection returns a single element array', function(){
				spyOn(doc, 'getSelection').and.returnValue([[t20, e21, e23]]);
				expect(doc.selectedNodesToText()).toBe('t20 node e21 node e23 node');
			});
			it('returns strings glued by means of the first argument if getSelection returns a single element array', function(){
				spyOn(doc, 'getSelection').and.returnValue([[t20, e21, e23]]);
				expect(doc.selectedNodesToText('---')).toBe('t20 node---e21 node---e23 node');
			});
			it('uses default block and element separators if getSelection returns a two element array', function(){
				spyOn(doc, 'getSelection').and.returnValue([[t20, e21], [e23]]);
				expect(doc.selectedNodesToText()).toBe('t20 node e21 node e23 node');
			});
			it('uses block and element separators if getSelection returns a two element array', function(){
				spyOn(doc, 'getSelection').and.returnValue([[t20, e21], [e23]]);
				expect(doc.selectedNodesToText('|', '-')).toBe('t20 node|e21 node-e23 node');
			});
		});
		xdescribe('has a method "isSelectionEmpty" that', function(){
			it('returns true if the selectedNodes is null', function(){
				spyOn(doc, 'getSelection').and.returnValue(null);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns true if the selectedNodes is an empty array', function(){
				spyOn(doc, 'getSelection').and.returnValue([]);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns true if the selectedNodes contains single element that is an empty array', function(){
				spyOn(doc, 'getSelection').and.returnValue([[]]);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns true if the selectedNodes contains two elements that are empty arrays', function(){
				spyOn(doc, 'getSelection').and.returnValue([[], []]);
				expect(doc.isSelectionEmpty()).toBe(true);
			});
			it('returns false if the selectedNodes contains single element that is a non-empty array', function(){
				spyOn(doc, 'getSelection').and.returnValue([[e10]]);
				expect(doc.isSelectionEmpty()).toBe(false);
			});
			it('returns false if the selectedNodes contains an empty and a non-empty arrays', function(){
				spyOn(doc, 'getSelection').and.returnValue([[], [e10, t20]]);
				expect(doc.isSelectionEmpty()).toBe(false);
			});
		});


		xdescribe('has a method "findInBlock" that', function(){
			it('returns undefined if the arguments are not provided', function(){
				expect(doc.findInBlock()).toBe(undefined);
			});

			it('returns undefined if the first argument is a null, a string, a number, an object', function(){
				var invalids = [null, '', 'hi', 0, -12.3, 234, {}, {1: 2}];
				var crit = function(){return;};
				invalids.forEach(function(invalid) {
				    expect(doc.findInBlock(invalid, crit)).toBe(undefined);
				});
			});

			it('returns undefined if the second argument is a null, a string, a number, an array or an object', function(){
				var invalids = [null, '', 'hi', 0, -12.3, 234, [], [0, 1], {}, {1: 2}];
				invalids.forEach(function(invalid) {
				    expect(doc.findInBlock([], invalid)).toBe(undefined);
				});
			});

			it('returns undefined if the block is empty', function(){
			    expect(doc.findInBlock(function(){return true;})).toBe(undefined);
			});
			it('returns null if the callback always evaluates to false', function(){
				// spyOn(doc, 'getSelection').and.returnValue([[t20, e30, t22], [t24, e32]]);
				var callback = function(){return false;};
			    expect(doc.findInBlock([t20, e30, t22, t24, e32], callback)).toBe(null);
			});

			it('returns a first non-false output of the callback', function(){
				var callback = function(e){return e === e30 ? e30 : false;};
			    expect(doc.findInBlock([t20, e30, t22, t24, e32], callback)).toBe(e30);
			});


			it('returns null if the criteria function always throws an error', function(){
				var callback = function(){throw new Error('an error');};
			    expect(doc.findInBlock([e30, t22, t24, e32], callback)).toBe(null);
			});
		});
		xdescribe('tracks cursor position in such a way that', function(){
			it('the getter returns undefined by default', function(){
				expect(doc.getCursorPosition()).not.toBeDefined();
			});
			it('the getter returns undefined if the setter is given a non-Range instance ', function(){
				var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96,
				    	function() {return;}, {}, {foo: 23}];
				invalids.forEach(function(invalid){
					doc.setCursorPosition(invalid);
					expect(doc.getCursorPosition()).not.toBeDefined();
				});
			});
			it('the getter returns collapsed Range instance if the setter is given a collapsed Range instance', function(){
				var r = document.createRange();
				r.setStart(e10, 1);
				r.setEnd(e10, 1);
				doc.setCursorPosition(r);
				var pos = doc.getCursorPosition();
				expect(pos instanceof Range).toBe(true);
				expect(pos.collapsed).toBe(true);
				expect(pos.startOffset).toBe(1);
				expect(pos.startContainer).toBe(e10);
			});
			it('the getter returns collapsed Range instance if the setter is given a collapsed Range instance', function(){
				var r = document.createRange();
				r.setStart(t22, 2);
				r.setEnd(e11, 1);
				doc.setCursorPosition(r);
				var pos = doc.getCursorPosition();
				expect(pos instanceof Range).toBe(true);
				expect(pos.collapsed).toBe(true);
				expect(pos.startOffset).toBe(2);
				expect(pos.startContainer).toBe(t22);
			});
		});
		xdescribe('a method extendedSearch that', function(){
			it('returns nothing if nothing is selected and cursor position is unknown', function(){
				var crit = jasmine.createSpy('spy callback');
				doc.freezeSelection([]);
				expect(doc.extendedSearch(crit)).not.toBeDefined();
				expect(crit).not.toHaveBeenCalled();
			});
			it('calls callback on a node in which the cursor is located if the selection is empty', function(){
				var r = document.createRange();
				r.setStart(e21, 1);
				r.setEnd(e21, 1);
				var crit = jasmine.createSpy('spy callback');
				doc.freezeSelection([r]);
				doc.extendedSearch(crit);
				expect(crit).toHaveBeenCalledWith(e21);
			});
			it('returns output of the callback if the selection is empty', function(){
				var r = document.createRange();
				r.setStart(e21, 1);
				r.setEnd(e21, 1);
				var foo = {};
				var crit = jasmine.createSpy('spy callback').and.callFake(function(){return foo;});
				doc.freezeSelection([r]);
				expect(doc.extendedSearch(crit)).toBe(foo);
			});
			it('returns nothing if the callback throws an exception and if the selection is empty', function(){
				var r = document.createRange();
				r.setStart(e21, 1);
				r.setEnd(e21, 1);
				var crit = jasmine.createSpy('spy callback').and.callFake(function(){throw new Error('error');});
				doc.freezeSelection([r]);
				expect(doc.extendedSearch(crit)).not.toBeDefined();
			});
			it('calls callback on elements in the selection', function(){
				var crit = jasmine.createSpy('spy callback');
				spyOn(doc, 'getSelectionPlain').and.returnValue(['a', 'b', 'c']);
				expect(doc.extendedSearch(crit)).not.toBeDefined();
				expect(crit).toHaveBeenCalledWith('a');
				expect(crit).toHaveBeenCalledWith('b');
				expect(crit).toHaveBeenCalledWith('c');
			});
			it('returns first true-cast output of the callback on elements in the selection', function(){
				var crit = jasmine.createSpy('spy callback').and.callFake(function(x){return x === 'b' ? 'B' : false;});
				spyOn(doc, 'getSelectionPlain').and.returnValue(['a', 'b', 'c']);
				expect(doc.extendedSearch(crit)).toBe('B');
				expect(crit).toHaveBeenCalledWith('a');
				expect(crit).toHaveBeenCalledWith('b');
				expect(crit).not.toHaveBeenCalledWith('c');
			});

		});

	});

	xdescribe('has a method "flatten" that', function(){
		it('returns null if the input is a string, a number, a function and an object', function(){
			var invalids = ['', 'hi', 0, -12.3, 234, {}, {1: 2}];
			invalids.forEach(function(invalid) {
			    expect(doc.flatten(invalid)).toBe(null);
			});
		});

		it('returns the original array if it has no arrays inside', function(){
			var arr = doc.flatten([5, 'a', 'b', 4]);
			expect(Array.isArray(arr)).toBe(true);
			expect(arr.length).toBe(4);
			expect(arr[0]).toBe(5);
			expect(arr[1]).toBe('a');
			expect(arr[2]).toBe('b');
			expect(arr[3]).toBe(4);
		});


		it('converts empty array into an empty one', function(){
			expect(doc.flatten([])).toBeEmptyArray();
		});

		it('converts array with nested empty arrays into an empty one', function(){
			expect(doc.flatten([[], [], []])).toBeEmptyArray();
		});

		it('ignores nested empty arrays', function(){
			var arr = doc.flatten([5, 'a', [], 'b', []]);
			expect(Array.isArray(arr)).toBe(true);
			expect(arr.length).toBe(3);
			expect(arr[0]).toBe(5);
			expect(arr[1]).toBe('a');
			expect(arr[2]).toBe('b');
		});

		it('ignores nested empty arrays', function(){
			var arr = doc.flatten([5, 'a', [1, 'c', ['e']], 'b', ['x']]);
			expect(Array.isArray(arr)).toBe(true);
			expect(arr.length).toBe(7);
			expect(arr[0]).toBe(5);
			expect(arr[1]).toBe('a');
			expect(arr[2]).toBe(1);
			expect(arr[3]).toBe('c');
			expect(arr[4]).toBe('e');
			expect(arr[5]).toBe('b');
			expect(arr[6]).toBe('x');
		});

		it('does not modify original array', function(){
			var arr = [-5.3, 6, ['a', 'b'], 'c'];
			doc.flatten(arr);
			expect(Array.isArray(arr)).toBe(true);
			expect(arr.length).toBe(4);
			expect(arr[0]).toBe(-5.3);
			expect(arr[1]).toBe(6);
			expect(Array.isArray(arr[2])).toBe(true);
			expect(arr[2].length).toBe(2);
			expect(arr[2][0]).toBe('a');
			expect(arr[2][1]).toBe('b');
			expect(arr[3]).toBe('c');
		});
	});

	xdescribe('has a method "castToTag" that', function(){
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
			var FakedClass = function(){return;};
			expect(doc.castTo(FakedClass) instanceof FakedClass).toBe(true);
		});
		it('returns nothing if the constructor throws an error', function(){
			var FakedClass = function(){throw new Error('an error');};
			expect(doc.castTo(FakedClass)).not.toBeDefined();
		});
		it('returns "bare" class instance if it the loader is not provided', function(){
			var FakedClass = function(){return;};
			expect(doc.castTo(FakedClass) instanceof FakedClass).toBe(true);
		});

		it('returns "bare" class instance if the loader does not exist', function(){
			var FakedClass = function(){return;};
			expect(doc.castTo(FakedClass, 'loader') instanceof FakedClass).toBe(true);
		});

		it('calls method "loadMultiple" of the constructed class instance', function(){
			var FakedClass = function(){this.loader = function(data){this.a = data.a; this.b = data.b;};};
			var result = doc.castTo(FakedClass, 'loader', {a: 1, b: 2});
			expect(result.a).toBe(1);
			expect(result.b).toBe(2);
		});

		it('returns "bare" instance if the loader throws an exception', function(){
			var FakedClass = function(){this.loader = function(){throw new Error('error');};};
			var result = doc.castTo(FakedClass, 'loader', {a: 1, b: 2});
			expect(result instanceof FakedClass).toBe(true);
		});

		it('sends a message into a console.log stream if the loader throws an exception', function(){
			var FakedClass = function(){this.loader = function(){throw new Error('error');};};
			console.log = jasmine.createSpy('log');
			doc.castTo(FakedClass, 'loader', {a: 1, b: 2});
			expect(console.log).toHaveBeenCalled();
		});
	});

    xdescribe('has a method "detectTag" that', function(){
        it('returns nothing if it is called without argument', function(){
            expect(doc.detectTag()).toBeNullOrUndefined();

        });
        it('returns nothing if selection and cursor postion are not defined', function(){
            spyOn(doc, 'getCursorPosition');
            spyOn(doc, 'getSelection');
            expect(doc.detectTag('div')).toBeNullOrUndefined();
        });

        it('returns an ancestor of the node where the cursor is postioned', function(){
            var range = document.createRange();
            range.setStart(dom1_div0, 1);
            range.collapse(true);
            spyOn(doc, 'getCursorPosition').and.returnValue(range);
            spyOn(doc, 'getSelection');
            expect(doc.detectTag('div')).toBe(dom1_div0);
        });

        it('returns an ancestor of the selected nodes', function(){
            spyOn(doc, 'getCursorPosition');
            spyOn(doc, 'getSelection').and.returnValue([dom1_img0, dom1_text2]);
            expect(doc.detectTag('p')).toBe(dom1_p0);
        });

        it('returns nothing if the tag name corresponds to no ancestor', function(){
            spyOn(doc, 'getCursorPosition');
            spyOn(doc, 'getSelection').and.returnValue([dom1_img0, dom1_text2]);
            expect(doc.detectTag('h1')).toBeNullOrUndefined();
        });
    });

    xdescribe('has a method "insertNodeAt" method that', function(){
        xdescribe('throws an error if', function(){
            it('it is called without arguments', function() {
                expect(function(){
                    doc.insertNodeAt();
                }).toThrow(new Error('Node instance is expected!'));
            });

            it('if its first argument is not a node instance', function() {
                var invalids = [null, undefined, '', 'non-empty string', 0, 4.123, -4.8, [], [1, 2, 3],
                    {}, {'foo': 1}];
                invalids.forEach(function(invalid){
                    expect(function(){
                        doc.insertNodeAt(invalid, document.createElement('div'), 0);
                    }).toThrow(new Error('Node instance is expected!'));
                });
            });
        });

        xdescribe('when inserting a node at the beginning of a node with two children,', function(){
            var h1, res;
            beforeEach(function(){
                h1 = document.createElement('h1');
                res = doc.insertNodeAt(dom1_p0, h1, 0);
            });

            it('returns the reference to the first argument', function(){
                expect(res).toBe(dom1_p0);
            });

            it('the number of children of the Element node becomes 3', function(){
                expect(res).hasChildNodes(3);
            });

            it('the inserted node becomes the first child', function(){
                expect(res.childNodes[0]).toBe(h1);
            });

            it('the other children remains in the original order', function(){
                expect(res.childNodes[1]).toBe(dom1_text1);
                expect(res.childNodes[2]).toBe(dom1_img0);
            });
        });

        xdescribe('when inserting a node in the middle of a node with three children,', function(){
            var el, res;
            beforeEach(function(){
                el = document.createElement('span');
                res = doc.insertNodeAt(dom1_div0, el, 2);
            });

            it('returns the reference to the first argument', function(){
                expect(res).toBe(dom1_div0);
            });

            it('the number of children of the Element node becomes four', function(){
                expect(res).hasChildNodes(4);
            });

            it('the first child of the resulting node is initial one', function(){
                expect(res.childNodes[0]).toBe(dom1_p0);
            });

            it('the second child of the resulting node is initial one', function(){
                expect(res.childNodes[1]).toBe(dom1_a0);
            });

            it('the thirsd child of the resulting node is the newly inserted one', function(){
                expect(res.childNodes[2]).toBe(el);
            });

            it('the fourth child of the resulting node is the last original one', function(){
                expect(res.childNodes[3]).toBe(dom1_text0);
            });

        });


        xdescribe('when inserting a node at the end of a node with one child,', function(){
            var h1, res;
            beforeEach(function(){
                h1 = document.createElement('h1');
                res = doc.insertNodeAt(dom1_a0, h1, 1);
            });

            it('returns the reference to the first argument', function(){
                expect(res).toBe(dom1_a0);
            });


            it('the number of children of the Element node becomes 2', function(){
                expect(res).hasChildNodes(2);
            });

            it('it returns Element with correct first child', function(){
                expect(res.childNodes[0]).toBe(dom1_text2);
            });

            it('the inserted node becomes the last child', function(){
                expect(res.childNodes[1]).toBe(h1);
            });
        });

        xdescribe('when prepending to a text node', function(){
            var el;
            beforeEach(function(){
                el = document.createElement('div');
            });
            it('another text node, merges them', function(){
                doc.insertNodeAt(dom1_text0, document.createTextNode('new text node'), 0);
                expect(dom1_text0.nodeValue).toBe('new text nodeSome text');
            });
            it('an Element instance, performs insertion before the text node, if the text node is a last child', function(){
                doc.insertNodeAt(dom1_text0, el, 0);
                expect(dom1_div0).hasChildNodes(4);
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
                expect(dom1_div0.childNodes[2]).toBe(el);
                expect(dom1_div0.childNodes[3]).toBe(dom1_text0);
            });
            it('an Element instance, performs insertion before the text node, if the text node is a first child', function(){
                doc.insertNodeAt(dom1_text1, el, 0);
                expect(dom1_p0).hasChildNodes(3);
                expect(dom1_p0.childNodes[0]).toBe(el);
                expect(dom1_p0.childNodes[1]).toBe(dom1_text1);
                expect(dom1_p0.childNodes[2]).toBe(dom1_img0);
             });
        });

        xdescribe('when appending to a text node', function(){
            var el;
            beforeEach(function(){
               el = document.createElement('div');
            });
            it('another text node, merges them', function(){
                doc.insertNodeAt(dom1_text0, document.createTextNode('new text node'), dom1_text0.nodeValue.length);
                expect(dom1_text0.nodeValue).toBe('Some textnew text node');
            });
            it('an Element instance, performs insertion after the text node, if the text node is a last child', function(){
                doc.insertNodeAt(dom1_text0, el, dom1_text0.nodeValue.length);
                expect(dom1_div0).hasChildNodes(4);
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
                expect(dom1_div0.childNodes[2]).toBe(dom1_text0);
                expect(dom1_div0.childNodes[3]).toBe(el);
            });
            it('an Element instance, performs insertion after the text node, if the text node is a first child', function(){
                doc.insertNodeAt(dom1_text1, el, dom1_text1.nodeValue.length);
                expect(dom1_p0).hasChildNodes(3);
                expect(dom1_p0.childNodes[0]).toBe(dom1_text1);
                expect(dom1_p0.childNodes[1]).toBe(el);
                expect(dom1_p0.childNodes[2]).toBe(dom1_img0);
             });
        });

        xdescribe('when inserting inside a text node', function(){
            var el;
            beforeEach(function(){
               el = document.createElement('div');
            });
            it('another text node, splits the target but does not add any node', function(){
                doc.insertNodeAt(dom1_text0, document.createTextNode('new text node'), 4);
                expect(dom1_text0.nodeValue).toBe('Somenew text node text');
            });
            it('splits the text node', function(){
                doc.insertNodeAt(dom1_text0, el, 4);
                expect(dom1_div0).hasChildNodes(5);
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
                expect(dom1_div0.childNodes[2].nodeValue).toBe('Some');
                expect(dom1_div0.childNodes[3]).toBe(el);
                expect(dom1_div0.childNodes[4].nodeValue).toBe(' text');
            });
        });
    });

    xdescribe('has a method "insertLists" that', function(){
        beforeEach(function(){
            clone = dom1_text4.cloneNode(true);
        });
        it('does not modify DOM if the first argument is not an array', function(){
            var r = document.createRange();
            r.setStart(dom1_p0, 1);
            r.setEnd(dom1_a0, 1);
            var invalids = [0, 1, -2, 2.11, {}, {key:'value'}, '', 'string', r];
            invalids.forEach(function(invalid){
                doc.insertLists(invalid, 'ol');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('calls method convertRangeToList if the first argument is non-empty array', function(){
            var r1 = document.createRange(),
                r2 = document.createRange();
            r1.setStart(dom1_p0, 1);
            r1.setEnd(dom1_a0, 1);
            r2.setStart(dom1_text1, 4);
            r2.setEnd(dom1_text1, 6);
            spyOn(doc, 'convertRangeToList');
            doc.insertLists([r1, r2], 'ol');
            expect(doc.convertRangeToList).toHaveBeenCalledWith(r1, 'ol');
            expect(doc.convertRangeToList).toHaveBeenCalledWith(r2, 'ol');
        });
    });

    xdescribe('has a method "convertRangeToList" that', function(){
        it('does not modify DOM if the first argument is not a range', function(){
            var invalids = [0, 1, -2, 2.11, {}, {key:'value'}, '', 'string', [], [1, 2], document.createElement('div')];
            invalids.forEach(function(invalid){
                doc.convertRangeToList(invalid, 'ol');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('does not modify DOM if "nodesOfRange" throws an error', function(){
            var r = document.createRange();
            r.setStart(dom1_text1, 4);
            r.setEnd(dom1_div0, 2);
            spyOn(doc, 'nodesOfRange').and.callFake(function(){throw new Error('testing purpose error');});
            doc.convertRangeToList(r, 'ol');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if "nodesOfRange" returns empty array while the range is not collapsed (is it possible?)', function(){
            var r = document.createRange();
            r.setStart(dom1_text1, 4);
            r.setEnd(dom1_div0, 2);
            spyOn(doc, 'nodesOfRange').and.returnValue([]);
            doc.convertRangeToList(r, 'ol');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });


        it('inserts only one list with one item if the first argument is a collapsed range', function(){
            var r = document.createRange();
            r.setStart(dom1_text1, 4);
            r.collapse(true);
            doc.convertRangeToList(r, 'ol');
            expect(dom1_div0).hasChildNodes(3);
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1]));
            expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2]));

            var ch1New = dom1_div0.childNodes[0];
            expect(ch1New).hasChildNodes(4);
            expect(ch1New.childNodes[0].nodeValue).toBe('Text');
            expect(ch1New.childNodes[1].tagName.toLowerCase()).toBe('ol');
            expect(ch1New.childNodes[1]).hasChildNodes(1);
            expect(ch1New.childNodes[2].nodeValue).toBe(' inside a paragraph.');
            expect(ch1New.childNodes[3].isEqualNode(clone.childNodes[0].childNodes[1])).toBe(true);
        });


        it('converts a paragraph\'s children into list items', function(){
            var r = document.createRange();
            r.setStart(dom1_div0, 0);
            r.setEnd(dom1_p0, 1);
            doc.convertRangeToList(r, 'ul');
            expect(dom1_p0).hasChildNodes(1);
            var list = dom1_p0.childNodes[0];
            expect(list instanceof Element).toBe(true);
            expect(list).hasTagName('ul');
            expect(list).hasChildNodes(2);
            expect(list.childNodes[0].childNodes[0].isEqualNode(dom1_text1)).toBe(true);
            expect(list.childNodes[1].childNodes[0].isEqualNode(dom1_img0)).toBe(true);
        });
        it('converts image node into a list whose first item is the image', function(){
            var r = document.createRange();
            r.setStart(dom1_p0, 1);
            r.setEnd(dom1_p0, 2);
            doc.convertRangeToList(r, 'ol');
            // dom1_p0 is a parent of dom1_img0
            expect(dom1_p0).hasChildNodes(2);
            expect(dom1_p0.childNodes[0]).toBe(dom1_text1);
            expect(dom1_p0.childNodes[1]).hasTagName('ol');
            var list = dom1_p0.childNodes[1];
            expect(list).hasChildNodes(2);
            expect(list.childNodes[0]).hasTagName('li');
            expect(list.childNodes[0].childNodes[0]).toBe(dom1_img0);
        });
        it('inserts a list if the range is empty and it is inside a text node', function(){
            var r = document.createRange();
            r.setStart(dom1_text2, 8);
            r.collapse(true);
            doc.convertRangeToList(r, 'ol');
            expect(dom1_a0).hasChildNodes(3);
            expect(dom1_a0.childNodes[0].nodeValue).toBe('This is ');

            var list = dom1_a0.childNodes[1];
            expect(list).hasTagName('ol');
            expect(list).hasChildNodes(1);
            expect(list.childNodes[0]).hasTagName('li');
            expect(list.childNodes[0]).hasChildNodes(1);
            expect(list.childNodes[0].childNodes[0].nodeValue).toBe('');

            expect(dom1_a0.childNodes[2].nodeValue).toBe('a link.');
        });
        it('converts a text node into a list with two items with the text node being the first one', function(){
            var r = document.createRange();
            r.setStart(dom1_a0, 0);
            r.setEnd(dom1_a0, 1);
            doc.convertRangeToList(r, 'ol');
            expect(dom1_a0).hasChildNodes(1);
            expect(dom1_a0.childNodes[0]).hasTagName('ol');
            expect(dom1_a0.childNodes[0]).hasChildNodes(2);
            expect(dom1_a0.childNodes[0].childNodes[0]).hasTagName('li');
            expect(dom1_a0.childNodes[0].childNodes[0]).hasChildNodes(1);
            expect(dom1_a0.childNodes[0].childNodes[0].childNodes[0].nodeValue).toBe('This is a link.');
        });
    });

    describe('has a method "changeListType" that', function(){
        it('calls method changeListTypeOfRange if the first argument is a range instance', function(){
            spyOn(doc, 'changeListTypeOfRange');
            var r = document.createRange();
            r.setStart(dom1_a0, 0);
            r.setEnd(dom1_a0, 1);
            doc.changeListType(r, 'old', 'new');
            expect(doc.changeListTypeOfRange).toHaveBeenCalledWith(r, 'old', 'new');
        });

        it('does not call method changeListTypeOfRange if the first argument is neither Range nor is array', function(){
            spyOn(doc, 'changeListTypeOfRange');
            var invalids = [0, 1, -5.31, '', 'a string', [], {key: 'value'}, function(){return;}];
            invalids.forEach(function(invalid){
                doc.changeListType(invalid, 'old', 'new');
            });
            expect(doc.changeListTypeOfRange).not.toHaveBeenCalled();
        });

        it('calls method changeListTypeOfRange on each element of the first argument if they are all Range instances', function(){
            spyOn(doc, 'changeListTypeOfRange');
            var r1 = document.createRange(),
                r2 = document.createRange(),
                r3 = document.createRange();
            doc.changeListType([r1, r2, r3], 'ul', 'ol');
            expect(doc.changeListTypeOfRange).toHaveBeenCalledWith(r1, 'ul', 'ol');
            expect(doc.changeListTypeOfRange).toHaveBeenCalledWith(r2, 'ul', 'ol');
            expect(doc.changeListTypeOfRange).toHaveBeenCalledWith(r3, 'ul', 'ol');
        });

        it('calls method changeListTypeOfRange only on Range instances of the first argument', function(){
            spyOn(doc, 'changeListTypeOfRange');
            var r1 = document.createRange(),
                r2 = document.createRange();
            doc.changeListType([1, r1, 'string', null, {}, r2], 'ul', 'ol');
            expect(doc.changeListTypeOfRange).toHaveBeenCalledWith(r1, 'ul', 'ol');
            expect(doc.changeListTypeOfRange).toHaveBeenCalledWith(r2, 'ul', 'ol');
        });

        it('does not call method changeListTypeOfRange on non-Range instances of the first argument', function(){
            spyOn(doc, 'changeListTypeOfRange');
            var r1 = document.createRange(),
                r2 = document.createRange(),
                el = document.createElement('div');
            doc.changeListType([1, r1, 'string', el, r2], 'ul', 'ol');
            expect(doc.changeListTypeOfRange).not.toHaveBeenCalledWith(1, 'ul', 'ol');
            expect(doc.changeListTypeOfRange).not.toHaveBeenCalledWith('string', 'ul', 'ol');
            expect(doc.changeListTypeOfRange).not.toHaveBeenCalledWith(el, 'ul', 'ol');
        });

        it('does not call method changeListTypeOfRange if the first argument contains no Range instances', function(){
            spyOn(doc, 'changeListTypeOfRange');
             var el = document.createElement('div');
            doc.changeListType(['', el, [], null], 'ul', 'ol');
            expect(doc.changeListTypeOfRange).not.toHaveBeenCalled();
        });
    });

    describe('has a method "changeListTypeOfRange " that', function(){
        beforeEach(function(){
            clone = dom1_div0.cloneNode(true);
        });
        it('leaves DOM unmodified if it is called without arguments', function(){
            doc.changeListTypeOfRange();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('leaves DOM unmodified if the first argument is not a Range instance, while the rest - are valid strings', function(){
            var invalids = [0, -4, 32.1, -22.99, '', 'string', {}, {'key': 'value'}, document.createElement('span')];
            invalids.forEach(function(invalid){
                doc.changeListTypeOfRange(invalid, 'ol', 'ul');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('leaves DOM unmodified if the cursor positon has no list ascendant', function(){
            var r = document.createRange();
            r.setStart(dom1_p0, 0);
            r.collapse(true);
            doc.changeListTypeOfRange(r, 'ol', 'ul');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('leaves DOM unmodified if the cursor positon has a list ascendant but of different type', function(){
            var r = document.createRange();
            r.setStart(dom1_ol0, 0);
            r.collapse(true);
            doc.changeListTypeOfRange(r, 'ul', 'ol');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('leaves DOM unmodified if the selection includes multiple nodes but none of them has list ascendant', function(){
            var r = document.createRange();
            r.setStart(dom1_p0, 2);
            r.setEnd(dom1_a0, 0);
            doc.changeListTypeOfRange(r, 'ul', 'ol');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        describe('when asked to change the list of type "ol" while the cursor is located inside its first item', function(){
            var listOrig, listNew, r;
            beforeEach(function(){
                r = document.createRange();
                r.setStart(dom1_text4, 2);
                r.collapse(true);

                listOrig = clone.childNodes[0].childNodes[2].childNodes[2];
            });
            it('changes the type of the list', function(){
                doc.changeListTypeOfRange(r, 'ol', 'ul');
                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                expect(listNew.tagName.toLowerCase()).toBe('ul');
            });
            it('does not change the list items', function(){
                doc.changeListTypeOfRange(r, 'ol', 'ul');
                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                expect(listNew.childNodes.length).toBe(3);
                expect(listNew.childNodes[0].isEqualNode(listOrig.childNodes[0]));
                expect(listNew.childNodes[1].isEqualNode(listOrig.childNodes[1]));
                expect(listNew.childNodes[2].isEqualNode(listOrig.childNodes[2]));
            });
            it('does not change the rest of DOM', function(){
                doc.changeListTypeOfRange(r, 'ol', 'ul');
                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];

                expect(dom1_div0.childNodes.length).toBe(3);
                expect(dom1_div0.childNodes[0].childNodes[0].isEqualNode(clone.childNodes[0].childNodes[0]));
                expect(dom1_div0.childNodes[0].childNodes[1].isEqualNode(clone.childNodes[0].childNodes[1]));
                expect(dom1_div0.childNodes[0].childNodes[2].childNodes[0].isEqualNode(clone.childNodes[0].childNodes[2].childNodes[0]));
                expect(dom1_div0.childNodes[0].childNodes[2].childNodes[1].isEqualNode(clone.childNodes[0].childNodes[2].childNodes[1]));
                expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1]));
                expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2]));
            });
        });

        describe('has a method "setListNodeType" that', function(){
            it('does not modify DOM if called without arguments', function(){
                doc.setListNodeType();
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });

            it('returns false if called without arguments', function(){
                doc.setListNodeType();
                expect(doc.setListNodeType()).toBe(false);
            });

            it('does not modify DOM and returns false if the first argument is not a Node and the second is a string', function(){
                var invalids = [0, -4, 32.1, -22.99, '', 'string', [], [1, 2, 3], {}, {'key': 'value'}];
                invalids.forEach(function(invalid){
                    expect(doc.setListNodeType(invalid, 'a string')).toBe(false);
                    expect(dom1_div0.isEqualNode(clone)).toBe(true);
                });
            });

            it('does not modify DOM if the first argument does not correspond to a list node', function(){
                doc.setListNodeType(dom1_div1, 'ul');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });

            it('returns false if the first argument does not correspond to a list node', function(){
                expect(doc.setListNodeType(dom1_div1, 'ul')).toBe(false);
            });

            it('does not modify DOM and returns false if some internal method (i.e. getFactory) throws an exception', function(){
                spyOn(doc, 'getFactory').and.throwError('an error');
                expect(doc.setListNodeType(dom1_ol0, 'ul')).toBe(false);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });

            it('transforms an ordered list into unordered one and returns true', function(){
                expect(doc.setListNodeType(dom1_ol0, 'ul')).toBe(true);
                expect(dom1_div1.childNodes[2].tagName.toLowerCase()).toBe('ul');
            });
            it('transforms an unordered list into ordered one and returns true', function(){
                expect(doc.setListNodeType(dom1_ul0, 'ol')).toBe(true);
                expect(dom1_li1.childNodes[0].tagName.toLowerCase()).toBe('ol');
            });

        });

        describe('when asked to change the list of type "ol" while the cursor is located in a nested list of type "ul"', function(){
            var listOrig, listNew, r, innerListNew, innerListOrig;
            beforeEach(function(){
                r = document.createRange();
                r.setStart(dom1_ul0, 1);
                r.collapse(true);

                doc.changeListTypeOfRange(r, 'ol', 'ul');

                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                listOrig = clone.childNodes[0].childNodes[2].childNodes[2];

                innerListNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2].childNodes[1].childNodes[0];
                innerListOrig =     clone.childNodes[0].childNodes[2].childNodes[2].childNodes[1].childNodes[0];
            });


            it('changes the type of the outer list', function(){
                expect(listNew.tagName.toLowerCase()).toBe('ul');
            });

            it('does not change the number of items of the outer list', function(){
                expect(listNew.childNodes.length).toBe(listOrig.childNodes.length);
            });


            it('does not change the type of the inner list', function(){
                expect(innerListNew.tagName.toLowerCase()).toBe('ul');
            });

            it('does not change the number of items of the inner list', function(){
                expect(innerListNew.childNodes.length).toBe(innerListOrig.childNodes.length);
            });
        });

        describe('when the selection contains multiple nodes and ancestors of some of them are lists of sought type', function(){
            var listOrig, listNew, r;
            beforeEach(function(){
                r = document.createRange();
                r.setStart(dom1_text1, 2);
                r.setStart(dom1_ul0, 1);
                doc.changeListTypeOfRange(r, 'ol', 'ul');

                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                listOrig = clone.childNodes[0].childNodes[2].childNodes[2];
            });
            it('changes the type of ordered list', function(){
                expect(listNew.tagName.toLowerCase()).toBe('ul');
            });
            it('does not change the number of items of the list that has undergone the type changing', function(){
                expect(listNew.childNodes.length).toBe(listOrig.childNodes.length);
            });

            it('does not change the nodes that have no list among their ascendants', function(){
                expect(dom1_div0.childNodes.length).toBe(3);
                expect(dom1_div0.childNodes[0].childNodes[0].isEqualNode(clone.childNodes[0].childNodes[0]));
                expect(dom1_div0.childNodes[0].childNodes[1].isEqualNode(clone.childNodes[0].childNodes[1]));
                expect(dom1_div0.childNodes[0].childNodes[2].childNodes[0].isEqualNode(clone.childNodes[0].childNodes[2].childNodes[0]));
                expect(dom1_div0.childNodes[0].childNodes[2].childNodes[1].isEqualNode(clone.childNodes[0].childNodes[2].childNodes[1]));
                expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1]));
                expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2]));
            });

        });


    });

    xdescribe('has a method "changeListTypeOfRange" that', function(){
        var list, li1, li2, li3, li4, text4, ch12, ch13, ch14;
        beforeEach(function(){
            list = document.createElement('ol');
            li1 = document.createElement('li');
            li2 = document.createElement('li');
            li3 = document.createElement('li');
            li4 = document.createElement('li');
            text4 = document.createTextNode('text inside first item');
            ch12 = document.createElement('div');
            ch13 = document.createElement('span');
            ch14 = document.createElement('br');
            li1.appendChild(text4);
            li2.appendChild(ch12);
            li3.appendChild(ch14);
            li4.appendChild(ch13);
            list.appendChild(li1);
            list.appendChild(li2);
            list.appendChild(li3);
            list.appendChild(li4);
            dom1_p0.appendChild(list);

            clone = dom1_div0.cloneNode(true);
        });

        it('leaves DOM unmodified if it does not contain sought list', function(){
            var r = document.createRange();
            r.setStart(dom1_a0, 0);
            r.setEnd(dom1_a0, 1);
            doc.changeListTypeOfRange(r, 'no list with such a tag', 'ol');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not switch the type of an ordered list if the cursor is located outside of the list element', function(){
            var r = document.createRange();
            r.setStart(dom1_a0, 0);
            r.setEnd(dom1_a0, 1);
            doc.changeListTypeOfRange(r, 'ol', 'ul');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('converts the list type if the range corresponds to a position inside the first list item', function(){
            var r = document.createRange();
            r.setStart(text4, 4);
            r.collapse(true);
            doc.changeListTypeOfRange(r, 'ol', 'ul');

            expect(dom1_div0.childNodes[0].childNodes[2]).hasTagName('ul');
        });

        it('leaves unchanged those DOM elements that do not belong to the list', function(){
            var r = document.createRange();
            r.setStart(list, 1);
            r.setEnd(list, 2);
            doc.changeListTypeOfRange(r, 'ol', 'ul');


            expect(dom1_div0.childNodes.length).toBe(3);
            var firstChild = dom1_div0.childNodes[0],
                firstChildClone = clone.childNodes[0];

            expect(firstChild.childNodes.length).toBe(3);
            expect(firstChild.childNodes[0].isEqualNode(firstChildClone.childNodes[0])).toBe(true);
            expect(firstChild.childNodes[1].isEqualNode(firstChildClone.childNodes[1])).toBe(true);
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
            expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
        });

        it('does not change the number of list items of the list', function(){
            var r = document.createRange();
            r.setStart(list, 2);
            r.setEnd(list, 3);
            doc.changeListTypeOfRange(r, 'ol', 'ul');

            expect(dom1_div0.childNodes[0].childNodes[2].childNodes.length).toBe(4);
        });

        it('does not change the content of list items', function(){
            var r = document.createRange();
            r.setStart(text4, 2);
            r.setEnd(list, 3);
            doc.changeListTypeOfRange(r, 'ol', 'ul');

            var newListItems = dom1_div0.childNodes[0].childNodes[2].childNodes,
                oldListItems = clone.childNodes[0].childNodes[2].childNodes;
            expect(newListItems[0].childNodes[0].isEqualNode(oldListItems[0].childNodes[0])).toBe(true);
            expect(newListItems[1].childNodes[0].isEqualNode(oldListItems[1].childNodes[0])).toBe(true);
            expect(newListItems[2].childNodes[0].isEqualNode(oldListItems[2].childNodes[0])).toBe(true);
            expect(newListItems[3].childNodes[0].isEqualNode(oldListItems[3].childNodes[0])).toBe(true);
        });
    });

    describe('has a method "convertToBold" that', function(){
        beforeEach(function(){
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called with no argument', function(){
            doc.convertToBold();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the argument is a number, a string, an object or a function', function(){
            var invalids = [0, 1, 3.21, -43.19, '', 'string', {}, {1: 'foo'}, function(){return;}, document.createElement('div')];
            invalids.forEach(function(invalid){
                doc.convertToBold(invalid);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });

        it('does not modify DOM if the argument is an empty array', function(){
            doc.convertToBold([]);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls method "convertRangeToBold" on each element of the input array', function(){
            spyOn(doc, 'convertRangeToBold');
            var r1 = {}, r2 = {}, r3 = {};
            doc.convertToBold([r1, r2, r3]);
            expect(doc.convertRangeToBold).toHaveBeenCalledWith(r1);
            expect(doc.convertRangeToBold).toHaveBeenCalledWith(r2);
            expect(doc.convertRangeToBold).toHaveBeenCalledWith(r3);
        });
    });

    describe('has a method "convertRangeToBold" that', function(){
        beforeEach(function(){
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called with no argument', function(){
            doc.convertRangeToBold();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not modify DOM if the argument is a number, a string, an object, an array or a function', function(){
            var invalids = [0, 1, 3.21, -43.19,
                '', 'string',
                {}, {1: 'foo'},
                [], [1, 2, 3],
                function(){return;},
                document.createElement('div')
            ];
            invalids.forEach(function(invalid){
                doc.convertRangeToBold(invalid);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });

        it('does not modify DOM if the argument is a collapsed range', function(){
            var r = document.createRange();
            r.setStart(dom1_div1, 1);
            r.collapse(true);
            doc.convertRangeToBold(r);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls "accentuateNodesStyleProperty" using the output of "nodesOfRange"', function(){
            var aRange = document.createRange();
            var fakeNode1 = {},
                fakeNode2 = {},
                fakeOutput = [fakeNode1, fakeNode2];
            spyOn(doc, 'nodesOfRange').and.returnValue(fakeOutput);
            spyOn(doc, 'accentuateNodesStyleProperty');
            doc.convertRangeToBold(aRange);
            expect(doc.nodesOfRange).toHaveBeenCalledWith(aRange);
            expect(doc.accentuateNodesStyleProperty).toHaveBeenCalledWith(fakeOutput, 'font-weight', 'bold');
        });

        it('does not modify DOM if "nodesOfRange" throws an exception', function(){
            var aRange = document.createRange();
            spyOn(doc, 'nodesOfRange').and.throwError('an error');
            doc.convertRangeToBold(aRange);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });



        xdescribe('does the following if the range contains only a text node which inherits font-weight attribute:', function(){
            var r;
            beforeEach(function(){
                clone = dom1_div0.cloneNode(true);
                r = document.createRange();
                r.setStart(dom1_p0, 0);
                r.setEnd(dom1_p0, 1);
                doc.convertRangeToBold(r);
            });

            it('moves the text node inside a new element node that replaces that text node', function(){
                expect(dom1_text1.parentNode).toBe(dom1_p0.childNodes[0]);
            });

            it('inserts an element node with "font-weight" style property set to "bold"', function(){
                var stl = dom1_text1.parentNode.getAttribute('style'),
                    res = stl.match(/font-weight:\s+bold/);

                expect(Array.isArray(res)).toBe(true);
                expect(res.length).toBe(1);
            });

            it('does not modify the rest of DOM', function(){
                // control that the root still has three children
                expect(dom1_div0.childNodes.length).toBe(3);
                // control that the second and the third children of root's first child have not been changed
                expect(dom1_div0.childNodes[0].childNodes.length).toBe(3);
                expect(dom1_div0.childNodes[0].childNodes[1].isEqualNode(clone.childNodes[0].childNodes[1])).toBe(true);
                expect(dom1_div0.childNodes[0].childNodes[2].isEqualNode(clone.childNodes[0].childNodes[2])).toBe(true);
                // control that the second and the third children of the root have not been changed
                expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
                expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
            });
        });
    });

    describe('has a method "accentuateNodesStyleProperty" that', function(){
        beforeEach(function(){
            clone = dom1_div0.cloneNode(true);
        });

        it('throws an error if the first argument is not set, a string, a number, an object or a function', function(){
            var invalids = [null, undefined, 0, 1, 12.98, -12, -3.22, '', 'some string', {}, {key: 3}, function(){return;}];
            invalids.forEach(function(invalid){
                expect(function(){
                    doc.accentuateNodesStyleProperty(invalid, 'margin', '30em');
                }).toThrow(new Error('Set of nodes must be given as an array!'));
            });
        });
        it('does not call "accentuateSingleNodeStyleProperty" method if the first argument is an empty array', function(){
            spyOn(doc, 'accentuateSingleNodeStyleProperty');
            doc.accentuateNodesStyleProperty([], 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).not.toHaveBeenCalled();
        });

        it('calls "accentuateSingleNodeStyleProperty" method if the first argument contains only Node instances', function(){
            spyOn(doc, 'accentuateSingleNodeStyleProperty');
            doc.accentuateNodesStyleProperty([dom1_span0, dom1_text2, dom1_ul0], 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_span0, 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_text2, 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_ul0, 'key', 'value');
        });
        it('calls "accentuateSingleNodeStyleProperty" method two times if the first array contains 2 Node and 3 non-Node instances ', function(){
            spyOn(doc, 'accentuateSingleNodeStyleProperty');
            var invalids = ['a string', document.createRange(), []];
            doc.accentuateNodesStyleProperty([invalids[0], invalids[1], dom1_p0, invalids[2], dom1_li0], 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty.calls.count()).toBe(2);
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_p0, 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_li0, 'key', 'value');
        });
    });

    describe('has a method "accentuateSingleNodeStyleProperty" that', function(){
        describe('when setting font color of a "red color" paragraph to become blue', function(){
            var pNew, pOrig;
            beforeEach(function(){
                doc.accentuateSingleNodeStyleProperty(dom1_p0, 'color', 'blue');
                // introduce notations
                pNew = dom1_div0.childNodes[0];
                pOrig = clone.childNodes[0];
            });
            it('makes the paragraph have blue color font', function(){
                expect(pNew.getAttribute('style').search(/color:\s+blue/) !== -1).toBe(true);
            });
            it('does not change the other nodes', function(){
                // root must have three children
                expect(dom1_div0.childNodes.length).toBe(3);
                // the paragraph must still have three children
                expect(pNew.childNodes.length).toBe(3);
                // paragraph children must remain without changes
                expect(pNew.childNodes[0].isEqualNode(pOrig.childNodes[0])).toBe(true);
                expect(pNew.childNodes[1].isEqualNode(pOrig.childNodes[1])).toBe(true);
                expect(pNew.childNodes[2].isEqualNode(pOrig.childNodes[2])).toBe(true);

                // the root's second and third children must remain without changes
                expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
                expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
            });

            it('the other paragraph\'s style properties remain without changes', function(){
                expect(pNew.style.width).toBe('100%');
            });

            it('the paragraph\'s attributes remain without changes', function(){
                expect(pNew.getAttribute('marker')).toBe('p');
                expect(pNew.getAttribute('width')).toBe('300px');
            });
        });
        describe('when setting a text-decoration of a list node that does not inherit text-decoration', function(){
            var listNew, listOrig;
            beforeEach(function(){
                doc.accentuateSingleNodeStyleProperty(dom1_ol0, 'text-decoration', 'underline');
                // introduce notations
                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                listOrig = clone.childNodes[0].childNodes[2].childNodes[2];
            });
            it('sets the text-decoration of the list node',function(){
                expect(listNew.getAttribute('style').search(/text-decoration:\s+underline/) !== -1).toBe(true);
            });
            it('does not change the rest of DOM', function(){
                // root must have three children
                expect(dom1_div0.childNodes.length).toBe(3);

                // root's first child (denoted p) must still have three children
                var p = dom1_div0.childNodes[0];
                expect(p.childNodes.length).toBe(3);

                // p's first and second child must remain without changes
                expect(p.childNodes[0].isEqualNode(clone.childNodes[0].childNodes[0])).toBe(true);
                expect(p.childNodes[1].isEqualNode(clone.childNodes[0].childNodes[1])).toBe(true);

                // p's third child (denoted divNew) must still have three children
                var divNew = p.childNodes[2];
                var divOrig = clone.childNodes[0].childNodes[2];
                expect(divNew.childNodes.length).toBe(3);

                // divs's first and second child must remain without changes
                expect(divNew.childNodes[0].isEqualNode(divOrig.childNodes[0])).toBe(true);
                expect(divNew.childNodes[1].isEqualNode(divOrig.childNodes[1])).toBe(true);

                // divNew's third child (which is the list node) must become different
                expect(divNew.childNodes[2].isEqualNode(divOrig.childNodes[2])).toBe(false);

                // listNew must still have three children
                expect(listNew.childNodes.length).toBe(3);
                // listNew child nodes must remain the same
                expect(listNew.childNodes[0].isEqualNode(listOrig.childNodes[0])).toBe(true);
                expect(listNew.childNodes[1].isEqualNode(listOrig.childNodes[1])).toBe(true);
                expect(listNew.childNodes[2].isEqualNode(listOrig.childNodes[2])).toBe(true);

                // the root's second and third children must remain without changes
                expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
                expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
            });
        });
        describe('when setting a color of a node that inherits different color value,', function(){
            var mentorNew, mentorOrig;
            beforeEach(function(){
                // preparing spies the method depends on
                spyOn(doc, 'proxy').and.returnValue(dom1_li1);
                spyOn(doc, 'dropStyleProperty');
                doc.accentuateSingleNodeStyleProperty(dom1_ul0, 'color', 'white');
                // introduce notations
                mentorNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                mentorOrig = clone.childNodes[0].childNodes[2].childNodes[2];
            });
            afterEach(function(){
                expect(doc.proxy).toHaveBeenCalledWith(dom1_ul0);
            });
            it('sets color property of node\'s proxy', function(){
                 expect(mentorNew.childNodes[1].getAttribute('style').search(/color:\s+white/) !== -1).toBe(true);
            });
            it('sets color property of mentor\'s first child to be equal to mentor\'s original value', function(){
                 expect(mentorNew.childNodes[0].getAttribute('style').search(/color:\s+yellow/) !== -1).toBe(true);
            });
            it('does not change color property of mentor\'s third child', function(){
                 expect(mentorNew.childNodes[2].getAttribute('style').search(/color:\s+green/) !== -1).toBe(true);
            });
            it('removes color property from mentor style', function(){
                 expect(doc.dropStyleProperty).toHaveBeenCalledWith(mentorNew, 'color');
            });
        });

        it('does not modify DOM if the value of inherited property is equal to required one', function(){
            doc.accentuateSingleNodeStyleProperty(dom1_span0, 'color', 'red');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

    });

    describe('has a method "suggestStyleProperty" that', function(){
        beforeEach(function(){
            clone = dom1_div0.cloneNode(true);
        });

        it('throws an error if the first argument is not defined, a number, a string, an array or an object', function(){
            var invalids = [null, undefined, 0, 1, 12.98, -12, -3.22, '', 'some string', {}, {key: 3}, function(){return;}];
            invalids.forEach(function(invalid){
                expect(function(){
                    doc.suggestStyleProperty(invalid, 'margin', '30em');
                }).toThrow(new Error('It is illegal to suggest a property to a non-Node instance!'));
            });
        });

        it('does not modify DOM if the node has a style property equal to the suggested value', function(){
            doc.suggestStyleProperty(dom1_a0, 'color', 'navy');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the node has a style property that differs from the suggested value', function(){
            doc.suggestStyleProperty(dom1_p0, 'width', '87px');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls "setStyleProperty" method if the node is a text Node', function(){
            spyOn(doc, 'setStyleProperty');
            doc.suggestStyleProperty(dom1_text1, 'width', '31%');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(dom1_text1, 'width', '31%');
        });

        it('calls "setStyleProperty" method if the node does not have the required property', function(){
            spyOn(doc, 'setStyleProperty');
            doc.suggestStyleProperty(dom1_a0, 'margin', '2em');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(dom1_a0, 'margin', '2em');
        });


        it('modifies DOM if the first argument is a text Node', function(){
            doc.suggestStyleProperty(dom1_text0, 'color', 'blue');
            expect(dom1_div0.childNodes.length).toBe(3);
            // root's first child must remain the same
            expect(dom1_div0.childNodes[0].isEqualNode(clone.childNodes[0])).toBe(true);
            // root's second child must remain the same
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);

            // parent of the original text node must the root's third child
            expect(dom1_div0.childNodes[2] === dom1_text0.parentNode).toBe(true);
            // root's third child must have suggested property
            expect(dom1_div0.childNodes[2].style.color).toBe('blue');
        });
    });

    describe('has a method "setStyleProperty" that', function(){
        beforeEach(function(){
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called without arguments', function(){
            doc.setStyleProperty();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not modify DOM if the first argument is a number, a string, an array, a non-Node object, a function', function(){
            var invalids = [null, undefined, 0, 1, 12.98, -12, -3.22, '', 'some string', {}, {key: 3}, function(){return;}];
            invalids.forEach(function(invalid){
                doc.setStyleProperty(invalid, 'margin', '30em');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('does not modify DOM if the second argument is not set', function(){
            doc.setStyleProperty(dom1_ol0);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the second argument is a number, an array, an empty string, an object, a function', function(){
            var invalids = [[], [1, 2, 3], '', {}, {key: 3}, function(){return;}];
            invalids.forEach(function(invalid){
                doc.setStyleProperty(dom1_span0, invalid, '30em');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('does not modify DOM if the third argument is an array, an empty string, an object, a function', function(){
            var invalids = [[], [1, 2, 3], '', {}, {key: 3}, function(){return;}];
            invalids.forEach(function(invalid){
                doc.setStyleProperty(dom1_span0, 'padding', invalid);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('sets a property if its value is given as a number', function(){
            doc.setStyleProperty(dom1_ol0, 'width', 30);
            expect(dom1_ol0.getAttribute('style').search(/width:\s+30/) !== -1).toBe(true);
        });

        describe('when asking to set a new property of an Element node', function(){
            beforeEach(function(){
                doc.setStyleProperty(dom1_p0, 'margin', '61pt');
            });

            it('assigns that style property to the element', function(){
                expect(dom1_p0.style.margin).toBe('61pt');
            });

            it('does not modify the rest of DOM', function(){
                expect(dom1_div0.childNodes.length).toBe(3);

                // root's first child still has three child nodes
                expect(dom1_div0.childNodes[0].childNodes.length).toBe(3);
                expect(dom1_div0.childNodes[0].childNodes[0].isEqualNode(clone.childNodes[0].childNodes[0])).toBe(true);
                expect(dom1_div0.childNodes[0].childNodes[1].isEqualNode(clone.childNodes[0].childNodes[1])).toBe(true);
                expect(dom1_div0.childNodes[0].childNodes[2].isEqualNode(clone.childNodes[0].childNodes[2])).toBe(true);

                // root's second child must remain the same
                expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
                // root's third child must remain the same
                expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
            });

            it('does not change the original attributes of the Element instance', function(){
                // the number of the attributes must not change (+1 due to "style" attribute)
                expect(dom1_p0.attributes.length).toBe(2+1);
                // attributes' values must not change
                expect(dom1_p0.getAttribute('marker')).toBe('p');
                expect(dom1_p0.getAttribute('width')).toBe('300px');
            });

            it('does not change the original style properties of the Element instance', function(){
                expect(dom1_p0.style.width).toBe('100%');
                expect(dom1_p0.style.color).toBe('red');
            });
        });
        describe('when asking to set a property of a Text node', function(){
            beforeEach(function(){
                doc.setStyleProperty(dom1_text2, 'width', '109em');
            });

            it('creates an element node that has requested style property', function(){
                expect(dom1_div0.childNodes[1].childNodes[0].style.width).toBe('109em');
            });

            it('replaces the text node by the newly created element', function(){
                expect(dom1_div0.childNodes[1].childNodes[0] === dom1_text2.parentNode).toBe(true);
            });

        });
    });

    describe('has a method commonStyleProperty that', function(){
        it('returns "undefined" if it is called without arguments', function(){
            expect(doc.commonStyleProperty()).not.toBeDefined();
        });
        it('returns "undefined" if the first argument is valid, but the second is not set', function(){
            expect(doc.commonStyleProperty([dom1_img0, dom1_a0])).not.toBeDefined();
        });
        it('returns "undefined" if the first argument is an empty array', function(){
            expect(doc.commonStyleProperty([], 'whatever')).not.toBeDefined();
        });
        it('returns "undefined" if nodes nodes have no common value of the style property', function(){
            expect(doc.commonStyleProperty([dom1_img0, dom1_div1, dom1_a0], 'padding')).not.toBeDefined();
        });
        it('returns value of the style property if the nodes have the same value of this property', function(){
            dom1_span0.setAttribute('style', 'color: yellow; width: 55em');
            dom1_a0.setAttribute('style', 'color: yellow; padding: 100pt');
            dom1_ol0.setAttribute('style', 'width: 10%; color: yellow');
            expect(doc.commonStyleProperty([dom1_a0, dom1_span0, dom1_ol0], 'color')).toBe('yellow');
        });
        it('returns "undefined" if the nodes have different values of this property', function(){
            dom1_span0.setAttribute('style', 'color: yellow; width: 55em');
            dom1_a0.setAttribute('style', 'color: red; padding: 100pt');
            dom1_ol0.setAttribute('style', 'width: 10%; color: yellow');
            expect(doc.commonStyleProperty([dom1_a0, dom1_span0, dom1_ol0], 'color')).not.toBeDefined();
        });

        it('returns value of the style property if the nodes inherit the same value of this property', function(){
            dom1_div0.setAttribute('style', 'font-size: 12em; width: 55em');        // dom1_text0 ancestor
            dom1_div1.setAttribute('style', 'color: yellow; font-size: 12em');      // dom1_li2 ancestor
            expect(doc.commonStyleProperty([dom1_text0, dom1_li2], 'font-size')).toBe('12em');
        });

        it('returns value of the style property if the nodes inherit different values of this property', function(){
            dom1_div0.setAttribute('style', 'font-size: 11em; width: 55em');        // dom1_text0 ancestor
            dom1_div1.setAttribute('style', 'color: yellow; font-size: 12em');      // dom1_li2 ancestor
            expect(doc.commonStyleProperty([dom1_text0, dom1_li2], 'font-size')).not.toBeDefined();
        });
    });




});