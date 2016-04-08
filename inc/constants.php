<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	define("ENV",				"DEVELOPMENT");//"DEVELOPMENT" / "STAGING" / "PRODUCTION"
	define("SEP",				"/");
	define("HOST_PATH",			$_SERVER['HTTP_HOST'].SEP);
	define("CMS_PATH",			"http://".HOST_PATH);
	define("ROOT_PATH",			$_SERVER['DOCUMENT_ROOT']);
	define("JS_PATH",			CMS_PATH."js/");
	define("CSS_PATH",			CMS_PATH."css/");
	define("IMAGE_PATH",		CMS_PATH."images/");
	define('FUNCTION_PATH', 	ROOT_PATH . "/inc/functions.php");
	define('HEADER_PATH', 		ROOT_PATH . "/includes/header.php");
	define('FOOTER_PATH', 		ROOT_PATH . "/includes/footer.php");
	define("SITE_TITLE",		"CubeIHMS");
	define("SITE_SUB_TITLE",	"The Pharma medical explorer!");
	define("SUPPORT_EMAIL", "support@cubehms.net");

    $days = array('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
    $GLOBALS['days'] = $days;
	
    $roles = array('admin','clinic_admin','doctor','patient','nurse','receptionist','promo_agent');
    $GLOBALS['roles'] = $roles;
	switch(ENV){
		case "DEVELOPMENT":
			$db["user"] 	= "root";
			$db["password"] = "";
			$db["database"] = "cubehms";
			$db["host"] 	= "localhost";
			break;

		case "STAGING":
			$db["user"] 	= "";
			$db["password"] = "";
			$db["database"] = "";
			$db["host"] 	= "";
			break;

		case "PRODUCTION":
			$db["user"] 	= "cubeictp_admin";
			$db["password"] = "admin";
			$db["database"] = "cubeictp_cubehms";
			$db["host"] 	= "localhost";
			break;						
	}
	$GLOBALS['db'] = $db;
?>