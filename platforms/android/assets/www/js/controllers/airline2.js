var gtw = angular.module('starter');
gtw.controller('airlineTwoCtrl', function ($scope,$state,ACTION_URLS,Gtbank,CallService,UtilityService,$ionicHistory) {

  $scope.form = {
    data:{
      UserId: Gtbank.getUserId(),
      UtilityName: "",
      Udid:Gtbank.getUuid(),
      SourceAccount:"",
      Amount:"",
      CustomerEmail:"",
      ProductId:"",
      CustomerMobile:"",
      TokenCode:"",
      FormId:undefined,
      CollAcct:undefined
    },
    Token:{
      Token1:undefined,
      Token2:undefined,
      Token3:undefined,
      Token4:undefined
    }
  }

  $scope.options = [];
  $scope.Info= Gtbank.getInfo();
  $scope.Forms = Gtbank.getForms();
  $scope.Category = Gtbank.getCategory();

  $scope.formId = $scope.Forms[0].form_id;
  $scope.customerId = $scope.Category[0].CUSTOMER_ID;

  $scope.saveOption = function(val,id){
    $scope.options.push({id:id,value:val});
  }

  $scope.continue = function() {
    var newAr = [];
            angular.forEach($scope.Forms,function(value){
                if(value.field_type == 2 && value.read_only == 0){
                    value.actual_value = $('#'+value.field_id).val();
                }else if(value.field_type == 3 && value.read_only == 0){
                    value.actual_value = $('#'+value.field_id).val();
                }else if(value.field_type == 1 && value.read_only == 0){
                    var val = $scope.options
                                .filter(function(event){return event.id === value.field_id;})
                                .map(function (event){return event.value;});
                        value.actual_value = val[val.length-1];
                }
                newAr.push(value);
            })
                $scope.formsFields = angular.fromJson(angular.toJson(newAr));

            $scope.request = {
                FormId: $scope.formId,
                CustomerId: $scope.customerId,
                UserId: Gtbank.getUserId(),
                FormParams: $scope.formsFields
            }

            $scope.form.data.FormId = $scope.formId;
            Gtbank.wait(true);
            CallService.doPostWithoutEnc($scope.request, ACTION_URLS.CUSTOMER_FORM_DETAILS)
                .then(function (response) {
                    var res = angular.fromJson(angular.fromJson(response.data));
                    if (res.StatusCode != 0) {
                      Gtbank.wait(false);
                        UtilityService.showErrorAlert(res.Message);
                    } else {
                      Gtbank.wait(false);
                        var resp = angular.fromJson(res.Message);
                        Gtbank.setFinalForm(resp);
                        $state.go("airlineThree");
                    }
                }, function(reason) {
                  Gtbank.wait(false);
                  UtilityService.showErrorAlert('Error communicating with host, please try again later.');
                });
    }
});
