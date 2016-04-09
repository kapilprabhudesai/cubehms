<?php
class Common{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->db = Database::Instance();
	}
	
	public function is_unique_mobile($str){
		$sql = "SELECT sum(rows) as total_duplicates from(SELECT count(id) as rows from doctor_master where mobile_no_1 = '".$str."' or  mobile_no_2 = '".$str."' UNION SELECT count(id) as rows from clinic_master where mobile_no_1 = '".$str."' or  mobile_no_2 = '".$str."')t ";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();	
	}
}
?>