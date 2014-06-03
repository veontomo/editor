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
			<?php if(isset($fileContent)){
				echo $fileContent;
			}?>
<a href="test.com">Slackware punta</a> alla qualit&agrave;, alla stabilit&agrave; e alla semplicit&agrave; e intende essere la distribuzione pi&ugrave; Unix-like, attenendosi agli standard, evitando di apportare <a href="www.aaa.com">modifiche</a> non necessarie al software incluso e non aggiungendo strumenti di configurazione supplementari, oltre a quelli previsti dai rispettivi autori. La configurazione e l&#39;amministrazione del sistema avvengono principalmente attraverso la modifica manuale dei file di configurazione, oppure grazie <img alt="yuidoc" height="52" src="http://yuilibrary.com/img/yui-logo.png" style="border-style: none; width: 117px; padding: 0px; margin: 0px; height: 52px" title="yuidoc" width="117" />ad alcuni script dotati di interfaccia semi-grafica o a riga di comando. Slackware fornisce un sistema operativo <a href="link-to-globe">text and image inside link <img alt="logo" height="128" src="http://www.lib.umn.edu/sites/default/files/images/earth_128.png" style="border-style: none; width: 128px; padding: 0px; margin: 0px; height: 128px" title="logo" width="128" /> continue</a> svariati window manager
</textarea>
	</div>
</body>
</html>