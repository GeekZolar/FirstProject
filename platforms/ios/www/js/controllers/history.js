var gtw = angular.module('starter');
gtw.controller('historyCtrl', function ($ionicSlideBoxDelegate,$stateParams,$scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$filter) {
  $scope.accounts = Gtbank.getAccountInfo();
  $scope.count = {index:0};
  $scope.slideHasChangedTo = function(index){
    $scope.count.index = index;
    $scope.req.SourceAccount = $scope.accounts[index].NUMBER;
    getAutoHistory($scope.req.SourceAccount);
  };

  $scope.Date = Date;

  $scope.data = {
     UserId: Gtbank.getUserId(),
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

        console.log($scope.data);
       $scope.count.isGetHistoryDone = false;
       CallService.doPost($scope.data, ACTION_URLS.TRANS_HISTORY)
         .then(function (response) {
           console.log(response);
           $scope.count.isGetHistoryDone = true;
           Gtbank.setResponse(angular.fromJson(response.data));
           var msg = angular.fromJson(response.data);
           if (msg.StatusCode == 0) {
             var data = angular.fromJson(msg.Message);
             if (data.CODE != '1000') {
                 UtilityService.showErrorAlert(msg.MESSAGE);
             } else {
               $scope.accRangeHistory = {};
               $scope.accRangeHistory = data.TRANSACTIONS.TRANSACTION;
             }
           }
         }, function (reason) {
         });
    // }
   };

   $scope.searchRange = function() {
     document.activeElement.blur();
     getAutoHistory($scope.req.SourceAccount || $scope.accounts[0].NUMBER, true);
   };

   $scope.showDetails = function(data) {
     Gtbank.setHistoryDetail(data);
     $state.go("historyDetail", {acctId: $scope.count.index})
   }

   getAutoHistory($scope.accounts[$stateParams.historyIndex].NUMBER);
   $scope.count.index = $stateParams.historyIndex;
   setTimeout(function () {
     $ionicSlideBoxDelegate.$getByHandle("historyScroll").slide($stateParams.historyIndex);
   }, 200);

});
