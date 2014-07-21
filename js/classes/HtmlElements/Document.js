/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR */

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
	 * Removes specified attributes and properties from `content`.
	 *
	 * @param          {DOM.Element}             content
	 * @return         {DOM.Element}
	 */
	clear: function(content){
		/// !!!stub
		// if (typeof content !== 'string'){
		// 	return content;
		// }
		// var output = content.trim();
		// output = Helper.specialChar(output.replace(/\t/g, ' '));
		// output = output.replace(/\s+(id|class)=\"[a-zA-Z0-9_ ]+?\"/g, '');
		return content;
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

