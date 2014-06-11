/*jslint plusplus: true, white: true */
/*global CKEDITOR, Style, Row, Cell, Table, NEWSLETTER */
$(document).ready(function () {
	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js'
	});
	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});
	});
	CKEDITOR.addCss('.cke_editable tr:hover {box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D;}' );
	CKEDITOR.addCss('.cke_editable td:hover {box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;}');
	CKEDITOR.addCss('* #editor {font-size: 25px; font-family: Times New Roman; color: #500991; }');
});