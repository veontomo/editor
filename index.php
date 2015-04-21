<!DOCTYPE html>
<html>
<head>
	<?php
		$developMode = (strpos(__FILE__, "projects") == true);
		$title = 'Creatore di newsletter' ;
		if ($developMode){
			$title = 'develop mode ' . $title;
		}
		echo '<style>#marker{
			position: relative;
			top: 0em;
			left: 0em;
			// width: 10em;
			color: red;
			font-size: 5em;
			padding-left: 4em;
			margin: 0em;
			// z-index: -1;
			-webkit-transform: rotate(0deg);
			-webkit-transform-origin: 0% 0%;
			-o-transform: rotate(0deg);
			-o-transform-origin:0% 0%;
			transform: rotate(0deg);
			transform-origin: 0% 0%;
			color: #D22415;
			// opacity: 0.3;
			background-color: #3D7899;
		}
			.info{
				padding: 0.3em;
				margin-bottom: 0.5em;
				background-color: #3D7899;
				color: #FFFFFF;
				font-size: 1.1em;
			}
			</style>';

	?>
	<?php
		$jsMin = 'js_prod/editor.min.js';
	?>

 	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<!-- jQuery -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/adapters/jquery.js"></script>

	<!-- minified editor file: includes definitions of classes and configuration settings -->
	<script type="text/javascript" src="<?= $jsMin;?>"></script>

	<!-- external plugins -->
	<script type="text/javascript" src="externalPlugins/picker.min.js"></script>

	<link rel="stylesheet" type="text/css" href="externalPlugins/colorpicker_dist/codebase/dhtmlxcolorpicker.css"/>
	<script src="externalPlugins/colorpicker_dist/codebase/dhtmlxcolorpicker.js"></script>

	<title><?= $title ?></title>
</head>

<?php
require 'php/fileContent.php';
if(isset($_FILES['fileInput']) && array_key_exists('error', $_FILES['fileInput']) && ($_FILES['fileInput']['error'] === 0)){
	$fileContent = fileContent(file_get_contents($_FILES['fileInput']['tmp_name']));
}
?>
<body>
	<?php
		if ($developMode){
			$gitIndex = '.git/index';
			$lastUpdate =  file_exists($gitIndex) ? 'Ultimo aggiornamento: ' . date("d F Y H:i:s", filemtime($gitIndex)) : '';

			$buildTime = date('d F Y H:i:s', filemtime($jsMin));
			echo '<div id="marker">Test Mode</div>';
			echo "<div class=\"info\">JS build time: $buildTime, $lastUpdate, current version: 0.2.6</div>";

		}
	?>

    <div class="panel">
	    <a href="statistics/jsDoc/" target="_blank"><img src="images/yui-logo.png" height="40" title="javascript code docs"/>JS</a>
    </div>
    <div class="panel">
      <a href="statistics/phpDoc" target="_blank"><img src="images/phpdoc-logo.png" height="40" title="php code docs"/>PHP</a>
    </div>
    <div class="panel">
      <a href="jasmine/" target="_blank"><img src="images/TDD.png" height="40" title="Jasmine functional tests"/></a>
    </div>
    <div class="panel">
		<a href="coverage.php" target="_blank"><img src="images/coverage.png" height="40" title="javascript code coverage"/></a>
    </div>
    <div class="panel">
		<a href="statistics/phpCoverage/" target="_blank"><img src="images/phpCoverage.png" height="40" title="php code coverage"/></a>
    </div>

    <div class="panel">
		<a href="notes.php" target="blank">Notes</a>
    </div>

	<form method="post" action='#' enctype="multipart/form-data">
		<input type="file" id="fileInput" name="fileInput">
		<input type="submit" value="submit">
	</form>
	<div id="editor">
		<?php if(isset($fileContent)){
			echo $fileContent;
		}?>
		<a href="www.test.com" title="this a title of the link" style="text-decoration: none; padding: 14px;color:#878787;"><span>span 1</span><span>span2</span> <img src="http://www.viaggero.it/europa/francia/parigi/immagini/tram-parigi.png" title="T character" width="100" /></a> Nel saggio che dà il titolo alla raccolta, lo scrittore sostiene che le letture di gioventù risultano spesso poco proficue e forniscono al giovane lettore soltanto modelli, termini di paragone, schemi di classificazione e scale di valori con cui confrontarsi. La lettura in profondità, quella fra le righe, le varie allegorie, le metafore più astratte vengono colte unicamente con la rilettura in età matura, la quale, invece, permette di ritrovare le costanti summenzionate nei meccanismi interiori che già regolano il comportamento inconscio dell'individuo.
		<ol>
			<li><a href="www.test.com" style="text-decoration: none; padding: 14px;color:#878787;" title="this a title of the link">link</a></li>
	<li>item 2</li>
			<li>item 2</li>
			<li>item 3</li>
			<li>item 4</li>
		</ol>
	</div>
	<script type="text/javascript" src="event.js"></script>
</body>
</html>