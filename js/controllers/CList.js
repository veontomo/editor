/*jslint plusplus: true, white: true */
/*global Controller, List, NEWSLETTER, Document, Element */

/**
 * List Controller.
 * @module    Controllers
 * @class     CList
 * @type      {Object}
 * @since     0.1.0
 * @author    A.Shcherbakov
 */
function CList() {
    "use strict";
    if (!(this instanceof CList)) {
        return new CList();
    }
    Controller.call(this);

    this.setModel(List);

    /**
     * Converts selection into an ordered or unordered list.
     *
     * The method gets the editor content and detects selected nodes.
     * Based on the selection, the editor content is modified and the new content is inserted
     * into the editor window.
     * @method         insertLists
     * @param          {Object}        editor
     * @param          {String}        listType
     * @return         {void}
     * @since          0.1.0
     */
    this.insertLists = function(editor, listType){
        var adapter, doc, content, ranges;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc.selectionToList(ranges, listType); // here, object "content" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when converting editor content into a list: ' + e.message);
        }
    };

    /**
     * Changes type of the list.
     *
     * The type of which list is to be changed is decided based on the cursor position:
     * the nearest list ansector of type `oldType` is replaced by a list of type `newType`.
     * The content of the original list remains unchanged.
     *
     * @method         changeListType
     * @param          {Object}        editor
     * @param          {Element}       list        this list is to chaneg its type
     * @param          {String}        newType     the above list should become of this type
     * @return         {void}
     * @since          0.1.0
     */
    this.changeListType = function(editor, list, newType){
        var adapter, doc, content;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            doc.setListNodeType(list, newType); // here, object "editor" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when changing list type: ' + e.message);
        }
    };

    /**
     * Finds the nearest list ancestor of element `el`; the list must be of type `type`.
     *
     * Returns nothing if the corresponding element is not found.
     * @method         findListAncestorOfType
     * @param          {Object}        el      editor-specific representation of DOM node.
     * @param          {String}        type
     * @return         {Node}                  [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
     * @since          0.2.5
     */
    this.findListAncestorOfType = function(el, type){
        var adapter = this.getEditorAdapter(),
            nativeEl = adapter.toNativeElement(el);
        if (!nativeEl){
            return;
        }
        var worker = this.getWorker();
        var crit = function(el){
            return (el instanceof Element) && (el.tagName.toLowerCase() === type);
        };
        return worker.findAncestor(nativeEl, crit);
    };

}
CList.prototype = Object.create(Controller.prototype);
