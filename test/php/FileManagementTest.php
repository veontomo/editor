<?php
require_once (dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'FileManagement.php');
// require_once '..\\..\\php\\FileManagement.php';
class FileManagementTest extends PHPUnit_Framework_TestCase
{
    public function testFileNameRegular()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('test.html');
        $this->assertEquals($worker->getFileName(), 'test.html');
    }

    public function testFileNameWithDash()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('n-ame.html');
        $this->assertEquals($worker->getFileName(), 'n-ame.html');
    }

    public function testFileNameWithDigits()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('str1234.html');
        $this->assertEquals($worker->getFileName(), 'str1234.html');
    }

    public function testFileNameWithUppercase()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('nAme.html');
        $this->assertEquals($worker->getFileName(), 'nAme.html');
    }

    public function testFileNameWithIllegalExtension()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('str.exe');
        $this->assertEquals($worker->getFileName(), 'str.html');
    }

    public function testFileNameDefaultIfArray()
    {
    	$worker = new FileManagement();
    	$worker->setFileName([1,2,3]);
        $this->assertEquals($worker->getFileName(), 'template.html');
    }

    public function testFileNameWithSlash()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('/folder/file.html');
        $this->assertEquals($worker->getFileName(), 'file.html');
    }

    public function testFileNameWithAppendsExtension()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('/folder/file');
        $this->assertEquals($worker->getFileName(), 'file.html');
    }

    public function testFileNameOnlyExtension()
    {
    	$worker = new FileManagement();
    	$worker->setFileName('.exe');
        $this->assertEquals($worker->getFileName(), 'template.html');
    }

    public function testSanitizeContentRegular()
    {
    	$worker = new FileManagement();
    	$cntn = $worker->sanitizeContent('abcd');
    	$this->assertEquals($cntn, 'abcd');
    }

    public function testSanitizeContentWithApostrophe()
    {
    	$worker = new FileManagement();
    	$cntn = $worker->sanitizeContent('I\'m fine');
    	$this->assertEquals($cntn, 'I&#39;m fine');
    }

    public function testSanitizeContentWithAccentsLowerCase()
    {
    	$worker = new FileManagement();
    	$cntn = $worker->sanitizeContent('andrò città così è perché');
    	$this->assertEquals($cntn, 'andr&ograve; citt&agrave; cos&igrave; &egrave; perch&eacute;');
    }

    public function testSanitizeContentWithAccentsUpperCase()
    {
    	$worker = new FileManagement();
    	$cntn = $worker->sanitizeContent('ANDRÒ CITTÀ COSÌ È PERCHÉ');
    	$this->assertEquals($cntn, 'ANDR&Ograve; CITT&Agrave; COS&Igrave; &Egrave; PERCH&Eacute;');
    }



}