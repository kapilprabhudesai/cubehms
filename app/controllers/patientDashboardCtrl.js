'use strict';
app.controller('patientDashboardCtrl', function($scope, $http, $routeParams) {

	$scope.search = {
		country_id:'',
		state_id:'',
		city_id:'',
		specialties:''
	};
	$scope.get_countries = function(){
		var params =  {
		        action: "get_countries",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){$scope.countries = res.data; $scope.get_states($scope.search.country_id);}, function(){});		
	}

 	$( "#country_id" ).val(1);
	$( "#country_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.search.country_id = cid;
	  $scope.get_states(cid);
	  $scope.patient_doctor_search();
	});

	$scope.get_states = function(cid){
		var params =  {
		        action: "get_states",
		        cid:cid
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.states = res.data;
	    	$scope.get_cities($scope.search.state_id);
	    }, function(){});
   }

	$( "#state_id" ).change(function() {
	  var sid = $(this).val();
	  $scope.search.state_id = sid;
	  $scope.get_cities(sid);
	  $scope.patient_doctor_search();
	});

	$scope.get_cities = function(sid){
		var params =  {
		        action: "get_cities",
		        sid:sid
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.cities = res.data;
	    	$scope.get_areas($scope.search.city_id);
	    }, function(){});
   }

	$( "#city_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.search.city_id = cid;
	  $scope.patient_doctor_search();
	});

	$scope.get_areas = function(cid){
		var params =  {
		        action: "get_areas",
		        cid:cid
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.areas = res.data;
	    }, function(){});
   }   

   	$( "#area_id" ).change(function() {
	  var aid = $(this).val();
	  $scope.search.area_id = aid;
	  $scope.patient_doctor_search();
	});  
	$scope.get_countries();






	$scope.specialties = [];
	$scope.specialties_keys = {};
	$scope.selected_specialties="";

	$scope.check_if_specialty_selected = function(id){
		var tmp = $scope.specialties;
		tmp = tmp.split(",");
		if(tmp.indexOf(id) !== -1) {
		  return true;
		}else{
			return false;
		}
	}
	$scope.get_sepcialties = function(){
		var params =  {
		        action: "get_sepcialties"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.specialties_keys[res.data[i].id] = res.data[i].name;
	    	}
	    	$scope.specialties = res.data;
	    	$("select").select2();
	    }, function(){});		
	}
$( "#specialties" ).change(function() {
	console.log("test",$(this).val());
	if($(this).val()!=null){
		$scope.selected_specialties = $(this).val().join(',');
	}else{
		$scope.selected_specialties ="";
	}
	
	$scope.search.specialties = $scope.selected_specialties;
	$scope.patient_doctor_search();
}); 
	$scope.get_sepcialties();		

	$scope.searched_doctors = [];
	$scope.patient_doctor_search = function(){
		var params =  {
		        action: "patient_doctor_search",
				country_id:$scope.search.country_id,
				state_id:$scope.search.state_id,
				city_id:$scope.search.city_id,
				specialties:$scope.search.specialties
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
	    		console.log(data[i]);
	    		var x = data[i].specialties.split(',');
	    		data[i].specs = x;
	    	}
	    	$scope.searched_doctors =data;
	    }, function(){});		
	}

	$scope.pulled_slot = {};


	$scope.book = function(slot_id, slot_text){
		if($("#query").val()==""){
			alert("Enter Your Query!");
			return false;
		}
		var y = window.confirm("Are you sure?");
		if(y==true){
		var params =  {
		        action: "book_appointment_online",
		        slot_text:slot_text,
		        slot_id:slot_id,
		        doctor_id:$scope.pulled_slot.user_id,
		        clinic_id:$scope.pulled_slot.clinic_id,
		        appointment_date:$scope.pulled_slot.dt,
		        qry:$("#query").val()
		    };
		var serializedData = $.param(params);
		$('#book_modal').modal('hide');
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });				
		}
		$('#book_modal').modal('hide');
	}


	$scope.fetch_slots = function(doctor_id, user_id, dt){
		var params =  {
		        action: "fetch_slots",
		        doctor_id:doctor_id,
		        user_id:user_id,
		        dt:dt
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.pulled_slot  =res.data;
	    	$('#book_modal').modal({ show: true});
	    }, function(){});			
	}
});


