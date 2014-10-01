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
	 * If cursor position corresponds to an element that has a property `propName`
	 * (its own or inherited) set to value `propValue`, then DOM element
	 * with id `buttonId` gets highlighted. Otherwise, that DOM element gets rid
	 * of eventual higlighting.
	 * @method       highlight
	 * @param        {CKEDITOR}        ed     editor instance
	 * @param        {String}          propName    name of the attribute to search
	 * @param        {String}          propValue   value of the above attribute
	 * @return       {void}
	 */
	highlight: function(ed, propName, propValue, buttonId){
		var sel = new Selection(ed),
			startElem = sel.getStartElement(),
			detectedPropValue,
			dom = new Dom(),
			button = document.getElementById(buttonId);
		if (!button || !startElem){
			// no element to modify, no highlighting
			// no start element, no highlighting
			return;
		}
		console.log('button: ', button.getAttribute('class'));
		detectedPropValue = dom.getInheritedStyleProp(startElem.$, propName);
		if (detectedPropValue === propValue){

		} else {

		}
	}
};