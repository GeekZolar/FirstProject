var gtw = angular.module('starter');
gtw.controller('loansCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter) {

  $scope.utilityService = UtilityService
  $scope.accounts = Gtbank.getAccountInfo();

  $scope.form = {
    useToken: Gtbank.getUseToken(),
    otherAuth: true,
    data:{
      UserId: Gtbank.getUserId()
    }
   }

   $scope.checkEligibility = function () {

     Gtbank.wait(true);
     CallService.doPost($scope.form.data, ACTION_URLS.SALARYADVANCE_ELIGIBILITY)
       .then(function (response) {
        var res = angular.fromJson(angular.fromJson(response.data));
         if (res.StatusCode == 0) {
          Gtbank.wait(false);
          $state.go("salary-advance");
         } else {
           Gtbank.wait(false);
           UtilityService.showErrorAlert(res.Message);
         }
       }, function (reason) {
         Gtbank.wait(false);
         $scope.form.Token = {};
         $scope.cancelAuthorization();
         UtilityService.showErrorAlert('Error communicating with host, please try again later.');
       })

   }

});
