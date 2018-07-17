var gtw = angular.module('starter');
gtw.controller('ForgotPasswordCtrl', function ($scope, $state, ACTION_URLS, Gtbank, CallService, UtilityService, $cordovaDialogs)
{
 $scope.data = {
       UserId: undefined
     }

   $scope.forgotPassword = function () {
       document.activeElement.blur();
       if (!$scope.data.UserId) {
         UtilityService.showErrorAlert("Please fill input field correctly.");
       }
        else {
          $scope.data.Udid = Gtbank.getUuid();
         Gtbank.wait(true);
         CallService.doPost($scope.data, ACTION_URLS.FORGOT_PASSWORD)
           .then(function (response) {
             Gtbank.wait(false);
             Gtbank.setResponse(angular.fromJson(response.data));
             var res = angular.fromJson(response.data);
             if (res.StatusCode != 0) {
               UtilityService.showErrorAlert(res.Message);
               // UtilityService.showErrorAlert('Your password has been sent to your mail. Thank you.','Alert');
             } else {
               var resp = angular.fromJson(res.Message);
               if (resp.CODE == "1012") {
                   $cordovaDialogs.prompt(resp.ERROR, 'Alert', ['Cancel','Ok'], '')
                  .then(function(result) {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2 - on browser
                    // no button = 0, 'OK' = 2, 'Cancel' = 1 - on device
                    var btnIndex = result.buttonIndex;

                      if (btnIndex == 2) {
                        $scope.reset = {UserId:  $scope.data.UserId, SecretAnswer: result.input1};
                        Gtbank.wait(true);
                        CallService.doPost($scope.reset, ACTION_URLS.FORGOT_PASSWORD_WITH_SECRET)
                          .then(function (response) {
                            Gtbank.wait(false);
                            var res = angular.fromJson(response.data);
                            if (res.StatusCode != 0) {
                              // UtilityService.showErrorAlert(res.Message);
                              UtilityService.showErrorAlert(res.Message);
                            } else {
                              var resp = angular.fromJson(res.Message);
                                UtilityService.showSuccessAlert(resp.MESSAGE);
                                $state.go("login");
                            }
                          });
                      }

                  });
               }else {
                 UtilityService.showSuccessAlert(resp.MESSAGE);
                 $state.go("login");
               }
             }
           }, function (reason) {
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
             // UtilityService.showErrorAlert('Your password has been sent to your mail. Thank you.','Alert');
           });
       }
     };

   $scope.changePassword = function () {
     document.activeElement.blur();
     $scope.data.UserId = Gtbank.getUserId();
     if (Gtbank.getData().hasOldPassword) {
       $scope.data.OldPassword = Gtbank.getData().OldPassword;
     }

     if (!$scope.data.OldPassword || !$scope.data.NewPassword || !$scope.data.ConfirmPassword) {
       UtilityService.showErrorAlert("Please fill input field correctly.");
     }
     else if ($scope.data.NewPassword != $scope.data.ConfirmPassword) {
       UtilityService.showErrorAlert("Password does not match!");
     }else if ($scope.data.OldPassword == $scope.data.NewPassword) {
       UtilityService.showErrorAlert("Old Password and New Password cannot be the same!");
     }else {
       Gtbank.wait(true);
       CallService.doPost($scope.data, ACTION_URLS.CHANGE_PASSWORD)
         .then(function (response) {
           Gtbank.wait(false);
           $scope.data = {};
           Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
           var res = angular.fromJson(response.data);
           if (res.StatusCode != 0) {
             UtilityService.showErrorAlert(res.Message);
           } else {
             $scope.data.hasOldPassword = false;
             Gtbank.setData($scope.data);
             UtilityService.showSuccessAlert("New password has been changed successfully.");
             $state.go("dashboard");
           }
         }, function (reason) {
           $scope.data = {};
           Gtbank.wait(false);
           UtilityService.showErrorAlert('Error communicating with host, please try again later.');
         });
     }
   };

   $scope.changePin = function () {
     document.activeElement.blur();
     $scope.data.UserId = Gtbank.getUserId();
     $scope.data.Udid = Gtbank.getUuid();
     if (!$scope.data.OldPin || !$scope.data.NewPin || !$scope.data.ConfirmPin) {
       UtilityService.showErrorAlert("Please fill input field correctly.");
     }
     else if ($scope.data.NewPin != $scope.data.ConfirmPin) {
       UtilityService.showErrorAlert("Pin does not match!");
     }else if ($scope.data.OldPin == $scope.data.NewPin) {
       UtilityService.showErrorAlert("Old PIN and New PIN cannot be the same!");
     }else {
       Gtbank.wait(true);
       CallService.doPost($scope.data, ACTION_URLS.CHANGE_PIN)
         .then(function (response) {
           Gtbank.wait(false);
           $scope.data = {};
           Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
           var res = angular.fromJson(response.data);
           if (res.StatusCode != 0) {
             UtilityService.showErrorAlert(res.Message);
           } else {
             UtilityService.showErrorAlert("Transaction Pin has been successfully changed");
             $state.go("dashboard");
           }
         }, function (reason) {
           $scope.data = {};
           Gtbank.wait(false);
           UtilityService.showErrorAlert('Error communicating with host, please try again later.');
         });
     }
   };


});
