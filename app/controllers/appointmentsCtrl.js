'use strict';
app.controller('appointmentsCtrl', function($scope, $http, $routeParams) {
	$scope.patient = {};
	  	$scope.sl = ['A','B','C','D'];
		$scope.days = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	$scope.unconfirmed = 0;
	$scope.my_appointments = [];
	$scope.get_my_appointments = function(){
		var params =  {
		        action: "my_present_and_future_appointments"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.my_appointments = res.data;
	    	$scope.unconfirmed = 0;
	    	for(var i=0;i<$scope.my_appointments.length;i++){
	    		if($scope.my_appointments[i]['confirmed_by_doctor'] == 0){
	    			$scope.unconfirmed++;
	    		}
	    	}
	    	$("#unconfirmed_appointment_count").html($scope.unconfirmed+" Unconf.");
	    	console.log($scope.unconfirmed);
	    }, function(){

	    });	
	}
	$scope.get_my_appointments();

	$scope.confirm_appointment = function(app_id){
		var params =  {
		        action: "confirm_appointment",
		        appointment_id:app_id
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	console.log(res.data);
	    	if(res.data.status == true){
	    		$scope.get_my_appointments();
	    		$.jGrowl(res.data.msg);
	    	}
	    }, function(){

	    });	
	}
	$scope.load_patient = function(id){
		var params =  {
		        action: "fill_patient_details_by_user_id",
		        id:id
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.patient = res.data;
	    	console.log($scope.patient);
	    }, function(){

	    });	
	}
	$scope.slots = [];
	$scope.search_params = {};

	$scope.book = function(slot_id, text){
		$scope.search_params.slot_id = slot_id;
		$scope.search_params.slot_text = text;

		var y = window.confirm("Are you sure?");
		if(y==true){
		var params =  {
		        action: "book_appointment",
		        slot_text:$scope.search_params.slot_text,
		        slot_id:$scope.search_params.slot_id,
		        doctor_id:$scope.search_params.doctor_id,
		        patient_id:$routeParams.id,
		        appointment_date:$scope.search_params.appointment_date
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	if(res.data.status == true){
	    		setTimeout(function(){location.href="#clinic_dashboard";},2000);
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });				
		}
	}

	$scope.selected_day = "";

	$scope.search_slot = function(){
		var dt = document.getElementById("doa").value;
		var d = new Date(dt);
		var doctor_id=$( "#doctor_id" ).val();
		$scope.selected_day = ($scope.days[d.getDay()-1]);
		//$scope.slots = $scope.doctor_slots[doctor_id][d.getDay()];
		$scope.search_params.doctor_id = doctor_id;
		$scope.search_params.appointment_date = dt;
	}

	$scope.doctors = [];
	$scope.load_doctors = function(){
		var params =  {
		        action: "get_all_my_doctors",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.doctors = res.data;
	    	console.log($scope.doctors);
	    	var ids = "";
	    }, function(){

	    });	
	}



	if($routeParams.id !== undefined){
		$scope.load_patient($routeParams.id);
		$scope.load_doctors(); 
	}

	$scope.doctor_slots = [];
	$scope.get_slots = function(did){
		var params =  {
		        action: "read_slots",
		        doctor_id:did,
		        book:1
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	console.log(res.data);
	    	$scope.doctor_slots = (res.data);
	    	
	    }, function(){

	    });		
	}
	$(document).ready(function(){
    	$('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
		$( "#doctor_id" ).change(function() {
			var did = $(this).val();
			$scope.get_slots(did);
		});

	});

});