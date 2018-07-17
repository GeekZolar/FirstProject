var gtw = angular.module('starter');

    gtw.factory('NdaniTv', function ($q,$http,$ionicLoading,UtilityService,$timeout) {

          var SearchResults = {}

          function setSearchResults(data) {
              SearchResults = data;
          }

          function getSearchResults() {
              return SearchResults;
          }

          var Video = {}

          function setVideo(data) {
              Video = data;
          }

          function getVideo() {
              return Video;
          }

        return {
          setSearchResults: setSearchResults,
          getSearchResults: getSearchResults,
          setVideo:setVideo,
          getVideo:getVideo,
          getRecentNdaniVideos: function () {
            var timeout = $q.defer(), result = $q.defer(), timedOut = false;
            //first check if the app is connected to the internet
            if (!UtilityService.isAppConnectedToInternet()) {
                UtilityService.showErrorAlert('Internet is disconnected on your device.');
                $ionicLoading.hide();
            }

            $timeout(function () {
                    timedOut = true;
                    timeout.resolve();
                },
                (1000 * 600));
            $http({
                url: "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=20&q=ndani+tv&type=video&channelId=UCx2qMIoQIchX9o5x38hf1Bw&key=AIzaSyDsHb8iTxuLMUtolP6NzuyHMxaOoOEQkx0",
                timeout: timeout.promise
            }).then(function (data) {
                result.resolve(data);
            }, function (err) {
                $ionicLoading.hide();
                if (timedOut) {
                    UtilityService.showErrorAlert('Request took longer than usual. Please try again.');
                    $ionicLoading.hide();
                }
            });

            return result.promise;
          },
          getVideosByPlaylist: function (playlistId) {
            var timeout = $q.defer(), result = $q.defer(), timedOut = false;
            //first check if the app is connected to the internet
            if (!UtilityService.isAppConnectedToInternet()) {
                UtilityService.showErrorAlert('Internet is disconnected on your device.');
                $ionicLoading.hide();
            }

            $timeout(function () {
                    timedOut = true;
                    timeout.resolve();
                },
                (1000 * 600));
            $http({
                url: "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet&key=AIzaSyDsHb8iTxuLMUtolP6NzuyHMxaOoOEQkx0&playlistId="+playlistId+"&maxResults=10",
                timeout: timeout.promise
            }).then(function (data) {
                result.resolve(data);
            }, function (err) {
                $ionicLoading.hide();
                if (timedOut) {
                  UtilityService.showErrorAlert('Request took longer than usual. Please try again.');
                  $ionicLoading.hide();
                }
            });

            return result.promise;
          },
          getPlaylists: function () {
            var timeout = $q.defer(), result = $q.defer(), timedOut = false;
            //first check if the app is connected to the internet
            if (!UtilityService.isAppConnectedToInternet()) {
                UtilityService.showErrorAlert('Internet is disconnected on your device.');
                $ionicLoading.hide();
            }

            $timeout(function () {
                    timedOut = true;
                    timeout.resolve();
                },
                (1000 * 600));
            $http({
                url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails+&channelId=UCx2qMIoQIchX9o5x38hf1Bw&key=AIzaSyDsHb8iTxuLMUtolP6NzuyHMxaOoOEQkx0&maxResults=50",
                timeout: timeout.promise
            }).then(function (data) {
                result.resolve(data);
            }, function (err) {
                $ionicLoading.hide();
                if (timedOut) {
                  UtilityService.showErrorAlert('Request took longer than usual. Please try again.');
                  $ionicLoading.hide();
                }
            });

            return result.promise;
          },
          getVideoViewCount: function (vId,i){

            var timeout = $q.defer(), result = $q.defer(), timedOut = false;
            //first check if the app is connected to the internet
            if (!UtilityService.isAppConnectedToInternet()) {
                UtilityService.showErrorAlert('Internet is disconnected on your device.');
                $ionicLoading.hide();
            }

            $timeout(function () {
                    timedOut = true;
                    timeout.resolve();
                },
                (1000 * 600));
            $http({
                url: "https://www.googleapis.com/youtube/v3/videos?id="+vId+"&key=AIzaSyDsHb8iTxuLMUtolP6NzuyHMxaOoOEQkx0%20&fields=items(statistics)&part=statistics",
                timeout: timeout.promise
            }).then(function (data) {
                result.resolve(data);
            }, function (err) {
                $ionicLoading.hide();
                if (timedOut) {
                  $ionicLoading.hide();
                }
            });

            return result.promise;
          }
        }
    });
