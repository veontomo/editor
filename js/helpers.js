function target_exists(fileName){
    $.ajax({
        url: fileName, 
        type: 'GET', 
        async: false, 
        timeout: 1000, 
        error:  function(XMLHttpRequest, textStatus, errorThrown) {
            console.debug("An error has occurred making the request: " + errorThrown);
        },
        success:  function() {
            console.debug("file " + fileName + " is found");
            var output = true;
        }
    }).complete(function(){console.debug("ajax finished"); return true;});
}
