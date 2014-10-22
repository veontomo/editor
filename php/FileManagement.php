<?php

/**
 * A class to deal with saving/reading file and sanitizing its content.
 * @version 0.0.1
 * @author  a.shcherbakov@ritoll.it
 * @method {string} sanitizeContent(string)
 */
class FileManagement{

	/**
	 * Name of the log file into which error messages are to be written.
	 * @var      string
	 * @since    0.0.1
	 */
	private static $_logFileName = 'error-messages.log';


	/**
	 * Maximal length of the error to be written into the log file. Longer messages are
	 * cropped.
	 * @var integer
	 */
	private static $_errorMaxLength = 100;

	/**
	 * Name of directory where all files are to be saved. Finishes with directory separator.
	 * @var string
	 */
	private static $_repoDir;


	/**
	 * Name under which the file is to be saved.
	 * @var string
	 */
	private $_fileName;

	/**
	 * Default file name. $_fileName setter will use this name if required file name
	 * turns out illegal.
	 * @var string
	 */
	private static $_defaultFileName = 'template.html';


	/**
	 * Array of allowed extensions with which the file can be saved.
	 * @var array
	 */
	private static $_allowedExt = ['html'];


	/**
	 * Constructor.
	 */
	public function __construct(){
		self::$_repoDir = 'repo' . DIRECTORY_SEPARATOR;
		$this->fileName = self::$_defaultFileName;
	}


	/**
	 * Setter for $_fileName. All suspiciuos symbols (anything different from latin letters, digits, dash and
	 * underline) are to be removed from $name in such a way that after all $_fileName must be a name of a
	 * file inside $_repoDir folder.
	 * @param string    $name
	 */
	public function setFileName($name){
		try {
			$fileInfo = pathinfo($name);
			$fileName = $fileInfo['filename'];
			$fileNameSan = preg_replace('/[^a-zA-z0-9-_]+/', '', $fileName); // removing non-allowed characters
			if ($fileNameSan == ''){
				$this->_fileName = self::$_defaultFileName;
				return;
			}

			$ext = 'extension';
			$fileExt = array_key_exists($ext, $fileInfo) &&
				in_array($fileInfo[$ext], self::$_allowedExt) ? $fileInfo[$ext] : self::$_allowedExt[0];

			$this->_fileName = $fileNameSan . '.' . $fileExt;
		} catch (Exception $e){
			$this->_fileName = self::$_defaultFileName;
			self::addToLog($e->getMessage());
		}
	}

	/**
	 * $_fileName getter.
	 * @return string
	 */
	public function getFileName(){
		return $this->_fileName;
	}

	/**
	 * Escapes special characters from $content.
	 * @param  String    $content
	 * @return String
	 */
	public function sanitizeContent($content){
		$replacement = [
			'à' => '&agrave;',
			'è' => '&egrave;',
			'ì' => '&igrave;',
			'ù' => '&ugrave;',
			'ò' => '&ograve;',
			'À' => '&Agrave;',
			'È' => '&Egrave;',
			'Ì' => '&Igrave;',
			'Ò' => '&Ograve;',
			'Ù' => '&Ugrave;',
			'é' => '&eacute;',
			'É' => '&Eacute;',
			'\'' => '&#39;'
		];
		$result = $content;
		foreach ($replacement as $key => $value){
			$result = str_replace($key, $value, $result);
		}
		return $result;
	}

	/**
	 * Appends properly formatted $msg to the log file.
	 * @property string $msg
	 * @return void
	 */
	public function addToLog($msg){
		try {
			$content = is_string($msg) ? $msg : 'a non-string is passed to the log saver';
			$record = date('Y/m/d H:i:s ', time()) . substr($content, 0, self::$_errorMaxLength) . PHP_EOL;
			$handler = fopen(self::$_logFileName, 'a');
			fwrite($handler, $record);
			fclose($handler);
		} catch (Exception $e){
			// there is no possibility to leave track of the error
		}
	}

	/**
	 * Returns value associated with key $needle inside $hash.
	 * If fails, a record is added into a log file.
	 *
	 * @param  array   $hash      associative array
	 * @param  string  $needle    name of the key whose value is to be found in $hash
	 * @return string|void
	 */
	public function getContent($hash, $needle){
		if (!is_array($hash) || !is_string($needle)){
			$this->addToLog('An array with string-valued key is expected');
			return;
		}
		if (!array_key_exists($needle, $hash)){
			$this->addToLog("key $needle is not found");
			return;
		}
		return $hash[$needle];
	}

	/**
	 * Decipher string $content which is a json-encoded object. Returns associative array with string-valued
	 * key "data" that contains data to be saved into a file whose name is given by key "filename".
	 *
	 * @param    string     $content    a json-encoded object
	 * @return   array|void
	 */
	public function decifer($content){
		if (!is_string($content)){
			return;
		}
		$result = json_decode($content);
		if (array_key_exists('data', $result) && array_key_exists('filename', $result)){
			return $result;
		}
		self::$addToLog('Failed to find key "data" and/or "filename"');
	}


	/**
	 * Saves $content with name stored in $_fileName inside $_repoDir folder.
	 *
	 * Returns true in case of success, false otherwise.
	 * @param  string  $content
	 * @return boolean
	 */
	public function save($content){
		try {
			$fullPath = self::$_repoDir.$this->getFileName();
			// remove old file (if any)
			if(file_exists($fullPath)){
				unlink($fullPath);
			}
			// write the content into a fresh file
			file_put_contents($fullPath, $this->sanitizeContent($content));
			return true;
		} catch (Exception $e){
			self::$addToLog($e->getMessage());
			return false;
		}
	}


}