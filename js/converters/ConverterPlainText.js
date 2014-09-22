/*jslint plusplus: true, white: true */
/*global ConverterGeneral, NEWSLETTER, Node, Unit */

/**
 * Methods of this class convert into fixed format.
 * @module 	    HtmlElements
 * @class  		ConverterPlainText
 * @since       0.0.6
 * @author      A.Shcherbakov
 */

function ConverterPlainText(){
	"use strict";
	if (!(this instanceof ConverterPlainText)) {
		return new ConverterPlainText();
	}
	ConverterGeneral.call(this);

	/**
	 * Objects that defines a mapping from html tags that are allowed inside the content into
	 * a "revisited" tag.
	 * @property       {Object} _tagsToRivisit
	 * @private
	 * @since          0.0.6
	 * @type           {Object}
	 */
	var _tagsToRivisit = {
		b: {'font-weight': 'bold'},
		strong: {'font-weight': 'bold'},
		i: {'font-style': 'italics'}
	}
;
	/**
	 * Modifies width-related properties in `node`. This function is to be added to
	 * {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}}.
	 *
	 * It adds keys `max-width` and `min-width` into style properties as well.
	 * @method         _widthFixed
	 * @param          {DOM.Element}        node
	 * @return         {void}
	 * @private
	 */
	var _widthFixed = function(node){
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var nodeAsTag = NEWSLETTER.factory.mimic(node),
			prop = nodeAsTag.getProperties(),
			width = nodeAsTag.getWidth();
		if (width === undefined){
			return undefined;
		}
		width =  new Unit(width);
		if (!width.hasMeasure()){
			width.setMeasure(NEWSLETTER.unitMeasure());
		}
		prop.setWidth(width.getValue());
		prop.setStyleProperty('max-width', width.toString());
		prop.setStyleProperty('min-width', width.toString());
		prop.decorateElement(node);
	};


	/**
	 * Appends workers
	 * @method    constructor
	 * @return {void}
	 */
	this.setWorkers([_widthFixed]);
}
ConverterPlainText.prototype = Object.create(ConverterGeneral.prototype);
