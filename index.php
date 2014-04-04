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
	<script type="text/javascript" src="js/classes/plaintext.js"></script>
	<script type="text/javascript" src="js/classes/table.js"></script>
	<script type="text/javascript" src="js/classes/cell.js"></script>
	<script type="text/javascript" src="js/classes/row.js"></script>
	<script type="text/javascript" src="js/classes/listItem.js"></script>
	<script type="text/javascript" src="js/classes/list.js"></script>
	<script type="text/javascript" src="js/classes/ulist.js"></script>
	<script type="text/javascript" src="js/classes/olist.js"></script>
	<script type="text/javascript" src="js/classes/link.js"></script>
	<script type="text/javascript" src="js/classes/selection.js"></script>
	<script type="text/javascript" src="js/classes/string.js"></script>
	<script type="text/javascript" src="js/classes/registry.js"></script>
	<script type="text/javascript" src="js/classes/factory.js"></script>

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
			<table border="2" cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: solid; margin: 0px; padding: 0px; width: 500px; max-width: 500px; min-width: 500px; border-spacing: 0px; border-width: 2px; border-color: rgb(0, 0, 0)" width="500">
				<tbody>
					<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 496px; max-width: 496px; min-width: 496px">
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 98px; max-width: 98px; min-width: 98px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px">cell 0 0</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 198px; max-width: 198px; min-width: 198px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px">cell 0 1</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 197px; max-width: 197px; min-width: 197px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell 0 2</td>
					</tr>
					<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 496px; max-width: 496px; min-width: 496px">
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 98px; max-width: 98px; min-width: 98px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px">cell 1 0</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 198px; max-width: 198px; min-width: 198px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px">cell 1 1</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 197px; max-width: 197px; min-width: 197px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell 1 2</td>
					</tr>
					<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 496px; max-width: 496px; min-width: 496px">
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 98px; max-width: 98px; min-width: 98px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px">cell 2 0</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 198px; max-width: 198px; min-width: 198px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px">cell 2 1</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 197px; max-width: 197px; min-width: 197px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell 2 2</td>
					</tr>
				</tbody>
			</table>
			<br />
			<img alt="arriva l'onda!" height="64" src="https://cdn1.iconfinder.com/data/icons/computers/64/signal_Vista.png" style="border-style: none; padding: 0px; margin: 0px; width: 64px; height: 64px" title="arriva l'onda!" width="64" />
		</textarea>
	</div>
</body>
</html>