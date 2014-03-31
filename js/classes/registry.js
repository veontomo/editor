/*jslint plusplus: true, white: true */
/*global  */

/**
 * Service locator for the classes present in the application.
 * @module  Helper
 * @class  Registry
 * @since  0.0.2
 * @author A.Shcherbakov
 */
function Registry(){
	"use strict";
	if (!(this instanceof Registry)) {
		return new Registry();
	}

	this.classes = function(){
		console.log(window);
	}



}