var gtw = angular.module('starter');

gtw.controller('createGtTargetCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory,$filter) {

    $scope.utilityService = UtilityService;
    $scope.accounts= Gtbank.getAccountInfo();

    $scope.form = {
      useToken: Gtbank.getUseToken(),
      otherAuth: true,
      data:{
        UserId: Gtbank.getUserId(),
        StartDate: new Date(),
        EndDate: new Date(),
        Udid: Gtbank.getUuid(),
        Remarks:"",
        TargetName:"",
        Frequency: "",
        OtherParams:""
      },
      Token:"",
      req:{
        StartDate: new Date(),
        EndDate: new Date()
      },
      Others: {
        AccountToDebit:"",
        Amount:"",
        SecretAnswer:"",
        TokenCode:""
      }
  }



    $scope.Submit = function ()
    {
      if (!$scope.form.data.TargetName || !$scope.form.Others.AccountToDebit || !$scope.form.req.StartDate || !$scope.form.req.EndDate
         || !$scope.form.Others.Amount || !$scope.form.data.Frequency) {
        UtilityService.showErrorAlert("Please fill all input fields correctly.");
        return false;
      }

      $scope.enableAuthorization();

   }

   $scope.enableAuthorization = function()
   {
     $scope.form.Token = "";
     UtilityService.showModal('auth_dialog.html', $scope);
   };

   $scope.cancelAuthorization = function()
   {
     $scope.modal.hide();
   };

   $scope.confirmTransfer = function () {
     document.activeElement.blur();

     if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
       return false;
     }

     $scope.cancelAuthorization();
     $scope.form.data.StartDate = $filter("date")($scope.form.req.StartDate, 'MM-dd-yyyy');
     $scope.form.data.EndDate = $filter("date")($scope.form.req.EndDate, 'MM-dd-yyyy');
     var amount = Number($scope.form.Others.Amount);
     $scope.form.Others.Amount = amount.toFixed(2);
     $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);

      Gtbank.wait(true);
      CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.GTTARGET_CREATE)
        .then(function (response) {
          $scope.cancelAuthorization();
         var res = angular.fromJson(angular.fromJson(response.data));
          if (res.StatusCode == 0) {
           Gtbank.wait(false);
           var trnsResp = angular.fromJson(res.Message);
           if (trnsResp.CODE == "1000") {
              UtilityService.showSuccessAlert(trnsResp.MESSAGE);
              $state.go("savings");
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
          $scope.cancelAuthorization();
          UtilityService.showErrorAlert('Error communicating with host, please try again later.');
        });
   }

});
