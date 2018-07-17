var gtw = angular.module('starter');
gtw.controller('IrequireCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter) {

  $scope.accounts = Gtbank.getAccountInfo();
  $scope.requestTypes = Gtbank.getRequestTypes();
  $scope.preferredBranches = Gtbank.getBranches();
  $scope.utilityService = UtilityService;

  $scope.data = {
     UserId: Gtbank.getUserId(),
     Udid: Gtbank.getUuid(),
     Remarks: '',
     ChargeAcc: '',
     ReqType: '',
     RequestId: '',
     PreferredBranch: '',
     InitiatedBy: '',
     MeansId: '',
     IsStatementRequest: [],
     OtherParams: ''
   }

   $scope.form = {
     useToken: Gtbank.getUseToken(),
     Token: "",
     otherAuth: true,
     ToDate: new Date(),
     FromDate: new Date(),
     Others:{
       SecretAnswer: '',
       TokenCode: '',
       TransactionAmount: '',
       PickUpBy: 'Self',
       PickName: $scope.accounts[0].CUSNAME
     }
   };

   $scope.cancelAuthorization = function(){
     $scope.modal.hide();
   };

   $scope.enableAuthorization = function(){
     if ($scope.data.RequestId == '1') {
       if (!$scope.form.Others.TransactionAmount || !$scope.data.ChargeAcc || !$scope.data.PreferredBranch) {
         UtilityService.showErrorAlert('Please fill all inputs correctly.');
         return false;
       }
     }

     if ($scope.data.RequestId == '2') {
       if (!$scope.form.statement.AccountNumber || !$scope.data.ChargeAcc || !$scope.data.PreferredBranch || !$scope.form.statement.NoOfCopies) {
         UtilityService.showErrorAlert('Please fill all inputs correctly.');
         return false;
       }else {
         $scope.form.statement.DateFrom = $filter("date")($scope.form.FromDate, 'MM/dd/yyyy');
         $scope.form.statement.DateTo = $filter("date")($scope.form.ToDate, 'MM/dd/yyyy');
         $scope.form.statement.NoOfCopies = $scope.form.statement.NoOfCopies;
         $scope.data.IsStatementRequest.push($scope.form.statement);
       }
     }

     if ($scope.data.RequestId == '3' || $scope.data.RequestId == '4' || $scope.data.RequestId == '5') {
       if (!$scope.data.ChargeAcc || !$scope.data.PreferredBranch) {
         UtilityService.showErrorAlert('Please fill all inputs correctly.');
         return false;
       }
     }

     $scope.form.Token = "";
     UtilityService.showModal('auth_dialog.html', $scope);
   };

   $scope.goToIrequireReplacement = function(){

     Gtbank.wait(true);
     CallService.doPost($scope.data, ACTION_URLS.CHECK_IREQUIRE_ELIGIBILITY)
       .then(function (response) {
         var msg = angular.fromJson(response.data);
         if (msg.StatusCode == 0) {

           CallService.doPostWithoutEnc(null, ACTION_URLS.IREQUIRE_CATEGORIES)
             .then(function (response) {
               var msg = angular.fromJson(response.data);

               if (msg.StatusCode == 0) {
                 Gtbank.setRequestTypes(angular.fromJson(msg.Message));
                 CallService.doPostWithoutEnc(null, ACTION_URLS.IREQUIRE_REQUEST_BRANCHES)
                   .then(function (response) {
                     Gtbank.wait(false);
                     var msg = angular.fromJson(response.data);

                     if (msg.StatusCode == 0) {
                       Gtbank.setBranches(angular.fromJson(msg.Message));
                       $state.go('irequire');
                     }
                   },function(err){
                     Gtbank.wait(false);
                   });

               }
               else
               {

               }
             },function(err){
               Gtbank.wait(false);
             });
         }
         else
          {
           Gtbank.wait(false);
           UtilityService.showErrorAlert(msg.Message);
         }
       },function(err){
         Gtbank.wait(false);
       });
   };

   $scope.setRequestTypeId = function(){
     $scope.requestTypes.filter(function( element, index ){
       if (element.Request_ID == $scope.form.RequestTypeId) {
         $scope.data.RequestId = element.Request_ID;
         $scope.data.ReqType = element.RequestType;

       }
     })
     $scope.data.InitiatedBy = $scope.accounts[0].CUSNAME;

     var turnOffCashWithdrawal = function(){
       $scope.form.amount = false;
       $scope.form.chargeAcc = false;
       $scope.form.remarks = false;
       $scope.form.preferredBranch = false;
       $scope.form.pickUpBy = false;
     };

     var turnOffStatementRequest = function(){
       $scope.form.accountNumber = false;
       $scope.form.chargeAcc = false;
       $scope.form.statementDate = false;
       $scope.form.noOfCopies = false;
       $scope.form.preferredBranch = false;
       $scope.form.pickUpBy = false;
     };

     var turnOffTokenCollection = function(){
       $scope.form.chargeAcc = true;
       $scope.form.preferredBranch = true;
       $scope.form.pickUpBy = true;
     };

     if ($scope.data.RequestId == '1') {
       turnOffStatementRequest();
       turnOffTokenCollection();
       $scope.form.amount = true;
       $scope.form.chargeAcc = true;
       $scope.form.remarks = true;
       $scope.form.preferredBranch = true;
       $scope.form.pickUpBy = true;
     }

     if ($scope.data.RequestId == '2') {
       turnOffCashWithdrawal();
       turnOffTokenCollection();
       $scope.form.accountNumber = true;
       $scope.form.chargeAcc = true;
       $scope.form.statementDate = true;
       $scope.form.noOfCopies = true;
       $scope.form.preferredBranch = true;
       $scope.form.pickUpBy = true;
     }

     if ($scope.data.RequestId == '3' || $scope.data.RequestId == '4' || $scope.data.RequestId == '5') {
       turnOffCashWithdrawal();
       turnOffStatementRequest();
       $scope.form.chargeAcc = true;
       $scope.form.preferredBranch = true;
       $scope.form.pickUpBy = true;
     }

   };

   $scope.confirmTransfer = function() {

     if (!UtilityService.validateAuthCode($scope.form.Token,$scope)) {
       return false;
     }

     $scope.cancelAuthorization();
     $scope.data.OtherParams = UtilityService.encryptData($scope.form.Others);

     Gtbank.wait(true);
     CallService.doPostWithoutEnc($scope.data, ACTION_URLS.POST_IREQUIRE)
       .then(function (response) {
         Gtbank.wait(false);
         var msg = angular.fromJson(response.data);
         if (msg.StatusCode == 0) {
           var data = angular.fromJson(msg.Message);
           UtilityService.showErrorAlert(data.MESSAGE);
           $state.go("requests");
         }else {
           var err = msg.Error || msg.Message;
           UtilityService.showErrorAlert(err);
         }
       });

   };

});
