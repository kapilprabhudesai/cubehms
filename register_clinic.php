<?php
	include 'includes/head.php';
?>
<?php
$emails = all_user_emailids();
?>
 <body class='contrast-red login contrast-background'  ng-app='loginApp' ng-controller='usrCtrl'>
     <div class='modal fade' id='new_area_modal' tabindex='-1'>
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <button aria-hidden='true' class='close' data-dismiss='modal' type='button'>×</button>
            <h4 class='modal-title' id='myModalLabel'>Add New Area</h4>
          </div>
          <div class='modal-body'>
            <form class="form" style="margin-bottom: 0;" method="post" action="#" accept-charset="UTF-8"><input name="authenticity_token" type="hidden" />
              <div class='form-group'>
              <label for='inputText1'>New Area Name</label>
              <input class='form-control' ng-model="new_area" id='new_area' placeholder='New Area' type='text'>
              </div>
            </form>

          </div>
          <div class='modal-footer'>
            <button class='btn btn-default' data-dismiss='modal' type='button'>Close</button>
            <button class='btn btn-primary' ng-click="save_new_area()" type='button'>Save</button>
          </div>
        </div>
      </div>
    </div>
    <div class='middle-container'>
      <div class='middle-row'>
        <div class='middle-wrapper'>
          <div class='login-container-header'>
            <div class='container'>
              <div class='row'>
                <div class='col-sm-12'>
                  <div class='text-center'>
                    <img width="121" height="31" src="assets/images/logo.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='login-container'>
            <div class='container'>
              <div class='row'>
                <div class='col-sm-4 col-sm-offset-4'>
                  <h1 class='text-center title' id="title">Register Your Clinic</h1>
                  <form id="register" name="myForm" class='validate-form' method='post'>
                  <div class='form-group'>
                    <label>Clinic Name</label>
                    <input class="form-control" id='clinic_name' name='clinic_name' ng-model='register.clinic_name' type="text" required>
                    <span style="color:#b94a48" ng-if="myForm.clinic_name.$error.required">Clinic Name Is Mandatory</span>
                  </div>

                  <div class='form-group'>
                    <label>Principal Doctor First Name</label>
                    <input class="form-control" id='first_name' name='first_name' ng-model='register.first_name' type="text" required ng-pattern="/^[a-zA-Z]*$/">
                    <span style="color:#b94a48" ng-if="myForm.first_name.$error.required">First Name Is Mandatory</span>
                    <span style="color:#b94a48" ng-if="myForm.first_name.$error.pattern">Please Enter Valid Name</span>
                  </div>
                  <div class='form-group'>
                    <label>Principal Doctor Middle Name</label>
                    <input class="form-control" id='middle_name' name='middle_name' ng-model='register.middle_name' type="text" ng-pattern="/^[a-zA-Z]*$/">
                    <span style="color:#b94a48" ng-if="myForm.middle_name.$error.pattern">Please Enter Valid Name</span>
                  </div>
                  <div class='form-group'>
                    <label>Principal Doctor Last Name</label>
                    <input class="form-control" id="last_name" name="last_name" ng-model="register.last_name" type="text" required ng-pattern="/^[a-zA-Z]*$/">
                    <span style="color:#b94a48" ng-if="myForm.last_name.$error.required">Last Name Is Mandatory</span>
                    <span style="color:#b94a48" ng-if="myForm.last_name.$error.pattern">Please Enter Valid Name</span>
                  </div>

                    <div class='form-group'>
                      <div class='controls with-icon-over-input'>
                        <input autocomplete="off" class="form-control" id="email" name="email" placeholder="E-mail"  ng-keyup="is_unique()" type="email"ng-model="register.email"  required>
                        <i class='icon-user text-muted'></i>
                          <span style="color:#b94a48" ng-show="myForm.email.$error.required">Email Is Mandatory</span>
                           <span style="color:#b94a48" ng-if="myForm.email.$error.unique">Email Already Registered</span>
                      </div>
                    </div>
                    <div class='form-group'>
                      <div class='controls with-icon-over-input'>
                        <input autocomplete="off" type="password" class="form-control" placeholder="Password" id="password" name="password" ng-model="register.password" ng-minlength="8" ng-maxlength="20" ng-pattern="/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/" required  />
                        <i class='icon-lock text-muted'></i>
                        <span style="color:#b94a48" ng-show="myForm.password.$error.required && myForm.password.$dirty">Password Required</span>
                        <span style="color:#b94a48" ng-show="!myForm.password.$error.required && (myForm.password.$error.minlength || myForm.password.$error.maxlength) && myForm.password.$dirty">Passwords must be between 8 and 20 characters.</span>
                        <span style="color:#b94a48" ng-show="!myForm.password.$error.required && !myForm.password.$error.minlength && !myForm.password.$error.maxlength && myForm.password.$error.pattern && myForm.password.$dirty">Must contain one lower &amp; uppercase letter, and one non-alpha character (a number or a symbol.)</span>
                      </div>
                    </div>
                    <div class='form-group'>
                      <div class='controls with-icon-over-input'>
                      <input autocomplete="off" type="password" class="form-control" placeholder="Confirm Password" id="confirm_password" name="confirm_password" ng-model="register.confirm_password" ng-minlength="8" ng-maxlength="20" ng-pattern="/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/"  ng-required="true" ng-keyup="match_passwords()"/>
                      <i class='icon-lock text-muted'></i>
                      <span style="color:#b94a48" ng-show="myForm.confirm_password.$error.required && myForm.confirm_password.$dirty">Please confirm your password.</span>
                      <span style="color:#b94a48" ng-show="myForm.confirm_password.$error.unmatch">Passwords do not match.</span>
                      </div>
                    </div>
            <div class='form-group'>
              <label>Mobile No</label>
              <input class="form-control" placeholder="+91 9673173727" id="mobile_no_1" name="mobile_no_1" ng-model="register.mobile_no_1" type="text" required  ng-pattern="validate_mobile_no">
              <span style="color:#b94a48" ng-if="myForm.mobile_no_1.$error.required">Mobile Number Is Mandatory</span>
              <span style="color:#b94a48" ng-if="myForm.mobile_no_1.$error.pattern"><br>Invalid Mobile No</span>
            </div>
            <div class='form-group'>
              <label>Country</label>
              <select required  class="select2 form-control" id="country_id" ng-model="register.country_id">
              <option value="">Choose...</option>
              <option ng-repeat="option in countries" value="{{option.id}}" ng-selected="{{option.id == register.country_id}}">{{option.name}}</option>
              </select>
            </div>
            <div class='form-group'>
              <label>State</label>
              <select required  class="select2 form-control" id="state_id" ng-model="register.state_id">
              <option value="">Choose...</option>
              <option ng-repeat="option in states" value="{{option.id}}" ng-selected="{{option.id == register.state_id}}">{{option.name}}</option>
              </select>
            </div>
            <div class='form-group'>
              <label>City</label>
              <select required  class="select2 form-control" id="city_id" ng-model="register.city_id">
              <option value="">Choose...</option>
              <option ng-repeat="option in cities" value="{{option.id}}" ng-selected="{{option.id == register.city_id}}">{{option.name}}</option>
              </select>
            </div>
            <div class='form-group'>
              <label>Area</label><i ng-click="trigger_new_area_modal()" class="icon-plus-sign pull-right">Add New Area</i>
              <select required  class="select2 form-control" id="area_id" ng-model="register.area_id">
              <option value="">Choose...</option>
              <option ng-repeat="option in areas" value="{{option.id}}" ng-selected="{{option.id == register.area_id}}">{{option.name}}</option>
              </select>
            </div>
            <div class='form-group'>
              <label>Address</label>
              <textarea id="address" ng-model="register.address" class="autosize form-control" placeholder="Address" rows="2" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;"></textarea>
            </div>

                    <!--div class='checkbox'>
                      <label for='remember_me'>
                        <input id='remember_me' name='remember_me' type='checkbox' value='1'>
                        Remember me
                      </label>
                    </div-->
  
                    <button id="registr" ng-click="register_clinic()" type="submit" ng-disabled="!myForm.$valid" class='btn btn-success btn-block'>Register</button>
                  </form>
                  <div class='text-center'>
                    <hr class='hr-normal'>
                    <a href='login.php'>Already Registered?</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<script>

var app = angular.module('loginApp', []);
app.controller('usrCtrl', function($scope, $http) {

$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";  
    $scope.register = {
      clinic_name:'',
      first_name:'',
      middle_name:'',
      last_name:'',
      email:'',
      password:'',
      confirm_password:'',
      country_id:'',
      state_id:'',
      city_id:'',
      area_id:'',
      address:'',
      mobile_no_1:''
    };
  $scope.new_area="";
  


   $scope.validate_mobile_no = (function() {
      var regexp = /^(\+91[\-\s]?)\d{10}$/;
      return {
          test: function(value) {
              return regexp.test(value);
          }
      };
  })();

  $scope.save_new_area = function(){
    if($scope.new_area==''){
      $('#new_area_modal').modal('hide');
      return false;
    }
    var params =  {
            action: "save_new_area",
            name:$scope.new_area,
            city_id:$scope.register.city_id
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
            $scope.register.area_id = parseInt(res.data);
         }, 1000);
      }, function(){});    
  }

  $scope.countries = [];
  $scope.states = [];
  $scope.cities = [];
  $scope.areas  = [];
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
      .then(function(res){$scope.countries = res.data; $scope.get_states($scope.register.country_id);}, function(){});    
  }
  $scope.get_countries();

  $( "#country_id" ).change(function() {
    var cid = $(this).val();
    $scope.register.country_id = cid;
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
        $scope.get_cities($scope.register.state_id);
      }, function(){});
   }

  $( "#state_id" ).change(function() {
    var sid = $(this).val();
    $scope.register.state_id = sid;
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
        $scope.get_areas($scope.register.city_id);
      }, function(){});
   }

  $( "#city_id" ).change(function() {
    var cid = $(this).val();
    $scope.register.city_id = cid;
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
    $scope.register.area_id = aid;
  });  
    $scope.register_clinic = function(){
      $("#registr").hide();
      start_spinner();
      var params =  {
              action: "register_clinic",
              form:$scope.register
          };
      var serializedData = $.param(params);
        $http({
            url: CMS_PATH+"inc/functions.php",
            method: "POST",
            data: serializedData
        })
        .then(function(res){
          stop_spinner();
          alert("You have been successfully registered! Please confirm via email sent to you");
          location.href="login.php";
        }, function(){
            stop_spinner();
        }); 
    }

    $scope.match_passwords = function(){
    var field1 =$scope.myForm.password;
    var field2 =$scope.myForm.confirm_password;
        if(field1.$viewValue==field2.$viewValue){
          $scope.myForm.confirm_password.$setValidity('unmatch','');
        }else{
             $scope.myForm.confirm_password.$setValidity('unmatch', false);
        }
    }

    $scope.trigger_new_area_modal = function(){
      if($scope.register.city_id==''){
        $.jGrowl("Select City First!");
        return false;
      }
      $('#new_area_modal').modal({ show: true});
      setTimeout(function(){ 
        $("#new_area").focus();
      }, 1000);
    }
    $scope.is_unique = function(){
        var field =$scope.myForm.email;
        var typed_text =field.$viewValue;
        var arr = [];
        <?php
        foreach ($emails as $key => $value) {
          echo "arr.push('".$value['email']."');";
        }
        
        ?>
        var found = parseInt(arr.indexOf(typed_text));
        if(found==-1){
             $scope.myForm.email.$setValidity('unique', '');
        }else{
             $scope.myForm.email.$setValidity('unique', false);
        }
}
});
</script>
<?php
	include 'includes/foot.php';
?>

