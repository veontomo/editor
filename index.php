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
		<table cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: none; padding: 0px; margin: 0px; width: 500px; max-width: 500px; min-width: 500px; border-spacing: 0px" width="500">
			<tbody>
				<tr data-marker="Row" style="border-style: none; width: 500px; max-width: 500px; min-width: 500px; padding: 0px; margin: 0px">
					<td data-marker="Cell" style="border-style: none; width: 99px; max-width: 99px; min-width: 99px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px">cell0</td>
					<td data-marker="Cell" style="border-style: none; width: 200px; max-width: 200px; min-width: 200px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px">cell1</td>
					<td data-marker="Cell" style="border-style: none; width: 199px; max-width: 199px; min-width: 199px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell2</td>
				</tr>
				<tr data-marker="Row" style="border-style: none; width: 500px; max-width: 500px; min-width: 500px; padding: 0px; margin: 0px">
					<td data-marker="Cell" style="border-style: none; width: 99px; max-width: 99px; min-width: 99px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px 1px">cell0</td>
					<td data-marker="Cell" style="border-style: none; width: 200px; max-width: 200px; min-width: 200px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 0px 1px">cell1</td>
					<td data-marker="Cell" style="border-style: none; width: 199px; max-width: 199px; min-width: 199px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 0px 1px 1px 0px">cell2</td>
				</tr>
			</tbody>
		</table>

		<table border="2" cellpadding="0" cellspacing="0" data-marker="Table" style="border-style: solid; padding: 0px; margin: 0px; width: 500px; max-width: 500px; min-width: 500px; border-spacing: 0px; border-width: 2px; border-color: rgb(0, 0, 0)" width="500">
			<tbody>
				<tr data-marker="Row" style="border-style: none; width: 496px; max-width: 496px; min-width: 496px; padding: 0px; margin: 0px">
					<td style="border-style: none; width: 490px; max-width: 490px; min-width: 490px; padding: 0px; margin: 0px; vertical-align: top; color: #000001; padding-left: 3px; padding-right: 3px; padding-top: 1px; padding-bottom: 2px">
					<table border="3" cellpadding="0" cellspacing="0" style="border-style: solid; padding: 0px; margin: 0px; width: 484px; max-width: 484px; min-width: 484px; border-spacing: 0px 0px; border-color: #000001; border-width: 3px" width="484">
						<tbody>
							<tr style="border-style: none; width: 478px; max-width: 478px; min-width: 478px; padding: 0px; margin: 0px">
								<td data-marker="Cell" style="border-style: none; width: 283px; max-width: 283px; min-width: 283px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 1px 0px 2px 4px">cell0</td>
								<td data-marker="Cell" style="border-style: none; width: 187px; max-width: 187px; min-width: 187px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 1px 4px 2px 0px">cell1</td>
							</tr>
						</tbody>
					</table>
					</td>
				</tr>
				<tr data-marker="Row" style="border-style: none; width: 496px; max-width: 496px; min-width: 496px; padding: 0px; margin: 0px">
					<td style="border-style: none; width: 490px; max-width: 490px; min-width: 490px; padding: 0px; margin: 0px; vertical-align: top; color: #000001; padding-left: 3px; padding-right: 3px; padding-top: 1px; padding-bottom: 2px">
					<table border="3" cellpadding="0" cellspacing="0" style="border-style: solid; padding: 0px; margin: 0px; width: 484px; max-width: 484px; min-width: 484px; border-spacing: 0px 0px; border-color: #000001; border-width: 3px" width="484">
						<tbody>
							<tr style="border-style: none; width: 478px; max-width: 478px; min-width: 478px; padding: 0px; margin: 0px">
								<td data-marker="Cell" style="border-style: none; width: 283px; max-width: 283px; min-width: 283px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 1px 0px 2px 4px">cell0</td>
								<td data-marker="Cell" style="border-style: none; width: 187px; max-width: 187px; min-width: 187px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 1px 4px 2px 0px">cell1</td>
							</tr>
						</tbody>
					</table>
					</td>
				</tr>
				<tr data-marker="Row" style="border-style: none; width: 496px; max-width: 496px; min-width: 496px; padding: 0px; margin: 0px">
					<td style="border-style: none; width: 490px; max-width: 490px; min-width: 490px; padding: 0px; margin: 0px; vertical-align: top; color: #000001; padding-left: 3px; padding-right: 3px; padding-top: 1px; padding-bottom: 2px">
					<table border="3" cellpadding="0" cellspacing="0" style="border-style: solid; padding: 0px; margin: 0px; width: 484px; max-width: 484px; min-width: 484px; border-spacing: 0px 0px; border-color: #000001; border-width: 3px" width="484">
						<tbody>
							<tr style="border-style: none; width: 478px; max-width: 478px; min-width: 478px; padding: 0px; margin: 0px">
								<td data-marker="Cell" style="border-style: none; width: 283px; max-width: 283px; min-width: 283px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 1px 0px 2px 4px">cell0</td>
								<td data-marker="Cell" style="border-style: none; width: 187px; max-width: 187px; min-width: 187px; margin: 0px; vertical-align: top; color: rgb(0, 0, 1); padding: 1px 4px 2px 0px">cell1</td>
							</tr>
						</tbody>
					</table>
					</td>
				</tr>
			</tbody>
		</table>
		&nbsp;

		<h1 class="firstHeading" id="firstHeading" lang="en"><span dir="auto">Fizz buzz</span></h1>

		<div id="siteSub">From Wikipedia, the free encyclopedia</div>

		<div id="contentSub">&nbsp;&nbsp;(Redirected from <a href="http://en.wikipedia.org/w/index.php?title=FizzBuzz&amp;redirect=no" title="FizzBuzz">FizzBuzz</a>)</div>

		<p><b>Fizz buzz</b> (also known as <b>bizz buzz</b>, or simply <b>buzz</b>) is a group word game for children to teach them about <a href="http://en.wikipedia.org/wiki/Division_%28mathematics%29" title="Division (mathematics)">division</a>.<sup class="reference" id="cite_ref-1"><a href="http://en.wikipedia.org/wiki/FizzBuzz#cite_note-1"><span>[</span>1<span>]</span></a></sup> Players take turns to count incrementally, replacing any number divisible by three with the word &quot;fizz&quot;, and any number divisible by five with the word &quot;buzz&quot;.</p>

		<p>&nbsp;</p>

		<div class="toc" id="toc">
		<div id="toctitle">
		<h2>Contents</h2>
		</div>

		<ul>
			<li class="toclevel-1 tocsection-1"><a href="http://en.wikipedia.org/wiki/FizzBuzz#Play"><span class="tocnumber">1</span> <span class="toctext">Play</span></a></li>
			<li class="toclevel-1 tocsection-2"><a href="http://en.wikipedia.org/wiki/FizzBuzz#Variations"><span class="tocnumber">2</span> <span class="toctext">Variations</span></a>
			<ul>
				<li class="toclevel-2 tocsection-3"><a href="http://en.wikipedia.org/wiki/FizzBuzz#Fizz_Buzz_Woof"><span class="tocnumber">2.1</span> <span class="toctext">Fizz Buzz Woof</span></a></li>
			</ul>
			</li>
			<li class="toclevel-1 tocsection-4"><a href="http://en.wikipedia.org/wiki/FizzBuzz#Other_uses"><span class="tocnumber">3</span> <span class="toctext">Other uses</span></a></li>
			<li class="toclevel-1 tocsection-5"><a href="http://en.wikipedia.org/wiki/FizzBuzz#References"><span class="tocnumber">4</span> <span class="toctext">References</span></a></li>
			<li class="toclevel-1 tocsection-6"><a href="http://en.wikipedia.org/wiki/FizzBuzz#External_links"><span class="tocnumber">5</span> <span class="toctext">External links</span></a></li>
		</ul>
		</div>
		</textarea>
	</div>
</body>
</html>