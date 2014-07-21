/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper */

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
	 * **NB**: it seems that this functionality is not responsability of {{#crossLink "CDownload"}}CDownload{{/crossLink}} class,
	 * but of another, say Document (not present so far)
	 * @param          {String}             content
	 * @return         {String}
	 */
	clear: function(content){
		if (typeof content !== 'string'){
			return content;
		}
		var output = content.trim();
		output = Helper.specialChar(output.replace(/\t/g, ' '));
		output = output.replace(/\s+(id|class)=\"[a-zA-Z0-9_ ]+?\"/g, '');
		return output;
	},

	/**
	 * Creates a valid html document whose body is given by string `content`.
	 *
	 * **NB**: it uses css of the editor content body.
	 * @method         docHtml
	 * @param          {String}             content
	 * @return         {String}                            content of html document
	 */
	docHtml: function(content){
		var	editorCss = CKEDITOR.getCss() || '',
			bodyCss = Helper.cssOfSelector('body', editorCss);
		if (bodyCss){
			bodyCss = ' style="' + bodyCss + '"';
		}
		var fileHeader = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n";
		var fileBody = "<center>\n<div" + bodyCss + ">\n" + content +  "\n</div>\n</center>\n";
		var fileFooter = "</body>\n</html>";
		return fileHeader + fileBody + fileFooter;
	},

	/**
	 * Converts document into fixed format (not fluid).
	 *
	 * It means that all measures are expressed in pixels, not in percentage or other relative units (like em, pt).
	 * @method         importToFixed
	 * @param          {String}             content        html formatted string of the editor window
	 * @return         {String}                            fixed-format html string of the editor window.
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
	 * @param          {String}               content      html formatted string of the editor window
	 * @return         {String}
	 */
	importToFluid: function(content){
		/// !!!stub
		return content;
	},

}

