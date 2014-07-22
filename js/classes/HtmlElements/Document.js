/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR, FACTORY */

/**
 * This singleton deals with the content of the editor document.
 * @module 	    HtmlElements
 * @class  		Document
 * @constructor
 * @since       0.0.5
 * @author      A.Shcherbakov
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
	 * @param          {DOM.Element}       content
	 * @return         {String}            content of html document
	 */
	docHtml: function(content){
		var	editorCss = CKEDITOR.getCss() || '',
			bodyCss = Helper.cssOfSelector('body', editorCss);
		if (bodyCss){
			bodyCss = ' style="' + bodyCss + '"';
		}
		var fileHeader = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var fileBody = "<center>\n<div" + bodyCss + ">\n" + content.innerHTML +  "\n</div>\n</center>\n";
		var fileFooter = "</body>\n</html>";
		return fileHeader + fileBody + fileFooter;
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
	 * Converts document into fluid format.
	 *
	 * It means that all allowed measures are expressed in percentage or other relative units (like em, pt).
	 * Note that not all html attributes can be expressed in relative units: i.e. obsolete parameters
	 * "cellspacing", "cellpadding", "border" etc.
	 * @method         importToFluid
	 * @param          {DOM.Element}               content      html formatted string of the editor window
	 * @return         {DOM.Element}
	 */
	importToFluid: function(content){
		/// !!!stub
		console.log(content);
		console.log(FACTORY.factory.mimic(content).toHtml());
		return content;
	}

};

