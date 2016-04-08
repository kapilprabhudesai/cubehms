'use strict';
app.controller('fitnessCtrl', function($scope, $http, $routeParams) {
	
	
	$scope.fitness_certs = [];
	$scope.load_fitness_certs = function(){
		var params =  {
		        action: "get_fitness_list",
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.fitness_certs = res.data;
	    	console.log($scope.fitness_certs);
	    }, function(){

	    });	
	}
	$scope.load_fitness_certs();

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
		$scope.fitness.frm = $("#from").val();
		$scope.fitness.till = $("#till").val();
		$scope.fitness.resume = $("#resume").val();
		var params =  {
		        action: "issue_fitness",
		        fitness:$scope.fitness
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
	    		setTimeout(function(){location.href="#manage_fitness";},2000);
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}

 


	$scope.patient = {};
	$scope.fitness = {
		name:'',
		illness:'',
		frm:'',
		till:'',
		resume:'',
		charges:''
	};

	

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
	    	$scope.fitness.name = res.data.first_name+' '+res.data.last_name;

	    	if($routeParams.reg !== undefined){
				setTimeout(function(){ 
				$scope.printslip($scope.patient);
				}, 1);
	    		
	    	}	
	    }, function(){

	    });	
	}
	if($routeParams.id !== undefined){
		$scope.load_patient($routeParams.id);
	}else if($routeParams.reg !== undefined){
		$scope.load_patient($routeParams.reg);
	}

	$(document).ready(function(){
        $('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
        $('#datetimepicker2').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
        $('#datetimepicker3').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
	});

$scope.printfc = function(json) {
	json.gender = "Male";
	var salutation = "Mr.";
	if(json.gender=='Female'){
		salutation = "Ms.";
	}
	var name = json.name;

	var from = json.frm;
	var till = json.till;
	var resume = json.resume;
	var charges = json.charges;
	var illness = json.illness;

 
    var w = window.open();
    w.document.write('<html><head><title>Fitness Certificate</title></head>');
    w.document.write('<body>');
    w.document.write('<h1><center>Fitness Certificate</h1><hr />');
    w.document.write('<p>');
    w.document.write('This is to certify that '+salutation+' '+name+' was unfit due to '+illness+' <br/>from '+from+' to '+till+'.');
    w.document.write('</p>');

    w.document.write('<p>');
    w.document.write('He/She May resume work on '+resume+'.');
    w.document.write('</p>');

    w.document.write('<hr />');

    w.document.write('<b>');
    w.document.write('Charges: INR '+charges);
    w.document.write('</b>');

    w.document.write('</body>');
    w.document.write('</html>');
    w.window.print();
    w.document.close();
    return false;
}	

$scope.printslip = function(json) {
	console.log(json);
	location.href="#/clinic_dashboard";
	var name = json.first_name+' '+json.last_name;
    var w = window.open();
    w.document.write('<html><head><title>Registration Slip</title></head>');
    w.document.write('<body><center><h3>Registration Slip</h3></center>');
    w.document.write('<table border="1">');
	w.document.write('<tr><th>Patient ID</th><td>'+json.id+'</td>');
	var d = new Date(json.created_on);
	w.document.write('<tr><th>Registration Date</th><td>'+d.toDateString()+'</td>');
	w.document.write('<tr><th>Patient Name</th><td>'+name+'</td>');
	w.document.write('<tr><th>Contact No</th><td>'+json.mobile_no_1+', '+json.landline_1+'</td>');
	var dob = new Date(json.dob);
	var today = new Date();
	w.document.write('<tr><th>DOB</th><td>'+dob.toDateString()+'</td>');
    w.document.write('</table>');
    w.document.write('</body>');
    w.document.write('</html>');
    w.window.print();
    w.document.close();
}
});