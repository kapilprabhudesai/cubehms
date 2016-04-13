<?php
	include 'includes/head.php';
?>
 <body class='contrast-red login contrast-background'  ng-app='loginApp' ng-controller='usrCtrl'>
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
                  <h1 class='text-center title' id="title">Sign in</h1>
                  <form id="sign-in" name="myForm" class='validate-form' method='post'>
                    <div class='form-group'>
                      <div class='controls with-icon-over-input'>
                        <input autocomplete="off" class="form-control" ng-model="email" id="email" name="email" placeholder="E-mail" type="email" required>
                        <i class='icon-user text-muted'></i>
                          <span ng-show="myForm.email.$error.required">Please Enter Your Email</span>
                      </div>
                    </div>
                    <div class='form-group'>
                      <div class='controls with-icon-over-input'>
                        <input autocomplete="off" type="password" class="form-control" placeholder="New Password" id="password" name="password" ng-model="formData.password" ng-minlength="8" ng-maxlength="20" ng-pattern="/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/" required  />
                        <i class='icon-lock text-muted'></i>
                        <span ng-show="myForm.password.$error.required && myForm.password.$dirty">Password Required</span>
                        <span ng-show="!myForm.password.$error.required && (myForm.password.$error.minlength || myForm.password.$error.maxlength) && myForm.password.$dirty">Passwords must be between 8 and 20 characters.</span>
                        <span ng-show="!myForm.password.$error.required && !myForm.password.$error.minlength && !myForm.password.$error.maxlength && myForm.password.$error.pattern && myForm.password.$dirty">Must contain one lower &amp; uppercase letter, and one non-alpha character (a number or a symbol.)</span>
                      </div>
                    </div>
                    <!--div class='checkbox'>
                      <label for='remember_me'>
                        <input id='remember_me' name='remember_me' type='checkbox' value='1'>
                        Remember me
                      </label>
                    </div-->
                    <button type="submit" ng-disabled="!myForm.$valid" class='btn btn-success btn-block'>Sign in</button>
                  </form>
                  <form id="forgot-form" name="forgotForm" class='validate-form' method='post' style="display:none">
                    <div class='form-group'>
                      <div class='controls with-icon-over-input'>
                        <input autocomplete="off" class="form-control" ng-model="email" id="forgot_email" name="email" placeholder="E-mail" type="email" required>
                        <i class='icon-user text-muted'></i>
                        <span ng-show="forgotForm.email.$error.required">Please Enter Your Email</span>
                      </div>
                    </div>
                    <button type="submit" ng-disabled="!forgotForm.$valid" class='btn btn-success btn-block'>Reset Password</button>
                  </form>
                  <div class='text-center'>
                    <hr class='hr-normal'>
                    <a href='register_clinic.php'>Havent Registered Yet?</a> | <a href='javascript:show_forgot_password_form()'>Forgot Password</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<script>
function show_forgot_password_form(){
  $("#sign-in").hide();
  $("#title").html("Reset Password");
  $("#forgot-form").show();
}
var app = angular.module('loginApp', []);
app.controller('usrCtrl', function($scope) {
    $scope.email = "";
    $scope.password = "";
});
</script>
<?php
	include 'includes/foot.php';
?>

