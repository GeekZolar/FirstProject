var gtw = angular.module('starter');
gtw.controller('westernUnion1Ctrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {

  $scope.utilityService = UtilityService;
  $scope.accounts= Gtbank.getAccountInfo();
  $scope.form = {
    data:{
      UserId:Gtbank.getUserId(),
      Mtcn:undefined,
      Currency:"566",
      Udid:Gtbank.getUuid(),
      ToAccount:undefined,
      Amount:undefined,
      WesternUnionAnswer:undefined,
      SenderLastName:undefined,
      SenderFirstName:undefined,
      SenderCountry:undefined
    },
    Token:""
  }

  Gtbank.wait(true);
  CallService.doPost(null, ACTION_URLS.WESTERN_COUNTRIES)
    .then(function (response) {
      Gtbank.wait(false);
      var res = angular.fromJson(response.data);
      if (res.StatusCode == 0) {
        var msg = angular.fromJson(res.Message);
         $scope.Countries = angular.fromJson(msg.COUNTRIES).COUNTRY;
      }
      else {
        var msg = angular.fromJson(res.Message);
      }
   }, function (reason) {
     Gtbank.wait(false);
     UtilityService.showErrorAlert('Error communicating with host, please try again later.');
   });

  $scope.continue = function() {
    if (!$scope.form.data.ToAccount || !$scope.form.data.Mtcn || !$scope.form.data.Amount
    || !$scope.form.data.WesternUnionAnswer || !$scope.form.data.SenderLastName || !$scope.form.data.SenderFirstName
    || !$scope.form.data.SenderCountry) {
      UtilityService.showErrorAlert("Please fill all fields correctly");
      return false;
    }
    else {
      Gtbank.setInfo($scope.form.data);
      $state.go("westernUnion2");
    }
    }
});
