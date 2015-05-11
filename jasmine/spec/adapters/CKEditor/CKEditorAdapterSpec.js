/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, CKEDITOR, CKEditorAdapter, Range */

describe('Class CKEditorAdapter', function() {
    var editor, editorRange, adapter, e00, e10, e11, e21, e23, e30;
    beforeEach(function() {

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

        e00 = new CKEDITOR.dom.element('div');
        e10 = new CKEDITOR.dom.element('p');
        e11 = new CKEDITOR.dom.element('span');
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
    describe('has method toNativeRange that', function() {
        it('returns undefined if its argument is a non-CKEditor range object', function() {
            var invalids = [undefined, null, 0, 2, 3.2, -5, -32.6, '', 'a string', [],
                [0],
                [1, 2, 3], {},
                function() {
                    return 1;
                }, {
                    'a': 1
                },
                document.createElement('div')
            ];
            invalids.forEach(function(invalid) {
                var ad = new CKEditorAdapter();
                expect(ad.toNativeRange(invalid)).not.toBeDefined();
            });
        });

        it('returns Range instance if its argument is an empty CKEditor range object', function() {
            editorRange.setStartAt(e10, CKEDITOR.POSITION_BEFORE_END);
            editorRange.collapse();
            expect(adapter.toNativeRange(editorRange) instanceof Range).toBe(true);
        });


        it('returns Range instance if its argument is a CKEditor range object', function() {
            editorRange.setStart(e10, CKEDITOR.POSITION_BEFORE_END);
            editorRange.setEnd(e11, CKEDITOR.POSITION_BEFORE_END);
            expect(adapter.toNativeRange(editorRange) instanceof Range).toBe(true);
        });

        it('reproduces selection if it corresponds to a part of a text element', function() {
            var t20 = e10.getChild(0);
            editorRange.setStart(t20, 3);
            editorRange.setEnd(t20, 7);
            var r = adapter.toNativeRange(editorRange);
            expect(r.startOffset).toBe(3);
            expect(r.endOffset).toBe(7);
            expect(r.startContainer.isEqualNode(t20.$)).toBe(true);
            expect(r.endContainer.isEqualNode(t20.$)).toBe(true);
        });

        it('reproduces selection if start and end nodes have the same parent', function() {
            editorRange.setStart(e10, 1);
            editorRange.setEnd(e10, 3);
            var r = adapter.toNativeRange(editorRange);
            expect(r.startOffset).toBe(1);
            expect(r.endOffset).toBe(3);
            expect(r.startContainer.isEqualNode(e10.$)).toBe(true);
            expect(r.endContainer.isEqualNode(e10.$)).toBe(true);
        });

        it('reproduces selection if it starts in a text node and ends in an element node', function() {
            var t20 = e21.getChild(1);
            editorRange.setStart(t20, 5);
            editorRange.setEnd(e10, 4);
            var r = adapter.toNativeRange(editorRange);
            expect(r.startOffset).toBe(5);
            expect(r.endOffset).toBe(4);
            expect(r.startContainer.isEqualNode(t20.$)).toBe(true);
            expect(r.endContainer.isEqualNode(e10.$)).toBe(true);
        });
    });

    describe('has a method "findSimilarKey" that', function() {
        it('returns undefined if the object is empty', function() {
            var re = new RegExp('abc');

            expect(adapter.findSimilarKey({}, re)).toBe(undefined);
        });
        it('returns undefined if no key matches', function() {
            var re = new RegExp('AAA');
            var obj = {
                'a': 1,
                'b': 2
            };
            expect(adapter.findSimilarKey(obj, re)).toBe(undefined);
        });

        it('returns a key it is a unique one that matches', function() {
            var re = new RegExp('a\\d');
            var obj = {
                'a': 1,
                'b': 2,
                'a1': 2,
                'c': true
            };
            expect(adapter.findSimilarKey(obj, re)).toBe('a1');
            console.log(adapter.tableDialogToTemplate({}));
        });

        it('returns the first key that matches', function() {
            var re = new RegExp('a\\d');
            var obj = {
                'a2': 1,
                'b': 2,
                'a1': 2,
                'c': true
            };
            expect(adapter.findSimilarKey(obj, re)).toBe('a2');
        });
    });
});
