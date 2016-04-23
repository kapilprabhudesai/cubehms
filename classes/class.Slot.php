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
		$params['slots']="";
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

	public function fetch_slots($params){	
		$sql = "select * from slots where day='".$params['day']."' and doctor_id='".$params['doctor_id']."' and user_id='".$params['user_id']."' and valid_till>='".$params['dt']."' and '".$params['dt']."'>='".date('Y-m-d')."'";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}
}
?>