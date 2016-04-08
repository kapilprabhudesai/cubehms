'use strict';
app.controller('usersCtrl', function($scope, $http) {

	$scope.submit_form = function(){
		var old_password = $("#old_password").val();
		var new_password = $("#new_password").val();
		var confirm_new_password = $("#confirm_new_password").val();

		var params =  {
		        action: "change_password",
		        old_password:old_password,
		        new_password:new_password,
		        confirm_new_password:confirm_new_password
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(handleSuccess, handleError);
	}

	$scope.match_passwords = function(){
	   var field1 =$scope.myForm.new_password;
	   var field2 =$scope.myForm.confirm_new_password;
	   		console.log(field1.$viewValue+'--'+field2.$viewValue);
	        if(field1.$viewValue==field2.$viewValue){
	        	console.log('--match--');
	        	$scope.myForm.confirm_new_password.$setValidity('unmatch','');
	        }else{
	             $scope.myForm.confirm_new_password.$setValidity('unmatch', false);
	        }
	}

	function handleSuccess(res){
		console.log(res.data);
		$.jGrowl(res.data.msg);
		if(res.data.status == true){
			setTimeout(function(){ window.location = "#clinic_dashboard"; }, 3000);
			$("button").fadeOut();
		}
	}

	function handleError(){
		
	}
});

