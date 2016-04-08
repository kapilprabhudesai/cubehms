<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$to = $_POST['to'];
$subject =  $_POST['subject'];
$body = $_POST['body'];
$from = $_POST['from'];


$message = "
<html>
<head>
<title>CUBEHMS.NET</title>
</head>
<body>
<p>".$body."</p>
</body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <'.$from.'>' . "\r\n";
$headers .= 'Cc: admin@cubehms.net' . "\r\n";

mail($to,$subject,$message,$headers);
echo "Sent!";
?>