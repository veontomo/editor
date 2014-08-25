/*jslint plusplus: true, white: true */
/*global Properties, FACTORY, Unit, Node, NEWSLETTER, ConverterFluid, ConverterGeneral */

/**
 * Methods of this class converts into fluid format.
 * @module 	    HtmlElements
 * @class  		ConverterFluid
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function ConverterFluid(){
	"use strict";
	if (!(this instanceof ConverterFluid)) {
		return new ConverterFluid();
	}
	ConverterGeneral.call(this);


	/**
	 * Number of digits after decimal point to maintain.
	 *
	 * @property        {Integer}           _precision
	 * @type            {Number}
	 */
	var _precision = 5;

	/**
	 * Returns information about node width. The following locations are explored (in order of precedence):
	 * <ol>
	 * <li>offsetWidth property of the node. See
	 * [explanation here](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements).
	 * </li>
	 * <li>"data-original-width",</li>
	 * <li>"width"</li>
	 * <li>"style: .... width: ...; ..."</li>
	 * </ol>
	 * @method         _findWidthInfo
	 * @param          {DOM.Element}        node
	 * @return         {String|Number}
	 */
	var _findWidthInfo = function(node){
		// if nothing else helps
		var propName = 'width';
		if (node.hasAttribute('data-original-width')){
			return node.getAttribute('data-original-width');
		}
		if (node.hasAttribute(propName)){
			return node.getAttribute(propName);
		}
		var style = new Properties(node.getAttribute('style'));
		if (style.hasProperty(propName)){
			return style.getProperty(propName);
		}
		var width = node.offsetWidth;
		if (width !== undefined){
			return width;
		}
	};


	/**
	 * Modifies width-related properties in `node`. This function is to be added to
	 * {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}}.
	 *
	 * It updates value of width attribute of `node` on the base of the width attribute of its parent node.
	 * @method     _widthFluid
	 * @param      {DOM.Element}        node
	 * @param      {DOM.Element}        par             parent of node
	 * @return     {void}
	 * @private
	 */
	var _widthFluid = function(node, par){
		// console.log('_widthFluid: ', node, par);
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var	parentWidth, width, parentWidthObj, newWidth,
			widthMarker = 'data-original-width';
		if (par !== undefined){
			parentWidth =  _findWidthInfo(par);
		}
		if (!parentWidth){
			parentWidth = NEWSLETTER.width();
		}
		parentWidthObj = new Unit(parentWidth);
		parentWidthObj.suggestMeasure(NEWSLETTER.unitMeasure());

		var props = new Properties();
		props.loadNodeProperties(node);

		width = props.getWidth();
		if (width === undefined){
			return undefined;
		}
		width =  new Unit(width);
		width.suggestMeasure(NEWSLETTER.unitMeasure());
		try {
			newWidth = width.frac(parentWidthObj, _precision).toPercent();
			props.setWidth(newWidth.toString());
			props.dropStyleProperty('max-width');
			props.dropStyleProperty('min-width');
			props.decorateElement(node);
			node.setAttribute(widthMarker, width.toString());
		}
		catch (e){
			console.log(e.toString());
			console.log('Error when dividing ' + width.toString() + ' and ' + parentWidthObj.toString());
		}
	};

	/**
	 * Updates font sizes.
	 *
	 * @method         _fontFluid
	 * @param          {DOM.Node}               node
	 * @param          {DOM.Node}               par               parent of node
	 * @return         {void}
	 * @private
	 */
	var _fontFluid = function(node, par){
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var propName = 'font-size';
		// console.log('font resizing', node.outerHTML);
		var	parentSize, propValue, parentSizeObj, newPropValue,
			marker = 'data-original-' + propName;


		parentSize = par && par.hasAttribute(marker) ? par.getAttribute(marker) : NEWSLETTER.fontsize();
		parentSizeObj = new Unit(parentSize);

		var props = new Properties();
		props.loadNodeProperties(node);
		propValue = props.getStyleProperty(propName);
		if (propValue === undefined){
			return undefined;
		}
		propValue =  new Unit(propValue);
		propValue.suggestMeasure(NEWSLETTER.unitMeasure());
		try {
			newPropValue = propValue.frac(parentSizeObj, _precision).toPercent();
			props.setStyleProperty(propName, newPropValue.toString());
			props.decorateElement(node);
			node.setAttribute(marker, propValue.toString());
		}
		catch (e){
			console.log('Error when dividing ' + propValue.toString() + ' and ' + parentSizeObj.toString());
			console.log(e);
		}
	};


	/**
	 * Updates the following attributes
	 * <pre>
	 * 'padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom'
	 * </pre>
	 * inside style property of the node.
	 *
	 * @method         _paddingFluid
	 * @private
	 * @param          {DOM.Node}           node
	 * @param          {DOM.Node}           par         parent of node
	 * @return         {void}
	 */
	var _paddingFluid = function(node, par){
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var propNames = ['padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
			'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom'];
		var	parentSize, propValue, parentSizeObj, newPropValue;

		if (par !== undefined){
			parentSize =  _findWidthInfo(par);
		}
		if (!parentSize){
			parentSize = NEWSLETTER.width();
		}
		parentSizeObj = new Unit(parentSize);
		parentSizeObj.suggestMeasure(NEWSLETTER.unitMeasure());

		var props = new Properties();
		props.loadNodeProperties(node);

		propNames.forEach(function(propName){
			var marker = 'data-original-' + propName;
			propValue = props.getStyleProperty(propName);
			if (propValue === undefined){
				return;
			}
			propValue =  new Unit(propValue);
			propValue.suggestMeasure(NEWSLETTER.unitMeasure());
			try {
				newPropValue = propValue.frac(parentSizeObj, _precision).toPercent();
				props.setStyleProperty(propName, newPropValue.toString());
				props.decorateElement(node);
				node.setAttribute(marker, propValue.toString());
			}
			catch (e){
				console.log(e.toString());
				console.log('Error when dividing ' + propValue.toString() + ' and ' + parentSizeObj.toString());
			}

		});
	};

	var _paddingAll = function(node, par){
		// console.log('padding all is called with: ', node, par);
		_paddingFluid(node, par);
	};

	/**
	 * Sets workers {{#crossLink "ConverterFluid/_fontFluid:method"}}_fontFluid{{/crossLink}},
	 * {{#crossLink "ConverterFluid/_widthFluid:method"}}_widthFluid{{/crossLink}},
	 * {{#crossLink "ConverterFluid/_paddingFluid:method"}}_paddingFluid{{/crossLink}}.
	 * @method   constructor
	 * @return {void}
	 */
	this.setWorkers([_fontFluid, _widthFluid, _paddingAll/*, _paddingFluid*/]);
}
ConverterFluid.prototype = Object.create(ConverterGeneral.prototype);
