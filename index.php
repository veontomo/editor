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
			margin-bottom: 0.1em;
			// z-index: -1;
			-webkit-transform: rotate(0deg);
			-webkit-transform-origin: 0% 0%;
			-o-transform: rotate(0deg);
			-o-transform-origin:0% 0%;
			transform: rotate(0deg);
			transform-origin: 0% 0%;
			color: #D22415;
			// opacity: 0.3;
			background-color: #3D7899}</style>';

	?>

 	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<!-- jQuery -->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/adapters/jquery.js"></script>
	<script type="text/javascript" src="js/start.js"></script>

	<script type="text/javascript" src="js/classes/Helper.js"></script>
	<script type="text/javascript" src="js/classes/Helper/Unit.js"></script>
	<script type="text/javascript" src="js/classes/Properties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/ImageProperties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/LinkProperties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/CellProperties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/ListProperties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/ListItemProperties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/RowProperties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/TableProperties.js"></script>


	<!-- models -->
	<script type="text/javascript" src="js/classes/HtmlElements/Content.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/Table.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/Cell.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/Image.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/Row.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/List.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/ListItem.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/OList.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/UList.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Tag/Link.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/PlainText.js"></script>

	 <!-- document-related models -->
	<script type="text/javascript" src="js/classes/HtmlElements/Document.js"></script>


	<!-- converters -->
	<script type="text/javascript" src="js/converters/Converter.js"></script>
	<script type="text/javascript" src="js/converters/ConverterGeneral.js"></script>
	<script type="text/javascript" src="js/converters/ConverterFixed.js"></script>
	<script type="text/javascript" src="js/converters/ConverterElastic.js"></script>

	<!-- helpers  -->
	<script type="text/javascript" src="js/classes/CKHelper.js"></script>
	<!-- // <script type="text/javascript" src="js/classes/CKHelper/Selection.js"></script> -->
	<script type="text/javascript" src="js/classes/HtmlElements/Mapper.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Factory.js"></script>

	<!-- Controllers -->
	<script type="text/javascript" src="js/controllers/Controller.js"></script>
	<script type="text/javascript" src="js/controllers/CTable.js"></script>
	<script type="text/javascript" src="js/controllers/CLink.js"></script>
	<script type="text/javascript" src="js/controllers/CDownload.js"></script>
	<script type="text/javascript" src="js/controllers/CImage.js"></script>

	<!-- Adapters -->
	<script type="text/javascript" src="js/adapters/EditorAdapter.js"></script>
	<script type="text/javascript" src="js/adapters/CKEditor/CKEditorAdapter.js"></script>

	<!-- configuration file -->
	<script type="text/javascript" src="settings/general_config.js"></script>

	<!-- event handlers -->
	<script type="text/javascript" src="js/eventHandlers/EHToolbar.js"></script>

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
			echo '<div id="marker">Test Mode</div>';
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
		<a href="www.test.com">link</a>
	</div>
	<div contentEditable="true" class="editor">type here</div>
	<?php
		$fileName = '.git/index';
		if (file_exists($fileName)){
			echo '<div id="versionInfo">Ultimo aggiornamento: ' . date("d/m/Y H:i:s", filemtime('.git/index')) . '</div>';
		}
	?>
	<div>Current version: 0.1.0 (as by December 1, 2014)</div>
</body>
</html>