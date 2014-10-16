<?php
$file = fopen('error_log.log', 'a');
fwrite($file, "\r\nFILE MANAGEMENT is called!\r\n ");
fclose($file);
