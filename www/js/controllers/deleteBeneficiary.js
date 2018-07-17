var gtw = angular.module('starter');

gtw.controller('dashboardCtrl', function (Idle,$scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$cordovaInAppBrowser,$stateParams,$ionicPlatform,$cordovaDialogs) {

  Idle.watch();
  $scope.accounts = Gtbank.getAccountInfo();
  $scope.data = {
    index:0,
    user:Gtbank.getUserId(),
    useToken: Gtbank.getUseToken(),
    bvn:Gtbank.getBvn() || '',
    DisableTextBox: false,
    isDashboard: true,
    TransType: 2
  };

  $scope.initMenuTrigger = function() {
    $("footer").fadeToggle(400),
    $("nav").fadeToggle(400),
    $("ion-content.dashboard").toggleClass("menu-open"),
    $(".navbar__action--menu").toggleClass("navbar__action--is-hidden"),
    $(".navbar__action--close").toggleClass("navbar__action--is-hidden");
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

  $scope.switchTransactionAuth = function(id){

     //means you are using pin and would like to switch to token
     if ($scope.data.useToken == 0 && id != 0) {
       $scope.initMenuTrigger();
       $state.go("switch-device",{useToken:1});
     }

     //inverse of above statetent
     if ($scope.data.useToken == 1 && id != 1) {
       $scope.initMenuTrigger();
       $state.go("indemnity",{useToken:0});
     }
   };

   $scope.AppVersion = '1.0.0.0';

   $scope.getSubjectId = function(){
     $scope.fBack.Subject = $("#sub option[value="+$scope.fBack.SubjectId+"]").text();
   };

   $scope.sendFeedback = function(){
     if(!$scope.fBack.CustomerName || !$scope.fBack.AccountNumber || !$scope.fBack.Email ||
       !$scope.fBack.Message || !$scope.fBack.PhoneNumber || !$scope.fBack.Subject){
         UtilityService.showErrorAlert("Please fill all input fields correctly.");
     }
     else if(!UtilityService.validateEmail($scope.fBack.Email)){
       UtilityService.showErrorAlert("Invalid email address!");
     }
     else{
           Gtbank.wait(true);
           CallService.doPost($scope.data, ACTION_URLS.FEEDBACK)
               .then(function(response){
                 Gtbank.wait(false);
                   var res = angular.fromJson(response.data);
                   if (res.StatusCode != 0) {
                       UtilityService.showErrorAlert(res.Message);
                   } else {
                       UtilityService.showErrorAlert(res.Message);
                       $state.go("dashboard");
                   }
               },function(reason){
                   Gtbank.wait(false);
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

   $scope.cancelAuthorization = function(accountName,preRegNuban){

         if (accountName) {
           var accNum = '';
           if ($scope.data.TransType == 5) {
              accNum = preRegNuban;
           }else {
              accNum = $scope.data.DestAccount;
           }

           $scope.data.Beneficiary = accountName +" - " + accNum;
           var bene = [];
           bene.push({accountNumber: accNum, accountName: accountName, transType: $scope.data.TransType});
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
           $scope.data.isGetBeneficiaryDone = false;
           CallService.doPost($scope.ben.data, ACTION_URLS.BENEFICIARY)
             .then(function (response) {
              var res = angular.fromJson(angular.fromJson(response.data));
              if (res.StatusCode == 0) {
                $scope.data.isGetBeneficiaryDone = true;
                var msg = angular.fromJson(res.Message);
                if ($scope.data.TransType == 5) {
                  $scope.beneficiary = msg.PREBENEFICIARIES.PREBENEFICIARY;
                }else {
                  $scope.beneficiary = msg.BENEFICIARIES.BENEFICIARY;
                }
              }
              else {
                $scope.data.isGetBeneficiaryDone = true;
                $scope.beneficiary = {};
                UtilityService.showErrorAlert(res.Message);
              }
             }, function (reason) {
               $scope.data.isGetBeneficiaryDone = true;
               $scope.beneficiary = {};
               UtilityService.showErrorAlert('Error communicating with host, please try again later.');
             });
       };

   $scope.deleteBeneficiary = function (aBeneficiary) {

         UtilityService.showConfirmAlert("Are you sure you want to delete beneficiary with account "
             + aBeneficiary.BENEFICIARYNAME + " from your list?", "Delete Beneficiary", "Yes", "No")
             .then(function (index){
               if(index == 1)
               {
                 Gtbank.setBeneficiary(aBeneficiary);
                 $state.go('confirm-delete');
               }
             });
       }

});
