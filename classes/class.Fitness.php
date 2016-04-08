<?php
class Fitness{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'patient_fitness_certififcate';
		$this->db = Database::Instance();
	}


	public function create($params){
		return $this -> db -> insertDataIntoTable($params, $this -> tableName);
	}

	public function read($search = array()){
		return $this -> db -> getDataFromTable($search, $this -> tableName);
	}

	public function update($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, $this -> tableName);
	}

	public function listview(){
		$sql = "select * from ".$this->tableName." fitness where fitness.clinic_id='".clinic()."' ORDER BY fitness.id DESC";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}
}
?>