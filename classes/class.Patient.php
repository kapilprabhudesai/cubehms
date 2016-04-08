<?php
class Patient{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'patient_master';
		$this->db = Database::Instance();
	}

	public function create($params){
		return $this -> db -> insertDataIntoTable($params, $this -> tableName);
	}

	public function update($params, $where){
		return $this -> db ->  updateDataIntoTable($params, $where, $this->tableName);
	}

	public function fill_user_details($id){
		$this -> db -> query("SELECT * from patient_master where id = '".$id."'");
		return $this -> db -> getResultSet();
	}

	public function global_patients($q){
		$this -> db -> query("SELECT id, CONCAT_WS(' ', first_name, middle_name, last_name) as name  FROM ".$this->tableName." WHERE status=1 and clinic_id!='".$_SESSION['current_clinic']."' and (first_name like '".$q."%' or last_name like '".$q."%')");
		return $this -> db -> getResultSet();
	}

	
	public function read($keyValueArray = array()){
		return $this -> db -> getDataFromTable($keyValueArray, $this -> tableName);
	}

	public function read_list_view($keyValueArray = array()){
		$q =  "SELECT id as patient_id, CONCAT_WS(' ', first_name, last_name) as name,gender, mobile_no_1,email_1, dob,created_on, address  FROM ".$this->tableName." WHERE status=1 and clinic_id='".clinic()."'";
		$this -> db -> query($q);
		return $this -> db -> getResultSet();
	}

	public function book_appointment($params){
		pr($params);
		return $this -> db -> insertDataIntoTable($params, 'patient_appointments');
	}

	public function get_patient_name($id){
		$this -> db -> query("SELECT concat_ws(' ',first_name,middle_name,last_name) as name from ".$this->tableName." where id = '".$id."'");
		$name = $this -> db -> getResultSet();
		$name = $name[0];
		return $name['name'];
	}


}
?>