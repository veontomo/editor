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
     * has initialized those properties.
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
        var adapter, doc, content, ranges, dialogData, template;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            dialogData = adapter.getDialogData(dialog);
            template = adapter.dialogToTemplate(dialogData, 'link');
            worker.insertLink(content, ranges, template, link);
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when inserting link: ' + e.message);
        }

    };


    /**
     * Fills in `dialog` window based on `editor` state (content, selection etc).
     *
     * Overrides base class method {{#crossLink "Controller/fillInDialog:method"}}Controller{{/crossLink}}
     * since the subclasses might have different implementations of the method.
     * @method         fillInDialog
     * @param          {Object}        dialog        editor-specific representation of a dialog window
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.2.1
     * @Override
     */
    this.fillInDialog = function(dialog, editor){
        var adapter, ranges, doc, content, links, selectionContent;
        try {
            adapter = this.getEditorAdapter();
            content = adapter.getEditorContent(editor);
            ranges = adapter.getNativeRanges(editor);
            doc = this.getWorker();
            links = doc.findAncestorsOfRanges(ranges, this.getModel().prototype.characteristicFunction);
            selectionContent = doc.rangeBunchToString(ranges);
            if (links.length > 0){
                this.fillInDialogWithElementData(dialog, links[0], 'link');
                this.saveExtra(dialog, links[0]);
            }
            if (selectionContent){
                this.setDialogInputField(dialog, {'tabId': 'linkInfoTab', 'elemId': 'content', 'value': selectionContent});
            }
        } catch (e) {
            console.log(e.name + ' occurred when filling in link dialog: ' + e.message);
        }
    };

}
CLink.prototype = Object.create(Controller.prototype);
