/*jslint plusplus: true, white: true */
/*global Controller */

/**
 * Text Decoration Controller.
 * @module    Controllers
 * @class     CTextDecoration
 * @type      {Object}
 * @since     0.1.0
 * @author    A.Shcherbakov
 */
function CTextDecoration() {
    "use strict";
    if (!(this instanceof CTextDecoration)) {
        return new CTextDecoration();
    }
    Controller.call(this);

    /**
     * Converts selection to become of bold font.
     *
     * The method gets the editor content and detects selected nodes.
     * Based on the selection, the editor content is modified and the new content is inserted
     * into the editor window.
     * @method         convertToBold
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.1.0
     */
    this.convertToBold = function(editor){
        var adapter, doc, content, ranges;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc.convertToBold(ranges); // here, object "content" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when converting selection into bold font: ' + e.message);
            return;
        }
    };
}
CTextDecoration.prototype = Object.create(Controller.prototype);
