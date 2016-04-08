<?php
class Module{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'modules';
		$this->db = Database::Instance();
	}

	public function get_modules(){
	  $arrWhere = array();
	  $arrWhere['status'] = 1;
	  
	  $rows = $this->db->getDataFromTable($arrWhere, $this->tableName, '*', '', '', false);
	  return $rows;
	}
}
?>