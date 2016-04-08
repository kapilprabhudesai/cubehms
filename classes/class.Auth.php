<?php
class Auth{
	protected $finalData = array();
	private $db;
	private $tableName;

	public function __construct(){
		$this->tableName = 'users';
		$this->db = Database::Instance();
	}

	public function change_password($password){
		$sql = "UPDATE users set password='$password' WHERE id='".current_user()."'";
		$this -> db -> query($sql);
		return;
	}

	public function read_password(){
		$sql = "select * from users WHERE id='".current_user()."'";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();
	}
	public function login($un, $pw){
	  $arrWhere = array();
	  $arrWhere['username'] = $this->db->db_escape($un);
	  $arrWhere['status'] = 1;
	  
	  $rows = $this->db->getDataFromTable($arrWhere, $this->tableName, '*', '', '', false);
	  return $rows;
	}

	public function all_user_emailids(){
		$sql = "select email from users";
		$this -> db -> query($sql);
		return $this -> db -> getResultSet();		
	}
}
?>