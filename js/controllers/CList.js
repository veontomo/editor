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

    /**
     * Converts selection into an ordered or unordered list.
     *
     * The method gets the editor content and detects selected nodes.
     * Based on the selection, the editor content is modified and the new content is inserted
     * into the editor window.
     * @method         convertToList
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
            doc.insertLists(content, ranges, listType);
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when converting editor content into a list: ' + e.message);
        }
    };

}
CList.prototype = Object.create(Controller.prototype);
