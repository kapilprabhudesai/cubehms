'use strict';
app.controller('patientsCtrl', function($scope, $http, $routeParams) {

	$scope.countries = [];
	$scope.states = [];
	$scope.cities = [];
	$scope.areas = [];
	$scope.clinic = {};


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
	$scope.patient = {
		id:'',
		first_name:'',
		middle_name:'',
		last_name:'',
		address:'',
		email_1:'',
		mobile_no_1:'',
		landline_1:'',
		country_id:'',
		state_id:'',
		city_id:'',
		area_id:'',
		dob:'',
		gender:''
	};
	
	$scope.save = function(){
		$scope.patient.dob = $("#dob").val();
		var params =  {
		        action: "add_patient",
		        patient:$scope.patient
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
 
	    	if(res.data.status == true){
	    		$("#save").remove();
	    		setTimeout(function(){location.href="#manage_patients";},2000);
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}


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
	    .then(handleSuccess, handleError);		
	    function handleSuccess(res){
	    	$scope.clinic = res.data;
	    	$scope.patient.country_id = $scope.clinic.country_id;
	    	$scope.patient.state_id = $scope.clinic.state_id;
	    	$scope.patient.city_id = $scope.clinic.city_id;
	    	$scope.patient.area_id = $scope.clinic.area_id;
	    	$scope.get_countries();
	    }

	    function handleError(err){
	    	
	    }
	}
    setTimeout(function(){
    		//$("select").select2({}); 
	}, 1000);

	$scope.init();
	
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
	    .then(function(res){$scope.countries = res.data; $scope.get_states($scope.patient.country_id);}, function(){});		
	}

 
	$( "#country_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.patient.country_id = cid;
	  $scope.get_states(cid);
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
	    	$scope.get_cities($scope.patient.state_id);
	    }, function(){});
   }

	$( "#state_id" ).change(function() {
	  var sid = $(this).val();
	  $scope.patient.state_id = sid;
	  $scope.get_cities(sid);
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
	    	$scope.get_areas($scope.patient.city_id);
	    }, function(){});
   }

	$( "#city_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.patient.city_id = cid;
	  $scope.get_areas(cid);
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
	  $scope.patient.area_id = aid;
	});  
	

	$scope.load_patients();



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
	if($routeParams.id !== undefined){
		$scope.load_patient($routeParams.id);
		$("#search_patient_container").hide();
		$("#search_doctor_container").hide();
	}
	

    $scope.validate_mobile_no = (function() {
        var regexp = /^(\+91[\-\s]?)\d{10}$/;
        return {
            test: function(value) {
                return regexp.test(value);
            }
        };
    })();

$(document).ready(function () {
    $("#global_patients").tokenInput(CMS_PATH+"inc/functions.php?action=global_patients",{
    	minChars:2,tokenLimit:1,
    	onAdd:function(item){
    		$scope.load_patient(item.id);
    	},
        onDelete:function(item){
            location.reload();
        }
    });
});	

	$scope.load_doctor = function(id){
		var params =  {
		        action: "fill_doctor_details_by_user_id",
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
	    	console.log($scope.doctor);
	    }, function(){

	    });	
	}


$(document).ready(function () {
    $("#global_doctors").tokenInput(CMS_PATH+"inc/functions.php?action=global_doctors",{
    	minChars:2,tokenLimit:1,
    	onAdd:function(item){
    		$scope.load_doctor(item.id);
    	},
        onDelete:function(item){
            location.reload();
        }
    });
});	
	$(document).ready(function(){
        $('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	});
});