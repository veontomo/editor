<?php
// require_once 'FileManagement.php';

// $worker = new FileManagement();
// $content = $worker->getContent($_POST, 'content');
// $info = $worker->decipher($content);
// $worker->setFileName($info['filename']);
// $worker->save($info['data']);
// $file = fopen('error_log.log', 'a');
// fwrite($file, "\r\nContent " . $content . "\r\n");
// fclose($file);
// exit();
//
//
// $worker = new FileManagement();
// $worker->setContent('ciao ciao');
// $worker->setFileName('abc');
// $worker->save();
// $worker->download();


/**
* Writes the content in the folder 'repo'. The file name - either provided by user, otherwise is set to "template.html".
* In case the file already exists, overrides it.
* @return string 	name of the file under which a draft copy was saved in the 'repo' folder
*/
// $file = fopen('error_log.log', 'a');
// try {
// 	fwrite($file, "\r\nPOST " . print_r($_POST, true) . "\r\n");
// 	$data = json_decode($_POST['content']);
// 	fwrite($file, 'json_decode: ' . print_r($data, true));

// } catch(Exception $e){
// 	fwrite($file, $e->getMessage());
// }

if (isset($_POST['data'])){
	// fwrite($file, 'OK');

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
// fclose($file);


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
		'ó' => '&oacute;',
		'À' => '&Agrave;',
		'È' => '&Egrave;',
		'Ì' => '&Igrave;',
		'Ò' => '&Ograve;',
		'Ù' => '&Ugrave;',
		'é' => '&eacute;',
		'É' => '&Eacute;',
		'Ó' => '&Oacute;',
		'\'' => '&#39;',
		'€' => '&euro;'

	];
	$result = $content;
	foreach ($replacement as $key => $value){
		$result = str_replace($key, $value, $result);
	}
	return $result;
}


