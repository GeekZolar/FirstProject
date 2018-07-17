var gtw = angular.module('starter');

gtw.controller('liquidateGtTargetCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory,$filter) {

  $scope.utilityService = UtilityService;
    $scope.accounts = Gtbank.getAccountInfo();
    $scope.form = {
      useToken: Gtbank.getUseToken(),
      data:{
        UserId: Gtbank.getUserId(),
        RequestType:"",
        TargetAccount:"",
        DestAccount:"",
        Amount:""
      },
      Token:"",
      amountIsFixed: false
  }

    $scope.autoFillAmount = function ()
    {
      if($scope.form.data.RequestType == 'FULL' && $scope.form.data.TargetAccount){
      $scope.accounts.filter(function(element,index){
        if (element.NUMBER == $scope.form.data.TargetAccount) {
            $scope.form.data.Amount = element.AVAILABLEBALANCE;
            $scope.form.amountIsFixed = true;
        }
      })
    }else {
      $scope.form.data.Amount = "";
      $scope.form.amountIsFixed = false;
    }

  };

    $scope.Submit = function ()
    {
      console.log($scope.form.data);
      if (!$scope.form.data.RequestType ||!$scope.form.data.TargetAccount || !$scope.form.data.DestAccount || !$scope.form.data.Amount) {
        UtilityService.showErrorAlert("Please fill all input fields completely.");
        return false;
      }
console.log('i got here');
      Gtbank.wait(true);
      CallService.doPost($scope.form.data, ACTION_URLS.GTTARGET_LIQUIDATE)
        .then(function (response) {
          console.log(response);
         var res = angular.fromJson(response.data);
          if (res.StatusCode == 0) {
           Gtbank.wait(false);
           var trnsResp = angular.fromJson(res.Message);
           console.log(trnsResp);
           if (trnsResp.CODE == "1000") {
             $state.go("successful");
             $scope.accounts.filter(function(element,index){
               if (element.NUMBER == $scope.form.data.TargetAccount) {
                   element.AVAILABLEBALANCE = parseFloat(element.AVAILABLEBALANCE) - parseFloat($scope.form.data.Amount);
               }
               if (element.NUMBER == $scope.form.data.DestAccount) {
                   element.AVAILABLEBALANCE = parseFloat(element.AVAILABLEBALANCE) + parseFloat($scope.form.data.Amount);
               }
             });
           }else {
             UtilityService.showErrorAlert(trnsResp.ERROR);
             console.log(trnsResp.ERROR);

           }
          } else {
            Gtbank.wait(false);
            UtilityService.showErrorAlert(res.Message);
          }
        }, function (reason) {
          Gtbank.wait(false);
          UtilityService.showErrorAlert('Error communicating with host, please try again later.');
        });
        //accountsInfo[i].AVAILABLEBALANCE = parseFloat(accountsInfo[i].AVAILABLEBALANCE) - parseFloat($scope.form.data.Amount);
        //                accountsInfo[i].AVAILABLEBALANCE = parseFloat(accountsInfo[i].AVAILABLEBALANCE) + parseFloat($scope.form.data.Amount);

   }


});
