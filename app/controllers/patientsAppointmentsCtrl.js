'use strict';
app.controller('patientsAppointmentsCtrl', function($scope, $http, $routeParams) {
	$scope.appointments  = [];
	$scope.my_appointments = function(did){
		var params =  {
		        action: "my_appointments"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.appointments = (res.data);
	    	
	    }, function(){

	    });		
	}
	$scope.my_appointments();

});