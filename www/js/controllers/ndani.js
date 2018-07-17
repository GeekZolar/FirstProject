var gtw = angular.module('starter');

  gtw.controller('NdaniTvCtrl', function ($scope, Gtbank, $state, $cordovaInAppBrowser, $ImageCacheFactory, NdaniTv, UtilityService) {

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
      }, 100);
    };

    $scope.playVideo = function(videoData){
      NdaniTv.setVideo(videoData);
      $state.go('ndani-play-video');
    };

    $scope.startSmehub = function(){
      UtilityService.openInAppBrowser('https://www.smemarkethub.com/');
    };

    $scope.startSocials = function(){
      UtilityService.openInAppBrowser('https://www.instagram.com/gtbank/');
    };

    $scope.loadVideoPlayer = function(){
      $scope.video = NdaniTv.getVideo();
      $scope.$on("$ionicView.afterEnter", function(event, data){
         $scope.videoUrl = "https://www.youtube.com/embed/"+$scope.video.id.videoId+"?modestbranding=0&showinfo=0";
      });
    };

  });
