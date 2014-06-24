/*jslint plusplus: true, white: true */
/*global describe, it, xit, expect, spyOn, beforeEach, CKEDITOR, Selection */

describe('Selection-related functionality', function(){
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
                new Selection('aaa');
            }).toThrow('The first argument must be a CKEDITOR.editor instance!');
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
                sel.setEditor({});
            }).toThrow('The argument must be a CKEDITOR.editor instance!');
        });

        it('sets the editor', function(){
            sel = new Selection();
            sel.setEditor(editor);
            expect(sel.getEditor()).toBe(editor);

        });
    });

    describe('selection setter/getter', function(){
        it('throws error if not CKEDITOR.dom.selection instance is given to the setter', function(){
            expect(function(){
                sel = new Selection();
                sel.setSelected();
            }).toThrow('The argument must be a CKEDITOR.dom.selection instance!');
        });

        it('sets the editor', function(){
            sel = new Selection();
            sel.setSelected(selected);
            expect(sel.getSelected()).toBe(selected);
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
        it('gives empty element', function(){
            sel = new Selection(editor);
            expect(sel.getStartElement()).not.toBeDefined();
        });
        xit('gives empty element', function(){
            var el1 = CKEDITOR.dom.element.createFromHtml('<div id="uniqueid1">div 1</div>'),
                el2 = CKEDITOR.dom.element.createFromHtml('<div id="uniqueid2">div 2</div>'),
                el3 = CKEDITOR.dom.element.createFromHtml('<div id="uniqueid3">div 3</div>');
            editor.insertElement(el1);
            editor.insertElement(el2);
            editor.insertElement(el3);
            sel = new Selection(editor);
            expect(sel.getStartElement()).toBeDefined();
        });
    });



});


