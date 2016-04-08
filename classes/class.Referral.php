<?php
class Referral{
	protected $finalData = array();
	private $db;

	public function __construct(){
		$this->db = Database::Instance();
	}

	public function save_new_referral($params){
		return $this -> db -> insertDataIntoTable($params,'referral_master');
	}

	public function rlist(){
		$this -> db -> query("SELECT * from referral_master WHERE status=1 and clinic_id =".clinic()." order by clinic_name");
		return $this -> db -> getResultSet();
	}

	public function fill_referral_details_by_id($id){
		$this -> db -> query("SELECT * from referral_master WHERE status=1 and id =".$id."");
		return $this -> db -> getResultSet();
	}	

	public function update_referral($params, $where){
		return $this -> db ->  updateDataIntoTable($params, $where, 'referral_master');
	}

	public function combo(){
		$this -> db -> query("SELECT id,clinic_name as name from referral_master WHERE status=1 and clinic_id =".clinic()."");
		return $this -> db -> getResultSet();		
	}

	public function get_all_icd10(){
		 $this -> db -> query("select id, diagnosis_name as name from icd10_diagnosis where status='1'");
		 return $this -> db -> getResultSet();
	}
	
	public function get_all_diagnosis(){
		 $this -> db -> query("select id, name as name from diagnosis_master where status='1' and (clinic_id=0 or clinic_id='".clinic()."')");
		 return $this -> db -> getResultSet();
	}

	public function get_all_investigations(){
		 $this -> db -> query("select id, name as name from investigation_master where status='1' and (clinic_id=0 or clinic_id='".clinic()."')");
		 return $this -> db -> getResultSet();
	}	

	public function get_all_drugs(){
		 $this -> db -> query("select id, name as name from drug_master where (clinic_id=0 or clinic_id='".clinic()."')");
		 return $this -> db -> getResultSet();
	}	

	public function add_combos($vals){
		$params = array();
		$table_name="";
		if($vals['type']=='investigation'){
			$table_name = 'investigation_master';
			$params['name'] = $vals['name'];
		}
		else if($vals['type']=='diagnosis'){
			$table_name = 'diagnosis_master';
			$params['name'] = $vals['name'];			
		}
		else if($vals['type']=='drug'){
			$table_name = 'drug_master';
			$params['name'] = $vals['name'];			
		}
		$params['clinic_id'] = clinic();
		return $this -> db -> insertDataIntoTable($params,$table_name);
	}

}
?>