'use strict';
app.controller('inventoryCtrl', function($scope, $http) {
	$scope.expenses = {};
	$scope.types = {};
	$scope.item = {
		name:'',
		type_id:'',
		sub_type_id:'',
		uom:'',
		danger_level:'',
		status:''
	};
	$scope.new_expense_type = "";

	$scope.reset = function(){
	$scope.item = {
		name:'',
		type_id:'',
		sub_type_id:'',
		uom:'',
		danger_level:'',
		status:''
	};
		$scope.edit_flag = 0;
        setTimeout(function(){ 
        	$("select").select2();
         }, 1000);			
	}

	$scope.modal_capture="";
	$scope.modal_capture_type="";
    $scope.trigger_new_modal = function(id,name){
    	$scope.modal_capture="";
		$("#myModalLabel, #myModalLabel2").html("Add New "+name);
		$("#modal_capture").attr("placeholder", "Enter New "+name);
		$scope.modal_capture_type = id;
		$('#modal').modal({ show: true});
		setTimeout(function(){ 
			$("#modal_capture").focus();
		}, 1000);
    }

	$scope.save = function(){
		var params =  {
		        action: "inventory_save_item",
		        item:$scope.item
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
 			$scope.reset();
 
	    		$scope.init();
	     
	    	$.jGrowl("Success!");
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

  $scope.save_modal = function(){
    if($scope.modal_capture==''){
      $('#modal').modal('hide');
      return false;
    }
    var params =  {
            action: "inventory_add_combo",
            type: $scope.modal_capture_type,
            name:$scope.modal_capture
        };

    if($scope.modal_capture_type=='sub_type'){
    	if($("#type_id").val()==''){
    		alert("please select type!");
    		return false;
    	}
    	params.type_id=$scope.item.type_id;
    }	
    var serializedData = $.param(params);
      $http({
          url: CMS_PATH+"inc/functions.php",
          method: "POST",
          data: serializedData
      })
      .then(function(res){
        $('#modal').modal('hide');
         	if($scope.modal_capture_type=='type'){		
        		$scope.types[res.data]=$scope.modal_capture;
		        setTimeout(function(){ 
			            $( "#type_id" ).val(parseInt(res.data));
			            $scope.item.type_id = parseInt(res.data);
			            $("#type_id").select2();
		        	
		         }, 1000);
        	}
         	else if($scope.modal_capture_type=='sub_type'){		
        		$scope.sub_types[res.data]=$scope.modal_capture;
		        setTimeout(function(){ 
			            $( "#sub_type_id" ).val(parseInt(res.data));
			            $scope.item.sub_type_id = parseInt(res.data);
			            $("#sub_type_id").select2();
		        	
		         }, 1000);
        	}
        	else if($scope.modal_capture_type=='uom'){		
        		$scope.uoms[res.data]=$scope.modal_capture;
		        setTimeout(function(){ 
			            $( "#uom" ).val(parseInt(res.data));
			            $scope.item.uom = parseInt(res.data);
			            $("#uom").select2();
		        	
		         }, 1000);
        	}        	
      }, function(){});    
  }

	$scope.get_item_types = function(){
		var params =  {
		        action: "inventory_get_item_types"
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
	$scope.get_item_types();


	$scope.uoms = {};
	$scope.get_uoms = function(){
		var params =  {
		        action: "inventory_get_uoms"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.uoms[res.data[i].id] = res.data[i].name;	
	    	}
	    	$("select").select2();
	    }, function(){

	    });			
	}
	$scope.get_uoms();
	$scope.sub_types ={};
	$scope.get_item_sub_types = function(type_id){
		var params =  {
		        action: "inventory_get_item_sub_types",
		        type_id:type_id
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.sub_types[res.data[i].id] = res.data[i].name;	
	    	}
	    	$("select").select2();
	    }, function(){

	    });			
	}
 
	$scope.get_item_sub_types();

	$( "#type_id" ).change(function() {
		var id = $(this).val();
		$scope.item.type_id = id;
		$scope.get_item_sub_types(id);
	});  

	$( "#sub_type_id" ).change(function() {
		var id = $(this).val();
		$scope.item.sub_type_id = id;
	});  

	$( "#uom" ).change(function() {
		var id = $(this).val();
		$scope.item.uom = id;
	});  

	$( "#status" ).change(function() {
		var id = $(this).val();
		$scope.item.status = id;
	});  

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
	$scope.items={};
	$scope.init = function(){
		var params =  {
		        action: "inventory_get_item_list"
		    };
		var serializedData = $.param(params);
	    $http({
	        url: CMS_PATH+"inc/functions.php",
	        method: "POST",
	        data: serializedData
	    })
	    .then(function(res){
	    	$scope.items={};
	    	for(var i=0;i<res.data.length;i++){
	    		$scope.items[res.data[i].id] = res.data[i];	
	    	}	    	
	    }, function(){

	    });	
	}

	$scope.init();

 	
});