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
	 * Returns information about node width. The following locations are explored (in order of precedence):
	 * <ol>
	 * <li>"data-original-width",</li>
	 * <li>"width"</li>
	 * <li>"style: .... width: ...; ..."</li>
	 * <li>offsetWidth property of the node. See [explanation here](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements).</li>
	 * </ol>
	 * @method         _findWidthInfo
	 * @param          {DOM.Element}        node
	 * @return         {String|Number}
	 */
	var _findWidthInfo = function(node){
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
		// if nothing else helps
		return node.offsetWidth;

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
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var	parentWidth, width, parentWidthObj, newWidth, nodeAsTag, tagProps,
			widthMarker = 'data-original-width';
		if (par !== undefined){
			parentWidth =  _findWidthInfo(par);
		}
		if (!parentWidth){
			parentWidth = NEWSLETTER.width();
		}
		console.log(parentWidth);
		parentWidthObj = new Unit(parentWidth);

		nodeAsTag = NEWSLETTER.factory.mimic(node);
		tagProps = nodeAsTag.getProperties();
		width = nodeAsTag.getWidth();
		width =  new Unit(width);
		if (width === undefined){
			return undefined;
		}
		width =  new Unit(width);
		if (!width.hasMeasure()){
			// console.log("width: " + width.toString());
			width.setMeasure(NEWSLETTER.unitMeasure());
		}
		try {
			newWidth = width.frac(parentWidthObj).toPercent();
			tagProps.setWidth(newWidth.toString());
			tagProps.dropStyleProperty('max-width');
			tagProps.dropStyleProperty('min-width');
			tagProps.decorateElement(node);
			node.setAttribute(widthMarker, width.toString());
			// node.setAttribute('style', tagProps.getStyles().toString());
		}
		catch (e){
			console.log('node', node, 'parent', par);
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
		var	parentSize, fontSize, parentSizeObj, newFontSize, nodeAsTag, tagProps,
			marker = 'data-original-' + propName;


		parentSize = par && par.hasAttribute(marker) ? par.getAttribute(marker) : NEWSLETTER.fontsize();
		parentSizeObj = new Unit(parentSize);

		nodeAsTag = NEWSLETTER.factory.mimic(node);
		tagProps = nodeAsTag.getProperties();
		fontSize = nodeAsTag.getStyleProperty(propName);
		if (fontSize === undefined){
			return undefined;
		}
		fontSize =  new Unit(fontSize);
		if (!fontSize.hasMeasure()){
			fontSize.setMeasure(NEWSLETTER.unitMeasure());
		}
		try {
			newFontSize = fontSize.frac(parentSizeObj).toPercent();
			// console.log('tagProps before setting: ', tagProps.getStyleProperty('font-size'));
			// console.log('setting to ', newFontSize.toString());
			tagProps.setStyleProperty(propName, newFontSize.toString());
			// console.log('tagProps after setting: ', tagProps.getStyleProperty('font-size'));
			// console.log('Error when dividing ' + newFontSize.toString() + ' and ' + parentSizeObj.toString());
			tagProps.decorateElement(node);
			node.setAttribute(marker, fontSize.toString());
		}
		catch (e){
			console.log('Error when dividing ' + fontSize.toString() + ' and ' + parentSizeObj.toString());
			console.log(e);
		}
		// console.log('font resizing is over: ', node.outerHTML);
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
			// console.log('node is not element');
			return undefined;
		}
		var propNames = ['padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
			'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom'];
		var	parentSize, propValue, parentSizeObj, newPropValue, nodeAsTag, tagProps;


		if (par !== undefined){
			parentSize =  _findWidthInfo(par);
		}
		if (!parentSize){
			parentSize = NEWSLETTER.width();
		}
		parentSizeObj = new Unit(parentSize);

		nodeAsTag = NEWSLETTER.factory.mimic(node);
		tagProps = nodeAsTag.getProperties();
		propNames.forEach(function(propName){
			var marker = 'data-original-' + propName;
			propValue = nodeAsTag.getStyleProperty(propName);
			if (propValue === undefined){
				return;
			}
			propValue =  new Unit(propValue);
			if (!propValue.hasMeasure()){
				propValue.setMeasure(NEWSLETTER.unitMeasure());
			}
			try {
				newPropValue = propValue.frac(parentSizeObj).toPercent();
				tagProps.setStyleProperty(propName, newPropValue.toString());
				tagProps.decorateElement(node);
				node.setAttribute(marker, propValue.toString());
			}
			catch (e){
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
