<?php
namespace editor\file;
require_once 'FileManagement.php';

$worker = new FileManagement();
$worker->setFileContent($worker->getContent($_POST, 'data'));
$worker->setFileName($worker->getContent($_POST, 'filename'));
$worker->save();
echo $worker->getFileName();
