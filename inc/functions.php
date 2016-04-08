<?php
if(!isset($_SESSION['id'])) {
	session_start();	
}

require_once 'constants.php';
$request_method = $_SERVER['REQUEST_METHOD'];
$params = array();


switch ($request_method){
	case 'POST':
	$params = $_POST;
	break;

	case 'GET':
	$params = $_GET;
	break;
}
	$action="";
	if(isset($params['action'])){
		$action = $params['action'];
		unset($params['action']);
	}

	switch ($action) {

			case 'manage_add_combo':
			$obj = new Referral();
			$data = $obj->add_combos($params);
			echo json_encode($data);
			break;


//inventory related

			case 'inventory_add_combo':
			$obj = new Inventory();
			$data = $obj->add_combos($params);
			echo json_encode($data);
			break;

			case 'inventory_save_item':
			$obj = new Inventory();
			$data = $obj->save_item($params['item']);
			echo json_encode($data);
			break;

			case 'inventory_get_item_types':
			$obj = new Inventory();
			echo json_encode($obj->get_item_types());
			break;

			case 'inventory_get_item_sub_types':
			$obj = new Inventory();
			echo json_encode($obj->get_item_sub_types($params['type_id']));
			break;

			case 'inventory_get_uoms':
			$obj = new Inventory();
			echo json_encode($obj->get_uoms());
			break;

			case 'inventory_get_item_list':
			$obj = new Inventory();
			$data = $obj->get_item_list();
			echo json_encode($data);			
			break; 

//inventory related


			case 'get_referral_clinics':
			$obj = new Referral();
			$data = $obj->combo();
			echo json_encode($data);
			break;

			case 'get_all_drugs':
			$obj = new Referral();
			$data = $obj->get_all_drugs();
			echo json_encode($data);
			break;

			case 'get_all_icd10':
			$obj = new Referral();
			$data = $obj->get_all_icd10();
			echo json_encode($data);
			break;

			case 'get_all_diagnosis':
			$obj = new Referral();
			$data = $obj->get_all_diagnosis();
			echo json_encode($data);
			break;

			case 'get_all_investigations':
			$obj = new Referral();
			$data = $obj->get_all_investigations();
			echo json_encode($data);
			break;

									
			case 'fill_referral_details_by_id':
			$obj = new Referral();
			$data = $obj->fill_referral_details_by_id($params['id']);
			echo json_encode($data[0]);
			break;

			case 'get_referral_list':
			$obj = new Referral();
			$data = $obj->rlist();
			echo json_encode($data);			
			break; 

			case 'get_fitness_list':
				$obj = new Fitness();
				$data = $obj->listview();
				echo json_encode($data);
			break;

			case 'issue_fitness':
			$obj = new Fitness();
			$params['fitness']['clinic_id']=clinic();
			$params['fitness']['doctor_id']=current_user();
			$data = $obj->create($params['fitness']);				
			if($data){
				$json['status'] = true;
				$json['msg'] = "Fitness Added Successfully";
			}else{
				$json['status'] = false;
				$json['msg'] = "Fitness Not Added";
			}
	 
			echo json_encode($json);
			break;

			case 'add_referral':
			$obj = new Referral();
			$params['referral']['clinic_id']=clinic();
			$params['referral']['doctor_id']=current_user();
			if(($params['referral']['id'])!=""){
				$id = $params['referral']['id'];
				unset($params['referral']['id']);
				$data = $obj->update_referral($params['referral'], array('id'=>$id));
				if($data){
					$json['status'] = true;
					$json['msg'] = "Referral Updated Successfully";
				}else{
					$json['status'] = false;
					$json['msg'] = "Referral Not Updated";
				}			
			}else{
				$data = $obj->save_new_referral($params['referral']);				
				if($data){
					$json['status'] = true;
					$json['msg'] = "Referral Added Successfully";
				}else{
					$json['status'] = false;
					$json['msg'] = "Referral Not Added";
				}
			}
	
			echo json_encode($json);
			break;

			case 'load_investigation':
				$main_obj = new Appointment();
				$where = array('id'=>$params['appointment_id']);
				$data = $main_obj->read($where);
				$res['investigation']= $data[0]['investigation_details'];
				$obj = new ManageDoctors();
				$doctor = $obj->fill_doctor_details_by_user_id($data[0]['doctor_id']);
				$res['doctor'] = $doctor[0];
				$obj = new Patient();
				$patient = $obj->fill_user_details($data[0]['patient_id']);
				$res['patient'] = $patient[0];
				echo json_encode($res);
			break;

			case 'save_investigation':
			$main_obj = new Appointment();
			$str = array('investigation_details'=>$params['str']);
			$where = array('id'=>$params['appointment_id']);
			echo $main_obj->save_investigation($str, $where);
			break;

			case 'get_expense_types':
			$obj = new Expense();
			$data = $obj->get_expense_types($params);
			echo json_encode($data);			
			break;
			
			case 'remove_expense':
			$obj = new Expense();
			$data = $obj->remove_expense($params);
			echo json_encode($data);
			break;

			case 'get_expense_list':
			$obj = new Expense();
			$data = $obj->get_expense_list();
			echo json_encode($data);			
			break; 


			case 'update_expense':
			$obj = new Expense();
			$data = $obj->update($params['expense'], array('id'=>$params['expense']['id']));
			$json['status'] = true;
			$json['msg'] = "Expense Updated Successfully";
			
			echo json_encode($json);
			break;

			case 'add_expense':
			$obj = new Expense();
			$data = $obj->save_new_expense($params['expense']);
			if($data){
				$json['status'] = true;
				$json['msg'] = "Expense Added Successfully";
			}else{
				$json['status'] = false;
				$json['msg'] = "Expense Not Added";
			}	
			echo json_encode($json);
			break;

			case 'new_expense_type':
			$obj = new Expense();
			$data = $obj->new_expense_type($params);
			echo json_encode($data);
			break;

			case 'save_new_area':
			$obj = new Area();
			$data = $obj->save_new_area($params);
			echo json_encode($data);
			break;

			case 'confirm_appointment':
			$main_obj = new Appointment();
			$data = $main_obj->confirm_appointment($params['appointment_id']);
			if(count($data)>0){
				$json['status'] = true;
				$json['msg'] = "Appointment Successful";
			}else{
				$json['status'] = false;
				$json['msg'] = "Appointment UnSuccessful";
			}			
			echo json_encode($json);
			break;

			case 'my_present_and_future_appointments':
			$main_obj = new Appointment();
			$data = $main_obj->my_present_and_future_appointments();
			echo json_encode($data);
			break;

			case 'book_appointment':
			$main_obj = new Appointment();
			$params['clinic_id'] = clinic();
			if(role()=='doctor' || role()=='clinic_admin'){
				$params['confirmed_by_doctor'] = 1;
			}
			$c = $main_obj->create($params);

			if(count($c)>0){
				$json['status'] = true;
				$json['msg'] = "Appointment Successful";
			}else{
				$json['status'] = false;
				$json['msg'] = "Appointment UnSuccessful";
			}
			echo json_encode($json);
			break;			

			case 'unconfirmed_appointments':
				unconfirmed_appointments();
			break;

			case 'read_slots':
			$main_obj = new Slot();

			$search = array( 'status'=>'1');
			if(isset($params['user_id'])){
				$user_id = $params['user_id'] ;
				$search['user_id'] = $user_id;
			}
			if(isset($params['user_id'])){
				$doctor_id = $params['doctor_id'] ;
				$search['doctor_id'] = $doctor_id;
			}
			if(isset($params['book'])){
				$search['clinic_id'] = clinic();
			}
			$c = $main_obj->read($search);
			
			$time = new DateTime('2011-11-17 00:00');
			$time2 = new DateTime('2011-11-17 00:30');
			$slots = array();
			$book_slots = array();
			$minutes_to_add = 30;
			global $days;
			$time_slots = array();
			foreach ($days as $day) {
				$book_slots[$day]=[];
				$book_slots[$day]['A']['availability']=0;
				$book_slots[$day]['B']['availability']=0;
				$book_slots[$day]['C']['availability']=0;
				$book_slots[$day]['D']['availability']=0;
				for($i=1;$i<=48;$i++){
					$slots[$day][$i]['slot'] =  $time->format('h:i A').'-'.$time2->format('h:i A');
					$time_slots[$i] = $slots[$day][$i]['slot'];
					$slots[$day][$i]['availability'] = 0;
					$time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
					$time2->add(new DateInterval('PT' . $minutes_to_add . 'M'));
				}
			}

			foreach ($c as $row) {
		       $tmp ="";
		       $tmp2 = array();
		       $tmp = $row['slot_1'];
		       $tmp2 = explode('-', $tmp);
		       if($tmp!=""){
			       for($i=0;$i<count($tmp2);$i++){
			           $slots[$row['day']][$tmp2[$i]]['availability']=1;
			       }		       	
		       }

		       if(count($tmp2)>0){
		       	if($tmp2[0]!=''){
					$book_slots[$row['day']]['A']['availability']=1;
					$book_slots[$row['day']]['A']['text'] = $time_slots[$tmp2[0]].'-'.$time_slots[$tmp2[count($tmp2)-1]];		       	
					$t= explode('-', $book_slots[$row['day']]['A']['text']);
					$book_slots[$row['day']]['A']['text'] = $t[0].'-'.$t[count($t)-1];
					
		       	}
		       }
		       
		       $tmp ="";
		       $tmp2 = array();
		       $tmp = $row['slot_2'];
		       $tmp2 = explode('-', $tmp);
		       if($tmp!=""){
			       for($i=0;$i<count($tmp2);$i++){
			           $slots[$row['day']][$tmp2[$i]]['availability']=1;
			       }		       	
		       }
		       //echo $tmp2[0];
		       //echo $tmp2[count($tmp2)-1];
		       //pr($time_slots);
		       if(count($tmp2)>0){
		       	if($tmp2[0]!=''){
		       		$book_slots[$row['day']]['B']['availability']=1;
			       $book_slots[$row['day']]['B']['text'] = $time_slots[$tmp2[0]].'-'.$time_slots[$tmp2[count($tmp2)-1]];	
					$t= explode('-', $book_slots[$row['day']]['B']['text']);
					$book_slots[$row['day']]['B']['text'] = $t[0].'-'.$t[count($t)-1];			       	       	
		       	}
		       }


		       $tmp ="";
		       $tmp2 = array();
		       $tmp = $row['slot_3'];
		       $tmp2 = explode('-', $tmp);
		       if($tmp!=""){
			       for($i=0;$i<count($tmp2);$i++){
			           $slots[$row['day']][$tmp2[$i]]['availability']=1;
			       }		       	
		       }
		       if(count($tmp2)>0){
		       	if($tmp2[0]!=''){
		       		$book_slots[$row['day']]['C']['availability']=1;
			       $book_slots[$row['day']]['C']['text'] = $time_slots[$tmp2[0]].'-'.$time_slots[$tmp2[count($tmp2)-1]];	
					$t= explode('-', $book_slots[$row['day']]['C']['text']);
					$book_slots[$row['day']]['C']['text'] = $t[0].'-'.$t[count($t)-1];			       	       	
		       	}
		       }

		       $tmp ="";
		       $tmp2 = array();
		       $tmp = $row['slot_4'];
		       $tmp2 = explode('-', $tmp);
		       if($tmp!=""){
			       for($i=0;$i<count($tmp2);$i++){
			           $slots[$row['day']][$tmp2[$i]]['availability']=1;
			       }		       	
		       }
		       if(count($tmp2)>0){
		       	if($tmp2[0]!=''){
		       	   $book_slots[$row['day']]['D']['availability']=1;
			       $book_slots[$row['day']]['D']['text'] = $time_slots[$tmp2[0]].'-'.$time_slots[$tmp2[count($tmp2)-1]];		
					$t= explode('-', $book_slots[$row['day']]['D']['text']);
					$book_slots[$row['day']]['D']['text'] = $t[0].'-'.$t[count($t)-1];			              	
		       	}
		       }		                          
			}
			if(isset($params['book'])){
				echo json_encode($book_slots);
			}else{
				echo json_encode($slots);				
			}

			break;

		case 'save_slots':

			$main_obj = new Slot();
			$params['slot_detail'] = json_decode($params['slot_detail']);


	 		foreach ($params['slot_detail'] as $key => $value) {
	 			$search = array('user_id'=>$params['user_id'], 'doctor_id'=>$params['doctor_id'], 'day'=>$key);
	 			$updateobj = array('clinic_id'=>clinic(), 'slot_1'=>$value[0],'slot_2'=>$value[1],'slot_3'=>$value[2],'slot_4'=>$value[3]);
	 			$data = $main_obj->update($updateobj, $search);
	 		}
			
			

			$json = array(); 
			$json['msg'] = "Clinic Details Updated";
			$json['status'] = true;

		echo json_encode($json);		
		break;	

		case 'get_appointments':
			$obj = new Appointment();
			$data = $obj->get_appointments($params['date']);
			echo json_encode($data);
		break;

		case 'patient_arrived':
				$main_obj = new Appointment();
				echo $main_obj->update(array('patient_arrived'=>1, 'weight_at_arrival'=>$params['weight_at_arrival']), array('id'=>$params['id']));
				break;

		case 'cancel_appointment':
				$main_obj = new Appointment();
				echo $main_obj->update(array('cancel'=>1), array('id'=>$params['id']));
				break;	

		case 'get_all_my_patients':
			$obj = new Patient();
			$list = $obj->read_list_view();
			echo json_encode($list);
		break;

		case 'fill_patient_details_by_user_id':
			$obj = new Patient();
			$list = $obj->fill_user_details($params['id']);
			echo json_encode($list[0]);
		break;
		case 'add_patient':
			$params = $params['patient'];
			if(isset($params['is_principal'])){
				unset($params['id']);
				unset($params['mobile_no_2']);
				unset($params['doctor_fees']);
				unset($params['doctor_procedure_charge']);
				unset($params['special_fees']);
				unset($params['doctor_fees_per']);
				unset($params['special_fees_per']);
				unset($params['doctor_procedure_charge_per']);
				unset($params['doctor_type']);
				unset($params['is_principal']);
				unset($params['specialties']);
				unset($params['rights']);
				unset($params['degree']);
				unset($params['user_id']);
				unset($params['updated_by']);
				unset($params['updated_on']);
				
			}
 
			$obj = new Patient();
			$params['created_by']= current_user();
			
			$params['status']= 1;	
			$json = array();
			if(isset($params['id']) && $params['id']!='' && isset($params['clinic_id']) && $params['clinic_id']==clinic()){
				$where = array('id'=>$params['id']);
				unset($params['id']);
				$res = $obj->update($params, $where);
				$json['msg'] = "Patient Updated";
				$json['status'] = true;					
			}else{
				   	if(isset($params['id'])){
				   		unset($params['id']);
				   	}
					$params['clinic_id']= clinic();
					$res = $obj->create($params);
					$json['msg'] = "New Patient Added";
					$json['status'] = true;				
			}
			echo json_encode($json);	
		break;	
		
		case 'login':
			$un = $_POST['email'];
			$pw = $_POST['password'];
			$auth = new Auth();
			$res = $auth->login($un, $pw);
			if(count($res) > 0 && $res[0]['password']==md5($pw)){
				$_SESSION['id'] 			= $res[0]['id'];
				$_SESSION['username'] 		= $res[0]['username'];
				$_SESSION['display_name']	= $res[0]['first_name'] ." ". $res[0]['last_name'];
				$_SESSION['rights']			= unserialize($res[0]['rights']);
				$json = array('msg'=>'Success', 'status'=>true, 'session'=>$_SESSION);
			}else if(count($res) > 0 && $res[0]['password']!=md5($pw)){
				$json = array('msg'=>'Invalid Password', 'status'=>false);
			}else{
				$json = array('msg'=>'Email Doesnot Exists', 'status'=>false);
			}
			echo json_encode($json);
		break;
		
		case 'logout':
			if ( !empty($_SESSION) ) {
				foreach ($_SESSION as $key => $value) {
					unset ($_SESSION[ $key ] );
				}
			}
			session_destroy();

			foreach ($_COOKIE as $key => $value ){
				unset($_COOKIE[ $key ]);
				//setcookie($key, '', time() - 3600, '/', COOKIE_DOMAIN);
			}

			unset($_SESSION);
			$Go = CMS_PATH."login.php";
			header("location:$Go");
		break;		

		case 'set_role':
			$_SESSION['current_role'] = $params['role'];
	        $clinic = new ManageClinics();
	        $my_clinics = $clinic->get_my_clinics($_SESSION['id']);
	        if($params['role'] =='doctor'){
	        	$my_clinics = $clinic->get_my_clinics_as_doctor($_SESSION['id']);
	        }
	        if($params['role'] =='nurse' || $params['role'] =='receptionist'){
	        	$my_clinics = $clinic->get_my_clinics_as_nurse_or_reception($_SESSION['id']);
	        }
	        echo json_encode($my_clinics);		
		break;

		case 'set_clinic':
			$_SESSION['current_clinic'] = $params['clinic'];
	        $clinic = new ManageClinics();
	        $d = $clinic->get_clinic_data();
	        $_SESSION['current_clinic_name'] = $d[0]['clinic_name'];
		break;		

		case 'change_password':
			$auth = new Auth();
			$password = $auth->read_password();

			$old  					= md5($params['old_password']);
			$new_password  			= md5($params['new_password']);
			$confirm_new_password 	= md5($params['confirm_new_password']);
			$json = array();
 			$un = $password[0]['email'];
 			$mobile = $password[0]['mobile_no_1'];
			if($password[0]['password'] != $old){
				$json['msg']='Invalid Old Password';
				$json['status'] = false;
			}	
			else if($new_password == $confirm_new_password){	
				$a = $auth->change_password($new_password);
				$email = array(
					'from'=> SUPPORT_EMAIL, 
					'to'=>$email,
					'subject'=>'Password Changed @CubeHMS',
					'body'=>'We have received your request to change your password, please use the below credentials to access.<br/>username: '.$un.'<br/>password: '.$params['new_password'].''
				); 
				
				$email_string = http_build_query($email);
				$sms ="Password Changed. Username:".$un." Password:".$params['new_password'];
	 			curl_mail($email_string);
	 			SendSMS($mobile, $sms);		
	 			ob_clean();			
				
				$json['msg']='Password changed successfully';
				$json['status'] = true;
			}else{
				$json['msg']='Password do not match';
				$json['status'] = false;
			}
			echo json_encode($json);
		break;

		case 'get_clinic_details':
			$obj = new ManageClinics();
			$json = $obj->get_clinic_data();
			echo json_encode($json[0]);
		break;


		case 'register_clinic':
 
			$user = array();
			$user['username'] = $params['form']['email'];
			$user['email'] = $params['form']['email'];
			$user['password'] = md5($params['form']['password']);
			$user['password_hash'] = md5(todays_datetime().$params['form']['password']);
			$user['first_name'] = $params['form']['first_name'];
			$user['middle_name'] = $params['form']['middle_name'];
			$user['last_name'] = $params['form']['last_name'];
			$user['mobile_no_1'] = $params['form']['mobile_no_1'];
			
			$user['country_id'] = $params['form']['country_id'];
			$user['state_id'] = $params['form']['state_id'];
			$user['city_id'] = $params['form']['city_id'];
			$user['area_id'] = $params['form']['area_id'];
			$user['status'] = 0;
			$user['rights'] = 'a:7:{s:5:"admin";s:1:"0";s:12:"clinic_admin";s:1:"1";s:6:"doctor";s:1:"0";s:7:"patient";s:1:"0";s:5:"nurse";s:1:"0";s:12:"receptionist";s:1:"0";s:11:"promo_agent";s:1:"0";}'; 
			$obj = new ManageClinics();
			$user_id = $obj->principal_doctor_user_create($user);

			$clinic = array();
			//$clinic['clinic_code'] = $params['form']['clinic_code'];
			$clinic['clinic_name'] = $params['form']['clinic_name'];
			$clinic['address'] = $params['form']['address'];
			$clinic['country_id'] = $params['form']['country_id'];
			$clinic['state_id'] = $params['form']['state_id'];
			$clinic['city_id'] = $params['form']['city_id'];
			$clinic['area_id'] = $params['form']['area_id'];
			//$clinic['landline_1'] = $params['form']['landline_1'];
			//$clinic['landline_country_code_1'] = $params['form']['landline_country_code_1'];
			//$clinic['landline_area_code_1'] = $params['form']['landline_area_code_1'];
			$clinic['mobile_no_1'] = $params['form']['mobile_no_1'];
			//$clinic['mobile_no_country_code_1'] = $params['form']['mobile_no_country_code_1'];
			$clinic['email_1'] = $params['form']['email'];
			$clinic['status'] = 1;
			$clinic['created_on'] = todays_datetime();
			$clinic['created_by'] = $user_id;
			$clinic_id = $obj->create($clinic);
			$obj->update_clinic_code(array('clinic_code'=>'C'.$clinic_id), array('id'=>$clinic_id));

			$doctor = array();
			$doctor['first_name'] = $params['form']['first_name'];
			$doctor['middle_name'] = $params['form']['middle_name'];
			$doctor['last_name'] = $params['form']['last_name'];
			$doctor['country_id'] = $params['form']['country_id'];
			$doctor['state_id'] = $params['form']['state_id'];
			$doctor['city_id'] = $params['form']['city_id'];
			$doctor['area_id'] = $params['form']['area_id'];
			$doctor['address'] = $params['form']['address'];
			$doctor['clinic_id'] = $clinic_id;
			$doctor['mobile_no_1'] = $params['form']['mobile_no_1'];
			$doctor['email_1'] = $params['form']['email'];
			$doctor['user_id']=$user_id;
			$doctor['created_by']=$user_id;
			$doctor['created_on']=todays_datetime();
			$doctor['status']=1;
			$doctor['is_principal'] = 'Yes';

			$nurse = array();
			$nurse['username']="nurse_C".$clinic_id.'@cubehms.net';
			$nurse['email']="nurse_C".$clinic_id.'@cubehms.net';
			$nurse['password']=md5("nurse");
			$nurse['clinic_id']=$clinic_id;
			$nurse['rights'] = 'a:7:{s:5:"admin";s:1:"0";s:12:"clinic_admin";s:1:"0";s:6:"doctor";s:1:"0";s:7:"patient";s:1:"0";s:5:"nurse";s:1:"1";s:12:"receptionist";s:1:"0";s:11:"promo_agent";s:1:"0";}'; 
			
			$obj->principal_doctor_user_create($nurse);

			$reception['username']="reception_C".$clinic_id.'@cubehms.net';
			$reception['email']="reception_C".$clinic_id.'@cubehms.net';
			$reception['password']=md5("reception");
			$reception['clinic_id']=$clinic_id;
			$reception['rights']='a:7:{s:5:"admin";s:1:"0";s:12:"clinic_admin";s:1:"0";s:6:"doctor";s:1:"0";s:7:"patient";s:1:"0";s:5:"nurse";s:1:"0";s:12:"receptionist";s:1:"1";s:11:"promo_agent";s:1:"0";}';
			$obj->principal_doctor_user_create($reception);

			$d= $obj->principal_doctor_create($doctor);

			$slot = new Slot();
			$slot->create_defaults(array('user_id'=>$user_id, 'doctor_id'=>$d));
			$email = array(
				'from'=> SUPPORT_EMAIL, 
				'to'=>$user['email'],
				'subject'=>'New Clinic Registration @CubeHMS',
				'body'=>'Hello '.$user['first_name'].', Your clinic <b>'.$params['form']['clinic_name'].'</b> has been registered.<br> <a href="'.CMS_PATH.'confirm.php?hash='.$user['password_hash'].'">Click Here to Complete registration process</a><br><br><table border="1"><tr><th>Type</th><th>Username</th><th>Password</th></tr><tr><th>Principal Doctor</th><td>'.$user['email'].'</td><td>'.$params['form']['password'].'</td></tr><tr><th>Nurse</th><td>'.$nurse['username'].'</td><td>nurse</td></tr><tr><th>Receptionist</th><td>'.$reception['username'].'</td><td>reception</td></tr></table>'); 
			
			$email_string = http_build_query($email);
			$sms ="Your clinic is sucessfully registered with us. Username:".$params['form']['email']." Password:".$params['form']['password'];

 			curl_mail($email_string);
 			SendSMS($params['form']['mobile_no_1'], $sms);
			break;

		case 'get_countries':
			$area = new Area();
			$data = $area->get_countries();
			echo json_encode($data);
			break;

		case 'get_states':
			$area = new Area();
			$data = $area->get_states($params['cid']);
			echo json_encode($data);
			break;

		case 'get_cities':
			$area = new Area();
			$data = $area->get_cities($params['sid']);
			echo json_encode($data);
			break;

		case 'get_areas':
			$area = new Area();
			$data = $area->get_areas($params['cid']);
			echo json_encode($data);
			break;

		case 'get_sepcialties':
			$area = new Area();
			$data = $area->get_sepcialties();
			echo json_encode($data);
			break;

		case 'update_clinic':
			$area = new ManageClinics();
			$data = $area->update($params['clinic']);
			$json = array();
			if($data==1){
				$json['msg'] = "Clinic Details Updated";
				$json['status'] = true;
			}else{
				$json['msg'] = "Clinic Details Update Failed";
				$json['status'] = false;				
			}
			echo json_encode($json);
			break;	
		
		case 'add_doctor':
			$params = $params['doctor'];
			if(isset($params['id']) && $params['id']!='' && isset($params['clinic_id']) &&($params['clinic_id'] == clinic()) ){
				$obj = new ManageDoctors();
				$where = array('id'=>$params['id']);
				unset($params['id']);
				unset($params['rights']);
				$data = $obj->doctor_update($params, $where);	
				$json = array();
				if($data==1){
					$json['msg'] = "Doctor Details Updated";
					$json['status'] = true;
				}else{
					$json['msg'] = "Doctor Details Update Failed";
					$json['status'] = false;				
				}
				echo json_encode($json);							
			}
			else if(isset($params['user_id']) && $params['user_id']!=''){
					$main_obj = new ManageDoctors();
					$arr = $main_obj->fill_doctor_details_by_user_id($params['id']);
					$arr = $arr[0];
					unset($arr['id']);
					$arr['created_by']=created_by();
					$arr['clinic_id']=clinic();
					$rights = unserialize($arr['rights']);
					$rights['doctor']=1;
					$rights=serialize($rights);
					unset($arr['rights']);
					$arr['doctor_fees'] = $params['doctor_fees'];
					$arr['doctor_fees_per'] = $params['doctor_fees_per'];
					$arr['doctor_procedure_charge'] = $params['doctor_procedure_charge'];
					$arr['doctor_procedure_charge_per'] = $params['doctor_procedure_charge_per'];
					$arr['special_fees'] = $params['special_fees'];
					$arr['special_fees_per'] = $params['special_fees_per'];
					$arr['is_principal'] = 'No';

					$user_params = array('rights'=>$rights);
					$user_where = array('id'=>$params['user_id']);
					$main_obj->update_user($user_params, $user_where);
					$o = $main_obj->doctor_create($arr);
					$slot = new Slot();
					$slot->create_defaults(array('user_id'=>$params['user_id'], 'doctor_id'=>$o));
					$json['msg'] = "Doctor Added";
					$json['status'] = true;	
					echo json_encode($json);	
				}else{
					unset($params['user_id']);
					$user = array();
					$params['password'] = $params['first_name'].rand(1234,2345);
					$user['username'] = $params['email_1'];
					$user['email'] = $params['email_1'];
					$user['password'] = md5($params['password']);
					$user['password_hash'] = md5(todays_datetime().$params['email_1']);
					$user['first_name'] = $params['first_name'];
					$user['middle_name'] = $params['middle_name'];
					$user['last_name'] = $params['last_name'];
					$user['mobile_no_1'] = $params['mobile_no_1'];
					$user['mobile_no_2'] = $params['mobile_no_2'];
					$user['country_id'] = $params['country_id'];
					$user['state_id'] = $params['state_id'];
					$user['area_id'] = $params['area_id'];
					$user['status'] = 0;
					$doctor['specialties'] = $params['specialties'];
					$user['rights'] = 'a:7:{s:5:"admin";s:1:"0";s:12:"clinic_admin";s:1:"0";s:6:"doctor";s:1:"1";s:7:"patient";s:1:"0";s:5:"nurse";s:1:"0";s:12:"receptionist";s:1:"0";s:11:"promo_agent";s:1:"0";}'; 
					$obj = new ManageClinics();
					$user_id = $obj->principal_doctor_user_create($user);		 	

					$doctor = array();
					$doctor['first_name'] = $params['first_name'];
					$doctor['middle_name'] = $params['middle_name'];
					$doctor['last_name'] = $params['last_name'];
					$doctor['country_id'] = $params['country_id'];
					$doctor['state_id'] = $params['state_id'];
					$doctor['city_id'] = $params['city_id'];
					$doctor['area_id'] = $params['area_id'];
					$doctor['mobile_no_1'] = $params['mobile_no_1'];
					$doctor['mobile_no_2'] = $params['mobile_no_2'];
					$doctor['email_1'] = $params['email_1'];
					$doctor['clinic_id'] = clinic();
					$doctor['user_id']=$user_id;
					$doctor['created_by']=current_user();
					$doctor['created_on']=todays_datetime();
					$doctor['status']=1;
					$doctor['is_principal'] = 'No';		
					$doctor['specialties'] = $params['specialties'];
					$doctor['doctor_fees'] = $params['doctor_fees'];
					$doctor['doctor_fees_per'] = $params['doctor_fees_per'];
					$doctor['doctor_procedure_charge'] = $params['doctor_procedure_charge'];
					$doctor['doctor_procedure_charge_per'] = $params['doctor_procedure_charge_per'];
					$doctor['special_fees'] = $params['special_fees'];
					$doctor['special_fees_per'] = $params['special_fees_per'];					
					$data = $obj->principal_doctor_create($doctor);
 					$slot = new Slot();
 					$slot->create_defaults(array('user_id'=>$user_id, 'doctor_id'=>$data));
					$json['msg'] = "Doctor Added";
					$json['status'] = true;				
			 
					
					$email = array(
						'from'=> SUPPORT_EMAIL, 
						'to'=>$user['email'],
						'subject'=>'New Registration @CubeHMS as Doctor @'.current_clinic_name(),
						'body'=>'Hello '.$user['first_name'].', You have beed added at clinic <b>'.current_clinic_name().'</b> as doctor.<br> <a href="'.CMS_PATH.'confirm.php?hash='.$user['password_hash'].'">Click Here to Complete registration process</a><br><br><table border="1"><tr><th>Type</th><th>Username</th><th>Password</th></tr><tr><th>Doctor</th><td>'.$user['email'].'</td><td>'.$params['password'].'</td></tr></table>'); 
					
					$email_string = http_build_query($email);
					curl_mail($email_string);
					ob_clean();
					echo json_encode($json);

				}				
			break;	
		case 'get_all_my_doctors':
			$obj = new ManageDoctors();
			$doctors = $obj->get_all_my_doctors();
			echo json_encode($doctors);
    		break;
		
		case 'fill_doctor_details_by_user_id':
			$obj = new ManageDoctors();
			$doctor = $obj->fill_doctor_details_by_user_id($params['id']);
			echo json_encode($doctor[0]);
    		break;	

		case 'global_doctors':
			$main_obj = new ManageDoctors();
			$global_doctors = $main_obj->global_doctors($params['q']);
			echo json_encode($global_doctors);
			break;

		case 'fill_doctor_details':
				$main_obj = new ManageDoctors();
				$global_doctors = $main_obj->fill_doctor_details($params['doctor_master_id']);
				echo json_encode($global_doctors[0]);
				break;	

		case 'global_patients':
				$main_obj = new Patient();
				$all_patients = $main_obj->global_patients($params['q']);
				echo json_encode($all_patients);
				//echo '[{"id":"856","name":"House"}]';
				# code...
			break;

		default:
			# code...
			break;
	}

function curl_mail($email_string){
	$ch = curl_init();                    // initiate curl
	$url = "http://www.cubehms.net/email.php"; // where you want to post data
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_POST, true);  // tell curl you want to post something
	curl_setopt($ch, CURLOPT_POSTFIELDS, $email_string); // define what you want to post
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // return the output in string format
	$output = curl_exec ($ch); // execute
	 
	curl_close ($ch); // close curl handle
	 
	var_dump($output); // show output	
}

function __autoload($className){
	if(file_exists(ROOT_PATH.'/classes/class.'.$className.'.php')){
		include_once(ROOT_PATH.'/classes/class.'.$className.'.php');	
	}
}	

function todays_datetime(){
return date('Y-m-d H:i:s');	
}

function todays_date(){
return date('Y-m-d');	
}
function created_by(){
	return $_SESSION['id'];
}

function updated_by(){
	return $_SESSION['id'];
}


function redirect($url){
	header('Location: '.$url);
}

function current_user(){
	return $_SESSION['id'];
}
function clinic(){
	return $_SESSION['current_clinic'];
}

function current_clinic_name(){
	return $_SESSION['current_clinic_name'];
}

function display_name(){
	return $_SESSION['display_name'];	
}

function build_nav(){
	$module = new Module();
	$res = $module->get_modules();
	$nav = array();
	foreach ($res as $key => $value) {
		$res[$key]['authorized']	= is_authorized_to_access(unserialize($value['permissions']));
	}

	$res = array_filter($res,function($a) {return $a['authorized'] =='yes';});

	$pars = array_filter($res,function($a) {return $a['is_parent'] =='yes';});
	$chis = array_filter($res,function($a) {return $a['is_parent'] =='no';});

	usort($pars, function($a, $b) {return $a['sort_order'] - $b['sort_order'];});

	usort($chis, function($a, $b) {return $a['parent_id'] - $b['parent_id'];});

	foreach ($pars as $par_key => $par_value) {
		$nav[] = $par_value;
		$tmp = array();
		foreach ($chis as $chi_key => $chi_value) {
			if($par_value['id'] == $chi_value['parent_id']){
				$tmp[] = $chi_value;
			}
		}
		usort($tmp, function($a, $b) {return $a['sort_order'] - $b['sort_order'];});
		foreach ($tmp as $key => $value) {
			$nav[] = $value;
		}
	}
	return $nav;
}

function pr($data){
	echo "<--------------<pre>";
	print_r($data);
	echo "</pre>-------------->";
}

function is_authorized_to_access($permissions){
	$rights = $_SESSION['rights'];

	foreach ($permissions as $key => $value) {
		if($permissions[$key] == $rights[$key] && $rights[$key]=='1'){
			return "yes";
		}
	}
	return "no";
}

function get_current_module(){
	$txt = explode("/", $_SERVER['REQUEST_URI']);
	return $txt[1];
}

function unconfirmed_appointments(){
	$main_obj = new Appointment();
	$data =  $main_obj->unconfirmed_appointments();
	
	if($_SERVER['REQUEST_METHOD']=='GET'){
		return $data[0]['unconfirmed'];
	}else{
		echo json_encode($data[0]);
	}
}

function all_user_emailids(){
	$auth = new Auth();
	$emails = $auth->all_user_emailids();
	return $emails;
}

function role(){
	return $_SESSION['current_role'];
}

    function SendSMS($to, $Message)
    {
    	
    	$Message = "[CubeIHMS] ".$Message;
 		$to = explode(' ', $to);
 		$to = $to[1];
		$sendsms =""; //initialize the sendsms variable
		$param['To'] = $to;
		$param['Message'] = $Message;
		$param['UserName'] = "maestros";
		$param['Password'] = "Pass@word1";
		$param['Mask'] = "MASTRO";
		 
		$param['Type'] = "Individual"; //Can be "Bulk/Group”
		//We need to URL encode the values
		foreach($param as $key=>$val)
		{
		$sendsms.= $key."=".urlencode($val);
		$sendsms.= "&"; //append the ampersand (&) sign after each parameter/value
		}
		$sendsms = substr($sendsms, 0, strlen($sendsms)-1);//remove last ampersand (&) sign from the sendsms
		$url = "http://www.smsgatewaycenter.com/library/send_sms_2.php?".$sendsms;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$curl_scraped_page = curl_exec($ch);
		curl_close($ch);
		echo $curl_scraped_page;	      
    }
?>