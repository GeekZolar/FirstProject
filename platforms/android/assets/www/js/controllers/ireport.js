var gtw = angular.module('starter');

gtw.controller('IReportSuccessCtrl',['CallService','UtilityService','ACTION_URLS','$q','$log', '$rootScope', '$scope', '$window','$cordovaGeolocation',
    function(CallService,UtilityService,ACTION_URLS,$q,$log, $rootScope,$scope, $window,$cordovaGeolocation) {
      $scope.$on('$ionicView.beforeEnter', function (e, config) {
        config.enableBack = false;
        $scope.$root.done = true;
      });
    }])

gtw.controller('IReportCtrl',['CALL_CONSTANTS','Gtbank','$ionicHistory','$state','$stateParams','DataFactory','$ionicPopover','CallService',
    'UtilityService','ACTION_URLS','$q','$log', '$rootScope', '$scope', '$window','$ionicLoading',
    function(CALL_CONSTANTS,Gtbank,$ionicHistory,$state,$stateParams,DataFactory,$ionicPopover,CallService,UtilityService,ACTION_URLS,$q,$log,
             $rootScope,$scope, $window,$ionicLoading) {

      $scope.addComment = {
          comment : ""
      }

      $scope.pastReports = function(){
        Gtbank.wait(true);
        CallService.doPost({UserId: Gtbank.getUserId()}, ACTION_URLS.REPORTS)
            .then(function (response) {
              Gtbank.wait(false);
              $scope.reports = angular.fromJson(response.data);
              DataFactory.setResponse($scope.reports);
            },
            function(err){
              Gtbank.wait(false);
            });
      }


      $scope.pastReportsDetail = function(){
          var reps = DataFactory.getResponse();
          $scope.report = DataFactory.getObjectFromArray($stateParams.rId,"ReportId",reps);

          if (ionic.Platform.isAndroid()) {
              $scope.mimeType = "video/mp4";
          } else if (ionic.Platform.isIOS()) {
              $scope.mimeType = "video/quicktime";
          }

        $scope.videoUrl = CALL_CONSTANTS.IREPORTVIDEOURL+$scope.report.Resourcepath;


        var otherComments = [];
          angular.forEach($scope.report.Comments,function(value,key){
              if(key != 0)
              {
                  otherComments.push(value);
              }
          });
          $scope.report.OtherComments = otherComments;

          $scope.btnAddComment = function(rid)
          {
            if($scope.addComment.comment == "")
            {
                //doCordova dialog here
            }
            else
            {
                //call save comment service
                var data = {
                    "UserId": Gtbank.getUserId(),
                    "Comments": $scope.addComment.comment,
                    "ReportId": rid
                }
                Gtbank.wait(true);
                CallService.doPost(data, ACTION_URLS.POST_COMMENTS)
                    .then(function (response) {
                        CallService.doPost({UserId:Gtbank.getUserId(), ReportId:rid}, ACTION_URLS.GET_REPORT_COMMENT)
                            .then(function (response) {
                              Gtbank.wait(false);

                                var otherComments = [];
                                var da = angular.fromJson(angular.fromJson(response.data));
                                $scope.report.Comments = da;
                                angular.forEach(da,function(value,key){
                                    if(key != 0)
                                    {
                                        otherComments.push(value);
                                    }
                                });
                                $scope.report.OtherComments = otherComments;
                                $scope.addComment.comment = "";
                            },
                            function(err){
                                Gtbank.wait(false);
                            });
                    },
                    function(err){
                        Gtbank.wait(false);
                    });
            }
          }
      }

      $scope.goToDetails = function(index){
        $state.go("ireportPastreportdetail", {rId: index});
      }

    }])

gtw.controller('AddMediaCtrl',['CALL_CONSTANTS','Gtbank','$cordovaDevice','$timeout','$state','CallService','UtilityService','AUTH','ACTION_URLS','UrlConstants','$cordovaCapture','$cordovaCamera', '$cordovaImagePicker','$ionicModal','$q','$log', '$rootScope', '$scope', '$window',
        function(CALL_CONSTANTS,Gtbank,$cordovaDevice,$timeout,$state,CallService,UtilityService,AUTH,ACTION_URLS,UrlConstants,$cordovaCapture,$cordovaCamera,$cordovaImagePicker,$ionicModal,$q,$log, $rootScope,$scope, $window) {

          $scope.report = {};
          $scope.data = {};
          //$scope.mediaData = null;
          $rootScope.mediaData= null;
          //$scope.mediaAdded = false;
          $rootScope.mediaAdded = false;

          $rootScope.MediaType = 3;
          var MimeType = "image/jpg";
          var OsType = 3;

          $scope.choosePhoto = function () {
                  var options = {
                      quality: 15,
                      destinationType: Camera.DestinationType.FILE_URI,
                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY, //0,
                      allowEdit: true,
                      encodingType: Camera.EncodingType.JPEG,//0,
                      popoverOptions: CameraPopoverOptions,
                      saveToPhotoAlbum: false,
                      correctOrientation: true
                  };

                  $cordovaCamera.getPicture(options).then(function (imageData){
                  console.log(imageData);
                      //$rootScope.mediaAdded = true;
                    //  $rootScope.mediaData = imageData;
                      //UtilityService.showErrorAlert(imageData+ " i chosed this...");
                    //  $scope.MediaType = 2;
                      $scope.cancelAuthorization(imageData,2);
                      //$scope.upload();
                  }, function (err) {
                      // setTimeout(function () {
                     UtilityService.showErrorAlert('Unable to pick image from library.'+JSON.stringify(err));
                      // }, 100);
                  });
          }

          $scope.takePic = function () {
                  var options = {
                      quality: 15,
                      destinationType: Camera.DestinationType.FILE_URI,
                      sourceType: Camera.PictureSourceType.CAMERA, //1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                      encodingType: Camera.EncodingType.JPEG,//0,   // 0=JPG 1=PNG
                      saveToPhotoAlbum: true,
                      correctOrientation: true,
                      targetwidth: 69
                  }
                  navigator.camera.getPicture(onSuccess, onFail, options);
          }

          $scope.captureVideo = function() {

                var options = { limit: 1, duration: 15, quality: 0 };

                  $cordovaCapture.captureVideo(options).then(function(videoData) {
                    console.log(videoData);
                //  $rootScope.mediaAdded = true;
                //  $rootScope.mediaData = videoData;
                //  $scope.MediaType = 1;
                  $scope.cancelAuthorization(videoData,1);

                }, function(err) {
                  UtilityService.showErrorAlert(JSON.stringify(err));
                });
          }


          var onSuccess = function (FILE_URI) {
              //$scope.MediaType = 2;
              //$scope.mediaAdded = true;
              //$rootScope.mediaData = FILE_URI;
              $scope.$apply();
              $scope.cancelAuthorization(FILE_URI,2);
                  //$scope.upload();
          }

          var onFail = function (message) {
              UtilityService.showErrorAlert('Unable to take picture using phone camera.'+message);
          }

    $scope.upload = function () {
        console.log("mediaData is "+$rootScope.mediaData);
        console.log($scope.MediaType);
        document.activeElement.blur();
        if(!$scope.report.Title || !$scope.report.Description){
            UtilityService.showErrorAlert('Please fill all input fields.');
            return;
        }

        Gtbank.wait(true);
        var fname = null;
        if ($rootScope.MediaType == 1) {
          fname = $rootScope.mediaData[0].localURL.substr($rootScope.mediaData[0].localURL.lastIndexOf('/') + 1);
          $rootScope.mediaData = $rootScope.mediaData[0].localURL;
                    //set mime and ostype
          if (ionic.Platform.isAndroid()) {
              OsType = 2;
            }
            else if (ionic.Platform.isIOS()) {
              OsType = 1;
          }
        }
        else if ($rootScope.MediaType == 2) {
          fname = $rootScope.mediaData.substr($rootScope.mediaData.lastIndexOf('/') + 1);
        }
        else{
          $rootScope.mediaData=null;
          fname = "";
        }

        $scope.data =  {
          "UserId": Gtbank.getUserId(),
          "Comment": $scope.report.Description,
          "FileName": fname,
          "MediaType": $rootScope.MediaType,
          "OsType": OsType,
          "Title": $scope.report.Title
        }

        if ($rootScope.mediaData==null) {
          console.log($scope.data);
          Gtbank.wait(true);
            CallService.doPostWithHeader($scope.data, ACTION_URLS.POST_REPORT)
                .then(function (response) {
                  console.log(response);
                  //var res = angular.fromJson(response.data);
                  //console.log(res);
                  Gtbank.wait(false);
                  //UtilityService.showSuccessAlert('Nice! Your report has been sent.');
                  $state.go('ireportSuccess');
            },
          function(err){
            console.log(err);
            Gtbank.wait(false);
            UtilityService.showErrorAlert('Sorry! Report failed to send, please try again.');
        });
      }
      else {
        document.addEventListener('deviceready', function () {
        var options = {
          fileKey: "file",
          fileName: fname,
          mimeType: MimeType,
          trustEveryone: true,
          headers: {'Authorization': Gtbank.getUserId(), 'PushData':JSON.stringify($scope.data)},
          httpMethod: CALL_CONSTANTS.METHOD_POST
      };
      var ft = new FileTransfer();
      ft.upload($rootScope.mediaData, encodeURI(CALL_CONSTANTS.URL + ACTION_URLS.POST_REPORT),onUploadSuccess,onUploadFail, options);
      }, false);
    }
  }
  var onUploadSuccess = function (r) {
        Gtbank.wait(false);
        console.log(r);
        setTimeout(function () {
        //UtilityService.showSuccessAlert('Nice! Your report has been sent.');
        $state.go('ireportSuccess');
      }, 100);
    }

  var onUploadFail= function (e) {
      Gtbank.wait(false);
      console.log(e);
      setTimeout(function () {
      UtilityService.showErrorAlert('Sorry! Report failed to send, please try again.');
      }, 100);
  }

          $scope.cancelMedia = function(){
            $rootScope.mediaAdded = false;
            $rootScope.mediaData = "";
          }

          $scope.showMediaOption = function(imgSrc){
          $rootScope.mediaData = imgSrc;
          $scope.showModal('ireport_media_dialog.html');
        }

        $scope.showModal = function(templateUrl) {
          $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'jelly'
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        }

        $scope.cancelAuthorization = function(res, mediaType) {
          if (res) {
            console.log(res);
            $rootScope.mediaAdded= true;
            $rootScope.mediaData= res;
            $rootScope.MediaType= mediaType;
            $scope.modal.hide();
          }
          $scope.modal.hide();
          //$scope.modal.remove()
        };

        }])
