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
	 * Generates a string to be used as a file name.
	 * @method  suggestFileName
	 * @return  String
	 * @since   0.2.8
	 */
	this.suggestFileName = function(){
		/// !!! stub
		return "test.html";
	}

}

CFile.prototype = Object.create(Controller.prototype);