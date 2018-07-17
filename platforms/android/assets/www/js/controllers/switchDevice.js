var starter = angular.module('starter');

starter.controller('SwitchDeviceCtrl', function($ionicPlatform,$cordovaDevice,$scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$stateParams,$localStorage){

  $scope.switchDev = {
    UserId: Gtbank.getUserId(),
    UseToken: "",
    DeviceId: Gtbank.getUuid() || null,
    TransactionPin: "",
    Otp: ""
  }

    //var device = $cordovaDevice.getDevice();

     //UtilityService.showErrorAlert(Gtbank.getUuid());
     //UtilityService.showErrorAlert(device.uuid);
     $scope.paramUseTokenValue = $stateParams.useToken;
     $scope.fromDashboard = $stateParams.fromDashboard;
     if (Gtbank.getUseToken() == 0) {
       $scope.switchDev.UseToken = 1;
       $scope.title = "TOKEN";
     }
     if (Gtbank.getUseToken() == 1) {
       $scope.switchDev.UseToken = 0;
       $scope.title = "PIN";
     }

     $scope.switchDevice = function() {

       document.activeElement.blur();
       if ($scope.switchDev.UseToken == 0) {
         if ($scope.switchDev.TransactionPin != $scope.switchDev.ConfirmTransactionPin) {
           UtilityService.showErrorAlert("PIN does not match.");
           return false;
         }
       }
       if (Gtbank.getResCode() == 2000) {
         Gtbank.wait(true);
         CallService.doPost($scope.switchDev, ACTION_URLS.REGISTER_DEVICE)
           .then(function (response) {
             Gtbank.wait(false);
            var res = angular.fromJson(angular.fromJson(response.data));
             if (res.StatusCode == 0) {
               UtilityService.showErrorAlert(angular.fromJson(res.Message).MESSAGE);
               $state.go("login");
             }
              else {
                UtilityService.showErrorAlert(res.Message);
             }
           }, function (reason) {
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
           });
       }else if (Gtbank.getResCode() == 2001) {
         Gtbank.wait(true);
         CallService.doPost($scope.switchDev, ACTION_URLS.SWITCH_DEVICE)
           .then(function (response) {
             Gtbank.wait(false);
            var res = angular.fromJson(angular.fromJson(response.data));
             if (res.StatusCode == 0) {
               UtilityService.showErrorAlert(angular.fromJson(res.Message).MESSAGE);
               $state.go("login");
             }
              else {
                UtilityService.showErrorAlert(res.Message);
             }
           }, function (reason) {
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
           });
       }
       else {
         Gtbank.wait(true);
         CallService.doPost($scope.switchDev, ACTION_URLS.SWITCH_DEVICE)
           .then(function (response) {
             Gtbank.wait(false);
            var res = angular.fromJson(angular.fromJson(response.data));
             if (res.StatusCode == 0) {
               UtilityService.showErrorAlert(angular.fromJson(res.Message).MESSAGE);
               $state.go("dashboard");
             }
              else {
                UtilityService.showErrorAlert(res.Message);
             }
           }, function (reason) {
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
           });
       }
     };

     $scope.sendOtp = function(){
       request = {UserId: Gtbank.getUserId()}
       Gtbank.wait(true);
       CallService.doPost(request, ACTION_URLS.SEND_OTP)
         .then(function (response) {
           Gtbank.wait(false);
          var res = angular.fromJson(response.data);
           if (res.StatusCode == 0) {
             var data = angular.fromJson(res.Message);
             UtilityService.showErrorAlert(data.MESSAGE);
           }else {
             UtilityService.showErrorAlert(res.Message);
           }
         }, function (reason) {
           Gtbank.wait(false);
           UtilityService.showErrorAlert('Error communicating with host, please try again later.');
         });
     };

     $scope.setUseToken = function(id){
       Gtbank.setUseToken(id);
     };
     $scope.noDeviceLogin = function () {
       document.activeElement.blur();
       if (!$scope.form.Others.UserId || !$scope.form.Others.Password) {
         UtilityService.showErrorAlert("Please fill input field correctly.");
       }
        else {
          Gtbank.wait(true);
          CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.NO_DEVICE_LOGIN)
            .then(function (response) {
              Gtbank.wait(false);
              console.log(response);
             var res = angular.fromJson(angular.fromJson(response.data));
              if (res.StatusCode == 0) {
                if (angular.fromJson(res.Message).CODE != '1000') {
                  $scope.form.Others.Password = "";
                  UtilityService.showErrorAlert(angular.fromJson(res.Message).ERROR);
                }
                else if (angular.fromJson(res.Message).PWD_FLAG == '1') {
                  $scope.form.hasOldPassword = true;
                  Gtbank.setData($scope.form);
                  var data = angular.fromJson(res.Message);
                  Gtbank.setBvn(data.BVN);
                  Gtbank.setUserId(data.USERID);
                  Gtbank.setUseToken(1);
                  $localStorage.gtworldUsername = $scope.form.Others.UserId;
                  Gtbank.setAccountInfo(data.ACCOUNTS.ACCOUNT);
                  $state.go("change-password");
                }
                else {
                  //$scope.form.Others.Password = "";
                  var data = angular.fromJson(res.Message);
                  Gtbank.setBvn(data.BVN);
                  Gtbank.setUserId(data.USERID);
                  Gtbank.setUseToken(1);
                  $localStorage.gtworldUsername = $scope.form.Others.UserId;
                  Gtbank.setAccountInfo(data.ACCOUNTS.ACCOUNT);
                  $scope.account= Gtbank.getAccountInfo();
                  $state.go("dashboard");
                }
              }
               else {
                    $scope.form.Others.Password = "";
                    UtilityService.showErrorAlert(res.Message);
              }
            }
            , function (reason) {
              $scope.form.Others.Password = "";
              Gtbank.wait(false);
              UtilityService.showErrorAlert('Error communicating with host, please try again later.');
            });
       }
     };


     if(Gtbank.getResCode() == 2002){
       $scope.message = "This mobile device is already linked to another account. You can only complete your transactions with the hardware token.";
     }
     else {
       $scope.message = "By declining the terms of use, you will only be able to complete your transactions with the hardware token.";
       // $scope.message1 = "To switch to the PIN method at any time, simply go to settings.";
     }


     $scope.confirmLoginWithTokenOption = function(){
       $scope.form = Gtbank.getData();
       console.log($scope.form);
       Gtbank.setUseToken(1);
       $scope.noDeviceLogin();
     };

});
