<?php
class Appointment{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'patient_appointments';
		$this->db = Database::Instance();
	}

	public function get_appointments_for_cancellations($doctor_master_id, $from, $resume){
		$sql = "SELECT patient_appointments.id, patient_appointments.appointment_date, concat_ws(' ', patient_master.first_name, patient_master.last_name) as patient,patient_master.email_1, patient_master.mobile_no_1, concat_ws(' ', doctor_master.first_name, doctor_master.last_name )as doctor  FROM patient_appointments inner join patient_master on patient_appointments.patient_id = patient_master.id inner join doctor_master on patient_appointments.doctor_id = doctor_master.id WHERE	doctor_id = '".$doctor_master_id."' AND date(appointment_date) >= date('".$from."') AND date(appointment_date) < date('".$resume."') AND patient_arrived = 0 and cancel=0 and confirmed_by_doctor=1";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();		
	}

	public function get_appointment_for_cancellation($id){
		$sql = "SELECT patient_appointments.id, patient_appointments.appointment_date, concat_ws(' ', patient_master.first_name, patient_master.last_name) as patient,patient_master.email_1, patient_master.mobile_no_1, concat_ws(' ', doctor_master.first_name, doctor_master.last_name )as doctor  FROM patient_appointments inner join patient_master on patient_appointments.patient_id = patient_master.id inner join doctor_master on patient_appointments.doctor_id = doctor_master.id WHERE patient_appointments.id = '".$id."'";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();		
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
		$sql = "SELECT ap.id,ap.cancel,ap.patient_arrived, ap.via_internet, ap.confirmed_by_doctor, slot_id, slot_text, concat_ws(' ',pm.first_name, pm.last_name) as patient_name,concat_ws(' ',dm.first_name, dm.last_name) as doctor_name, ap.doctor_id, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) AS age FROM patient_appointments ap INNER JOIN patient_master pm on ap.patient_id =  pm.id inner join doctor_master dm on dm.user_id = ap.doctor_id where  ap.clinic_id='".clinic()."' and ap.appointment_date='".$date."' and confirmed_by_doctor=1 $andcondition GROUP BY ap.id ORDER BY slot_id";
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