/*jslint plusplus: true, white: true */
/*global Controller, Cell */

/**
 * Table row cell controller.
 * @module    Controllers
 * @class     CCell
 * @type      {Object}
 * @since     0.2.0
 * @author    A.Shcherbakov
 */
function CCell() {
	"use strict";
	if (!(this instanceof CCell)) {
	    return new CCell();
	}
	Controller.call(this);

	this.setModel(Cell.prototype);
}

CCell.prototype = Object.create(Controller.prototype);