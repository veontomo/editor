/*jslint plusplus: true, white: true */
/*global ConverterGeneral, NEWSLETTER, Node, Unit */

/**
 * Methods of this class convert into fixed format.
 * @module 	    HtmlElements
 * @class  		ConverterFixed
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function ConverterFixed(){
	"use strict";
	if (!(this instanceof ConverterFixed)) {
		return new ConverterFixed();
	}
	ConverterGeneral.call(this);

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
		prop.setWidth(width.toString());
		prop.setStyleProperty('max-width', width.toString());
		prop.setStyleProperty('min-width', width.toString());
		prop.decorateElement(node);
	};


	/**
	 * If the argument is a list (ordered or unordered), then margin-related keys are added
	 * into styles.
	 * @method         _listMargins
	 * @private
	 * @param         {DOM.Element}     node
	 * @return        {void}
	 */
	var _listMargin = function(node){
		 if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var nodeAsTag = NEWSLETTER.factory.mimic(node);
		if (nodeAsTag instanceof List){
			var prop = nodeAsTag.getProperties();
			prop.setStyleProperty('margin-left', '40px');
			prop.setStyleProperty('margin-top', '0px');
			prop.setStyleProperty('margin-bottom', '0px');
			prop.setStyleProperty('margin-right', '0px');
			prop.decorateElement(node);
		}

	};

	/**
	 * Appends workers
	 * @method    constructor
	 * @return {void}
	 */
	this.setWorkers([_widthFixed, _listMargin]);
}
ConverterFixed.prototype = Object.create(ConverterGeneral.prototype);
