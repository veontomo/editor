<?php
// this is to visualise the code coverage reports located
// in "test/coverage/" folder.
//  Create a script that visualizes it.
// 23/04_2014 10:27

$ext = array('html', 'htm', 'php');
$sep = DIRECTORY_SEPARATOR;
$base = dirname(__FILE__).$sep.'statistics'.$sep.'jsCoverage'.$sep;
// echo $base
$keys = array_keys($_GET);
$offset = count($keys) > 0 ? array_pop($keys) . $sep : '';
$path = $base . $offset;
if (is_dir($path)){
	$dirCont = scandir($path);
	// print_r($dirCont);
	foreach ($dirCont as $file) {
		if (in_array(pathinfo($file, PATHINFO_EXTENSION), $ext)){
			echo $file . ' is allowed<br/>';
		} else if (is_dir($path.$file)){
			echo "<a href=\"?".$offset.$file."\">$path$file </a><br/>";
		}

	}
} else {
	echo "$path is not a dir";
}
?>