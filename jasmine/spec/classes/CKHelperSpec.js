/*jslint plusplus: true, white: true */
/*global describe, it, expect, CKHelper, CKEDITOR, beforeEach */

describe ('CKHelper functions', function(){
    // var root, el0, el1, el2, el00, el10, el11, el12, el20, res;
    // beforeEach(function(){
    //     root = CKEDITOR.dom.element.createFromHtml('<div id="root"></div>');
    //     el0 = CKEDITOR.dom.element.createFromHtml('<p id="el0"></p>');
    //     el1 = CKEDITOR.dom.element.createFromHtml('<span id="el1"></span>');
    //     el2 = CKEDITOR.dom.element.createFromHtml('<i id="el2"></i>');
    //     el00 = CKEDITOR.dom.element.createFromHtml('<a href="www.test.com" id="el00"></a>');
    //     el10 = CKEDITOR.dom.element.createFromHtml('<span id="el10"></span>');
    //     el11 = CKEDITOR.dom.element.createFromHtml('<b id="el11"></b>');
    //     el12 = CKEDITOR.dom.element.createFromHtml('<strong id="el12"></strong>');
    //     el20 = CKEDITOR.dom.element.createFromHtml('<h1 id="el20">Hello!</h1>');
    //     root.append(el0); //                 root
    //     root.append(el1); //   ________________|_______________
    //     root.append(el2); //   |               |               |
    //     el0.append(el00); //  el0             el1             el2
    //     el1.append(el10); //   |        _______|_______        |
    //     el1.append(el11); //   |        |      |       |       |
    //     el1.append(el12); //  el00     el10   el11    el12     el20
    //     el2.append(el20);
    // });
    describe('This test', function(){
        it('is a trivial one', function(){
            expect(true).toBe(true);
        });
    });

    // describe("CKHelper::isEditor()", function () {
    //     it('returns false if the argument is a string', function () {
    //         pending();
    //         expect(CKHelper.isEditor('a string')).toBe(false);
    //     });
    //     it('returns false if the argument is a number', function () {
    //         pending();
    //         expect(CKHelper.isEditor(19)).toBe(false);
    //         expect(CKHelper.isEditor(0.219)).toBe(false);
    //         expect(CKHelper.isEditor(-4.3)).toBe(false);
    //     });
    //     it('returns false if the argument is an object', function () {
    //         pending();
    //         expect(CKHelper.isEditor({})).toBe(false);
    //         expect(CKHelper.isEditor({foo:1, 'boo': 'yes'})).toBe(false);
    //     });
    //     it('returns true if the argument is an CKEDITOR.editor', function () {
    //         pending();
    //         expect(CKHelper.isEditor(new CKEDITOR.editor())).toBe(true);
    //     });
    // });
    // describe('CKHelper::isSelection()', function () {
    //     it('returns false if the argument is a string', function () {
    //         expect(CKHelper.isSelection('a string')).toBe(false);
    //     });
    //     it('returns false if the argument is a number', function () {
    //         expect(CKHelper.isSelection(19)).toBe(false);
    //         expect(CKHelper.isSelection(0.219)).toBe(false);
    //         expect(CKHelper.isSelection(-4.3)).toBe(false);
    //     });
    //     it('returns false if the argument is an object', function () {
    //         expect(CKHelper.isSelection({})).toBe(false);
    //         expect(CKHelper.isSelection({foo:1, 'boo': 'yes'})).toBe(false);
    //     });
    //     it('returns true if the argument is an CKEDITOR.editor', function () {
    //         expect(CKHelper.isSelection(new CKEDITOR.dom.selection(CKEDITOR.document))).toBe(true);
    //     });
    // });
    // describe('CKHelper::next-siblings()', function(){
    //     it('returns empty array if the current node has no next siblings', function(){
    //         res = CKHelper['next-siblings'](el2);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns array with one node if the current node has one next siblings', function(){
    //         res = CKHelper['next-siblings'](el1);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el2)).toBe(true);
    //     });

    //     it('returns array with two nodes if the current node has two next siblings', function(){
    //         res = CKHelper['next-siblings'](el0);
    //         expect(res.length).toBe(2);
    //         expect(res[0].equals(el1)).toBe(true);
    //         expect(res[1].equals(el2)).toBe(true);
    //     });

    //     it('returns empty array if the current node is deeply nested and has no next siblings', function(){
    //         res = CKHelper['next-siblings'](el12);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns array with one nodes if current node is deeply nested and has one next siblings', function(){
    //         res = CKHelper['next-siblings'](el11);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el12)).toBe(true);
    //     });
    //     it('returns array with two nodes if this node is deeply nested and has two next siblings', function(){
    //         res = CKHelper['next-siblings'](el10);
    //         expect(res.length).toBe(2);
    //         expect(res[0].equals(el11)).toBe(true);
    //         expect(res[1].equals(el12)).toBe(true);
    //     });
    // });
    // describe('CKHelper::prev-siblings()', function(){
    //     it('returns empty array if the current node is a first child', function(){
    //         res = CKHelper['prev-siblings'](el0);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns array with one node if the current node has one sibling before', function(){
    //         res = CKHelper['prev-siblings'](el1);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el0)).toBe(true);
    //     });

    //     it('returns array with two nodes if the current node has two siblings before', function(){
    //         res = CKHelper['prev-siblings'](el2);
    //         expect(res.length).toBe(2);
    //         expect(res[0].equals(el1)).toBe(true);
    //         expect(res[1].equals(el0)).toBe(true);
    //     });

    //     it('returns empty array if the current node is deeply nested and it is a first child', function(){
    //         res = CKHelper['prev-siblings'](el10);
    //         expect(res.length).toBe(0);
    //     });
    //     it('returns array with one node if current node is deeply nested and has one sibling before', function(){
    //         res = CKHelper['prev-siblings'](el11);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el10)).toBe(true);
    //     });
    //     it('returns array with two nodes if this node is deeply nested and has two siblings before', function(){
    //         res = CKHelper['prev-siblings'](el12);
    //         expect(res.length).toBe(2);
    //         expect(res[0].equals(el11)).toBe(true);
    //         expect(res[1].equals(el10)).toBe(true);
    //     });
    // });

    // describe('CKHelper::bunch-next-siblings()', function(){
    //     it('returns empty array if the first argument is not a node inside the second argument', function(){
    //         expect(CKHelper['bunch-next-siblings'](el11, el20).length).toBe(0);
    //     });
    //     it('returns an array with one element if the first and second arguments are equal', function(){
    //         res = CKHelper['bunch-next-siblings'](el11, el11);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el11)).toBe(true);
    //     });
    //     it('return array with the only element if the selected node has no next siblings', function(){
    //         res = CKHelper['bunch-next-siblings'](el2, root);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el2)).toBe(true);
    //     });
    //     it('return array with the two elements if the selected node has one next sibling', function(){
    //         res = CKHelper['bunch-next-siblings'](el1, root);
    //         expect(res.length).toBe(2);
    //         expect(res[0].equals(el1)).toBe(true);
    //         expect(res[1].equals(el2)).toBe(true);
    //     });
    //     it('return array with elements of upper level if the selected node is deeply nested', function(){
    //         res = CKHelper['bunch-next-siblings'](el11, root);
    //         expect(res.length).toBe(3);
    //         expect(res[0].equals(el11)).toBe(true);
    //         expect(res[1].equals(el12)).toBe(true);
    //         expect(res[2].equals(el2)).toBe(true);
    //     });
    // });
    // describe('CKHelper::bunch-prev-siblings()', function(){
    //     it('returns empty array if the first argument is not a node inside the second argument', function(){
    //         expect(CKHelper['bunch-prev-siblings'](el11, el20).length).toBe(0);
    //     });
    //     it('returns an array with one element if the first and second arguments are equal', function(){
    //         res = CKHelper['bunch-prev-siblings'](el12, el12);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el12)).toBe(true);
    //     });
    //     it('return array with the only element if the selected node has no previous siblings', function(){
    //         res = CKHelper['bunch-prev-siblings'](el0, root);
    //         expect(res.length).toBe(1);
    //         expect(res[0].equals(el0)).toBe(true);
    //     });
    //     it('return array with the two elements if the selected node has one previous sibling', function(){
    //         res = CKHelper['bunch-prev-siblings'](el1, root);
    //         expect(res.length).toBe(2);
    //         expect(res[0].equals(el1)).toBe(true);
    //         expect(res[1].equals(el0)).toBe(true);
    //     });
    //     it('return array with elements of upper level if the selected node is deeply nested', function(){
    //         res = CKHelper['bunch-prev-siblings'](el11, root);
    //         expect(res.length).toBe(3);
    //         expect(res[0].equals(el11)).toBe(true);
    //         expect(res[1].equals(el10)).toBe(true);
    //         expect(res[2].equals(el0)).toBe(true);
    //     });
    // });

    // describe('CKHelper::childWithNode(): finds the child of the given element containing given node', function(){
        // it('return null if the element does not contain the node', function(){
        //     expect(CKHelper.childWithNode(el1, el2)).toBe(null);
        // });
        // it('returns the node if it is the first child of the element', function(){
        //     res = CKHelper.childWithNode(root, el0);
        //     expect(res.equals(el0)).toBe(true);
        // });
        // it('returns the node if it is the last child of the element', function(){
        //     res = CKHelper.childWithNode(el1, el12);
        //     expect(res.equals(el12)).toBe(true);
        // });
        // it('returns the last child of the element if it contains the node', function(){
        //     res = CKHelper.childWithNode(root, el20);
        //     expect(res.equals(el2)).toBe(true);
        // });
        // it('returns the first child of the element if it contains the node', function(){
        //     res = CKHelper.childWithNode(root, el00);
        //     expect(res.equals(el0)).toBe(true);
        // });
        // it('returns a middle child of the element if it contains the node', function(){
        //     res = CKHelper.childWithNode(root, el10);
        //     expect(res.equals(el1)).toBe(true);
        // });
    // });

    // describe('CKHelper::containsOrEqual(): whether the first argument contains or equal to thte second', function(){
        // it('gives true, if the arguments are equal and have NODE_ELEMENT type', function(){
        //     expect(el1.type).toBe(CKEDITOR.NODE_ELEMENT);
        //     expect(CKHelper.containsOrEqual(el1, el1)).toBe(true);
        // });
        // it('gives true, if the arguments are equal and have NODE_TEXT type', function(){
        //     el00.appendHtml('<span>text</span>');
        //     var text = el00.getFirst().getFirst();
        //     expect(text.type).toBe(CKEDITOR.NODE_TEXT);
        //     expect(CKHelper.containsOrEqual(text, text)).toBe(true);
        // });

        // it('gives true, if both arguments are NODE_ELEMENT and the first one contains the second', function(){
        //     expect(root.type).toBe(CKEDITOR.NODE_ELEMENT);
        //     expect(CKHelper.containsOrEqual(root, el11)).toBe(true);
        // });
        // it('gives false, if both arguments are NODE_ELEMENT and the first one doesn not contain the second', function(){
        //     expect(root.type).toBe(CKEDITOR.NODE_ELEMENT);
        //     expect(CKHelper.containsOrEqual(el0, el12)).toBe(false);
        // });

        // it('gives true, if first argument is NODE_ELEMENT, the second is NODE_ELEMENT and it is inside the first one', function(){
        //     el11.appendHtml('<span>text</span>');
        //     var text = el11.getFirst().getFirst();
        //     expect(root.type).toBe(CKEDITOR.NODE_ELEMENT);
        //     expect(CKHelper.containsOrEqual(el1, text)).toBe(true);
        // });
        // it('gives false, if first argument is NODE_ELEMENT, the second is NODE_TEXT and it is NOT inside the first one', function(){
        //     el11.appendHtml('<span>text</span>');
        //     var text = el11.getFirst().getFirst();
        //     expect(root.type).toBe(CKEDITOR.NODE_ELEMENT);
        //     expect(CKHelper.containsOrEqual(el0, text)).toBe(false);
        // });
        // xit('gives false, if first argument is NODE_TEXT, the second is NODE_ELEMENT which embraces the first', function(){
        //     el11.appendHtml('<span>text</span>');
        //     var text = el11.getFirst().getFirst();
        //     expect(root.type).toBe(CKEDITOR.NODE_ELEMENT);
        //     expect(CKHelper.containsOrEqual(text, el11)).toBe(false);
        // });
    // });


});


