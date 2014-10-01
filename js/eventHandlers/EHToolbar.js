/*jslint plusplus: true, white: true */
/*global Selection, Dom*/

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
		// console.log('button: ', button.getAttribute('class'));
		startElem = startElem.$;
		detectedPropValue = dom.getInheritedStyleProp(propName, startElem);
		// console.log('detected value of ' + propName + ' is ' + detectedPropValue);
		// console.log('required value: ' + propValue);
		if (detectedPropValue === propValue){
			// console.log('switch on bold');
			dom.switchClassProperty(button, 'cke_button_on', 'cke_button_off');
		} else {
			// console.log('switch off bold');
			dom.switchClassProperty(button, 'cke_button_off', 'cke_button_on');
		}
	}
};