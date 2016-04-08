<?php
session_start(); 
date_default_timezone_set('Asia/Calcutta');

error_reporting(E_ALL); 
ini_set('display_errors', 1);

ob_start();
 
include_once 'inc/constants.php';

include_once FUNCTION_PATH;

if(!isset($_SESSION['username'])){
	$Go = CMS_PATH."login.php";
	header("location:$Go");
}  	