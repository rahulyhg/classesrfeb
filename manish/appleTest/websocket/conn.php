<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"
$hostname_connMain = "localhost";//216.170.119.150
$database_connMain = "websocket";
$username_connMain = "consultl_user";
$password_connMain = "passwords123";
//$connClassesMain = mysqli_connect($hostname_connMain, $username_connMain, $password_connMain) or trigger_error(mysql_error(),E_USER_ERROR); 


define('BASE_DIR', dirname(__FILE__));

include(BASE_DIR.'/adodb/adodb.inc.php');

$ADODB_CACHE_DIR = BASE_DIR.'/cache/adodb_cache';
$connMainAdodb = ADONewConnection('mysqli');
$connMainAdodb->Connect($hostname_connMain, $username_connMain, $password_connMain, $database_connMain);

?>