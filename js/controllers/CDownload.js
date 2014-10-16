/*jslint plusplus: true, white: true */
/*global CKEDITOR, location, Document, NEWSLETTER, Helper, XMLHttpRequest, ActiveXObject,window */

/**
 * Download Controller.
 * @module    Controllers
 * @class     CDownload
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
function CDownload (){
	/**
	 * Path to a script that saves content. Path is relative with repsect to the `index.php` of the application.
	 * @property       _scriptPath
	 * @type           {String}
	 * @private
	 * @since          0.0.7
	 */
	var _scriptPath = 'php/saveDraft.php';

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
	 * Prepares the content of the editor window for downloading and launches the window
	 * for downloading.
	 *
	 * It sends ajax post request to the script `php/saveDraft.php` using JQuery library.
	 * @method         download
	 * @param          {Object}            context
	 * @param          {Object}            editor
	 * @return         {void}
	 */
	this.download = function(context, editor){
		var fileName = context.getValueOf('tab-general', 'filename'),
			mode = context.getValueOf('tab-general', 'mode'),
			editorContent = editor.document.getBody().$,
			fileContent, doc, bodyCss;

		bodyCss = Helper.cssOfSelector('body', NEWSLETTER.cssBase);
		// sanitized = Helper.specialChar(editorContent);
		doc = new Document(editorContent);
		doc.setWrapCss(bodyCss);
		doc.clean([/\bclass/, /\bid/, NEWSLETTER['marker-name'], /\bdata-.*/]);
		// console.log('before escape: ' + doc.getContent().innerHTML);
		// doc.escape();
		// console.log('after escape: ' + doc.getContent().innerHTML);
		doc.convertTo(mode);
		fileContent = doc.docHtml();
		// console.log(fileContent);

		// by means of jQuery
		// $.post('php/saveDraft.php',
		// 	{'data': fileContent, 'filename': fileName},
		// 		function(filename){
		// 			// console.log('redirection is blocked');
		// 			$(location).attr('href', 'php/downloadFile.php?filename=' + filename);
		// 	}
		// );

		// native javascript
		var httpRequest;
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		  httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
		  try {
		    httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		  }
		  catch (e1) {
		    try {
		      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		    }
		    catch (e2) {
		    	console.log('Failed when creating XMLHTTP object!');
		    	return false;
		    }
		  }
		}
		httpRequest.onreadystatechange = function(){
			console.log('redirection is blocked');
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
					console.log(httpRequest.responseText);
				}
			// window.location.replace( 'php/downloadFile.php?filename=' + fileName);
		};

		var content = {'data': fileContent, 'filename': fileName},
			contentToSend = _keyName + '=' + JSON.stringify(content);

		httpRequest.open('POST', _scriptPath);
		httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		httpRequest.setRequestHeader("Content-length", contentToSend.length);
		httpRequest.setRequestHeader("Connection", "close");

		httpRequest.send(contentToSend);


		// var url = "get_data.php";
		// var params = "lorem=ipsum&name=binny";
		// http.open("POST", url, true);

		// //Send the proper header information along with the request
		// http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// http.setRequestHeader("Content-length", params.length);
		// http.setRequestHeader("Connection", "close");

		// http.onreadystatechange = function() {//Call a function when the state changes.
		// 	if(http.readyState == 4 && http.status == 200) {
		// 		alert(http.responseText);
		// 	}
		// }
		// http.send(params);
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
}