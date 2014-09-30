/*jslint plusplus: true, white: true */
/*global Selection*/

/**
 * Object for managing toolbar events.
 *
 * @module 	    EventHandler
 * @class  		EHToolbar
 * @since       0.0.6
 * @author      A.Shcherbakov
 */
'use strict';
var EHToolbar = {
	/**
	 * Highlights toolbar buttons based on cursor position.
	 *
	 * If cursor position corresponds to an element that has a property (its own
	 * or inherited) then corresponding toolbar button gets highlighted.
	 * @method       highlight
	 * @param        {CKEDITOR}        ed     editor instance
	 * @return       {void}
	 */
	highlight: function(ed){
		var sel = new Selection(ed);
		console.log('inside EHtoolbarHighight', sel.getStartElement());
	}
};