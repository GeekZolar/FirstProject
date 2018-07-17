var starter = angular.module('starter');

starter.controller('otpCtrl', function($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService){

  $scope.message = Gtbank.getData();

  $scope.data = {
        TransactionReference:$scope.message.Other,
        Otp:undefined,
        MobileNumber:Gtbank.getMobileNumber(),
        ChannelId:"2",
        CardId:0
      }

  $scope.validateOtp= function(){
      document.activeElement.blur();
      var request = {AuthData:UtilityService.encryptData($scope.data)};
    Gtbank.wait(true);
    CallService.doPostWithoutEnc(request, ACTION_URLS.VALIDATE_CARD_OTP)
      .then(function (response) {
        Gtbank.setResponse(angular.fromJson(angular.fromJson(response.data)));
        var res = angular.fromJson(response.data);
        if (res.Id== 1000) {
          Gtbank.wait(false);
          UtilityService.showErrorAlert(res.Message);
          $state.go("register-complete");
        }
         else {
          Gtbank.wait(false);
          UtilityService.showErrorAlert(res.Message);
        }
      }, function (reason) {
        Gtbank.wait(false);
      });
  }

});

starter.controller('RegisterCompleteCtrl', function($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService){

  $scope.email = Gtbank.getEmail();

});
