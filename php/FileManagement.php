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
	private static $_repoDir = 'php/repo/';

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
	 * A string used to identify requester.
	 * @var string
	 */
	private $_id;

	/**
	 * Array of allowed extensions with which the file can be saved.
	 * @var array
	 */
	private static $_allowedExt = ['html'];


	/**
	 * Constructor.
	 */
	public function __construct(){
		$this->_fileName = $this->getDefaultFileName();
		$this->initializeId();
	}

	/**
	 * $_defaultFileName  getter
	 * @return string
	 */
	public function getDefaultFileName(){
		return self::$_defaultFileName;
	}


	/**
	 * $_id getter.
	 * @return string
	 */
	public function getId(){
		return $this->_id;
	}

	/**
	 * $_id initializer. It is initialized based on session id.
	 */
	public function initializeId(){
		if (!isset($this->_id)){
			$this->_id = uniqid();
		}
	}

	/**
	 * Creates a folder (if not exists) where a temporary file should be saved.
	 * @return void
	 */
	public function initializeWorkDir(){
		try {
			$dirname = $this->getRepoDir() . $this->getId();
			$split = preg_split('/\|\\/', $dirname);
			$len = count($split);
			if (!file_exists($dirname)){
				mkdir($dirname);
			}
		} catch (Exception $e){
			$this->addToLog($e->getMessage());
		}
	}

	/**
	 * Creates directories indicated in $path. Takes into consideration of possible types of
	 * directory separators ('\' or '/').
	 * @param  string    $path     complete path. Examples: 'dir1', 'dir1/dir2/', 'dir1\dir2\dir3'
	 * @return void
	 */
	public function createNestedDirs($path){

	}

	/**
	 * Setter for $_fileName. Before setting the value, a validator is applied.
	 * @param string    $name
	 */
	public function setFileName($name = ''){
		$this->_fileName = $this->generateFileName($name);
	}

	/**
	 * $_fileName getter.
	 * @return string
	 */
	public function getFileName(){
		return $this->_fileName;
	}


	/**
	 * $_repoDir getter
	 * @return string
	 */
	public function getRepoDir(){
		return self::$_repoDir;
	}


	/**
	 * Removes all symbols different from a-z, A-Z, 0-9, dash, dot, underscore from $str.
	 * If after removal, there are trailing dots, they are to be removed.
	 * @param  string   $str
	 * @return string
	 */
	public function dropIllegalSymbols($str=''){
		if (!is_string($str)){
			$str = '';
		}
		return trim(preg_replace('/[^a-zA-z0-9-_\.]+/', '', $str), '.');
		// $fnKey = 'filename';
		// $extKey = 'extension';

		// $fileInfo = pathinfo($str);
		// $fileName = '';
		// if (array_key_exists($fnKey, $fileInfo)){
		// 	$fileName = preg_replace('/[^a-zA-z0-9-_]+/', '', $fileInfo[$fnKey]); // removing non-allowed characters
		// }
		// if ($fileName == ''){
		// 	return $this->generateFileName();
		// }

		// $fileExt = array_key_exists($extKey, $fileInfo) &&
		// 	in_array($fileInfo[$extKey], self::$_allowedExt) ? $fileInfo[$extKey] : self::$_allowedExt[0];

		// return $fileName . '.' . $fileExt;

	}

	/**
	 * Generates a string to be used as a name of a file.
	 * @param  string   $seed     a suggestion for the file name
	 * @return string
	 */
	public function generateFileName($seed){
		$fileName = $this->dropIllegalSymbols($seed);
		return $fileName == '' ? self::$_defaultFileName : $fileName;
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
	 * Decipher string $data which is a json-encoded object. Returns an associative array
	 * whose keys are given by optional parameter $keys. In case $key is not set,
	 * then the resulting array will contains all keys found in $data.
	 *
	 * @param    string              $data       a json-encoded object
	 * @param    array|string|null   $keys       an array of strings or a string corresponding to keys to be extracted from $data.
	 * @return   array|void
	 */
	public function decipher($data, $keys = null){
		if (is_string($keys)){
			$keys = [$keys];
		}
		// return empty array if $keys is different from null or non-empty array
		if (!(is_null($keys) || (is_array($keys) && count($keys) > 0))){
			return [];
		}
		$decode = json_decode($data, true);
		if (is_null($keys)){
			return $decode;
		}
		$result = [];
		foreach ($keys as $key) {
			if (array_key_exists($key, $decode)){
				$result[$key] = $decode[$key];
			}
		}
		return $result;
	}


	/**
	 * Saves $content with name stored in $_fileName inside $_repoDir folder.
	 *
	 * Returns true in case of success, false otherwise.
	 * @param  string  $content
	 * @return boolean
	 */
	public function saveContent($content){
		try {
			$fullPath = $this->getRepoDir() . $this->getId();
			$this->initializeWorkDir();
			// remove old file (if any)
			if(file_exists($fullPath)){
				unlink($fullPath);
			}
			// write the content into a fresh file
			file_put_contents($fullPath, $this->sanitizeContent($content));
			return true;
		} catch (Exception $e){
			$this->addToLog($e->getMessage());
			return false;
		}
	}


}