<?php
namespace editor\file;
require_once (dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'FileManagement.php');


class FileManagementTest extends \PHPUnit_Framework_TestCase
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
    	$this->worker->setFileContent('abcd');
    	$this->worker->sanitize();
    	$this->assertEquals($this->worker->getFileContent(), 'abcd');
    }

    public function testSanitizeContentWithApostrophe()
    {
    	$this->worker->setFileContent('I\'m fine');
    	$this->worker->sanitize();
    	$this->assertEquals($this->worker->getFileContent(), 'I&#039;m fine');
    }

    public function testSanitizeContentWithAccentsLowerCase()
    {
    	$this->worker->setFileContent('andrò città così è perché');
    	$this->worker->sanitize();
    	$this->assertEquals($this->worker->getFileContent(), 'andr&ograve; citt&agrave; cos&igrave; &egrave; perch&eacute;');
    }

    public function testSanitizeContentWithAccentsUpperCase()
    {
    	$this->worker->setFileContent('ANDRÒ CITTÀ COSÌ È PERCHÉ');
    	$this->worker->sanitize();
    	$this->assertEquals($this->worker->getFileContent(), 'ANDR&Ograve; CITT&Agrave; COS&Igrave; &Egrave; PERCH&Eacute;');
    }

    public function testSanitizeContentEuroSign()
    {
        $this->worker->setFileContent('price: 10€');
        $this->worker->sanitize();
        $this->assertEquals($this->worker->getFileContent(), 'price: 10&euro;');
    }

    public function testSanitizeContentAmpersand()
    {
        $this->worker->setFileContent('D & G');
        $this->worker->sanitize();
        $this->assertEquals($this->worker->getFileContent(), 'D &amp; G');
    }


    public function testSanitizeContentHtmlTag()
    {
        $this->worker->setFileContent('<div style="margin: 10px; padding: 20em;"> a o e à ò è é</div>');
        $this->worker->sanitize();
        $this->assertEquals($this->worker->getFileContent(), '<div style="margin: 10px; padding: 20em;"> a o e &agrave; &ograve; &egrave; &eacute;</div>');
    }

    public function testSanitizeContentLinkWithAmpersand()
    {
        $this->worker->setFileContent('<a href="http://www.test.com/?p=1&t=4">link</div>');
        $this->worker->sanitize();
        $this->assertEquals($this->worker->getFileContent(), '<a href="http://www.test.com/?p=1&t=4">link</div>');
    }


    public function testSetFileNameIfNull()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['validateFileName']);
        $worker->method('validateFileName')->willReturn('valid_file_name.ext');
        $worker->setFileName();
        $this->assertEquals($worker->getFileName(), 'valid_file_name.ext');
    }

    public function testSetFileNameIfEmpty()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['validateFileName']);
        $worker->method('validateFileName')->willReturn('default_file_name.ext');
        $worker->setFileName('whatever');
        $this->assertEquals($worker->getFileName(), 'default_file_name.ext');
    }

    public function testValidateFileNameIfNull()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['getDefaultFileName']);
        $worker->method('getDefaultFileName')->willReturn('default_file_name.ext');
        $this->assertEquals($worker->validateFileName(), 'default_file_name.ext');
    }

    public function testValidateFileNameIfEmpty()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['getDefaultFileName']);
        $worker->method('getDefaultFileName')->willReturn('default_file_name.ext');
        $this->assertEquals($worker->validateFileName(''), 'default_file_name.ext');
    }

    public function testValidateFileNameJustExtension()
    {
        $this->assertEquals($this->worker->validateFileName('.exe'), 'exe');
    }

    public function testValidateFileNameIfJustName()
    {
        $this->assertEquals($this->worker->validateFileName('name'), 'name');
    }

    public function testValidateFileNameIfNameAndExt()
    {
        $this->assertEquals($this->worker->validateFileName('name.abc'), 'name.abc');
    }

    public function testValidateFileNameIfJustMultiDots()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['getDefaultFileName']);
        $worker->method('getDefaultFileName')->willReturn('default_file_name.ext');
        $this->assertEquals($worker->validateFileName('.......'), 'default_file_name.ext');
    }

    public function testValidateFileNameIfSlashes()
    {
        $this->assertEquals($this->worker->validateFileName('/../abc'), 'abc');
    }

    public function testValidateFileNameIfLeadingDots()
    {
        $this->assertEquals($this->worker->validateFileName('..aaa'), 'aaa');
    }

    public function testValidateFileNameIfTrailingDots()
    {
        $this->assertEquals($this->worker->validateFileName('aa....'), 'aa');
    }








    public function testGetContentNotAHash()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['addToLog']);
        $worker->expects($this->once())
            ->method('addToLog')
            ->with($this->equalTo('An array with string-valued key is expected'));

        $worker->getContent('a string', 'abc');
    }


    public function testGetContentEmptyHash()
    {
        $worker = $this->getMock('\editor\file\FileManagement', ['addToLog']);
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



    public function testInitializeWorkDirIfNoRepoExists()
    {
         $dir = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests' . uniqid() . DIRECTORY_SEPARATOR;
         $this->assertFalse(is_dir($dir));
         $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId']);
         $worker->method('getRepoDir')->willReturn($dir);
         $worker->method('getId')->willReturn('dirXYZ');
         $worker->initializeWorkDir();
         $this->assertTrue(is_dir($dir . DIRECTORY_SEPARATOR . 'dirXYZ'));
         rmdir($dir . DIRECTORY_SEPARATOR . 'dirXYZ');
         rmdir($dir);
    }


   public function testInitializeWorkDirIfRepoExists()
   {
        $dir =  dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests' . uniqid() . DIRECTORY_SEPARATOR;
        mkdir($dir);
        $this->assertTrue(is_dir($dir));
        $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId']);
        $worker->method('getRepoDir')->willReturn($dir);
        $worker->method('getId')->willReturn('dirXYZ');
        $worker->initializeWorkDir();
        $this->assertTrue(is_dir($dir . DIRECTORY_SEPARATOR . 'dirXYZ'));
        rmdir($dir . DIRECTORY_SEPARATOR . 'dirXYZ');
        rmdir($dir);
   }

   public function testInitializeWorkDirIfRepoAndWorkDirsExist()
   {
        $dir =  dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests' . uniqid() . DIRECTORY_SEPARATOR;
        $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId']);
        $worker->method('getRepoDir')->willReturn($dir);
        $worker->method('getId')->willReturn('dirXYZ');
        mkdir($dir);
        mkdir($dir . DIRECTORY_SEPARATOR . 'dirXYZ');
        $this->assertTrue(is_dir($dir . DIRECTORY_SEPARATOR . 'dirXYZ'));
        $worker->initializeWorkDir();
        $this->assertTrue(is_dir($dir . DIRECTORY_SEPARATOR . 'dirXYZ'));
        rmdir($dir . DIRECTORY_SEPARATOR . 'dirXYZ');
        rmdir($dir);
   }

   public function testSaveNonEmpty()
   {
        // preparing
        $repo =  dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests2' . uniqid() . DIRECTORY_SEPARATOR;
        $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId' ,'getFileName', 'getFileContent']);
        $worker->method('getRepoDir')->willReturn($repo);
        $worker->method('getId')->willReturn('dirXYZ');
        $worker->method('getFileName')->willReturn('file.1');
        $worker->method('getFileContent')->willReturn('file content');
        // main part
        $this->assertTrue($worker->save());
        $this->assertEquals(file_get_contents($repo . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1'), 'file content');
        // clean up
        unlink($repo . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1');
        rmdir($repo . 'dirXYZ');
        rmdir($repo);
   }

   public function testSaveEmpty()
   {
        // preparing
        $repo =  dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests2' . uniqid() . DIRECTORY_SEPARATOR;
        $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId' ,'getFileName', 'getFileContent']);
        $worker->method('getRepoDir')->willReturn($repo);
        $worker->method('getId')->willReturn('dirXYZ');
        $worker->method('getFileContent')->willReturn(null);
        $worker->method('getFileName')->willReturn('file.1');
        // main part
        $this->assertTrue($worker->save());
        $this->assertEquals(file_get_contents($repo . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1'), '');
        // clean up
        unlink($repo . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1');
        rmdir($repo . 'dirXYZ');
        rmdir($repo);
   }

   public function testSaveIfAlreadyExists()
   {
        // preparing
        $repo =  dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests2' . uniqid() . DIRECTORY_SEPARATOR;
        $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId' ,'getFileName', 'getFileContent']);
        $worker->method('getRepoDir')->willReturn($repo);
        $worker->method('getId')->willReturn('dirXYZ');
        $worker->method('getFileContent')->willReturn('new content');
        $worker->method('getFileName')->willReturn('file.1');

        // creating file that must be overridden
        mkdir($repo);
        mkdir($repo . DIRECTORY_SEPARATOR . 'dirXYZ');
        file_put_contents($repo . DIRECTORY_SEPARATOR . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1', 'initial file content');


        // main part
        $this->assertTrue($worker->save());
        $this->assertEquals(file_get_contents($repo . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1'), 'new content');
        // clean up
        unlink($repo . 'dirXYZ' . DIRECTORY_SEPARATOR . 'file.1');
        rmdir($repo . 'dirXYZ');
        rmdir($repo);
   }

   public function testSaveSimulateException()
   {
        // preparing
        $repo =  dirname(__FILE__) . DIRECTORY_SEPARATOR . 'dirToMakeTests2' . uniqid() . DIRECTORY_SEPARATOR;
        $worker = $this->getMock('\editor\file\FileManagement', ['getRepoDir', 'getId' ,'getFileName', 'getFileContent', 'addToLog']);
        $worker->method('getRepoDir')->willReturn($repo);
        $worker->method('getId')->willReturn('dirXYZ');
        $worker->method('getFileContent')->willReturn(null);
        $worker->method('getFileName')->willReturn(null);
        $worker->expects($this->once())->method('addToLog');
        // main part
        $this->assertFalse($worker->save());

        // clean up
        rmdir($repo . 'dirXYZ');
        rmdir($repo);
   }


   public function testGetRepoDir()
   {
        $base = dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR;
        $this->assertEquals($this->worker->getRepoDir(), $base . 'repository' . DIRECTORY_SEPARATOR);
   }


   public function testAddToLogFileDoesNotExist()
   {
        // preparing file name
        $fileName = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'tempLogFile' . uniqid() . '.log';
        $worker = $this->getMock('\editor\file\FileManagement', ['getLogFileName']);
        $worker->method('getLogFileName')->willReturn($fileName);

        $worker->addToLog('just added log text from test env');
        $this->assertTrue(strpos(file_get_contents($fileName), 'just added log text from test env') !== false);

        // clean up
        unlink($fileName);
   }


   public function testAddToLogFileExists()
   {
        // preparing log file and filling it in
        $fileName = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'tempLogFile' . uniqid() . '.log';
        file_put_contents($fileName, "dumb content of the log file\r\n");
        $worker = $this->getMock('\editor\file\FileManagement', ['getLogFileName']);
        $worker->method('getLogFileName')->willReturn($fileName);
        $worker->addToLog('just added log text from test env qazwsx');

        $this->assertTrue(strpos(file_get_contents($fileName), 'just added log text from test env qazwsx') !== false);

        // clean up
        unlink($fileName);
   }

   public function testAddToLogArray()
   {
        // preparing log file and filling it in
        $fileName = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'tempLogFile' . uniqid() . '.log';
        $worker = $this->getMock('\editor\file\FileManagement', ['getLogFileName']);
        $worker->method('getLogFileName')->willReturn($fileName);
        $worker->addToLog([1, 2, 3]);

        $this->assertTrue(strpos(file_get_contents($fileName), 'a non-string is passed to the log saver') !== false);

        // clean up
        unlink($fileName);
   }

   public function testGetFullFileName()
   {
        $worker = $this->getMock('\editor\file\FileManagement', ['getFileName', 'getRepoDir', 'getId']);
        $worker->method('getFileName')->willReturn('log-file');
        $worker->method('getRepoDir')->willReturn('repository-of-the-app/');
        $worker->method('getId')->willReturn('id-of-this-resource');

        $this->assertEquals($worker->getFullFileName(), 'repository-of-the-app/id-of-this-resource' . DIRECTORY_SEPARATOR . 'log-file');

   }







}