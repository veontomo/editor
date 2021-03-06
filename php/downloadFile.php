<?php
/**
 * Launches download window that gives possibility to download previously saved data.
 * @author    a.shcherbakov@ritoll.it
 * @version   0.0.1
 */

namespace editor\file;
require_once 'FileManagement.php';

$worker = new FileManagement();
$worker->initializeId();
$worker->setFileName($worker->getContent($_GET, 'filename'));
$worker->sendFileContentForSaving();
exit();
