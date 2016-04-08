<?php
class Slot{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'slots';
		$this->db = Database::Instance();
	}

	public function create_defaults($params){
		$params['slot_1']="";
		$params['slot_2']="";
		$params['slot_3']="";
		$params['slot_4']="";
		global $days;
		foreach ($days as $day) {
			$params['day']=$day;
			$this -> db -> insertDataIntoTable($params, $this -> tableName);		
		}
	}

	public function save($params){
		return $this -> db -> insertDataIntoTable($params, $this -> tableName);
	}

	public function read($search = array()){
		return $this -> db -> getDataFromTable($search, $this -> tableName);
	}

	public function update($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, $this -> tableName);
	}
}
?>