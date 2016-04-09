'use strict';
app.controller('slotsCtrl', function($scope, $http) {
	$scope.slots = {};
	$scope.sl = ['A','B','C','D'];
	$scope.days = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

	$scope.doctor_id  = "";
	$scope.user_id  = "";

	$scope.set_val = function(k,s,i){
		var a=[];
		$('.'+k+'_'+s).each( function() {
		    if($( this ).attr("checked") == 'checked'){
		    	var x = ($( this ).attr("id"));
		    	x = x.split('_');
		    	a.push(parseInt(x[2]));
		    }
		});		
		console.log(a);
		if(a.length==2){
			for(var m=a[0];m<=a[1];m++){
				$("#"+k+"_"+s+"_"+m).attr("checked", "checked");				
			}
			$("."+k+"_"+s).attr("disabled", "disabled");
			for(var j=0;j<$scope.sl.length;j++){
				if(s==$scope.sl[j]){
					continue;
				}
				for(var m=0;m<=a[1];m++){
					$("#"+k+"_"+$scope.sl[j]+"_"+m).attr("disabled", "disabled");
				}		
			}	
		}

	}
	$scope.set_doctor = function(u,d){
		$scope.user_id = u;
		$scope.doctor_id = d;
		$scope.slots = [];
		var params =  {
		        action: "read_slots",
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
	    }, function(){

	    });	


	}

	//$scope.change_doctor();

	$scope.ok = function(){
		var slot_detail = {};
		for(var i =0;i<$scope.days.length;i++){
			slot_detail[$scope.days[i]] = [];
			for(var j =0;j<$scope.sl.length;j++){
				var a=[];
				$('.'+$scope.days[i]+'_'+$scope.sl[j]).each( function() {
				    if($( this ).attr("checked") == 'checked'){
				    	var x = ($( this ).attr("id"));
				    	x = x.split('_');
				    	a.push(x[2]);
				    }
				});
				slot_detail[$scope.days[i]].push(a.join('-'));					
			}
		}
	 	console.log(slot_detail);
		slot_detail = JSON.stringify(slot_detail);
		console.log(slot_detail);
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