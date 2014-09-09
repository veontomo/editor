/*jslint plusplus: true, white: true */
/*global CKEDITOR, Style, Row, Cell, Table, NEWSLETTER */
$(document).ready(function () {
	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js'
	});

	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink', 'bar'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});

		var editable = editor.editable();
		var editorElem = document.getElementsByClassName('editor')[0];
		var elem = document.createElement('div');
		elem.style.color = 'red';
		var insertedElement = editorElem.parentNode.insertBefore(elem, editorElem.nextSibling);
		editable.attachListener(editable, 'mousedown', function() {
			insertedElement.innerHTML = editable.getHtml();
			console.log(editable.getHtml());
		});
	});

// 	var css = 'body {\
// 	background-color: #ffffff;\
// 	color: #000001;\
// 	line-height: normal;\
// 	text-align: center;\
// 	font-size: 13px;\
// 	font-family: Arial, sans-serif;\
// 	font-style: normal;\
// 	font-weight: normal;\
// 	padding: 0;\
// 	margin: 0;\
// }\
// \
// tr:hover {\
// 	box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D;\
// }\
// \
// td:hover {\
// 	box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;\
// }\
// \
// a:hover {\
// 	background-color: rgba(202, 234, 236, 0.5);\
// }';

// 	CKEDITOR.addCss(css);
});

