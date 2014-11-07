/*jslint plusplus: true, white: true */
/*global describe, xdescribe, it, xit, expect, spyOn, beforeEach, CKEDITOR, Selection */

describe('Selection-related functionality', function(){
    // it seems that when activating these suits makes the page with test
    // output freeze for some seconds

    var sel, editor, selected;
    beforeEach(function(){
        editor = new CKEDITOR.editor();
        selected = new CKEDITOR.dom.selection(CKEDITOR.document);
    });


    describe('Selection::constructor()', function(){
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

    describe('editor setter/getter', function(){
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

    describe('ranges getter', function(){
        it('sets the editor', function(){
            sel = new Selection();
            sel.setSelected(selected);
            expect(sel.getSelected()).toBe(selected);
        });
    });

    describe('Getting first element of the selection', function(){
        it('gives undefined if nothing is selected', function(){
            sel = new Selection(editor);
            expect(sel.getStartElement()).not.toBeDefined();
        });
        it('gives first element (pending test)', function(){
            var el1 = CKEDITOR.dom.element.createFromHtml('<div id="uniqueid1">div 1</div>'),
                el2 = CKEDITOR.dom.element.createFromHtml('<div id="uniqueid2">div 2</div>'),
                el3 = CKEDITOR.dom.element.createFromHtml('<div id="uniqueid3">div 3</div>');
            editor.insertElement(el1);
            editor.insertElement(el2);
            editor.insertElement(el3);

            // editor.createRange().select();
            // console.log(editor, editor.editable());
            // editor.getSelection().selectElement(el1);
            // var r = new CKEDITOR.dom.range(el1);
            // r.selectNodeContents(el1);
            sel = new Selection(editor);
            expect(sel.getStartElement()).toBeDefined();
            pending();
        });
    });

    describe('Range', function(){
        var range;
        beforeEach(function(){
            sel = new Selection();
            range = document.createRange();
        });
        xit('can select nodes', function(){
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

            range = document.createRange();

            range.setStart(e10, 2);
            range.setEnd(t24, 5);

            console.log(range.toString());
            console.log(e00.innerHTML);
            expect(true).toBe(false);
        });

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

            it('calls "areEqual" for first two elements if it returns "true" during the second execution', function(){
                spyOn(sel, 'isRange').and.returnValue(true);
                spyOn(sel, 'areEqual').and.callFake(function(x, y){return x === 'r2';}); // returns true only for the second range
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                sel.containsRange('range');
                expect(sel.areEqual).toHaveBeenCalledWith('r1', 'range');
                expect(sel.areEqual).toHaveBeenCalledWith('r2', 'range');
                expect(sel.areEqual).not.toHaveBeenCalledWith('r3', 'range');

            });


            it('calls "areEqual" once if it returns "true" during  the first execution', function(){
                spyOn(sel, 'areEqual').and.callFake(function(x){return x === 'r2';}); // returns true only for the second range
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                sel.containsRange(range);
                expect(sel.areEqual).toHaveBeenCalledWith([['r1', range], ['r2', range]]);
                expect(sel.areEqual).not.toHaveBeenCalledWith([['r3', range]]);
            });

            it('returns true if "areEqual" returns "true" during the first execution', function(){
                spyOn(sel, 'areEqual').and.callFake(function(){return true;}); // always returns true
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                expect(sel.containsRange(range)).toBe(true);
            });

            it('calls "areEqual" twice if it returns "true" during  the second execution', function(){
                spyOn(sel, 'areEqual').and.callFake(function(x){return x === 'r2';}); // returns true only for the second range
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                sel.containsRange(range);
                expect(sel.areEqual).toHaveBeenCalledWith([['r1', range], ['r2', range]]);
                expect(sel.areEqual).not.toHaveBeenCalledWith([['r3', range]]);
            });

            it('returns true if "areEqual" returns "true" during last (third) execution', function(){
                spyOn(sel, 'areEqual').and.callFake(function(x){return x === 'r3';}); // returns true only for the third range
                spyOn(sel, 'getRanges').and.returnValue(['r1', 'r2', 'r3']);
                expect(sel.containsRange(range)).toBe(true);
            });



        });
    });
});


