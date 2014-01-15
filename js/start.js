/*jslint plusplus: true, white: true */
/*global CKEDITOR */
$(document).ready(function () {
	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js'
	});
	// once the editor is loaded, insert a table inside
	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});
	});
});