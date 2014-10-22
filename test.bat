@ECHO OFF
IF "%1" == "cov" GOTO COV
GOTO TEST
:COV
php test\php\phpunit.phar --coverage-html ./report test\php\FileManagementTest.php
:TEST
php test\\php\\phpunit.phar --bootstrap php\\FileManagement.php test\\php\\FileManagementTest.php