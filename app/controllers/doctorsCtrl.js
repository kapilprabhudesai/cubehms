'use strict';
app.controller('doctorsCtrl', function($scope, $http, $routeParams) {
	
	$scope.countries = [];
	$scope.states = [];
	$scope.cities = [];
	$scope.areas = [];
	$scope.clinic = {};
	$scope.specialties = [];
	$scope.selected_specialties="";
	$scope.search_doctor_text = "";
	$scope.doctors = [];

  $scope.save_new_area = function(){
    if($scope.new_area==''){
      $('#new_area_modal').modal('hide');
      return false;
    }
    var params =  {
            action: "save_new_area",
            name:$scope.new_area,
            city_id:$scope.doctor.city_id
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
			$scope.doctor.area_id = parseInt(res.data);
         }, 1000);
      }, function(){});    
  }

    $scope.trigger_new_area_modal = function(){
      if($scope.doctor.city_id==''){
        $.jGrowl("Select City First!");
        return false;
      }
      $('#new_area_modal').modal({ show: true});
    }

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
	    }, function(){

	    });	
	}
	$scope.doctor = {
		id:'',
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
		specialties: $scope.selected_specialties,
		doctor_fees:'', 
		doctor_procedure_charge:'', 
		special_fees:'',
		doctor_fees_per:'', 
		doctor_procedure_charge_per:'',
		special_fees_per:''
	};
	
	$scope.save = function(){
		if($scope.doctor.first_name==''||$scope.doctor.last_name==''||$scope.doctor.address==''||$scope.doctor.email_1==''|| $scope.doctor.mobile_no_1==''||$scope.doctor.country_id==''||$scope.doctor.state_id==''||$scope.doctor.city_id==''){
			$.jGrowl("Fill Mandatory Fields!");
			return false;
		}
		var params =  {
		        action: "add_doctor",
		        doctor:$scope.doctor
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
	    		setTimeout(function(){location.href="#manage_doctors";},2000);
	    	}

	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}

	$scope.check_if_specialty_selected = function(id){
		var tmp = $scope.doctor.specialties;
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
	    	$scope.doctor.country_id = $scope.clinic.country_id;
	    	$scope.doctor.state_id = $scope.clinic.state_id;
	    	$scope.doctor.city_id = $scope.clinic.city_id;
	    	$scope.doctor.area_id = $scope.clinic.area_id;
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
	    .then(function(res){$scope.countries = res.data; $scope.get_states($scope.doctor.country_id);}, function(){});		
	}

 
	$( "#country_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.doctor.country_id = cid;
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
	    	$scope.get_cities($scope.doctor.state_id);
	    }, function(){});
   }

	$( "#state_id" ).change(function() {
	  var sid = $(this).val();
	  $scope.doctor.state_id = sid;
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
	    	$scope.get_areas($scope.doctor.city_id);
	    }, function(){});
   }

	$( "#city_id" ).change(function() {
	  var cid = $(this).val();
	  $scope.doctor.city_id = cid;
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
	  $scope.doctor.area_id = aid;
	});  


   	$( "#doctor_id" ).change(function() {
	  var aid = $(this).val();
	  $scope.availability.doctor_id = aid;
	});

	$( "#block_appointments" ).change(function() {
	  var aid = $(this).val();
	  $scope.availability.block_appointments = aid;
	});  


   	$( "#specialties" ).change(function() {
	 $scope.selected_specialties = $(this).val().join(',');
	 $scope.doctor.specialties = $scope.selected_specialties;
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
	$scope.load_doctors();



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
	    	$scope.doctor = res.data;
	    	console.log($scope.doctor);
	    }, function(){

	    });	
	}

	$scope.availability = {
		doctor_id:'',
		frm:'',
		till:'',
		resume:'',
		remark:'',
		block_appointments:''
	};
	$scope.availability_edit_flag=0;

	$scope.save_availability = function(){
		$scope.availability.frm = $("#from").val();
		$scope.availability.till = $("#till").val();
		$scope.availability.resume = $("#resume").val();
		
		if($scope.availability.frm=='' ||$scope.availability.till=='' ||$scope.availability.resume=='' ||$scope.availability.doctor_id=='' ||$scope.availability.remark=='' ||$scope.availability.block_appointments==''){
			$.jGrowl("All Fields Mandatory!");
			return false;
		}

		var fm = new Date($("#from").val());
		var tl = new Date($("#till").val());
		var re = new Date($("#resume").val());
		var td = new Date().toJSON().slice(0,10);
		var td = new Date(td);

		console.log(fm);
		console.log(tl);
		console.log(re);
		console.log(td);

		if(fm<td){
			$.jGrowl("FROM Date Should be Greater than or equal to TODAYS date");
			return false;
		}else if(tl<fm){
			$.jGrowl("TILL Date Should be Greater than or equal to FROM date");
			return false;
		}
		else if(re<tl){
			$.jGrowl("RESUME Date Should be Greater than or equal to TILL date");
			return false;
		}


		var params =  {
		        action: "save_availability",
		        availability:$scope.availability
		    };
		console.log(params);
		
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.get_availabilities();
	    	$.jGrowl("All Appointments Cancelled During This Time Span.");
	    }, function(){

	    });				
	}

	$scope.reset_availability = function(){

		$scope.availability = {
			doctor_id:'',
			frm:'',
			till:'',
			resume:'',
			remark:'',
			block_appointments
		};		
	}

	$scope.availabilities = {};
	$scope.get_availabilities = function(){
		var params =  {
		        action: "get_availabilities"
		    };
		
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.availabilities = res.data;
	    }, function(){

	    });				
	}		

	if($routeParams.id !== undefined){
		$scope.load_doctor($routeParams.id);
		$("#search_doctor_container").hide();
	}else if($routeParams.page !== undefined && $routeParams.page == 'availability'){
		$scope.get_availabilities();
		$(document).ready(function(){
	        $('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	        $('#datetimepicker2').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	        $('#datetimepicker3').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
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
});