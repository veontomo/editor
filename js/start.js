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
	});

	var css = 'body {\
	background-color: #ffffff;\
	color: #000001;\
	line-height: normal;\
	text-align: center;\
	font-size: 13px;\
	font-family: Arial, sans-serif;\
	font-style: normal;\
	font-weight: normal;\
	padding: 0;\
	margin: 0;\
	width: 500px;\
}\
\
tr:hover {\
	box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D;\
}\
\
td:hover {\
	box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;\
}\
\
a:hover {\
	background-color: rgba(202, 234, 236, 0.5);\
}';

	CKEDITOR.addCss(css);
	// CKEDITOR.addCss('tr:hover {box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D; }' );
	// CKEDITOR.addCss('td:hover {box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;}');
	// CKEDITOR.addCss('* #editor {font-size: 24px; font-family: Times New Roman; color: #000001;  }');
	// CKEDITOR.addCss('.cke_editable a:hover {background-color: rgba(202, 234, 236, 0.5);}');
	// CKEDITOR.addCss('body {background-color: #ffffff; font-style: normal; font-size: 14px; font-family: Times New Roman; color: #000001; line-height: normal;}');
	// CKEDITOR.addCss('.cke_editable a:hover {-webkit-box-shadow: 0em 0.2em 0.1em 0em rgba(0,0,0,0.3); box-shadow: 0em 0.2em 0.1em 0em rgba(0,0,0,0.3);}');

	// CKEDITOR.addCss('.cke_editable a:hover::before {content:url("images/popuplink.png"); position:absolute; bottom-padding: 10em;}');
});

