var gtw = angular.module('starter');
gtw.controller('AirtimeCtrl', function (Idle, $scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {
$scope.$on('$ionicView.beforeEnter', function () {

  document.addEventListener("deviceready", function(){

    navigator.contactsPhoneNumbers.list(function(contacts) {
      $scope.contacts = contacts;
      console.log($scope.contacts);
   });

  }, false);

  $scope.utilityService = UtilityService;
  $scope.directPayment = true;
  $scope.searchInput = '';
  $scope.accounts = Gtbank.getAccountInfo();
  $scope.productId = {
    Airtime:"",
    Data:""
  }
  $scope.request = {
    CatType:""
  }
  $scope.net = {
    NetworkName:""
  }
  $scope.request={
    CustomerId:undefined,
    BillerId:undefined
  }

  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      UtilityName:undefined,
      UtilityRef:undefined,
      Udid:Gtbank.getUuid(),
      SourceAccount:undefined,
      CustomerEmail:"",
      ProductId:undefined,
      EndPoint:"",
      OtherParams: undefined

    },
    Token:"",
    Others: {
      Amount:"",
      CustomerMobile:"",
      SecretAnswer:"",
      TokenCode:"",
      UseToken: Gtbank.getUseToken()
    },
    useToken: Gtbank.getUseToken()
  }

  $scope.useridData = {
    UserId: Gtbank.getUserId()
  };
  $scope.showAirtime = false;
  $scope.showDataBundle = false;
  $scope.showAmount = false;

      $scope.getCategory = function() {
        if ($scope.request.CatType == 1) {
            $scope.showAirtime = true;
            $scope.disableAmount = false;
            $scope.showDataBundle = false;
            $scope.showAmount = true;
            $scope.form.Others.Amount = "";
            $scope.form.Others.CustomerMobile = "";
            $scope.productId.Airtime = "";
        }
        else{
          $scope.showDataBundle = true;
          $scope.showAirtime = false;
          $scope.disableAmount = true;
          $scope.showAmount = true;
          $scope.form.Others.Amount = "";
          $scope.form.Others.CustomerMobile = "";
          $scope.productId.Airtime = "";
        }
      }

      $scope.getDataBundleTypes = function() {
        $scope.request.CustomerId= $scope.form.Others.CustomerMobile;
        $scope.form.data.ProductId = $scope.productId.Airtime;
        var name = document.getElementById("utilityName");
        var selectedUtilityName = name.options[name.selectedIndex].text;
        $scope.request.BillerId=selectedUtilityName

        if ($scope.request.CatType == 2) {
          $scope.form.Others.Amount = "";
          //$scope.form.Others.CustomerMobile = "";

          Gtbank.wait(true);
          CallService.doPost($scope.request, ACTION_URLS.DATA_BUNDLES)
            .then(function (response) {
              var res = angular.fromJson(angular.fromJson(response.data));
                Gtbank.wait(false);
                console.log(res);
                var msg = angular.fromJson(res.Message);
                console.log(msg);
                $scope.form.data.ProductId = msg.PRODUCTID;
                $scope.form.data.EndPoint= msg.ENDPOINT;
                $scope.bundles = angular.fromJson(msg.PRODUCTS).PRODUCT;

                console.log($scope.bundles);
           }, function (reason) {
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
           });
        }
      };

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

      $scope.getAmount = function() {
        angular.forEach($scope.bundles,function(value){
                      if(value.BUNDLE == $scope.productId.Data){
                          $scope.form.Others.Amount = value.VALUE;
                          console.log($scope.form.Others.Amount);
                      };
                  })
      }

      $scope.cancelAuthorization = function(contactName){
        if(contactName) $scope.form.BeneName = contactName;
        $scope.modal.hide();
      }

      $scope.enableAuthorization = function(){
        $scope.form.reviewAmount = $scope.form.Others.Amount;
        $scope.form.reviewName = $scope.form.Others.CustomerMobile;
        $scope.form.Token = "";
        UtilityService.showModal('auth_dialog.html', $scope);
      }

      $scope.continue = function() {
        var name = document.getElementById("utilityName");
        var selectedUtilityName = name.options[name.selectedIndex].text;
        $scope.form.data.UtilityName = selectedUtilityName;

        if (!$scope.form.data.SourceAccount || !$scope.request.CatType) {
          UtilityService.showErrorAlert("Select all required parameters");
          return false;
        }

        if ($scope.request.CatType == 1) {
          if (!$scope.productId.Airtime || !$scope.form.Others.Amount || !$scope.form.Others.CustomerMobile ) {
            UtilityService.showErrorAlert("Select all required parameters");
            return false;
          }
          $scope.enableAuthorization();
        }
        if ($scope.request.CatType == 2) {
          if (!$scope.productId.Data || !$scope.productId.Airtime || !$scope.form.Others.CustomerMobile) {
            UtilityService.showErrorAlert("Select all required parameters");
            return false;
          }
          $scope.enableAuthorization();
          }
        }

    $scope.confirmTransfer = function() {

      if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
        return false;
      }

      $scope.cancelAuthorization();
      $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);
      $scope.form.data.UtilityRef = $scope.form.Others.CustomerMobile;

      console.log($scope.form.data);
      Gtbank.wait(true);
      CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.AIRTIME)
        .then(function (response) {
          console.log(response);
          Gtbank.wait(false);
         var res = angular.fromJson(response.data);
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
         $scope.form.Others.TokenCode = "";
       });
    }

    $scope.loadContacts = function(){
      Gtbank.wait(true);
      //$scope.form.searchInput = '';
      UtilityService.showModal('contacts_dialog.html', $scope);
    };

  });
});
