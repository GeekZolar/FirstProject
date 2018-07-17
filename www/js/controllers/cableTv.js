var gtw = angular.module('starter');
gtw.controller('CabletvCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function () {

  $scope.utilityService = UtilityService;
  $scope.accounts= Gtbank.getAccountInfo();
  $scope.useridData = {
    UserId: Gtbank.getUserId()
  };

  $scope.request={
    CustomerId:undefined,
    BillerId:undefined
  }
  $scope.value={
    name:undefined
  }
  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      SourceAccount:undefined,
      BillId:undefined,
      UtilityId:undefined,
      BillerName:undefined,
      UtilityName:undefined,
      Udid:Gtbank.getUuid(),
      OtherParams: undefined
    },
    Token:"",
    Others: {
      Amount:"",
      CustomerId:"",
      SecretAnswer:"",
      TokenCode:""
    },
    useToken: Gtbank.getUseToken()
  }

  $scope.getCategory = function() {
    var billId = $scope.request.BillerId
    var name = document.getElementById("utilityName");
    var selectedBillerName = name.options[name.selectedIndex].text;
    // $scope.form.data.BillerName = selectedBillerName;
    $scope.request.BillerId = selectedBillerName;
    $scope.form.data.BillerName = selectedBillerName;
    $scope.form.data.BillId = billId;
    Gtbank.wait(true);
    CallService.doPost($scope.request, ACTION_URLS.BILLER_ITEMS)
      .then(function (response) {
        var res = angular.fromJson(angular.fromJson(response.data));
        if (res.StatusCode == 0) {
          Gtbank.wait(false);
          var msg = angular.fromJson(res.Message);
          $scope.value.name= msg.NAME;
           $scope.Category = angular.fromJson(msg.PRODUCTS).PRODUCT;
        }
        else {
          Gtbank.wait(false);
          //var msg = angular.fromJson(res.Message);
          UtilityService.showErrorAlert(res.Message);
        }
     }, function (reason) {
       Gtbank.wait(false);
       UtilityService.showErrorAlert('Error communicating with host, please try again later.');
     });
  }

  //Third Party Account To Debit

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


  $scope.showDetails = false;

  $scope.getFields = function(){

    if ($scope.form.data.UtilityId) {
      $scope.showDetails = true;
    }
    angular.forEach($scope.Category,function(value){
                    if(value.PRODUCTKEY == $scope.form.data.UtilityId){
                      $scope.form.Others.Amount = value.AMOUNT;
                };
              })

    angular.forEach($scope.Category,function(value){
              if(value.PRODUCTKEY == $scope.form.data.UtilityId){
                $scope.form.data.UtilityName = value.PRODUCTDESCRIPTION;
              };
          })
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
    $scope.form.Others.CustomerId = $scope.request.CustomerId
    $scope.form.data.UtilityId="";
    if (!$scope.form.data.SourceAccount || !$scope.form.Others.CustomerId) {
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

gtw.controller('otherQuicktellerCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
$scope.$on('$ionicView.beforeEnter', function () {

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
      Udid:Gtbank.getUuid(),
      OtherParams: undefined
    },
    Token:"",
    Others: {
      Amount:"",
      CustomerId:"",
      SecretAnswer:"",
      TokenCode:""
    },
    useToken: Gtbank.getUseToken()
  }
  $scope.value.fees = "100";

  Gtbank.wait(true);
  CallService.doPost(null, ACTION_URLS.GET_BILLERS)
    .then(function (response) {
      var res = angular.fromJson(angular.fromJson(response.data));
      if (res.StatusCode == 0) {
        Gtbank.wait(false);
        var msg = angular.fromJson(res.Message);
         $scope.QuicktellerCategory = angular.fromJson(msg.BILLERLIST).CATEGORY;
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

   $scope.getSubcategory = function() {
     $scope.subCategory = [];

     angular.forEach($scope.QuicktellerCategory,function(element,index){
       if (element.ID === $scope.form.data.quickteller) {
         $scope.subCategory = element.BILLER;
       }
     })
   }

  $scope.getProduct = function() {

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
    $scope.form.reviewName = $scope.form.data.BillerName;
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
