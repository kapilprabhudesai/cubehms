<?php
class ManageClinics{
	protected $finalData = array();
	private $db;
	private $tableName;


	public function __construct(){
		$this->tableName = 'clinic_master';
		$this->db = Database::Instance();
	}

	public function dashboard_stats(){
		$sql ="SELECT count(id) as total, sum(patient_arrived) as completed from patient_appointments WHERE appointment_date='".date('Y-m-d')."' and cancel=0 and clinic_id='".clinic()."'";	
		$this -> db -> query($sql);
		$data =  $this -> db -> getResultSet();
		$arr = array();
		$arr['total'] = intval($data[0]['total']);
		$arr['completed'] = $data[0]['completed'];
		if($data[0]['completed'] == null || $data[0]['completed'] == ''){
			$arr['completed'] = 0;
		}
		$arr['pending'] =$arr['total'] - $arr['completed'];
		return $arr;
	}
	public function add_investigation($str){
		$params = array('clinic_id'=>$_SESSION['current_clinic'], 'name'=>$str);
		return $this -> db -> insertDataIntoTable($params, 'investigation_master');
	}
	public function create($params){
		return $this -> db -> insertDataIntoTable($params, $this -> tableName);
	}

	public function update($params){
		$whereClauseKeyValArray = array('id'=>clinic());
		return $this -> db -> updateDataIntoTable($params, $whereClauseKeyValArray, $this->tableName, $debug=false);
	}

	public function update_clinic_code($params, $whereClauseKeyValArray){
		return $this -> db -> updateDataIntoTable($params, $whereClauseKeyValArray, $this->tableName, $debug=false);
	}

	public function principal_doctor_create($params){
		return $this -> db -> insertDataIntoTable($params, 'doctor_master');
	}

	public function principal_doctor_user_create($params){
		return $this -> db -> insertDataIntoTable($params, 'users');
	}

	public function confirm_email($hash){
		return $this -> db -> query("update users set status = 1 where password_hash='".$hash."'");
	}

	public function get_my_clinics($id){
		 $this -> db -> query("select clinic_id as id, clinic_name as name from doctor_master inner join clinic_master on doctor_master.clinic_id = clinic_master.id where user_id='".$id."' and is_principal='Yes'", 'users');
		 return $this -> db -> getResultSet();
	}

	public function get_my_clinics_as_doctor($id){
		 $this -> db -> query("select clinic_id as id, clinic_name as name from doctor_master inner join clinic_master on doctor_master.clinic_id = clinic_master.id where user_id='".$id."' and is_principal='No'", 'users');
		 return $this -> db -> getResultSet();
	}
	
	public function get_my_clinics_as_nurse_or_reception($id){
		 $this -> db -> query("select clinic_id as id, clinic_name as name from users inner join clinic_master on users.clinic_id = clinic_master.id where users.id='".$id."'", 'users');
		 return $this -> db -> getResultSet();
	}
	

	public function get_my_clinic($id){
		 $this -> db -> query("select clinic_id as id, clinic_name as name from users inner join clinic_master on users.clinic_id = clinic_master.id where users.id='".$id."'", 'users');
		 return $this -> db -> getResultSet();
	}

	public function get_all_clinics(){
		 $this -> db -> query("select id, clinic_name as name from clinic_master where status='1'");
		 return $this -> db -> getResultSet();
	}

	public function get_clinic(){
		 $this -> db -> query("select * from clinic_master where id='".clinic()."'");
		 return $this -> db -> getResultSet();
	}



	public function get_all_clinics_except_current(){
		$this -> db -> query("select id, clinic_name as name from clinic_master where status='1' and id!='".$_SESSION['current_clinic']."'");
		return $this -> db -> getResultSet();
	}	
	
	public function get_clinic_data(){
		 $this -> db -> query("select * from clinic_master where id = '".clinic()."'");
		 return $this -> db -> getResultSet();		
	}

	public function get_clinic_prinicipal_doctor_data(){
		 $this -> db -> query("select * from doctor_master where clinic_id = '".$_SESSION['current_clinic']."' and status=1 and is_principal='yes'");
		 return $this -> db -> getResultSet();			
	}

	public function get_clinic_prinicipal_doctor_user_data($user_id){
		 $this -> db -> query("select username from users where id = '".$user_id."'");
		 return $this -> db -> getResultSet();			
	}	

	public function get_all_doctors_for_clinic(){
		 $this -> db -> query("select user_id as id, concat_ws(' ',first_name, last_name) as name from doctor_master where clinic_id = '".$_SESSION['current_clinic']."'");
		 return $this -> db -> getResultSet();			
	}
}
?>