/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, jasmine, Document, Text, Properties, Node, Element, Range, xdescribe,NEWSLETTER */
var emptyArrayMatcher = {
    toBeEmptyArray: function() {
        return {
            compare: function(actual) {
                return {
                    'pass': (Array.isArray(actual) && (actual.length === 0))
                };
            }
        };
    }
};

var nullOrUndefinedMatcher = {
    toBeNullOrUndefined: function(util, customEqualityTesters) {
        return {
            compare: function(actual) {
                return {
                    'pass': (actual === undefined || actual === null),
                    'message': 'actual value is ' + actual
                };
            }
        };
    }
};

var numberOfChildrenMatcher = {
    hasChildNodes: function(util, customEqualityTesters) {
        return {
            compare: function(actual, expected) {
                return {
                    'pass': (actual instanceof Element && actual.childNodes.length === expected)
                };
            }
        };
    }
};

var tagNameMatcher = {
    hasTagName: function(util, customEqualityTesters) {
        return {
            compare: function(actual, expected) {
                return {
                    'pass': (actual instanceof Element && actual.tagName.toLowerCase() === expected)
                };
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

    describe('has a method "findAncestor" that', function() {
        it('throws an error if the scope is set but it does not contain the start node', function() {
            expect(function() {
                doc.findAncestor(dom1_p0, function() {
                    return;
                }, dom1_a0);
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

    describe('has a method "findAncestorsOfMany" that returns', function() {
        it('undefined if called without arguments', function() {
            expect(doc.findAncestorsOfMany()).not.toBeDefined();
        });
        it('undefined if called with single argument that is not an array', function() {
            var invalids = [0, -1, 3.11, 9.87, '', 'a string', {}, {
                'key': 992
            }, function() {
                return;
            }, document.createTextNode('text')];
            invalids.forEach(function(invalid) {
                expect(doc.findAncestorsOfMany(invalid)).not.toBeDefined();
            });
        });
        it('undefined if the first argument that is not an array and the second is a function', function() {
            var invalids = [0, -1, 3.11, 9.87, '', 'a string', {}, {
                'key': 992
            }, function() {
                return;
            }, document.createTextNode('text')];
            var crit = function() {
                return true;
            };
            invalids.forEach(function(invalid) {
                expect(doc.findAncestorsOfMany(invalid, crit)).not.toBeDefined();
            });
        });
        it('an empty array if the first argument is an empty array while the second is a function', function() {
            var crit = function() {
                return true;
            };
            expect(doc.findAncestorsOfMany([], crit)).toBeEmptyArray();
        });
        it('the first argument if it is a duplicate-free array of elements and the criteria always returns true', function() {
            var crit = function() {
                return true;
            };
            var nodes = [dom1_img0, dom1_ol0];
            var res = doc.findAncestorsOfMany(nodes, crit);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(dom1_img0) !== -1).toBe(true);
            expect(res.indexOf(dom1_ol0) !== -1).toBe(true);
        });

        it('a single element array with parent element of the nodes if the criteria evaluates to true on that element', function() {
            var crit = function(n) {
                return dom1_p0.isEqualNode(n);
            };
            var nodes = [dom1_img0, dom1_ol0];
            var res = doc.findAncestorsOfMany(nodes, crit);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
            expect(res[0] === dom1_p0).toBe(true);
        });
        it('an empty array if the criteria always evaluates to false', function() {
            expect(doc.findAncestorsOfMany([dom1_img0, dom1_text2, dom1_li4], function() {
                return false;
            })).toBeEmptyArray();
        });


    });



    describe('has a method "proxy" that', function() {
        it('returns the argument if it is an Element instance', function() {
            expect(doc.proxy(dom1_p0)).toBe(dom1_p0);
        });

        it('returns the parent node of the argument if it is a text node without siblings', function() {
            expect(doc.proxy(dom1_text2)).toBe(dom1_a0);
        });

        it('returns the argument if it is a text node having next and previous siblings', function() {
            expect(doc.proxy(dom1_text3)).toBe(dom1_text3);
        });

        it('returns the argument if it is a text node having only next siblings', function() {
            expect(doc.proxy(dom1_text1)).toBe(dom1_text1);
        });
        it('returns the argument if it is a text node having only previous siblings', function() {
            expect(doc.proxy(dom1_text0)).toBe(dom1_text0);
        });
    });

    describe('has a method "getMentor" that', function() {
        it('returns null if none of the ancestors has the property set', function() {
            expect(doc.getMentor('text-decoration', dom1_div1)).not.toBeDefined();
        });

        it('returns the second argument if it has the property imposed', function() {
            expect(doc.getMentor('color', dom1_a0)).toBe(dom1_a0);
        });

        it('returns the parent node if it has the property imposed', function() {
            expect(doc.getMentor('color', dom1_img0)).toBe(dom1_img0);
        });

        it('returns the parent node of text node if it has the property imposed', function() {
            expect(doc.getMentor('padding', dom1_text2)).toBe(dom1_a0);
        });
    });

    describe('has a method "getInheritedStyleProp" that', function() {
        it('returns the value of the attribute if the second argument has this property set and the scope node is provided', function() {
            expect(doc.getInheritedStyleProp('color', dom1_img0, dom1_div0)).toBe('red');
        });

        it('returns the value of the attribute if the element has this property and limit node is not set', function() {
            expect(doc.getInheritedStyleProp('padding', dom1_a0)).toBe('20em');
        });

        it('returns the node style property if the limit node is equal to the node', function() {
            expect(doc.getInheritedStyleProp('width', dom1_p0, dom1_p0)).toBe('100%');
        });

        it('returns undefined if the node has no style property if the limit node is equal to the node', function() {
            expect(doc.getInheritedStyleProp('bizzareAttribute', dom1_span0, dom1_span0)).not.toBeDefined();
        });

        it('returns property value of the scope node if no node before has the property set', function() {
            expect(doc.getInheritedStyleProp('color', dom1_span0, dom1_p0)).toBe('red');
        });

        it('returns property value of an ancestor node if the scope node is not provided', function() {
            expect(doc.getInheritedStyleProp('color', dom1_text1)).toBe('red');
        });

        it('returns property value of an ancestor if the scope node does not contain the start node', function() {
            expect(doc.getInheritedStyleProp('width', dom1_div1, dom1_a0)).toBe('100%');
        });

    });

    describe('has a method "complementNodes" that', function() {
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
        beforeEach(function() {
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

        it('returns empty array if start node and end node coincide', function() {
            var res = doc.complementNodes(e21, e21);
            expect(res).toBeEmptyArray();
        });

        it('returns empty array if end node is a unique child of the start node', function() {
            var res = doc.complementNodes(e34, e41);
            expect(res).toBeEmptyArray();
        });

        it('throws an error if the start node is not a parent of the end node', function() {
            expect(function() {
                return doc.complementNodes(e11, e40);
            }).toThrow(new Error("Start node must contain the end one!"));
        });

        it('returns array with two nodes if the start node has three children and the end node is one of them', function() {
            var res = doc.complementNodes(e20, e31);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e30) !== -1).toBe(true);
            expect(res.indexOf(e32) !== -1).toBe(true);
        });

        it('returns array containing a sibling of the end node and its "high level cousins"', function() {
            var res = doc.complementNodes(e10, e30);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(4);
            expect(res.indexOf(e31) !== -1).toBe(true);
            expect(res.indexOf(e32) !== -1).toBe(true);
            expect(res.indexOf(e21) !== -1).toBe(true);
            expect(res.indexOf(e22) !== -1).toBe(true);
        });

        it('does not loose any node even if path from start node to end node contains a node with unique child', function() {
            var res = doc.complementNodes(e21, e50);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e51) !== -1).toBe(true);
            expect(res.indexOf(e34) !== -1).toBe(true);
        });
    });

    describe('has a method "dropStyleProperty" that', function() {
        it('does not change DOM if the first argument is a Node that has no style property', function() {
            doc.dropStyleProperty(dom1_span0, 'color');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not change DOM if the first argument is a Text node', function() {
            doc.dropStyleProperty(dom1_text1, 'color');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not change DOM if the first argument is a Node without requested style property', function() {
            doc.dropStyleProperty(dom1_p0, 'text-decoration');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('removes only requested style property', function() {
            doc.dropStyleProperty(dom1_a0, 'color');
            expect(dom1_a0.getAttribute('style').search(/color/) === -1).toBe(true);
            expect(dom1_a0.style.getPropertyValue('padding')).toBe('20em');
            expect(dom1_a0.style.getPropertyValue('width')).toBe('87%');
            expect(dom1_a0.style.getPropertyValue('text-decoration')).toBe('underline');
        });
        it('does not change node\'s attributes', function() {
            doc.dropStyleProperty(dom1_p0, 'color');
            expect(dom1_p0.getAttribute('marker')).toBe('p');
            expect(dom1_p0.getAttribute('width')).toBe('300px');
        });
        it('removes the whole style property if it becomes empty', function() {
            doc.dropStyleProperty(dom1_li0, 'background-color');
            expect(dom1_li0.getAttribute('style')).toBeNull();
        });

    });

    describe('has a method "insertAt" method that', function() {
        describe('when inserting a node at the beginning of a node with three children,', function() {
            var h1, res;
            beforeEach(function() {
                h1 = document.createElement('h1');
                doc.insertAt(dom1_p0, h1, 0);
            });

            it('the number of children of the Element node becomes 4', function() {
                expect(dom1_p0).hasChildNodes(4);
                // expect(dom1_p0.childNodes.length).toBe(4);
            });

            it('the inserted node becomes the first child', function() {
                expect(dom1_p0.childNodes[0]).toBe(h1);
            });

            it('the other children remains in the original order', function() {
                expect(dom1_p0.childNodes[1]).toBe(dom1_text1);
                expect(dom1_p0.childNodes[2]).toBe(dom1_img0);
                expect(dom1_p0.childNodes[3]).toBe(dom1_div1);
            });
        });

        describe('when inserting a node in the middle of a node with three children,', function() {
            var el, res;
            beforeEach(function() {
                el = document.createElement('span');
                doc.insertAt(dom1_div0, el, 2);
            });


            it('the number of children of the Element node becomes four', function() {
                expect(dom1_div0).hasChildNodes(4);
            });

            it('the first child of the resulting node is initial one', function() {
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
            });

            it('the second child of the resulting node is initial one', function() {
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
            });

            it('the thirsd child of the resulting node is the newly inserted one', function() {
                expect(dom1_div0.childNodes[2]).toBe(el);
            });

            it('the fourth child of the resulting node is the last original one', function() {
                expect(dom1_div0.childNodes[3]).toBe(dom1_text0);
            });

        });


        describe('when inserting a node at the end of a node with one child,', function() {
            var h1, res;
            beforeEach(function() {
                h1 = document.createElement('h1');
                doc.insertAt(dom1_a0, h1, 1);
            });

            it('the number of children of the Element node becomes 2', function() {
                expect(dom1_a0).hasChildNodes(2);
            });

            it('it returns Element with correct first child', function() {
                expect(dom1_a0.childNodes[0]).toBe(dom1_text2);
            });

            it('the inserted node becomes the last child', function() {
                expect(dom1_a0.childNodes[1]).toBe(h1);
            });
        });

        describe('when prepending to a text node', function() {
            var el;
            beforeEach(function() {
                el = document.createElement('div');
            });
            it('another text node, merges them', function() {
                doc.insertAt(dom1_text0, document.createTextNode('new text node'), 0);
                expect(dom1_text0.nodeValue).toBe('new text nodeSome text');
            });
            it('an Element instance, performs insertion before the text node, if the text node is a last child', function() {
                doc.insertAt(dom1_text0, el, 0);
                expect(dom1_div0).hasChildNodes(4);
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
                expect(dom1_div0.childNodes[2]).toBe(el);
                expect(dom1_div0.childNodes[3]).toBe(dom1_text0);
            });
            it('an Element instance, performs insertion before the text node, if the text node is a first child', function() {
                doc.insertAt(dom1_text1, el, 0);
                expect(dom1_p0).hasChildNodes(4);
                expect(dom1_p0.childNodes[0]).toBe(el);
                expect(dom1_p0.childNodes[1]).toBe(dom1_text1);
                expect(dom1_p0.childNodes[2]).toBe(dom1_img0);
                expect(dom1_p0.childNodes[3]).toBe(dom1_div1);
            });
        });

        describe('when appending to a text node', function() {
            var el;
            beforeEach(function() {
                el = document.createElement('div');
            });
            it('another text node, merges them', function() {
                doc.insertAt(dom1_text0, document.createTextNode('new text node'), dom1_text0.nodeValue.length);
                expect(dom1_text0.nodeValue).toBe('Some textnew text node');
            });
            it('an Element instance, performs insertion after the text node, if the text node is a last child', function() {
                doc.insertAt(dom1_text0, el, dom1_text0.nodeValue.length);
                expect(dom1_div0).hasChildNodes(4);
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
                expect(dom1_div0.childNodes[2]).toBe(dom1_text0);
                expect(dom1_div0.childNodes[3]).toBe(el);
            });
            it('an Element instance, performs insertion after the text node, if the text node is a first child', function() {
                doc.insertAt(dom1_text1, el, dom1_text1.nodeValue.length);
                expect(dom1_p0).hasChildNodes(4);
                expect(dom1_p0.childNodes[0]).toBe(dom1_text1);
                expect(dom1_p0.childNodes[1]).toBe(el);
                expect(dom1_p0.childNodes[2]).toBe(dom1_img0);
                expect(dom1_p0.childNodes[3]).toBe(dom1_div1);
            });
        });

        describe('when inserting inside a text node', function() {
            var el;
            beforeEach(function() {
                el = document.createElement('div');
            });
            it('another text node, splits the target but does not add any node', function() {
                doc.insertAt(dom1_text0, document.createTextNode('new text node'), 4);
                expect(dom1_text0.nodeValue).toBe('Somenew text node text');
            });
            it('splits the text node', function() {
                doc.insertAt(dom1_text0, el, 4);
                expect(dom1_div0).hasChildNodes(5);
                expect(dom1_div0.childNodes[0]).toBe(dom1_p0);
                expect(dom1_div0.childNodes[1]).toBe(dom1_a0);
                expect(dom1_div0.childNodes[2].nodeValue).toBe('Some');
                expect(dom1_div0.childNodes[3]).toBe(el);
                expect(dom1_div0.childNodes[4].nodeValue).toBe(' text');
            });
        });
    });

    describe('has a method "selectionToList" that', function() {
        beforeEach(function() {
            clone = dom1_text4.cloneNode(true);
        });
        it('calls method rangeToList if the first argument is non-empty array', function() {
            var r1 = document.createRange(),
                r2 = document.createRange();
            r1.setStart(dom1_p0, 1);
            r1.setEnd(dom1_a0, 1);
            r2.setStart(dom1_text1, 4);
            r2.setEnd(dom1_text1, 6);
            spyOn(doc, 'rangeToList');
            doc.selectionToList([r1, r2], 'ol');
            expect(doc.rangeToList).toHaveBeenCalledWith(r1, 'ol');
            expect(doc.rangeToList).toHaveBeenCalledWith(r2, 'ol');
        });
    });

    describe('has a method "convertToBold" that', function() {
        beforeEach(function() {
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called with no argument', function() {
            doc.convertToBold();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the argument is a number, a string, an object or a function', function() {
            var invalids = [0, 1, 3.21, -43.19, '', 'string', {}, {
                1: 'foo'
            }, function() {
                return;
            }, document.createElement('div')];
            invalids.forEach(function(invalid) {
                doc.convertToBold(invalid);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });

        it('does not modify DOM if the argument is an empty array', function() {
            doc.convertToBold([]);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls method "modifyRangeStyleProperty" on each element of the input array', function() {
            spyOn(doc, 'modifyRangeStyleProperty');
            var r1 = {},
                r2 = {},
                r3 = {};
            doc.convertToBold([r1, r2, r3]);
            expect(doc.modifyRangeStyleProperty).toHaveBeenCalledWith(r1, 'font-weight', 'bold');
            expect(doc.modifyRangeStyleProperty).toHaveBeenCalledWith(r2, 'font-weight', 'bold');
            expect(doc.modifyRangeStyleProperty).toHaveBeenCalledWith(r3, 'font-weight', 'bold');
        });
    });

    describe('has a method "convertToItalics" that', function() {
        beforeEach(function() {
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called with no argument', function() {
            doc.convertToItalics();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the argument is a number, a string, an object or a function', function() {
            var invalids = [0, 1, 3.21, -43.19, '', 'string', {}, {
                1: 'foo'
            }, function() {
                return;
            }, document.createElement('div')];
            invalids.forEach(function(invalid) {
                doc.convertToItalics(invalid);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });

        it('does not modify DOM if the argument is an empty array', function() {
            doc.convertToItalics([]);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls method "modifyRangeStyleProperty" on each element of the input array', function() {
            spyOn(doc, 'modifyRangeStyleProperty');
            var r1 = {},
                r2 = {},
                r3 = {};
            doc.convertToItalics([r1, r2, r3]);
            expect(doc.modifyRangeStyleProperty).toHaveBeenCalledWith(r1, 'font-style', 'italic');
            expect(doc.modifyRangeStyleProperty).toHaveBeenCalledWith(r2, 'font-style', 'italic');
            expect(doc.modifyRangeStyleProperty).toHaveBeenCalledWith(r3, 'font-style', 'italic');
        });
    });

    describe('has a method "modifyRangeStyleProperty" that', function() {
        beforeEach(function() {
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called with no argument', function() {
            doc.modifyRangeStyleProperty();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not modify DOM if the argument is a number, a string, an object, an array or a function', function() {
            var invalids = [0, 1, 3.21, -43.19,
                '', 'string', {}, {
                    1: 'foo'
                },
                [],
                [1, 2, 3],
                function() {
                    return;
                },
                document.createElement('div')
            ];
            invalids.forEach(function(invalid) {
                doc.modifyRangeStyleProperty(invalid, 'font-weight', 'bold');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });

        it('does not modify DOM if the argument is a collapsed range', function() {
            var r = document.createRange();
            r.setStart(dom1_div1, 1);
            r.collapse(true);
            doc.modifyRangeStyleProperty(r, 'font-weight', 'bold');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls "accentuateNodesStyleProperty" using the output of "nodesOfRange"', function() {
            var aRange = document.createRange();
            var fakeNode1 = {},
                fakeNode2 = {},
                fakeOutput = [fakeNode1, fakeNode2];
            spyOn(doc, 'nodesOfRange').and.returnValue(fakeOutput);
            spyOn(doc, 'accentuateNodesStyleProperty');
            doc.modifyRangeStyleProperty(aRange, 'font-weight', 'bold');
            expect(doc.nodesOfRange).toHaveBeenCalledWith(aRange);
            expect(doc.accentuateNodesStyleProperty).toHaveBeenCalledWith(fakeOutput, 'font-weight', 'bold');
        });

        it('does not modify DOM if "nodesOfRange" throws an exception', function() {
            var aRange = document.createRange();
            spyOn(doc, 'nodesOfRange').and.throwError('an error');
            doc.modifyRangeStyleProperty(aRange, 'font-weight', 'bold');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });



        describe('does the following if the range contains only a text node which inherits font-weight attribute:', function() {
            var r;
            beforeEach(function() {
                clone = dom1_div0.cloneNode(true);
                r = document.createRange();
                r.setStart(dom1_p0, 0);
                r.setEnd(dom1_p0, 1);
                doc.modifyRangeStyleProperty(r, 'font-weight', 'bold');
            });

            it('moves the text node inside a new element node that replaces that text node', function() {
                expect(dom1_text1.parentNode).toBe(dom1_p0.childNodes[0]);
            });

            it('inserts an element node with "font-weight" style property set to "bold"', function() {
                var stl = dom1_text1.parentNode.getAttribute('style'),
                    res = stl.match(/font-weight:\s+bold/);

                expect(Array.isArray(res)).toBe(true);
                expect(res.length).toBe(1);
            });

            it('does not modify the rest of DOM', function() {
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

    describe('has a method "accentuateNodesStyleProperty" that', function() {
        beforeEach(function() {
            clone = dom1_div0.cloneNode(true);
        });

        it('throws an error if the first argument is not set, a string, a number, an object or a function', function() {
            var invalids = [null, undefined, 0, 1, 12.98, -12, -3.22, '', 'some string', {}, {
                key: 3
            }, function() {
                return;
            }];
            invalids.forEach(function(invalid) {
                expect(function() {
                    doc.accentuateNodesStyleProperty(invalid, 'margin', '30em');
                }).toThrow(new Error('Set of nodes must be given as an array!'));
            });
        });
        it('does not call "accentuateSingleNodeStyleProperty" method if the first argument is an empty array', function() {
            spyOn(doc, 'accentuateSingleNodeStyleProperty');
            doc.accentuateNodesStyleProperty([], 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).not.toHaveBeenCalled();
        });

        it('calls "accentuateSingleNodeStyleProperty" method if the first argument contains only Node instances', function() {
            spyOn(doc, 'accentuateSingleNodeStyleProperty');
            doc.accentuateNodesStyleProperty([dom1_span0, dom1_text2, dom1_ul0], 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_span0, 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_text2, 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_ul0, 'key', 'value');
        });
        it('calls "accentuateSingleNodeStyleProperty" method two times if the first array contains 2 Node and 3 non-Node instances ', function() {
            spyOn(doc, 'accentuateSingleNodeStyleProperty');
            var invalids = ['a string', document.createRange(), []];
            doc.accentuateNodesStyleProperty([invalids[0], invalids[1], dom1_p0, invalids[2], dom1_li0], 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty.calls.count()).toBe(2);
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_p0, 'key', 'value');
            expect(doc.accentuateSingleNodeStyleProperty).toHaveBeenCalledWith(dom1_li0, 'key', 'value');
        });
    });

    describe('has a method "accentuateSingleNodeStyleProperty" that', function() {
        describe('when setting font color of a "red color" paragraph to become blue', function() {
            var pNew, pOrig;
            beforeEach(function() {
                doc.accentuateSingleNodeStyleProperty(dom1_p0, 'color', 'blue');
                // introduce notations
                pNew = dom1_div0.childNodes[0];
                pOrig = clone.childNodes[0];
            });
            it('makes the paragraph have blue color font', function() {
                expect(pNew.getAttribute('style').search(/color:\s+blue/) !== -1).toBe(true);
            });
            it('does not change the other nodes', function() {
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

            it('the other paragraph\'s style properties remain without changes', function() {
                expect(pNew.style.width).toBe('100%');
            });

            it('the paragraph\'s attributes remain without changes', function() {
                expect(pNew.getAttribute('marker')).toBe('p');
                expect(pNew.getAttribute('width')).toBe('300px');
            });
        });
        describe('when setting a text-decoration of a list node that does not inherit text-decoration', function() {
            var listNew, listOrig;
            beforeEach(function() {
                doc.accentuateSingleNodeStyleProperty(dom1_ol0, 'text-decoration', 'underline');
                // introduce notations
                listNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
                listOrig = clone.childNodes[0].childNodes[2].childNodes[2];
            });
            it('sets the text-decoration of the list node', function() {
                expect(listNew.getAttribute('style').search(/text-decoration:\s+underline/) !== -1).toBe(true);
            });
            it('does not change the rest of DOM', function() {
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
        describe('when setting a color of a node that inherits different color value,', function() {
            var mentorNew;
            beforeEach(function() {
                // preparing spies the method depends on
                spyOn(doc, 'proxy').and.returnValue(dom1_li1);
                spyOn(doc, 'dropStyleProperty');
                doc.accentuateSingleNodeStyleProperty(dom1_ul0, 'color', 'white');
                // introduce notations
                mentorNew = dom1_div0.childNodes[0].childNodes[2].childNodes[2];
            });
            afterEach(function() {
                expect(doc.proxy).toHaveBeenCalledWith(dom1_ul0);
            });
            it('sets color property of node\'s proxy', function() {
                expect(mentorNew.childNodes[1].getAttribute('style').search(/color:\s+white/) !== -1).toBe(true);
            });
            it('sets color property of mentor\'s first child to be equal to mentor\'s original value', function() {
                expect(mentorNew.childNodes[0].getAttribute('style').search(/color:\s+yellow/) !== -1).toBe(true);
            });
            it('does not change color property of mentor\'s third child', function() {
                expect(mentorNew.childNodes[2].getAttribute('style').search(/color:\s+green/) !== -1).toBe(true);
            });
            it('removes color property from mentor style', function() {
                expect(doc.dropStyleProperty).toHaveBeenCalledWith(mentorNew, 'color');
            });
        });

        it('does not modify DOM if the value of inherited property is equal to required one', function() {
            doc.accentuateSingleNodeStyleProperty(dom1_span0, 'color', 'red');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
    });

    describe('has a method "suggestStyleProperty" that', function() {
        beforeEach(function() {
            clone = dom1_div0.cloneNode(true);
        });

        it('throws an error if the first argument is not defined, a number, a string, an array or an object', function() {
            var invalids = [null, undefined, 0, 1, 12.98, -12, -3.22, '', 'some string', {}, {
                key: 3
            }, function() {
                return;
            }];
            invalids.forEach(function(invalid) {
                expect(function() {
                    doc.suggestStyleProperty(invalid, 'margin', '30em');
                }).toThrow(new Error('It is illegal to suggest a property to a non-Node instance!'));
            });
        });

        it('does not modify DOM if the node has a style property equal to the suggested value', function() {
            doc.suggestStyleProperty(dom1_a0, 'color', 'navy');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the node has a style property that differs from the suggested value', function() {
            doc.suggestStyleProperty(dom1_p0, 'width', '87px');
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('calls "setStyleProperty" method if the node is a text Node', function() {
            spyOn(doc, 'setStyleProperty');
            doc.suggestStyleProperty(dom1_text1, 'width', '31%');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(dom1_text1, 'width', '31%');
        });

        it('calls "setStyleProperty" method if the node does not have the required property', function() {
            spyOn(doc, 'setStyleProperty');
            doc.suggestStyleProperty(dom1_a0, 'margin', '2em');
            expect(doc.setStyleProperty).toHaveBeenCalledWith(dom1_a0, 'margin', '2em');
        });


        it('modifies DOM if the first argument is a text Node', function() {
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

    describe('has a method "setStyleProperty" that', function() {
        beforeEach(function() {
            clone = dom1_div0.cloneNode(true);
        });
        it('does not modify DOM if it is called without arguments', function() {
            doc.setStyleProperty();
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('does not modify DOM if the first argument is a number, a string, an array, a non-Node object, a function', function() {
            var invalids = [null, undefined, 0, 1, 12.98, -12, -3.22, '', 'some string', {}, {
                key: 3
            }, function() {
                return;
            }];
            invalids.forEach(function(invalid) {
                doc.setStyleProperty(invalid, 'margin', '30em');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('does not modify DOM if the second argument is not set', function() {
            doc.setStyleProperty(dom1_ol0);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not modify DOM if the second argument is a number, an array, an empty string, an object, a function', function() {
            var invalids = [
                [],
                [1, 2, 3], '', {}, {
                    key: 3
                },
                function() {
                    return;
                }
            ];
            invalids.forEach(function(invalid) {
                doc.setStyleProperty(dom1_span0, invalid, '30em');
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('does not modify DOM if the third argument is an array, an empty string, an object, a function', function() {
            var invalids = [
                [],
                [1, 2, 3], '', {}, {
                    key: 3
                },
                function() {
                    return;
                }
            ];
            invalids.forEach(function(invalid) {
                doc.setStyleProperty(dom1_span0, 'padding', invalid);
                expect(dom1_div0.isEqualNode(clone)).toBe(true);
            });
        });
        it('sets a property if its value is given as a number', function() {
            doc.setStyleProperty(dom1_ol0, 'width', 30);
            expect(dom1_ol0.getAttribute('style').search(/width:\s+30/) !== -1).toBe(true);
        });

        describe('when asking to set a new property of an Element node', function() {
            beforeEach(function() {
                doc.setStyleProperty(dom1_p0, 'margin', '61pt');
            });

            it('assigns that style property to the element', function() {
                expect(dom1_p0.style.margin).toBe('61pt');
            });

            it('does not modify the rest of DOM', function() {
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

            it('does not change the original attributes of the Element instance', function() {
                // the number of the attributes must not change (+1 due to "style" attribute)
                expect(dom1_p0.attributes.length).toBe(2 + 1);
                // attributes' values must not change
                expect(dom1_p0.getAttribute('marker')).toBe('p');
                expect(dom1_p0.getAttribute('width')).toBe('300px');
            });

            it('does not change the original style properties of the Element instance', function() {
                expect(dom1_p0.style.width).toBe('100%');
                expect(dom1_p0.style.color).toBe('red');
            });
        });
        describe('when asking to set a property of a Text node', function() {
            beforeEach(function() {
                doc.setStyleProperty(dom1_text2, 'width', '109em');
            });

            it('creates an element node that has requested style property', function() {
                expect(dom1_div0.childNodes[1].childNodes[0].style.width).toBe('109em');
            });

            it('replaces the text node by the newly created element', function() {
                expect(dom1_div0.childNodes[1].childNodes[0] === dom1_text2.parentNode).toBe(true);
            });

        });
    });


    describe('has a method "isImage" that', function() {
        it('returns false if called without argument', function() {
            expect(doc.isImage()).toBe(false);
        });

        it('returns false if the argument is a number, a string, an array, a function or a plain object', function() {
            var invalids = [0, -1, 3.11, 9.87, '', 'a string', {}, {
                'key': 992
            }, function() {
                return;
            }];
            invalids.forEach(function(invalid) {
                expect(doc.isImage(invalid)).toBe(false);
            });
        });

        it('returns false if the argument is a div element', function() {
            expect(doc.isImage(document.createElement('div'))).toBe(false);
        });

        it('returns false if the argument is a hyperlink element', function() {
            expect(doc.isImage(dom1_a0)).toBe(false);
        });

        it('returns false if the argument is a paragraph with an image element', function() {
            expect(doc.isImage(dom1_p0)).toBe(false);
        });

        it('returns true if the argument is an image element without src attribute', function() {
            var im = document.createElement('img');
            expect(doc.isImage(im)).toBe(true);
        });

        it('returns true if the argument is an image element with valid value of src attribute', function() {
            var im = document.createElement('img');
            im.src = 'anImage.png';
            expect(doc.isImage(im)).toBe(true);
        });

        it('returns true if the argument is an image element with empty value of src attribute', function() {
            var im = document.createElement('img');
            im.src = '';
            expect(doc.isImage(im)).toBe(true);
        });
    });

    describe('has a method "isLink" that', function() {
        it('returns false if called without argument', function() {
            expect(doc.isLink()).toBe(false);
        });

        it('returns false if the argument is a number, a string, an array, a function or a plain object', function() {
            var invalids = [0, -1, 3.11, 9.87, '', 'a string', {}, {
                'key': 992
            }, function() {
                return;
            }];
            invalids.forEach(function(invalid) {
                expect(doc.isLink(invalid)).toBe(false);
            });
        });

        it('returns false if the argument is a div element', function() {
            expect(doc.isLink(document.createElement('div'))).toBe(false);
        });

        it('returns false if the argument is a text node', function() {
            expect(doc.isLink(document.createTextNode('a text node'))).toBe(false);
        });

        it('returns true if the argument is a hyperlink element', function() {
            expect(doc.isLink(dom1_a0)).toBe(true);
        });

        it('returns false if the argument is a div with an image element', function() {
            expect(doc.isLink(dom1_div0)).toBe(false);
        });

        it('returns true if the argument is a link element without href attribute', function() {
            var n = document.createElement('a');
            expect(doc.isLink(n)).toBe(true);
        });

        it('returns true if the argument is a link element with valid href attribute', function() {
            var n = document.createElement('a');
            n.setAttribute('href', 'http://www.google.com');
            expect(doc.isLink(n)).toBe(true);
        });

        it('returns true if the argument is a link element with href attribute that corresponds to non-existing URL', function() {
            var n = document.createElement('a');
            n.setAttribute('href', 'http://this-url-does-not-exist! uhm!');
            expect(doc.isLink(n)).toBe(true);
        });

        it('returns true if the argument is a link element with empty href attribute', function() {
            var n = document.createElement('a');
            n.setAttribute('href', '');
            expect(doc.isLink(n)).toBe(true);
        });
    });



    describe('has a method "applyToDesOfSingleRange" that', function() {
        var r;
        beforeEach(function() {
            r = document.createRange();
            spyOn(doc, 'applyToDesOfSingleNode');
        });
        it('does not call method "applyToDesOfSingleNode" if the range is collapsed', function() {
            spyOn(doc, 'nodesOfRange').and.returnValue([]);
            doc.applyToDesOfSingleRange(r, 'any 1', 'any 2', 'any 3');
            expect(doc.applyToDesOfSingleNode).not.toHaveBeenCalled();
            expect(doc.nodesOfRange).toHaveBeenCalledWith(r);
        });
        it('calls method "applyToDesOfSingleNode" once if the range contains just one node', function() {
            spyOn(doc, 'nodesOfRange').and.returnValue([dom1_span0]);
            doc.applyToDesOfSingleRange(r, 'any 1', 'any 2', 'any 3');
            expect(doc.applyToDesOfSingleNode.calls.count()).toBe(1);
            expect(doc.applyToDesOfSingleNode).toHaveBeenCalledWith(dom1_span0, 'any 1', 'any 2', 'any 3');
            expect(doc.nodesOfRange).toHaveBeenCalledWith(r);
        });

        it('calls method "applyToDesOfSingleNode" three times if the range contains three nodes', function() {
            spyOn(doc, 'nodesOfRange').and.returnValue([dom1_text0, dom1_li1, dom1_p0]);
            doc.applyToDesOfSingleRange(r, 'any 1', 'any 2', 'any 3');
            expect(doc.applyToDesOfSingleNode.calls.count()).toBe(3);
            expect(doc.applyToDesOfSingleNode).toHaveBeenCalledWith(dom1_text0, 'any 1', 'any 2', 'any 3');
            expect(doc.applyToDesOfSingleNode).toHaveBeenCalledWith(dom1_li1, 'any 1', 'any 2', 'any 3');
            expect(doc.applyToDesOfSingleNode).toHaveBeenCalledWith(dom1_p0, 'any 1', 'any 2', 'any 3');
            expect(doc.nodesOfRange).toHaveBeenCalledWith(r);
        });

    });

    describe('has a method "applyToDesOfSingleNode" that', function() {
        var r, fakeOper, alwaysTrue, alwaysFalse;
        beforeEach(function() {
            r = document.createRange();
            fakeOper = jasmine.createSpy('operation');
            alwaysTrue = function() {
                return true;
            };
            alwaysFalse = function() {
                return false;
            };
        });
        describe('when applied to a node without children, then', function() {
            it('it performs operation on the node if the criteria returns true and the mode is set to true', function() {
                doc.applyToDesOfSingleNode(dom1_span0, alwaysTrue, fakeOper, true);
                expect(fakeOper.calls.count()).toBe(1);
                expect(fakeOper).toHaveBeenCalledWith(dom1_span0);
            });

            it('it performs operation on the node if the criteria returns true and the mode is set to false', function() {
                doc.applyToDesOfSingleNode(dom1_img0, alwaysTrue, fakeOper, false);
                expect(fakeOper.calls.count()).toBe(1);
                expect(fakeOper).toHaveBeenCalledWith(dom1_img0);
            });

            it('it does not perform operation on the node if the criteria returns false and the mode is set to true', function() {
                doc.applyToDesOfSingleNode(dom1_li1, alwaysFalse, fakeOper, true);
                expect(fakeOper).not.toHaveBeenCalled();
            });

            it('it does not perform operation on the node if the criteria returns false and the mode is set to false', function() {
                doc.applyToDesOfSingleNode(dom1_li1, alwaysFalse, fakeOper, false);
                expect(fakeOper).not.toHaveBeenCalled();
            });
        });
        describe('when applied to a node with three children, then', function() {
            it('it performs operation only the node if the criteria returns true and the mode is set to true', function() {
                doc.applyToDesOfSingleNode(dom1_div1, alwaysTrue, fakeOper, true);
                expect(fakeOper.calls.count()).toBe(1);
                expect(fakeOper).toHaveBeenCalledWith(dom1_div1);
            });
            it('it never performs operation if the criteria returns always false and the mode is set to true', function() {
                doc.applyToDesOfSingleNode(dom1_div1, alwaysFalse, fakeOper, true);
                expect(fakeOper).not.toHaveBeenCalled();
            });
            it('it never performs operation if the criteria returns always false and the mode is set to false', function() {
                doc.applyToDesOfSingleNode(dom1_div1, alwaysFalse, fakeOper, false);
                expect(fakeOper).not.toHaveBeenCalled();
            });
            it('it never performs operation if the criteria returns always false and the mode is not set', function() {
                doc.applyToDesOfSingleNode(dom1_div1, alwaysFalse, fakeOper);
                expect(fakeOper).not.toHaveBeenCalled();
            });
            it('it performs operation on nodes of different generations if the mode is set to false', function() {
                var fakeCrit = function(n) {
                    return n === dom1_ol0 || n === dom1_li3;
                };
                doc.applyToDesOfSingleNode(dom1_div1, fakeCrit, fakeOper, false);
                expect(fakeOper.calls.count()).toBe(2);
                expect(fakeOper).toHaveBeenCalledWith(dom1_ol0);
                expect(fakeOper).toHaveBeenCalledWith(dom1_li3);
            });
            it('it performs operation on a node and not on its descendants if the mode is set to true', function() {
                var fakeCrit = function(n) {
                    return n === dom1_ol0 || n === dom1_li3;
                };
                doc.applyToDesOfSingleNode(dom1_div1, fakeCrit, fakeOper, true);
                expect(fakeOper.calls.count()).toBe(1);
                expect(fakeOper).toHaveBeenCalledWith(dom1_ol0);
            });
            it('it does not perform operation on a node for which the criteria throws an expection', function() {
                var fakeCrit = function(n) {
                    if (n === dom1_li2) {
                        throw new Error('generated error');
                    }
                    return false;
                };
                doc.applyToDesOfSingleNode(dom1_ol0, fakeCrit, fakeOper, false);
                expect(fakeOper).not.toHaveBeenCalledWith(dom1_li2);
            });
            it('it performs operation on corresponding nodes even if criteria throws an expection in some calls', function() {
                var fakeCrit = function(n) {
                    if (n === dom1_li2) {
                        throw new Error('generated error');
                    }
                    return n === dom1_text3 || n === dom1_li3;
                };
                doc.applyToDesOfSingleNode(dom1_p0, fakeCrit, fakeOper, false);
                expect(fakeOper.calls.count()).toBe(2);
                expect(fakeOper).toHaveBeenCalledWith(dom1_text3);
                expect(fakeOper).toHaveBeenCalledWith(dom1_li3);
            });
            it('it keeps on performing operation on nodes even if for some calls it throws an exception', function() {
                var fakeWrap = {
                    fakeOper: function(n) {
                        if (n === dom1_text3) {
                            throw new Error('an error');
                        }
                    }
                };
                spyOn(fakeWrap, 'fakeOper').and.callThrough();
                var fakeCrit = function(n) {
                    return n === dom1_text3 || n === dom1_li3;
                };
                doc.applyToDesOfSingleNode(dom1_div1, fakeCrit, fakeWrap.fakeOper, false);
                expect(fakeWrap.fakeOper.calls.count()).toBe(2);
                expect(fakeWrap.fakeOper).toHaveBeenCalledWith(dom1_text3);
                expect(fakeWrap.fakeOper).toHaveBeenCalledWith(dom1_li3);
            });



        });
    });

    describe('has a method "removeNode" that', function() {
        it('removes a text node from DOM', function() {
            doc.removeNode(dom1_text0);
            // the root node must remain with two children
            expect(dom1_div0.childNodes.length).toBe(2);
            expect(dom1_div0.childNodes[0].isEqualNode(clone.childNodes[0])).toBe(true);
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
        });
        it('removes an element node that has no children', function() {
            doc.removeNode(dom1_img0);
            // the root node still has three children
            expect(dom1_div0.childNodes.length).toBe(3);

            // root's first child undergoes changes: its middle child node (img element) gets removed
            var pNew = dom1_div0.childNodes[0];
            var pOrig = clone.childNodes[0];
            expect(pNew.childNodes.length).toBe(2);
            expect(pNew.childNodes[0].isEqualNode(pOrig.childNodes[0])).toBe(true);
            expect(pNew.childNodes[1].isEqualNode(pOrig.childNodes[2])).toBe(true);
            // root's second and third children remain without changes
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
            expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
        });
        it('removes an element node that has children', function() {
            doc.removeNode(dom1_p0);
            // the root node must have two children
            expect(dom1_div0.childNodes.length).toBe(2);

            expect(dom1_div0.childNodes[0].isEqualNode(clone.childNodes[1])).toBe(true);
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[2])).toBe(true);
        });

        it('does not change DOM if the node does not exist in this DOM', function() {
            doc.removeNode(document.createElement('div'));
            // the root node must have two children
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

        it('does not change DOM if the node has not parent node (i.e. it is the root node)', function() {
            doc.removeNode(dom1_div0);
            // the root node must have two children
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });

    });


    describe('has a method "applyToAncOfManyRanges" that', function() {
        beforeEach(function() {
            spyOn(doc, 'applyToAncOfSingleRange');
        });
        it('does not call method "applyToAncOfSingleRange" if the argument is an empty array', function() {
            var f1 = function() {},
                f2 = function() {};
            doc.applyToAncOfManyRanges([], f1, f2);
            expect(doc.applyToAncOfSingleRange).not.toHaveBeenCalled();
        });
        it('calls method "applyToAncOfSingleRange" three times if the first argument contains three ranges', function() {
            var f1 = function() {},
                f2 = function() {};
            var r1 = document.createRange(),
                r2 = document.createRange(),
                r3 = document.createRange();
            doc.applyToAncOfManyRanges([r1, r2, r3], f1, f2);
            expect(doc.applyToAncOfSingleRange.calls.count()).toBe(3);
            expect(doc.applyToAncOfSingleRange).toHaveBeenCalledWith(r1, f1, f2);
            expect(doc.applyToAncOfSingleRange).toHaveBeenCalledWith(r2, f1, f2);
        });

        it('does not call method "applyToAncOfSingleRange" if the first argument contains no ranges', function() {
            var f1 = function() {},
                f2 = function() {};
            doc.applyToAncOfManyRanges(['a string', -4.21, {}], f1, f2);
            expect(doc.applyToAncOfSingleRange).not.toHaveBeenCalled();
        });

        it('calls method "applyToAncOfSingleRange" once if the first argument contains one range and two non-Ranges', function() {
            var f1 = function() {},
                f2 = function() {};
            var r1 = document.createRange();
            doc.applyToAncOfManyRanges([1, {}, r1, [1, 2, 3]], f1, f2);
            expect(doc.applyToAncOfSingleRange.calls.count()).toBe(1);
            expect(doc.applyToAncOfSingleRange).toHaveBeenCalledWith(r1, f1, f2);
        });


    });


    describe('has a method "applyToAncOfSingleRange" that', function() {
        var r1, crit, oper;
        beforeEach(function() {
            r1 = document.createRange();
            crit = function() {
                return true;
            };
        });

        it('uses the range start container when calling "findAncestorsOfMany" if the range is collapsed', function() {
            spyOn(doc, 'findAncestorsOfMany').and.returnValue([]);
            r1.setStart(dom1_text3, 6);
            r1.collapse(true);

            doc.applyToAncOfSingleRange(r1, crit, function() {});
            expect(doc.findAncestorsOfMany).toHaveBeenCalledWith([dom1_text3], crit);
        });

        it('uses the ouptut of "nodesOfRange" when calling "findAncestorsOfMany" if the range is not collapsed', function() {
            var fakeCollection = [dom1_text4, dom1_li2];
            spyOn(doc, 'findAncestorsOfMany').and.returnValue([]);
            spyOn(doc, 'nodesOfRange').and.returnValue(fakeCollection);
            r1.setStart(dom1_div1, 2);
            r1.setEnd(dom1_ul0, 1);
            doc.applyToAncOfSingleRange(r1, crit, function() {});
            expect(doc.findAncestorsOfMany).toHaveBeenCalledWith(fakeCollection, crit);
        });

        it('calls "operation" on each array element of "findAncestorsOfMany" output', function() {
            var fakeCollection = [dom1_text4, dom1_li2];
            spyOn(doc, 'findAncestorsOfMany').and.returnValue(fakeCollection);
            spyOn(doc, 'nodesOfRange').and.returnValue([]);
            oper = jasmine.createSpy('fakeFunction');
            doc.applyToAncOfSingleRange(r1, crit, oper);
            expect(oper).toHaveBeenCalledWith(dom1_text4);
            expect(oper).toHaveBeenCalledWith(dom1_li2);
        });

        it('keeps on executing "operation" if previous calls make it throw an exception', function() {
            var fakeCollection = [dom1_text4, dom1_li2, dom1_div1];
            var fakeObj = {
                oper: function(n) {
                    if (n === dom1_text4) {
                        throw new Error('manually generated error');
                    }
                }
            };
            spyOn(doc, 'findAncestorsOfMany').and.returnValue(fakeCollection);
            spyOn(doc, 'nodesOfRange').and.returnValue([]);
            spyOn(fakeObj, 'oper').and.callThrough();

            expect(function() {
                doc.applyToAncOfSingleRange(r1, crit, fakeObj.oper);
            }).not.toThrow();

            expect(fakeObj.oper).toHaveBeenCalledWith(dom1_text4);
            expect(fakeObj.oper).toHaveBeenCalledWith(dom1_li2);
            expect(fakeObj.oper).toHaveBeenCalledWith(dom1_div1);
        });

    });

    describe('has a method "deparentize" that', function() {
        it('does not modify DOM if the argument has no parent (i.e. it is the root)', function() {
            doc.deparentize(dom1_div0);
            expect(dom1_div0.isEqualNode(clone)).toBe(true);
        });
        it('removes the argument if it has no children', function() {
            doc.deparentize(dom1_text0);

            // root must have two nodes
            expect(dom1_div0.childNodes.length).toBe(2);
            // root first and second nodes remain the same
            expect(dom1_div0.childNodes[0].isEqualNode(clone.childNodes[0])).toBe(true);
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
        });
        it('removes the node and appends all its children to its parent', function() {
            doc.deparentize(dom1_div1);

            // root must still have three nodes
            expect(dom1_div0.childNodes.length).toBe(3);

            // root first child gets modified: it now has 5 children
            var pNew = dom1_div0.childNodes[0],
                pOrig = clone.childNodes[0],
                divOrig = pOrig.childNodes[2];
            expect(pNew.childNodes.length).toBe(5);
            expect(pNew.childNodes[0].isEqualNode(pOrig.childNodes[0])).toBe(true);
            expect(pNew.childNodes[1].isEqualNode(pOrig.childNodes[1])).toBe(true);
            expect(pNew.childNodes[2].isEqualNode(divOrig.childNodes[0])).toBe(true);
            expect(pNew.childNodes[3].isEqualNode(divOrig.childNodes[1])).toBe(true);
            expect(pNew.childNodes[4].isEqualNode(divOrig.childNodes[2])).toBe(true);


            // root second and third nodes remain the same
            expect(dom1_div0.childNodes[1].isEqualNode(clone.childNodes[1])).toBe(true);
            expect(dom1_div0.childNodes[2].isEqualNode(clone.childNodes[2])).toBe(true);
        });
    });

    describe('has a method "clearRangesFromTables" that', function() {
        it('calls method "applyToAncOfManyRanges" with properly set arguments', function() {
            spyOn(doc, 'applyToAncOfManyRanges');
            doc.clearRangesFromTables('must be array of ranges');
            expect(doc.applyToAncOfManyRanges).toHaveBeenCalledWith('must be array of ranges', doc.isTable, doc.removeNode, true);
        });
    });

    describe('has a method "getAvailableWidth" that', function() {
        it('returns 300px if the argument has width 300px', function() {
            dom1_p0.style.width = '300px';
            expect(doc.getAvailableWidth(dom1_p0)).toBe('300px');
        });

        it('returns 150px if the argument has no width set, but one of its ancestor has width 150px', function() {
            dom1_p0.style.width = '300px';
            expect(doc.getAvailableWidth(dom1_p0)).toBe('300px');
        });


        it('sets width to be equal to that of second ancestor if the parent has it not set', function() {
            dom1_div1.style.width = '150px';
            expect(doc.getAvailableWidth(dom1_li3)).toBe('150px');
        });

        it('returns nothing if none of the argument ancestor has width parameter set', function(){
            dom1_p0.removeAttribute('width');
            dom1_p0.removeAttribute('style');
            expect(doc.getAvailableWidth(dom1_li2)).not.toBeDefined();
        });

    });

    describe('has a method "isNodeEditable" that', function(){
        it('returns false if called without argument', function(){
            expect(doc.isNodeEditable()).toBe(false);
        });

        it('returns true if the argument is a text node', function(){
            var t = document.createTextNode('a text node');
            expect(doc.isNodeEditable(t)).toBe(true);
        });
        it('returns true if the argument is a div node with single child that is a text node', function(){
            var t = document.createTextNode('a text node'),
                d = document.createElement('div');
            d.appendChild(t);
            expect(doc.isNodeEditable(t)).toBe(true);
        });

        it('returns false if the argument is an image node', function(){
            var img = document.createElement('img');
            expect(doc.isNodeEditable(img)).toBe(false);
        });

        it('returns false if the argument is a span tag with single child that is a div tag', function(){
            var span = document.createElement('span'),
                div = document.createElement('div');
            span.appendChild(div);
            expect(doc.isNodeEditable(span)).toBe(false);
        });


        it('returns false if the argument is a list item tag with two children: text and image nodes', function(){
            var img = document.createElement('img'),
                li = document.createElement('li'),
                t = document.createTextNode('a text node');
            li.appendChild(t);
            li.appendChild(img);
            expect(doc.isNodeEditable(li)).toBe(false);
        });
    });


    describe('has a method "isSelectionEditable" that', function(){
        it('returns false if the argument is an empty array', function(){
            expect(doc.isSelectionEditable([])).toBe(false);
        });
        it('returns true if the argument is an array with two ranges', function(){
            var r1 = document.createRange(),
                r2 = document.createRange();
            expect(doc.isSelectionEditable([r1, r2])).toBe(false);
        });

        it('calls method "isRangeEditable" in order to determine whether unique range is editable', function(){
            var r = document.createRange();
            spyOn(doc, 'isRangeEditable');
            doc.isSelectionEditable([r]);
            expect(doc.isRangeEditable).toHaveBeenCalledWith(r);
        });

        it('returns the result of method "isRangeEditable" in order to determine whether unique range is editable', function(){
            var r = document.createRange();
            spyOn(doc, 'isRangeEditable').and.returnValue('result');
            expect(doc.isSelectionEditable([r])).toBe('result');
        });
    });

    describe('has a method "isRangeEditable" that', function(){
        it('returns false if the argument is missing', function(){
           expect(doc.isRangeEditable()).toBe(false);
        });
        it('returns true if the range is a collapsed one', function(){
            var r = document.createRange();
            r.setStart(dom1_p0, 2);
            r.collapse(true); // collapse to start
            expect(doc.isRangeEditable(r)).toBe(true);
        });
        it('calls method "nodesOfRange" if the range is not collapsed', function(){
            var r = document.createRange();
            r.setStart(dom1_div1, 0);
            r.setEnd(dom1_div1, 3);
            spyOn(doc, 'nodesOfRange').and.returnValue([]);
            doc.isRangeEditable(r);
            expect(doc.nodesOfRange).toHaveBeenCalledWith(r);
        });

        it('returns false if "nodesOfRange" returns array with three nodes', function(){
            var r = document.createRange();
            r.setStart(dom1_div1, 0);
            r.setEnd(dom1_div1, 3);
            spyOn(doc, 'nodesOfRange').and.returnValue([dom1_div1, dom1_a0, dom1_img0]);
            expect(doc.isRangeEditable(r)).toBe(false);
        });
        it('returns false if "nodesOfRange" returns array with just one node that is a text one', function(){
            var r = document.createRange();
            r.setStart(dom1_text2, 1);
            r.setEnd(dom1_text2, 2);
            spyOn(doc, 'nodesOfRange').and.returnValue([dom1_text0]);
            expect(doc.isRangeEditable(r)).toBe(true);
        });
        it('returns false if "nodesOfRange" returns array with just two nodes that are text ones', function(){
            var r = document.createRange();
            r.setStart(dom1_text2, 1);
            r.setEnd(dom1_text2, 2);
            spyOn(doc, 'nodesOfRange').and.returnValue([dom1_text0, dom1_text1]);
            expect(doc.isRangeEditable(r)).toBe(false);
        });

    });

    describe('Escaping special characters', function(){
        it('returns the argument if it is a zero', function(){
            expect(doc.escape(0)).toBe(0);
        });
        it('returns the argument if it is a positive integer number', function(){
            expect(doc.escape(5)).toBe(5);
        });
        it('returns the argument if it is a negative integer number', function(){
            expect(doc.escape(-45)).toBe(-45);
        });
        it('returns the argument if it is a positive float number', function(){
            expect(doc.escape(9.81)).toBe(9.81);
        });
        it('returns the argument if it is a positive float number', function(){
            expect(doc.escape(-45.1)).toBe(-45.1);
        });
        it('returns null, if the argument is a function', function(){
            expect(doc.escape(function(i){return i;})).toBe(null);
        });

        it('returns null, if the argument is an object', function(){
            expect(doc.escape({'foo': true})).toBe(null);
        });
        it('does not change "safe" characters', function(){
            var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]!?.,;:%&\\/^\"'<>_";
            expect(doc.escape(str)).toBe(str);
        });

        it('escapes single character à', function(){
            expect(doc.escape('à')).toBe("&#224;");
        });

        it('does not change ampersand sign', function(){
            expect(doc.escape('&')).toBe('&');
            expect(doc.escape('abcd&ef')).toBe('abcd&ef');
            expect(doc.escape('&ef')).toBe('&ef');
            expect(doc.escape('abc&')).toBe('abc&');
        });

        it('escapes special characters', function(){
            var str = "à ò è";
            expect(doc.escape(str)).toBe("&#224; &#242; &#232;");
        });

        it('escapes only special characters in mixed strings', function(){
            var str = "<div style=\"color:red;\">01 à A ò (È) è</div>";
            expect(doc.escape(str)).toBe("<div style=\"color:red;\">01 &#224; A &#242; (&#200;) &#232;</div>");
        });
    });

    describe('has a method escapeString that', function(){
        it('replaces < with &lt;', function(){
            expect(doc.escapeString('<')).toBe('&lt;');
        });
        it('replaces > with &gt;', function(){
            expect(doc.escapeString('>')).toBe('&gt;');
        });
        it('replaces & with &amp;', function(){
            expect(doc.escapeString('&')).toBe('&amp;');
        });
        it('replaces apostrophe with &#039;', function(){
            expect(doc.escapeString('\'')).toBe('&#039;');
        });
        it('replaces à ì è ò ù é with their html codes', function(){
            expect(doc.escapeString('à ì è ò ù é')).toBe('&agrave; &igrave; &egrave; &ograve; &ugrave; &eacute;');
        });

        it('replaces À Ì È Ò Ù É with their html codes', function(){
            expect(doc.escapeString('À Ì È Ò Ù É')).toBe('&Agrave; &Igrave; &Egrave; &Ograve; &Ugrave; &Eacute;');
        });

        it('does not change "safe" characters', function(){
            var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]!?.,;:%_";
            expect(doc.escape(str)).toBe(str);
        });








    });

});
