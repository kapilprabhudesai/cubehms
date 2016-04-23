'use strict';
app.controller('slotsCtrl', function($scope, $http) {
	$scope.slots = {};
	$scope.sl = ['A','B','C','D'];
	$scope.days = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

	$scope.doctor_id  = "";
	$scope.user_id  = "";



	$scope.check_class = function(k,i){
		var cls='';
		switch(parseInt($scope.slots[k][i].availability)){
			case 0: cls='btn-success'; break;
			case 1: cls='btn-danger';  break;
			case 2: cls='btn-warning'; break;
		}
		return cls;
	}

	$scope.set_val = function(k,i){
		if($scope.slots[k][i].availability==0){
			$scope.slots[k][i].availability = 2;
		}else{
			$scope.slots[k][i].availability = 0;		
		}

	}

	$scope.collapse_toggle = function(key){
		$('.collapse').collapse();
		$('#collapseOne-'+key).collapse('toggle');
	}
	$scope.set_doctor = function(u,d){
		$scope.user_id = u;
		$scope.doctor_id = d;
		$scope.slots = [];
		var params =  {
		        action: "read_slots_for_create",
		        user_id:u,
		        doctor_id:d
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.slots = (res.data);    
	    	console.log($scope.slots);	
	    	setTimeout(function(){
	    		$('.collapse').collapse();
	    		$('#datetimepickermon').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    		$('#datetimepickertue').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    		$('#datetimepickerwed').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    		$('#datetimepickerthu').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    		$('#datetimepickerfri').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    		$('#datetimepickersat').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    		$('#datetimepickersun').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	    	},500);
	    }, function(){

	    });
	}

	//$scope.change_doctor();

	$scope.ok = function(){
		var slot_detail = [];
		for(var i =0;i<$scope.days.length;i++){
			var obj = {};
			obj['valid_till'] = $("#valid_till_"+$scope.days[i]).val();
			var a = [];
			for(var j=1;j<=48;j++){
				if($scope.slots[$scope.days[i]][j].availability=='2'){
					a.push(j);
				}	
			}	
			obj.day = $scope.days[i];
			obj.slots = a.join('-');
			slot_detail.push(obj);	
		}
		slot_detail = JSON.stringify(slot_detail);
		var params =  {
		        action: "save_slots",
		        slot_detail:slot_detail,
		        user_id:$scope.user_id,
		        doctor_id:$scope.doctor_id
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
	    		setTimeout(function(){location.href="#clinic_dashboard";},2000);
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}

	$(document).ready(function(){

		
	});

	$scope.doctors = {};
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
	    	//console.log(res);
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.doctors[res.data[i].doctor_master_id] = res.data[i];
	    	}
	    	//console.log($scope.doctors);

	    }, function(){

	    });	
	}
	$scope.load_doctors();

});