var gtw = angular.module('starter');
gtw.controller('westernUnion2Ctrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
$scope.$on('$ionicView.beforeEnter', function () {

  $scope.Info = Gtbank.getInfo();

  $scope.form = {
    data:{
      UserId:$scope.Info.UserId,
      Currency: $scope.Info.Currency,
      Udid:$scope.Info.Udid,
      WesternUnionAnswer:$scope.Info.WesternUnionAnswer,
      SenderLastName:$scope.Info.SenderLastName,
      SenderFirstName:$scope.Info.SenderFirstName,
      SenderCountry:$scope.Info.SenderCountry,
      ReceiverSurname:undefined,
      ReceiverMiddleName:undefined,
      ReceiverFirstName:undefined,
      EmailAddress:undefined,
      ReceiverMobile:undefined,
      ReceiverAddress:undefined,
      DateOfBirth:undefined,
      Bvn:undefined
    },
    Others:{
      ToAccount: $scope.Info.ToAccount,
      Amount: $scope.Info.Amount,
      Mtcn: $scope.Info.Mtcn,
      SecretAnswer: "",
      TokenCode: undefined
    },
    Token:"",
    useToken: Gtbank.getUseToken()
  }

  $scope.cancelAuthorization = function(){
    $scope.modal.hide();
  }

  $scope.enableAuthorization = function(){
    $scope.form.reviewAmount = $scope.form.Others.Amount;
    $scope.form.reviewName = 'Western Union';
    $scope.form.Token = "";
    UtilityService.showModal('auth_dialog.html', $scope);
  }

  $scope.continue = function() {

    if (!$scope.form.data.ReceiverSurname || !$scope.form.data.ReceiverMiddleName || !$scope.form.data.ReceiverFirstName
    || !$scope.form.data.ReceiverMobile || !$scope.form.data.EmailAddress || !$scope.form.data.ReceiverAddress
    || !$scope.form.data.DateOfBirth || !$scope.form.data.Bvn) {
      UtilityService.showErrorAlert("Please fill all fields correctly");
      return false;
    }
    else {
      $scope.enableAuthorization();
    }
    }

  $scope.confirmTransfer = function() {

    if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
      return false;
    }

    $scope.cancelAuthorization();
    $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);
    Gtbank.wait(true);
    CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.WESTERN_TRANSFER)
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
