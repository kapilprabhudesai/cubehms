'use strict';
app.controller('manageCtrl', function($scope, $http, $routeParams) {

	$scope.appointment_id = "";

	if($routeParams.aid !== undefined){
		$scope.appointment_id = $routeParams.aid;
	}	

    $scope.clinic={};
    $scope.clinic_info  = function(){
        var params =  {
                action: "get_clinic_details",
            };
        var serializedData = $.param(params);
        $http({
            url: CMS_PATH+"inc/functions.php",
            method: "POST",
            data: serializedData
        })
        .then(handleSuccess);      
        function handleSuccess(res){
            $scope.clinic = res.data;
             
            if(res.data.print_reg_slip == "true"){
                $scope.clinic.print_reg_slip = true;
            }else{
                $scope.clinic.print_reg_slip = false;
            }

            if(res.data.print_bill == "true"){
                $scope.clinic.print_bill = true;
            }else{
                $scope.clinic.print_bill = false;
            }

            if(res.data.print_prescription == "true"){
                $scope.clinic.print_prescription = true;
            }else{
                $scope.clinic.print_prescription = false;
            }
            console.log($scope.clinic);
            if($scope.clinic.print_prescription == false && $scope.clinic.print_bill == false){
                $("#bil").hide();
            }else if($scope.clinic.print_prescription == true && $scope.clinic.print_bill == false){
                $("#bil").html("Print Prescription");
                $scope.ppb=1;
            }
            else if($scope.clinic.print_prescription == false && $scope.clinic.print_bill == true){
                $("#bil").html("Print Bill");
                $scope.ppb=2;
            }
            else if($scope.clinic.print_prescription == true && $scope.clinic.print_bill == true){

            }
        }
    }
    $scope.clinic_info();
    $scope.ppb=3;

    $scope.treatment  = {
        selected_fee:'',
    	amount:'',
    	sharing_amount:'',
    	high_bp:'',
    	low_bp:'',
    	pulse:'',
    	referral: [],
    	diagnosis:[],
    	drugs:[],
    	investigation:[],
    	history:{allergy:[]},
    	notes_n_advice:[]
    };


    $scope.trigger_new_modal = function(id,name){
        $scope.modal_capture="";
        $("#myModalLabel, #myModalLabel2").html("Add New "+name);
        $("#modal_capture").attr("placeholder", "Enter New "+name);
        $scope.modal_capture_type = id;
        $('#modal').modal({ show: true});
        setTimeout(function(){ 
            $("#modal_capture").focus();
        }, 1000);
    }

  $scope.modal_capture_type="";
  $scope.modal_capture="";
  $scope.save_modal = function(){
    if($scope.modal_capture==''){
      $('#modal').modal('hide');
      return false;
    }
    var params =  {
            action: "manage_add_combo",
            type: $scope.modal_capture_type,
            name:$scope.modal_capture
        };
 
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        $('#modal').modal('hide');
            if($scope.modal_capture_type=='investigation'){      
                $scope.all_investigations[res.data]=$scope.modal_capture;
                setTimeout(function(){ 
                        $( "#investigation_id" ).val(parseInt(res.data));
                        $scope.investigation_id = parseInt(res.data);
                        $("#investigation_id").select2();
                    
                 }, 1000);
            }
            else if($scope.modal_capture_type=='diagnosis'){     
                $scope.diagnosis[res.data]=$scope.modal_capture;
                setTimeout(function(){ 
                        $( "#diagnosis_id" ).val(parseInt(res.data));
                        $scope.diagnosis_id = parseInt(res.data);
                        $("#diagnosis_id").select2();
                    
                 }, 1000);
            }
            else if($scope.modal_capture_type=='drug'){      
                $scope.all_drugs[res.data]=$scope.modal_capture;
                setTimeout(function(){ 
                        $( "#drug_id" ).val(parseInt(res.data));
                        $scope.drug_id = parseInt(res.data);
                        $("#drug_id").select2();
                    
                 }, 1000);
            }           
      }, function(){});    
  }


$scope.change_fee = function(id){
 $scope.treatment.amount = $scope.fees[$scope.treatment.selected_fee].fee;
 $scope.treatment.sharing_amount = $scope.fees[$scope.treatment.selected_fee].per;
}
//Referral code starts
    $scope.referral_id = "";
    $scope.referral_comment = "";
    $scope.referral_clinics  = {};
    $scope.referral_edit = -1;

    $scope.add_referral = function(){
    	if($scope.referral_id!=""  && $scope.referral_comment!=""){
            console.log($scope.treatment);
	    	var obj = {clinic_id:$scope.referral_id, comment:$scope.referral_comment};
	    	$scope.treatment.referral.push(obj);
	    	$scope.referral_reset();
    	}else{
            $scope.mandatory_msg();
        } 
    }

    $scope.referral_reset = function(){
	    $scope.referral_id = "";
	    $scope.referral_comment = "";    
        $("#referral_id").val("");
        $("#referral_comment").val("");
        $("#referral_id").select2();
    }

    $scope.update_referral = function(){
        if($scope.referral_id!="" && $scope.referral_comment!=""){
        	var obj = {clinic_id:$scope.referral_id, comment:$scope.referral_comment};
        	$scope.treatment.referral[$scope.referral_edit]=obj;
        	$scope.referral_edit = -1;
        	$scope.referral_reset();
        }else{
            $scope.mandatory_msg();
        }    
    }

    $scope.edit_referral = function(ind){
    	$scope.referral_id = $scope.treatment.referral[ind].clinic_id;
    	$scope.referral_comment = $scope.treatment.referral[ind].comment;
        $("#referral_id").val($scope.treatment.referral[ind].clinic_id);
        $("#referral_comment").val($scope.treatment.referral[ind].comment);  
        $("#referral_id").select2();      
    	$scope.referral_edit = ind;
    }

    $scope.delete_referral = function(ind){
    	$scope.treatment.referral.splice(ind,1);
    	$scope.referral_reset();
    }

//Referral code ends



	/*Diagnosis Code Starts */

    $scope.diagnosis_id = "";
    $scope.diagnosis_comment = "";
    $scope.diagnosis_other_comment="";
    $scope.icd10  = {};
    $scope.diagnosis = {};
   	$scope.icd10_id = "";
   	$scope.diagnosis_id = "";
    $scope.diagnosis_edit = -1;

 

    $scope.add_diagnosis = function(){
    	if($scope.icd10_id!="" && $scope.diagnosis_id!="" && $scope.diagnosis_comment!=""){
	    	var obj = {icd10_id:$scope.icd10_id, diagnosis_id:$scope.diagnosis_id, other_diagnosis:$scope.diagnosis_other_comment, comment:$scope.diagnosis_comment};
	    	$scope.treatment.diagnosis.push(obj);
	    	$scope.diagnosis_reset();
	    	console.log($scope.treatment.diagnosis);
    	}else{
            $scope.mandatory_msg();
        }
    }

    $scope.diagnosis_reset = function(){
	    $scope.icd10_id = "";
	    $scope.diagnosis_id = "";
        $("#icd10_id").val("");
        $("#diagnosis_id").val("");
        $("#icd10_id").select2();
        $("#diagnosis_id").select2();
        
	    $scope.diagnosis_comment = "";  
	    $scope.diagnosis_other_comment = "";  	
	    $scope.diagnosis_edit = -1;
    }

    $scope.update_diagnosis = function(){
    	if($scope.icd10_id!="" && $scope.diagnosis_id!="" && $scope.diagnosis_comment!=""){
	    	var obj = {icd10_id:$scope.icd10_id, diagnosis_id:$scope.diagnosis_id, other_diagnosis:$scope.diagnosis_other_comment, comment:$scope.diagnosis_comment};
		    	$scope.treatment.diagnosis[$scope.diagnosis_edit]=obj;
		    	$scope.diagnosis_edit = -1;
		    	$scope.diagnosis_reset();
    	}else{
            $scope.mandatory_msg();
        }
    }

    $scope.edit_diagnosis = function(ind){
    	$scope.icd10_id = $scope.treatment.diagnosis[ind].icd10_id;
    	$scope.diagnosis_id = $scope.treatment.diagnosis[ind].diagnosis_id;
    	$scope.diagnosis_comment = $scope.treatment.diagnosis[ind].comment;
    	$scope.diagnosis_other_comment = $scope.treatment.diagnosis[ind].other_diagnosis;
    	$scope.diagnosis_edit = ind;
        $("#icd10_id").val($scope.treatment.diagnosis[ind].icd10_id);
        $("#diagnosis_id").val($scope.treatment.diagnosis[ind].diagnosis_id);
        $("#icd10_id").select2();
        $("#diagnosis_id").select2();        
    }

    $scope.delete_diagnosis = function(ind){
    	$scope.treatment.diagnosis.splice(ind,1);
    	$scope.diagnosis_reset();
    }
    /*Diagnosis Code Ends */




   /*Drug Code Starts*/
    $scope.drug_qty = "";
    $scope.drug_dose_1=""; 
    $scope.drug_dose_2=""; 
    $scope.drug_dose_3="";
    $scope.drug_dose_4=""; 
    $scope.drug_days=""; 
    $scope.drug_condition="";
    $scope.drug_remarks="";
    $scope.drug_id = "";
    $scope.all_drugs = {};
    $scope.drug_type_id = "";
    $scope.all_drug_types = {};
    $scope.drug_edit = -1;

    $scope.drug_reset = function(){
	    $scope.drug_qty = "";
	    $scope.drug_dose_1=""; 
	    $scope.drug_dose_2=""; 
	    $scope.drug_dose_3="";
	    $scope.drug_dose_4=""; 
	    $scope.drug_days=""; 
	    $scope.drug_condition="";
	    $scope.drug_remarks="";
	    $scope.drug_id="";
	    $scope.drug_type_id = "";
	    $scope.drug_edit = -1;
        $("#drug_id").val("");
        $("#drug_type_id").val("");
        $("#drug_id").select2();
        $("#drug_type_id").select2();
    }



    $scope.all_drug_types['3'] = 'DT3';
    $scope.all_drug_types['8'] = 'DT8';

    $scope.add_drugs = function(){
    	if($scope.drug_qty!="" &&$scope.drug_dose_1!="" &&$scope.drug_dose_2!="" &&$scope.drug_dose_3!="" &&$scope.drug_dose_4!="" &&$scope.drug_days!="" &&$scope.drug_id!="" && $scope.drug_type_id!=""){
	    	var obj = {drug_id:$scope.drug_id, drug_type_id:$scope.drug_type_id,drug_qty:$scope.drug_qty,drug_dose_1:$scope.drug_dose_1, drug_dose_2:$scope.drug_dose_2, drug_dose_3:$scope.drug_dose_3, drug_dose_4:$scope.drug_dose_4, drug_days: $scope.drug_days,drug_condition:$scope.drug_condition, drug_remarks:$scope.drug_remarks};
	    	$scope.treatment.drugs.push(obj);
	    	$scope.drug_reset();
	    	console.log($scope.treatment.drugs);
    	}else{
            $scope.mandatory_msg();
        }
    }

    $scope.edit_drugs = function(ind){
    	$scope.drug_id = $scope.treatment.drugs[ind].drug_id;
    	$scope.drug_type_id = $scope.treatment.drugs[ind].drug_type_id;
	    $scope.drug_qty = $scope.treatment.drugs[ind].drug_qty;
	    $scope.drug_dose_1=$scope.treatment.drugs[ind].drug_dose_1;
	    $scope.drug_dose_2=$scope.treatment.drugs[ind].drug_dose_2;
	    $scope.drug_dose_3=$scope.treatment.drugs[ind].drug_dose_3;
	    $scope.drug_dose_4=$scope.treatment.drugs[ind].drug_dose_4;
	    $scope.drug_days=$scope.treatment.drugs[ind].drug_days;
	    $scope.drug_condition=$scope.treatment.drugs[ind].drug_condition;
	    $scope.drug_remarks=$scope.treatment.drugs[ind].drug_remarks;
        $("#drug_id").val($scope.treatment.drugs[ind].drug_id);
        $("#drug_type_id").val($scope.treatment.drugs[ind].drug_type_id);
        $("#drug_id").select2();
        $("#drug_type_id").select2();        
    	$scope.drug_edit = ind;
    }

    $scope.update_drugs = function(){
        if($scope.drug_qty!="" &&$scope.drug_dose_1!="" &&$scope.drug_dose_2!="" &&$scope.drug_dose_3!="" &&$scope.drug_dose_4!="" &&$scope.drug_days!="" &&$scope.drug_id!="" && $scope.drug_type_id!=""){
	    	var obj = {drug_id:$scope.drug_id, drug_type_id:$scope.drug_type_id,drug_qty:$scope.drug_qty,drug_dose_1:$scope.drug_dose_1, drug_dose_2:$scope.drug_dose_2, drug_dose_3:$scope.drug_dose_3, drug_dose_4:$scope.drug_dose_4, drug_days: $scope.drug_days,drug_condition:$scope.drug_condition, drug_remarks:$scope.drug_remarks};

		    	$scope.treatment.drugs[$scope.drug_edit]=obj;
		    	$scope.drug_edit = -1;
		    	$scope.drug_reset();
    	}else{
            $scope.mandatory_msg();
        }
    }

    $scope.delete_drugs = function(ind){
    	$scope.treatment.drugs.splice(ind,1);
    	$scope.drug_reset();
    }
    /*Drug Code Ends*/



	/*Investigation Code Starts */

    $scope.investigation_id = "";
    $scope.investigation_remark = "";
    $scope.investigation_ref = "";


    $scope.all_investigations  = {};
    //get_all_investigations
    $scope.investigation_edit = -1;


    $scope.mandatory_msg =function(){
        $.jGrowl("Fill Out All Mandatory Fields!");
    }

    $scope.add_investigation = function(){
    	if($scope.investigation_id!="" && $scope.investigation_ref!=""){
    	var obj = {investigation_id:$scope.investigation_id, remark:$scope.investigation_remark , ref_id:$scope.investigation_ref};

	    	$scope.treatment.investigation.push(obj);
	    	$scope.investigation_reset();
    	}else{
            $scope.mandatory_msg();
        }
    }

    $scope.investigation_reset = function(){
	    $scope.investigation_id = "";
	    $scope.investigation_remark = ""; 
	    $scope.investigation_ref = ""; 
        $("#investigation_id").val("");
        $("#investigation_ref").val("");
        $("select").select2();
	    $scope.investigation_edit = -1;  	
    }

    $scope.update_investigation = function(){
    	if($scope.investigation_id!="" && $scope.investigation_ref!=""){
	    	var obj = {investigation_id:$scope.investigation_id, remark:$scope.investigation_remark , ref_id:$scope.investigation_ref};
	    	$scope.treatment.investigation[$scope.investigation_edit]=obj;
	    	$scope.investigation_edit = -1;
	    	$scope.investigation_reset();
    	}else{
            $scope.mandatory_msg();
        }
    }

    $scope.edit_investigation = function(ind){
    	$scope.investigation_id = $scope.treatment.investigation[ind].investigation_id;
    	$scope.investigation_remark = $scope.treatment.investigation[ind].remark;
    	$scope.investigation_ref = $scope.treatment.investigation[ind].ref_id;
        $("#investigation_id").val($scope.treatment.investigation[ind].investigation_id);
        $("#investigation_ref").val($scope.treatment.investigation[ind].ref_id);
        $("select").select2();        
    	$scope.investigation_edit = ind;
    }

    $scope.delete_investigation = function(ind){
    	$scope.treatment.investigation.splice(ind,1);
    	$scope.investigation_reset();
    }

    /*Investigation Code Ends */


	/*History-Allergy Code Starts */
    $scope.allergy_type_id = "";
    $scope.allergy_generic_name_id = "";
    $scope.allergy_drug_name_id = "";
    $scope.allergy_reaction = "";
    $scope.allergy_other = "";


    $scope.allergy_types  = {};
    $scope.allergy_generic_names  = {};
    $scope.allergy_drug_names  = {};
    
    //get_all_investigations
    $scope.allergy_edit = -1;


    $scope.allergy_types['13'] = 'D13';
    $scope.allergy_types['16'] = 'D16';

	$scope.allergy_generic_names['13'] = 'GN1';
	$scope.allergy_generic_names['16'] = 'GN2';

    $scope.allergy_drug_names['13'] = 'DN13';
    $scope.allergy_drug_names['16'] = 'DN16';

    $scope.add_allergy = function(){

    	if($scope.allergy_type_id>=0){
    	var obj = {allergy_type_id:$scope.allergy_type_id, allergy_generic_name_id:$scope.allergy_generic_name_id, allergy_drug_name_id:$scope.allergy_drug_name_id, reaction:$scope.allergy_reaction , other:$scope.allergy_other};

	    	$scope.treatment.history.allergy.push(obj);
            console.log(obj);
	    	$scope.allergy_reset();
    	}
    }

    $scope.allergy_reset = function(){
        $scope.allergy_type_id = "";
        $scope.allergy_generic_name_id = "";
        $scope.allergy_drug_name_id = "";
        $scope.allergy_reaction = "";
        $scope.allergy_other ="";
    }

    $scope.update_allergy = function(){
    	if($scope.allergy_type_id>=0){
	    	var obj = {allergy_type_id:$scope.allergy_type_id, allergy_generic_name_id:$scope.allergy_generic_name_id, allergy_drug_name_id:$scope.allergy_drug_name_id, reaction:$scope.allergy_reaction , other:$scope.allergy_other};
            $scope.treatment.history.allergy[$scope.allergy_edit]=obj;
	    	$scope.allergy_edit = -1;
	    	$scope.investigation_reset();
    	}
    }

    $scope.edit_allergy = function(ind){
    	$scope.allergy_type_id = $scope.treatment.history.allergy[ind].allergy_type_id;
        $scope.allergy_generic_name_id = $scope.treatment.history.allergy[ind].allergy_generic_name_id;
        $scope.allergy_drug_name_id = $scope.treatment.history.allergy[ind].allergy_drug_name_id;
        $scope.allergy_reaction = $scope.treatment.history.allergy[ind].reaction;
        $scope.allergy_other = $scope.treatment.history.allergy[ind].other;

    	$scope.allergy_edit = ind;
    }


    $scope.done = function(){
        var str = encodeURIComponent(JSON.stringify($scope.treatment));
        $("#sav").innerHTML="Saving...";
 
        $.post(CMS_PATH + 'inc/functions.php', {
            'str':str,
            'appointment_id':$scope.appointment_id,
            'action': 'save_investigation'
        },function(data) {
            alert("Saved");
        }); 
    }


    $scope.delete_allergy = function(ind){
    	$scope.treatment.history.allergy.splice(ind,1);
    	$scope.allergy_reset();
    }
	/*History-Allergy Code Ends */


	/*Notes And Advice Code Starts */

    $scope.note = "";
    $scope.advice = "";
    $scope.na_edit = -1;

    $scope.add_notes = function(){
    	if($scope.note != ""){
	    	var obj = {note:$scope.note, advice:$scope.advice};
	    	$scope.treatment.notes_n_advice.push(obj);
	    	$scope.na_reset();
    	}
    }

    $scope.na_reset = function(){
	    $scope.note = "";
	    $scope.advice = ""; 
	    $scope.na_edit = -1;   	
    }

    $scope.update_notes = function(){
    	var obj = {note:$scope.note, advice:$scope.advice};
    	$scope.treatment.notes_n_advice[$scope.na_edit]=obj;
    	$scope.na_edit = -1;
    	$scope.na_reset();
    }

    $scope.edit_note_n_advice = function(ind){
    	$scope.note = $scope.treatment.notes_n_advice[ind].note;
    	$scope.advice = $scope.treatment.notes_n_advice[ind].advice;
    	$scope.na_edit = ind;
    }

    $scope.delete_note_n_advice = function(ind){
    	$scope.treatment.notes_n_advice.splice(ind,1);
    	$scope.na_reset();
    }
    /*Notes And Advice Code Ends */   

    $scope.doctor = {};

    $scope.fees = {};
    $scope.patient = {};
    $scope.load_investigation = function(){
        var params =  {
                action: "load_investigation",
                appointment_id:$scope.appointment_id
            };
        var serializedData = $.param(params);
        $http({
            url: CMS_PATH+"inc/functions.php",
            method: "POST",
            data: serializedData
        })
        .then(function(res){
            console.log(res.data);
            $scope.doctor = res.data.doctor;
            $scope.patient = res.data.patient;
              
             $scope.fees['doctor_fees'] = {name:'Doctor Fees', fee:res.data.doctor.doctor_fees, per:res.data.doctor.doctor_fees_per};
             $scope.fees['doctor_procedure_charge'] = {name:'Doctor Procedure Charge', fee:res.data.doctor.doctor_procedure_charge, per:res.data.doctor_procedure_charge_per};
             $scope.fees['special_fees'] = {name:'Special Fees', fee:res.data.doctor.special_fees, per:res.data.doctor.special_fees_per};
             if(JSON.parse(decodeURIComponent(res.data.investigation))!=null){
                 $scope.treatment = JSON.parse(decodeURIComponent(res.data.investigation));                
             }

            //            console.log( $scope.treatment);
        }, function(){

        }); 
    }    



//combos
  $scope.get_referral_clinics = function(){
    var params =  {
            action: "get_referral_clinics"
        };
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        for(var i=0;i<res.data.length;i++){
            $scope.referral_clinics[res.data[i].id] = res.data[i].name;
        }
      }, function(){});
   }  
   $scope.get_referral_clinics();


//combos
  $scope.get_all_icd10 = function(){
    var params =  {
            action: "get_all_icd10"
        };
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        for(var i=0;i<res.data.length;i++){
            $scope.icd10[res.data[i].id] = res.data[i].name;
        }
      }, function(){});
   }  
   $scope.get_all_icd10();


  $scope.get_all_diagnosis = function(){
    var params =  {
            action: "get_all_diagnosis"
        };
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        for(var i=0;i<res.data.length;i++){
            $scope.diagnosis[res.data[i].id] = res.data[i].name;
        }
      }, function(){});
   }  
   $scope.get_all_diagnosis();

  $scope.get_all_drugs = function(){
    var params =  {
            action: "get_all_drugs"
        };
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        for(var i=0;i<res.data.length;i++){
            $scope.all_drugs[res.data[i].id] = res.data[i].name;
        }
      }, function(){});
   }  
   $scope.get_all_drugs();

    $scope.load_investigation();


    $scope.get_all_investigations = function(){
        var params =  {
                action: "get_all_investigations"
            };
        var serializedData = $.param(params);
        $http({
            url: CMS_PATH+"inc/functions.php",
            method: "POST",
            data: serializedData
        })
        .then(function(res){
            for(var i=0;i<res.data.length;i++){
                $scope.all_investigations[res.data[i].id] = res.data[i].name;    
            }
            $("select").select2();
        }, function(){

        });         
    }
    $scope.get_all_investigations();    


    $( "#investigation_id" ).change(function() {
        var id = $(this).val();
        $scope.investigation_id = id;
    });  
    $( "#investigation_ref" ).change(function() {
        var id = $(this).val();
        $scope.investigation_ref = id;
    });   
    $( "#referral_id" ).change(function() {
        var id = $(this).val();
        $scope.referral_id = id;
    });   


    $( "#icd10_id" ).change(function() {
        var id = $(this).val();
        $scope.icd10_id = id;
    });   
    $( "#diagnosis_id" ).change(function() {
        var id = $(this).val();
        $scope.diagnosis_id = id;
    });   
  

    $( "#drug_id" ).change(function() {
        var id = $(this).val();
        $scope.drug_id = id;
    });   
    $( "#drug_type_id" ).change(function() {
        var id = $(this).val();
        $scope.drug_type_id = id;
    });   
  
});