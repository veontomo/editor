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
    this.saveToLocal = function(data, filename) {
        $.post(_saveScriptPath, {
                'data': data,
                'filename': filename
            },
            function(fn) {
                $(location).attr('href', _downloadScriptPath + '?filename=' + fn);
            }
        );
    };

}
