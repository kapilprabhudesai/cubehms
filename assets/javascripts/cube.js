$(document).ready(function(){
	console.log("-----DOCUMENT LOADED-----------");
	$("input").attr("autocomplete","off");

	$("#sign-in").submit(function(event){
		event.preventDefault();
		var email = $("#email").val();
		var pass  = $("#password").val();

		var obj = {
			action:'login',
			email: email,
			password: pass
		};

		$.post(CMS_PATH+"inc/functions.php", obj)
		.done( function(data) {
			data = JSON.parse(data);
			if(data.status != true){
				$.jGrowl(data.msg);
				return false;	
			}else{
				$("#forgot_password").remove();
				select_role(data.session);
			}
		})
		.fail( function(xhr, textStatus, errorThrown) {
			$.jGrowl(textStatus);
		});
	});	

	$("#forgot-form").submit(function(event){
		event.preventDefault();
		var email = $("#forgot_email").val();

		var obj = {
			action:'forgot',
			email: email
		};

		$.post(CMS_PATH+"inc/functions.php", obj)
		.done( function(data) {
			alert("Please Check Mail to see the password");
			location.reload();
		})
	});	
})

function select_role(session){
	$("#title").html("Choose Appropriate Role From Below");
	var rights = session.rights;
	var html = '<div class="box-content"><div class="row">';
	var total_roles = 0;
	for (var k in rights){
	    if (rights.hasOwnProperty(k)) {
	      if(rights[k]==1){
	      	total_roles++;
	      }
	    }  
	}	
	var col_sm = 0;
	switch(total_roles){
		case 1:col_sm = 12;break;
		case 2:col_sm = 6;break;
		case 3:col_sm = 4;break;
		case 4:col_sm = 6;break;
		default :col_sm = 4;break;
	}
 
	for (var k in rights){
	    if (rights.hasOwnProperty(k)) {
	      if(rights[k]==1){
		      html += '<div class="col-sm-'+col_sm+'">';
	          html += '<div class="box-quick-link green-background">';
	          html += '<a href="javascript:set_role(\''+k+'\')">';
	          html += '<div class="header">';
	          html += '<div class="icon-star"></div>';
	          html += '</div>';
	          html += '<div class="content">'+k+'</div>';
	          html += '</a>';
	          html += '</div>';
	          html += '</div>';
	      }
	    }
	}
	html += '</div></div>';
	$("#sign-in").html(html);
}


function set_role(role){
		var obj = {
			action:'set_role',
			role: role
		};

		$.post(CMS_PATH+"inc/functions.php", obj)
		.done( function(data) {
			data = JSON.parse(data);
			select_clinic(data);
		})
		.fail( function(xhr, textStatus, errorThrown) {
			$.jGrowl(textStatus);
		});

}

function select_clinic(data){
	$("#title").html("Choose Appropriate Clinic From Below");
	var html = '<div class="box-content"><div class="row">';
	var total_clinics = data.length;

	var col_sm = 0;
	switch(total_clinics){
		case 1:col_sm = 12;break;
		case 2:col_sm = 6;break;
		case 3:col_sm = 4;break;
		case 4:col_sm = 6;break;
		default :col_sm = 4;break;
	}

 	for(var i=0;i<data.length; i++){
		html += '<div class="col-sm-'+col_sm+'">';
		html += '<div class="box-quick-link green-background">';
		html += '<a href="javascript:set_clinic(\''+data[i].id+'\')">';
		html += '<div class="header">';
		html += '<div class="icon-star"></div>';
		html += '</div>';
		html += '<div class="content">'+data[i].name+'</div>';
		html += '</a>';
		html += '</div>';
		html += '</div>';		
 	}

	html += '</div></div>';
	$("#sign-in").html(html);
}

function set_clinic(clinic_id){
		var obj = {
			action:'set_clinic',
			clinic: clinic_id
		};

		$.post(CMS_PATH+"inc/functions.php", obj)
		.done( function(data) {
			location.href=CMS_PATH+'index.php#/clinic_dashboard';
		})
		.fail( function(xhr, textStatus, errorThrown) {
			$.jGrowl(textStatus);
		});

}

	function treatment(id){
    	$(".treatment").removeClass("active");
    	$("#treatment_"+id).addClass("active");
	}

function start_spinner(){
	$data = {
		autoCheck: 32,
		size: "32",
		bgColor: "#000",
		bgOpacity: "0.7",
		fontColor: "#FFF",
		title: "Hold On...",
		isOnly: true
	};
	$.loader.open($data);
}

function stop_spinner(){
	$.loader.close(true);
}	