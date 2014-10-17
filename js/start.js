/*jslint plusplus: true, white: true */
/*global window, CKEDITOR, NEWSLETTER */
window.onload = function(){
	// document.onkeydown = function (e) {
	// 	return ((e.which || e.keyCode) === 116 && confirm('All data will be lost if you select "OK".'));
	//     // return (e.which || e.keyCode) != 116 ;
	// };

	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js',
	});

	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink', 'bar'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});
		var editable = editor.editable();
	    editable.attachListener(editor.document, 'keydown', function(e) {
	    	if (e.data.$.key === 'F5'){
	    		var res = confirm('Are you sure to reload the page? All data will be lost if you select "OK"!');
	    		if(!res){
	    			e.data.preventDefault();
	    		};
	    	}
	    });
	});

	// console.log(CKEDITOR.editable());
	// CKEDITOR.editable().attachListener(CKEDITOR.editable().getDocument(), 'mousedown', function() {
	// 	alert('I am here');
	// 	return true;
	// });


};