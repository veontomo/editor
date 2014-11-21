/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, CKEDITOR, NEWSLETTER, Selection, CKEditorAdapter, Node */

describe('Selection class has', function(){
    // it seems that when activating these suits makes the page with test
    // output freeze for some seconds

    var sel, editor, selected;
    var range, e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31, e32, n00, n10, n11;

    beforeEach(function(){
        editor = new CKEDITOR.editor();
        selected = new CKEDITOR.dom.selection(CKEDITOR.document);
        sel = new Selection();
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


    describe('constructor that', function(){
        it('creates selection instance object if keyword "new" is missing', function(){
            expect(Selection(editor) instanceof Selection).toBe(true);
        });

        it('throws an error if first argument is not a CKEDITOR.editor instance', function(){
            expect(function(){
                return new Selection('aaa');
            }).toThrow(new Error('The first argument must be a CKEDITOR.editor instance!'));
        });

        it('instantiates "editor" property', function(){
            sel = new Selection(editor);
            expect(sel.getEditor()).toBe(editor);
        });

        it('creates instance with undefined properties', function(){
            sel = new Selection();
            expect(sel.getEditor()).not.toBeDefined();
            expect(sel.getSelected()).not.toBeDefined();
            expect(sel.getRanges()).not.toBeDefined();
        });
    });

    describe('an editor setter/getter that', function(){
        it('throws error if not CKEDITOR.editor instance is given to the setter', function(){
            expect(function(){
                sel = new Selection();
                return sel.setEditor({});
            }).toThrow(new Error('The argument must be a CKEDITOR.editor instance!'));
        });

        it('sets the editor', function(){
            sel = new Selection();
            sel.setEditor(editor);
            expect(sel.getEditor()).toBe(editor);

        });
    });

    describe('a getter/setter for selection that', function(){
        it('sets the editor', function(){
            sel = new Selection();
            sel.setSelected(selected);
            expect(sel.getSelected()).toBe(selected);
        });
    });

    describe('method getStartElement that', function(){
        var editorRange, adapter;
        beforeEach(function(){

            //                                 e00 (div)
            //         ____________________________|_________
            //         |                                     |
            //        e10  (p)                          e11 (span)
            //   ______|______________________________       |
            //   |     |             |    |   |      |       |
            //  t20   e21 (div)     t22  e23 (img)  t24     t25
            //      ___|_________________
            //      |                    |
            //     e30 (span)           t31

            e00 = new CKEDITOR.dom.element('div');          // re-defining elements in terms of CKEDITOR
            e10 = new CKEDITOR.dom.element('p');            // methods. This should be got rid of in favour
            e11 = new CKEDITOR.dom.element('span');         // of CKEditorAdapter methods.
            e21 = new CKEDITOR.dom.element('div');
            e23 = new CKEDITOR.dom.element('img');
            e30 = new CKEDITOR.dom.element('span');
            e00.append(e10);
            e00.append(e11);
            e10.appendText('text node 2.0');
            e10.append(e21);
            e10.appendText('text node 2.2');
            e10.append(e23);
            e10.appendText('text node 2.4');
            e21.append(e30);
            e21.appendText('text node 3.1');
            e11.appendText('text node 2.5');

            adapter = new CKEditorAdapter();
            editor = new CKEDITOR.editor();
            editor.editable(e00);
            editorRange = editor.createRange();
        });

        it('gives undefined if nothing is selected', function(){
            sel = new Selection(editor);
            expect(sel.getStartElement()).not.toBeDefined();
        });
        it('gives first element (pending test)', function(){
            editorRange.setStart(e10, 1);
            editorRange.setEnd(e10, 3);
            sel = new Selection(editor);
            expect(sel.getStartElement()).toBeDefined();
            pending();
        });
    });

    describe('a range related functionality that', function(){
        describe('has method isRange which', function(){
            it('returns true if argument is a Range instance', function(){
                expect(sel.isRange(range)).toBe(true);
            });
            it('returns false if argument is a string, array, number, function or an object', function(){
                var invalids = ['', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
                invalids.forEach(function(invalid){
                    expect(sel.isRange(invalid)).toBe(false);
                });
            });
        });

        describe('has method appendRange', function(){
            it('that does not call setRanges method if the argument is not a valid range', function(){
                spyOn(sel, 'getRanges');
                spyOn(sel, 'setRanges');
                spyOn(sel, 'isRange').and.returnValue(false);
                sel.appendRange('anything');
                expect(sel.getRanges).not.toHaveBeenCalled();
                expect(sel.setRanges).not.toHaveBeenCalled();
            });

            describe('which in case when the argument is a valid range,', function(){
                beforeEach(function(){
                    spyOn(sel, 'isRange').and.returnValue(true);
                    spyOn(sel, 'setRanges');
                });
                describe('present in _ranges,', function(){
                    beforeEach(function(){
                        spyOn(sel, 'containsRange').and.returnValue(true);
                    });
                    it('does not call setRanges method if the argument is already among _ranges', function(){
                        spyOn(sel, 'getRanges');
                        sel.appendRange('anything');
                        expect(sel.getRanges).not.toHaveBeenCalled();
                        expect(sel.setRanges).not.toHaveBeenCalled();
                    });
                });
                describe('not present in _ranges,', function(){
                    beforeEach(function(){
                        spyOn(sel, 'containsRange').and.returnValue(false);
                    });
                    it('calls setRanges method if _ranges array is not defined', function(){
                        spyOn(sel, 'getRanges');
                        sel.appendRange('anything');
                        expect(sel.getRanges).toHaveBeenCalled();
                        expect(sel.setRanges).toHaveBeenCalledWith(['anything']);
                    });

                    it('calls setRanges method if _ranges array is empty', function(){
                        spyOn(sel, 'getRanges').and.returnValue([]);
                        sel.appendRange('anything');
                        expect(sel.getRanges).toHaveBeenCalled();
                        expect(sel.setRanges).toHaveBeenCalledWith(['anything']);
                    });

                    it('calls setRanges method if _ranges array is not empty', function(){
                        spyOn(sel, 'getRanges').and.returnValue([1, 2, '3']);
                        sel.appendRange('a valid range');
                        expect(sel.getRanges).toHaveBeenCalled();
                        expect(sel.setRanges).toHaveBeenCalledWith([1, 2, '3', 'a valid range']);
                    });

                });
            });
        });

        describe('method containsRange', function(){
            it('throws an error if isRange return false', function(){
                spyOn(sel, 'isRange').and.returnValue(false);
                expect(function(){
                    sel.containsRange('whatever');
                }).toThrow(new Error('The argument must be a Range instance!'));
            });
            it('returns false if _ranges is not set', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'getRanges');
                expect(sel.containsRange('anything')).toBe(false);
            });
            it('returns false if _ranges is empty', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'getRanges').and.returnValue([]);
                expect(sel.containsRange('range')).toBe(false);
            });
            it('calls "areEqual" to compare the ranges', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'areEqual').and.returnValue(false);
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                sel.containsRange('range');
                expect(sel.areEqual).toHaveBeenCalledWith('r1', 'range');
                expect(sel.areEqual).toHaveBeenCalledWith('r2', 'range');
                expect(sel.areEqual).toHaveBeenCalledWith('r3', 'range');
            });
            it('returns false if method "areEqual" always returns false', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'areEqual').and.returnValue(false);
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                expect(sel.containsRange(range)).toBe(false);
            });

            it('returns true if "areEqual" returns "true" during the first execution', function(){
                spyOn(sel, 'areEqual').and.callFake(function(){return true;}); // always returns true
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                expect(sel.containsRange(range)).toBe(true);
            });

            it('calls "areEqual" for first two elements if it returns "true" during the second execution', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'areEqual').and.callFake(function(x, y){return x === 'r2' || y === 'r2';}); // returns true only for the second range
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                sel.containsRange('range');
                expect(sel.areEqual).toHaveBeenCalledWith('r1', 'range');
                expect(sel.areEqual).toHaveBeenCalledWith('r2', 'range');
                expect(sel.areEqual).not.toHaveBeenCalledWith('r3', 'range');
            });

            it('returns true if "areEqual" returns "true" during last (third) execution', function(){
                spyOn(sel, 'areEqual').and.callFake(function(x){return x === 'r3';}); // returns true only for the third range
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                expect(sel.containsRange(range)).toBe(true);
            });
        });

        describe('method areEqual', function(){
            it('returns false if called with one argument that is not a Range instance', function(){
                spyOn(sel, 'isRange').and.returnValue(false);
                expect(sel.areEqual('anything')).toBe(false);
                expect(sel.isRange).toHaveBeenCalledWith('anything');
            });
            it('returns false if called with one argument that is a Range instance', function(){
                spyOn(sel, 'isRange').and.callFake(function(r){return r !== undefined;});
                expect(sel.areEqual('anything')).toBe(false);
                expect(sel.isRange).toHaveBeenCalledWith('anything');
            });
            it('returns false if both arguments are not Range instances', function(){
                spyOn(sel, 'isRange').and.callFake(function(){return false;});
                expect(sel.areEqual('not range', 'niether this')).toBe(false);
            });
            it('returns false if first arg is a Range instance, the second - not', function(){
                spyOn(sel, 'isRange').and.callFake(function(r){return r === 'range';});
                expect(sel.areEqual('range', 'not range')).toBe(false);
                expect(sel.isRange).toHaveBeenCalledWith('range');
                expect(sel.isRange).toHaveBeenCalledWith('not range');
            });

            it('returns true, if both ranges are identical', function(){
                expect(sel.areEqual(range, range)).toBe(true);
            });

            it('returns true, if the ranges start and end in element nodes and have the same offsets', function(){
                var range2 = document.createRange();
                range.setStart(e21, 0);
                range.setEnd(e23, 0);
                range2.setStart(e21, 0);
                range2.setEnd(e23, 0);
                expect(sel.areEqual(range, range2)).toBe(true);
            });

            it('returns true, if the ranges start and end in the same text node and have the same offsets', function(){
                var range2 = document.createRange();
                range.setStart(t22, 2);
                range.setEnd(t22, 5);
                range2.setStart(t22, 2);
                range2.setEnd(t22, 5);
                expect(sel.areEqual(range, range2)).toBe(true);
            });

            it('returns false, if the ranges start and end in the same text node and have different offsets', function(){
                var range2 = document.createRange();
                range.setStart(t22, 1);
                range.setEnd(t22, 4);
                range2.setStart(t22, 3);
                range2.setEnd(t22, 5);
                expect(sel.areEqual(range, range2)).toBe(false);
            });

            it('returns false, if the ranges start and end in the same text node and have different offsets', function(){
                var range2 = document.createRange();
                range.setStart(t22, 1);
                range.setEnd(t22, 4);
                range2.setStart(t22, 3);
                range2.setEnd(t22, 5);
                expect(sel.areEqual(range, range2)).toBe(false);
            });

            it('returns false, if the ranges start and end in the same element node and have different offsets', function(){
                var range2 = document.createRange();
                range.setStart(e21, 1);
                range.setEnd(e21, 2);
                range2.setStart(e21, 0);
                range2.setEnd(e21, 1);
                expect(sel.areEqual(range, range2)).toBe(false);
            });
        });

        describe('has method rangeCount that', function(){
            it('returns 0, if the "ranges" is not set', function(){
                spyOn(sel, 'getRanges');
                expect(sel.rangeCount()).toBe(0);
            });
            it('returns 0, if the "ranges" is an empty array ([])', function(){
                spyOn(sel, 'getRanges').and.returnValue([]);
                expect(sel.rangeCount()).toBe(0);
            });
            it('returns 2, if the "ranges" is an array containing two elements ([..., ...])', function(){
                spyOn(sel, 'getRanges').and.returnValue(['1', '2']);
                expect(sel.rangeCount()).toBe(2);
            });

            it('returns 3, if the "ranges" is an array containing three elements ([..., ..., ...])', function(){
                spyOn(sel, 'getRanges').and.returnValue(['1', 'second range', ['3']]);
                expect(sel.rangeCount()).toBe(3);
            });
        });

        describe('has method setRanges that', function(){
            it('sets ranges to empty array if it is called without argument', function(){
                sel.setRanges();
                var res = sel.getRanges();
                expect(Array.isArray(res)).toBe(true);
                expect(res.length).toBe(0);
            });
            it('sets ranges to empty array if the argument is invalid', function(){
                var invalids = [0, 5, -1, 2.1, -2.3, '', 'string', {}, {foo: 1}, function(){return;}];
                invalids.forEach(function(invalid){
                    sel = new Selection();
                    sel.setRanges(invalid);
                    var res = sel.getRanges();
                    expect(Array.isArray(res)).toBe(true);
                    expect(res.length).toBe(0);
                });
            });
            it('sets ranges to empty array if the argument is an empty array', function(){
                sel.setRanges([]);
                var res = sel.getRanges();
                expect(Array.isArray(res)).toBe(true);
                expect(res.length).toBe(0);
            });

            it('appends ranges if they are all valid', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'appendRange');
                sel.setRanges(['r1', 'r2', 'r3']);
                var r = sel.getRanges();
                expect(Array.isArray(r)).toBe(true);
                expect(r.length).toBe(3);
                expect(r[0]).toBe('r1');
                expect(r[1]).toBe('r2');
                expect(r[2]).toBe('r3');
            });

            it('does not call append range method on first argument if it is not a valid range', function(){
                spyOn(sel, 'isRange').and.callFake(function(r){return r !== 'r1';});
                spyOn(sel, 'appendRange');
                sel.setRanges(['r1', 'r2', 'r3']);
                var r = sel.getRanges();
                expect(Array.isArray(r)).toBe(true);
                expect(r.length).toBe(2);
                expect(r[0]).toBe('r2');
                expect(r[1]).toBe('r3');
            });

            it('does not call append range method on a middle argument if it is not a valid range', function(){
                spyOn(sel, 'isRange').and.callFake(function(r){return r !== 'rMiddle';});
                spyOn(sel, 'appendRange');
                sel.setRanges(['r1', 'r2', 'rMiddle', 'rLast']);
                var r = sel.getRanges();
                expect(Array.isArray(r)).toBe(true);
                expect(r.length).toBe(3);
                expect(r[0]).toBe('r1');
                expect(r[1]).toBe('r2');
                expect(r[2]).toBe('rLast');
            });

            it('does not call append range method on last argument if it is not a valid range', function(){
                spyOn(sel, 'isRange').and.callFake(function(r){return r !== 'rLast';});
                spyOn(sel, 'appendRange');
                sel.setRanges(['r1', 'r2', 'r3', 'rMiddle', 'rLast']);
                var r = sel.getRanges();
                expect(Array.isArray(r)).toBe(true);
                expect(r.length).toBe(4);
                expect(r[0]).toBe('r1');
                expect(r[1]).toBe('r2');
                expect(r[2]).toBe('r3');
                expect(r[3]).toBe('rMiddle');
            });
        });

        describe('has nextRange method that', function(){
            it('is undefined, if "ranges" is undefined', function(){
                spyOn(sel, 'getRanges');
                expect(sel.nextRange()).not.toBeDefined();
            });
            it('returns undefiend after the second call, if "ranges" is undefined', function(){
                spyOn(sel, 'getRanges');
                sel.nextRange();
                expect(sel.nextRange()).not.toBeDefined();
            });

            it('is undefined, if "ranges" is an empty array', function(){
                spyOn(sel, 'getRanges');
                expect(sel.nextRange()).not.toBeDefined();
            });
            it('returns first range, if "ranges" contains single  element', function(){
                spyOn(sel, 'getRanges').and.returnValue(['range1']);
                spyOn(sel, 'rangeCount').and.returnValue(1);
                expect(sel.nextRange()).toBe('range1');
            });
            it('returns nothing when executed twice, if "ranges" contains single element', function(){
                spyOn(sel, 'getRanges').and.returnValue(['range1']);
                spyOn(sel, 'rangeCount').and.returnValue(1);
                sel.nextRange();
                expect(sel.nextRange()).not.toBeDefined();
            });
            it('returns four elements when executed 4 times and when "ranges" contains 5 elements', function(){
                spyOn(sel, 'getRanges').and.returnValue(['range1', 'range2', 'range3', 'range4', 'range5']);
                spyOn(sel, 'rangeCount').and.returnValue(5);
                expect(sel.nextRange()).toBe('range1');
                expect(sel.nextRange()).toBe('range2');
                expect(sel.nextRange()).toBe('range3');
                expect(sel.nextRange()).toBe('range4');
            });
            it('returns undefined for last three calls when executed 6 times, if "ranges" contains only three elements', function(){
                spyOn(sel, 'getRanges').and.returnValue(['range1', 'range2', 'range3']);
                spyOn(sel, 'rangeCount').and.returnValue(3);
                expect(sel.nextRange()).toBeDefined();
                expect(sel.nextRange()).toBeDefined();
                expect(sel.nextRange()).toBeDefined();
                expect(sel.nextRange()).not.toBeDefined();
                expect(sel.nextRange()).not.toBeDefined();
                expect(sel.nextRange()).not.toBeDefined();
            });
            it('starts over after resetting if ranges is not defined', function(){
                spyOn(sel, 'getRanges');
                sel.startOver();
                expect(sel.nextRange()).not.toBeDefined();
            });
            it('starts over after two calls, if "ranges" contains three elements', function(){
                spyOn(sel, 'getRanges').and.returnValue(['range1', 'range2', 'range3']);
                spyOn(sel, 'rangeCount').and.returnValue(3);
                expect(sel.nextRange()).toBe('range1');
                expect(sel.nextRange()).toBe('range2');
                sel.startOver();
                expect(sel.nextRange()).toBe('range1');
                expect(sel.nextRange()).toBe('range2');
                expect(sel.nextRange()).toBe('range3');
            });
            it('starts over, if "ranges" contains single element', function(){
                spyOn(sel, 'getRanges').and.returnValue(['range1']);
                spyOn(sel, 'rangeCount').and.returnValue(1);
                expect(sel.nextRange()).toBe('range1');
                expect(sel.nextRange()).not.toBeDefined();
                sel.startOver();
                expect(sel.nextRange()).toBe('range1');
                expect(sel.nextRange()).not.toBeDefined();
                expect(sel.nextRange()).not.toBeDefined();
                sel.startOver();
                sel.startOver();
                expect(sel.nextRange()).toBe('range1');
            });
        });

        xdescribe('has method nodesOfRange that', function(){
            it('returns an empty array if the argument is not a range', function(){
                var invalids = [undefined, null, 0, 8, 4.3, -21, -5.98, '', 'string', [], [1, 3], function(){return;}, {}, {foo: 11}];
                invalids.forEach(function(invalid){
                    var nodes = sel.nodesOfRange(invalid);
                    expect(nodes).not.toBeDefined();
                });
            });
            it('returns an empty array if the argument is a collapsed range', function(){
                range.collapse();
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(0);
            });
            it('returns array with single element node if the range contains single element node', function(){
                range.setStart(e10, 1);
                range.setEnd(e10, 2);
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes[0]).toBe(e21);
            });

            it('returns array with single text node if the range contains single text node', function(){
                range.setStart(e10, 2);
                range.setStart(e11, 3);
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes.length).toBe(t22);
            });
            it('returns an array with a text node if the range contains a fraction of a text node', function(){
                range.setStart(t22, 4);
                range.setStart(t22, 8);
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(1);
                expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
            });
            it('returns an array with several nodes if the range starts inside a text node', function(){
                range.setStart(t20, 4);  // includes text node with content " node 2.0"
                range.setStart(e10, 4);  // includes nodes e21, t22, e23
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(4);
                expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(nodes[1].textContent).toBe(' node 2.0');
                expect(nodes[1]).toBe(e21);
                expect(nodes[2]).toBe(t22);
                expect(nodes[3]).toBe(e23);
            });

            it('returns an array with several nodes if the range finishes inside a text node', function(){
                range.setStart(e21, 0);  // includes element node e30
                range.setStart(t31, 2);  // includes text node with content "xt node 3.1"
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(2);
                expect(nodes[0]).toBe(e30);
                expect(nodes[1].nodeType).toBe(Node.TEXT_NODE);
                expect(nodes[1].textContent).toBe('xt node 3.1');
            });


            it('returns an array with several nodes if the range starts and finishes inside a text node', function(){
                range.setStart(e21, 0);  // includes element node e30
                range.setStart(t31, 2);  // includes text node with content "xt node 3.1"
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(2);
                expect(nodes[0]).toBe(e30);
                expect(nodes[1].nodeType).toBe(Node.TEXT_NODE);
                expect(nodes[1].textContent).toBe('xt node 3.1');
            });
        });
    });

    describe('a method commonAncestor that', function(){
        it('returns nothing if it is called without arguments', function(){
            expect(sel.commonAncestor()).not.toBeDefined();
        });
        it('returns nothing if it is called with one argument', function(){
            expect(sel.commonAncestor(e10)).not.toBeDefined();
        });

        it('returns the first argument if it is a parent of the second which is an element node', function(){
            expect(sel.commonAncestor(e10, e23)).toBe(e10);
        });

        it('returns the first argument if it is a parent of the second which is a text node', function(){
            expect(sel.commonAncestor(e21, t31)).toBe(e21);
        });

        it('returns the second argument if it is a parent of the first which is an element node', function(){
            expect(sel.commonAncestor(e25, e11)).toBe(e11);
        });

        it('returns the second argument if it is a parent of the first which is a text node', function(){
            expect(sel.commonAncestor(t20, e10)).toBe(e10);
        });

        it('returns null if the nodes have no common parent', function(){
            expect(sel.commonAncestor(e23, n11)).toBe(null);
        });

        it('returns the common parent if the arguments are element nodes and are siblings of each other', function(){
            expect(sel.commonAncestor(e21, e23)).toBe(e10);
        });

        it('returns the common parent if the first argument is located deeper than the second', function(){
            expect(sel.commonAncestor(e21, e11)).toBe(e00);
        });

        it('returns the common parent if the second argument is located deeper than the first', function(){
            expect(sel.commonAncestor(e10, e25)).toBe(e00);
        });
    });

    describe('a method to find the root node that', function(){
        it('returns nothing if the argument is an undefined, string, number, array, function or a non-Node object', function(){
            var invalids = [undefined, null, '', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.rootOf(invalid)).not.toBeDefined();
            });
        });
        it('returns root node of a text node', function(){
            expect(sel.rootOf(t22)).toBe(e00);
        });
        it('returns root node of an element node', function(){
            expect(sel.rootOf(e25)).toBe(e00);
        });
        it('returns the argument if it is its own root', function(){
            expect(sel.rootOf(e00)).toBe(e00);
        });
    });

    describe('a method to calculate path to an element that', function(){
        it('returns empty array if the argument is the root element', function(){
            var path = sel.pathTo(e00, e00);
            expect(Array.isArray(path)).toBe(true);
            expect(path.length).toBe(0);
        });
        it('returns nothing if the scope (2nd argument) does not contain the node (first argument)', function(){
            expect(sel.pathTo(e23, e11)).not.toBeDefined();
        });
        it('returns [0] if the first argument is the first child of the second argument', function(){
            console.log(t20, e10);
            var path = sel.pathTo(t20, e10);

            expect(Array.isArray(path)).toBe(true);
            expect(path.length).toBe(1);
            expect(path[0]).toBe(0);
        });
        it('returns [1] if the first argument is the second child of the second argument', function(){
            var path = sel.pathTo(e21, e10);
            expect(Array.isArray(path)).toBe(true);
            expect(path.length).toBe(1);
            expect(path[0]).toBe(1);
        });
        it('returns [4] if the first argument is the last child among 5 children of the second argument', function(){
            var path = sel.pathTo(t24, e10);
            expect(Array.isArray(path)).toBe(true);
            expect(path.length).toBe(1);
            expect(path[0]).toBe(4);
        });
        it('returns three element array if the first argument lays at "depth" 3', function(){
            var path = sel.pathTo(e30, e00);
            expect(Array.isArray(path)).toBe(true);
            expect(path.length).toBe(3);
            expect(path[0]).toBe(0);
            expect(path[1]).toBe(1);
            expect(path[2]).toBe(0);
        });
    });

    describe('a method to get an element by path that', function(){
        it('returns nothing if the path is not defined or given as a string, a number, a function or an object', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.getNodeByPath(invalid)).not.toBeDefined();
            });
        });
        it('returns nothing if the reference is not given or given as a string, a number, an array, a function or a non-node object', function(){
            var invalids = ['', 'a string', 0, 1, 4.32, -2, -5.96, [], [1, 2, 3], function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.getNodeByPath([], invalid)).not.toBeDefined();
            });
        });
        it('returns the reference node if the path is an empty array', function(){
            expect(sel.getNodeByPath([], e10)).toBe(e10);
        });
        it('returns the first child of the reference node if the path is [0]', function(){
            expect(sel.getNodeByPath([0], e21)).toBe(e30);
        });
        it('returns the last child of the reference node', function(){
            expect(sel.getNodeByPath([1], e11)).toBe(e26);
        });
        it('returns third-generation child', function(){
            expect(sel.getNodeByPath([0, 1, 1], e00)).toBe(t31);
        });
        it('returns nothing if the path contains reference to a non-existent node', function(){
            expect(sel.getNodeByPath([3, 2, 0], e10)).not.toBeDefined();
        });
        it('returns nothing if the path passes through a text node', function(){
            expect(sel.getNodeByPath([2, 1], e10)).not.toBeDefined();
        });
    });

    describe('a method to find common "head" part of two arrays that' , function(){
        it('returns empty array if both arguments are empty arrays', function(){
            var res = sel.commonHead([], []);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns empty array if the first argument is an empty array and the second is not', function(){
            var res = sel.commonHead([], [1, 2, 4]);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns empty array if the second argument is an empty array and the first is not', function(){
            var res = sel.commonHead([1, 0, 0], []);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns empty array if the arguments have no common head', function(){
            var res = sel.commonHead([1, 0, 0], [0, 2, 3]);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns empty array if the arguments have no common head', function(){
            var res = sel.commonHead([1, 0, 0], [0, 2, 3, 3, 1]);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns the input array if the arguments are equal non-empty arrays', function(){
            var res = sel.commonHead([1, 2, 3], [1, 2, 3]);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(3);
            expect(res[0]).toBe(1);
            expect(res[1]).toBe(2);
            expect(res[2]).toBe(3);
        });
        it('returns the first argument if the second array is a concatenation of the first and another array', function(){
            var res = sel.commonHead([0, 2], [0, 2, 3]);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res[0]).toBe(0);
            expect(res[1]).toBe(2);
        });
        it('returns the second argument if the first array is a concatenation of the second and another array', function(){
            var res = sel.commonHead([7, 4, 1, 6], [7, 4, 1]);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(3);
            expect(res[0]).toBe(7);
            expect(res[1]).toBe(4);
            expect(res[2]).toBe(1);
        });
    });

    describe('a method to find previous siblings that', function(){
        it('returns nothing if the argument is not defined or is a string, a number, a function or a non-Node object', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.prevSiblings(invalid)).not.toBeDefined();
            });
        });

        it('returns empty array if the argument is a unique child', function(){
            var res = sel.prevSiblings(e32);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns empty array if the argument is a first but not unique child', function(){
            var res = sel.prevSiblings(e10);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns array with one Node if the argument is a second child', function(){
            var res = sel.prevSiblings(e26);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
            expect(res[0]).toBe(e25);
        });
        it('returns array with three Nodes if the argument is a fourth child', function(){
            var res = sel.prevSiblings(e23);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(3);
            expect(res[0]).toBe(t22);
            expect(res[1]).toBe(e21);
            expect(res[2]).toBe(t20);
        });
    });

    describe('a method to find next siblings that', function(){
        it('returns nothing if the argument is not defined or is a string, a number, a function or a non-Node object', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.nextSiblings(invalid)).not.toBeDefined();
            });
        });

        it('returns empty array if the argument is a unique child', function(){
            var res = sel.nextSiblings(e32);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns empty array if the argument is a last but not unique child', function(){
            var res = sel.nextSiblings(e26);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns array with one Node if the argument is a before-last child', function(){
            var res = sel.nextSiblings(e23);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
            expect(res[0]).toBe(t24);
        });
        it('returns array with two Nodes if the argument is a second-from-the-end child', function(){
            var res = sel.nextSiblings(t22);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res[0]).toBe(e23);
            expect(res[1]).toBe(t24);
        });
    });

    describe('a method to find previous ascendants in given scope that', function(){
        it('returns nothing if called without arguments', function(){
            expect(sel.bunchPrevSiblings()).not.toBeDefined();
        });
        it('returns nothing if the first argument is invalid one and the second is a valid one', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.bunchPrevSiblings(invalid, e25)).not.toBeDefined();
            });
        });
        it('returns nothing if the second argument is invalid one and the first is a valid one', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.bunchPrevSiblings(t20, invalid)).not.toBeDefined();
            });
        });
        it('returns nothing if the input node does not belong to the scope node', function(){
            expect(sel.bunchPrevSiblings(e21, e11)).not.toBeDefined();
        });

        it('returns an empty array if the input node is equal to the scope node', function(){
            var res = sel.bunchPrevSiblings(e10, e10);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns an array with the node previous siblings if the scope node is the node\'s parent one', function(){
            var res = sel.bunchPrevSiblings(e23, e10);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(3);
            expect(res.indexOf(t22) !== -1).toBe(true);
            expect(res.indexOf(e21) !== -1).toBe(true);
            expect(res.indexOf(t20) !== -1).toBe(true);
        });
        it('returns an empty array if the input node is a unique child of the scope node', function(){
            var res = sel.bunchPrevSiblings(e32, e25);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns an empty array if the input node is a unique child of unique child of the scope node', function(){
            var res = sel.bunchPrevSiblings(e32, e11);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns an array with single node if the branch of the input node has no previous siblings', function(){
            var res = sel.bunchPrevSiblings(e32, e00);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
            expect(res[0]).toBe(e10);
        });
    });

    describe('a method to find next ascendants in given scope that', function(){
        it('returns nothing if called without arguments', function(){
            expect(sel.bunchNextSiblings()).not.toBeDefined();
        });
        it('returns nothing if the first argument is invalid one and the second is a valid one', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.bunchNextSiblings(invalid, e25)).not.toBeDefined();
            });
        });
        it('returns nothing if the second argument is invalid one and the first is a valid one', function(){
            var invalids = [undefined, null, '', 'a string', 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(sel.bunchNextSiblings(e23, invalid)).not.toBeDefined();
            });
        });
        it('returns nothing if the input node does not belong to the scope node', function(){
            expect(sel.bunchNextSiblings(e30, e26)).not.toBeDefined();
        });

        it('returns an empty array if the input node is equal to the scope node', function(){
            var res = sel.bunchNextSiblings(e10, e10);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns an array with the node next siblings if the scope node is the node\'s parent one', function(){
            var res = sel.bunchNextSiblings(t22, e10);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e23) !== -1).toBe(true);
            expect(res.indexOf(t24) !== -1).toBe(true);
        });
        it('returns an empty array if the input node is a unique child of the scope node', function(){
            var res = sel.bunchNextSiblings(e32, e25);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });
        it('returns an array with single node if the input node has no next siblings in its branch', function(){
            var res = sel.bunchNextSiblings(t24, e00);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
            expect(res[0]).toBe(e11);
        });
        it('returns an array with different-depth nodes', function(){
            var res = sel.bunchNextSiblings(e30, e00);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(5);
            expect(res.indexOf(t31) !== -1).toBe(true);
            expect(res.indexOf(t22) !== -1).toBe(true);
            expect(res.indexOf(e23) !== -1).toBe(true);
            expect(res.indexOf(t24) !== -1).toBe(true);
            expect(res.indexOf(e11) !== -1).toBe(true);
        });
    });

    describe('a method indexOf that', function(){
        it('throws exception if argument either string, number, array, function or non-Node element', function(){
            var invalids = [undefined, null, '', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(function(){
                    sel.indexOf(invalid);
                }).toThrow(new Error('The argument must be a Node instance!'));
            });
        });
        it('returns 0 if the element is the first child of its parent', function(){
            expect(sel.indexOf(e10)).toBe(0);
        });
        it('returns 1 for the second child', function(){
            expect(sel.indexOf(e21)).toBe(1);
        });
        it('returns 4 for the last child (among four)', function(){
            expect(sel.indexOf(t24)).toBe(4);
        });
    });

    describe('a method splitTextNode that', function(){
        it('leaves the parent node unchanged if the argument is a Node instance', function(){
            sel.splitTextNode(e21, 9);
            expect(e21.childNodes.length).toBe(2);
            expect(e21.childNodes[0]).toBe(e30);
            expect(e21.childNodes[1]).toBe(t31);
        });
        describe('splits first text node in two text nodes', function(){
            it('if the split index is zero', function(){
                var t201 = sel.splitTextNode(t20, 0);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('');
                expect(e10.childNodes[1].textContent).toBe('text node 2.0');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than zero but less than the content length', function(){
                var t201 = sel.splitTextNode(t20, 6);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('text n');
                expect(e10.childNodes[1].textContent).toBe('ode 2.0');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is equal to the content length', function(){
                var t201 = sel.splitTextNode(t20, 13);
                expect(e10.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[1]).toBe(t201);
                expect(e10.childNodes[0].textContent).toBe('text node 2.0');
                expect(e10.childNodes[1].textContent).toBe('');
                expect(e10.childNodes[2]).toBe(e21);
                expect(e10.childNodes[3]).toBe(t22);
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than the content length', function(){
                var t201 = sel.splitTextNode(t20, 50);
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

        describe('splits an inner text node in two text nodes', function(){
            it('if the split index is zero', function(){
                var t221 = sel.splitTextNode(t22, 0);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[3]).toBe(t221);
                expect(e10.childNodes[2].textContent).toBe('');
                expect(e10.childNodes[3].textContent).toBe('text node 2.2');
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than zero but less than the content length', function(){
                var t221 = sel.splitTextNode(t22, 4);
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
            it('if the split index is equal to the content length', function(){
                var t221 = sel.splitTextNode(t22, 13);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[3]).toBe(t221);
                expect(e10.childNodes[2].textContent).toBe('text node 2.2');
                expect(e10.childNodes[3].textContent).toBe('');
                expect(e10.childNodes[4]).toBe(e23);
                expect(e10.childNodes[5]).toBe(t24);
            });
            it('if the split index is greater than the content length', function(){
                var t221 = sel.splitTextNode(t22, 100);
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

        describe('splits the last text node in two text nodes', function(){
            it('if the split index is zero', function(){
                var t241 = sel.splitTextNode(t24, 0);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('');
                expect(e10.childNodes[5].textContent).toBe('text node 2.4');
            });
            it('if the split index is greater than zero but less than the content length', function(){
                var t241 = sel.splitTextNode(t24, 8);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('text nod');
                expect(e10.childNodes[5].textContent).toBe('e 2.4');
            });
            it('if the split index is equal to the content length', function(){
                var t241 = sel.splitTextNode(t24, 13);
                expect(e10.childNodes[0]).toBe(t20);
                expect(e10.childNodes[1]).toBe(e21);
                expect(e10.childNodes[2]).toBe(t22);
                expect(e10.childNodes[3]).toBe(e23);
                expect(e10.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
                expect(e10.childNodes[5]).toBe(t241);
                expect(e10.childNodes[4].textContent).toBe('text node 2.4');
                expect(e10.childNodes[5].textContent).toBe('');
            });
            it('if the split index is greater than the content length', function(){
                var t241 = sel.splitTextNode(t24, 200);
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

    describe('a method overlayRange that', function(){
        it('throws an error if its argument is a string, number, function, array or non-Range object', function(){
            var invalids = ['', 'a string', [], [1, 2, 3], 0, 1, 4.32, -2, -5.96, function(){return;}, {}, {foo: 23}];
            invalids.forEach(function(invalid){
                expect(function(invalid){
                    sel.overlayRange(invalid);
                }).toThrow(new Error('The argument must be a Range instance!'));
            });
        });
        it('calls "spliceText" with two breakpoints if the range starts and ends in the same text node', function(){
            range.setStart(t22, 2);
            range.setEnd(t22, 6);
            spyOn(sel, 'spliceText');
            sel.overlayRange(range);
            expect(sel.spliceText).toHaveBeenCalledWith(t22, [2, 6]);
        });

        it('does not call "spliceText" if the range starts and ends in the same element node', function(){
            range.setStart(e11, 0);
            range.setEnd(e11, 2);
            spyOn(sel, 'spliceText');
            sel.overlayRange(range);
            expect(sel.spliceText).not.toHaveBeenCalled();
        });
        it('does not call "spliceText" if the range starts and ends in different element nodes', function(){
            range.setStart(e10, 2);
            range.setEnd(e25, 1);
            spyOn(sel, 'spliceText');
            sel.overlayRange(range);
            expect(sel.spliceText).not.toHaveBeenCalled();
        });
        it('calls "spliceText" for end container if the range starts in the element node but ends in text node', function(){
            range.setStart(e10, 2);
            range.setEnd(t24, 4);
            spyOn(sel, 'spliceText');
            sel.overlayRange(range);
            expect(sel.spliceText).toHaveBeenCalledWith(t24, [4]);
        });
        it('calls "spliceText" for start container if the range starts in the text node but ends in element node', function(){
            range.setStart(t31, 6);
            range.setEnd(e11, 1);
            spyOn(sel, 'spliceText');
            sel.overlayRange(range);
            expect(sel.spliceText).toHaveBeenCalledWith(t31, [6]);
        });
    });

    describe('a method spliceText that', function(){
        it('does not modify parent of the text node if the breakpoints array is empty', function(){
            sel.spliceText(t20, []);
            expect(e10.childNodes.length).toBe(5);
            expect(e10.childNodes[0]).toBe(t20);
            expect(e10.childNodes[1]).toBe(e21);
            expect(e10.childNodes[2]).toBe(t22);
            expect(e10.childNodes[3]).toBe(e23);
            expect(e10.childNodes[4]).toBe(t24);
        });
        it('does not modify parent of the text node if the breakpoints array is [0]', function(){
            sel.spliceText(t20, [0]);
            expect(e10.childNodes.length).toBe(5);
            expect(e10.childNodes[0]).toBe(t20);
            expect(e10.childNodes[1]).toBe(e21);
            expect(e10.childNodes[2]).toBe(t22);
            expect(e10.childNodes[3]).toBe(e23);
            expect(e10.childNodes[4]).toBe(t24);
        });
        it('does not modify parent of the text node if the breakpoints array is [0, 0, 0]', function(){
            sel.spliceText(t24, [0]);
            expect(e10.childNodes.length).toBe(5);
            expect(e10.childNodes[0]).toBe(t20);
            expect(e10.childNodes[1]).toBe(e21);
            expect(e10.childNodes[2]).toBe(t22);
            expect(e10.childNodes[3]).toBe(e23);
            expect(e10.childNodes[4]).toBe(t24);
        });
        it('does not modify parent of the text node if the unique breakpoint corresponds to the end of the text node', function(){
            sel.spliceText(t22, [t22.textContent.length]);
            expect(e10.childNodes.length).toBe(5);
            expect(e10.childNodes[0]).toBe(t20);
            expect(e10.childNodes[1]).toBe(e21);
            expect(e10.childNodes[2]).toBe(t22);
            expect(e10.childNodes[3]).toBe(e23);
            expect(e10.childNodes[4]).toBe(t24);
        });
        it('does not modify parent of the text node if the breakpoint lays beyond the end of the text node', function(){
            sel.spliceText(t22, [t22.textContent.length + 10]);
            expect(e10.childNodes.length).toBe(5);
            expect(e10.childNodes[0]).toBe(t20);
            expect(e10.childNodes[1]).toBe(e21);
            expect(e10.childNodes[2]).toBe(t22);
            expect(e10.childNodes[3]).toBe(e23);
            expect(e10.childNodes[4]).toBe(t24);
        });
        it('splits the text node in two parts if the breakpoint lays inside the node', function(){
            sel.spliceText(t22, [7]);
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
        it('splits the text node in four pieces if the breakpoint contains three increasing numbers', function(){
            sel.spliceText(t22, [4, 7, 10]);
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

        it('splits the text node in three pieces if the breakpoint contains two coincident numbers', function(){
            sel.spliceText(t22, [4, 4, 10]);
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

    xdescribe('a method to pick up the first node', function(){
        describe('of range\'s start and end containers are the same element node and', function(){
            it('if the node to return is a first-sibling element node', function(){
                range.setStart(e11, 0);
                range.setEnd(e11, 2);
                expect(sel.startNode(range)).toBe(e25);
            });
            it('if the node to return is a first-sibling text node', function(){
                range.setStart(e10, 0);
                range.setEnd(e10, 3);
                expect(sel.startNode(range)).toBe(t20);
            });
            it('if the node to return is a middle-sibling element node ', function(){
                range.setStart(e10, 1);
                range.setEnd(e10, 3);
                expect(sel.startNode(range)).toBe(e21);
            });
            it('if the node to return is a middle-sibling text node', function(){
                range.setStart(e10, 2);
                range.setEnd(e10, 4);
                expect(sel.startNode(range)).toBe(t22);
            });
            it('if the node to return is a last-sibling element node ', function(){
                range.setStart(e11, 1);
                range.setEnd(e11, 2);
                expect(sel.startNode(range)).toBe(e26);
            });
            it('if the node to return is a last-sibling text node', function(){
                range.setStart(e10, 3);
                range.setEnd(e10, 4);
                expect(sel.startNode(range)).toBe(t24);
            });
        });
        describe('of range\'s start and end containers are the same text node and', function(){
            it('does not modify DOM if the range covers completely the text node', function(){
                range.setStart(t22, 0);
                range.setEnd(t22, 13);
                sel.startNode(range);
                expect(e10.childNodes.length).toBe(5);
            });
            it('returns the text node if the range covers completely the text node', function(){
                range.setStart(t22, 0);
                range.setEnd(t22, 13);
                expect(sel.startNode(range)).toBe(t22);
            });
            it('returns a newly created text node if the range starts at the beginning of the node and finishes in middle', function(){
                range.setStart(t24, 0);
                range.setEnd(t24, 5);
                var n = sel.startNode(range);
                expect(n).toBe(e10.childNodes[4]);
            });
            it('returns a newly created text node if the range starts in middle of the node and finishes at the end', function(){
                range.setStart(t24, 3);
                range.setEnd(t24, 13);
                var n = sel.startNode(range);
                expect(n).toBe(e10.childNodes[5]);
            });
            it('returns a newly created text node if the range starts and finishes in middle of the node', function(){
                range.setStart(t24, 3);
                range.setEnd(t24, 5);
                var n = sel.startNode(range);
                expect(n).toBe(e10.childNodes[5]);
            });
            it('adds 2 additional text nodes to the parent of the text node if the range starts and finishes in middle of the node', function(){
                range.setStart(t24, 3);
                range.setEnd(t24, 5);
                var n = sel.startNode(range);
                expect(e10.childNodes.length).toBe(7);
            });




            it('if the node to return is a first-sibling text node', function(){
                range.setStart(e10, 0);
                range.setEnd(e10, 3);
                expect(sel.startNode(range)).toBe(t20);
            });
            it('if the node to return is a middle-sibling element node ', function(){
                range.setStart(e10, 1);
                range.setEnd(e10, 3);
                expect(sel.startNode(range)).toBe(e21);
            });
            it('if the node to return is a middle-sibling text node', function(){
                range.setStart(e10, 2);
                range.setEnd(e10, 4);
                expect(sel.startNode(range)).toBe(t22);
            });
            it('if the node to return is a last-sibling element node ', function(){
                range.setStart(e11, 1);
                range.setEnd(e11, 2);
                expect(sel.startNode(range)).toBe(e26);
            });
            it('if the node to return is a last-sibling text node', function(){
                range.setStart(e10, 3);
                range.setEnd(e10, 4);
                expect(sel.startNode(range)).toBe(t24);
            });
        });
    });

    xdescribe('a method to pick up the last node in the range that', function(){
        it('returns a node corresponding to the range start offset', function(){
            range.setStart(e10, 1);
            range.setEnd(e10, 3);
            expect(sel.startNode(range)).toBe(t22);
        });
        it('returns a text that is located correctly in DOM', function(){
            range.setStart(t20, 5);
            range.setEnd(e00, 1);
            var start = sel.startNode(range);
            expect(e10.childNodes[1]).toBe(start);
        });
        it('returns a text that with correct content', function(){
            range.setStart(t20, 2);
            range.setEnd(e00, 2);
            var start = sel.startNode(range);
            expect(e10.childNodes[1].textContent).toBe('xt node 2.0');
        });
        it('returns nothing if the range is collapsed', function(){
            range.collapse();
            expect(sel.startNode(range)).not.toBeDefined();
        });
    });



});


