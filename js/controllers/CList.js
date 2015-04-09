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

}
CList.prototype = Object.create(Controller.prototype);
