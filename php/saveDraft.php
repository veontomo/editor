<?php

/**
* Writes the content in the folder 'repo'. The file name - either provided by user, otherwise is set to "template.html".
* In case the file already exists, overrides it.
* @return string 	name of the file under which a draft copy was saved in the 'repo' folder
*/
if(isset($_POST['data'])){
	$fileNameSanitized =  preg_replace("/(\.){2,}[,;\\ \/]*/", "\1", htmlspecialchars($_POST['filename']));

	$fileName = !empty($fileNameSanitized) ? $fileNameSanitized : 'template ' . date('Y-m-d-H-i', time()) . '.html';
	$fullPath = 'repo'.DIRECTORY_SEPARATOR.$fileName;
	$content = $_POST['data'];
	// remove old file (if any)
	if(file_exists($fullPath)){
		unlink($fullPath);
	}
	// write the content into a fresh file
	if(file_put_contents($fullPath, sanitizeContent($content))){
		echo basename($fileName);
	};
}

/**
 * Escapes special characters from $content.
 *
 * @param  String    $content
 * @return String
 */
function sanitizeContent($content){
	$replacement = [
		'à' => '&agrave;',
		'è' => '&egrave;',
		'ì' => '&igrave;',
		'ù' => '&ugrave;',
		'ò' => '&ograve;',
		'À' => '&Agrave;',
		'È' => '&Egrave;',
		'Ì' => '&Igrave;',
		'Ò' => '&Ograve;',
		'Ù' => '&Ugrave;',
		'é' => '&eacute;',
		'É' => '&Eacute;',
		'\'' => '&#39;'
	];
	$result = $content;
	foreach ($replacement as $key => $value){
		$result = str_replace($key, $value, $result);
	}
	return $result;
}
