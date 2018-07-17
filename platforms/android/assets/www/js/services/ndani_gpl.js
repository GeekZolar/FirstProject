var gnt = angular.module('starter');

    gnt.factory('NdaniTv', function ($q,$http,$ionicLoading,UtilityService,$timeout) {

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
                }
            });

            return result.promise;
          }
        }
    });
