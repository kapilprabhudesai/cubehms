<?php
$res = array();
exec("git pull -u origin master", $res);
echo "<pre>";
print_r($res);
echo "</pre>";
?>