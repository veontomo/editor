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
            console.log(n00.outerHTML);
            sel = new Selection(editor);
            expect(sel.commonAncestor(n10, n31)).toBe(n10);
        });

        it('returns the second argument if it contains the first argument', function(){
            sel = new Selection(editor);
            expect(sel.commonAncestor(n23, n00)).toBe(n00);
        });


        it('returns null if the nodes have no common parent', function(){
            sel = new Selection(editor);
            expect(sel.commonAncestor(n23, m10)).toBe(null);
        });

        it('returns the common parent if the nodes are siblings of each other', function(){
            sel = new Selection(editor);
            expect(sel.commonAncestor(n21, n22)).toBe(n10);
        });

        it('returns the common parent if the first argument is located deeper than the second', function(){
            sel = new Selection(editor);
            expect(sel.commonAncestor(n21, n22)).toBe(n10);
        });

        it('returns the common parent if the second argument is located deeper than the first', function(){
            sel = new Selection(editor);
            expect(sel.commonAncestor(n30, n23)).toBe(n00);
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
            sel = new Selection(editor);
            expect(sel.proxy(e21)).toBe(e21);
        });

        it('gets proxy of a text node without siblings', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t25)).toBe(e11);
        });

        it('gets proxy of a middle (among its siblings) text node', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t22)).toBe(t22);
        });

        it('gets proxy of the first (among its siblings) text node', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t20)).toBe(t20);
        });
        it('gets proxy of the last (among its siblings) text node', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t24)).toBe(t24);
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
            sel = new Selection(editor);
            expect(sel.proxy(e21)).toBe(e21);
        });

        it('gets proxy of a text node without siblings', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t25)).toBe(e11);
        });

        it('gets proxy of a middle (among its siblings) text node', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t22)).toBe(t22);
        });

        it('gets proxy of the first (among its siblings) text node', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t20)).toBe(t20);
        });
        it('gets proxy of the last (among its siblings) text node', function(){
            sel = new Selection(editor);
            expect(sel.proxy(t24)).toBe(t24);
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

        it('find value of style property if the element has it imposed', function(){
            sel = new Selection(editor);
            expect(sel.);
        });


    });

});


