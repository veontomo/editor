function target_exists(file){
	$.ajax({url: file}).always(function( data, textStatus, jqXHR ) {
		console.log(textStatus);
	});
}