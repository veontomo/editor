/*jslint plusplus: true, white: true */
/*global Controller, Row */

/**
 * Table row controller.
 * @module    Controllers
 * @class     CRow
 * @type      {Object}
 * @since     0.2.0
 * @author    A.Shcherbakov
 */
function CRow() {
	"use strict";
	if (!(this instanceof CRow)) {
	    return new CRow();
	}
	Controller.call(this);

	this.setModel(Row.prototype);
}

CRow.prototype = Object.create(Controller.prototype);