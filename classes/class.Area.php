<?php
class Area{
	protected $finalData = array();
	private $db;

	public function __construct(){
		$this->db = Database::Instance();
	}

	public function get_countries(){
		$this -> db -> query("SELECT id, name from country_master WHERE status=1");
		return $this -> db -> getResultSet();
	}

	public function get_states($cid){
		$this -> db -> query("SELECT id, name from state_master WHERE status=1 and country_id='".$cid."'");
		return $this -> db -> getResultSet();
	}

	public function get_cities($sid){
		$this -> db -> query("SELECT id, name from city_master WHERE status=1 and state_id='".$sid."'");
		return $this -> db -> getResultSet();
	}	

	public function get_areas($cid){
		$this -> db -> query("SELECT id, name from area_master WHERE status=1 and city_id='".$cid."'");
		return $this -> db -> getResultSet();
	}

	public function get_sepcialties(){
		$this -> db -> query("SELECT id, name from specialties WHERE status=1");
		return $this -> db -> getResultSet();		
	}	

	public function save_new_area($params){
		return $this -> db -> insertDataIntoTable($params,'area_master');
	}
}
?>