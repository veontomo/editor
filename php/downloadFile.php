<?php

if(isset($_GET['filename'])){
	$fileNameSanitize = preg_replace("/(\.){2,}[,;\\ \/]*/", "\1", htmlspecialchars($_GET['filename']));
	$filePath = 'repo'.DIRECTORY_SEPARATOR.$fileNameSanitize;

	if(file_exists($filePath)){
		// the order of the below line is VERY important!!!	
		header("Content-Type: application/octet-stream");
		header("Content-Transfer-Encoding: Binary");
		header("Content-disposition: attachment; filename=\"$fileNameSanitize\"");
		readfile($filePath);	
	}

}
?>