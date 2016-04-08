'use strict';
app.controller('expenseCtrl', function($scope, $http) {
	$scope.expenses = {};
	$scope.types = {};
	$scope.expense = {
		date: '',
		type_id:'',
		amount:'',
		remark:''
	};
	$scope.new_expense_type = "";

	$scope.reset = function(){
		$scope.expense = {
			date: '',
			type_id:'',
			amount:'',
			remark:''
		};	
		$scope.edit_flag = 0;
        setTimeout(function(){ 
        	$("select").select2();
         }, 1000);			
	}
    $scope.trigger_new_expense_type_modal = function(){
      $('#new_expense_type_modal').modal({ show: true});
    }

	$scope.save = function(){
		$scope.expense.date = $("#date").val();
		var params =  {
		        action: "add_expense",
		        expense:$scope.expense
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
 			$scope.reset();
	    	if(res.data.status == true){
	    		$scope.init();
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}


	$scope.update = function(){
		$scope.expense.date = $("#date").val();
		var params =  {
		        action: "update_expense",
		        expense:$scope.expense
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
 			$scope.reset();
	    	if(res.data.status == true){
	    		$scope.init();
	    	}
	    	$.jGrowl(res.data.msg);
	    }, function(){

	    });		
	}

  $scope.save_new_expense_type = function(){
    if($scope.new_area==''){
      $('#new_expense_type_modal').modal('hide');
      return false;
    }
    var params =  {
            action: "new_expense_type",
            name:$scope.new_expense_type
        };
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        $('#new_expense_type_modal').modal('hide');
 		$scope.types[res.data]=$scope.new_expense_type;
        setTimeout(function(){ 
        	console.log(res.data);
            $( "#type_id" ).val(parseInt(res.data));
            $scope.expense.type_id = parseInt(res.data);
            $("#type_id").select2();
         }, 1000);
      }, function(){});    
  }

	$scope.get_expense_types = function(){
		var params =  {
		        action: "get_expense_types"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.types[res.data[i].id] = res.data[i].name;	
	    	}
	    	$("select").select2();
	    }, function(){

	    });			
	}
	$scope.get_expense_types();

	$scope.remove = function(id){
		var y = window.confirm("Are you sure?");
		if(y== true){
			var params =  {
			        action: "remove_expense",
			        id:id
			    };
			var serializedData = $.param(params);
		    $http({
		        url: CMS_PATH+"inc/functions.php",
		        method: "POST",
		        data: serializedData
		    })
		    .then(function(res){
		    	$scope.init();
		    }, function(){

		    });				
		}
	}

	$scope.edit_flag = 0;
	$scope.edit = function(id){
		$scope.edit_flag=1;
		$scope.expense = {
			id:id,
			date: $scope.expenses[id].date,
			type_id:$scope.expenses[id].type_id,
			amount:$scope.expenses[id].amount,
			remark:$scope.expenses[id].remark
		};
        setTimeout(function(){ 
        	$("select").select2();
         }, 1000);
	}
	$scope.init = function(){
		var params =  {
		        action: "get_expense_list"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.expenses={};
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.expenses[res.data[i].id] = res.data[i];	
	    	}	    	
	    }, function(){

	    });	
	}

	$scope.init();

		$( "#type_id" ).change(function() {
			var tid = $(this).val();
			$scope.expense.type_id = tid;
		}); 	
	$(document).ready(function(){
 
        $('#datetimepicker1').datetimepicker({pickTime:false, format:'YYYY-MM-DD'});
       // $("select").select2();
	});		
});