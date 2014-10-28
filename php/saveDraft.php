<?php
/**
 * Saves the content and returns file name with which it is saved.
 *
 * At the moment of writing, it is intended that this script is given two pieces of
 * information:
 * * content, stored in $_POST['data']
 * * name of a file (stored in $_POST['filename']) under which the above content is
 *   to be saved.  This name is considered as a suggestion and is subject to validation.
 * Location of the file is up to FileManagement class logic. )
 *
 * @author    a.shcherbakov@ritoll.it
 * @version   0.0.1
 */
namespace editor\file;
require_once 'FileManagement.php';

$worker = new FileManagement();
$worker->setFileContent($worker->getContent($_POST, 'data'));
$worker->setFileName($worker->getContent($_POST, 'filename'));
$worker->save();
echo $worker->getFileName();
