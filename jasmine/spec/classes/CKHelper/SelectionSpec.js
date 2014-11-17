/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, CKEDITOR, NEWSLETTER, Selection, CKEditorAdapter */

describe('Selection class has', function(){
    // it seems that when activating these suits makes the page with test
    // output freeze for some seconds

    var sel, editor, selected;
    var range, e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31, n00, n10, n11;

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
        //      ___|___
        //     |       |
        //     e30    t31

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
        // var  e00, e10, e11, e21, e23, e30, adapter;
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

    describe('range related functionality that', function(){
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
                    expect(Array.isArray(nodes)).toBe(true);
                    expect(nodes.length).toBe(0);
                });
            });
            it('returns an empty array if the argument is an empty range', function(){
                range.collapse();
                var nodes = sel.nodesOfRange(range);
                expect(Array.isArray(nodes)).toBe(true);
                expect(nodes.length).toBe(0);
            });
            it('returns array with single element node if the range contains single element node', function(){
                range.setStart(e10, 1);
                range.setStart(e11, 2);
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

    describe('method commonAncestor that', function(){
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

///////////////  end ////////////////////////////////////////

});


