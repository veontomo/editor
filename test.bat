@ECHO OFF
IF %1==cov "php test\php\phpunit.phar --coverage-html ./report test\php\FileManagementTest.php"
php test\\php\\phpunit.phar --bootstrap php\\FileManagement.php test\\php\\FileManagementTest.php