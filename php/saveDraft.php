<?php
/**
 * Saves the content and returns file name with which it is saved.
 *
 * At the moment of writing, it is intended that this script receives data that should be
 * saved as $_POST['data'].
 *
 * @author    a.shcherbakov@ritoll.it
 * @version   0.0.1
 */
namespace editor\file;
require_once 'FileManagement.php';

$worker = new FileManagement();
$worker->setFileContent($worker->getContent($_POST, 'data'));
return $worker->save();
