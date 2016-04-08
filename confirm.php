<?php
	include 'inc/constants.php';
	include 'inc/functions.php';
	$hash=$_GET['hash'];
	$obj = new ManageClinics();
	$obj->confirm_email($hash);
	header('Location:'.CMS_PATH.'login.php');
?>