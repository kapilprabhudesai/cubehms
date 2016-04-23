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

	public function create_user($params){
		return $this -> db -> insertDataIntoTable($params, 'users');
	}

	public function update($params, $where){
		return $this -> db ->  updateDataIntoTable($params, $where, $this->tableName);
	}

	public function fill_user_details($id){
		$this -> db -> query("SELECT * from users where id = '".$id."'");
		return $this -> db -> getResultSet();
	}

	public function fill_my_patient_details($id){
		$this -> db -> query("SELECT users.*, owned_by,patient_master.id as patient_id from users inner join patient_master on users.id = patient_master.user_id where users.id = '".$id."' and patient_master.clinic_id='".clinic()."'");
		return $this -> db -> getResultSet();
	}

	public function update_user($params, $where){
		return $this -> db ->  updateDataIntoTable($params, $where, 'users');
	}



	public function global_patients($q){
		$this -> db -> query("SELECT id, CONCAT_WS(' ', first_name, middle_name, last_name) as name  FROM ".$this->tableName." WHERE status=1 and (first_name like '".$q."%' or last_name like '".$q."%')");
		return $this -> db -> getResultSet();
	}

	
	public function read($keyValueArray = array()){
		return $this -> db -> getDataFromTable($keyValueArray, $this -> tableName);
	}

	public function read_list_view($keyValueArray = array()){
		$q =  "SELECT u.*,CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name) as name, p.clinic_id as clinic, user_id, owned_by from patient_master p INNER JOIN users u on p.user_id = u.id order by u.id";
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