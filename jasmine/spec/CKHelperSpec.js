/*jslint plusplus: true, white: true */
/*global describe, it, expect, CKHelper, CKEDITOR, beforeEach */

describe ('CKHelper functions', function(){
    var root, el0, el1, el2, el10, el11, el12, el20, res;
    beforeEach(function(){
        root = CKEDITOR.dom.element.createFromHtml('<div id="root"></div>');
        el0 = CKEDITOR.dom.element.createFromHtml('<p id="el0"></p>');
        el1 = CKEDITOR.dom.element.createFromHtml('<span id="el1"></span>');
        el2 = CKEDITOR.dom.element.createFromHtml('<i id="el2"></i>');
        el10 = CKEDITOR.dom.element.createFromHtml('<span id="el10"></span>');
        el11 = CKEDITOR.dom.element.createFromHtml('<b id="el11"></b>');
        el12 = CKEDITOR.dom.element.createFromHtml('<strong id="el12"></strong>');
        el20 = CKEDITOR.dom.element.createFromHtml('<h1 id="el20">Hello!</h1>');
        root.append(el0);
        root.append(el1);
        root.append(el2);
        el1.append(el10);
        el1.append(el11);
        el1.append(el12);
        el2.append(el20);
    });

    describe("CKHelper::isEditor()", function () {
        it('returns false if the argument is a string', function () {
            expect(CKHelper.isEditor('a string')).toBe(false);
        });
        it('returns false if the argument is a number', function () {
            expect(CKHelper.isEditor(19)).toBe(false);
            expect(CKHelper.isEditor(0.219)).toBe(false);
            expect(CKHelper.isEditor(-4.3)).toBe(false);
        });
        it('returns false if the argument is an object', function () {
            expect(CKHelper.isEditor({})).toBe(false);
            expect(CKHelper.isEditor({foo:1, 'boo': 'yes'})).toBe(false);
        });
        it('returns true if the argument is an CKEDITOR.editor', function () {
            expect(CKHelper.isEditor(new CKEDITOR.editor())).toBe(true);
        });
    });
    describe('CKHelper::isSelection()', function () {
        it('returns false if the argument is a string', function () {
            expect(CKHelper.isSelection('a string')).toBe(false);
        });
        it('returns false if the argument is a number', function () {
            expect(CKHelper.isSelection(19)).toBe(false);
            expect(CKHelper.isSelection(0.219)).toBe(false);
            expect(CKHelper.isSelection(-4.3)).toBe(false);
        });
        it('returns false if the argument is an object', function () {
            expect(CKHelper.isSelection({})).toBe(false);
            expect(CKHelper.isSelection({foo:1, 'boo': 'yes'})).toBe(false);
        });
        it('returns true if the argument is an CKEDITOR.editor', function () {
            expect(CKHelper.isSelection(new CKEDITOR.dom.selection(CKEDITOR.document))).toBe(true);
        });
    });
    describe('CKHelper::next-siblings()', function(){
        it('returns empty array if the current node has no next siblings', function(){
            res = CKHelper['next-siblings'](el2);
            expect(res.length).toBe(0);
        });
        it('returns array with one node if the current node has one next siblings', function(){
            res = CKHelper['next-siblings'](el1);
            expect(res.length).toBe(1);
            expect(res[0].equals(el2)).toBe(true);
        });

        it('returns array with two nodes if the current node has two next siblings', function(){
            res = CKHelper['next-siblings'](el0);
            expect(res.length).toBe(2);
            expect(res[0].equals(el1)).toBe(true);
            expect(res[1].equals(el2)).toBe(true);
        });

        it('returns empty array if the current node is deeply nested and has no next siblings', function(){
            res = CKHelper['next-siblings'](el12);
            expect(res.length).toBe(0);
        });
        it('returns array with one nodes if current node is deeply nested and has one next siblings', function(){
            res = CKHelper['next-siblings'](el11);
            expect(res.length).toBe(1);
            expect(res[0].equals(el12)).toBe(true);
        });
        it('returns array with two nodes if this node is deeply nested and has two next siblings', function(){
            res = CKHelper['next-siblings'](el10);
            expect(res.length).toBe(2);
            expect(res[0].equals(el11)).toBe(true);
            expect(res[1].equals(el12)).toBe(true);
        });
    });
    describe('CKHelper::prev-siblings()', function(){
        it('returns empty array if the current node is a first child', function(){
            res = CKHelper['prev-siblings'](el0);
            expect(res.length).toBe(0);
        });
        it('returns array with one node if the current node has one sibling before', function(){
            res = CKHelper['prev-siblings'](el1);
            expect(res.length).toBe(1);
            expect(res[0].equals(el0)).toBe(true);
        });

        it('returns array with two nodes if the current node has two siblings before', function(){
            res = CKHelper['prev-siblings'](el2);
            expect(res.length).toBe(2);
            expect(res[0].equals(el1)).toBe(true);
            expect(res[1].equals(el0)).toBe(true);
        });

        it('returns empty array if the current node is deeply nested and it is a first child', function(){
            res = CKHelper['prev-siblings'](el10);
            expect(res.length).toBe(0);
        });
        it('returns array with one node if current node is deeply nested and has one sibling before', function(){
            res = CKHelper['prev-siblings'](el11);
            expect(res.length).toBe(1);
            expect(res[0].equals(el10)).toBe(true);
        });
        it('returns array with two nodes if this node is deeply nested and has two siblings before', function(){
            res = CKHelper['prev-siblings'](el12);
            expect(res.length).toBe(2);
            expect(res[0].equals(el11)).toBe(true);
            expect(res[1].equals(el10)).toBe(true);
        });
    });

});


