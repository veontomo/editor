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

	});

	editor.on('contentDom', function() {
		var editable = editor.editable();
	    editable.attachListener(editor.document, 'mousedown', function() {
	    	EHToolbar.highlight(editor);
	    });
	    editable.attachListener(editor.document, 'keydown', function(event) {
	        try {
	        	var key = event.data.$.key;
	        	// calling the event only if right, left, up or down arrow is pressed
	        	if (key === 'Left' || key === 'Right' || key === 'Down' || key === 'Up'){
	        		EHToolbar.highlight(editor);
	        	}
       		} catch (e){
       			console.log('Error (' + e.name + ') when listening to key press: ' + e.message);
       		}
	    });

	} );

	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink', 'bar'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});
	});


};