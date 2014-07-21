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
	 * @method         download
	 * @param          {Object}            context
	 * @param          {Object}            editor
	 * @return         {void}
	 */
	download: function(context, editor){
		var fileName = context.getValueOf('tab-general', 'filename'),
			editorContent = editor.document.getBody().getHtml(),
			fileHeader, fileFooter, fileBody, fileContent, sanitizedContent,
			editorCss = CKEDITOR.getCss() || '',
			bodyCss = Helper.cssOfSelector('body', editorCss);
		if (bodyCss){
			bodyCss = ' style="' + bodyCss + '"';
		}

		sanitizedContent = Helper.specialChar(editorContent.replace(/\t/g, ' '));
		sanitizedContent = sanitizedContent.replace(/\s+(id|class)=\"[a-zA-Z0-9_ ]+?\"/g, '');
		fileHeader = "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><body>";
		fileBody = "<center><div" + bodyCss + ">" + sanitizedContent +  "</div></center>";
		fileFooter = "</body></html>";
		fileContent = fileHeader + fileBody + fileFooter;
		$.post('php/saveDraft.php',
			{'data': fileContent, 'filename': fileName},
				function(filename){
					// console.log("data sent and file name is recieved: " + filename);
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
	}


};