var gtw = angular.module('starter');
gtw.controller('airlineThreeCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
$scope.$on('$ionicView.beforeEnter', function () {

  $scope.Forms = Gtbank.getForms();
  $scope.Category = Gtbank.getCategory();
  $scope.FinalForm = Gtbank.getFinalForm();
  $scope.sourceAccount = Gtbank.getSourceAccount();
  $scope.accInfo = Gtbank.getAccountInfo()[0];

  $scope.formId = $scope.Forms[0].form_id;
  $scope.customerId = $scope.Category[0].CUSTOMER_ID;
  $scope.accName = $scope.accInfo.CUSNAME;

  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      SourceAccount: $scope.sourceAccount,
      CollAcct:$scope.FinalForm.COLL_ACT,
      FormId:$scope.formId,
      PostFormFields:undefined,
      Name:$scope.accName,
      Remarks:"",
      Udid:Gtbank.getUuid()
    },
    Token:"",
    Others: {
      Amount:"",
      CustomerId:$scope.customerId,
      SecretAnswer:"",
      TokenCode:""
    },
    useToken: Gtbank.getUseToken()
  }

  $scope.formReview = $scope.FinalForm.FIELDS.FIELD;
  var formReview = angular.fromJson(angular.toJson($scope.formReview));
  console.log(formReview);
  $scope.form.data.PostFormFields = formReview.map(function(event){return {FieldId: event.field_id, ActualValue: event.actual_value}} );

  //var amount = $scope.formReview.filter((event) => event.amt_ref === "1");
  var amount = formReview.filter(function (event) {
    return event.amt_ref === "1";
    });

    //var amt = amount.map((event) => event.actual_value);
    var amt = amount.map(function(event){
      return event.actual_value;
    })

   $scope.form.Others.Amount = parseFloat(amt[0])+"";

  $scope.cancelAuthorization = function(){
    $scope.modal.hide();
  }

  $scope.enableAuthorization = function(){
    $scope.form.reviewAmount = $scope.form.Others.Amount;
    $scope.form.reviewName = 'Airline';
    $scope.form.Token = "";
    UtilityService.showModal('auth_dialog.html', $scope);
  }

  $scope.continue = function() {
    // var amount = document.getElementById('238').value;
    //   $scope.form.Others.Amount = amount;
      $scope.enableAuthorization();
    }

    $scope.confirmTransfer = function() {

      if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
        return false;
      }

      $scope.cancelAuthorization();
      $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);
      Gtbank.wait(true);
      CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.POST_COLLECTION)
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
