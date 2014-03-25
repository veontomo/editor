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
			<h2>L&rsquo;utilit&agrave; dei contenuti senza senso</h2>

			<p>I testi <a href="http://www.test.com">casuali</a> sono utilizzati, inoltre, per mostrare e confrontare l&rsquo;aspetto dei caratteri tipografici e dei layout. Di norma si tratta di testi senza contenuto semantico. In virt&ugrave; della sua ampia funzione di testo riempitivo per layout, la non leggibilit&agrave; del testo &egrave; un elemento di grande importanza: la percezione umana, infatti, &egrave; portata a riconoscere determinati modelli e ripetizioni nel testo. La distribuzione arbitraria delle lettere e della lunghezza delle&nbsp;<br />
			<br />
			<img alt="Mare" height="128" src="https://cdn1.iconfinder.com/data/icons/sphericalcons/128/ship.png" style="border-style: none; padding: 0px; margin: 0px; width: 128px; height: 128px" title="Mare" width="128" /></p>
			&quot;parole&quot;, invece, non distrae l&rsquo;occhio che, in questo modo, pu&ograve; focalizzare e giudicare l&rsquo;effetto grafico e la leggibilit&agrave; dei caratteri tipografici (tipografia) e la distribuzione del testo nella pagina (layout o luce di composizione). Per questo motivo i testi casuali sono costituiti per lo pi&ugrave; da una sequenza pi&ugrave; o meno arbitraria di parole o sillabe. I modelli ripetitivi non rischiano di confondere l&rsquo;impressione generale e consentono di confrontare meglio tra loro i diversi caratteri tipografici. D&rsquo;altra parte il fatto che un testo casuale appaia realistico rappresenta un vantaggio, affinch&eacute; l&rsquo;effetto dei layout della futura pubblicazione non sia compromesso.<br />
			&nbsp;
		</textarea>
	</div>

</body>
</html>