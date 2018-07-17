var gtw = angular.module('starter');
gtw.controller('salaryAdvanceCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter) {

  $scope.utilityService = UtilityService
  $scope.accounts = Gtbank.getAccountInfo();

  $scope.form = {
    useToken: Gtbank.getUseToken(),
    otherAuth: true,
    data:{
      UserId: Gtbank.getUserId(),
      Udid: Gtbank.getUuid(),
      DestAccNumber:"",
      Amount: undefined,
      TokenCode:"",
      SecretAnswer:""
    },
    Token:""
   }

   $scope.cancelAuthorization = function(){
     $scope.modal.hide();
   };

   $scope.enableAuthorization = function(){

     if (!$scope.form.data.DestAccNumber || !$scope.form.data.Amount) {
       UtilityService.showErrorAlert("Please fill all fields correctly");
       return false;
     }

     $scope.form.Token = "";
     UtilityService.showModal('auth_dialog.html', $scope);
   };

   $scope.confirmTransfer = function() {
     document.activeElement.blur();

     if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
       return false;
     }

       $scope.cancelAuthorization();
       Gtbank.wait(true);
       CallService.doPost($scope.form.data, ACTION_URLS.SALARY_ADVANCE)
         .then(function (response) {
          var res = angular.fromJson(angular.fromJson(response.data));
           if (res.StatusCode == 0) {
            Gtbank.wait(false);
            var trnsResp = angular.fromJson(res.Message);

            if (trnsResp.CODE == "1000") {
                  $state.go("successful");
            }else {
              UtilityService.showErrorAlert(trnsResp.ERROR);
            }
           } else {
             Gtbank.wait(false);
             UtilityService.showErrorAlert(res.Message);
           }
         }, function (reason) {
           Gtbank.wait(false);
           $scope.form.Token = {};
           UtilityService.showErrorAlert('Error communicating with host, please try again later.');
         });
   };

});
