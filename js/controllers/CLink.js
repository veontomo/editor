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
     * Modifies the content of the `editor` based on information provided in the `dialog` window
     * as well in optional json-like object `params`.
     * @method         onOk
     * @param          {Object}        dialog
     * @param          {Object}        editor
     * @param          {Object}        params         [Optional]
     * @return         {void}
     * @since          0.1.0
     */
    this.onOk = function(dialog, editor, params) {
        var adapter, doc, content, dialogData, template,
            shallowLink, cursorPos;
        try {
            adapter = this.getEditorAdapter();
            cursorPos = adapter.getCursorPosition(editor);
            if (!cursorPos){
                return;
            }
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            dialogData = adapter.getDialogData(dialog);
            template = adapter.dialogToTemplate(dialogData, 'link');
            shallowLink = doc.createFromTemplate(template);

            if (params.link){
                doc.modifyLink(params.link, shallowLink);
            } else if (params.selection){
                doc.transformIntoLink(params.selection, shallowLink);
            } else {
                doc.insertAt(cursorPos.startContainer, elem, cursorPos.startOffset);
            }
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
     * @method         fillInDialogWithSelection
     * @param          {Object}        dialog        editor-specific representation of a dialog window
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.2.1
     * @Override
     */
    this.fillInDialogWithSelection = function(dialog, editor){
        console.log('Filling in dialog with the following data: ', dialog, editor);
        var adapter, ranges, doc, link, selectionContent;
        try {
            adapter = this.getEditorAdapter();
            ranges = adapter.getNativeRanges(editor);
            doc = this.getWorker();
            link = doc.findSelectionFirstAncestor(ranges, this.getModel().prototype.characteristicFunction);
            selectionContent = doc.selectionToString(ranges);
            if (link){
                this.fillInDialogWithElement(dialog, link);
                this.saveExtra(dialog, link);
            }
            if (selectionContent){
                this.setDialogInputField(dialog, {'tabId': 'linkInfoTab', 'elemId': 'content', 'value': selectionContent});
            }
            if (!doc.isSelectionEditable(ranges)){
                this.disableFields(dialog, {'linkInfoTab': 'content'});
            }
        } catch (e) {
            console.log(e.name + ' occurred when filling in link dialog: ' + e.message);
        }
    };

}
CLink.prototype = Object.create(Controller.prototype);
