$(document).ready(function(){
	CKEDITOR.replace( 'editor', 
		{
			customConfig: '../settings/editor_config.js',

		}
	);
	var CKEDITOR_BASEPATH = 'plugins/abbr';
	console.log(CKEDITOR_BASEPATH);

	$.ajax({
    url: CKEDITOR_BASEPATH,
    statusCode: {
        404: function() {
            alert('not found');
        }
    }
});

})


