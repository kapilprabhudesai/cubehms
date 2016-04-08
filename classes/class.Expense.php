<?php
class Expense{
	protected $finalData = array();
	private $db;

	public function __construct(){
		$this->db = Database::Instance();
	}

	public function get_expense_types(){
		$this -> db -> query("SELECT id, name from expense_types WHERE status=1 and clinic_id in (0, ".clinic().")");
		return $this -> db -> getResultSet();
	}

	public function remove_expense($params){
		return $this -> db -> query("update expenses set status=0 where id =".$params['id']);
	}

	public function update($params = array(), $search = array()){
		return $this -> db -> updateDataIntoTable($params, $search, 'expenses');
	}
	
	public function get_expense_list(){
		$this -> db -> query("SELECT * from expenses WHERE status=1 and clinic_id =".clinic()." order by date");
		return $this -> db -> getResultSet();
	}

	public function new_expense_type($params){
		return $this -> db -> insertDataIntoTable($params,'expense_types');
	}

	public function save_new_expense($params){
		$params['clinic_id'] = clinic();
		return $this -> db -> insertDataIntoTable($params,'expenses');
	}
}
?>