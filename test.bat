@ECHO OFF
SET phpunit=vendor\phpunit\phpunit\phpunit
IF "%1" == "cov" GOTO COV
GOTO TEST
:COV
php %phpunit% --coverage-html .\statistics\phpCoverage test\php\FileManagementTest.php
:TEST
php %phpunit% --bootstrap php\\FileManagement.php test\\php\\FileManagementTest.php