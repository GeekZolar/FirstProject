var gtw = angular.module('starter');

gtw.controller('transferCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {

  $scope.$on('$ionicView.beforeEnter', function () {

    $scope.utilityService = UtilityService;
    $scope.accounts= Gtbank.getAccountInfo();
    $scope.useridData = {
      UserId: Gtbank.getUserId()
    };
    $scope.data = {};
    $scope.request = {TransType:"1"};
    $scope.OwnAccount = true;

    $scope.form = {
      data:{
        UserId: Gtbank.getUserId(),
        TransType: "",
        AddToBene:0,
        Udid:Gtbank.getUuid(),
        SourceAccount:"",
        Remarks:"",
        DestBankCode:"",
        SourceAccName:Gtbank.getAccountInfo()[0].CUSNAME,
        DestAccName:"",
        OtherParams: undefined
      },
      Token:"",
      Others: {
        Amount:"",
        DestAccNumber:"",
        SecretAnswer:"",
        TokenCode:"",
        UseToken: Gtbank.getUseToken()
      },
      new:{DestBankCode:"",TokenCode:"",SecretAnswer:""},
      useToken: Gtbank.getUseToken()
    }

    $scope.clearBeneficiary = function(){
      document.activeElement.blur();
      $scope.form.Name = "";
      $scope.form.Others.DestAccNumber = "";
      if ($scope.request.TransType == '1') {
        $scope.OwnAccount=true;
        $scope.notOwnAccount = false;
        return false;
      }
      $scope.notOwnAccount = true;
      $scope.OwnAccount=false;
    };

    $scope.clearModel = function(){
      var bene = [];
      Gtbank.setActiveBeneficiary(bene);
    }

    var  activeBeneficiary =  Gtbank.getActiveBeneficiary();
       if (activeBeneficiary.length > 0) {
         $scope.notOwnAccount = true;
         $scope.request.TransType = activeBeneficiary[0].transType+"";
         $scope.form.Name = activeBeneficiary[0].accountName;
         $scope.form.Others.DestAccNumber = activeBeneficiary[0].accountNumber;
         $scope.form.data.DestAccName = activeBeneficiary[0].accountName;
         $scope.form.data.DestBankCode = activeBeneficiary[0].destBankCode;
       }

       $scope.showBeneficiaries = function () {
         console.log($scope.request.TransType);
           document.activeElement.blur();
           $scope.getAKindOfBeneficiary();
           $scope.form.DisableTextBox = true;
           UtilityService.showModal('beneficiary_dialog.html', $scope);
       };

       $scope.cancelBeneficiaryModal = function(accountName,bankCode,preRegNuban){
         $scope.form.DisableTextBox = false;
         $scope.modal.hide();
             if (accountName) {
               var accNum = '';
               if ($scope.request.TransType == 5) {
                  accNum = preRegNuban;
               }else {
                  accNum = $scope.data.DestAccount;
               }

               $scope.form.Name = accountName;
               $scope.form.Others.DestAccNumber = accNum;
               $scope.form.data.DestAccName = accountName;
               $scope.form.data.DestBankCode = bankCode;
             }
       };

       //  Own Account To Debit

       // var atd = Gtbank.getAccountToDebit();
       // console.log(atd);
       // if(atd.length == 0)
       // {
                //Code For Own Acct to Debit
                console.log($scope.useridData);
                Gtbank.wait(true);
                CallService.doPost($scope.useridData, ACTION_URLS.OWN_ACC_TO_DEBIT)
                .then(function (response) {
                  var res = angular.fromJson(angular.fromJson(response.data));
                  if (res.StatusCode == 0) {
                    Gtbank.wait(false);
                    var trnsResp = angular.fromJson(res.Message);
                    if (trnsResp.CODE == "1000") {
                      var resp = trnsResp.ACCOUNTS.ACCT;
                      $scope.acctoDebit = resp;
                      $scope.form.data.SourceAccount = $scope.acctoDebit[0].NUMBER;
                      console.log($scope.acctoDebit);
                      Gtbank.setAccountToDebit(resp);
                    }
                    else
                    {
                      UtilityService.showErrorAlert(trnsResp.ERROR);
                    }
                  }
                  else
                  {
                    Gtbank.wait(false);
                    UtilityService.showErrorAlert(res.Message);
                  }
                },
                function (reason)
                {
                  Gtbank.wait(false);
                  UtilityService.showErrorAlert('Error communicating with host, please try again later.');
                });
              //}
              // else
              // {
              //   $scope.acctoDebit = atd;
              //   $scope.form.data.SourceAccount = $scope.acctoDebit[0].NUMBER;
              // }

            //  Own Account To Credit
              // var atc = Gtbank.getAccountToCredit();
              // if(atc.length == 0)
              // {
                //Code For Own Acct to Credit
                Gtbank.wait(true);
                CallService.doPost($scope.useridData, ACTION_URLS.OWN_ACC_TO_CREDIT)
                .then(function (response)
                {
                  var res = angular.fromJson(angular.fromJson(response.data));
                  if (res.StatusCode == 0)
                  {
                    Gtbank.wait(false);
                    var trnsResp = angular.fromJson(res.Message);
                    if (trnsResp.CODE == "1000")
                    {
                      var resp = trnsResp.ACCOUNTS.ACCT;
                      $scope.acctoCredit = resp;
                      console.log($scope.acctoCredit);
                      Gtbank.setAccountToCredit(resp);
                    }
                    else
                    {
                      UtilityService.showErrorAlert(trnsResp.ERROR);
                    }
                  }
                  else
                  {
                    Gtbank.wait(false);
                    UtilityService.showErrorAlert(res.Message);
                  }
                }, function (reason)
                {
                  Gtbank.wait(false);
                  UtilityService.showErrorAlert('Error communicating with host, please try again later.');
                });
              // }
              // else
              // {
              //   $scope.acctoCredit = atc;
              // }


              //Third Party Account To Debit

              // var tatd = Gtbank.getThirdPartyAccountToDebit();
              // if(tatd.length == 0)
              // {

                //Code For Third Party Acc to Debit
                Gtbank.wait(true);
                console.log($scope.useridData);
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
                   // }
                   // else
                   // {
                   //   $scope.thirdPartyAccToDebit = tatd;
                   // }

       $scope.getAKindOfBeneficiary = function(){

               $scope.ben = {
                 data:{
                   UserId: Gtbank.getUserId(),
                   TransType: $scope.request.TransType
                 }
               }
               $scope.beneficiary = [];
               $scope.data.isGetBeneficiaryDone = false;
               CallService.doPost($scope.ben.data, ACTION_URLS.BENEFICIARY)
                 .then(function (response) {
                  var res = angular.fromJson(response.data);
                  console.log(res);
                  if (res.StatusCode == 0) {
                    $scope.data.isGetBeneficiaryDone = true;
                    var msg = angular.fromJson(res.Message);
                    if ($scope.request.TransType == 5) {
                      $scope.beneficiary = msg.PREBENEFICIARIES.PREBENEFICIARY;
                      console.log($scope.beneficiary);
                    }else {
                      $scope.beneficiary = msg.BENEFICIARIES.BENEFICIARY;
                      console.log($scope.beneficiary);
                    }
                  }
                  else {
                    $scope.data.isGetBeneficiaryDone = true;
                    $scope.beneficiary = [];
                    UtilityService.showErrorAlert(res.Message);
                  }
                 }, function (reason) {
                   $scope.data.isGetBeneficiaryDone = true;
                   $scope.beneficiary = [];
                   UtilityService.showErrorAlert('Error communicating with host, please try again later.');
                 });
           };

       $scope.deleteBeneficiary = function (aBeneficiary) {

             UtilityService.showConfirmAlert("Are you sure you want to delete beneficiary with account "
                 + aBeneficiary.BENEFICIARYNAME + " from your list?", "Delete Beneficiary", "Yes", "No")
                 .then(function (index){
                   if(index == 1)
                   {
                     $scope.modal.hide();
                     Gtbank.setBeneficiary(aBeneficiary);
                     setTimeout(function () {
                       $state.go('confirm-delete',{transType: $scope.request.TransType});
                     }, 500);
                   }
                 });
           };

   $scope.cancelAuthorization = function(){
     $scope.modal.hide();
   };

   $scope.enableAuthorization = function(){
     $scope.form.reviewAmount = $scope.form.Others.Amount || $scope.form.new.Amount;
     $scope.form.reviewName = $scope.form.data.DestAccName || $scope.form.new.BeneName;
     $scope.form.Token = "";
     UtilityService.showModal('auth_dialog.html', $scope);
   };

   $scope.saveAddToBene = function(answer){
     $scope.form.new.AddToBene = answer || 0;
   };

    $scope.Transfer = function () {
      document.activeElement.blur();

      if (!$scope.directPayment) {
        if (!$scope.form.new.Amount || !$scope.form.new.SourceAccount || !$scope.form.new.DestAccNumber || !$scope.form.new.BeneName) {
          UtilityService.showErrorAlert("Please fill all inputs correctly.");
          return false;
        }
      }else {
        if (!$scope.form.Others.Amount || !$scope.form.data.SourceAccount || !$scope.form.Others.DestAccNumber) {
          UtilityService.showErrorAlert("Please fill all inputs correctly.");
          return false;
        }
      }

      if ($scope.request.TransType == 1 ||$scope.request.TransType == 5) {
        //Call Own account transfer service
        $scope.confirmTransfer();
      }else {
        //display auth dialog
         $scope.enableAuthorization();
      }

    };

   $scope.confirmTransfer = function () {

     document.activeElement.blur();

     //when its not own xfr or not direct payment
     if (($scope.request.TransType !== '1' && $scope.request.TransType !== '5') || !$scope.directPayment) {
       if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
         return false;
       }
       $scope.cancelAuthorization();
     }


     if (!$scope.directPayment) {
       //$scope.form.data = $scope.form.new;
       $scope.form.data.TransType = $scope.request.tType;
       $scope.form.data.UserId = Gtbank.getUserId();
       $scope.form.data.Udid = Gtbank.getUuid();
       $scope.form.data.AddToBene = $scope.form.new.AddToBene || 0;
       $scope.form.data.DestAccName = $scope.form.new.BeneName;
       $scope.form.Others.Amount = $scope.form.new.Amount;
       $scope.form.Others.DestAccNumber = $scope.form.new.DestAccNumber;
       $scope.form.data.SourceAccount = $scope.form.new.SourceAccount;
       $scope.form.data.DestBankCode = $scope.form.new.DestBankCode || '058';
     }else {
       $scope.form.data.TransType = $scope.request.TransType;
       $scope.form.data.AddToBene = 0;
     }

      //  var amount = Number($scope.form.Others.Amount);
      //  $scope.form.Others.Amount = amount.toFixed(2);
       $scope.form.data.OtherParams = UtilityService.encryptData($scope.form.Others);

       console.log($scope.form.data);
        Gtbank.wait(true);
        CallService.doPostWithoutEnc($scope.form.data, ACTION_URLS.TRANSFER)
          .then(function (response) {
            console.log(response);
           var res = angular.fromJson(angular.fromJson(response.data));
            if (res.StatusCode == 0) {
             Gtbank.wait(false);
             var trnsResp = angular.fromJson(res.Message);

             if (trnsResp.CODE == "1000") {
               var accountsInfo = Gtbank.getAccountInfo();
                   for (var i = 0; i < accountsInfo.length; i++) {
                       if (accountsInfo[i].NUMBER == $scope.form.data.SourceAccount) {
                           accountsInfo[i].AVAILABLEBALANCE = parseFloat(accountsInfo[i].AVAILABLEBALANCE) - parseFloat($scope.form.Others.Amount);
                       }
                       if (accountsInfo[i].NUMBER == $scope.form.Others.DestAccNumber) {
                           accountsInfo[i].AVAILABLEBALANCE = parseFloat(accountsInfo[i].AVAILABLEBALANCE) + parseFloat($scope.form.Others.Amount);
                       }
                   }
                   console.log(accountsInfo);
                   var amts= $scope.form.Others.Amount;
                   $scope.form.Others.Amount = "";
                   $scope.form.data.DestAccName = "";
                   $scope.form.new.BeneName = "";
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
            $scope.cancelAuthorization();
            UtilityService.showErrorAlert('Error communicating with host, please try again later.');
          });
     };


   $scope.directPayment = true;
   $scope.switchPayment = function(id){
     if (id == 1) {
       $scope.directPayment = false;
       $scope.request.tType = '2';
       $scope.request.TransType = '2';
       $scope.form.new.DestAccNumber = "";
       $scope.form.new.BeneName = "";
       $scope.form.new.Amount = "";
     }else {
       $scope.directPayment = true;
       $scope.request.TransType = '1';
     }
  }

  $scope.getAccount = function (){
    var account = document.getElementById('beneficiary').value;
    $scope.form.data.DestAccNumber = account;

  };

   var count = 0;
   $scope.form.new = {};
   $scope.getBanks = function(){
     $scope.form.new.DestAccNumber = "";
     $scope.form.new.BeneName = "";
     $scope.form.new.Amount = "";

     if ($scope.request.tType ==3 || $scope.request.tType ==4 && count == 0 && $scope.form.new) {
       //$scope.form.new.loading1 = true;
       Gtbank.wait(true);
       CallService.doPost(null, ACTION_URLS.GET_BANKS)
         .then(function (response) {
          //$scope.form.new.loading1 = false;
          Gtbank.wait(false);
          var res = angular.fromJson(angular.fromJson(response.data));
           if (res.StatusCode == 0) {
            var trnsResp = angular.fromJson(res.Message);
            $scope.banks = trnsResp.BANKS.BANK;
            count++;
           } else {
             UtilityService.showErrorAlert(res.Message);
           }
         });
     }
   };

   $scope.lookUpAccount = function(){
       if ($scope.request.tType ==2 && $scope.form.new) {

         request = {AccountNumber: $scope.form.new.DestAccNumber};
         //$scope.form.new.loading = true;
         Gtbank.wait(true);
         CallService.doPost(request, ACTION_URLS.CUSTOMER_NAME_GTB)
           .then(function (response) {
             console.log(response);
            //$scope.form.new.loading = false;
            Gtbank.wait(false);
            var res = angular.fromJson(angular.fromJson(response.data));
             if (res.StatusCode == 0) {
              var trnsResp = angular.fromJson(res.Message);
              $scope.form.new.BeneName = trnsResp.CUSTOMERNAME;
             } else {
               $scope.form.new.BeneName = "";
               UtilityService.showErrorAlert(res.Message);
             }
           });
       }
       if ($scope.request.tType ==3 || $scope.request.tType == 4 && $scope.form.new) {

         request = {BenBankCode: $scope.form.new.DestBankCode,BenAccountNumber:$scope.form.new.DestAccNumber};

         //$scope.form.new.loading = true;
         Gtbank.wait(true);
         CallService.doPost(request, ACTION_URLS.CUSTOMER_NAME_OTHERS)
           .then(function (response) {
             Gtbank.wait(false);
            var res = angular.fromJson(response.data);
             if (res.StatusCode == 0) {
              var trnsResp = angular.fromJson(res.Message);
              $scope.form.new.BeneName = trnsResp.ACCOUNTNAME;
             } else {
               UtilityService.showErrorAlert(res.Message);
             }
           });
       }
   };
  });


});
