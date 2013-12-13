<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/adapters/jquery.js"></script>
	<script type="text/javascript" src="js/start.js"></script>
	<script type="text/javascript" src="js/helpers.js"></script>
	<script type="text/javascript" src="js/attributes.js"></script>
	<script type="text/javascript" src="js/settings.js"></script>
	<script>
		var tbl = new FramedTable();
		var tblAttr = new TableAttributes();
		tblAttr.setWidth(200);
		tbl.style = tblAttr;
		var row = new Row();
		var cell = new Cell();
		row.cells = [cell, cell, cell];
		tbl.row = row;
		tbl.rows = 2;

		console.log(tbl.toHtml());

		


	</script>

	<title>Creatore di newsletter</title>

	<?php
	require 'php/fileContent.php';
	if(isset($_FILES['fileInput']) && array_key_exists('error', $_FILES['fileInput']) && ($_FILES['fileInput']['error'] === 0)){
		$fileContent = fileContent(file_get_contents($_FILES['fileInput']['tmp_name']));

	}
	?>
</head>
<body>
	<article class="algorithm">
		<h1>
			Algoritmo
		</h1>
		La procedura preliminaria sarebbe questa:
		<ol>
			<li>
				Definiamo una costante <code>LARGHEZZA</code> per impostare la larghezza della newsletter. Inizializiamola con valore 500.
			</li>
			<li>
				Creiamo una tabella larga <code>LARGHEZZA</code> pixel che serve come contenitore per tutto ci&ograve; che segue. 
			</li>
			<li>
				Regole per tabelle:
				<ul>
					<li>
						Per intera tabella devono essere specificati gli attributi:
						<ol>
							<li><code>width, min-width, max-width</code>.<br> La larghezza della tabella deve essere uguale alla larghezza del suo parent.</li>
							<li><code>padding</code></li>
							<li><code>margin</code></li>
							<li><code>border-width, border-color, border-style</code></li>
							<li>border tra le celle deve essere impostato esplicitamente!</li>
							<li>gli spazi tra le celle devono essere impostate esplicitamente!</li>
							<li>il border deve essere usato per tutta tabella e non per le sue righe o celle.</li>
						</ol>

					</li>
					<li>
						Per le righe
						<ol>
							<li>
								Ogni riga della tabella deve avere l&#39;attributo <code>width, min-width, max-width</code> che deve essere uguale alla larghezza del suo parent.
							</li>
							<li>
								Ogni riga della tabella deve avere lo stesso numero delle celle.
							</li>
							<li>
								Il border deve essere resettato esplicitamente!
							</li>
						</ol>
					</li>
					<li>
						Per le celle:
						<ol>
							<li>
								Ogni cella della tabella deve avere l&#39;attributo <code>width, min-width, max-width</code>. La somma di larghezza delle celle
								deve essere uguale alla larghezza della riga parent.
							</li>
							<li>
								Il border deve essere resettato esplicitamente!
							</li>
							<li>
								<code>margin</code> e <code>padding</code> deve essere specificato esplicitamente!
							</li>
							<li>
								Ogni colonna della tabella deve avere le celle della stessa larghezza!
							</li>
						</ol>

					</li>
				</ul>
			</li>
			<li>
				Per immagini bisogna specificare:
				<ol>
					<li>
						attributi <code>width</code> e <code>height</code> che devono essere uguali alla larghezza e altezza dell&#39;immagine. 
					</li>
					<li>
						attributi <code>alt</code> e <code>title</code>.
					</li>
					<li>
						<code>margin</code> e <code>padding</code>
					</li>
				</ol>
			</li>
		</ol>
	<div class="template_logo"><a href="../newsletter_first_try/index.php#list"><img src="images/templates_icon.png" width="48px" height="48px">Andare ai template</a></div>
	</article>
	<form method="post" action='#' method="post" enctype="multipart/form-data">
		<input type="file" id="fileInput" name="fileInput">
		<input type="submit" value="submit">
	</form>
	<div class="editor">
		<textarea name="editor">
			<?php if(isset($fileContent)){
				echo $fileContent;
			}?>
	</textarea>
	</div>
</body>
</html>