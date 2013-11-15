<?php

/**
* Writes the content in the folder 'repo'. The file name - either provided by user, otherwise is set to "template.html".
* In case the file already exists, overrides it.
* @return string 	name of the file under which a draft copy was saved in the 'repo' folder
*/
if(isset($_POST['data'])){
	$fileNameSanitized =  preg_replace("/(\.){2,}[,;\\ \/]*/", "\1", htmlspecialchars($_POST['filename']));
	$fileName = !empty($fileNameSanitized) ? $fileNameSanitized : 'template.html';
	$fullPath = 'repo'.DIRECTORY_SEPARATOR.$fileName;
	$content = $_POST['data'];
	// remove old file (if any)
	if(file_exists($fullPath)){
		unlink($fullPath);
	}
	// write the content into a fresh file
	if(file_put_contents($fullPath, $content)){
		echo basename($fileName);
	};

}


?>