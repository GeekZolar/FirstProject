/**
 * Created by GapsliteBanking-AppDev 8/5/2015.
 */

 var gl = angular.module('starter');

  gl.controller('LoginGapsCtrl', function ($cordovaDevice,$ionicPush,$rootScope,CallService_Gaps,GAPS,$ionicPlatform,$cordovaDialogs,$scope, $stateParams, GapsliteBanking, UtilityServiceGaps, $state, $ionicHistory,Account) {
    $ionicPlatform.ready(function () {
      document.addEventListener("deviceready", function () {
            var device = $cordovaDevice.getDevice();
            users = GapsliteBanking.getUser();
            users.uuid = device.uuid;
            users.manufacturer = device.manufacturer;
            users.platform = device.platform;
            users.model = device.model;
            GapsliteBanking.setUser(users);
      },false);

    //   $ionicPush.register().then(function(t) {
    //     return $ionicPush.saveToken(t);
    //   }).then(function(t) {
    //  });

     var user = GapsliteBanking.getUser();

     $scope.data = {
       Username: undefined,
       Password: undefined,
       AccessCode: GapsliteBanking.getUserId(),
       Uuid: user.uuid,
       Model: user.model,
       Platform: user.platform,
       Manufacturer: user.manufacturer,
       DeviceToken: ''//t.token
     }

     $scope.glUserLogin = function () {

       document.activeElement.blur();

       if (!$scope.data.Username || !$scope.data.Password || !$scope.data.AccessCode) {
         UtilityServiceGaps.showErrorAlert("Please fill all input fields correctly.");
       } else {
         GapsliteBanking.setUserId($scope.data.AccessCode);
         GapsliteBanking.setUsername($scope.data.Username);
         GapsliteBanking.wait(true);
         console.log($scope.data);
         CallService_Gaps.doGapsPost(GAPS.LOGIN,$scope.data)
           .then(function (response) {
             console.log(response);
             $scope.data.hasOldPassword = false;
             $scope.data.OldPassword = $scope.data.Password;
             GapsliteBanking.setData($scope.data);
             GapsliteBanking.setResponse(angular.fromJson(response.data));
             var res = angular.fromJson(response.data);
             if('StatusCode' in res)
             {
               res.ErrorCode = res.StatusCode;
               res.ErrorDescription = res.Message;
             }
             if (res.ErrorCode == -705) {
               $scope.data.hasOldPassword = true;
               $scope.data.Password = "";
               GapsliteBanking.wait(false);
               $state.go('change-passwordGaps')
             }
             if (res.ErrorCode != 0) {
               $scope.data.Password = "";
               GapsliteBanking.wait(false);
               UtilityServiceGaps.showErrorAlert(res.ErrorDescription);
             } else {
               $scope.data.Password = "";
               GapsliteBanking.wait(false);
               Account.setGapsCode(res.AuthenticationToken);

                 if(angular.fromJson(res.ErrorDescription).length == 0){
                     UtilityServiceGaps.showErrorAlert("Sorry, you will not be able to login because there are no accounts found.");
                     return;
                 }

               GapsliteBanking.setAccountsInfo(angular.fromJson(res.ErrorDescription));
               GapsliteBanking.setName(res.OtherDescription);
               $state.go("accounts");
             }
           }, function (reason) {
             $scope.data.Password = "";
             GapsliteBanking.wait(false);
             UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
           });
       }
     }

        if (ionic.Platform.isAndroid()) {
          $ionicPlatform.registerBackButtonAction(function() {
            $cordovaDialogs.confirm('Are you sure you want to exit GAPSLITE?', 'Quit', ['Yes','No'])
              .then(function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = buttonIndex;
                if (btnIndex == 1) {
                  ionic.Platform.exitApp();
                }
                if (btnIndex == 2) {
                  return;
                }
              });
            }, 100);
        }

    });
  });

  gl.controller('HomeCtrl', function ($ionicPlatform,$cordovaDialogs,Account,$rootScope,CallService_Gaps,$window,$filter,$ionicScrollDelegate,$ionicHistory,Idle, Keepalive, $scope, $state, $ionicSideMenuDelegate, UtilityServiceGaps, GapsliteBanking, GAPS) {

    Idle.watch();

      $scope.data = {
          index:0,
          displayOtherContent:1,
          displayMenu :0,
          user:GapsliteBanking.getUserId(),
          name:GapsliteBanking.getName(),
          isDashboard: true,
          TransType: '2'
      };

      $scope.initMenuTrigger = function() {
        $ionicScrollDelegate.scrollTop();
        $("footer").fadeToggle(400),
        $("nav").fadeToggle(400),
        $("ion-content.dashboard").toggleClass("menu-open"),
        $(".navbar__action--menu").toggleClass("navbar__action--is-hidden"),
        $(".navbar__action--close").toggleClass("navbar__action--is-hidden");
      };

      $scope.form = {DisableTextBox: false};
      $scope.searchInput = '';
      $scope.accounts = GapsliteBanking.getAccountsInfo();
      $scope.cusNameWithInitials = GapsliteBanking.getResponse().OtherDescription || '';
      $scope.currency = $scope.accounts[0].Currency;

      $scope.slideHasChanged = function(index){
        $scope.data.index = index;
      };

    $scope.getBeneficiary = function () {
      if ($scope.data.TransType == '2')  {
        $scope.getAKindOfBeneficiary('gtbBene',GAPS.GET_GTB_BENEFICIARY);
      }

      if ($scope.data.TransType == '3') {
        $scope.getAKindOfBeneficiary('nipBene',GAPS.GET_NIP_BENEFICIARY);
      }

      if ($scope.data.TransType == '4') {
        $scope.getAKindOfBeneficiary('neftBene',GAPS.GET_NEFT_BENEFICIARY);
      }
    };

    $scope.showBeneficiaries = function () {
        document.activeElement.blur();
        $scope.getBeneficiary();
        $scope.form.DisableTextBox = true;
        UtilityServiceGaps.showModal('views/transfers/beneficiary_dialog.html', $scope);
    };

    $scope.cancelAuthorization = function(accountName){

          if (accountName) {
            var accNum = $scope.form.data.DestAccount;
            if($scope.data.TransType != '2'){
              // var arr = [];
              // arr = accNum.split(':');
              // $scope.form.data.DestAccount = arr[0];
            }
            $scope.form.Beneficiary = accountName +" - " + $scope.form.data.DestAccount;
            var bene = [];
            bene.push({accountNumber: $scope.form.data.DestAccount, accountName: accountName, transType: $scope.data.TransType});
            GapsliteBanking.setBeneficiary(bene);
          }

          $scope.modal.hide();
          $scope.form.DisableTextBox = false;
    };

    $scope.getAKindOfBeneficiary = function(beneKey,url){

          var beneficiary = Account.getValueInGaps(beneKey);
          if(beneficiary.length == 0)
          {
            var dto = {
                CustomerID:GapsliteBanking.getUserId(),
                AuthCode: Account.getGapsCode()
            }

              CallService_Gaps.doGapsPost(url,dto).then(function(result){
                  var data = angular.fromJson(result.data);
                  if('StatusCode' in data)
                  {
                      data.ErrorCode = data.StatusCode;
                      data.ErrorDescription = data.Message;
                  }
                  if(data.ErrorCode == 0)
                  {
                      var response = angular.fromJson(data.ErrorDescription);
                      $scope.bene = response;
                      Account.setValueInGaps(beneKey,response);
                  }
                  else
                  {
                      //error occured
                      UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
                  }
              })
          }
          else
          {
              $scope.bene = beneficiary;
          }
        };

    $scope.deleteBeneficiary = function (accNum, row) {
          //var nums = accNum.split(':');

          UtilityServiceGaps.showConfirmAlert("Are you sure you want to delete beneficiary with account "
              + accNum + " from your list?", "Delete Beneficiary", "Yes", "No")
              .then(function (index){

                if(index == 1)
                {
                  var dto = {
                    AuthCode: Account.getGapsCode(),
                    CustomerID:GapsliteBanking.getUserId(),
                    Nuban_Acct:accNum
                  }
                  GapsliteBanking.wait(true);
                  CallService_Gaps.doGapsPost(GAPS.DELETE_BENEFICIARY,dto).then(function(result){
                        GapsliteBanking.wait(false);
                        console.log(result);
                        var data = angular.fromJson(result.data);
                        if('StatusCode' in data)
                        {
                          data.ErrorCode = data.StatusCode;
                          data.ErrorDescription = data.Message;
                        }
                        if(data.ErrorCode == 0)
                        {
                          var whatIndex = null;
                        angular.forEach($scope.bene, function(element, index) {
                          if (element.Nuban_Acct === row.Nuban_Acct) {
                             whatIndex = index;
                          }
                        });
                        $scope.bene.splice(whatIndex, 1);
                        }
                        else
                        {
                          UtilityServiceGaps.showErrorAlert(data.ErrorDescription);
                        }

                      },function(reason){
                        GapsliteBanking.wait(false);
                        UtilityServiceGaps.showErrorAlert('Error communicating to host. Please try again');
                      }
                  );

                }

              });
        }

  })

  gl.controller('HistoryDetailsCtrl', function (GAPS, UtilityServiceGaps,$scope, $stateParams, $filter, CallService_Gaps, GapsliteBanking) {

      $scope.accounts = GapsliteBanking.getAccountsInfo();
      $scope.count = {index:0};
      $scope.slideHasChangedTo = function(index){
        $scope.count.index = index;
        $scope.req.SourceAccount = $scope.accounts[index].Nuban;
        getAutoHistory($scope.req.SourceAccount);
      };

      $scope.Date = Date;

       $scope.data = {
           UserId: GapsliteBanking.getUserId(),
           SourceAccount: undefined,
           FromDate: new Date(),
           ToDate: new Date()
         }
       var myDate = new Date();
       var aWeekAgo = new Date(myDate.getTime() - (60*60*24*7*1000));
       $scope.req = {
         FromDate: aWeekAgo,
         ToDate: new Date(),
       }

       var getAutoHistory = function(accountNum,isRange) {

          if(isRange){
            //search used
            $scope.data.FromDate = $filter("date")($scope.req.FromDate, 'dd/MM/yyyy');
            $scope.data.ToDate = $filter("date")($scope.req.ToDate, 'dd/MM/yyyy');
            $scope.data.SourceAccount = accountNum;
          }else {
            //on swipe and pageload
            $scope.data.FromDate = $filter("date")(aWeekAgo, 'dd/MM/yyyy');
            $scope.data.ToDate = $filter("date")(new Date(), 'dd/MM/yyyy');
            $scope.data.SourceAccount = accountNum;
          }

          $scope.count.isGetHistoryDone = false;
           CallService_Gaps.doGapsPost(GAPS.ACCOUNT_HISTORY,$scope.data)
             .then(function (response) {
               $scope.count.isGetHistoryDone = true;
               var msg = angular.fromJson(response.data);
               if (msg.StatusCode == 0) {
                 var data = angular.fromJson(msg.Message);
                 if (data.CODE != '1000') {
                     UtilityServiceGaps.showErrorAlert(msg.MESSAGE);
                 } else {
                   $scope.accRangeHistory = {};
                   $scope.accRangeHistory = data.TRANSACTIONS.TRANSACTION;
                 }
               }
             });
       };

       $scope.searchRange = function() {
         document.activeElement.blur();
         getAutoHistory($scope.req.SourceAccount || $scope.accounts[0].Nuban,true);
       };

       getAutoHistory($scope.accounts[0].Nuban);

  });

  gl.controller('TransfrCtrl', function ( $scope, $state, GapsliteBanking, CallService_Gaps, UtilityServiceGaps, $ionicHistory,Account, GAPS){


    $scope.$on('$ionicView.beforeEnter',function(){

      $scope.form = {
          data: {
              SourceAccount: undefined,
              DestAccount: undefined,
              Amount: undefined,
              UserId: GapsliteBanking.getUserId(),
              TokenCode:""
          },
        Token:"",
        DisableTextBox: false
      }

       $scope.accountsToCredit = [];
       $scope.accountsToDebit = [];
       $scope.request= {TransType:'1',tType:'1'};
       $scope.notOwnAccount = false;
       $scope.searchInput = '';
       $scope.bene = [];

     var  activeBeneficiary =  GapsliteBanking.getBeneficiary();

    //  $scope.clearModel = function(){
    //    var bene = [];
    //    GapsliteBanking.setBeneficiary(bene);
    //  }

     if (activeBeneficiary.length > 0) {
       $scope.notOwnAccount = true;
       $scope.request.TransType = activeBeneficiary[0].transType;
       $scope.form.Name = activeBeneficiary[0].accountName;
       $scope.form.data.DestAccount = activeBeneficiary[0].accountNumber;
     }


     $scope.Transfer = function () {
          if ($scope.request.TransType == "1") {
            //Call Own account transfer service
            $scope.doOwnAccountTransfer();
          }else {
            //display auth dialog
            if (!$scope.form.data.DestAccount || !$scope.form.data.Amount || !$scope.form.data.SourceAccount) {
              UtilityServiceGaps.showErrorAlert("Please fill all required inputs.");
              return false;
            }
             $scope.enableAuthorization();
          }
       }

     $scope.doOwnAccountTransfer = function(){

         if(UtilityServiceGaps.checkAmountToPay($scope.accountsToDebit,$scope.form.data.SourceAccount,$scope.form.data.Amount)){
             UtilityServiceGaps.showErrorAlert('Account to debit is lower than amount specified, please fund this account and try again.');
             return false;
         }
         if (!$scope.form.data.DestAccount || !$scope.form.data.Amount || !$scope.form.data.SourceAccount) {
           UtilityServiceGaps.showErrorAlert("Please fill all required inputs.");
           return false;
         }

         //change the values to regularAccounts
         var fromA = UtilityServiceGaps.getObjectInArray($scope.accountsToDebit,"Nuban",$scope.form.data.SourceAccount);
         var toA = UtilityServiceGaps.getObjectInArray($scope.accountsToCredit,"Nuban",$scope.form.data.DestAccount);
         var owt = {
             "FromAccount": fromA.AccountNo,
             "ToAccount":toA.AccountNo,
             "TransactionAmount":$scope.form.data.Amount,
             "Remark": "",
             "Reference":"",
             "Token":"",
             "AuthCode":Account.getGapsCode()
         }
         GapsliteBanking.wait(true);
         CallService_Gaps.doGapsPost(GAPS.OWN_ACCOUNT_TRANSFER,owt).then(function(result){
             GapsliteBanking.wait(false);
             var data = angular.fromJson(result.data);
             if('StatusCode' in data)
             {
               data.ErrorCode = data.StatusCode;
               data.ErrorDescription = data.Message;
             }
             if(data.ErrorCode != 0)
             {
                  UtilityServiceGaps.showErrorAlert(data.ErrorDescription);
             }
             else
             {
                 GapsliteBanking.wait(false);
                  $state.go('successfulGaps');
             }
         },function(error){
             GapsliteBanking.wait(false);
         })

       }

     $scope.confirmTransfer = function () {
       document.activeElement.blur();
       if ($scope.request.TransType == "2") {
         //Call GTBank Transfer
         $scope.doGtbankTransfer(GAPS.GTB_TRANSFER);
       }

       if ($scope.request.TransType == "3") {
         //Call NIP Transfer
         $scope.doGtbankTransfer(GAPS.NIP_TRANSFER);
       }
       if ($scope.request.TransType == "4") {
         $scope.doGtbankTransfer(GAPS.NEFT_TRANSFER);
         //Call NEFT Transfer
       }
     };

       var dto = {
           AuthCode: Account.getGapsCode()
       }
       //check if you have previously called
       var atd= Account.getAccountToDebit();
       if(atd.length == 0)
       {
         //Code For Acct to Debit
         GapsliteBanking.wait(true);
           CallService_Gaps.doGapsPost(GAPS.ACCOUNT_TO_DEBIT,dto).then(function(result){
              GapsliteBanking.wait(false);
              console.log(result);
               var data = angular.fromJson(result.data);
               if('StatusCode' in data)
               {
                 data.ErrorCode = data.StatusCode;
                 data.ErrorDescription = data.Message;
               }

               if(data.ErrorCode == 0)
               {
                   //results was obtained successfully
                   var response = angular.fromJson(data.ErrorDescription);
                   $scope.accountsToDebit = response;
                   Account.setAccountToDebit(response);
               }

           },function(error){
               GapsliteBanking.wait(false);
           });
       }
       else
       {
           $scope.accountsToDebit = atd;
       }

     $scope.loadAccountToCredit = function (){

       if ($scope.request.TransType != 1) {
         return false;
       }

         var atc= Account.getAccountToCredit();
       if(atc.length == 0)
       {
           GapsliteBanking.wait(true);
         var dto = {
             AuthCode: Account.getGapsCode()
         }
         CallService_Gaps.doGapsPost(GAPS.ACCOUNT_TO_CREDIT,dto).then(function(result){
             GapsliteBanking.wait(false);
             var data = angular.fromJson(result.data);
             if('StatusCode' in data)
             {
               data.ErrorCode = data.StatusCode;
               data.ErrorDescription = data.Message;
             }

             if(data.ErrorCode == 0)
             {
                 //results was obtained successfully
                 var response = angular.fromJson(data.ErrorDescription);
                 $scope.accountsToCredit = response;
                 Account.setAccountToCredit(response);
             }
         },function(error){
             GapsliteBanking.wait(false);
         });
     }else{
           $scope.accountsToCredit = atc;
           }
         }

     $scope.doGtbankTransfer = function (url) {

       var fromA = UtilityServiceGaps.getObjectInArray($scope.accountsToDebit,"Nuban",$scope.form.data.SourceAccount);
       var token =$scope.form.Token;
       //var toA = UtilityServiceGaps.getObjectInArray(acct,"Nuban_Acct",$scope.data.form.DestAccount);
       $scope.form.data.TokenCode= $scope.form.Token;

       if (!$scope.form.data.TokenCode) {
         UtilityServiceGaps.showErrorAlert('Please enter a Token Code.');
       } else {

        //  var accNum = $scope.form.data.DestAccount;
        //  if (accNum.indexOf(':') > -1) {
        //    var arr = [];
        //    arr = accNum.split(':');
        //    $scope.form.data.DestAccount = arr[0];
        //  }

         GapsliteBanking.wait(true);

         var gtt = {
           "FromAccount": fromA.AccountNo,
           "ToAccount":$scope.form.data.DestAccount,
           "TransactionAmount":$scope.form.data.Amount,
           "Remarks": $scope.form.data.Remarks || "",
           "Reference":"",
           "Token":$scope.form.data.TokenCode,
           "AuthCode":Account.getGapsCode(),
           "UserId":GapsliteBanking.getUserId()
         }
         console.log(gtt);

         CallService_Gaps.doGapsPost(url,gtt)
         .then(function(result){
           GapsliteBanking.wait(false);
           console.log(result);
           var data = angular.fromJson(result.data);
           if('StatusCode' in data)
           {
             data.ErrorCode = data.StatusCode;
             data.ErrorDescription = data.Message;
           }
           if(data.ErrorCode != 0)
           {
             GapsliteBanking.wait(false);
             UtilityServiceGaps.showErrorAlert(data.ErrorDescription);
           }
           else
           {
             GapsliteBanking.wait(false);
             $state.go('successfulGaps');
           }

         },function(error){
           GapsliteBanking.wait(false);
         })
       }
     };

     $scope.showOtherFields = function(){
        $scope.form.data.DestAccount = undefined;
        if ($scope.request.TransType == 1)
          $scope.notOwnAccount = false;
        else
          $scope.notOwnAccount = true;
      };

     $scope.getBeneficiary = function () {

           if ($scope.request.TransType == 2)  {
             $scope.getAKindOfBeneficiary('gtbBene',GAPS.GET_GTB_BENEFICIARY);
           }

           if ($scope.request.TransType == 3) {
             $scope.getAKindOfBeneficiary('nipBene',GAPS.GET_NIP_BENEFICIARY);
           }

           if ($scope.request.TransType == 4) {
             $scope.getAKindOfBeneficiary('neftBene',GAPS.GET_NEFT_BENEFICIARY);
           }
           $scope.form.DisableTextBox = true;
           UtilityServiceGaps.showModal('views/transfers/beneficiary_dialog.html', $scope);
       };

     $scope.goBack = function(){
         $state.go('accounts');
       }

     $scope.cancelAuthorization = function(accountName){
       $scope.modal.hide();
       $scope.form.DisableTextBox = false;
       if (accountName) {
         var accNum = $scope.form.data.DestAccount;
         if($scope.request.TransType != '2'){
          //  var arr = [];
          //  arr = accNum.split(':');
          //  $scope.form.data.DestAccount = arr[0];
           $scope.form.Name = accountName;
         }
         else {
           $scope.form.Name = accountName;
         }
       }
     };
     $scope.enableAuthorization = function(){
       $scope.form.reviewAmount = $scope.form.data.Amount;
       $scope.form.reviewName = $scope.form.Name;
         $scope.form.Token = "";
         UtilityServiceGaps.showModal('views/transfers/auth_dialog.html', $scope);
       };

     $scope.getAKindOfBeneficiary = function(beneKey,url){

         var beneficiary = Account.getValueInGaps(beneKey);
         if(beneficiary.length == 0)
         {
           GapsliteBanking.wait(true);
           var dto = {
               CustomerID:GapsliteBanking.getUserId(),
               AuthCode: Account.getGapsCode()
           }

             CallService_Gaps.doGapsPost(url,dto).then(function(result){
                 GapsliteBanking.wait(false);
                 var data = angular.fromJson(result.data);
                 if('StatusCode' in data)
                 {
                     data.ErrorCode = data.StatusCode;
                     data.ErrorDescription = data.Message;
                 }
                 if(data.ErrorCode == 0)
                 {
                     var response = angular.fromJson(data.ErrorDescription);
                     $scope.bene = response;
                     Account.setValueInGaps(beneKey,response);
                 }
                 else
                 {
                     //error occured
                     UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
                 }
             })
         }
         else
         {
             $scope.bene = beneficiary;
         }
       };

     $scope.confirmTransfer = function () {

       $scope.cancelAuthorization();
         if ($scope.request.TransType == 2){
           $scope.doGtbankTransfer(GAPS.GTB_TRANSFER);
         }
         else if ($scope.request.TransType == 3){
           $scope.doGtbankTransfer(GAPS.NIP_TRANSFER);
         }
         else if ($scope.request.TransType == 4){
           $scope.doGtbankTransfer(GAPS.NEFT_TRANSFER);
         }
      }

     });

     $scope.deleteBeneficiary = function (accNum, row) {
       //var nums = accNum.split(':');

       UtilityServiceGaps.showConfirmAlert("Are you sure you want to delete beneficiary with account "
           + accNum + " from your list?", "Delete Beneficiary", "Yes", "No")
           .then(function (index){

             if(index == 1)
             {
               var dto = {
                 AuthCode: Account.getGapsCode(),
                 CustomerID:GapsliteBanking.getUserId(),
                 Nuban_Acct:accNum
               }
               GapsliteBanking.wait(true);
               CallService_Gaps.doGapsPost(GAPS.DELETE_BENEFICIARY,dto).then(function(result){
                     GapsliteBanking.wait(false);


                     var data = angular.fromJson(result.data);
                     if('StatusCode' in data)
                     {
                       data.ErrorCode = data.StatusCode;
                       data.ErrorDescription = data.Message;
                     }
                     if(data.ErrorCode == 0)
                     {
                       var whatIndex = null;
                       angular.forEach($scope.bene, function(element, index) {
                         if (element.Nuban_Acct === row.Nuban_Acct) {
                            whatIndex = index;
                         }
                       });
                       $scope.bene.splice(whatIndex, 1);
                     }
                     else
                     {
                       UtilityServiceGaps.showErrorAlert(data.ErrorDescription);
                     }

                   },function(reason){
                     GapsliteBanking.wait(false);
                     UtilityServiceGaps.showErrorAlert('Error communicating to host. Please try again');
                   }
               );

             }

           });
     }

   });

  gl.controller('AddBeneficiaryCtrl', function ($ionicHistory,$rootScope,CallService_Gaps,Account,GAPS,GapsliteBanking,$scope, $ionicSlideBoxDelegate, $ionicModal, $state, UtilityServiceGaps)
   {
       $scope.form = {};
       $scope.request= {TransType:'2',tType:'2'};

       $scope.addOtherBankBeneficiary = function () {

         var dto = {
           AuthCode: Account.getGapsCode(),
           CustomerID:GapsliteBanking.getUserId(),
           Nuban_Acct:$scope.form.new.DestAccNumber,
           VendorName: $scope.form.new.BeneName,
           vendorBankCode:$scope.form.new.DestBankCode
         }
         CallService_Gaps.doGapsPost(caller,dto).then(function(result){

           GapsliteBanking.wait(false);
           var data = angular.fromJson(result.data);
           if('StatusCode' in data)
           {
             data.ErrorCode = data.StatusCode;
             data.ErrorDescription = data.Message;
           }
           if(data.ErrorCode == 0)
           {
               UtilityServiceGaps.showSuccessAlert("Beneficiary added successfully");
               $state.go('transfers');
           }
           else
           {
             GapsliteBanking.wait(false);
             console.log(data.ErrorDescription);
             UtilityServiceGaps.showSuccessAlert(data.ErrorDescription);
           }

         },function(error){
           GapsliteBanking.wait(false);
           UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
         })
       }

       $scope.doAddNewBeneficiary = function () {

         if (!$scope.form.new.DestAccNumber || $scope.form.new.DestAccNumber.length != 10) {
           UtilityServiceGaps.showErrorAlert("Please enter a valid account number.");
           return false;
         }
         if (!$scope.form.new.BeneName) {
           UtilityServiceGaps.showErrorAlert("Unable to retrieve account name. Please try again later");
           return false;
         }


         if($scope.request.tType == 3)
         {
           caller = GAPS.ADD_NIP_BENEFiCIARY;
           getter = GAPS.GET_NIP_BENEFICIARY;
           key = 'nipBene';
           $scope.addOtherBankBeneficiary();
           $scope.refreshBeneList(key, getter);
           return false;
         }
         if($scope.request.tType == 4)
         {
           caller = GAPS.ADD_NEFT_BENEFICIARY;
           getter = GAPS.GET_NEFT_BENEFICIARY;
           key = 'neftBene';
           $scope.addOtherBankBeneficiary();
           $scope.refreshBeneList(key, getter);
           return false;
         }

         GapsliteBanking.wait(true)
         var dto = {
           AuthCode: Account.getGapsCode(),
           CustomerID:GapsliteBanking.getUserId(),
           Nuban_Acct:$scope.form.new.DestAccNumber
         }

           CallService_Gaps.doGapsPost(GAPS.ADD_GTB_BENEFICIARY,dto)
               .then(function(result){
             GapsliteBanking.wait(false);
             var data = angular.fromJson(result.data);
             if('StatusCode' in data)
             {
               data.ErrorCode = data.StatusCode;
               data.ErrorDescription = data.Message;
             }
             if(data.ErrorCode == 0)
             {
                 UtilityServiceGaps.showSuccessAlert(data.ErrorDescription);
                 $scope.refreshBeneList('gtbBene', GAPS.GET_GTB_BENEFICIARY);
                 $state.go('transfers');
             }
             else
             {
               GapsliteBanking.wait(false);
               UtilityServiceGaps.showSuccessAlert(data.ErrorDescription);
             }

           },function(error){
             GapsliteBanking.wait(false);
             UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
           })
       }
       $scope.refreshBeneList = function(beneKey,url){

         var dto = {
             CustomerID:GapsliteBanking.getUserId(),
             AuthCode: Account.getGapsCode()
         }

           CallService_Gaps.doGapsPost(url,dto).then(function(result){
               GapsliteBanking.wait(false);
               var data = angular.fromJson(result.data);
               if('StatusCode' in data)
               {
                   data.ErrorCode = data.StatusCode;
                   data.ErrorDescription = data.Message;
               }
               if(data.ErrorCode == 0)
               {
                   var response = angular.fromJson(data.ErrorDescription);
                   $scope.bene = response;
                   Account.setValueInGaps(beneKey,response);
               }
               else
               {
                   //error occured
                  // UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
               }
           })
       }
       var count = 0;
       $scope.form.new = {};

       $scope.getBanks = function(){
         $scope.form.new.DestAccNumber = "";
         $scope.form.new.BeneName = "";
         $scope.form.new.Amount = "";

         if ($scope.request.tType ==3 || $scope.request.tType ==4 && count == 0 && $scope.form.new) {
           //$scope.form.new.loading1 = true;
           GapsliteBanking.wait(true);
           CallService_Gaps.doGapsPost( GAPS.BANKS, null)
             .then(function (response) {
              //$scope.form.new.loading1 = false;
              GapsliteBanking.wait(false);
              var res = angular.fromJson(response.data);
               if (res.StatusCode == 0) {
                var trnsResp = angular.fromJson(res.Message);
                $scope.banks = trnsResp.BANKS.BANK;
                count++;
               } else {
                 UtilityServiceGaps.showErrorAlert(res.Message);
               }
             });
         }
       };
       $scope.lookUpAccount = function(){
         if ($scope.form.new.DestAccNumber.length == 10) {
           if ($scope.request.tType ==2 && $scope.form.new) {
             request = {AccountNumber: $scope.form.new.DestAccNumber};
             //$scope.form.new.loading = true;
             GapsliteBanking.wait(true);
             CallService_Gaps.doGapsPost(GAPS.GTB_ACCOUNT_NAME, request )
               .then(function (response) {
                //$scope.form.new.loading = false;
                GapsliteBanking.wait(false);
                var res = angular.fromJson(response.data);
                 if (res.StatusCode == 0) {
                  var trnsResp = angular.fromJson(res.Message);
                  $scope.form.new.BeneName = trnsResp.CUSTOMERNAME;
                 } else {
                   $scope.form.new.BeneName = "";
                   UtilityServiceGaps.showErrorAlert(res.Message);
                 }
               });
           }
           if (($scope.request.tType ==3 || $scope.request.tType == 4) && $scope.form.new) {

             request = {BenBankCode: $scope.form.new.DestBankCode,BenAccountNumber:$scope.form.new.DestAccNumber};

             //$scope.form.new.loading = true;
             GapsliteBanking.wait(true);
             CallService_Gaps.doGapsPost(GAPS.OTHER_BANK_ACCOUNT_NAME, request)
               .then(function (response) {
                 GapsliteBanking.wait(false);
                var res = angular.fromJson(response.data);
                 if (res.StatusCode == 0) {
                  var trnsResp = angular.fromJson(res.Message);
                  // UtilityServiceGaps.showSuccessAlert(JSON.stringify(trnsResp));
                  $scope.form.new.BeneName = trnsResp.ACCOUNTNAME;
                 }
                 else
                 {
                   UtilityServiceGaps.showErrorAlert(res.Message);
                 }
               });
           }
         }


       };
   })

  gl.controller('LifestyleCtrl', function ($rootScope,CallService_Gaps,Account,GAPS,$scope,$cordovaInAppBrowser, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicModal, GapsliteBanking, $state, UtilityServiceGaps) {

    $scope.startSmehub = function(path){
      UtilityServiceGaps.openInAppBrowser('https://www.smemarkethub.com/');
    };

  });

  gl.controller('AirtimeGapsCtrl', function ($scope,$state,Account,GAPS,GapsliteBanking,CallService_Gaps,UtilityServiceGaps) {

     document.addEventListener("deviceready", function(){

        navigator.contactsPhoneNumbers.list(function(contacts) {
          $scope.contacts = contacts;
       });

    }, false);

     $scope.loadContacts = function(){
      //$scope.form.searchInput = '';
      UtilityServiceGaps.showModal('views/bills/contacts_dialog.html', $scope);
     };

     $scope.loadAccountToDebit = function(){

        var dto = {
            AuthCode: Account.getGapsCode()
        }
        //check if you have previously called
        var atd= Account.getAccountToDebit();
        if(atd.length == 0)
        {
          //Code For Acct to Debit
          GapsliteBanking.wait(true);
            CallService_Gaps.doGapsPost(GAPS.ACCOUNT_TO_DEBIT,dto).then(function(result){
              GapsliteBanking.wait(false);
                var data = angular.fromJson(result.data);
                if('StatusCode' in data)
                {
                  data.ErrorCode = data.StatusCode;
                  data.ErrorDescription = data.Message;
                }

                if(data.ErrorCode == 0)
                {
                    //results was obtained successfully
                    var response = angular.fromJson(data.ErrorDescription);
                    $scope.accountsToDebit = response;
                    Account.setAccountToDebit(response);
                }

            },function(error){
                GapsliteBanking.wait(false);
            });
          }
          else
          {
              $scope.accountsToDebit = atd;
          }

        };

        var count = 0;
        $scope.loadAvailableNetwork= function(flag) {
        count += flag;
        if ($scope.form.data.AccountToDebit && count != 1) {
          return false;
        }

        var dto = {
              AuthCode: Account.getGapsCode()
          }

          var ava = Account.getAvailableAirtime();
          if(ava.length == 0){
              GapsliteBanking.wait(true);
              CallService_Gaps.doGapsPost(GAPS.AVAILABLE_AIRTIME,dto)
              .then(function(result){
                  GapsliteBanking.wait(false);
                  var data = angular.fromJson(result.data);
                  if('StatusCode' in data)
                  {
                      data.ErrorCode = data.StatusCode;
                      data.ErrorDescription = data.Message;
                  }
                  if(data.ErrorCode == 0)
                  {
                      //results was obtained successfully
                      var response = angular.fromJson(data.ErrorDescription);
                      $scope.categories = response;
                      Account.setAvailableAirtime(response);
                  }
                  else
                  {
                      //log Error decription
                  }

              },function(error){
                  GapsliteBanking.wait(false);
                    })
            }else{
                $scope.categories = Account.getAvailableAirtime();
            }
        };

        $scope.accounts = GapsliteBanking.getAccountsInfo();

        $scope.form = {
          data:{
            AuthCode: Account.getGapsCode(),
            NetworkCode: undefined,
            MobileNumber: undefined,
            TransactionAmount: undefined,
            Token: undefined,
            AccountToDebit: undefined
          },
          Token:""
        }

        $scope.cancelAuthorization = function(contactName){
          if(contactName) $scope.form.BeneName = contactName;
          $scope.modal.hide();
        }

        $scope.enableAuthorization = function(){
          $scope.form.reviewAmount = $scope.form.data.TransactionAmount;
          $scope.form.reviewName = $scope.form.data.MobileNumber;
          $scope.form.Token = "";
          UtilityServiceGaps.showModal('views/transfers/auth_dialog.html', $scope);
        }

          $scope.continue = function() {

            var name = document.getElementById("utilityName");
            var selectedUtilityName = name.options[name.selectedIndex].text;

            if (!$scope.form.data.AccountToDebit|| !$scope.form.data.NetworkCode || !$scope.form.data.TransactionAmount || !$scope.form.data.MobileNumber) {
              UtilityServiceGaps.showErrorAlert("Please fill all inputs correctly.");
              return false;
            }
            $scope.enableAuthorization();
        }

          $scope.confirmTransfer = function() {
            $scope.cancelAuthorization();
            var token = $scope.form.Token;
            $scope.form.data.TokenCode = $scope.form.Token;
            // if ($scope.form.data.TokenCode.length != 6 || $scope.form.data.TokenCode == '') {
            //   UtilityServiceGaps.showErrorAlert('Please enter six digits Token Code.');
            // } else {
            var fromA = UtilityServiceGaps.getObjectInArray($scope.accountsToDebit,"Nuban",$scope.form.data.AccountToDebit);
              GapsliteBanking.wait(true);

              var atr = {
                "AuthCode":Account.getGapsCode(),
                "NetworkCode":$scope.form.data.NetworkCode,
                "MobileNumber": $scope.form.data.MobileNumber,
                "TransactionAmount":$scope.form.data.TransactionAmount,
                "Token": $scope.form.data.TokenCode,
                "AccountToDebit":fromA.AccountNo
              }
              CallService_Gaps.doGapsPost(GAPS.AIRTIME_REQUEST,atr)
                .then(function (response) {
                 var res = angular.fromJson(response.data);
                  if (res.ErrorCode == 0) {
                   GapsliteBanking.wait(false);

                   $state.go("successfulGaps");
                 } else {
                   GapsliteBanking.wait(false);
                   UtilityServiceGaps.showErrorAlert(res.ErrorDescription);
                 }
               }, function (reason) {
                 GapsliteBanking.wait(false);
                 UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
                 $scope.form.data.TokenCode = "";
               });
            //}

          }
  });

  gl.controller('SettingsAndHelpCtrl', function (UtilityServiceGaps,GapsliteBanking, GAPS,$scope, $state, CallService_Gaps) {

       $scope.AppVersion = '1.0.0.0';
       $scope.MbQuestionsAndAnswer = GapsliteBanking.getMobileBankingQuestionAndAnswer();
       $scope.FeedbackErrorType = GapsliteBanking.getFeedbackErrorType();
       $scope.showAnswer = function (index) {
         $scope.currentIndex = index + 1;
       };

       $scope.sendFeedback = function(){
         if(!$scope.fBack.CustomerName || !$scope.fBack.UserId || !$scope.fBack.Email ||
           !$scope.fBack.Message || !$scope.fBack.PhoneNumber || !$scope.fBack.Subject){
             UtilityServiceGaps.showErrorAlert("Please fill all input fields correctly.");
         }
         else if(!UtilityServiceGaps.validateEmail($scope.fBack.Email)){
           UtilityServiceGaps.showErrorAlert("Invalid email address!");
         }
         else{
               GapsliteBanking.wait(true);
               CallService_Gaps.doGapsPost(GAPS.FEEDBACK,$scope.fBack)
                   .then(function(response){
                     GapsliteBanking.wait(false);
                       var res = angular.fromJson(response.data);
                       if (res.StatusCode != 0) {
                           UtilityServiceGaps.showErrorAlert(res.Message);
                       } else {
                           UtilityServiceGaps.showErrorAlert(res.Message);
                           $state.go("settings-and-help");
                       }
                   },function(reason){
                       GapsliteBanking.wait(false);
                   });
         }
       }

       $scope.feedbackInit = function(){
        $scope.fBack = {};
        $scope.errorType = {};
        $scope.fBack.CustomerName = GapsliteBanking.getResponse().OtherDescription || '';
        $scope.fBack.UserId = GapsliteBanking.getUserId();
        $scope.FeedbackErrorType = GapsliteBanking.getFeedbackErrorType();
       }

  })

  gl.controller('NdaniTvGapsCtrl', function ($scope, GapsliteBanking, $state, $cordovaInAppBrowser, $ImageCacheFactory, NdaniTv, UtilityServiceGaps) {

    $scope.data = {};
    $scope.newVideos = {};
    $scope.videoUrl = [];

    if (ionic.Platform.isIOS()) {
      $scope.topMargin = '5px';
    } else{
      $scope.topMargin = '0px';
    }

    $scope.numberOfItemsToDisplay = 5;
    $scope.addMoreItem = function (done) {
        if ($scope.newVideos.length > $scope.numberOfItemsToDisplay)
            $scope.numberOfItemsToDisplay += 5;
        $scope.$broadcast('scroll.infiniteScrollComplete')
    };

    $scope.img = [];
    $scope.loadImage = function(url,index) {
      $scope.img[index] = 'assets/img/video_default.jpg';
      $ImageCacheFactory.Cache([url]).then(function () {
            $scope.img[index] = url;
          });
    };

    $scope.loadVideosFromYouTube = function(){
      setTimeout(function () {
        //Gtbank.wait(true);
        NdaniTv.getRecentNdaniVideos()
          .then(function (response) {
          //  Gtbank.wait(false);
            var res = angular.fromJson(angular.fromJson(response.data));
            $scope.newVideos = res.items;
          });
      }, 500);
    };

    $scope.playVideo = function(videoData){
      NdaniTv.setVideo(videoData);
      $state.go('ndani-play-videoGaps');
    };

    $scope.startSmehub = function(){
      UtilityServiceGaps.openInAppBrowser('https://www.smemarkethub.com/');
    };

    // $scope.startSocials = function(){
    //   UtilityServiceGaps.openInAppBrowser('https://www.instagram.com/gtbank/');
    // };

    $scope.loadVideoPlayer = function(){
      $scope.video = NdaniTv.getVideo();
      $scope.$on("$ionicView.afterEnter", function(event, data){
         $scope.videoUrl = "https://www.youtube.com/embed/"+$scope.video.id.videoId+"?modestbranding=0&showinfo=0";
      });
    };

  });

  gl.controller('NotificationsCtrl', function ($localStorage,$cordovaDialogs,$rootScope,CallService_Gaps,Account,GAPS,GapsliteBanking,$scope) {

    $scope.pushData = {
      obj: $localStorage.pushData
    };

    $scope.deleteInfo = function(id){
      var whatIndex = null;
      angular.forEach($scope.pushData.obj, function(element, index) {
        if (element.id === id) {
           whatIndex = index;
        }
      });
      $scope.pushData.obj.splice(whatIndex, 1);
      $localStorage.pushData.splice(whatIndex, 1);
    }
  });

  gl.controller('ForgotPasswordGapsCtrl', function ($scope, $state, GAPS, GapsliteBanking,Account,$rootScope, CallService_Gaps, UtilityServiceGaps, $cordovaDialogs)
    {
        $scope.data = {
          AccessCode: undefined,
          Username: undefined,
          TokenCode: undefined
        }
          $scope.forgotPassword = function () {
               document.activeElement.blur();
               if (!$scope.data.AccessCode || !$scope.data.Username || !$scope.data.TokenCode) {
                 UtilityServiceGaps.showErrorAlert("Please fill all required input fields.");
               }
                else {
                 GapsliteBanking.wait(true);
                 CallService_Gaps.doGapsPost(GAPS.FORGOT_PASSWORD,$scope.data)
                   .then(function (response) {
                     GapsliteBanking.wait(false);
                     GapsliteBanking.setResponse(angular.fromJson(response.data));
                     var res = angular.fromJson(response.data);
                     if (res.ErrorCode != 0) {
                       UtilityServiceGaps.showErrorAlert(res.ErrorDescription);
                     }
                     else {
                         UtilityServiceGaps.showSuccessAlert(res.ErrorDescription);
                         $state.go("gl-login");
                       }
                   }, function (reason) {
                     GapsliteBanking.wait(false);
                     UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
                   });
               }
             };
      });

  gl.controller('ChangePasswordCtrl', function ($scope, $state, GAPS, GapsliteBanking,Account,$rootScope, CallService_Gaps, UtilityServiceGaps, $cordovaDialogs)
        {
            $scope.data = {
              OldPassword: undefined,
              NewPassword: undefined,
              ConfirmPassword: undefined
            }
            var dat = GapsliteBanking.getData();
            if (GapsliteBanking.getData().hasOldPassword) {
              $scope.data.OldPassword = GapsliteBanking.getData().OldPassword;
            }

            $scope.data.Username = GapsliteBanking.getUsername();
            $scope.data.AccessCode = GapsliteBanking.getUserId();

              $scope.changePassword = function () {

                   document.activeElement.blur();
                   if (!$scope.data.Username || !$scope.data.AccessCode || !$scope.data.OldPassword || !$scope.data.NewPassword || !$scope.data.ConfirmPassword)
                   {
                     UtilityServiceGaps.showErrorAlert("Please fill all required input fields.");
                   }
                    else {
                     GapsliteBanking.wait(true);
                     CallService_Gaps.doGapsPost(GAPS.CHANGE_PASSWORD,$scope.data)
                       .then(function (response) {
                         GapsliteBanking.wait(false);
                         GapsliteBanking.setResponse(angular.fromJson(response.data));
                         var res = angular.fromJson(response.data);
                         if (res.ErrorCode != 0) {
                           UtilityServiceGaps.showErrorAlert(res.ErrorDescription);
                         }
                         else {
                             UtilityServiceGaps.showSuccessAlert(res.ErrorDescription);
                             $state.go("gl-login");
                           }
                       }, function (reason) {
                         GapsliteBanking.wait(false);
                         UtilityServiceGaps.showErrorAlert('Error communicating with host, please try again later.');
                       });
                   }
                 };
          });
