'use strict';
app.controller('clinicCtrl', function($scope, $http) {
	$scope.clinic = {};
	$scope.countries = [];
	$scope.states = [];
	$scope.cities = [];
	$scope.areas = [];

    $scope.validate_mobile_no = (function() {
        var regexp = /^(\+91[\-\s]?)\d{10}$/;
        return {
            test: function(value) {
                return regexp.test(value);
            }
        };
    })();

  $scope.save_new_area = function(){
    if($scope.new_area==''){
      $('#new_area_modal').modal('hide');
      return false;
    }
    var params =  {
            action: "save_new_area",
            name:$scope.new_area,
            city_id:$scope.clinic.city_id
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
			$scope.clinic.area_id = parseInt(res.data);
         }, 1000);
      }, function(){});    
  }

    $scope.trigger_new_area_modal = function(){
      if($scope.clinic.city_id==''){
        $.jGrowl("Select City First!");
        return false;
      }
      $('#new_area_modal').modal({ show: true});
    }


	$scope.save = function(){
		var params =  {
		        action: "update_clinic",
		        clinic:$scope.clinic
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
	    		$("#save").remove();
	    		setTimeout(function(){location.href="#clinic_dashboard";},2000);
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
	    .then(function(res){$scope.countries = res.data; $scope.get_states($scope.clinic.country_id);}, function(){});		
	}

 
	$( "#country_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.clinic.country_id = cid;
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
	    	$scope.get_cities($scope.clinic.state_id);
	    }, function(){});
   }

	$( "#state_id" ).change(function() {
	  var sid = $(this).val();
	  $scope.clinic.state_id = sid;
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
	    	$scope.get_areas($scope.clinic.city_id);
	    }, function(){});
   }

	$( "#city_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.clinic.city_id = cid;
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
	  $scope.clinic.area_id = aid;
	});  
});