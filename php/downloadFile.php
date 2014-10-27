<?php
require_once 'FileManagement.php';

$worker = new FileManagement();
$worker->initializeId();
$worker->setFileName($worker->getContent($_GET, 'filename'));
$worker->sendFileContentForSaving();
exit();


/**
* Gets a string as a file name and and prepares it for download from the "repo" directory.
*
* @package Editor
* @author  A.Shcherbakov  <a.shcherbakov@ritoll.it>
*/
if (isset($_GET['filename'])) {
    $fileNameSanitize = preg_replace(
        "/(\.){2,}[,;\\ \/]*/",
        "\1",
        htmlspecialchars($_GET['filename'])
    );
    $filePath = 'repo'.DIRECTORY_SEPARATOR.$fileNameSanitize;

    if (file_exists($filePath)) {
        // the order of the below line is VERY important!!!
        header("Content-Type: application/octet-stream");
        header("Content-Transfer-Encoding: Binary");
        header("Content-disposition: attachment; filename=\"$fileNameSanitize\"");
        readfile($filePath);
    }

}
?>