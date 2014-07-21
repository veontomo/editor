/*jslint plusplus: true, white: true */
/*global CKEDITOR, location, Document */

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
			isFluid = context.getValueOf('tab-general', 'mode'),
			editorContent = editor.document.getBody().getHtml(),
			fileContent, sanitizedContent;

		sanitizedContent = Document.clear(editorContent);
		fileContent = Document.docHtml(sanitizedContent);
		fileContent = isFluid ? Document.importToFluid(fileContent) : Document.importToFixed(fileContent);

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



};