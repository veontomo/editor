/*jslint plusplus: true, white: true */
/*global Controller, Cell */

/**
 * File system controller.
 * @module    Controllers
 * @class     CFile
 * @type      {Object}
 * @since     0.2.8
 * @author    A.Shcherbakov
 */
function CFile() {
    "use strict";
    if (!(this instanceof CFile)) {
        return new CFile();
    }
    Controller.call(this);

    /**
     * Returns time stamp string.
     * @method         timeStamp
     * @return         {String}
     * @since          0.2.8
     */
    var _timeStamp = function() {
        var timeNow = new Date(),
            templateName = [
                timeNow.getFullYear(),
                ('0' + (timeNow.getMonth() + 1)).slice(-2), // padding with zeros in case the string is one-symbol length
                ('0' + timeNow.getDate()).slice(-2),
                ('0' + timeNow.getHours()).slice(-2),
                ('0' + timeNow.getMinutes()).slice(-2),
                ('0' + timeNow.getSeconds()).slice(-2)
            ].join('-');
        return templateName;
    };

    /**
     * Generates a string to be used as a file name.
     * @method  suggestFileName
     * @return  String
     * @since   0.2.8
     */
    this.suggestFileName = function() {
        var time = _timeStamp();
        return 'template_' + time + '.html';
    };


    /**
     * Saves the content of the `editor` into a file.
     * @method         onOk
     * @param          {Object}        dialog
     * @param          {Object}        editor
     * @return         {void}
     * @since          0.1.0
     */
    this.onOk = function(dialog, editor) {
        var adapter, doc, contentString, contentNode, dialogData, fileName;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            contentNode = adapter.getEditorContent(editor);
            if (!contentNode){
            	return;
            }
            dialogData = adapter.getDialogData(dialog);
            fileName = dialogData.saveInfoTab.fileName;
            contentNode = doc.escapeNode(contentNode);
            console.log('escaped: ', contentNode);
        	// doc.saveToLocal(contentNode.outerHTML, fileName);
        } catch (e) {
            console.log(e.name + ' occurred when inserting link: ' + e.message);
        }
    };
}

CFile.prototype = Object.create(Controller.prototype);
