/*jslint plusplus: true, white: true */
/*global Properties, FACTORY, Unit, Node, NEWSLETTER*/

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

	/**
	 * Array of functions to be applied to each node. Each element is supposed to modify the argument it acts on.
	 * @property    {Array}               _workers
	 * @type        {Array}
	 * @private
	 */
	var _workers = [];

	/**
	 * Converts `content` into fluid format. It means that all units of measure must be expressed in relative units (in %).
	 * @method         convertToFluid
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convert = function(n){
		var result = n.cloneNode(true);
		this.process(result);
		return result;
	};


	/**
	 * Applies each function from {{#crossLink "Converter/_workers:property"}}_worker{{/crossLink}}
	 * to node `n` and then to each children.
	 * @method         process
	 * @param          {DOM.Node} n
	 * @return         {void}
	 */
	this.process = function(n){
		this.processRoot(n);
		if (n.nodeType === Node.ELEMENT_NODE){
			var i,
				children = n.childNodes,
				len = children.length;
			for (i = 0; i < len; i++){
				this.process(children.item(i));
			}
		}
	};


	/**
	 * Applies all functions from {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}} to
	 * only to root element of node `n` and not to its children.
	 * @method         processRoot
	 * @param          {DOM.Node} n
	 * @return         {void}
	 */
	this.processRoot = function(n){
		var i, len = _workers.length;
		for (i = 0; i < len; i++){
			_workers[i](n);
		}
	};


	/**
	 * Modifies width-related properties in `node`. This function is to be added to
	 * {{#crossLink "ConvertFluid/_workers:property"}}_workers{{/crossLink}}.
	 *
	 * It updates value of width attribute of `node` on the base of the width attribute of its parent node.
	 * @method     _widthFluid
	 * @param      {DOM.Element}        node
	 * @return     {void}
	 * @private
	 */
	var _widthFluid = function(node){
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var	parent, parentWidth, width, parentWidthObj, newWidth, nodeAsTag, tagProps,
			widthMarker = 'data-original-width';
		parent = node.parent;
		parentWidth = parent && parent.hasAttribute(widthMarker) ? parent.getAttribute(widthMarker) : NEWSLETTER.width();
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
			console.log('Error when dividing ' + width.toString() + ' and ' + parentWidthObj.toString());
		}
	};

	/**
	 * Updates font sizes.
	 *
	 * @method  _fontFluid
	 * @param  {DOM.Element}    node
	 * @return {void}
	 */
	var _fontFluid = function(node){
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var propName = 'font-size';
		// console.log('font resizing', node.outerHTML);
		var	parent, parentSize, fontSize, parentSizeObj, newFontSize, nodeAsTag, tagProps,
			marker = 'data-original-' + propName;
		parent = node.parent;
		parentSize = parent && parent.hasAttribute(marker) ? parent.getAttribute(marker) : NEWSLETTER.fontsize();
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
			console.log('Error when dividing ' + newFontSize.toString() + ' and ' + parentSizeObj.toString());
		}
		// console.log('font resizing is over: ', node.outerHTML);
	};

	/**
	 * Updates padding.
	 *
	 * @method  _fontFluid
	 * @param  {DOM.Element}    node
	 * @return {void}
	 */
	var _paddingFluid = function(node){
		if (node.nodeType !== Node.ELEMENT_NODE){
			return undefined;
		}
		var propName = 'padding';
		// console.log('font resizing', node.outerHTML);
		var	parent, parentSize, propValue, parentSizeObj, newPropValue, nodeAsTag, tagProps,
			marker = 'data-original-' + propName;
		parent = node.parent;
		parentSize = parent && parent.hasAttribute(marker) ? parent.getAttribute(marker) : NEWSLETTER.fontsize();
		parentSizeObj = new Unit(parentSize);

		nodeAsTag = NEWSLETTER.factory.mimic(node);
		tagProps = nodeAsTag.getProperties();
		propValue = nodeAsTag.getStyleProperty(propName);
		if (propValue === undefined){
			return undefined;
		}
		propValue =  new Unit(propValue);
		if (!propValue.hasMeasure()){
			propValue.setMeasure(NEWSLETTER.unitMeasure());
		}
		try {
			newPropValue = propValue.frac(parentSizeObj).toPercent();
			// console.log('tagProps before setting: ', tagProps.getStyleProperty('font-size'));
			// console.log('setting to ', newFontSize.toString());
			tagProps.setStyleProperty(propName, newPropValue.toString());
			// console.log('tagProps after setting: ', tagProps.getStyleProperty('font-size'));
			// console.log('Error when dividing ' + newFontSize.toString() + ' and ' + parentSizeObj.toString());
			tagProps.decorateElement(node);
			node.setAttribute(marker, propValue.toString());
		}
		catch (e){
			console.log('Error when dividing ' + propValue.toString() + ' and ' + parentSizeObj.toString());
		}
		// console.log('font resizing is over: ', node.outerHTML);
	};

	_workers.push(_fontFluid);
	_workers.push(_widthFluid);
	_workers.push(_paddingFluid);

}
