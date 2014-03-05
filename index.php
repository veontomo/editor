<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!--	<script type="text/javascript" src="JSON-js/json2.js"></script> -->
<!--	<script type="text/javascript" src="js/jquery-2.0.3.min.js"></script> -->
	<script type="text/javascript" src="js/jquery-1.10.2.js"></script>
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
	<script type="text/javascript" src="js/classes/string.js"></script>

	<script type="text/javascript" src="js/settings.js"></script>
	<script type="text/javascript" src="js/classes/CKHelper.js"></script>
	<script type="text/javascript" src="js/mathjax/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
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
		<div class="panel">
			<a href="apidocs/"><img src="images/yui-logo.png" width="100px"/>API</a>
		</div>
		<div class="panel">
			<a href="jasmine/"><img src="images/TDD.png" width="100px" /></a>
		</div>
		<div class="panel">
			<img src="images/coverage.png" width="100px" />
			<a href="test/coverage/Firefox 27.0.0 (Windows)/index.html">Firefox	</a>
			<a href="test/coverage/Chrome 33.0.1750 (Windows)/index.html">Chrome</a>
			<a href="test/coverage/IE 11.0.0 (Windows)/index.html">IE</a>
		</div>
		<h1>
			Preliminarie
		</h1>
		<ol>
			<li>
				Definiamo una costante <code>LARGHEZZA</code> per usarla come larghezza massima degli elementi nella newsletter.
			</li>
			<li>
				Per qualsiasi elemento vale questo formula per lo spazio disponibile:
				<script type="math/tex; mode=display">
					E_{width} = P_{width} - 2\, P_{border-width} - 2\, P_{padding} - 2\, E_{margin},
				</script>
				dove
				<script type="math/tex; mode=inline">
					E
				</script>
				&egrave; un elemento e
				<script type="math/tex; mode=inline">
					P
				</script>
				&egrave; il suo parent.
			</li>
			<li>
				Valore predefinito per il bordo &egrave; <code>border-style: none;</code>. Per impostare un bordo, si deve specificare attributi <code>border-width</code> e <code>border-color</code>.
				Quando invece si toglie il bordo, gli attributi <code>border-width</code> e <code>border-color</code> devono essere tolti e attributo <code>border-style</code> deve essere uguale a <code>none</code>.
 			</li>
		</ol>


		<h1>
			Algoritmo
		</h1>
		<ol>
			<li>
				Quando va inserita una tabella, bisogna seguire le instuzioni:
				<ul>
					<li>
						Larghezza della tabella deve essere uguale allo spazio disponibile dentro il suo elemento parent, ma non superiore a <code>LARGHEZZA</code>.
					</li>
					<li>
						Per intera tabella devono essere specificati gli attributi:
						<ol>
							<li><code>width, min-width, max-width</code>.<br></li>
							<li><code>padding</code></li>
							<li><code>margin</code></li>
							<li><code>border-width, border-color, border-style</code></li>
							<li><code>cellpadding="0"</code> e <code>cellspacing="0"</code></li>
							<li>il border deve essere usato per tutta tabella e non per le sue righe o celle.</li>
						</ol>
					</li>
					<li>
						Per le righe
						<ol>
							<li>
								Ogni riga della tabella deve avere gli attributi <code>width, min-width, max-width</code> che devono essere uguali tra di loro ed essere uguale allo spazio disponibile dentro il suo elemento parent.
							</li>
							<li>
								Ogni riga della tabella deve avere lo stesso numero delle celle. Gli attributi e gli stili di ogni riga devono essere uguali tra di loro.
							</li>
							<li>
								Il border deve essere resettato esplicitamente!
							</li>
							<li>
								Se si vuole uno spazio tra le righe, bisogna impostare gli attributi <code>padding-top</code> e <code>padding-bottom</code> con gli stessi valori per tutte le celle della riga.
							</li>
						</ol>
					</li>
					<li>
						Per le celle:
						<ol>
							<li>
								Ogni cella della tabella deve avere l&#39;attributo <code>width, min-width, max-width</code>. La somma di larghezze delle celle
								<script type="math/tex; mode=inline">
									C^{(i)}
								</script>
								deve essere uguale alla larghezza della riga
								<script type="math/tex; mode=inline">
									R
								</script>
								:
								<script type="math/tex; mode=display">
									\sum_{i=1}^{\#\, cells} C_{width}^{(i)} = R
								</script>
							</li>
							<li>
								Il border deve essere resettato esplicitamente: <code>border-width="0"</code>, <code>border-style="solid"</code>, <code>border-color="#000000"</code>.
							</li>
							<li>
								<code>margin</code> deve essere azzerato.
							</li>
							<li>
								<code>padding</code> deve essere specificato esplicitamente.
							</li>
							<li>
								Ogni colonna della tabella deve avere le celle della stessa larghezza!
							</li>
							<li>
								Se si vuole avere uno spazio tra le righe, bisogna impostare gli attributi <code>padding-top</code> e <code>padding-bottom</code> con gli stessi valori per tutte le celle della stessa riga.
							</li>
						</ol>

					</li>
				</ul>
			</li>
			<li>
				Quando va inserita un&#39;immagine, bisogna specificare:
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
			<li>
				Per i font: impostare <code>font-color</code>, <code>font-size</code>, <code>font-family</code>.
				<div class="NB">
					Gmail t   oglie l&#39;attributo <code>font-color</code> se il valore
				corrisponde a colore nero (<code>#000000</code>, <code>black</code> or <code>rgb(0, 0, 0)</code>). Quind&igrave; bisogna impostare un colore che sia molto simile a nero: per esempio, <code>#000001</code> o <code>rgb(0, 0, 1)</code>.
				</div>
			</li>
		</ol>
	<div class="template_logo"><a href="../newsletter_first_try/index.php#list"><img src="images/templates_icon.png" width="48px" height="48px">i template</a></div>

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
			<table border="1" cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: solid; margin: 0px; padding: 0px; width: 500px; max-width: 500px; min-width: 500px; border-spacing: 0px 0px; border-width: 1px; border-color: #000000" width="500">
				<tbody>
					<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 498px; max-width: 498px; min-width: 498px">
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 165px; max-width: 165px; min-width: 165px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px" width="165">cell 0 0</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 166px; max-width: 166px; min-width: 166px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px" width="166">cell 0 1</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 165px; max-width: 165px; min-width: 165px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px" width="165">cell 0 2</td>
					</tr>
					<tr data-marker="Row" style="border-style: none; margin: 0px; padding: 0px; width: 498px; max-width: 498px; min-width: 498px">
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 165px; max-width: 165px; min-width: 165px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px" width="165">cell 1 0</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 166px; max-width: 166px; min-width: 166px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px" width="166">cell 1 1</td>
						<td data-marker="Cell" style="border-style: none; margin: 0px; width: 165px; max-width: 165px; min-width: 165px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px" width="165">cell 1 2</td>
					</tr>
				</tbody>
			</table>

	</textarea>
	</div>
<!-- 	<img alt="torta" height="64" src="https://cdn0.iconfinder.com/data/icons/ie_yummy/64/cake_13.png" style="border-style: none;padding: 0px;margin: 0px;width: 64px;height: 64px;" title="torta" width="64" /> text between images
	<img alt="torta" height="64" src="https://cdn0.iconfinder.com/data/icons/ie_yummy/64/cake_13.png" style="border-style: none;padding: 0px;margin: 0px;width: 64px;height: 74px;" title="torta" width="74" />
 -->
</body>
</html>