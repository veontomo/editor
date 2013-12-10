<?php
 /**
 * Gets an html file content and returns its body tag content with all html tags, attributes, classes etc.
 * @param $fileContent String 	file content
 * @return 	String 		<body> content of the file 
 */
 function fileContent($fileContent){
 	$doc = new DOMDocument;
 	try {
 		libxml_use_internal_errors(true);
	 	$doc->loadHtml($fileContent, LIBXML_NONET);
		$docElem = $doc->documentElement;
	 	$bodyNode = $docElem->getElementsByTagName('body')->item(0);
	 	$content = $doc->saveHTML($bodyNode);
	 	
	 	$output = preg_replace("/<\/?body>/", "", $content);
 		
 	} catch (Exception $e) {
 		$output = $e->getMessage();
 	}
 	return $output;
}



?>