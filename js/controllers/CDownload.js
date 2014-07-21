/*jslint plusplus: true, white: true */
/*global Helper, CKEDITOR, location */

/**
 * Download Controller.
 * @module    Controllers
 * @class     CDownload
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
var CDownload = {

	/**
	 * Prepares the content of the editor window for downloading and launches the window
	 * for downloading.
	 *
	 * It sends ajax post request to the script `php/saveDraft.php` using JQuery library.
	 * @method         download
	 * @param          {Object}            context
	 * @param          {Object}            editor
	 * @return         {void}
	 */
	download: function(context, editor){
		var fileName = context.getValueOf('tab-general', 'filename'),
			editorContent = editor.document.getBody().getHtml(),
			fileContent, sanitizedContent;

		sanitizedContent = this.clear(editorContent);
		fileContent = this.docHtml(sanitizedContent);
		$.post('php/saveDraft.php',
			{'data': fileContent, 'filename': fileName},
				function(filename){
					$(location).attr('href', 'php/downloadFile.php?filename=' + filename);
			}
		);
	},

	/**
	 * Appends time stamp string to the argument.
	 * @method         appendTimeStamp
	 * @param          {String|Null}        seed       the time stamp is to be appended to this string
	 * @return         {String}
	 */
	appendTimeStamp: function(seed){
		seed = (typeof seed === 'string') ? seed : '';
		var timeNow = new Date(),
			templateName = seed + [
				timeNow.getFullYear(),
				('0' + (timeNow.getMonth() + 1)).slice(-2),     // padding with zeros in case the string is one-symbol length
				('0' + timeNow.getDate()).slice(-2),
				('0' + timeNow.getHours()).slice(-2),
				('0' + timeNow.getMinutes()).slice(-2),
				('0' + timeNow.getSeconds()).slice(-2)
			].join('-') + '.html';
		return templateName;
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
	}


};