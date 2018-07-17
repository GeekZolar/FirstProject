var gtw = angular.module('starter');
gtw.controller('taxCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function () {

  $scope.utilityService = UtilityService;
  $scope.accounts= Gtbank.getAccountInfo();

  $scope.request={
    BillerId:undefined
  }
  $scope.value={
    fees:undefined
  }
  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      SourceAccount:undefined,
      Remarks:undefined,
      BillId:undefined,
      UtilityId:undefined,
      BillerName:undefined,
      UtilityName:undefined,
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
  $scope.value.fees = "100";

  $scope.getCategory = function() {

    var name = document.getElementById("utilityName");
    var selectedBillerName = name.options[name.selectedIndex].text;
    $scope.form.data.BillerName = selectedBillerName;

    $scope.form.data.BillId = $scope.request.BillerId;

    Gtbank.wait(true);
    CallService.doPost($scope.request, ACTION_URLS.BILLER_ITEMS)
      .then(function (response) {
        var res = angular.fromJson(angular.fromJson(response.data));
        if (res.StatusCode == 0) {
          Gtbank.wait(false);
          var msg = angular.fromJson(res.Message);
           $scope.Category = angular.fromJson(msg.PAYMENTITEMLIST).PAYMENTITEM;
        }
        else {
          Gtbank.wait(false);
          var msg = angular.fromJson(res.Message);
          UtilityService.showErrorAlert(angular.fromJson(res.Message).ERROR);
        }
     }, function (reason) {
       Gtbank.wait(false);
       UtilityService.showErrorAlert('Error communicating with host, please try again later.');
     });
  }

  $scope.showDetails = false;

  $scope.getFields = function(){

    if ($scope.form.data.UtilityId) {
      $scope.showDetails = true;
    }

    angular.forEach($scope.Category,function(value){
                  if(value.ID == $scope.form.data.UtilityId){
                      $scope.placeholder = value.CONSUMERIDFIELD;
                  };
              })

    angular.forEach($scope.Category,function(value){
                    if(value.ID == $scope.form.data.UtilityId){
                      var amount = value.AMOUNT;
                      $scope.form.Others.Amount = amount.substr(0, amount.length-2);
                };
              })

    angular.forEach($scope.Category,function(value){
                    if(value.ID == $scope.form.data.UtilityId){
                        $scope.form.data.UtilityName = value.NAME;
                  };
                  })
}

  $scope.cancelAuthorization = function(){
    $scope.modal.hide();
  }

  $scope.enableAuthorization = function(){
    $scope.form.reviewAmount = $scope.form.Others.Amount;
    $scope.form.reviewName = 'TAX';
    $scope.form.Token = "";
    UtilityService.showModal('auth_dialog.html', $scope);
  }

  $scope.continue = function() {
    if (!$scope.form.data.SourceAccount || !$scope.request.BillerId || !$scope.form.data.UtilityId || !$scope.form.Others.CustomerId) {
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
    Gtbank.wait(true);
    CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.QUICKTELLER_TRANSFER)
      .then(function (response) {
        Gtbank.wait(false);
       var res = angular.fromJson(angular.fromJson(response.data));
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
