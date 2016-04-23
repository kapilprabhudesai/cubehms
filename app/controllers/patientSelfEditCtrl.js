'use strict';
app.controller('patientSelfEditCtrl', function($scope, $http, $routeParams) {

	$scope.countries = [];
	$scope.states = [];
	$scope.cities = [];
	$scope.areas = [];
	$scope.clinic = {};


	$scope.patients = [];

  $scope.save_new_area = function(){
    if($scope.new_area==''){
      $('#new_area_modal').modal('hide');
      return false;
    }
    var params =  {
            action: "save_new_area",
            name:$scope.new_area,
            city_id:$scope.patient.city_id
        };
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        $('#new_area_modal').modal('hide');
        $scope.areas.push({id:res.data, name:$scope.new_area});
        console.log(res.data);
        setTimeout(function(){ 
			$( "#area_id" ).val(parseInt(res.data));
			$("#area_id").select2();
			$scope.patient.area_id = parseInt(res.data);
         }, 1000);
      }, function(){});    
  }

    $scope.trigger_new_area_modal = function(){
      if($scope.patient.city_id==''){
        $.jGrowl("Select City First!");
        return false;
      }
      $('#new_area_modal').modal({ show: true});
    }


 
	$scope.patient = {
		id:'',
		first_name:'',
		middle_name:'',
		last_name:'',
		address:'',
		email:'',
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
		        patient:$scope.patient,
		        self:true
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
	    		setTimeout(function(){location.href="#patient_dashboard";},2000);
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}
	
	
 
	
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
	



	$scope.load_patient = function(id){
		var params =  {
		        action: "fill_patient_details_by_user_id"
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
 

    $scope.validate_mobile_no = (function() {
        var regexp = /^\d{10}$/;
        return {
            test: function(value) {
                return regexp.test(value);
            }
        };
    })();
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
$scope.load_patient();
	$(document).ready(function(){
        $('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	});
});