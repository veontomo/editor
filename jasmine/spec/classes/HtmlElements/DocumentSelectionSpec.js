/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, NEWSLETTER, Document, CKEditorAdapter, Node, Text */
describe('Selection class has', function() {
    // it seems that when activating these suits makes the page with test
    // output freeze for some seconds
    var doc;
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
                expect(Array.isArray(res)).toBe(true);
                expect(res.length).toBe(0);
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
                    expect(Array.isArray(res)).toBe(true);
                    expect(res.length).toBe(0);
                });
            });
            it('sets ranges to empty array if the argument is an empty array', function() {
                // pending();
                doc.setRanges([]);
                var res = doc.getRanges();
                expect(Array.isArray(res)).toBe(true);
                expect(res.length).toBe(0);
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
        describe('has method nodesOfRange that', function() {
            it('returns an empty array if it is called without arguments', function() {
                var nodes = doc.nodesOfRange();
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(0);
            });
            it('returns empty array if pathTo() returns null', function() {
                spyOn(doc, 'pathTo');
                var nodes = doc.nodesOfRange('any node', 'another node');
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(0);
            });
            it('returns array with one of the arguments if they are the same element node', function() {
                var nodes = doc.nodesOfRange(e21, e21);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes[0]).toBe(e21);
            });
            it('returns array with one of the arguments if they are the same text node', function() {
                var nodes = doc.nodesOfRange(t22, t22);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes[0]).toBe(t22);
            });
            it('returns array with input arguments if they are neighbouring siblings', function() {
                // pending();
                var nodes = doc.nodesOfRange(t22, e23);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(2);
                expect(nodes[0]).toBe(t22);
                expect(nodes[1]).toBe(e23);
            });
            it('returns array with all siblings of node A if the arguments are the first and last nodes of A', function() {
                // pending();
                var nodes = doc.nodesOfRange(t20, t24);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(5);
                expect(nodes[0]).toBe(t20);
                expect(nodes[1]).toBe(e21);
                expect(nodes[2]).toBe(t22);
                expect(nodes[3]).toBe(e23);
                expect(nodes[4]).toBe(t24);
            });
            it('returns array with a fraction of siblings of a node if arguments have the same parent', function() {
                // pending();
                var nodes = doc.nodesOfRange(e21, e23);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(3);
                expect(nodes[0]).toBe(e21);
                expect(nodes[1]).toBe(t22);
                expect(nodes[2]).toBe(e23);
            });
            it('returns array with the second argument if it contains the first argument', function() {
                // pending();
                var nodes = doc.nodesOfRange(e23, e10);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes[0]).toBe(e10);
            });
            it('returns array with the first argument if it contains the second argument', function() {
                var nodes = doc.nodesOfRange(e11, e32);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes[0]).toBe(e11);
            });
            it('returns correct nodes if parent of the first argument is a neighbour sibling of the second argument', function() {
                var nodes = doc.nodesOfRange(e23, e11);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(3);
                expect(nodes[0]).toBe(e23);
                expect(nodes[1]).toBe(t24);
                expect(nodes[2]).toBe(e11);
            });
            it('returns correct nodes if parent of the second argument is a neighbour sibling of the first argument', function() {
                var nodes = doc.nodesOfRange(t20, e30);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(2);
                expect(nodes[0]).toBe(t20);
                expect(nodes[1]).toBe(e30);
            });
            it('returns correct nodes if the arguments have the root node as a common ancestor', function() {
                var nodes = doc.nodesOfRange(e21, e26);
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
                var nodes = doc.nodesOfRange(e21, e10);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(0);
                expect(doc.commonAncestor).toHaveBeenCalledWith(e21, e10);
            });
            // it('returns array with single text node if the range contains single text node', function(){
            //     range.setStart(e10, 2);
            //     range.setEnd(e11, 3);
            //     var nodes = doc.nodesOfRange(range);
            //     expect(Array.isArray(nodes)).toBe(true);
            //     expect(nodes.length).toBe(1);
            //     expect(nodes.length).toBe(t22);
            // });
            // it('returns an array with a text node if the range contains a fraction of a text node', function(){
            //     range.setStart(t22, 4);
            //     range.setEnd(t22, 8);
            //     var nodes = doc.nodesOfRange(range);
            //     expect(Array.isArray(nodes)).toBe(true);
            //     expect(nodes.length).toBe(1);
            //     expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
            //     expect(nodes[0].textContent).toBe(' nod');
            // });
            // it('returns an array with several nodes if the range starts inside a text node and finishes inside an element node', function(){
            //     range.setStart(t20, 4);  // includes text node with content " node 2.0"
            //     range.setEnd(e10, 4);  // includes nodes e21, t22, e23
            //     var nodes = doc.nodesOfRange(range);
            //     expect(Array.isArray(nodes)).toBe(true);
            //     expect(nodes.length).toBe(4);
            //     expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
            //     expect(nodes[1].textContent).toBe(' node 2.0');
            //     expect(nodes[1]).toBe(e21);
            //     expect(nodes[2]).toBe(t22);
            //     expect(nodes[3]).toBe(e23);
            // });
            // it('returns an array with several nodes if the range starts and finishes inside different text nodes', function(){
            //     range.setStart(t20, 3);  // includes element node e30
            //     range.setStart(t31, 2);  // includes text node with content "xt node 3.1"
            //     var nodes = doc.nodesOfRange(range);
            //     expect(Array.isArray(nodes)).toBe(true);
            //     expect(nodes.length).toBe(3);
            //     expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
            //     expect(nodes[0].textContent).toBe('t node 2.0');
            //     expect(nodes[1]).toBe(e30);
            //     expect(nodes[2].textContent).toBe('te');
            // });
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
    // describe('a method to get an element by path that', function(){
    //     it('returns nothing if the path is not defined or given as a string, a number, a function or an object', function(){
    //         var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
    //         invalids.forEach(function(invalid){
    //             expect(doc.getNodeByPath(invalid)).not.toBeDefined();
    //         });
    //     });
    //     it('returns nothing if the reference is not given or given as a string, a number, an array, a function or a non-node object', function(){
    //         var invalids = ['', 'a string', 0, 1, 4.32, -2, -5.96, [], [1, 2, 3], function(){return;}, {}, {foo: 23}];
    //         invalids.forEach(function(invalid){
    //             expect(doc.getNodeByPath([], invalid)).not.toBeDefined();
    //         });
    //     });
    //     it('returns the reference node if the path is an empty array', function(){
    //         expect(doc.getNodeByPath([], e10)).toBe(e10);
    //     });
    //     it('returns the first child of the reference node if the path is [0]', function(){
    //         expect(doc.getNodeByPath([0], e21)).toBe(e30);
    //     });
    //     it('returns the last child of the reference node', function(){
    //         expect(doc.getNodeByPath([1], e11)).toBe(e26);
    //     });
    //     it('returns third-generation child', function(){
    //         expect(doc.getNodeByPath([0, 1, 1], e00)).toBe(t31);
    //     });
    //     it('returns nothing if the path contains reference to a non-existent node', function(){
    //         expect(doc.getNodeByPath([3, 2, 0], e10)).not.toBeDefined();
    //     });
    //     it('returns nothing if the path passes through a text node', function(){
    //         expect(doc.getNodeByPath([2, 1], e10)).not.toBeDefined();
    //     });
    // });
    // describe('a method to find common "head" part of two arrays that' , function(){
    //     it('returns empty array if both arguments are empty arrays', function(){
    //         var res = doc.commonHead([], []);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns empty array if the first argument is an empty array and the second is not', function(){
    //         var res = doc.commonHead([], [1, 2, 4]);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns empty array if the second argument is an empty array and the first is not', function(){
    //         var res = doc.commonHead([1, 0, 0], []);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns empty array if the arguments have no common head', function(){
    //         var res = doc.commonHead([1, 0, 0], [0, 2, 3]);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns empty array if the arguments have no common head', function(){
    //         var res = doc.commonHead([1, 0, 0], [0, 2, 3, 3, 1]);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns the input array if the arguments are equal non-empty arrays', function(){
    //         var res = doc.commonHead([1, 2, 3], [1, 2, 3]);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(3);
    //         expect(res[0]).toBe(1);
    //         expect(res[1]).toBe(2);
    //         expect(res[2]).toBe(3);
    //     });
    //     it('returns the first argument if the second array is a concatenation of the first and another array', function(){
    //         var res = doc.commonHead([0, 2], [0, 2, 3]);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(2);
    //         expect(res[0]).toBe(0);
    //         expect(res[1]).toBe(2);
    //     });
    //     it('returns the second argument if the first array is a concatenation of the second and another array', function(){
    //         var res = doc.commonHead([7, 4, 1, 6], [7, 4, 1]);
    //         expect(Array.isArray(res)).toBe(true);
    //         expect(res.length).toBe(3);
    //         expect(res[0]).toBe(7);
    //         expect(res[1]).toBe(4);
    //         expect(res[2]).toBe(1);
    //     });
    // });
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
    xdescribe('a method to find next siblings that', function() {
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
    describe('a method splitTextNode that', function() {
        it('leaves the parent node unchanged if the argument is a Node instance', function() {
            doc.splitTextNode(e21, 9);
            expect(e21.childNodes.length).toBe(2);
            expect(e21.childNodes[0]).toBe(e30);
            expect(e21.childNodes[1]).toBe(t31);
        });
        describe('splits first text node in two text nodes', function() {
            it('if the split index is zero', function() {
                var t201 = doc.splitTextNode(t20, 0);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('');
                expect(e10.childNodes[1].textContent).toBe('text node 2.0');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than zero but less than the content length', function() {
                var t201 = doc.splitTextNode(t20, 6);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('text n');
                expect(e10.childNodes[1].textContent).toBe('ode 2.0');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is equal to the content length', function() {
                var t201 = doc.splitTextNode(t20, 13);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('text node 2.0');
                expect(e10.childNodes[1].textContent).toBe('');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than the content length', function() {
                var t201 = doc.splitTextNode(t20, 50);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('text node 2.0');
                expect(e10.childNodes[1].textContent).toBe('');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
        });
        describe('splits an inner text node in two text nodes', function() {
            it('if the split index is zero', function() {
                var t221 = doc.splitTextNode(t22, 0);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[3]).toBe(t221);
                expect(e10.childNodes[2].textContent).toBe('');
                expect(e10.childNodes[3].textContent).toBe('text node 2.2');
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than zero but less than the content length', function() {
                var t221 = doc.splitTextNode(t22, 4);
                expect(e10.childNodes.length).toBe(6);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[3]).toBe(t221);
                expect(e10.childNodes[2].textContent).toBe('text');
                expect(e10.childNodes[3].textContent).toBe(' node 2.2');
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is equal to the content length', function() {
                var t221 = doc.splitTextNode(t22, 13);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[3]).toBe(t221);
                expect(e10.childNodes[2].textContent).toBe('text node 2.2');
                expect(e10.childNodes[3].textContent).toBe('');
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than the content length', function() {
                var t221 = doc.splitTextNode(t22, 100);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[3]).toBe(t221);
                expect(e10.childNodes[2].textContent).toBe('text node 2.2');
                expect(e10.childNodes[3].textContent).toBe('');
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
        });
        describe('splits the last text node in two text nodes', function() {
            it('if the split index is zero', function() {
                var t241 = doc.splitTextNode(t24, 0);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('');
                expect(e10.childNodes[5].textContent).toBe('text node 2.4');
            });
            it('if the split index is greater than zero but less than the content length', function() {
                var t241 = doc.splitTextNode(t24, 8);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('text nod');
                expect(e10.childNodes[5].textContent).toBe('e 2.4');
            });
            it('if the split index is equal to the content length', function() {
                var t241 = doc.splitTextNode(t24, 13);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('text node 2.4');
                expect(e10.childNodes[5].textContent).toBe('');
            });
            it('if the split index is greater than the content length', function() {
                var t241 = doc.splitTextNode(t24, 200);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('text node 2.4');
                expect(e10.childNodes[5].textContent).toBe('');
            });
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
    xdescribe('a method to pick up the first node', function() {
        describe('of range\'s start and end containers are the same element node and', function() {
            it('if the node to return is a first-sibling element node', function() {
                range.setStart(e11, 0);
                range.setEnd(e11, 2);
                expect(doc.startNode(range)).toBe(e25);
            });
            it('if the node to return is a first-sibling text node', function() {
                range.setStart(e10, 0);
                range.setEnd(e10, 3);
                expect(doc.startNode(range)).toBe(t20);
            });
            it('if the node to return is a middle-sibling element node ', function() {
                range.setStart(e10, 1);
                range.setEnd(e10, 3);
                expect(doc.startNode(range)).toBe(e21);
            });
            it('if the node to return is a middle-sibling text node', function() {
                range.setStart(e10, 2);
                range.setEnd(e10, 4);
                expect(doc.startNode(range)).toBe(t22);
            });
            it('if the node to return is a last-sibling element node ', function() {
                range.setStart(e11, 1);
                range.setEnd(e11, 2);
                expect(doc.startNode(range)).toBe(e26);
            });
            it('if the node to return is a last-sibling text node', function() {
                range.setStart(e10, 4);
                range.setEnd(e10, 5);
                expect(doc.startNode(range)).toBe(t24);
            });
        });
        describe('of range\'s start and end containers are the same text node and', function() {
            it('does not modify DOM if the range covers completely the text node', function() {
                range.setStart(t22, 0);
                range.setEnd(t22, 13);
                doc.startNode(range);
                expect(e10.childNodes.length).toBe(5);
            });
            it('returns the text node if the range covers completely the text node', function() {
                range.setStart(t22, 0);
                range.setEnd(t22, 13);
                expect(doc.startNode(range)).toBe(t22);
            });
            it('returns a newly created text node if the range starts at the beginning of the node and finishes in middle', function() {
                range.setStart(t24, 0);
                range.setEnd(t24, 5);
                var n = doc.startNode(range);
                expect(n).toBe(e10.childNodes[4]);
            });
            it('returns a newly created text node if the range starts in middle of the node and finishes at the end', function() {
                range.setStart(t24, 3);
                range.setEnd(t24, 13);
                var n = doc.startNode(range);
                expect(n).toBe(e10.childNodes[5]);
            });
            it('returns a newly created text node if the range starts and finishes in middle of the node', function() {
                range.setStart(t24, 3);
                range.setEnd(t24, 5);
                var n = doc.startNode(range);
                expect(n).toBe(e10.childNodes[5]);
            });
            // it('adds 2 additional text nodes to the parent of the text node if the range starts and finishes in middle of the node', function(){
            //     range.setStart(t24, 3);
            //     range.setEnd(t24, 5);
            //     var n = doc.startNode(range);
            //     expect(e10.childNodes.length).toBe(7);
            // });
            it('if the node to return is a first-sibling text node', function() {
                range.setStart(e10, 0);
                range.setEnd(e10, 3);
                expect(doc.startNode(range)).toBe(t20);
            });
            it('if the node to return is a middle-sibling element node ', function() {
                range.setStart(e10, 1);
                range.setEnd(e10, 3);
                expect(doc.startNode(range)).toBe(e21);
            });
            it('if the node to return is a middle-sibling text node', function() {
                range.setStart(e10, 2);
                range.setEnd(e10, 4);
                expect(doc.startNode(range)).toBe(t22);
            });
            it('if the node to return is a last-sibling element node ', function() {
                range.setStart(e11, 1);
                range.setEnd(e11, 2);
                expect(doc.startNode(range)).toBe(e26);
            });
            it('if the node to return is a last-sibling text node', function() {
                range.setStart(e10, 3);
                range.setEnd(e10, 4);
                expect(doc.startNode(range)).toBe(t24);
            });
        });
    });
});