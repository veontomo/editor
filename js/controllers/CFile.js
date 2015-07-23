/*jslint plusplus: true, white: true */
/*global Controller, Cell, Worker, File, window */

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

    this.setModel(File);

    /**
     * Saves the content of the `editor` into a file and returns its name.
     * @method         saveOnServer
     * @param          {Object}        editor
     * @return         {String}
     * @since          0.1.0
     */
    this.saveOnServer = function(editor) {
        var adapter, doc, content, data, model;
        try {
            adapter = this.getEditorAdapter();
            doc = this.getWorker();
            content = adapter.getEditorContent(editor);
            if (!content){
            	return;
            }
            data = doc.sanitize(content.outerHTML);
            model = this.createModel();
        	return model.saveDraft(data);
        } catch (e) {
            console.log(e.name + ' occurred when inserting link: ' + e.message);
        }
    };


    /**
     * Prepares the content of the editor for downloading in html format and launches the window
     * for downloading.
     *
     * It sends ajax post request to the script `php/saveDraft.php` using JQuery library.
     * @method         downloadAsHtml
     * @param          {Object}            dialog
     * @param          {Object}            editor
     * @return         {void}
     */
    this.downloadAsHtml = function(dialog, editor){
        var adapter, content, dialogData, fileName, model, mode;
        try {
            adapter = this.getEditorAdapter();
            content = adapter.getEditorContent(editor);
            dialogData = adapter.getDialogData(dialog);
            fileName = dialogData['tab-general'].filename;
            mode = dialogData['tab-general'].mode;

            model = this.createModel();
            model.saveAs(content, fileName, mode);
        } catch (e){
            console.log(e.name + ' occurred when downloading editor content as html: ' + e.message);
        }
    };
}

CFile.prototype = Object.create(Controller.prototype);
