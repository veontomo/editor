/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR, FACTORY, Unit, NEWSLETTER, Converter */

/**
 * This class is to deal with documents: parsing, converting, saving.
 * @module 	    HtmlElements
 * @class  		Document
 * @param       {DOM.Node}          node          the content of the document
 * @since       0.0.5
 * @author      A.Shcherbakov
 * @uses        Unit              class to deal with numbers with unit of measurements
 * @uses        Properties        class to deal with Properties of document nodes
 */

function Document(node){
	"use strict";
	if (!(this instanceof Document)) {
		return new Document(node);
	}

	/**
	 * Instance of [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) representing
	 * the content of the class instance.
	 * @private
	 * @property       {DOM.Node}           _content
	 * @type           {DOM.Node}
	 */
	var _content;


	/**
	 * Instance of {{#crossLink "Converter"}}Converter{{/crossLink}}. Its responsability is to convert
	 * current instance into different formats.
	 * @property       {Converter}          _converter
	 * @default        Converter
	 * @private
	 */
	var _converter = new Converter();

	/**
	 * Constructor.
	 *
	 * Sets {{#crossLink "Document/_content:property"}}_content{{/crossLink}} to be equal to `node`
	 * if it is an instance of [DOM.Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 * (in fact, it is enough that `node` has `typeNode` property).
	 * @method         constructor
	 * @param          {DOM.Node}           node
	 */
	if (node && node.nodeType !== undefined){
		_content = node;
	}

	/**
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}} setter. Supposed to be an
	 * instance of {{#crossLink "Converter"}}Converter{{/crossLink}} though no validation control is
	 * performed.
	 * @method         setConverter
	 * @param          {Any}                c
	 * @return         {void}
	 */
	this.setConverter = function(c){
		_converter = c;
	};

	/**
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}} getter.
	 * @method         getConverter
	 * @return         {Any}                Supposed to be an instance of
	 *                                      {{#crossLink "Converter"}}Converter{{/crossLink}}
	 */
	this.getConverter = function(){
		return _converter;
	};

	/**
	 * Sets {{#crossLink "Converter/_mapper:property"}}_mapper{{/crossLink}} of
	 * {{#crossLink "Document/_converter:property"}}_converter{{/crossLink}}.
	 * Alias for {{#crossLink "Converter/setMapper:method"}}setMapper{{/crossLink}} method.
	 * @method         setMapper
	 * @param          {void}               m
	 */
	this.setMapper = function(m){
		_converter.setMapper(m);
	}


	/**
	 * Returns "deep" [clone](https://developer.mozilla.org/en-US/docs/Web/API/Node.cloneNode) of
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}}. If it is not set, nothing
	 * is returned
	 * @method         getContent
	 * @return         {DOM.Node}
	 */
	this.getContent = function(){
		if (_content){
			return _content.cloneNode(true);
		}
	};

	/**
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}} setter.
	 * @method         setContent
	 * @param          {DOM.Node}           n
	 */
	this.setContent = function(n){
		if (n && n.nodeType){
			_content = n;
		}
	};

	/**
	 * Removes specified attributes and properties from
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}}
	 * It first creates a "shallow" (without children) copy of the argument and applies
	 * {{#crossLink "Document/cleanCurrent:method"}}cleanCurrent{{/crossLink}} method
	 * to remove attributes from the argument. Then, consider each child of the argument
	 * and applies {{#crossLink "Document/clean:method"}}clean{{/crossLink}} method to them
	 * and append the result to the shallow copy.
	 *
	 * @method         clean
	 * @return         {void}
	 */
	this.clean = function(){
		var n = this.getContent(),
			out = n.cloneNode(false);
		this.cleanRoot(out);
		var children = n.childNodes,
			len = children.length,
			i, cleanChild, d;
		// parsing each child one by one
		for (i = 0; i < len; i++){
			d = new Document(children.item(i));
			d.clean();
			cleanChild = d.getContent();
			out.appendChild(cleanChild);
		}
		this.setContent(out);
	};

	/**
	 * Removes class and id attributes from the current node without affecting child nodes.
	 * If the node is a not an element node, then nothing is performed upon it.
	 * @method         cleanRoot
	 * @param          {DOM.Node}             node
	 * @return         {void}
	 */
	this.cleanRoot = function(node){
		var attrs = ['class', 'id', 'data-marker'];
		if (node.nodeType === Node.ELEMENT_NODE){
			attrs.forEach(function(attr){
				if (node.hasAttribute(attr)){
					node.removeAttribute(attr);
				}
			});
		}
	};

	/**
	 * Creates a valid html document whose body is given by string `content`.
	 *
	 * **NB**: it uses css of the editor content body.
	 * @method         docHtml
	 * @return         {String}            content of html document
	 */
	this.docHtml = function(){
		var	editorCss = CKEDITOR.getCss() || '',
			bodyCss = Helper.cssOfSelector('body', editorCss);
		if (bodyCss){
			bodyCss = ' style="' + bodyCss + '"';
		}
		var bodyContent = this.getContent();
		bodyContent = bodyContent ? bodyContent.innerHTML : '';
		var header = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var body = "<center>\n<div" + bodyCss + ">\n" + bodyContent +  "\n</div>\n</center>\n";
		var footer = "</body>\n</html>";
		return header + body + footer;
	};

	/**
	 * Converts document into fixed format (not fluid).
	 *
	 * It means that all measures are expressed in pixels, not in percentage or other relative units (like em, pt).
	 * @method         importToFixed
	 * @return         {void}
	 */
	this.importToFixed = function(){
		var c = this.getConverter();
		if (c){
			var fixed = c.convertTo(this.getContent(), 'fixed');
			this.setContent(fixed);

		}
	};


	/**
	 * Converts {{#crossLink "Document/_content:property"}}_content{{/crossLink}} attributes into relative units.
	 *
	 * It means that all allowed measures are expressed in percentage or other relative units (like em, pt).
	 * Note that not all html attributes can be expressed in relative units: i.e. obsolete parameters
	 * "cellspacing", "cellpadding", "border" etc.
	 * @method         importToFluid
	 * @return         {void}
	 */
	this.importToFluid = function(){
		var c = this.getConverter();
		if (c){
			var fluid = c.convertTo(this.getContent(), 'fluid');
			this.setContent(fluid);

		}
	};
	/**
	 * Converts {{#crossLink "Document/_content:property"}}_content{{/crossLink}} into prescribed format.
	 * @method         convertTo
	 * @param          {String}             format
	 * @return         {void}
	 */
	this.convertTo = function(format){
		console.log('Document::convertTo is called with argument ' + format);
		var c = this.getConverter();
		if (typeof c.convertTo === 'function'){
			var newContent = c.convertTo(this.getContent(), format);
			if (newContent){
				this.setContent(newContent);
			}

		}
	};

}

