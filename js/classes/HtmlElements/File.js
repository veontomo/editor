/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global  */

/**
 * File system I/O operations.
 * @module             Model
 * @class              File
 * @constructor
 * @since              0.2.8
 * @author             A.Shcherbakov
 */
function File() {
    "use strict";
    if (!(this instanceof File)) {
        return new File();
    }

    /**
     * Path to a server-side script that saves content.
     *
     * The path is relative with respect to the `index.php` of the application.
     * @property       _saveScriptPath
     * @type           {String}
     * @private
     * @since          0.0.7
     */
    var _saveScriptPath = 'php/saveDraft.php';

    /**
     * Path to a server-side script that downloads file.
     *
     * The path is relative with repsect to the `index.php` of the application.
     * @property       _downloadScriptPath
     * @type           {String}
     * @private
     * @since          0.0.7
     */
    var _downloadScriptPath = 'php/downloadFile.php';


    /**
     * A worker that performs operations on the editor content.
     * @property       {Object}        _worker
     * @private
     * @since          0.1.0
     */
    var _worker = new Document();
    _worker.setFactory(NEWSLETTER.factory);


    /**
     * {{#crossLink "File/_worker:property"}}_worker{{/crossLink}} setter.
     *
     * Note that no check concerning the validity of `w` is performed.
     * @method         setWorker
     * @param          {Object}        w       an object able to perform different operations on the editor content
     * @since          0.1.0
     * @return         {void}
     */
    this.setWorker = function(w) {
        _worker = w;
    };


    /**
     * {{#crossLink "File/_worker:property"}}_worker{{/crossLink}} setter.
     * @method         getWorker
     * @return         {Object}
     * @since          0.1.0
     */
    this.getWorker = function() {
        return _worker;
    };






    /**
     * Saves content in a temporary file on server.
     *
     * For the moment, the method use jQuery library. It is desirable to rewrite
     * the method such that native javascript methods are used.
     * (The commented code at the end contains some hints.)
     * @method         saveToLocal
     * @param          {String}        data
     * @return         {void}
     */
    this.saveDraft = function(data) {
        console.log("File: saveDraft" + data);
        $.post(_saveScriptPath, {
                'data': data,
            },
            function(fn) {
                alert("Draft is saved!" + fn);
                return fn;
            }
        );
    };


    /**
     * Launches a window for downloading file with content `data` and suggested name `filename`.
     * If `filename` is not given or is not valid, the file name will be generated.
     *
     * For the moment, the method use jQuery library. It is desirable to rewrite
     * the method such that native javascript methods are used.
     * (The commented code at the end contains some hints.)
     * @method         download
     * @param          {String}        data
     * @param          {String}        filename
     * @return         {void}
     */
    this.download = function(data, filename) {
        $.post(_saveScriptPath, {
                'data': data,
                'filename': filename
            },
            function(fn) {
                $(location).attr('href', _downloadScriptPath + '?filename=' + fn);
            }
        );
    };

    /**
     * Launches a window for downloading file with content `data` and suggested name `filename`.
     * If `filename` is not given or is not valid, the file name will be generated.
     *
     * For the moment, the method use jQuery library. It is desirable to rewrite
     * the method such that native javascript methods are used.
     * (The commented code at the end contains some hints.)
     * @method  downloadFile
     * @param  {String} data
     * @param  {String} filename
     * @return {void}
     */
    this.downloadFile = function(data, filename) {
        if (typeof data !== 'string') {
            this.showMessage('Can not download non-string content!');
            return;
        }
        // by means of jQuery. It is better to pass to native javascript functions
        $.post(_saveScriptPath, {
                'data': data,
                'filename': filename
            },
            function(fn) {
                // console.log('downloading is blocked: filename' + fn);
                $(location).attr('href', _downloadScriptPath + '?filename=' + fn);
            }
        );
    };



    /**
     * Launches a window that allows a user to save a file on its computer.
     *
     * @method         saveAs
     * @param          {Node}          node
     * @param          {String}        filename
     * @return         {void}
     * @since          0.2.9
     */
    this.saveAs = function(node, filename) {
        var fileContent = node.innerHTML;
        var doc = this.getWorker();
        var css = doc.cssOfSelector('body', NEWSLETTER.cssBase);
        fileContent = doc.sanitize(fileContent);
        fileContent = this.toHtml(fileContent, css);
        this.downloadFile(fileContent, filename);
    };

    /**
     * Transforms string `data` into a valid html file adding styles `css`.
     * @method  toHtml
     * @param  {String} data
     * @param  {String} css
     * @return {String}
     */
    this.toHtml = function(data, css) {
        var keys = NEWSLETTER.htmlTemplateKeys;
        return keys.doctype + keys.htmlOpen + keys.head +
            keys.bodyOpen +
            '<center><div style="' + css + '">' +
            data +
            '</div></center>' +
            keys.bodyClose +
            keys.htmlClose;

    };

}
