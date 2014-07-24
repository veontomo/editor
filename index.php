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
			top: 3em;
			left: -2em;
			width: 10em;
			color: red;
			font-size: 1.3em;
			padding-left: 2em;
			-webkit-transform: rotate(-45deg);
			-webkit-transform-origin: 0% 0%;
			-o-transform: rotate(-45deg);
			-o-transform-origin:0% 0%;
			transform: rotate(-45deg);
			transform-origin: 0% 0%;
			color: #D22415;
			background-color: #3D7899}</style>';

	?>

 	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/adapters/jquery.js"></script>
	<script type="text/javascript" src="js/start.js"></script>

	<script type="text/javascript" src="js/classes/Helper.js"></script>
	<script type="text/javascript" src="js/classes/Helper/unit.js"></script>
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
	<script type="text/javascript" src="js/classes/HtmlElements/Dom.js"></script>

	<!-- converters -->
	<script type="text/javascript" src="js/converters/Converter.js"></script>
	<script type="text/javascript" src="js/converters/ConverterFixed.js"></script>
	<script type="text/javascript" src="js/converters/ConverterFluid.js"></script>

	<!-- helpers  -->
	<script type="text/javascript" src="js/classes/CKHelper.js"></script>
	<script type="text/javascript" src="js/classes/CKHelper/Selection.js"></script>
	<script type="text/javascript" src="js/classes/Helper/String.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Mapper.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Factory.js"></script>


	<!-- Controllers -->
	<script type="text/javascript" src="js/controllers/CTable.js"></script>
	<script type="text/javascript" src="js/controllers/CLink.js"></script>
	<script type="text/javascript" src="js/controllers/CDownload.js"></script>
	<script type="text/javascript" src="js/controllers/CImage.js"></script>


	<script type="text/javascript" src="settings/general_config.js"></script>

	<!-- external plugins -->
	<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<title><?= $title ?></title>
<?php
require 'php/fileContent.php';
if(isset($_FILES['fileInput']) && array_key_exists('error', $_FILES['fileInput']) && ($_FILES['fileInput']['error'] === 0)){
	$fileContent = fileContent(file_get_contents($_FILES['fileInput']['tmp_name']));
}
?>
</head>
<body>
    <div class="panel">
    	<?php
    		if ($developMode){
    			echo '<div id="marker">Test Mode</div>';
    		}
    	?>

	    <a href="apidocs/"><img src="images/yui-logo.png" width="100px"/>API</a>
    </div>
    <div class="panel">
      <a href="jasmine/"><img src="images/TDD.png" width="100px" /></a>
    </div>
    <div class="panel">
		<a href="coverage.php" target="blank"><img src="images/coverage.png" width="100px" /></a>
    </div>

	<form method="post" action='#' method="post" enctype="multipart/form-data">
		<input type="file" id="fileInput" name="fileInput">
		<input type="submit" value="submit">
	</form>
	<div class="editor">
		<textarea name="editor" id="editor">
			<?php if(isset($fileContent)){
				echo $fileContent;
			}?>
			<table cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: none; padding: 0px; margin: 0px; width: 500px; max-width: 500px; min-width: 500px; border-spacing: 0px 0px; font-size: 13px; text-align: justify; font-family: Arial, sans-serif;" width="500">
				<tbody>
					<tr data-marker="Row" style="border-style: none; width: 500px; max-width: 500px; min-width: 500px; padding: 0px; margin: 0px;" width="500">
						<td data-marker="Cell" style="border-style: none; width: 249px; max-width: 249px; min-width: 249px; margin: 0px; vertical-align: top; color: #000001; text-align: justify; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px;" width="249">cell0</td>
						<td data-marker="Cell" style="border-style: none; width: 249px; max-width: 249px; min-width: 249px; margin: 0px; vertical-align: top; color: #000001; text-align: justify; padding-left: 0px; padding-right: 1px; padding-top: 0px; padding-bottom: 1px;" width="249">cell1</td>
					</tr>
					<tr data-marker="Row" style="border-style: none; width: 500px; max-width: 500px; min-width: 500px; padding: 0px; margin: 0px;" width="500">
						<td data-marker="Cell" style="border-style: none; width: 249px; max-width: 249px; min-width: 249px; margin: 0px; vertical-align: top; color: #000001; text-align: justify; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px;" width="249">cell0</td>
						<td data-marker="Cell" style="border-style: none; width: 249px; max-width: 249px; min-width: 249px; margin: 0px; vertical-align: top; color: #000001; text-align: justify; padding-left: 0px; padding-right: 1px; padding-top: 0px; padding-bottom: 1px;" width="249">cell1</td>
					</tr>
				</tbody>
			</table>

		</textarea>
	</div>
	<?php
		$fileName = '.git/index';
		if (file_exists($fileName)){
			echo '<div id="versionInfo">Ultimo aggiornamento: ' . date("d/m/Y H:i:s", filemtime('.git/index')) . '</div>';
		}

	?>
	<div>Current version: 0.0.5 (as by July 1, 2014)</div>
</body>
</html>