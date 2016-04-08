<?php

class Database
{
    private static $instance = array();
    private $connection ;
    private $ConnectionIdentifier ;
    private $result ;
    private $row ;
    private $sql ;
    private $error ;

    private function __construct($index){
        global $db;
 
        $this->connection = new mysqli($db['host'], $db['user'], $db['password'], $db['database']);
        $this->ConnectionIdentifier = $index ;
    }
    

    private function __clone(){
        $this->connection->close();
        trigger_error('Clone is not allowed.', E_USER_ERROR);
    }

    public function __toString(){
        $this->connection->close();
        trigger_error('Print is not allowed.', E_USER_ERROR);
    }

    public static function Instance($index = 'CMS'){
        if(!isset(self::$instance[$index])){
            self::$instance[$index] = new Database($index);
        }
        return self::$instance[$index];
    }

    public function trackLog($sql, $log_id,$query_status, $action='')
    {

        
    }

    public function query($sql, $debug = 0, $ismongo = '')
    {
        if ( is_object($this->result) ) {
            $this->result->close();
        }

        $this->sql = $sql ;
        if ( $this->result = $this->connection->query($this->sql) )
        {
            if ( $debug == 1 ) {
                echo $sql;
            }
            $return = true;
        }
        else
        {
            $this->error = $this->connection->error ;
            if ( $debug == 1 ){
                print 'Error in Query: ' . $this->sql;
                print 'Error Description: ' . $this->error ;
            }
            $return = false;
        }
        return $return;
    }

    public function getRowCount(){
        return $this->result->num_rows ;
    }

    public function getInsertedAutoId(){
        return $this->connection->insert_id ;
    }

    public function getAffectedRowCount(){
        return $this->connection->affected_rows;
    }

    public function fetch(){
        return $this->result->fetch_array(MYSQLI_ASSOC);
    }

    public function getResultSet(){
        $resultSet = array();
        while( $row = $this->result->fetch_array(MYSQLI_ASSOC) ){
            $resultSet[] = $row;
        }
        return $resultSet;
    }

    public function insertDataIntoTable($keyValueArray, $table, $debug=false)
    {
        $insert_id = 0;
        $countTableData = count($keyValueArray);
        $sql = "INSERT INTO `{$table}` SET ";
        $i=0;
        foreach($keyValueArray as $key=>$val){
            $i++;
            $sql .= $key."='" . $this->db_escape($val) . "'";
            if($countTableData != $i){
                $sql .= ", ";
            }
        }

        $status = $this->query( $sql, $debug, '' );

        $log_id = $insert_id;
        if ( $status )
        {
            $insert_id = $this->getInsertedAutoId();
        }
        return $insert_id;
    }

    public function insertDataMultiIntoTable($keyValueArray, $table, $fields, $debug=false)
    {
        $countrows = count($keyValueArray);
        $sql = "INSERT INTO `{$table}` ({$fields}) VALUES";
        $j=1;
        foreach($keyValueArray as $item){
            $countTableData = count($item);
            $i=0;
            foreach($item as $key=>$val){
                if($i==0)
                {
                    $sql =$sql." (";
                }
                $sql .= "'" . $this->db_escape($val) . "'";
                if($countTableData > ($i+1)){
                    $sql .= ", ";
                }
                else
                {
                    $sql .= ") ";
                }
                $i++;

            }
            if($countrows > $j){
                $sql .= ", ";

            }
            $j++;
        }//echo $sql;die;
        $res=$this->query($sql, $debug, '', $log_id);
        $insertID=$this->getInsertedAutoId();
        $this->trackLog($sql, $log_id, $insertID);
        return $insertID;
    }


    public function updateDataIntoTable($keyValueArray, $whereClauseKeyValArray, $table, $debug=false)
    {
        $countTableData = count($keyValueArray);
        $sql = "UPDATE `{$table}` SET ";
        $i=0;
        $w=0;
        $log_id = 0;
        $row_count = 0;

        foreach($keyValueArray as $key=>$val){
            $i++;
            if($key == 'countupdate'){
                $sql .= $this->db_escape($val);
                break;
            }else{
                $sql .= $key."='" . $this->db_escape($val) . "'";
                if($countTableData != $i){
                    $sql .=", ";
                }
            }
        }

        $countWhereClauseData = count($whereClauseKeyValArray);
        if($countWhereClauseData > 0){
            $sql .=" where ";
            foreach($whereClauseKeyValArray as $key=>$val){
                $w++;
                $sql .= $key."='" . $this->db_escape($val) . "'";
                if($countWhereClauseData != $w){
                    $sql .=" and ";
                }
            }
        }
        $res = $this->query($sql, $debug, '');
        
        if ( $res > 0 ) {
            $row_count = $this->getAffectedRowCount();
        }

        switch($table){
            case 'order_track':
                $log_id = $whereClauseKeyValArray['order_track_id'];
                break;
        }

        $action = ( $_POST['action'] == 'p' && $keyValueArray['status'] == '0' ) ? 'u' : '';
        
        $log_id = ( ($log_id != 0) ? $log_id : ( isset($whereClauseKeyValArray['id']) ? $whereClauseKeyValArray['id'] : 0 ) );
        //echo $sql;
        $this->trackLog($sql, $log_id, $res, $action);
        return $row_count;
    }

    public function getDataFromTable($keyValueArray, $table, $fields='*', $orderBy = '', $limit = '', $debug = false)
    {
        $posts = array();
        $countTableData=count($keyValueArray);
        $sql = "SELECT $fields FROM $table";
        $i=0;
        foreach($keyValueArray as $key=>$val){
            $i++;
            if($i==1){
                $sql .=" where ";
            }

            if($key == 'sqlclause' || $key=='notequal'){
                $sql .= $val;
            }else{
                            /* SOF Code to not apply inverted commas */
                            if(is_int($val) || ctype_digit($val)){
                             $sql .= $key."=".$val." ";   
                            }else{
                             $sql .= $key."='".$val."'";
                            }    
                            /* EOF Code to not apply inverted commas */
                //$sql .= $key."='".$val."'";   
            }

            if($countTableData !=$i){
                $sql .=" and ";
            }
        }
        if ( $orderBy != '' ) {
            $sql .=" order by ".$orderBy;
        }
        if ( $limit != "" ) {
            $sql .=" limit ".$limit;
        }

        if ( $this->query($sql, $debug ) )
        {
            while ( $row  = $this->fetch() ) {
                //array_push($posts, $row);
                $posts[] = $row;
            }
        }
        return $posts;
    }


    public function deleteDataFromTable($whereClauseKeyValArray, $table, $debug = false){
        // $countTableData = count($keyValueArray);
        $sql = "DELETE FROM `{$table}` ";
        $w=0;

        $countWhereClauseData = count($whereClauseKeyValArray);
        if($countWhereClauseData > 0){
            $sql .=" where ";
            foreach($whereClauseKeyValArray as $key=>$val){
                $w++;
                $sql .= $key."='".$val."'";
                if($countWhereClauseData != $w){
                    $sql .=" and ";
                }
            }
        }
        if($debug == true){
            echo $sql;
        }
        $response = $this->query($sql);
        
        if ( $response )
        {
            $rowCount = $this->getAffectedRowCount();
            $log_id = (isset($whereClauseKeyValArray['id']) ? $whereClauseKeyValArray['id'] : isset($whereClauseKeyValArray['order_id']) ) ? $whereClauseKeyValArray['order_id'] : '';
            $this->trackLog($sql, $log_id, $response);
        }

        return $rowCount;
    }


    public function get_resultset($sql) {
        if ( $result = $this->connection->query($sql) )
        {
            return $result;
        }
        else
        {
            $this->error = $this->connection->error;
            return false;
        }
    }


    public function __destruct(){
        if(is_object($this->result)){
            $this->result->close();
        }
        $this->connection->close();
    }

    public function db_escape($string)
    {
        return $this->connection->real_escape_string(trim($string));
    }




}
