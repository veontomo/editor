<?php
require_once (dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'FileManagement.php');
// require_once '..\\..\\php\\FileManagement.php';
class FileManagementTest extends PHPUnit_Framework_TestCase
{
    protected $worker;
    public function setUp(){
        $this->worker = new FileManagement();
    }

    public function testFileNameRegular()
    {
        // $worker = new FileManagement();
    	$this->worker->setFileName('test.html');
        $this->assertEquals($this->worker->getFileName(), 'test.html');
    }

    public function testFileNameWithDash()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('n-ame.html');
        $this->assertEquals($this->worker->getFileName(), 'n-ame.html');
    }

    public function testFileNameWithDigits()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('str1234.html');
        $this->assertEquals($this->worker->getFileName(), 'str1234.html');
    }

    public function testFileNameWithUppercase()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('nAme.html');
        $this->assertEquals($this->worker->getFileName(), 'nAme.html');
    }

    public function testFileNameWithIllegalExtension()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('str.exe');
        $this->assertEquals($this->worker->getFileName(), 'str.html');
    }

    public function testFileNameDefaultIfArray()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName([1,2,3]);
        $this->assertEquals($this->worker->getFileName(), 'template.html');
    }

    public function testFileNameWithSlash()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('/folder/file.html');
        $this->assertEquals($this->worker->getFileName(), 'file.html');
    }

    public function testFileNameWithAppendsExtension()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('/folder/file');
        $this->assertEquals($this->worker->getFileName(), 'file.html');
    }

    public function testFileNameOnlyExtension()
    {
    	// $worker = new FileManagement();
    	$this->worker->setFileName('.exe');
        $this->assertEquals($this->worker->getFileName(), 'template.html');
    }

    public function testSanitizeContentRegular()
    {
    	// $worker = new FileManagement();
    	$cntn = $this->worker->sanitizeContent('abcd');
    	$this->assertEquals($cntn, 'abcd');
    }

    public function testSanitizeContentWithApostrophe()
    {
    	// $worker = new FileManagement();
    	$cntn = $this->worker->sanitizeContent('I\'m fine');
    	$this->assertEquals($cntn, 'I&#39;m fine');
    }

    public function testSanitizeContentWithAccentsLowerCase()
    {
    	// $worker = new FileManagement();
    	$cntn = $this->worker->sanitizeContent('andrò città così è perché');
    	$this->assertEquals($cntn, 'andr&ograve; citt&agrave; cos&igrave; &egrave; perch&eacute;');
    }

    public function testSanitizeContentWithAccentsUpperCase()
    {
    	// $worker = new FileManagement();
    	$cntn = $this->worker->sanitizeContent('ANDRÒ CITTÀ COSÌ È PERCHÉ');
    	$this->assertEquals($cntn, 'ANDR&Ograve; CITT&Agrave; COS&Igrave; &Egrave; PERCH&Eacute;');
    }

    public function testGetContentNotAHash()
    {
        $worker = $this->getMock('FileManagement', ['addToLog']);
        $worker->expects($this->once())
            ->method('addToLog')
            ->with($this->equalTo('An array with string-valued key is expected'));

        $worker->getContent('a string', 'abc');
    }


    public function testGetContentEmptyHash()
    {
        $worker = $this->getMock('FileManagement', ['addToLog']);
        $worker->expects($this->once())
            ->method('addToLog')
            ->with($this->equalTo('key abc is not found'));
        $worker->getContent([], 'abc');
    }


    public function testGetContentFirstKey()
    {
        $arr = ['a' => 'a value', 'b' => 'b value'];
        $this->assertEquals($this->worker->getContent($arr, 'a'), 'a value');
    }

    public function testGetContentLastKey()
    {
        $arr = ['a' => 'a value', 'b' => 'b value', 'c' => 'c value'];
        $this->assertEquals($this->worker->getContent($arr, 'c'), 'c value');
    }

    public function testGetContentMiddleKey()
    {
        $arr = ['a' => 'a value', 'b' => 'b value', 'c' => 'c value'];
        $this->assertEquals($this->worker->getContent($arr, 'b'), 'b value');
    }



}