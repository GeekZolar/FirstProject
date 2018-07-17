var gtw = angular.module('starter');
gtw.controller('utilityCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function () {

  $scope.accounts= Gtbank.getAccountInfo();

  $scope.request={
    BillerId: undefined,
    CustomerId:undefined
  }
  $scope.value={
    fees:undefined
  }
  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      SourceAccount:undefined,
      Remarks: "",
      BillId:undefined,
      UtilityId:"",
      BillerName:undefined,
      UtilityName: undefined,
      PhoneNo: undefined || "",
      RefId: undefined,
      Udid:Gtbank.getUuid()
    },
    Token:"",
    Others: {
      Amount:"",
      CustomerId:undefined,
      SecretAnswer:"",
      TokenCode:""
    },
     useToken: Gtbank.getUseToken()
  }
  $scope.value.fees = "";

  $scope.useridData = {
    UserId: Gtbank.getUserId()
  };

  $scope.getCategory = function() {

    var name = document.getElementById("utilityName");
    var selectedBillerName = name.options[name.selectedIndex].text;
    $scope.form.data.BillerName = selectedBillerName;
    $scope.request.BillerId=selectedBillerName;
    $scope.form.Others.CustomerId = $scope.request.CustomerId;
    if (selectedBillerName =="ECG") {
      Gtbank.wait(true);
      CallService.doPost($scope.request, ACTION_URLS.BILLER_ITEMS)
        .then(function (response) {
         var res = angular.fromJson(angular.fromJson(response.data));
         console.log(response);
          if (res.StatusCode == 0) {
           Gtbank.wait(false);
           var trnsResp = angular.fromJson(res.Message);
           if (trnsResp.CODE == "1000") {
             $scope.form.data.UtilityName = trnsResp.NAME;
             console.log(trnsResp.NAME);

           }else {
             UtilityService.showErrorAlert(trnsResp.ERROR);
           }
          } else {
            Gtbank.wait(false);
            UtilityService.showErrorAlert(res.Message);
          }
        }, function (reason) {
          Gtbank.wait(false);
          UtilityService.showErrorAlert('Error communicating with host, please try again later.');
        });
    }

  }
  //Third Party Account to Debit

  var tatd = Gtbank.getThirdPartyAccountToDebit();
  if(tatd.length == 0)
  {

    //Code For Third Party Acc to Debit
    Gtbank.wait(true);
     CallService.doPost($scope.useridData, ACTION_URLS.THIRD_PARTY_TO_DEBIT)
      .then(function (response) {
        console.log(response);
        var res = angular.fromJson(angular.fromJson(response.data));
        if (res.StatusCode == 0) {
           Gtbank.wait(false);
           var trnsResp = angular.fromJson(res.Message);
           if (trnsResp.CODE == "1000") {
             var resp = trnsResp.ACCOUNTS.ACCT;
             $scope.thirdPartyAccToDebit = resp;
             console.log($scope.thirdPartyAccToDebit);
             Gtbank.setThirdPartyAccountToDebit(resp);
           }
           else
           {
             UtilityService.showErrorAlert(trnsResp.ERROR);
           }
         }
         else {
           Gtbank.wait(false);
           UtilityService.showErrorAlert(res.Message);
         }
       }, function (reason)
       {
          Gtbank.wait(false);
          UtilityService.showErrorAlert('Error communicating with host, please try again later.');
         });
       }
       else
       {
         $scope.thirdPartyAccToDebit = tatd;
       }

  $scope.showecg = false;
  $scope.showgwcl = false;

  $scope.getFields = function(){

    if ($scope.form.data.BillId == "4003") {
      $scope.showecg = true;
      $scope.showgwcl = false;
    }
    else {
      $scope.showgwcl = true;
      $scope.showecg = false;
    }
}

  $scope.cancelAuthorization = function(){
    $scope.modal.hide();
  }

  $scope.enableAuthorization = function(){
    $scope.form.reviewAmount = $scope.form.Others.Amount;
    $scope.form.reviewName = $scope.form.data.BillerName;
    $scope.form.Token = "";
    UtilityService.showModal('auth_dialog.html', $scope);
  }

  $scope.continue = function() {
    if (!$scope.form.data.SourceAccount || !$scope.request.BillerId || !$scope.request.CustomerId || !$scope.form.Others.Amount) {
      console.log($scope.form.data);
      console.log($scope.request);

      UtilityService.showErrorAlert("Please fill all fields correctly");
      return false;
    }
    $scope.enableAuthorization();
    }

  $scope.confirmTransfer = function() {

    if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
      return false;
    }

    $scope.cancelAuthorization();

    $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);
    console.log($scope.form.data);
    Gtbank.wait(true);
    CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.QUICKTELLER_TRANSFER)
      .then(function (response) {
        Gtbank.wait(false);
       var res = angular.fromJson(angular.fromJson(response.data));
       console.log(res);
        if (res.StatusCode == 0) {
          var trnsResp = angular.fromJson(res.Message);
          if (trnsResp.CODE == "1000") {
            var accountsInfo = Gtbank.getAccountInfo();
                for (var i = 0; i < accountsInfo.length; i++) {
                    if (accountsInfo[i].NUMBER == $scope.form.data.SourceAccount) {
                        accountsInfo[i].AVAILABLEBALANCE = parseFloat(accountsInfo[i].AVAILABLEBALANCE) - parseFloat($scope.form.Others.Amount);
                    }
                }
                $state.go("successful");
          }else {
            UtilityService.showErrorAlert(trnsResp.ERROR);
          }
       } else {
         UtilityService.showErrorAlert(res.Message);
       }
     }, function (reason) {
       Gtbank.wait(false);
       UtilityService.showErrorAlert('Error communicating with host, please try again later.');
     });
  }
});
});
