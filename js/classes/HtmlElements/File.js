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
}

/**
 * Path to a Worker script that performs file saving
 * @type {String}
 * @since  0.2.8
 * @const
 */
Object.defineProperty(
	File,
	'fileSaver',
    {
    	value: '/js/classes/HtmlElements/ASyncFileSaver.js',
    	writable: false
    }
);
