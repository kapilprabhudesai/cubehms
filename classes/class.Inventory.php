<?php
class Inventory{
	protected $finalData = array();
	private $db;

	public function __construct(){
		$this->db = Database::Instance();
	}

	public function add_combos($vals){
		$params = array();
		$table_name="";
		if($vals['type']=='type'){
			$table_name = 'item_type_master';
			$params['name'] = $vals['name'];
		}
		else if($vals['type']=='sub_type'){
			$table_name = 'item_subtype_master';
			$params['name'] = $vals['name'];			
			$params['type_id'] = $vals['type_id'];
		}
		else if($vals['type']=='uom'){
			$table_name = 'item_uom_master';
			$params['name'] = $vals['name'];			
		}
		$params['clinic_id'] = clinic();
		return $this -> db -> insertDataIntoTable($params,$table_name);
	}

	public function remove_expense($params){
		return $this -> db -> query("update expenses set status=0 where id =".$params['id']);
	}


	public function get_item_list(){
		$this -> db -> query("SELECT * from item_master WHERE status=1 and clinic_id =".clinic()." order by name");
		return $this -> db -> getResultSet();
	}

	public function update($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, 'expenses');
	}
	
	public function get_item_types(){
		$this -> db -> query("SELECT * from item_type_master WHERE status=1 and (clinic_id=0 or clinic_id =".clinic().") order by name");
		return $this -> db -> getResultSet();
	}

	public function get_item_sub_types($type_id){
		$where="";
		if(isset($type_id) && $type_id!=""){
			$where="type_id='".$type_id."' and ";
		}
		$this -> db -> query("SELECT * from item_subtype_master WHERE  $where status=1 and (clinic_id=0 or clinic_id =".clinic().") order by name");
		return $this -> db -> getResultSet();
	}

	public function get_uoms(){
		$this -> db -> query("SELECT * from item_uom_master WHERE status=1 and (clinic_id=0 or clinic_id =".clinic().") order by name");
		return $this -> db -> getResultSet();
	}
	
	public function save_item($params){
		$params['clinic_id'] = clinic();
		return $this -> db -> insertDataIntoTable($params,'item_master');
	}

}
?>