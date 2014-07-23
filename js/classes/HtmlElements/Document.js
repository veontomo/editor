/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR, FACTORY, Unit, NEWSLETTER */

/**
 * This singleton deals with the content of the editor document.
 * @module 	    HtmlElements
 * @class  		Document
 * @constructor
 * @since       0.0.5
 * @author      A.Shcherbakov
 * @uses        Unit              class to deal with numbers with unit of measurements
 * @uses        Properties        class to deal with Properties of document nodes
 */

var Document = {
	/**
	 * Removes specified attributes and properties from `node` and all its children.
	 * It first creates a "shallow" (without children) copy of the argument and applies
	 * {{#crossLink "Document/cleanCurrent:method"}}cleanCurrent{{/crossLink}} method
	 * to remove attributes from the argument. Then, consider each child of the argument
	 * and applies {{#crossLink "Document/clean:method"}}clean{{/crossLink}} method to them
	 * and append the result to the shallow copy.
	 *
	 * @method         clean
	 * @param          {DOM.Element}             node
	 * @return         {DOM.Element}
	 */
	clean: function(node){
		var out = node.cloneNode(false);
		this.cleanCurrent(out);
		var children = node.childNodes,
			len = children.length,
			i, cleanChild;
		// parsing each child one by one
		for (i = 0; i < len; i++){
			cleanChild = this.clean(children.item(i));
			out.appendChild(cleanChild);
		}
		return out;
	},

	/**
	 * Removes class and id attributes from the current node without affecting child nodes.
	 * If the node is a not an element node, then nothing is performed upon it.
	 * @method        cleanCurrent
	 * @param          {DOM.Element}             node
	 * @return         {void}
	 */
	cleanCurrent: function(node){
		var attrs = ['class', 'id'];
		if (node.nodeType === Node.ELEMENT_NODE){
			attrs.forEach(function(attr){
				if (node.hasAttribute(attr)){
					node.removeAttribute(attr);
				}
			});
		}
	},

	/**
	 * Creates a valid html document whose body is given by string `content`.
	 *
	 * **NB**: it uses css of the editor content body.
	 * @method         docHtml
	 * @param          {DOM.Element}       node
	 * @return         {String}            content of html document
	 */
	docHtml: function(node){
		var	editorCss = CKEDITOR.getCss() || '',
			bodyCss = Helper.cssOfSelector('body', editorCss);
		if (bodyCss){
			bodyCss = ' style="' + bodyCss + '"';
		}
		var header = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var body = "<center>\n<div" + bodyCss + ">\n" + node.innerHTML +  "\n</div>\n</center>\n";
		var footer = "</body>\n</html>";
		return header + body + footer;
	},

	/**
	 * Converts document into fixed format (not fluid).
	 *
	 * It means that all measures are expressed in pixels, not in percentage or other relative units (like em, pt).
	 * @method         importToFixed
	 * @param          {DOM.Element}             content        html formatted string of the editor window
	 * @return         {DOM.Element}                            fixed-format html string of the editor window.
	 */
	importToFixed: function(content){
		// for the moment this method has trivial action.
		return content;
	},


	/**
	 * Converts `node` attributes into relative units.
	 *
	 * It means that all allowed measures are expressed in percentage or other relative units (like em, pt).
	 * Note that not all html attributes can be expressed in relative units: i.e. obsolete parameters
	 * "cellspacing", "cellpadding", "border" etc.
	 * @method         importToFluid
	 * @param          {DOM.Element}               node      html formatted string of the editor window
	 * @return         {DOM.Element}
	 */
	importToFluid: function(node){
		// console.log('import to fluid');
		var result = node.cloneNode(false),
			parent,
			width;
		if (node.nodeType === Node.TEXT_NODE){
			return result;
		}
		parent = node.parent;
		if (parent){
			width = this.getElemWidth(parent);
		}
		if (!width){
			width = new Unit(NEWSLETTER.maxWidth, 'px');
		}
		this.convertCurrentToFluid(width.getValue(), result);
		var children = node.childNodes,
			len = children.length,
			i, childFluid;
		for (i = 0; i < len; i++){
			childFluid = this.importToFluid(children.item(i));
			result.appendChild(childFluid);
		}
		console.log('result: ', result);
		console.log('result html: ', result.outerHTML);
		return result;
	},

	/**
	 * Returns {{#crossLink "Unit"}}Unit{{/crossLink}} instance representing width of `node` which must
	 * be a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance.
	 * If width can not be established, nothing is returned.
	 * @method  getElemWidth
	 * @param  {DOM.Element}              node
	 * @return {Unit|undefined}
	 */
	getElemWidth: function(node){
		if (node.hasAttribute('width')){
			return new Unit(node.getAttribute('width'));
		}
		var styles = node.style;
		if (node.hasAttribute('style')){
			if (styles.width){
				return new Unit(node.getAttribute('width'));
			}
		}

	},


	/**
	 * Returns a copy of the argument in which properties are replaced by their relative equivalients.
	 * @method         convertCurrentToFluid
	 * @param          {Number}            scale          value of width in pixel with respect to which the relative sizes
	 *                                                    are to be calculated
	 * @param          {DOM.Element}       node
	 * @return         {void}
	 */
	convertCurrentToFluid: function(scale, node){
		var elem = FACTORY.factory.mimic(node),
			props, propsFluid;
		if (typeof elem.getProperties === 'function'){
			props = elem.getProperties();
			propsFluid = this.convertPropInFluid(scale, props);
			propsFluid.decorateElement(node);
		}
	},


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
	convertPropInFluid: function(scale, props){
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
				if (width.measure === 'px'){
					widthRel = (width.value / scale * 100) + '%';
					result.setProperty(attr, widthRel);
				}
			}
			if (result.hasStyleProperty(attr)){
				width = new Unit(result.getStyleProperty(attr));
				if (width.measure === 'px'){
					widthRel = (width.value / scale * 100) + '%';
					result.setStyleProperty(attr, widthRel);
				}
			}

		});
		return result;
	}



};

