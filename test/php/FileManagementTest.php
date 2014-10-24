<?php
require_once (dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'FileManagement.php');
// namespace org\bovigo\vfs\example;
// use org\bovigo\vfs\vfsStream,
//     org\bovigo\vfs\vfsStreamDirectory;

class FileManagementTest extends PHPUnit_Framework_TestCase
{
    protected $worker;

    public function setUp(){
        $this->worker = new FileManagement();
    }

    public function testDropIllegalSymbolsNull()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols(), '');
    }

    public function testDropIllegalSymbolsEmpty()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols(''), '');
    }


    public function testDropIllegalSymbolsRegular()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('test.html'), 'test.html');
    }

    public function testDropIllegalSymbolsWithDash()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('n-ame.html'), 'n-ame.html');
    }

    public function testDropIllegalSymbolsWithDigits()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('str1234.html'), 'str1234.html');
    }

    public function testDropIllegalSymbolsWithUppercase()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('nAme.html'), 'nAme.html');
    }

    public function testDropIllegalSymbolsWithExtension()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('str.exe'), 'str.exe');
    }

    public function testDropIllegalSymbolsDefaultIfArray()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols([1, 2, 3]), '');
    }

    public function testDropIllegalSymbolsWithSlash()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('/folder/file.html'), 'folderfile.html');
    }

    public function testDropIllegalSymbolsWithAppendsExtension()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('/folder/file'), 'folderfile');
    }

    public function testDropIllegalSymbolsOnlyExtension()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('.exe'), 'exe');
    }

    public function testDropIllegalSymbolsJustDot()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('.'), '');
    }

    public function testDropIllegalSymbolsUpperDir()
    {
        $this->assertEquals($this->worker->dropIllegalSymbols('/../../parentfolder'), 'parentfolder');
    }



    public function testSanitizeContentRegular()
    {
    	$this->assertEquals($this->worker->sanitizeContent('abcd'), 'abcd');
    }

    public function testSanitizeContentWithApostrophe()
    {
    	$cntn = $this->worker->sanitizeContent('I\'m fine');
    	$this->assertEquals($cntn, 'I&#39;m fine');
    }

    public function testSanitizeContentWithAccentsLowerCase()
    {
    	$cntn = $this->worker->sanitizeContent('andrò città così è perché');
    	$this->assertEquals($cntn, 'andr&ograve; citt&agrave; cos&igrave; &egrave; perch&eacute;');
    }

    public function testSanitizeContentWithAccentsUpperCase()
    {
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

    public function testDecipherEmptyString()
    {
        $str = json_encode([]);
        $arr = $this->worker->decipher($str);
        $this->assertEquals(0, count($arr));
    }

    public function testDecipherSingleKey()
    {
        $str = json_encode(['data' => 'Hello World!']);
        $arr = $this->worker->decipher($str);
        $this->assertEquals(1, count($arr));
        $this->assertEquals('Hello World!', $arr['data']);
    }

    public function testDecipherAllKeys()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str);
        $this->assertEquals(3, count($arr));
        $this->assertEquals('Hello World!', $arr['data']);
        $this->assertEquals(1980, $arr['year']);
        $this->assertEquals('Chicago', $arr['place']);
    }

    public function testDecipherIfKeyIsAStringNotPresent()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str, 'no such key');
        $this->assertEquals(0, count($arr));
    }

    public function testDecipherIfKeyIsAString()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str, 'place');
        $this->assertEquals(1, count($arr));
        $this->assertEquals('Chicago', $arr['place']);
    }

    public function testDecipherIfKeyIsArray()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str, ['place', 'year']);
        $this->assertEquals(2, count($arr));
        $this->assertEquals('Chicago', $arr['place']);
        $this->assertEquals(1980, $arr['year']);
    }

    public function testDecipherIfKeyIsArrayNotPresent()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str, ['location', 'month']);
        $this->assertEquals(0, count($arr));
    }

    public function testDecipherIfKeyIsArraySomeNotPresent()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str, ['place', 'month']);
        $this->assertEquals(1, count($arr));
        $this->assertEquals('Chicago', $arr['place']);
    }

    public function testDecipherIfKeyIsEmptyArray()
    {
        $str = json_encode(['data' => 'Hello World!', 'year' => 1980, 'place' => 'Chicago']);
        $arr = $this->worker->decipher($str, []);
        $this->assertEquals(0, count($arr));
    }

    public function testGetIdNonEmptyString()
    {
        // checking for N times that id is always a non-empty string.
        // Once it fails, the counter $falseSignals is increased.
        // It is expected no $falseSignals.
        $falseSignals = 0;
        $N = 200;
        for ($i = 0; $i < $N; $i++){
            $w = new FileManagement();
            $id = $w->getId();
            if (!(is_string($id) && strlen($id) > 0)){
                $counter++;
            }
        }
        $this->assertEquals(0, $falseSignals);
    }

    public function testGetIdTheSameForTheInstance()
    {
        $id1 = $this->worker->getId();
        $id2 = $this->worker->getId();
        $this->assertEquals($id1, $id2);
    }

    public function testGetIdDifferentForDifferentInstances()
    {
        // checking that for $N instances of FileManagement, the $id of
        // each instance is different from ids of the others.
        $ids = [];
        $N = 1000;
        for ($i = 0; $i < $N; $i++){
            $w = new FileManagement();
            $id = $w->getId();
            if (array_key_exists($id, $ids)){
                $this->fail('Duplicate id is found!');
            }
            $ids[$id] = true; // Only key is important. The value is irrelevant.
        }
        $this->assertTrue(true);
    }

    /**
     * Creating temporary directories in order to preform tests
     * @return void
     */
    private function _createTmpDir(){
        mkdir('testDirTmp');
        mkdir('testDirTmp' . DIRECTORY_SEPARATOR . 'repoTmp');
    }

    /**
     * Clean up: removing temporary directories
     * @return void
     */
    private function _deleteTmpDir(){
        rmdir('testDirTmp' . DIRECTORY_SEPARATOR . 'repoTmp');
        rmdir('testDirTmp' );
    }

    // creates a folder for user files if that folder does not exist
    public function testInitializeWorkDirIfNotExists()
    {
        $ds = DIRECTORY_SEPARATOR;
        $worker = $this->getMock('FileManagement', ['getRepoDir', 'getId']);
        $worker->method('getRepoDir')
            ->willReturn('testDirTmp ' . $ds . 'repoTmp' . $ds);
        $worker->method('getId')
            ->willReturn('currentClientFolder');

        $this->_createTmpDir();


        $worker->initializeWorkDir();
        $this->assertTrue(file_exists('testDirTmp' . $ds . 'repoTmp' . $ds . 'currentClientFolder'));

        rmdir('testDirTmp' . $ds . 'repoTmp' . $ds . 'currentClientFolder');
        $this->_deleteTmpDir();
   }

    // "creates" a folder for user files if it already exists
    public function testInitializeWorkDirIfExists()
    {
        $ds = DIRECTORY_SEPARATOR;
        $worker = $this->getMock('FileManagement', ['getRepoDir', 'getId']);
        $worker->method('getRepoDir')
            ->willReturn('testDirTmp ' . $ds . 'repoTmp' . $ds);
        $worker->method('getId')
            ->willReturn('currentClientFolder');

        $this->_createTmpDir();
        // creating a directory that later is asked to be re-created
        mkdir('testDirTmp' . $ds . 'repoTmp' . $ds . 'currentClientFolder');


        $worker->initializeWorkDir();
        $this->assertTrue(file_exists('testDirTmp' . $ds . 'repoTmp' . $ds . 'currentClientFolder'));

        rmdir('testDirTmp' . $ds . 'repoTmp' . $ds . 'currentClientFolder');
        $this->_deleteTmpDir();

   }


   // public function testCreateNestedDirsSingleWord()
   // {
   //     $dir = 'dirNotExists';
   //     if (is_dir($dir)){
   //         throw new Exception("Directory exists!", 1);
   //     }
   //     $this->worker->createNestedDirs($dir);
   //     $this->asertTrue(is_dir($dir));

   //     rmdir($dir);
   // }


    // public function testCreateNestedDirsSingleWord()
    // {
    //     $dir = 'dirNotExists';
    //     if (is_dir($dir)){
    //         throw new Exception("Directory exists!", 1);
    //     }
    //     $this->worker->createNestedDirs($dir);
    //     $this->asertTrue(is_dir($dir));

    //     rmdir($dir);
    // }






}