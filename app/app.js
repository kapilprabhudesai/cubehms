
var app = angular.module('app', ['ngRoute']).run(function($rootScope, $http) {
	$rootScope.title="SIGN IN";
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  });

 
app.directive('mandate', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      template: '<font style="color:red">*</font>'
  };
});
	app.config( ['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/clinic_dashboard', {
				templateUrl: 'views/clinic_dashboard/dashboard.html',
				controller: 'clinicDashboardCtrl'
			})
      .when('/edit_clinic_details', {
        templateUrl: 'views/clinic/edit_clinic_details.html',
        controller: 'clinicCtrl'
      })	
      .when('/change_password', {
        templateUrl: 'views/users/change_password.html',
        controller: 'usersCtrl'
      })
      .when('/add_doctor', {
        templateUrl: 'views/doctors/add_doctor.html',
        controller: 'doctorsCtrl'
      })
      .when('/manage_doctors', {
        templateUrl: 'views/doctors/manage_doctors.html',
        controller: 'doctorsCtrl'
      })   
      .when('/add_patient', {
        templateUrl: 'views/patients/add_patient.html',
        controller: 'patientsCtrl'
      })
      .when('/manage_patients', {
        templateUrl: 'views/patients/manage_patients.html',
        controller: 'patientsCtrl'
      }) 
      .when('/slots', {
        templateUrl: 'views/slots/slots.html',
        controller: 'slotsCtrl'
      }) 
      .when('/book_appointment', {
        templateUrl: 'views/appointments/book.html',
        controller: 'appointmentsCtrl'
      }) 
      .when('/appointment_status', {
        templateUrl: 'views/appointments/appointment_status.html',
        controller: 'appointmentsCtrl'
      })
      .when('/expense', {
        templateUrl: 'views/expense/expense.html',
        controller: 'expenseCtrl'
      }) 
      .when('/manage', {
        templateUrl: 'views/manage/manage.html',
        controller: 'manageCtrl'
      }) 
      .when('/add_referral', {
        templateUrl: 'views/referrals/add_referral.html',
        controller: 'referralsCtrl'
      })
      .when('/manage_referrals', {
        templateUrl: 'views/referrals/manage_referrals.html',
        controller: 'referralsCtrl'
      }) 
      .when('/add_fitness', {
        templateUrl: 'views/fitness/add_fitness.html',
        controller: 'fitnessCtrl'
      })
      .when('/manage_fitness', {
        templateUrl: 'views/fitness/manage_fitness.html',
        controller: 'fitnessCtrl'
      })
      .when('/add_item', {
        templateUrl: 'views/inventory/add_item.html',
        controller: 'inventoryCtrl'
      })
      .when('/manage_inventory', {
			templateUrl: 'views/inventory/manage.html',
			controller: 'inventoryCtrl'
	  })	  
      .when('/doctor_availability', {
        templateUrl: 'views/doctors/doctor_availability.html',
        controller: 'doctorsCtrl'
      }) 
      .when('/patient_dashboard', {
        templateUrl: 'views/patient_dashboard/dashboard.html',
        controller: 'patientDashboardCtrl'
      }) 
      .when('/edit_me', {
        templateUrl: 'views/patient_dashboard/edit_me.html',
        controller: 'patientSelfEditCtrl'
      }) 
      .when('/my_appointments', {
        templateUrl: 'views/patient_dashboard/my_appointments.html',
        controller: 'patientsAppointmentsCtrl'
      })      
			.otherwise({
				redirectTo: '/err'
			});
	}]
  );
 
 


 function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

 function getDate() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day;   
     return dateTime;
}




function formatAMPM() {
  var date     = new Date(); 
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = {hours:hours, minutes:minutes, ampm:ampm};
  return strTime;
}



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
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

function confirmLogout() {
	logout=1;
	navigator.app.clearHistory();
	document.removeEventListener("backbutton", onDeviceReady, false);	
	
	location.href="#/login";
}

function onLoad()
{
   document.addEventListener("deviceready", onDeviceReady, true);
}

 

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
//   navigator.splashscreen.show();
}