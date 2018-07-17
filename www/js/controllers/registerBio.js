var starter = angular.module('starter');

starter.controller('registerCtrl', function($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService){

  $scope.data = {
    FirstName: undefined,
    LastName: undefined,
    EmailAddress: undefined,
    Password: undefined,
    ConfirmPassword:undefined,
    Gender: undefined,
    MobileNumber: undefined
  }

  $scope.register= function(){
    document.activeElement.blur();
    if (!$scope.data.FirstName || !$scope.data.LastName || !$scope.data.EmailAddress||
       !$scope.data.Password||!$scope.data.ConfirmPassword||!$scope.data.Gender||!$scope.data.MobileNumber) {
      UtilityService.showErrorAlert("Please fill all input fields correctly.");
    }
    else if ($scope.data.Password != $scope.data.ConfirmPassword) {
      UtilityService.showErrorAlert("Password does not match.");
    }
    else {
      request = {Email:$scope.data.EmailAddress}
      Gtbank.wait(true);
      CallService.doPost(request, ACTION_URLS.DOES_CUSTOMER_EXIST)
        .then(function (response) {
          Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
          var res = angular.fromJson(response.data);
          if (res.Code == 1000) {
            //Gtbank Card
            Gtbank.wait(false);
            Gtbank.setData($scope.data);
            $state.go('register-card');
          }
           else {
            Gtbank.wait(false);
            $state.go("login");
            UtilityService.showErrorAlert(res.Message);
          }
        }, function (reason) {
          Gtbank.wait(false);
        });

    }
  }


})
