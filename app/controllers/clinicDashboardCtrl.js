'use strict';
app.controller('clinicDashboardCtrl', function($scope, $http) {
	
	$scope.total = 0;
	$scope.completed = 0;
	$scope.pending = 0;

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


	$scope.add_to_list = function(user_id){
		var y = window.confirm("Do you want to add this patient to your list?");
		if(y==true){
			var params =  {
			        action: "add_patient_to_my_list",
			        id:user_id
			    };
			var serializedData = $.param(params);
		    $http({
		        url: CMS_PATH+"inc/functions.php",
		        method: "POST",
		        data: serializedData
		    })
		    .then(function(res){
		    	$scope.load_patients();
		    	alert("Patient Added To Your List!");
		    });				
		}
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
		$scope.appointment_slots = {};
	
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
	    	$scope.dashboard_stats();
	    	var data = res.data;
	    	console.log(data);
	    	for(var i=0;i<data.length;i++){
	    		console.log("data",data[i]);
	    		if($scope.appointment_slots[data[i].slot_text] === undefined){
	    			$scope.appointment_slots[data[i].slot_text] = [];
	    		} 
	    		$scope.appointment_slots[data[i].slot_text].push(data[i]);
	    		$scope.appointment_doctors.push({id:data[i].doctor_id, name:data[i].doctor_name});
	    	}
			$scope.appointment_doctors = _.uniq($scope.appointment_doctors, function(item, key, a) { 
				return item.id;
			});	 
			if($scope.appointment_doctors.length>0){
				$scope.appointment_selected_doctor = $scope.appointment_doctors[0].id;   			
			}
			console.log($scope.appointment_slots);
	
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


	$scope.dashboard_stats = function(){
		var params =  {
		        action: "dashboard_stats",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	var data = res.data;
	    	console.log(data);
	    	$scope.total = data.total;
	    	$scope.completed = data.completed;
	    	$scope.pending = data.pending;

	    }, function(){

	    });	
	}

	$scope.dashboard_stats();

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