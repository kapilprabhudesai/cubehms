<?php
class Appointment{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'patient_appointments';
		$this->db = Database::Instance();
	}
	
	public function unconfirmed_appointments(){
		$sql = "SELECT count(id) as unconfirmed from patient_appointments WHERE appointment_date>='".date('Y-m-d')."' and confirmed_by_doctor = 0 and clinic_id=".clinic()." and doctor_id = ".current_user();
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();	
	}

	public function read($search = array()){
		return $this -> db -> getDataFromTable($search, $this -> tableName);
	}

	public function save_investigation($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, $this -> tableName);
	}

	public function confirm_appointment($appointment_id){
		return $this -> db -> query("update patient_appointments set confirmed_by_doctor='1' where id = '".$appointment_id."'");
	}

	public function get_appointments($date=''){
		if($date==""){
			$date = todays_date();
		}
		$andcondition="";
		if(role()=='doctor'){
			$andcondition=" and dm.user_id=".current_user();
		}
		$sql = "SELECT ap.id,ap.cancel,ap.patient_arrived, ap.via_internet, ap.confirmed_by_doctor, slot_id, slot_text, concat_ws(' ',pm.first_name, pm.last_name) as patient_name,concat_ws(' ',dm.first_name, dm.last_name) as doctor_name, ap.doctor_id, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) AS age FROM patient_appointments ap INNER JOIN patient_master pm on ap.patient_id =  pm.id inner join doctor_master dm on dm.user_id = ap.doctor_id where  ap.clinic_id='".clinic()."' and ap.appointment_date='".$date."' and confirmed_by_doctor=1 $andcondition ORDER BY slot_id";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}

	public function my_present_and_future_appointments(){
		$sql = "SELECT ap.appointment_date,ap.id,ap.cancel,ap.patient_arrived, ap.via_internet, ap.confirmed_by_doctor, slot_id, slot_text, concat_ws(' ',pm.first_name, pm.middle_name, pm.last_name) as patient_name, ap.doctor_id FROM patient_appointments ap
		INNER JOIN patient_master pm on ap.patient_id =  pm.id where ap.doctor_id='".current_user()."' and ap.clinic_id='".clinic()."' and ap.appointment_date>='".todays_date()."' ORDER BY ap.appointment_date,slot_id";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}	

	public function update($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, $this -> tableName);
	}

	public function create($params){
		return $this -> db -> insertDataIntoTable($params, $this -> tableName);
	}

}
?>