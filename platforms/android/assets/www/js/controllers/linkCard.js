var gtw = angular.module('starter');
gtw.controller('linkCardCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter,USEFUL_CNSTS) {

  var data= Gtbank.getData();
  $scope.data = {
        Pan:undefined,
        Month:undefined,
        Cvv:undefined,
        Pin:undefined
      }

     $scope.linkCard = function () {
       document.activeElement.blur();
       if (!$scope.data.Pan
         ||!$scope.data.Month||!$scope.data.Cvv||!$scope.data.Pin) {
         UtilityService.showErrorAlert("Please fill all input fields correctly.");
       }
        else {
      authData = {
        "Pan" : $scope.data.Pan,
        "Cvv" : $scope.data.Cvv,
        "Pin" : $scope.data.Pin,
        "ExpiryYear" : $filter("date")($scope.data.Month, 'yy'),
        "ExpiryMonth" : $filter("date")($scope.data.Month, 'MM'),
        "MobileNumber" : data.MobileNumber,
        "ChannelId" : '2',
        "CustomerName" : data.FirstName +" "+data.LastName,
        "EmailAddress" : data.EmailAddress,
        "Gender" : data.Gender
      };

      otherParams = {
        "FirstName": data.FirstName,
        "LastName": data.LastName,
        "Password": data.Password
      };

      request = {
        AuthData: UtilityService.encryptData(authData),
        OtherParam: UtilityService.encryptData(otherParams)
      }

      $scope.data.Password= "";
      $scope.data.ConfirmPassword="";
       Gtbank.wait(true);
       CallService.doPostWithoutEnc(request, ACTION_URLS.LINK_CARD)
         .then(function (response) {
           Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
           var res = angular.fromJson(response.data);
           if (res.Id== 1000) {
             //Gtbank Card
             Gtbank.wait(false);
             Gtbank.setEmail(data.EmailAddress);
             UtilityService.showErrorAlert(res.Message);
             $state.go("register-complete");
           }
           else if (res.Id ==1002) {
             //Requires OTP
             Gtbank.wait(false);
             Gtbank.setEmail(data.EmailAddress);
             Gtbank.setMobileNumber(data.MobileNumber);
             $scope.data.Cvv = '';
             $scope.data.Pin = '';
             Gtbank.setData(res);
             $state.go("otp");
           }
           else if (res.Id ==1003) {
             //Requires Cardinal PIN
             Gtbank.wait(false);
           }
            else {
             Gtbank.wait(false);
             UtilityService.showErrorAlert(res.Message);
           }
         }, function (reason) {
           Gtbank.wait(false);
         //  UtilityService.showErrorAlert('Error communicating with host, please try again later.');
         });
     }
   }
});
