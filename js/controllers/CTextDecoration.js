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

    /**
     * Converts selection to become of italic style font.
     *
     * The method gets the editor content and detects selected nodes.
     * Based on the selection, the editor content is modified and the new content is inserted
     * into the editor window.
     * @method         convertToItalics
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.2.0
     */

    this.convertToItalics = function(editor){
        var adapter, doc, content, ranges;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc.convertToItalics(ranges); // here, object "content" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when converting selection into italics: ' + e.message);
            return;
        }
    };

    /**
     * Converts selection to become stroked.
     *
     * The method gets the editor content and detects selected nodes.
     * Based on the selection, the editor content is modified and the new content is inserted
     * into the editor window.
     * @method         convertToStroked
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.2.0
     */
    this.convertToStroked = function(editor){
        var adapter, doc, content, ranges;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc.convertToStroked(ranges); // here, object "content" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when converting selection into stoked: ' + e.message);
            return;
        }
    };

    /**
     * Converts selection to become underlined.
     *
     * The method gets the editor content and detects selected nodes.
     * Based on the selection, the editor content is modified and the new content is inserted
     * into the editor window.
     * @method         convertToUnderlined
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.2.0
     */
    this.convertToUnderlined = function(editor){
        var adapter, doc, content, ranges;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc.convertToUnderlined(ranges); // here, object "content" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when converting selection into underlined: ' + e.message);
            return;
        }
    };

}
CTextDecoration.prototype = Object.create(Controller.prototype);
