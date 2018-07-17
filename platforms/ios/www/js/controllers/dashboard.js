var gtw = angular.module('starter');

gtw.controller('dashboardCtrl', function ($ionicModal,$ImageCacheFactory,$ionicScrollDelegate,Idle,$scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$cordovaInAppBrowser,$stateParams,$ionicPlatform,$cordovaDialogs,$ionicHistory,$timeout) {

    Idle.watch();
    $scope.logOut= function(){
    Gtbank.setResponse({});
    Gtbank.setData({});
    Gtbank.setUseToken({});
    Gtbank.setAccountInfo({});
    Gtbank.setTransferData({});
    Gtbank.setUserId({});
    Gtbank.setActiveBeneficiary([]);
    Gtbank.setHistoryDetail([]);
    Gtbank.setEmail('');
    Gtbank.setMobileNumber('');
    Gtbank.setNewAccountNumber('')
    Gtbank.setUuid('');
    Gtbank.setResCode('');
    Gtbank.setInfo({});
    Gtbank.setForms({});
    Gtbank.setCategory({});
    Gtbank.setFinalForm({});
    Gtbank.setSourceAccount({});
    Gtbank.setBeneficiary([]);
    Gtbank.setContacts({});
    Gtbank.setRequestTypes({});
    $scope.initMenuTrigger();
    $state.go('login');
  }
    $scope.accounts = Gtbank.getAccountInfo();

    $scope.data = {
      index:0,
      user:Gtbank.getUserId(),
      useToken: Gtbank.getUseToken(),
      bvn:Gtbank.getBvn() || '',
      DisableTextBox: false,
      isDashboard: true,
      TransType: 2,
      count: 3
    };

      $scope.images = Gtbank.getImages();
      var showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: 'jelly'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }
      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
      }

      $scope.showImage = function(img){
          var url = img;
          $ImageCacheFactory.Cache([url])
            .then(function(){
              $scope.picData = url;
            });
          showModal('view-avatar.html');
      }

    $scope.initMenuTrigger = function() {
      $ionicScrollDelegate.scrollTop();
      $("footer").fadeToggle(400),
      $("nav").fadeToggle(400),
      $("ion-content.dashboard").toggleClass("menu-open"),
      $(".navbar__action--menu").toggleClass("navbar__action--is-hidden"),
      $(".navbar__action--close").toggleClass("navbar__action--is-hidden");
    };

    $scope.hideAdvert = function(count){
      $("#offer_"+count).fadeToggle(400);
      $scope.data.count--;
    };

    if (ionic.Platform.isAndroid()) {
          $ionicPlatform.registerBackButtonAction(function() {
            $cordovaDialogs.confirm('Are you sure you want to exit the application?', 'Quit', ['Yes','No'])
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

    $scope.slideHasChanged = function(index){
       $scope.data.index = index;
    };

    $scope.startSmehub = function(path){
       UtilityService.openInAppBrowser('https://www.smemarkethub.com/');
    };

    $scope.startSocials = function(path){
       UtilityService.openInAppBrowser('https://www.instagram.com/gtbank/');
    };

    $scope.MbQuestionsAndAnswer = Gtbank.getMobileBankingQuestionAndAnswer();
       $scope.showAnswer = function (index) {
       $scope.currentIndex = index + 1;
    };

    $scope.request = {};
    $scope.confirmToken = function () {
       document.activeElement.blur();
       $scope.request.UserId = Gtbank.getUserId();
       if (!$scope.request.TokenId) {
         UtilityService.showErrorAlert("Please enter your Token Id.");
       }
        else {
         Gtbank.wait(true);
         CallService.doPost($scope.request, ACTION_URLS.CONFIRM_TOKEN)
           .then(function (response) {
             Gtbank.wait(false);
            var res = angular.fromJson(angular.fromJson(response.data));
             if (res.StatusCode == 0) {
               UtilityService.showErrorAlert(res.Message);
               $state.go("dashboard");
             }
              else {
                UtilityService.showErrorAlert(res.Message);
             }
           }, function (reason) {
             Gtbank.wait(false);
             UtilityService.showErrorAlert('Error communicating with host, please try again later.');
           });
       }
     };

      // $scope.switchTransactionAuth = function(id){
      //
      //    //means you are using pin and would like to switch to token
      //    if ($scope.data.useToken == 0 && id != 0) {
      //      $scope.initMenuTrigger();
      //      $state.go("switch-device",{useToken:1});
      //    }
      //
      //    //inverse of above statetent
      //    if ($scope.data.useToken == 1 && id != 1) {
      //      $scope.initMenuTrigger();
      //      $state.go("indemnity",{useToken:0});
      //    }
      //  };
      $scope.data.fromDashboard = false;

      $scope.switchTransactionAuth = function(id){
         //means you are using pin and would like to switch to token
         if ($scope.data.useToken == 0 && id == 1) {
           $scope.data.fromDashboard = true;
           $scope.initMenuTrigger();
           $state.go("switch-token",{useToken:1, fromDashboard:$scope.data.fromDashboard});
         }

         //inverse of above statetent
         if ($scope.data.useToken == 1 && id == 0) {
           $scope.data.fromDashboard = true;
           $scope.initMenuTrigger();
           $state.go("indemnity",{useToken:0, fromDashboard:$scope.data.fromDashboard});
         }
       };

     $scope.AppVersion = '1.0.0.0';

     $scope.getSubjectId = function(){
       $scope.fBack.Subject = $("#sub option[value="+$scope.fBack.SubjectId+"]").text();
     };

     $scope.sendFeedback = function(){
       if(!$scope.fBack.CustomerName || !$scope.fBack.Email ||
         !$scope.fBack.Message || !$scope.fBack.PhoneNumber || !$scope.fBack.Subject){
           UtilityService.showErrorAlert("Please fill all input fields correctly.");
       }
       else if(!UtilityService.validateEmail($scope.fBack.Email)){
         UtilityService.showErrorAlert("Invalid email address!");
       }
       else{
             Gtbank.wait(true);
             console.log($scope.fBack);
             CallService.doPost($scope.fBack, ACTION_URLS.FEEDBACK)
                 .then(function(response){
                   console.log('good');
                   UtilityService.showErrorAlert('Complaint has been submitted. Thank you');
                   Gtbank.wait(false);
                     var res = angular.fromJson(response.data);
                     if (res.StatusCode != 0) {
                         UtilityService.showErrorAlert(res.Message);
                     } else {
                         UtilityService.showErrorAlert(res.Message);
                         $state.go("dashboard");
                     }
                 },function(reason){
                   console.log('bad');
                     Gtbank.wait(false);
                     UtilityService.showErrorAlert('Complaint has been submitted. Thank you');
                     $state.go("dashboard");
                 });
       }
     };

     $scope.feedbackInit = function(){
      $scope.fBack = {};
      $scope.errorType = {};
      $scope.fBack.CustomerName = Gtbank.getAccountInfo()[0].CUSNAME || '';
      $scope.fBack.AccountNumber = Gtbank.getUserId();
      $scope.FeedbackErrorType = Gtbank.getFeedbackErrorType();
     };

     $scope.showBeneficiaries = function () {
         document.activeElement.blur();
         $scope.getAKindOfBeneficiary();
         $scope.data.DisableTextBox = true;
         UtilityService.showModal('beneficiary_dialog.html', $scope);
     };

     $scope.cancelBeneficiaryModal = function(accountName,bankCode,preRegNuban){
           if (accountName) {
             var accNum = '';

             if ($scope.data.TransType == 5) {
                accNum = preRegNuban;
             }else {
                accNum = $scope.data.DestAccount;
             }

             $scope.data.Beneficiary = accountName +" - " + accNum;
             var bene = [];
             bene.push({accountNumber: accNum, accountName: accountName, transType: $scope.data.TransType, destBankCode: bankCode});
             Gtbank.setActiveBeneficiary(bene);
           }

           $scope.modal.hide();
           $scope.data.DisableTextBox = false;
     };

     $scope.getAKindOfBeneficiary = function(){

             $scope.ben = {
               data:{
                 UserId: Gtbank.getUserId(),
                 TransType: $scope.data.TransType
               }
             }
             $scope.beneficiary = [];
             $scope.data.isGetBeneficiaryDone = false;
             CallService.doPost($scope.ben.data, ACTION_URLS.BENEFICIARY)
               .then(function (response) {
                 console.log(response);
                var res = angular.fromJson(response.data);
                if (res.StatusCode == 0) {
                  $scope.data.isGetBeneficiaryDone = true;
                  var msg = angular.fromJson(res.Message);
                  if ($scope.data.TransType == 5) {
                    $scope.beneficiary = msg.PREBENEFICIARIES.PREBENEFICIARY
                  }else {
                    $scope.beneficiary = msg.BENEFICIARIES.BENEFICIARY;
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
                     $state.go('confirm-delete',{transType: $scope.data.TransType});
                   }, 500);
                 }
               });
         };

    $scope.initAccountToDelete = function(){
      $scope.data.beneficiaryName = Gtbank.getBeneficiary().BENEFICIARYNAME;
      $scope.data.accountNumber = Gtbank.getBeneficiary().BENEFICIARYACCT;
    };

    $scope.confirmDelete = function() {

      document.activeElement.blur();
      $scope.request = {
        UserId: Gtbank.getUserId(),
        BeneficiaryAccount: Gtbank.getBeneficiary().BENEFICIARYACCT,
        TransType: $stateParams.transType,
        Udid: Gtbank.getUuid(),
        SecretAnswer: $scope.data.secretAnswer || '',
        TokenCode: $scope.data.tokenCode
      };

      Gtbank.wait(true);
      CallService.doPost($scope.request, ACTION_URLS.DELETE_BENEFICIARY)
        .then(function (response) {
         var res = angular.fromJson(response.data);
         Gtbank.wait(false);
         if (res.StatusCode == 0){
            var msg = angular.fromJson(res.Message);
           if (msg.CODE == "1000") {
             UtilityService.showSuccessAlert(msg.MESSAGE);
             $ionicHistory.goBack();
           }
         }else {
           UtilityService.showErrorAlert(res.Message);
         }
        }, function (reason) {
          Gtbank.wait(false);
          UtilityService.showErrorAlert('Error communicating with host, please try again later.');
        });
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.data.Beneficiary = "";
    });

});
