<?php
 /**
 * Gets an html file content and returns its body tag content with all html tags, attributes, classes etc.
 * @param $fileContent String 	file content
 * @return 	String 		<body> content of the file 
 */
 function fileContent($fileContent){
 	$doc = new DOMDocument;
 	$doc->loadHtml($fileContent, LIBXML_NONET);
	$docElem = $doc->documentElement;
 	$bodyNode = $docElem->getElementsByTagName('body')->item(0);
//	$output = $bodyNode->ownerDocument;
 	
 	$content = $doc->saveHTML($bodyNode);
 	return preg_replace("/<\/?body>/", "", $content);
}



?>