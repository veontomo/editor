<?php
namespace editor\file;
require_once 'FileManagement.php';

$worker = new FileManagement();
$worker->initializeId();
$worker->setFileName($worker->getContent($_GET, 'filename'));
$worker->sendFileContentForSaving();
exit();
