'use strict';
app.controller('clinicDashboardCtrl', function($scope, $http) {
	
	$scope.appointment_slots = [];
	$scope.appointment_date = "";
	$scope.appointment_doctors = [];
	$scope.appointment_selected_doctor = "";
	$scope.searchKeyword="";
	$scope.print_fitness = function(divName) {
	var printContents = document.getElementById(divName).innerHTML;
	var popupWin = window.open('', '_blank', 'width=300,height=300');
	popupWin.document.open();
	popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
	popupWin.document.close();
	} 

	$scope.unconfirmed_appointments = function(){
		var params =  {
		        action: "unconfirmed_appointments"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	var data = res.data.unconfirmed;
	    	if(parseInt(data)>0){
	    		$("#unconfirmed_appointment_count").html(data+ " Unconf.");
	    	}
	    });		
	}
	$scope.unconfirmed_appointments();

	$scope.get_appointments = function(){
		$scope.appointment_doctors = [];
		$scope.appointment_slots = [{'slot_name':'Slot 1', 'appointments':[]}, {'slot_name':'Slot 2', 'appointments':[]}, {'slot_name':'Slot 3', 'appointments':[]}, {'slot_name':'Slot 4', 'appointments':[]}];
	
		var params =  {
		        action: "get_appointments",
		        date:$("#appointment_date").val()
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	var data = res.data;
	    	for(var i=0;i<data.length;i++){
	    		switch(data[i].slot_id){
	    			case "1": $scope.appointment_slots[0].appointments.push(data[i]); break;
	    			case "2": $scope.appointment_slots[1].appointments.push(data[i]); break;
	    			case "3": $scope.appointment_slots[2].appointments.push(data[i]); break;
	    			case "4": $scope.appointment_slots[3].appointments.push(data[i]); break;
	    		}
	    		$scope.appointment_doctors.push({id:data[i].doctor_id, name:data[i].doctor_name});
	    	}
			$scope.appointment_doctors = _.uniq($scope.appointment_doctors, function(item, key, a) { 
				return item.id;
			});	 
			if($scope.appointment_doctors.length>0){
				$scope.appointment_selected_doctor = $scope.appointment_doctors[0].id;   			
			}
	
	    }, function(){});
   }   

   	$scope.get_appointments(); 

   	$scope.arrive = function(id){
   		var weight_at_arrival = document.getElementById("weight_"+id).value;
   		if(weight_at_arrival ==''){
   			alert("Enter Weight!");
   			return false;
   		}
		var params =  {
		        action: "patient_arrived",
		        weight_at_arrival:weight_at_arrival,
		        id:id
		    };
		var y = window.confirm("Are you sure?");
		if(y== true){
			var serializedData = $.param(params);
		    $http({
		        url: CMS_PATH+"inc/functions.php",
		        method: "POST",
		        data: serializedData
		    })
		    .then(function(res){
		    	$scope.get_appointments(); 
		    }, function(){});
		}   		
   	}

   	$scope.cancel = function(id){
		var y = window.confirm("Are you sure?");
		if(y== true){   		
			var params =  {
			        action: "cancel_appointment",
			        id:id
			    };
			var serializedData = $.param(params);
		    $http({
		        url: CMS_PATH+"inc/functions.php",
		        method: "POST",
		        data: serializedData
		    })
		    .then(function(res){
		    	$scope.get_appointments(); 
		    }, function(){});   		
   		}
   	}   

	$(document).ready(function(){
            $('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	});

	$scope.patients = [];
	$scope.load_patients = function(){
		var params =  {
		        action: "get_all_my_patients",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.patients = res.data;
	    	console.log($scope.patients);
	    }, function(){

	    });	
	}

	$scope.load_patients();


	$scope.patient_actions = [];

	$scope.patient_selected = function(index,id){
		$scope.reset_patient_actions();
		$('#patient_selected_model').modal({ show: true});
		for(var i=0;i<$scope.patient_actions.length;i++){
			$scope.patient_actions[i].link += id; 
		}
	}

	$scope.reset_patient_actions = function(){
		$scope.patient_actions = [{icon:'icon-edit',name:'Edit Patient', link:'#/add_patient?id='},{icon:'icon-book',name:'Book Appointment', link:'#/book_appointment?id='},{icon:'icon-stethoscope',name:'Fitness Certificate', link:'#/add_fitness?id='}];		
    	if($scope.clinic.print_reg_slip=="true"){
			$scope.patient_actions.push({icon:'icon-print',name:'Print Slip', link:'#/add_fitness?reg='});		
    	}		
	}

	$scope.clinic= {};

	$scope.init  = function(){
		var params =  {
		        action: "get_clinic_details",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.clinic = res.data;
	    	if($scope.clinic.configured==0){
	    		location.href="#/edit_clinic_details";
	    	}
	    }, function(){

	    });
	}

	$scope.init();	
});