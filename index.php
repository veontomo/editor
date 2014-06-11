<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/adapters/jquery.js"></script>
	<script type="text/javascript" src="js/start.js"></script>

	<script type="text/javascript" src="js/classes/Helper.js"></script>
	<script type="text/javascript" src="js/classes/Helper/unit.js"></script>
	<script type="text/javascript" src="js/classes/Properties.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Attributes.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Attributes/TableAttributes.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Attributes/LinkAttributes.js"></script>

	<script type="text/javascript" src="js/classes/Properties/Styles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/TableStyles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/LinkStyles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/TableRowStyles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/TableCellStyles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/ImageStyles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/ListStyles.js"></script>
	<script type="text/javascript" src="js/classes/Properties/Styles/ListItemStyles.js"></script>

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

	<script type="text/javascript" src="js/classes/CKHelper.js"></script>
	<script type="text/javascript" src="js/classes/CKHelper/Selection.js"></script>
	<script type="text/javascript" src="js/classes/Helper/String.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Mapping.js"></script>
	<script type="text/javascript" src="js/classes/HtmlElements/Factory.js"></script>

	<script type="text/javascript" src="settings/general_config.js"></script>
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
		<a href="coverage.php" target="blank"><img src="images/coverage.png" width="100px" /></a>
    </div>

	<form method="post" action='#' method="post" enctype="multipart/form-data">
		<input type="file" id="fileInput" name="fileInput">
		<input type="submit" value="submit">
	</form>
	<div class="editor">
		<textarea name="editor" id="editor">
			<div id="content">
			<?php if(isset($fileContent)){
				echo $fileContent;
			}?>
				<table cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: none; padding: 0px; margin: 0px; width: 500px; max-width: 0px; min-width: 0px; border-spacing: 0px 0px" width="500">
					<tbody>
						<tr data-marker="Row" style="border-style: none; width: 500px; max-width: 500px; min-width: 500px; padding: 0px; margin: 0px">
							<td data-marker="Cell" style="border-style: none; width: 199px; max-width: 199px; min-width: 199px; margin: 0px; vertical-align: top; color: #000001; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px">cell0</td>
							<td data-marker="Cell" style="border-style: none; width: 299px; max-width: 299px; min-width: 299px; margin: 0px; vertical-align: top; color: #000001; padding-left: 0px; padding-right: 1px; padding-top: 0px; padding-bottom: 1px">cell1</td>
						</tr>
						<tr data-marker="Row" style="border-style: none; width: 500px; max-width: 500px; min-width: 500px; padding: 0px; margin: 0px">
							<td data-marker="Cell" style="border-style: none; width: 199px; max-width: 199px; min-width: 199px; margin: 0px; vertical-align: top; color: #000001; padding-left: 1px; padding-right: 0px; padding-top: 0px; padding-bottom: 1px">cell0</td>
							<td data-marker="Cell" style="border-style: none; width: 299px; max-width: 299px; min-width: 299px; margin: 0px; vertical-align: top; color: #000001; padding-left: 0px; padding-right: 1px; padding-top: 0px; padding-bottom: 1px">cell1</td>
						</tr>
					</tbody>
				</table>
			</div>
		</textarea>
	</div>
</body>
</html>