/*jslint plusplus: true, white: true */
/*global Selection, Dom, CKEDITOR */

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
	 * Attaches listeners for two type of events on `ed` element:
	 * <dl>
	 * <dt>`mousedown` event</dt>
	 * <dd>triggers when one moves cursor by clicking mouse button. </dd>
	 * <dt>`keydown` event</dt>
	 * <dd>triggers when one moves arrow keys. Uses
	 * {{#crossLink "EHToolbar/isArrow:method"}}isArrow{{/crossLink}} method in order to decide
	 * whether the event should be handled or not.
	 * </dd></dl>
	 *
	 * Event handler for the above events is {{#crossLink "EHToolbar/highlight:method"}}highlight{{/crossLink}}.
	 * @method         registerEvent
	 * @param          {CKEDITOR.editor}  ed         CKEDITOR.editor instance
	 * @param          {String}           property
	 * @param          {String}           pluginName
	 * @return         {void}
	 */
	registerEvent: function(ed, property, pluginName){
		var editable = ed.editable(),
			buttonId = ed.ui.get(pluginName)._.id;
		// first type of events: moving the cursor by mouse
	    editable.attachListener(ed.document, 'mousedown', function() {
	    	EHToolbar.highlight(ed, property, buttonId);
	    	// should event propagate?
	    	return true;
	    });
	    // second type of events: pressing keys
	    editable.attachListener(ed.document, 'keydown', function(event) {
	    	// performs if the pressed key is an arrow one
	    	if (EHToolbar.isArrow(event)){
	    		EHToolbar.highlight(ed, property, buttonId);
	    	}
     		// should event propagate?
     		return true;
	    });

	},

	/**
	 * Switches the state of element with id `elemId` to be `on` if the cursor
	 * is located inside element that has a property descibed in object `prop`,
	 * otherwise the state is set to `off`.
	 *
	 * `on/off` states are given by [CKEDITOR](http://docs.ckeditor.com/#!/api/CKEDITOR) constants
	 * [TRISTATE_ON](http://docs.ckeditor.com/#!/api/CKEDITOR-property-TRISTATE_ON)
	 * and [TRISTATE_OFF](http://docs.ckeditor.com/#!/api/CKEDITOR-property-TRISTATE_OFF).
	 *
	 * Object `prop` is required to have the following keys (presence of other keys is allowed):<dl>
	 * <dt> `name` </dt>
	 * <dd> name of the attribute to search among start element ascendants</dd>
	 * <dt>`value`</dt>
	 * <dd> value that the attribute is supposed to have</dd>
	 * </dl>
	 *
	 * Uses [setState](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.element-method-setState) method
	 * with <b>hardcoded</b> optional parameter set to to 'cke_button'.
	 *
	 * @method       highlight
	 * @param        {CKEDITOR.editor} ed          editor instance
	 * @param        {Object}          prop        name of the attribute to search
	 * @param        {String}          elemId      id of the element which state should be changed
	 * @return       {void}
	 */

	highlight: function(ed, prop, elemId){
		if (!ed || !prop || !elemId){
			// exit, if something is missing
			return;
		}
		var detectedPropValue, state,
			propName = prop.name,
			propValue = prop.value,
			startElem = ed.getSelection(),
			dom = new Dom(),
			button = CKEDITOR.document.getById(elemId);
		if (!button || !startElem || !propName){
			// exit, if missing
			return;
		}
		startElem = startElem.getStartElement().$;
		detectedPropValue = dom.getInheritedStyleProp(propName, startElem);
		state = (detectedPropValue === propValue) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
		button.setState(state, 'cke_button');
	},

	/**
	 * Returns `true` if `event` corresponds to pressing one of the arrow keys: 'Left', 'Right', 'Down', 'Up'.
	 * The check is performed by the code of the pressed key: 37 for 'Left', 39 for 'Right', 40 for 'Down', 38 for 'Up'.
	 * @method         isArrow
	 * @param          {CKEDITOR.eventInfo}  event [CKEDITOR.eventInfo](http://docs.ckeditor.com/#!/api/CKEDITOR.eventInfo)
	 * @return         {Boolean}
	 */
	isArrow: function(event){
		try {
			var keyCode = parseInt(event.data.$.keyCode, 10);
			return keyCode >= 37 && keyCode <= 40;
		} catch (e){
			console.log('Error (' + e.name + ') is detected when deciding whether pressed key is an arrow one.');
			return false;
		}
	},


};