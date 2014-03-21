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
<div>In una terra lontana, dietro le montagne <span style="color:red">Parole</span>, lontani dalle terre di Vocalia e Consonantia, vivono i testi casuali. <img src="https://cdn1.iconfinder.com/data/icons/free-game-icons/64/Tree.png" />
</div>
<p>Vivono isolati nella cittadina di Lettere, sulle coste del Semantico, un immenso oceano linguistico.</p>

<p>Un piccolo ruscello chiamato Devoto Oli attraversa quei luoghi, rifornendoli di tutte le regolalie di cui hanno bisogno.</p>

È una terra paradismatica, un paese della cuccagna in cui golose porzioni di proposizioni arrostite volano in bocca a chi le desideri. Non una volta i testi casuali sono stati dominati dall’onnipotente Interpunzione, una vita davvero non ortografica. Un giorno però accadde che la piccola riga di un testo.

<table border="2" cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: solid; margin: 0px; padding: 0px; width: 500px; max-width: 500px; min-width: 500px; border-spacing: 0px; border-width: 2px; border-color: rgb(0, 0, 0)" width="500">
	<tbody>
		<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 496px; max-width: 496px; min-width: 496px">
			<td data-marker="Cell" style="border-style: none; margin: 0px; width: 247px; max-width: 247px; min-width: 247px; vertical-align: top; color: #000001; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px">cell0</td>
			<td data-marker="Cell" style="border-style: none; margin: 0px; width: 247px; max-width: 247px; min-width: 247px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell1</td>
		</tr>
		<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 496px; max-width: 496px; min-width: 496px">
			<td data-marker="Cell" style="border-style: none; margin: 0px; width: 247px; max-width: 247px; min-width: 247px; vertical-align: top; color: #000001; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px">cell0</td>
			<td data-marker="Cell" style="border-style: none; margin: 0px; width: 247px; max-width: 247px; min-width: 247px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell1</td>
		</tr>
	</tbody>
</table>

	</textarea>
	</div>

</body>
</html>