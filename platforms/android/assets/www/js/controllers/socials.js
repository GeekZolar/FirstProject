var gtw = angular.module('starter')

gtw.controller('DaashboardCtrl',['$ionicModal','$ionicScrollDelegate','$ImageCacheFactory','$state',
  '$localStorage','$ionicPlatform','$cordovaDialogs','$ionicHistory','$q','$log', '$rootScope', '$scope',
 '$window','$http','$ionicPopover','$ionicSideMenuDelegate','CallService','ACTION_URLS','$cordovaClipboard',
 '$ionicActionSheet','$timeout','UtilityService','$cordovaSocialSharing','$ionicLoading',

  function($ionicModal,$ionicScrollDelegate,$ImageCacheFactory,$state,$localStorage,$ionicPlatform,$cordovaDialogs,
  $ionicHistory,$q,$log, $rootScope,$scope, $window,$http,$ionicPopover,$ionicSideMenuDelegate,CallService,ACTION_URLS,
  $cordovaClipboard,$ionicActionSheet,$timeout,UtilityService,$cordovaSocialSharing, $ionicLoading) {

    $scope.startSocials = function(path){
       UtilityService.openInAppBrowser(path);
    };

    var showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.tipsShown = true;
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    //   FB.api (
    //   '/gtbank/',
    //   'GET',
    //   {"fields":"posts{permalink_url,message,story,picture,type,created_time,full_picture}"},
    //   function(response) {
    //     console.log(response);
    //       // Insert your code here
    //   }
    // );

    // $FB.ui({
    //   method: 'share_open_graph',
    //   action_type: 'og.likes',
    //   action_properties: JSON.stringify({
    //     object:'https://developers.facebook.com/docs/',
    //   })
    // }, function(response){
    //   // Debug response (optional)
    //   console.log(response);
    // });

    $scope.closeModal = function(x) {
        if(x){
            $localStorage.showTabTips = x;
        }
        $scope.tipsShown = false;
        $scope.modal.hide();
        //$scope.modal.remove()
    }

    $scope.homeTipsModal = function(){
        //if (!$localStorage.showTabTips) {
        //    setTimeout(function() {
        //        if(!$scope.tipsShown && $ionicHistory.viewHistory().currentView.stateName !=='splashcreen')
        //        showModal('views/tabs/tips.html');
        //    }, 6000);
        //}
    }

    if (ionic.Platform.isAndroid()) {
      $ionicPlatform.registerBackButtonAction(function() {
        $cordovaDialogs.confirm('Are you sure you want to exit GTWORLD?', 'Quit', ['Yes','No'])
          .then(function(buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = buttonIndex;
            if (btnIndex == 1) {
              ionic.Platform.exitApp();
            }
            if (btnIndex == 2) {
              return;
            }
          });
        }, 100);
    }else{
        $rootScope.iosOnly = true;
         }

   //first check if the app is connected to the internet
   if (!UtilityService.isAppConnectedToInternet()) {
        UtilityService.showErrorAlert('Internet is disconnected on your device.');
        return;
    }

   var bucketOfFeeds=[];
   $scope.entries = {};
   $scope.math = Math;
   $scope.lauchDashboard = function(x){

       $rootScope.profileImage = 'img/user.png';

       //load adverts object
       var adverts = [{id:1,url:'img/adverts/1.jpg'},
           {id:2,url:'img/adverts/2.jpg'},
           {id:3,url:'img/adverts/3.jpg'},
           {id:4,url:'img/adverts/4.jpg'}];

       //generate random number
       var rNum = function(){
           return Math.floor((Math.random() * adverts.length));
       }

       //load first and second advert
       $scope.firstAdvert = adverts[rNum()].url;
       $scope.secondAdvert = adverts[rNum()].url;

       //make sure the same adverts are not being displayed
       var count = 0;
       while(count < adverts.length){
           if($scope.secondAdvert == $scope.firstAdvert){
               $scope.secondAdvert = adverts[rNum()].url;
               count = adverts.length+1;
           }else{
               count = adverts.length+1;
           }
           count++;
       }

        if (!$localStorage.skippedUser) {
            $rootScope.firstName = $localStorage.gtwFirstName;
            $rootScope.lastName= $localStorage.gtwLastName;
            $ImageCacheFactory.Cache([$localStorage.profileImage])
                .then(function(){
                    $rootScope.profileImage = $localStorage.profileImage;
                },function(){
                    $rootScope.profileImage = 'img/user.png';
                });
        }else {
            $rootScope.firstName = "Skipped";
            $rootScope.lastName= "User";
        }


        if (x==1) {
            $scope.loadingIcon = true;
            $scope.loadingInterests = true;
        }else{
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loadingIcon = false;
            $scope.loadingInterests = false;
        }



       if(!$localStorage.hasUser || !$scope.hasUser){

            if ($localStorage.skippedUser) {
                var UserInterests = {
                    InterestId: [11],
                    InterestIds:[{Interestid: 1, Status: 0},{Interestid: 2, Status: 0},
                      {Interestid: 3, Status: 0},{Interestid: 7, Status: 0},{Interestid: 8, Status: 0},
                      {Interestid: 9, Status: 0},{Interestid: 11, Status: 1},{Interestid: 12, Status: 0}]
                }

                CallService.doOldGtworldPost(UserInterests, ACTION_URLS.SAVE_INTEREST)
                    .then(function (response) {
                        var res = angular.fromJson(angular.fromJson(response.data));
                    });
            }

            CallService.doOldGtworldGet(null, ACTION_URLS.USER_INTEREST)
                .then(function (response) {
                    $scope.loadingInterests = true;
                    $localStorage.hasUser = true;
                    $scope.hasUser = true;
                    $ionicLoading.hide();
                    var res = angular.fromJson(angular.fromJson(response.data));
                    $rootScope.interests = res;
                });
        }

        $scope.noData = false;
        CallService.doOldGtworldGet(null, ACTION_URLS.USER_INTEREST_DASHBOARD)
            .then(function (response) {
                var feedsUrl = [];
                var res = angular.fromJson(angular.fromJson(response.data));
                //push the feeds into buckets of array
                for (var i = 0; i < res.length; i++) {
                    var smallFeeds = [];
                    for (var j = 0; j < res[i].InterestFeeds.length; j++) {
                        var obj = {};
                        obj.Url = res[i].InterestFeeds[j].FeedUrl;
                        obj.InterestId = res[i].InterestId;
                        obj.InterestName = res[i].InterestName;
                        obj.Description = res[i].Description;
                        smallFeeds[j] = obj;
                    }
                    feedsUrl[i] = smallFeeds;
                }
                if(feedsUrl.length >= 1 && feedsUrl[0].length ==0)
                {
                    $scope.loadingIcon = true;
                    $scope.$broadcast('scroll.refreshComplete');
                    //alert("No feeds found in your country.");
                    $scope.noData = true;
                    return;
                }
                var bucket = [];

                for (var i = 0; i < feedsUrl.length; i++) {
                    var arr = feedsUrl[i];
                    var rand = arr[Math.floor(Math.random() * arr.length)];
                    var rands = [];
                    rands.push(rand);
                    bucket.push(rands)
                }



                var getAllEntries = function(bucket){
                    var buc = [];
                    bucketOfFeeds=[];
                    angular.forEach(bucket,function(value,key){
                        var d = $q.defer();
                        bucketOfFeeds.push(d.promise);
                        init2(value).then(function(data){

                            if(data !=null)
                            {
                                d.resolve(data);
                            }
                        });
                    });
                }
                getAllEntries(bucket);
                $q.all(bucketOfFeeds).then(function(d){
                    var mainbucketOfFeeds = d;

                    var count = 0;
                    for(var i = 0; i < mainbucketOfFeeds.length; i++)
                    {
                        count = count + mainbucketOfFeeds[i].length;
                    }
                    var totalToshow = 20;
                    if(count < totalToshow)
                    {
                        totalToshow = count;
                    }
                    var itemDate = new Date();
                    $scope.entry = [];
                    for(var i = 0; i< totalToshow; i++)
                    {
                        var rand = Math.floor((Math.random() * mainbucketOfFeeds.length) );
                        var arr = mainbucketOfFeeds[rand];

                        if(arr !== undefined && arr.length > 0)
                        {
                            var item = arr.pop();
                            if(item !== undefined)
                            {
                                item.InterestId = arr.InterestId;
                                item.InterestName = arr.InterestName;
                                item.Description = arr.Description;
                                item.publishedDate = item.pubDate;
                                item.ourDate = new Date(item.pubDate);
                                item.Url = arr.Url;
                                intId = item.InterestId;


                                var input = item.description;
                                var div = document.createElement('div');
                                div.innerHTML = input;
                                //try{

                                    var img = div.getElementsByTagName('img');
                                    if(img.length !== 0)
                                    {
                                        if(item.InterestId == 2 || item.InterestId ==1){
                                            if(div.getElementsByTagName('img')[0].src.slice(-13) == "d=yIl2AUoC8zA"){
                                                item.snippetImg = '';
                                            }else{
                                                item.snippetImg = div.getElementsByTagName('img')[0].src ;
                                                var str = item.snippetImg;
                                                item.snippetImg = div.getElementsByTagName('img')[0].src;
                                            }
                                        }else{
                                            item.snippetImg = div.getElementsByTagName('img')[0].src ;
                                            var str = item.snippetImg;
                                            item.snippetImg = div.getElementsByTagName('img')[0].src;
                                        }

                                    }

                                // }catch(e)
                                // {
                                //
                                // }
                                $scope.entry.push(item);

                            }
                        }
                    }
                    $scope.entries = {};
                    $scope.entries = $scope.entry;
                    $scope.loadingIcon = true;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }, function (reason) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.loadingIcon = true;
            });
    }

   $scope.lauchDashboard();


   //$scope.$on('$ionicView.beforeEnter', function () {

           $ionicScrollDelegate.scrollTop();
           $rootScope.loadingIcon = false;
           $scope.$broadcast('scroll.refreshComplete');

   //});

   var init2 = function(url) {
        var q = $q.defer();
            var query = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from rss where url="' + url[0].Url + '"') + '&format=json';
          $http.get(query).then(function(res){
                  try {
                    if (res.data.query.count > 0) {
                      res.data.query.results.item.InterestId = url[0].InterestId;
                      res.data.query.results.item.Description = url[0].Description;
                      res.data.query.results.item.InterestName = url[0].InterestName;
                      res.data.query.results.item.Url = url[0].Url;
                      q.resolve(res.data.query.results.item);
                    }
                    else {
                      q.resolve(res.data.query);
                    }
                  }
                  catch (e)
                  {

                  }
                    })
                return q.promise;
    }
    // var init = function(url) {
    //      var q = $q.defer();
    //
    //        $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q":url[0].Url, "num": "10" } })
    //                  .then(function(res){
    //                //try{
    //                        res.data.responseData.feed.InterestId = url[0].InterestId;
    //                        res.data.responseData.feed.Description = url[0].Description;
    //                        res.data.responseData.feed.InterestName = url[0].InterestName;
    //                        res.data.responseData.feed.Url = url[0].Url;
    //                        q.resolve(res.data.responseData.feed);
    //                // }catch(e) {
    //                //     q.reject("An error occured");
    //                // }
    //                  })
    //              return q.promise;
    //  }
   $scope.browse = function(id) {
    $window.open(id, "_blank", "location=yes");
   }

   $scope.saveInterest = function(interestId,value,id){

   //check if this is the last checked interest
   if ($scope.lastCheckedInterest) {
    $scope.lastCheckedInterest = undefined;
    return;
   }

      $ionicLoading.show();
      var count = 0;
      for (var i = 0; i < $rootScope.interests.length; i++) {
          if ($rootScope.interests[i].Checked == true) {
            count++;
          }
      }
      console.log(count);

      if (count > 4) {
        $localStorage.hasUser = false;
        $ionicLoading.hide();
        $scope.hasUser = false;
          UtilityService.showErrorAlert("Sorry! You cannot select more than four(4) interests.");
        return;
      }

      if (count == 0) {
        $localStorage.hasUser = false;
        $scope.hasUser = false;
        $scope.lastCheckedInterest = id;
        $rootScope.interests[id].Checked == true;
        $ionicLoading.hide();
        UtilityService.showErrorAlert("Sorry! You have to select at least one interest.");
        return;
      }

      var data = [];
      var record = [];
              if (value == false) {
                  data.push(interestId);
                  record.push({Interestid: interestId, Status: 1});
              }else {
                  record.push({Interestid: interestId, Status: 0});
              }

      var UserInterests = {
          InterestId: data,
          InterestIds:record
      }
      CallService.doOldGtworldPost(UserInterests, ACTION_URLS.SAVE_INTEREST)
          .then(function (response) {
              var res = angular.fromJson(angular.fromJson(response.data));
              $localStorage.hasUser = false;
              $scope.hasUser = false;
              $ionicLoading.hide();
          });
        }


    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };

    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };

}])

  // gtw.controller('DashTimelineCtrl', ['$rootScope','UtilityService','$localStorage', '$scope','$state',
//   '$cordovaDialogs','Security','CallService','$ionicHistory','$ionicLoading','CallService','ACTION_URLS','$ionicModal',
//     function($rootScope,UtilityService,$localStorage,$scope,$state,$cordovaDialogs,Security,CallService,$ionicHistory,
//       $ionicLoading,CallService,ACTION_URLS,$ionicModal){
//
//       $scope.showMe = false;
//
//       if ($rootScope.twitterObj !== undefined) {
//               if("get" in $rootScope.twitterObj)
//               {
//                   $scope.showMe = true;
//               }
//           }
//
//       $scope.getToken = function(){
//           var token = Security.twitterToken();
//           token.then(function(res){
//               $rootScope.twitterObj= res;
//               $scope.showMe = true;
//              $scope.myTimelines();
//           })
//       }
//
//       $scope.myTimelines = function(x){
//           $rootScope.timelines=[];
//           if($scope.showMe)
//           {
//               $scope.twitObj = $rootScope.twitterObj;
//               if (x != 1) {
//                 $ionicLoading.show();
//               }
//
//               $scope.twitObj.get("/1.1/statuses/home_timeline.json").then(function(res) {
//                   angular.forEach(res,function(value,key){
//                       var obj = {};
//                       obj.id = value.id;
//                       obj.userHandle = value.user.screen_name;
//                       obj.name = value.user.name;
//                       obj.image = value.user.profile_image_url;
//                       obj.tweetedAt = new Date(value.created_at);
//                       obj.text = value.text;
//                       //check if media exist
//                       if(value.entities.media == undefined)
//                       {
//                           obj.mediaUrl = null;
//                           obj.mediaType = "none";
//                       }else {
//                           obj.mediaUrl = value.entities.media[0].media_url;;
//                           obj.mediaType = value.entities.media[0].type;
//                       }
//                       $rootScope.timelines.push(obj);
//                   })
//                     $scope.$broadcast('scroll.refreshComplete');
//                   $ionicLoading.hide();
//               });
//           }
//       }
//
//       $scope.tweet = function(){
//         document.activeElement.blur();
//         var inputData = document.getElementById('post-id').value
//         var oauth_token =$rootScope.twitterObj.oauth_token;
//         var oauth_token_secret= $rootScope.twitterObj.oauth_token_secret;
//         var data = {
//                     "AccessToken": oauth_token,
//                     "AccessTokenSecret": oauth_token_secret,
//                     "Id": '',
//                     "Text": inputData
//                   }
//                   CallService.doOldGtworldPostRetweet(data, ACTION_URLS.POST_TWEET)
//                   .then(function (response) {
//                     UtilityService.showSuccessAlert('Tweet successfully posted.');
//                     $scope.myTimelines()
//                   },function(reason){
//                     UtilityService.showSuccessAlert('Tweet failed please try again.');
//                   });
//       }
//
// }])

gtw.controller('ImageController',function($localStorage,$ImageCacheFactory,$scope,$rootScope,$ionicModal){
      var showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: 'jelly'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }

      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
      }

      $scope.showImage = function(img){
          var url = img;
          $ImageCacheFactory.Cache([url])
            .then(function(){
              $scope.picData = url;
            });
          showModal('view-avatar.html');
      }
});

// gtw.controller('FeedsControllers', function($q,$http,$scope){
//     var q = $q.defer();
//     //$scope.loadfeeds = function(){
//     $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q":"http://www.today.ng/feed", "num": "10" } })
//         .then(function(res){
//             //try{
//                 var arr = res.data.responseData.feed;
//                 $scope.entry = [];
//                 for(var i = 0; i< 14; i++) {
//                     if (arr !== undefined) {
//                         var item = arr.entries.pop();
//                         if (item !== undefined) {
//                             item.InterestId = arr.InterestId;
//                             item.InterestName = arr.InterestName;
//                             item.Description = arr.Description;
//                             item.ourDate = new Date(item.publishedDate);
//                             item.Url = arr.Url;
//
//                             var input = item.content;
//                             var div = document.createElement('div');
//                             div.innerHTML = input;
//                             // try {
//                                 var img = div.getElementsByTagName('img');
//                                 if (img.length !== 0) {
//
//                                         item.snippetImg = div.getElementsByTagName('img')[0].src;
//                                         var str = item.snippetImg;
//                                         item.snippetImg = div.getElementsByTagName('img')[0].src;
//
//
//
//                                 }else{
//                                     item.snippetImg = null;
//                                 }
//
//                             // } catch (e) {
//                             //
//                             // }
//                             $scope.entry.push(item);
//                         }
//                     }
//                 }
//
//                 q.resolve(res.data.responseData.feed);
//             // }catch(e) {
//             //     q.reject("An error occured");
//             // }
//         })
// //}
//     return q.promise;
//
// })
// gtw.controller("FeedsController", ['$scope','FeedService', function ($scope,FeedService) {
//
//   $scope.feeds = [];
//         FeedService.parseFeed("http://www.bbc.com/sport/rss.xml").then(function(res){
//
//             //$scope.feeds=res.data.responseData.feed.entries;
//         });
//
// }]);
// gtw.factory('FeedService',['$http',function($http){
//     return {
//         parseFeed : function(url){
//             return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
//         }
//     }}]);
