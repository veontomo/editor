$(document).ready(function(){
	var editor = CKEDITOR.replace( 'editor', 
		{
			customConfig: '../settings/editor_config.js',
	

		}
	);

	target_exists('ckeditor/plugins/abbr');
/*	var CKEDITOR_BASEPATH = 'plugins/abbr';
	console.log(CKEDITOR_BASEPATH);

	$.ajax({
    url: CKEDITOR_BASEPATH,
    	statusCode: {
	        404: function() {
    	        alert('not found');
	        }
    	}
	});
*/

	editor.on( 'instanceReady', function() {
		/*
	    console.log( editor.filter.allowedContent );

	    console.log('plugins');
	    console.log( editor.plugins );

	    console.log('allowed content');
	    console.log(editor.filter.allowedContent);


	*/
	} );






})


