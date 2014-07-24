/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR, FACTORY, Unit, NEWSLETTER */

/**
 * Methods of this class convert one format in another.
 * @module 	    HtmlElements
 * @class  		Converter
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function Converter(){
	"use strict";
	if (!(this instanceof Converter)) {
		return new Converter();
	}



	/**
	 * Among all methods present in this class, finds one which name is equal to value of `name` (case insensitive).
	 *
	 * It gets names of all methods in the class, transforms them in lower case, then looks up for
	 * lowered-case of `name` among them. Corrresponding method name of the first occurrence is returned.
	 * @method         _findMostSimilarMethodName
	 * @private
	 * @param          {String}             name
	 * @return         {String|void}
	 */
	var _findMostSimilarMethodName = function(name){
		var allMethods = Object.getOwnPropertyNames(this),
			nameLower = name.toLowerCase(),
			len = allMethods.length, i;
		for (i = 0; i < len; i++){
			if (allMethods[i].toLowerCase() === nameLower){
				return allMethods[i];
			}
		}
	}.bind(this);


	/**
	 * Converts `content` in format `format`.
	 *
	 * In order to find appropriate method, argument `format` is prepended with string "convertTo"
	 * and then it attemps to find a method inside this class that is equal to string "convertTo..."
	 * (case insensitive). If such a method is found, then it gets executed and the result of its
	 * action is returned.
	 * @method         convertTo
	 * @param          {DOM.Node}           content
	 * @param          {String}             format
	 * @return         {DOM.Node}
	 */
	this.convertTo = function(content, format){
		if (typeof format ==='string'){
			var methodName = 'convertTo' + format,
				foundName = _findMostSimilarMethodName(methodName);
			if (foundName && foundName !== 'convertTo'){ // compare to this method name in order
														 // to avoid any self-call
				return this[foundName](content);
			}
		}
	};


	/**
	 * Converts `content` into fixed format. It means that all units of measure must be expressed in pixels.
	 *
	 * For the moment the action of this method is trivial.
	 * @method         convertToFixed
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convertToFixed = function(content){
		return content;
	};

	/**
	 * Converts `content` into fluid format. It means that all units of measure must be expressed in relative units (in %).
	 * @method         convertToFluid
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convertToFluid = function(content){
		// var rnd = parseInt(Math.random()*1000, 10);
		// console.log(rnd, 'import started');
		// var n = this.getContent();
		// console.log(rnd, 'content: ' + n.outerHTML);
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
			// d = new Document(children.item(i));
			// .importToFluid();
			// childFluid = d.getContent();
			childFluid = this.convertToFluid(children.item(i));
			result.appendChild(childFluid);
		}
		// console.log(rnd, 'importToFluid: setting new content to ' + result.outerHTML);
		// this.setContent(result);
		return result;
		// console.log(rnd, 'setting new content: ' + result.outerHTML);
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

