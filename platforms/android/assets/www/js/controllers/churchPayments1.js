var gtw = angular.module('starter');
gtw.controller('churchPayments1Ctrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {

  $scope.utilityService = UtilityService;
  $scope.accounts= Gtbank.getAccountInfo();
  $scope.request = {
    CategoryId:"9"
  }
  $scope.ben = {
    CustomerId:""
  }
  $scope.pro = {
    FormId:""
  }
  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      UtilityName: "",
      Udid:Gtbank.getUuid(),
      SourceAccount:"",
      ProductId:"",
    },
    Token:{
      Token1:undefined,
      Token2:undefined,
      Token3:undefined,
      Token4:undefined
    }
  }

  Gtbank.wait(true);
  CallService.doPost($scope.request, ACTION_URLS.CATEGORY)
    .then(function (response) {
      var res = angular.fromJson(angular.fromJson(response.data));
      if (res.StatusCode == 0) {
        Gtbank.wait(false);
        var msg = angular.fromJson(res.Message);
         $scope.Category = angular.fromJson(msg.CUSTOMERS).CUSTOMER;
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

   $scope.getSubBeneficiary = function(){
     Gtbank.wait(true);
     CallService.doPost($scope.ben, ACTION_URLS.SUBCATEGORY)
       .then(function (response) {
         var res = angular.fromJson(angular.fromJson(response.data));
         if (res.StatusCode == 0) {
           Gtbank.wait(false);
           var msg = angular.fromJson(res.Message);
           $scope.subCategory = angular.fromJson(msg.FORMS).FORM;
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

   $scope.getFormId = function(){
     Gtbank.wait(true);
     CallService.doPost($scope.pro, ACTION_URLS.FORM_FIELDS)
       .then(function (response) {
         var res = angular.fromJson(angular.fromJson(response.data));
         if (res.StatusCode == 0) {
           Gtbank.wait(false);
           var msg = angular.fromJson(res.Message);
          $scope.formField = angular.fromJson(msg.FIELDS).FIELD;
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

   $scope.validate = function() {
     if (!$scope.form.data.SourceAccount||!$scope.ben.CustomerId ||!$scope.pro.FormId) {
       UtilityService.showErrorAlert("Please select input fields correctly");
     }
     else {
       Gtbank.setInfo($scope.form.data);
       Gtbank.setForms($scope.formField);
       Gtbank.setCategory($scope.subCategory);
       Gtbank.setSourceAccount($scope.form.data.SourceAccount);
       $state.go("church2");
     }
     }


});
