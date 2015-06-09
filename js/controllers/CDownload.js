/*jslint plusplus: true, white: true */
/*global CKEDITOR, location, Document, NEWSLETTER, Helper, XMLHttpRequest, ActiveXObject, window, Controller */

/**
 * Download Controller.
 * @module    Controllers
 * @class     CDownload
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
function CDownload (){
	"use strict";
	if (!(this instanceof CDownload)) {
		return new CDownload();
	}
	Controller.call(this);

	/**
	 * Path to a script that saves content. Path is relative with repsect to the `index.php` of the application.
	 * @property       _saveScriptPath
	 * @type           {String}
	 * @private
	 * @since          0.0.7
	 */
	var _saveScriptPath = 'php/saveDraft.php';

	/**
	 * Path to a script that downloads file. Path is relative with repsect to the `index.php` of the application.
	 * @property       _downloadScriptPath
	 * @type           {String}
	 * @private
	 * @since          0.0.7
	 */
	var _downloadScriptPath = 'php/downloadFile.php';

	/**
	 * Name of the parameter with which the content is transferred by help of ajax request
	 * to a script that saves the content and hence the script can access recieved content
	 * by using this key name in  $_POST hash.
	 * @property       _keyName
	 * @type           {String}
	 * @private
	 * @since          0.0.7
	 */
	var _keyName = 'content';

	/**
	 * Prepares the content of the editor for downloading in html format and launches the window
	 * for downloading.
	 *
	 * It sends ajax post request to the script `php/saveDraft.php` using JQuery library.
	 * @method         downloadAsHtml
	 * @param          {Object}            context
	 * @param          {Object}            editor
	 * @return         {void}
	 */
	this.downloadAsHtml = function(context, editor){
		try {
			var fileName = context.getValueOf('tab-general', 'filename'),
				mode = context.getValueOf('tab-general', 'mode'),
				editorContent = editor.document.getBody().$,
				fileContent, doc, bodyCss;

			bodyCss = Helper.cssOfSelector('body', NEWSLETTER.cssBase);
			// sanitized = Helper.specialChar(editorContent);
			doc = new Document(editorContent);
			doc.setWrapCss(bodyCss);
			doc.clean([/\bclass/, /\bid/, NEWSLETTER['marker-name'], /\bdata-.*/]);
			doc.convertTo(mode);
			fileContent = doc.docHtml();
			// console.log(fileContent);
			this.downloadFile(fileContent, fileName);
		} catch (e){
			this.showMessage(e.name + ': ' + e.message);
		}
	};

	/**
	 * Downloads content of the editor window as it is.
	 * @method  downloadRaw
	 * @param   {CKEDITOR.dialog}       dialog 	  See [dialog definition](http://docs.ckeditor.com/#!/api/CKEDITOR.dialog).
	 * @param   {CKEDITOR.editor}       editor    [editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor) instance
	 * @return  {void}
	 * @since   0.0.7
	 */
	this.downloadRaw = function(dialog, editor){
		try {
			var content = editor.getSnapshot(),
				filename = dialog.getValueOf('basic', 'filename');
			this.downloadFile(content, filename);
		} catch (e){
			this.showMessage(e.name + ': ' + e.message);
		}
	};

	/**
	 * Appends time stamp string to the argument.
	 * @method         appendTimeStamp
	 * @param          {String|Null}        seed       the time stamp is to be appended to this string
	 * @return         {String}
	 */
	this.appendTimeStamp = function(seed){
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
	};


	/**
	 * Launches a window for downloading file with content `data` and suggested name `filename`.
	 * If `filename` is not given or is not valid, the file name will be generated.
	 *
	 * For the moment, the method use jQuery library. It is desirable to rewrite
	 * the method such that native javascript methods are used.
	 * (The commented code at the end contains some hints.)
	 * @method  downloadFile
	 * @param  {String} data
	 * @param  {String} filename
	 * @return {void}
	 */
	this.downloadFile = function(data, filename){
		if (typeof data !== 'string'){
			this.showMessage('Can not download non-string content!');
			return;
		}
		// by means of jQuery. It is better to pass to native javascript functions
		$.post(_saveScriptPath,
			{'data': data, 'filename': filename},
				function(fn){
					// console.log('downloading is blocked: filename' + fn);
					$(location).attr('href',  _downloadScriptPath + '?filename=' + fn);
			}
		);

		// native javascript
		// var httpRequest;
		// if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		//   httpRequest = new XMLHttpRequest();
		// } else if (window.ActiveXObject) { // IE
		//   try {
		//     httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		//   }
		//   catch (e1) {
		//     try {
		//       httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		//     }
		//     catch (e2) {
		//     	console.log('Failed when creating XMLHTTP object!');
		//     	return false;
		//     }
		//   }
		// }
		// httpRequest.onreadystatechange = function(){
		// 	console.log('redirection is blocked');
		// 	if (httpRequest.readyState === 4 && httpRequest.status === 200) {
		// 			console.log(httpRequest.responseText);
		// 		}
		// 	// window.location.replace( 'php/downloadFile.php?filename=' + fileName);
		// };

		// var content = {'data': fileContent, 'filename': fileName},
		// 	contentToSend = _keyName + '=' + JSON.stringify(content);

		// httpRequest.open('POST', _scriptPath);
		// httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// httpRequest.setRequestHeader("Content-length", contentToSend.length);
		// httpRequest.setRequestHeader("Connection", "close");

		// httpRequest.send(contentToSend);
	};


}
CDownload.prototype = Object.create(Controller.prototype);