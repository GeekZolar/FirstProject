var starter = angular.module('starter');
starter.controller('twitterCtrl', function($scope, $ionicPlatform, $twitterApi, $cordovaOauth) {

      var twitterKey = 'STORAGE.TWITTER.KEY';
      var clientId = 'sJXWKK75WGSw3nxe3fqMsUjg7';
      var clientSecret = '3b3TffJfmCguykKAP3ym2zY80lw0Gn4RUEzLvDDJnaKjtMwmgK';
      var myToken = '';

      $scope.tweet = {};

      $ionicPlatform.ready(function() {
        console.log('I am here');
        myToken = JSON.parse(window.localStorage.getItem(twitterKey));
        if (myToken === '' || myToken === null) {
          $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
            console.log(succ);
            myToken = succ;
            window.localStorage.setItem(twitterKey, JSON.stringify(succ));
            $twitterApi.configure(clientId, clientSecret, succ);
            $scope.showHomeTimeline();
          }, function(error) {
            console.log(error);
          });
        } else {
          $twitterApi.configure(clientId, clientSecret, myToken);
          $scope.showHomeTimeline();
        }
      });
      $scope.options={
        screen_name:"gtbank",
        count:20
      }
      $scope.showHomeTimeline = function() {
        $twitterApi.getUserTimeline($scope.options).then(function(data) {
          console.log(data);
        $scope.home_timeline = data;
  });
};

$scope.correctTimestring = function(string) {
  return new Date(Date.parse(string));
};

});

// Available methods
//
// getHomeTimeline(object options); // GET statuses/home_timeline
// getMentionsTimeline(object options) // GET statuses/mentions_timeline
// getUserTimeline(object options) // GET statuses/user_timeline
// searchTweets(string keyword, object options); // GET search/tweets
// postStatusUpdate(string statusText, object options); // POST statuses/update
// getUserDetails(string user_id, object options); // GET users/show
// getRequest(string full_twitter_api_url, object options); // GET custom url
// postRequest(string full_twitter_api_url, object options); // POST custom url
