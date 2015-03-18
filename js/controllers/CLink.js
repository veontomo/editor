/*jslint plusplus: true, white: true */
/*global Controller, Link, NEWSLETTER, Document, Element */

/**
 * Link controller.
 * @module    Controllers
 * @class     CLink
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
function CLink() {
    "use strict";
    if (!(this instanceof CLink)) {
        return new CLink();
    }
    Controller.call(this);

    this.setModel(Link);

    /**
     * Remove link from the editor.
     * @method         unlink
     * @param          {Object}        editor
     * @param          {Node|null}     link            [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
     *                                                 instance that has triggered the context menu with operation to
     *                                                 remove the link
     * @return         {void}
     * @since          0.2.0
     */
    this.unlink = function(editor, link){
        var adapter, doc, content, ranges;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc.clearRangesFromLinks(ranges); // here, object "content" changes (because "ranges" is passed as reference)
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when removing links: ' + e.message);
        }
    };

    /**
     * Modifies the content of the `editor` based on the current selection and information
     * collected from the `dialog` window.
     *
     * It is supposed that the {{#crossLink "Controller/_worker:property"}}_worker{{/crossLink}}
     * (an object that elaborates the editor content) has properties
     * {{#crossLink "Document/_content:property"}}Document::_content{{/crossLink}} and
     * {{#crossLink "Document/_selectedNodes:property"}}Document::_selectedNodes{{/crossLink}}
     * defined. This means that the current method is called after another method (like
     * {{#crossLink "Controller/onShow:method"}}onShow{{/crossLink}})
     * has intialized those properties.
     *
     * <em>I have chosen this approach in order to have correct information about selection: remember
     * that in order to fill in a link creation dialog, the DOM might undergo modifications
     * (when a text node is selected partially), while the ranges (that as far as I concern) remain
     * unchanged. Therefore the ranges might not correspond anymore to the original selection.</em>
     * @method         onOk
     * @param          {Object}        dialog
     * @param          {Object}        editor
     * @param          {Node|null}     link
     * @return         {void}
     * @since          0.1.0
     */
    this.onOk = function(dialog, editor, link) {
        console.log('target element:', link);
        var adapter, doc, content, ranges, dialogData, template;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            dialogData = adapter.getDialogData(dialog);
            template = adapter.dialogToTemplate(dialogData, 'link');
            if (link){
                console.log('the dialog has been given a link to elaborate.');
            } else {
                console.log('the dialog has not been given any link to elaborate. Probably, a new link is to be created.');
            }
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when inserting link: ' + e.message);
        }

    };


    /**
     * Fills in dialog window based on what the user selects.
     *
     * Overrides base class method {{#crossLink "Controller/fillDialogWithSelection:method"}}Controller{{/crossLink}}
     * since the sublasses might have different implementations of the method.
     *
     * @method         fillDialogWithSelection
     * @param          {Object}        dialog        editor-specific representation of a dialog window
     * @param          {Object}        selection     editor-specific representation of the selection
     * @return         {void}
     * @since          0.2.1
     * @Override
     */
    this.fillDialogWithSelection = function(dialog, selection){
        /// !!! stub
        console.dir(dialog);
        console.dir(selection);
    };

}
CLink.prototype = Object.create(Controller.prototype);
