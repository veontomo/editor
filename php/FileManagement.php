<?php
namespace editor\file;

/**
 * This file contains description of FileManagement class.
 */

/**
 * This class is aimed at storing and retrieving a content provided by
 * a user.
 *
 * This class saves a content provided by a user in a folder **A/B** where
 * **A** is a common folder for this class and **B** is a request-specific
 * (or, in other words, almost user-specific) folder. The name of the file
 * under which the content is saved in the above folder either with default
 * name or with a name suggested by the user (in this case it is subjected
 * to a validation).
 *
 * @version 0.0.1
 * @author  a.shcherbakov@ritoll.it
 */
class FileManagement{

	/**
	 * Name of the log file into which error messages are to be written.
	 * @var      string
	 * @since    0.0.1
	 */
	private static $_logFileName;


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
	 * String that is supposed to be saved in a file.
	 * @var string
	 */
	private $_content;

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
	 *
	 * * Sets [$_fileName](#property__fileName) to the default value.
	 * * Sets [$_repoDir](#property__repoDir) to be a folder named "repository" one level upper w.r.t. the current file.
	 * * Sets [$_logFileName](#property___logFileName) to be log file name.
	 * * Initializes [$_id](#property__id) for the current user/request.
	 */
	public function __construct(){
		$this->_fileName = $this->getDefaultFileName();
		self::$_repoDir = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'repository' . DIRECTORY_SEPARATOR;
		self::$_logFileName = self::$_repoDir . 'error-messages.log';
		$this->initializeId();
	}

	/**
	 * $_defaultFileName getter.
	 *
	 * [$_defaultFileName](#property__defaultFileName) getter.
	 * @return string
	 */
	public function getDefaultFileName(){
		return self::$_defaultFileName;
	}


	/**
	 * log file name getter.
	 *
	 * Returns [$_logFileName](#property__getFileName)
	 * @return string
	 */
	public function getLogFilename(){
		return self::$_logFileName;
	}


	/**
	 * $_id getter.
	 *
	 * [$_id](#property__id) getter.
	 * @return string
	 */
	public function getId(){
		return $this->_id;
	}

	/**
	 * Initialize identifier for user/request.
	 *
	 * It initializes [$_id](#property__id) in such a way that it is different for different users (or requests).
	 */
	public function initializeId(){
		if (!isset($this->_id)){
			if (php_sapi_name() === 'cli'){
				$this->_id = uniqid();
			} else {
				$isNewer = version_compare(phpversion(), '5.4.0', '>=');
				if ($isNewer &&  (session_status() === PHP_SESSION_NONE) || (!$isNewer && (session_id() === ''))) {
					session_start();
					$this->_id = session_id();
					session_destroy();
		       } else {
	       			$this->_id = session_id();
		       }
			}
		}
	}

	/**
	 * Creates a folder (if not exists) where a temporary file should be saved.
	 * For issues of security, the directories are created only inside $_repoDir folder.
	 * @return void
	 */
	public function initializeWorkDir(){
		try {
			$dirname = $this->getRepoDir();
			if (!is_dir($dirname)){
				mkdir($dirname);
			}
			$dirname .= $this->getId();
			if (!is_dir($dirname)){
				mkdir($dirname);
			}
		} catch (\Exception $e){
			$this->addToLog($e->getMessage());
		}
	}


	/**
	 * Setter for $_fileName. Before setting the value, a validator is applied.
	 * @param string    $name
	 */
	public function setFileName($name = ''){
		$this->_fileName = $this->validateFileName($name);
	}

	/**
	 * $_fileName getter.
	 * @return string
	 */
	public function getFileName(){
		return $this->_fileName;
	}

	/**
	 * Returns full path name of the content file.
	 * @return string
	 */
	public function getFullFileName(){
		return $this->getRepoDir() . $this->getId() . DIRECTORY_SEPARATOR . $this->getFileName();
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
	}

	/**
	 * Generates a string to be used as a name of a file.
	 * @param  string $seed a suggestion for the file name
	 * @return string
	 */
	public function validateFileName($seed = ''){
		$fileName = $this->dropIllegalSymbols($seed);
		$fileNameInfo = pathinfo($fileName);
		if (!array_key_exists('filename', $fileNameInfo) || strlen($fileNameInfo['filename']) == 0){
			return $this->getDefaultFileName();
		}
		$ext = array_key_exists('extension', $fileNameInfo) ? '.' . $fileNameInfo['extension'] : '';
		return $fileNameInfo['filename'] . $ext;
	}

	/**
	 * Escapes special characters from $_content.
	 */
	public function sanitize(){
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
			'\'' => '&#039;',
			'€' => '&euro;'
		];
		$content = $this->getFileContent();
		$content = htmlentities($content, ENT_QUOTES | ENT_HTML401, 'UTF-8');
		// foreach ($replacement as $key => $value){
		// 	$content = str_replace($key, $value, $content);
		// }
		$this->setFileContent($content);
	}

	/**
	 * Appends properly formatted $msg to the log file.
	 * @param  string $msg
	 * @return void
	 */
	public function addToLog($msg){
		try {
			$content = is_string($msg) ? $msg : 'a non-string is passed to the log saver';
			$record = date('Y/m/d H:i:s ', time()) . substr($content, 0, self::$_errorMaxLength) . PHP_EOL;
			$handler = fopen($this->getLogFileName(), 'a');
			fwrite($handler, $record);
			fclose($handler);
		} catch (\Exception $e){
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
	 * $_content setter. Must be a string.
	 * @param string $cntn
	 */
	public function setFileContent($cntn){
		if (is_string($cntn)){
			$this->_content = $cntn;
		}
	}

	/**
	 * $_content getter.
	 * @return string
	 */
	public function getFileContent(){
		return $this->_content;
	}

	/**
	 * Saves $_content with name stored in $_fileName inside $_repoDir folder.
	 *
	 * Returns true in case of success, false otherwise.
	 * @return boolean
	 */
	public function save(){
		try {
			$fileName = $this->generateRandomString();
			$fullPath = $this->getRepoDir() . $this->getId() . DIRECTORY_SEPARATOR . $fileName;
			$this->initializeWorkDir();
			// remove old file (if any)
			if (file_exists($fullPath)){
				unlink($fullPath);
			}
			if (file_put_contents($fullPath, $this->getFileContent()) == true){
				return $fileName;
			}
		} catch (\Exception $e){
			$this->addToLog($e->getMessage());
		}
		return null;
	}

	/**
	 * Generates a random string that is to be used as file name.
	 * @return string
	 */
	private function generateRandomString(){
		/// !!! stub
		return uniqid();
	}


	/**
	 * Launches a dialog window that permits the client to save the content file.
	 *
	 * The full file name is given by [$getFullFileName](#method_getFullFileName) method.
	 * @return void
	 */
	public function sendFileContentForSaving(){
		$fullPath = $this->getFullFileName();
		$fileName = $this->getFileName();
	    if (file_exists($fullPath)) {
	        // the order of the below line is VERY important!!!
	        header("Content-Type: application/octet-stream");
	        header("Content-Transfer-Encoding: Binary");
	        header("Content-disposition: attachment; filename=$fileName");
	        readfile($fullPath);
		} else {
			$this->addToLog("file $fullPath not found");
		}
	}

}