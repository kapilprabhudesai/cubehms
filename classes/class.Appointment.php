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
		$sql = "SELECT ap.id,ap.cancel,ap.patient_arrived, ap.via_internet, ap.confirmed_by_doctor, slot_id, slot_text, concat_ws(' ',u.first_name, u.last_name) as patient_name,concat_ws(' ',dm.first_name, dm.last_name) as doctor_name, ap.doctor_id, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(dob, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(dob, '00-%m-%d')) AS age FROM patient_appointments ap INNER JOIN patient_master pm on ap.patient_id =  pm.id INNER JOIN users u on pm.user_id =  u.id inner join doctor_master dm on dm.user_id = ap.doctor_id where  ap.clinic_id='".clinic()."' and ap.appointment_date='".$date."' and confirmed_by_doctor=1 $andcondition GROUP BY ap.id ORDER BY slot_id";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}

	public function my_present_and_future_appointments(){
		$sql = "SELECT ap.appointment_date,ap.id,ap.cancel,ap.patient_arrived, ap.via_internet, ap.confirmed_by_doctor, slot_id, slot_text, concat_ws(' ',u.first_name, u.middle_name, u.last_name) as patient_name, ap.doctor_id FROM patient_appointments ap
		LEFT JOIN patient_master pm on ap.patient_id =  pm.id LEFT JOIN users u ON pm.user_id = u.id where ap.doctor_id='".current_user()."' and ap.clinic_id='".clinic()."' and ap.appointment_date>='".todays_date()."' ORDER BY ap.appointment_date,slot_id";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}	

	public function update($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, $this -> tableName);
	}

	public function create($params){
		return $this -> db -> insertDataIntoTable($params, $this -> tableName);
	}
	public function my_appointments(){
		$sql = "SELECT qry,concat_ws(' ', u.first_name, u.last_name)as doctor_name, appointment_date, slot_text, clinic_name, pa.confirmed_by_doctor, cm.mobile_no_1 as clinic_mobile, cm.address FROM patient_appointments pa INNER JOIN users u on pa.doctor_id = u.id INNER JOIN clinic_master cm on pa.clinic_id = cm.id where pa.patient_id='".current_user()."'";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();		
	}
	public function patient_doctor_search($country_id=null, $state_id =null, $city_id = null, $specialties=null){
		$where = "";
		if($country_id!=null){
			$where .=" and cm.country_id='".$country_id."'";
		}
		if($state_id!=null){
			$where .=" and cm.state_id='".$state_id."'";
		}
		if($city_id!=null){
			$where .=" and cm.city_id='".$city_id."'";
		}
		if($specialties!=null){
			$where .=" and dm.specialties in(".$specialties.")";
		}
		$sql = "SELECT dm.specialties, dm.id as doctor_master_id, dm.user_id, cm.clinic_name, concat_ws(' ',u.first_name,u.last_name) AS doctor_name, cm.address, city_master.name as city, state_master.name as state, cm.mobile_no_1, cm.landline_1 FROM doctor_master dm INNER JOIN users u ON dm.user_id = u.id INNER JOIN clinic_master cm ON dm.clinic_id = cm.id INNER JOIN city_master ON cm.city_id = city_master.id INNER JOIN state_master ON cm.state_id = state_master.id where u.status=1 ".$where;
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();		
	}

}
?>