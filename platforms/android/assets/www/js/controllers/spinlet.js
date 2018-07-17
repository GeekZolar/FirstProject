var gtw = angular.module('starter');


gtw.controller('spinletCtrl', function($ionicHistory,$scope,CallService,$rootScope,$window,UtilityService,$cordovaMedia, $ImageCacheFactory){
  //UtilityService.showErrorAlert("This page is currently under construction");

      $scope.dada = [];
      $scope.playlist = [];
      $scope.img = null;
      $scope.showMe = false;

      if (ionic.Platform.isIOS()) {
        $scope.topMargin = '5px';
      } else{
        $scope.topMargin = '0px';
      }

      $scope.goBack = function(){
        $state.go("dashboard");
      };

      CallService.doBrowseSpinlet(131).then(function(data){

          $scope.tunes = data.data.response.operations[0].list;
          CallService.doSearchWithIdSpinlet(103,$scope.tunes[0].id).then(function(data){
              var album = data.data.response.operations[0].list;
              $scope.selectedTrack = album[0];

          },function (error) {
          });
      });

      $scope.getUrl1 = function(data, index)
      {
      if(data.content_type == 5){ //an album... we need to list all the songs, we call 103
          CallService.doSearchWithIdSpinlet(103,data.id).then(function(data){

              var album = data.data.response.operations[0].list;
              $scope.selectedTrack = album[0];
              //$scope.img = data.image_info[0].load_url;

          },function (error) {
          });
      }
      if(data.content_type == 4)//this is an album track
      {

          CallService.doBrowseSpinlet(data.id).then(function(data){
              var source = {
                  file : null
              }
              var plays = {
                  image: null,
                  sources: []
              }
              source.file = data.data;
              if (data.data.length > 1) {
                $scope.selectedTrack = data.data[0];
              }else {
                $scope.selectedTrack = data.data[0];
              }
              //plays.sources.push(source);
              //plays.image = data.image_info[0].load_url;
              //$rootScope.playlists.push(plays);
              $scope.optionsJw = {
                  //file: data.data,
                  //image: img, // optionnal
                  height: 180,
                  width: $window.screen.width
              };
              //var player = jwplayer('myplayer');
              //player.load($rootScope.playlists);
              //player.setup($scope.optionsJw);
              //player.play();

              //$scope.playMusic = true;
          });
      }
          //});
      },

      $scope.play = function(src) {
      var media = new Media(src, null, null, mediaStatusCallback);
      $cordovaMedia.play(media);
  }

  var mediaStatusCallback = function(status) {
      if(status == 1) {
          // $ionicLoading.show({template: 'Loading...'});
      } else {
          // $ionicLoading.hide();
      }
  }


  $scope.img = [];
  $scope.loadImage = function(url,index) {
    $scope.img[index] = 'assets/img/audio_default.jpg';
    $ImageCacheFactory.Cache([url]).then(function () {
          $scope.img[index] = url;
        });
  };

  $scope.startSmehub = function(){
    UtilityService.openInAppBrowser('https://www.smemarkethub.com/');
  };

  $scope.startSocials = function(){
    UtilityService.openInAppBrowser('https://www.instagram.com/gtbank/');
  };


});
