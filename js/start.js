/*jslint plusplus: true, white: true */
/*global CKEDITOR, Style, Row, Cell, Table, NEWSLETTER */
window.onload = function(){
	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js'
	});

	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink', 'bar'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});

		// adding block that duplicates the content of the editor window.
		var editable = editor.editable(),
			editorElem = document.getElementsByClassName('editor')[0],
			elem = document.createElement('span'),
			insertedElement = editorElem.parentNode.insertBefore(elem, editorElem.nextSibling);
		editable.attachListener(editable, 'mousedown', function() {
			insertedElement.innerHTML = editable.getHtml();
		});
		// editable.attachListener(editable, 'keydown', function(e) {
		// 	console.log('pressed',  e.data.$.key);
		// });

		// very raw way to access plugin icons in the toolbar
		// start
		var buttonOn = 'cke_button_on';
		var button = document.getElementsByClassName('cke_button__bold2_icon')[0];
		editor.on('change', function() {
			var _class = button.className;
			if (_class){
				if (_class.indexOf(buttonOn) !== -1){
					_class = _class.replace(buttonOn, '');
				} else {
					_class += ' ' + buttonOn;
				}
				button.className = _class.trim();
			}
		});
		// end
	});
	console.log(editor._);
	editor.on('keydown', function(e){
		console.log(e);
	});

};