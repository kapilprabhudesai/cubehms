'use strict';
app.controller('referralsCtrl', function($scope, $http, $routeParams) {
	
	$scope.countries = [];
	$scope.states = [];
	$scope.cities = [];
	$scope.areas = [];
	$scope.clinic = {};
	$scope.specialties = [];
	$scope.selected_specialties="";
	$scope.search_doctor_text = "";
	$scope.referrals = [];
	$scope.load_referrals = function(){
		var params =  {
		        action: "get_referral_list",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	console.log(res);
	    	$scope.referrals = res.data;
	    }, function(){

	    });	
	}
	$scope.referral = {
		id:'',
		clinic_name:'',
		first_name:'',
		middle_name:'',
		last_name:'',
		address:'',
		email_1:'',
		mobile_no_1:'',
		mobile_no_2:'',
		country_id:'',
		state_id:'',
		city_id:'',
		area_id:'',
		specialties: $scope.selected_specialties
	};
	
	$scope.save = function(){
		var params =  {
		        action: "add_referral",
		        referral:$scope.referral
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
	    		setTimeout(function(){location.href="#manage_referrals";},2000);
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}

	$scope.check_if_specialty_selected = function(id){
		var tmp = $scope.referral.specialties;
		tmp = tmp.split(",");
		if(tmp.indexOf(id) !== -1) {
		  return true;
		}else{
			return false;
		}
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
	    	$scope.referral.country_id = $scope.clinic.country_id;
	    	$scope.referral.state_id = $scope.clinic.state_id;
	    	$scope.referral.city_id = $scope.clinic.city_id;
	    	$scope.referral.area_id = $scope.clinic.area_id;
	    	$scope.get_countries();
	    }

	    function handleError(err){
	    	
	    }
	}
    setTimeout(function(){
    		$("select").select2({});
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
	    .then(function(res){$scope.countries = res.data; $scope.get_states($scope.referral.country_id);}, function(){});		
	}

 
	$( "#country_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.referral.country_id = cid;
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
	    	$scope.get_cities($scope.referral.state_id);
	    }, function(){});
   }

	$( "#state_id" ).change(function() {
	  var sid = $(this).val();
	  $scope.referral.state_id = sid;
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
	    	$scope.get_areas($scope.referral.city_id);
	    }, function(){});
   }

	$( "#city_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.referral.city_id = cid;
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
	  $scope.referral.area_id = aid;
	});  

   	$( "#specialties" ).change(function() {
	 $scope.selected_specialties = $(this).val().join(',');
	 $scope.referral.specialties = $scope.selected_specialties;
	});  

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
	    	$scope.specialties = res.data;
	    }, function(){});		
	}
	
	$scope.get_sepcialties();	
	$scope.load_referrals();



	$scope.load_referral = function(id){
		var params =  {
		        action: "fill_referral_details_by_id",
		        id:id
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.referral = res.data;
	    	console.log($scope.referral);
	    }, function(){

	    });	
	}
	if($routeParams.id !== undefined){
		$scope.load_referral($routeParams.id);
	}
});