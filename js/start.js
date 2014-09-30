/*jslint plusplus: true, white: true */
/*global window, CKEDITOR, NEWSLETTER */
window.onload = function(){
	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js',
	});

	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink', 'bar'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});

		// adding block that duplicates the content of the editor window.
		// var editable = editor.editable(),
		// 	editorElem = document.getElementsByClassName('editor')[0],
		// 	elem = document.createElement('span'),
		// 	insertedElement = editorElem.parentNode.insertBefore(elem, editorElem.nextSibling);
		// editable.attachListener(editable, 'mousedown', function() {
		// 	insertedElement.innerHTML = editable.getHtml();
		// });
		// editable.attachListener(editable, 'keydown', function(e) {
		// 	console.log('pressed',  e.data.$.key);
		// });
	});

	// editor.on('key', function(event) {
	// 	try {
	// 		console.log(event.data.keyCode);
	// 	} catch (e){
	// 		console.log('Error (' + e.name + ') when listening to key press: ' + e.message);
	// 	}
	// });

	editor.on('contentDom', function() {
		var editable = editor.editable();
	    editable.attachListener(editor.document, 'mousedown', function() {
	    	EHtoolbarHighight.test();
	    });
	    editable.attachListener(editor.document, 'keydown', function(event) {
	        try {
	        	var key = event.data.$.key;
	        	if (key === 'Left' || key === 'Right' || key === 'Down' || key === 'Up'){
	        		EHtoolbarHighight.test();
	        	}
       		} catch (e){
       			console.log('Error (' + e.name + ') when listening to key press: ' + e.message);
       		}
	    });

	} );




	// very raw way to access plugin icons in the toolbar
	// start
	// var buttonOn = 'cke_button_on';
	// var button = document.getElementsByClassName('cke_button__bold2_icon')[0];
	// editor.on('change', function() {
	// 	var _class = button.className;
	// 	if (_class){
	// 		if (_class.indexOf(buttonOn) !== -1){
	// 			_class = _class.replace(buttonOn, '');
	// 		} else {
	// 			_class += ' ' + buttonOn;
	// 		}
	// 		button.className = _class.trim();
	// 	}
	// });
	// end



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

	});


};