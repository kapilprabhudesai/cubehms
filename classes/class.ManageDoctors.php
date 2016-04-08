<?php
class ManageDoctors{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'doctor_master';
		$this->db = Database::Instance();
	}
	public function get_all_my_doctors(){
		$this -> db -> query("SELECT d.id as doctor_master_id, d.user_id as user_master_id, concat_ws(' ',d.first_name, d.last_name)as name, d.email_1 as email, d.mobile_no_1, d.mobile_no_2, is_principal  FROM doctor_master d INNER JOIN users u on d.user_id = u.id and d.clinic_id='".clinic()."'");
		return $this -> db -> getResultSet();
	}
	public function global_doctors($q){
		$this -> db -> query("SELECT id, CONCAT_WS(' ', first_name, middle_name, last_name) as name  FROM ".$this->tableName." WHERE status=1 and user_id!='".current_user()."' and clinic_id!='".clinic()."' and (first_name like '".$q."%' or last_name like '".$q."%') GROUP BY user_id");
		return $this -> db -> getResultSet();
	}	

	public function fill_doctor_details($id){
		$this -> db -> query("SELECT * from ".$this->tableName." where id = '".$id."'");
		return $this -> db -> getResultSet();
	}

	public function fill_doctor_details_by_user_id($master_id){
		$q = "SELECT dm.*, u.rights from ".$this->tableName." dm inner join users u on dm.user_id = u.id where dm.id = '".$master_id."' limit 1";
		$this -> db -> query($q);
		return $this -> db -> getResultSet();
	}

	public function fill_user_details($id){
		$this -> db -> query("SELECT * from ".$this->tableName." where id = '".$id."'");
		return $this -> db -> getResultSet();
	}	

	public function update_user($params, $where){
		return $this -> db ->  updateDataIntoTable($params, $where, 'users');
	}
	public function doctor_create($params){
		return $this -> db -> insertDataIntoTable($params, $this->tableName);
	}	

	public function doctor_update($params, $where){
		return $this -> db ->  updateDataIntoTable($params, $where, $this->tableName);
	}
}
?>