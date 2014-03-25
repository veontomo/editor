<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/adapters/jquery.js"></script>
	<script type="text/javascript" src="js/start.js"></script>

	<script type="text/javascript" src="js/classes/helpers.js"></script>
	<script type="text/javascript" src="js/classes/unit.js"></script>
	<script type="text/javascript" src="js/classes/property.js"></script>
	<script type="text/javascript" src="js/classes/attributes.js"></script>
	<script type="text/javascript" src="js/classes/style.js"></script>
	<script type="text/javascript" src="js/classes/content.js"></script>
	<script type="text/javascript" src="js/classes/tag.js"></script>
	<script type="text/javascript" src="js/classes/table.js"></script>
	<script type="text/javascript" src="js/classes/cell.js"></script>
	<script type="text/javascript" src="js/classes/row.js"></script>
	<script type="text/javascript" src="js/classes/listItem.js"></script>
	<script type="text/javascript" src="js/classes/list.js"></script>
	<script type="text/javascript" src="js/classes/link.js"></script>
	<script type="text/javascript" src="js/classes/selection.js"></script>
	<script type="text/javascript" src="js/classes/string.js"></script>

	<script type="text/javascript" src="settings/general_config.js"></script>
	<script type="text/javascript" src="js/classes/CKHelper.js"></script>
	<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

	<title>Creatore di newsletter</title>
<?php
require 'php/fileContent.php';
if(isset($_FILES['fileInput']) && array_key_exists('error', $_FILES['fileInput']) && ($_FILES['fileInput']['error'] === 0)){
	$fileContent = fileContent(file_get_contents($_FILES['fileInput']['tmp_name']));
}
?>
</head>
<body>
    <div class="panel">
      <a href="apidocs/"><img src="images/yui-logo.png" width="100px"/>API</a>
    </div>
    <div class="panel">
      <a href="jasmine/"><img src="images/TDD.png" width="100px" /></a>
    </div>
    <div class="panel">
      <img src="images/coverage.png" width="100px" />
      <a href="test/coverage/Firefox 27.0.0 (Windows)/index.html">Firefox </a>
      <a href="test/coverage/Chrome 33.0.1750 (Windows)/index.html">Chrome</a>
      <a href="test/coverage/IE 11.0.0 (Windows)/index.html">IE</a>
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
			Testo di prova
		</textarea>
	</div>

</body>
</html>