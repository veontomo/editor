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
	 * Converts `content` into fluid format. It means that all units of measure must be expressed in relative units (in %).
	 * @method         convertToFluid
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convert = function(content){
		var result = content.cloneNode(false),
			parent,
			width;
		if (content.nodeType === Node.TEXT_NODE){
			return result;
		}
		parent = content.parent;
		if (parent){
			width = this.getElemWidth(parent);
		}
		if (!width){
			width = new Unit(NEWSLETTER.maxWidth, 'px');
		}
		this.convertCurrentToFluid(width.getValue(), result);
		var children = content.childNodes,
			len = children.length,
			i, childFluid;
		for (i = 0; i < len; i++){
			childFluid = this.convert(children.item(i));
			result.appendChild(childFluid);
		}
		return result;
	};

	/**
	 * Returns {{#crossLink "Unit"}}Unit{{/crossLink}} instance representing width of `node` which must
	 * be a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance.
	 * If width can not be established, nothing is returned.
	 * @method         getElemWidth
	 * @param          {DOM.Node}              node
	 * @return         {Unit|undefined}
	 */
	this.getElemWidth = function(node){
		if (node.hasAttribute('width')){
			return new Unit(node.getAttribute('width'));
		}
		var styles = node.style;
		if (node.hasAttribute('style')){
			if (styles.width){
				return new Unit(node.getAttribute('width'));
			}
		}

	};


	/**
	 * Returns a copy of the argument in which properties are replaced by their relative equivalients.
	 * @method         convertCurrentToFluid
	 * @param          {Number}            scale          value of width in pixel with respect to which the relative sizes
	 *                                                    are to be calculated
	 * @param          {DOM.Element}       n
	 * @return         {void}
	 */
	this.convertCurrentToFluid = function(scale, n){
		var rnd = parseInt(Math.random()*1000, 10);
		console.log(rnd, 'convertCurrentToFluid started');
		console.log(rnd, 'content: ' + n.outerHTML);

		var elem = FACTORY.factory.mimic(n),
			props, propsFluid;
		if (typeof elem.getProperties === 'function'){
			props = elem.getProperties();
			propsFluid = this.convertPropInFluid(scale, props);
			propsFluid.decorateElement(n);
		}
		console.log(rnd, 'convertCurrentToFluid is over: ' + n.outerHTML);
	};


	/**
	 * Returns another {{#crossLink "Properties"}}Properties{{/crossLink}} instance in which
	 * fixed units (that is, pixels) are replaced by their relative equivalents.
	 *
	 * Relative values are calculated on the base of parent width which must be provided and
	 * must be given in pixels.
	 * @method         convertPropInFluid
	 * @param          {Number}        scale     parameter to setup the scale (in pixels) w.r.t. which the relative
	 *                                           values are to be calculated.
	 * @param          {Properties}    props     instance of Properties class
	 * @return         {Properties}
	 */
	this.convertPropInFluid = function(scale, props){
		if (typeof scale !== 'number'){
			console.log(scale);
			throw new Error('Scale parameter must be a number!');
		}
		if (!(props instanceof Properties)){
			throw new Error('Please, provide a Properties class instance!');
		}

		var result = props.clone(),
			fluidAttrs = ['font-size', 'width', 'max-width', 'min-width', 'padding', 'margin'];
		fluidAttrs.forEach(function(attr){
			var width, widthRel;
			if (result.hasProperty(attr)){
				width = new Unit(result.getProperty(attr));
				if (width.getMeasure() === 'px'){
					widthRel = (width.getValue() / scale * 100) + '%';
					result.setProperty(attr, widthRel);
				}
			}
			if (result.hasStyleProperty(attr)){
				width = new Unit(result.getStyleProperty(attr));
				if (width.getMeasure() === 'px'){
					widthRel = (width.getValue() / scale * 100) + '%';
					result.setStyleProperty(attr, widthRel);
				}
			}

		});
		return result;
	};



}
