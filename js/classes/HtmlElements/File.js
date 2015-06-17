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
     * Launches a window for downloading file with content `data` and suggested name `filename`.
     * If `filename` is not given or is not valid, the file name will be generated.
     *
     * For the moment, the method use jQuery library. It is desirable to rewrite
     * the method such that native javascript methods are used.
     * (The commented code at the end contains some hints.)
     * @method         saveToLocal
     * @param          {String}        data
     * @param          {String}        filename
     * @return         {void}
     */
    this.saveDraft = function(data, filename) {
        $.post(_saveScriptPath, {
                'data': data,
                'filename': filename
            },
            function(fn) {
                // $(location).attr('href', _downloadScriptPath + '?filename=' + fn);
                alert("Draft is saved!");
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
     * Launches a window that allows a user to save a file on its computer.
     *
     * Mode is one of "elastic" (units of measurents are mostly scalable, i.e. "em")
     * or "fixed" (units of measurements are "px").
     * @method         saveAs
     * @param          {Node}          data     data to save
     * @param          {String}        filename
     * @param          {String}        mode     elastic or fixed
     * @return         {void}
     * @since          0.2.9
     */
    this.saveAs = function(data, filename, mode){
        /// !!! stub
        console.log('saving...');
        console.log('content: ', content);
        console.log('filename: ', filename);
        console.log('mode: ', mode);
        /// old code that was in CDownload class
        // var fileName = context.getValueOf('tab-general', 'filename'),
        //     mode = context.getValueOf('tab-general', 'mode'),
        //     editorContent = editor.document.getBody().$,
        //     fileContent, doc, bodyCss;

        // bodyCss = Helper.cssOfSelector('body', NEWSLETTER.cssBase);
        // // sanitized = Helper.specialChar(editorContent);
        // doc = new Document(editorContent);
        // doc.setWrapCss(bodyCss);
        // doc.clean([/\bclass/, /\bid/, NEWSLETTER['marker-name'], /\bdata-.*/]);
        // doc.convertTo(mode);
        // fileContent = doc.docHtml();
        // // console.log(fileContent);
        // this.downloadFile(fileContent, fileName);

    }

}
