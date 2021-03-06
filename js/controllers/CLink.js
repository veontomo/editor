/*jslint plusplus: true, white: true */
/*global Controller, Link, Document */

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
     * Modifies the content of the `editor` based on information provided in the `dialog` window
     * as well in optional json-like object `params` that may contain keys `target` and `selection`.
     * @method         onOk
     * @param          {Object}        dialog
     * @param          {Object}        editor
     * @param          {Object}        params         [Optional]
     * @return         {void}
     * @since          0.1.0
     */
    this.onOk = function(dialog, editor, params) {
        var adapter, doc, content, dialogData, template,
            shallowLink, cursorPos, shouldDropSelection, contentUIElem;
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
            contentUIElem = {'linkInfoTab': 'content'};
            shouldDropSelection = adapter.isFieldEnabled(dialog, contentUIElem) === true;

            if (shouldDropSelection){
                shallowLink.setContent(adapter.getFieldValue(dialog, contentUIElem));
            }

            if (params && params.target){
                doc.modifyLink(params.target, shallowLink.toNode());
            } else if (params && params.selection){
                if (doc.isSelectionEditable(params.selection)){
                    doc.replaceSelectionByLink(params.selection, shallowLink.toNode());
                } else {
                    doc.selectionToLink(params.selection, shallowLink.toNode());
                }
            } else {
                doc.insertAt(cursorPos.startContainer, shallowLink.toNode(), cursorPos.startOffset);
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
        } catch (e) {
            console.log(e.name + ' occurred when filling in link dialog: ' + e.message);
        }
    };

    /**
     * Replaces `link` by an Element instance whose tag is `tagName`.
     *
     * @method         unlink
     * @param          {Object}        editor
     * @param          {Element}       link
     * @return         {void}
     * @since          0.2.5
     */
    this.unlink = function(editor, link){
        var adapter, doc, content;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            doc.clearNodeFromLink(link);
            adapter.setEditorContent(editor, content);
        } catch (e) {
            console.log(e.name + ' occurred when stripping link: ' + e.message);
        }
    };

}
CLink.prototype = Object.create(Controller.prototype);
