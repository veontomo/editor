/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR, FACTORY, Unit, NEWSLETTER, Converter, Mapper */

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
	 * (Optional) Styles to be applied to overall content of the newsletter before saving it.
	 *
	 * If set, it is supposed to be an instance of {{#crossLink "Properties"}}Properties{{/crossLink}}
	 * class with {{#crossLink "Properties/_mode:property"}}_mode{{/crossLink}} to be set to correspond
	 * to inline styles.
	 * @property       {Properties}    _wrapCss
	 * @private
	 * @since          0.0.6
	 */
	var _wrapCss;


	/**
	 * Instance of {{#crossLink "Converter"}}Converter{{/crossLink}}. Its responsability is to convert
	 * current instance into different formats.
	 * @property       {Converter}          _converter
	 * @default        Converter
	 * @private
	 */
	var _converter = new Converter(NEWSLETTER.formatMapper || (new Mapper()));

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
	};


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
	 * Removes attributes present in array `flies` of regular expressions from
	 * {{#crossLink "Document/_content:property"}}_content{{/crossLink}}
	 * It first creates a "shallow" (without children) copy of the argument and applies
	 * {{#crossLink "Document/cleanCurrent:method"}}cleanCurrent{{/crossLink}} method
	 * to remove attributes from the argument. Then, consider each child of the argument
	 * and applies {{#crossLink "Document/clean:method"}}clean{{/crossLink}} method to them
	 * and append the result to the shallow copy.
	 *
	 * @method         clean
	 * @param          {Array}      flies        array of regular expressions
	 * @return         {void}
	 */
	this.clean = function(flies){
		var n = this.getContent(),
			out = n.cloneNode(false);
		this.cleanRoot(out, flies);
		var children = n.childNodes,
			len = children.length,
			i, cleanChild, d;
		// parsing each child one by one
		for (i = 0; i < len; i++){
			d = new Document(children.item(i));
			d.clean(flies);
			cleanChild = d.getContent();
			out.appendChild(cleanChild);
		}
		this.setContent(out);
	};

	/**
	 * Removes attributes present in array `flies` from the current node without affecting child nodes.
	 * If the node is a not an element node, then nothing is performed upon it.
	 * @method         cleanRoot
	 * @param          {DOM.Node}               node
 	 * @param          {Array}      flies       array of regular expressions
	 * @return         {void}
	 */
	this.cleanRoot = function(node, flies){
		if (flies && node.nodeType === Node.ELEMENT_NODE){
			var nodeAttrs = node.attributes,  // NamedNodeMap of node attributes
				len = nodeAttrs.length,
				attrNames = [],   // array of node attributes (names of the attributes)
				i;
			// populating plain array of node attributes
			for (i = 0; i < len; i++){
				attrNames.push(nodeAttrs[i].name);
			}
			if (attrNames){
				attrNames.forEach(function(attr){
					// whether an attribute matches at least one regular expression
					var doesMatch = flies.some(function(fly){
						return attr.match(fly);
					});
					if (doesMatch){
						node.removeAttribute(attr);
					}
				});
			}
		}
	};


	/**
	 * {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}} setter.
	 *
	 * If necessary, the argument is transformed into a
	 * {{#crossLink "Properties"}}Propreties{{/crossLink}} instance,
	 * and then assigned to {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}}.
	 * @method         setWrapCss
	 * @param          {Any}        css
	 * @since          0.0.6
	 */
	this.setWrapCss = function(css){
		_wrapCss = (css instanceof Properties) ? css : new Properties(css);
		_wrapCss.setMode(1);   /// 1 corresponds to inline styles
	};

	/**
	 * {{#crossLink "Document/_wrapCss:property"}}_wrapCss{{/crossLink}} getter.
	 * @method         getWrapCss
	 * @return         {Properties}
	 * @since          0.0.6
	 */
	this.getWrapCss = function(){
		return _wrapCss;
	};

	/**
	 * Creates a valid html document whose body is given by string `content`.
	 *
	 * **NB**: it uses css of the editor content body.
	 * @method         docHtml
	 * @return         {String}            content of html document
	 */
	this.docHtml = function(){
		var wrapCss = this.getWrapCss(),
			bodyCssStr = wrapCss ? wrapCss.toString() : '';
		// var	editorCss = CKEDITOR.getCss() || '',
		// 	bodyCss = Helper.cssOfSelector('body', editorCss);
		if (bodyCssStr){
			bodyCssStr = ' style="' + bodyCssStr + '"';
		}
		var bodyContent = this.getContent();
		bodyContent = bodyContent ? bodyContent.innerHTML : '';
		var header = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var body = "<center>\n<div" + bodyCssStr + ">\n" + bodyContent +  "\n</div>\n</center>\n";
		var footer = "</body>\n</html>";
		return header + body + footer;
	};

	/**
	 * Converts {{#crossLink "Document/_content:property"}}_content{{/crossLink}} into prescribed format.
	 * @method         convertTo
	 * @param          {String}             format
	 * @return         {void}
	 */
	this.convertTo = function(format){
		var c = this.getConverter();
		if (typeof c.convertTo === 'function'){
			var newContent = c.convertTo(this.getContent(), format);
			if (newContent){
				this.setContent(newContent);
			}

		}
	};

}

