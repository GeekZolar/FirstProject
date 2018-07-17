var gtw = angular.module('starter');
gtw.controller('cardsCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService) {
  $scope.accounts = Gtbank.getAccountInfo();
  $scope.utilityService = UtilityService;
  $scope.data = {
     UserId: Gtbank.getUserId()
   }
   $scope.form = {useToken: Gtbank.getUseToken(),Token: "",otherAuth: true};

   $scope.cancelAuthorization = function(){
     $scope.modal.hide();
   };

   $scope.enableAuthorization = function(value){
     $scope.form.isCardReplacement = value;
     $scope.form.Token = "";
     UtilityService.showModal('auth_dialog.html', $scope);
   };

   $scope.goToCardReplacement = function(){
     Gtbank.wait(true);
     CallService.doPost($scope.data, ACTION_URLS.CARD_DETAILS)
       .then(function (response) {
         var msg = angular.fromJson(response.data);
         if (msg.StatusCode == 0) {
           var data = angular.fromJson(msg.Message);
           Gtbank.setData(data.CARDS.CARD[0]);

           CallService.doPost(null, ACTION_URLS.GET_BRANCHES)
             .then(function (response) {
               Gtbank.wait(false);
               var msg = angular.fromJson(response.data);
               if (msg.StatusCode == 0) {
                 var data = angular.fromJson(msg.Message);
                 Gtbank.setBranches(data.BRANCHDETAILS);
                  $state.go('card-replacement');
               }
             });
         }else {
           Gtbank.wait(false);
           UtilityService.showErrorAlert(msg.Message);
         }
       });
   };

   $scope.getBranches = function(){
     $scope.branches = Gtbank.getBranches();
   };

   $scope.goToCardHotlist = function(){
     Gtbank.wait(true);
     CallService.doPost($scope.data, ACTION_URLS.CARD_DETAILS)
       .then(function (response) {
         Gtbank.wait(false);
         var msg = angular.fromJson(response.data);
         if (msg.StatusCode == 0) {
           var data = angular.fromJson(msg.Message);
           Gtbank.setData(data.CARDS.CARD[0]);
           $state.go("card-hotlist");
         }else {
           Gtbank.wait(false);
           UtilityService.showErrorAlert(msg.Message);
         }
       });
   };

   $scope.doCardReplacement = function(){

     if (!$scope.data.AccountToDebit || !$scope.data.ReasonId || !$scope.form.AccountTolink) {
       UtilityService.showErrorAlert("Please fill all inputs correctly.");
       return false;
     }

     $scope.data.CardTypeDesc = Gtbank.getData().CARDTYPE;
     $scope.data.SeqNo = Gtbank.getData().SEQNO;
     $scope.data.ExpiryDate = Gtbank.getData().EXPIRYDATE;
     $scope.data.Udid = Gtbank.getUuid();

     var otherParams = {
       SecretAnswer: $scope.form.SecretAnswer || '',
       AccountTolink: $scope.form.AccountTolink,
       TokenCode: $scope.form.TokenCode,
       EncrypPan: Gtbank.getData().ENCRYPTVALUE
     };

     $scope.data.OtherParams = UtilityService.encryptData(otherParams);

     Gtbank.wait(true);
     CallService.doPostWithoutEnc($scope.data, ACTION_URLS.CARD_REPLACEMENT)
       .then(function (response) {
         Gtbank.wait(false);
         var msg = angular.fromJson(response.data);
         if (msg.StatusCode == 0) {
           var data = angular.fromJson(msg.Message);
           UtilityService.showErrorAlert(data.MESSAGE);
           $state.go("cards");
         }else {
           UtilityService.showErrorAlert(msg.Message);
         }
       },function(err){
         Gtbank.wait(false);
       });
   };

   $scope.doCardHotlist = function() {

     if (!$scope.data.Reason) {
       UtilityService.showErrorAlert("Please choose a reason.");
       return false;
     }

     $scope.data.SeqNo = Gtbank.getData().SEQNO;
     $scope.data.Expiry = Gtbank.getData().EXPIRYDATE;
     $scope.data.CardDetail = Gtbank.getData().ENCRYPTVALUE;
     $scope.data.TokenCode = $scope.form.TokenCode;
     $scope.data.SecretAnswer = $scope.data.SecretAnswer || '';
     $scope.data.Udid= Gtbank.getUuid();
     Gtbank.wait(true);
     CallService.doPost($scope.data, ACTION_URLS.CARD_HOTLIST)
       .then(function (response) {
         Gtbank.wait(false);
         var msg = angular.fromJson(response.data);
         if (msg.StatusCode == 0) {
           var data = angular.fromJson(msg.Message);
           UtilityService.showErrorAlert(data.MESSAGE);
           $state.go("cards");
         }else {
           UtilityService.showErrorAlert(msg.Message);
         }
       });
   };

   $scope.confirmTransfer = function() {
     if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
       return false;
     }

     $scope.cancelAuthorization();

     if ($scope.form.isCardReplacement) $scope.doCardReplacement();
       else
       $scope.doCardHotlist();
   };

});
