var mbank = angular.module('starter');

mbank.filter('contactsfilter',[ function () {
  return function(items, searchText) {
    if(!searchText){
        return items;
    }
    var filtered = [];

    searchText = searchText.toLowerCase();
    angular.forEach(items, function(item) {
        if(angular.isDefined(item.displayName) &&  item.displayName.toLowerCase().indexOf(searchText) >= 0 ){
          filtered.push(item);
        }
    });

    return filtered;
  };
}]);

mbank.directive("moveNextOnMaxlength", function() {
    return {
        restrict: "A",
        link: function($scope, element) {
            element.on("input", function(e) {
              if (!ionic.Platform.isIOS()) {
                if(element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.next();
                    if($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
              }
            });
        }
    }
});

mbank.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
});
mbank.filter('glChequeAccounts', function () {
   return function (input) {
     var out = [];
     for (var i = 0; i < input.length; i++) {
       if (input[i].AccountType == 'CURRENT ACCOUNT' && input[i].Currency == 'GHS') {
         out.push(input[i]);
       }
     }
     return out;
   }
});
mbank.filter('chequeAccounts', function () {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; i++) {
        if (input[i].ACCOUNTTYPE == 'CURRENT ACCOUNT' && input[i].CURRENCY == 'GHS') {
          out.push(input[i]);
        }
      }
      return out;
    }
  })

  // mbank.filter('nairaAccounts', function () {
  //     return function (input) {
  //       var out = [];
  //       for (var i = 0; i < input.length; i++) {
  //         if (input[i].CURRENCY == 'GHS' && input[i].AccountType != 'GT TARGET' && input[i].AccountType != 'GT SPEND2SAVE' && input[i].AccountType != 'POS MERCHANT') {
  //           out.push(input[i]);
  //         }
  //       }
  //       return out;
  //     }
  // })
mbank.filter('nairaAccounts', function () {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; i++) {
        if ((input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'SAVINGS ACCOUNT') || (input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'CURRENT ACCOUNT')) {
          out.push(input[i]);
        }
      }
      return out;
    }
})
//UTILITY CARD LEDGER
mbank.filter('ownAccountsFrom', function () {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; i++) {
        if ((input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'SAVINGS ACCOUNT') ||
        (input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'CURRENT ACCOUNT')||
        (input[i].CURRENCY == 'USD' && input[i].ACCOUNTTYPE == 'FOREIGN EXCHANGE ACCOUNT')||
        (input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'UTILITY CARD LEDGER')) {
          out.push(input[i]);
        }
      }
      return out;
    }
})

mbank.filter('ownAccountsTo', function () {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; i++) {
        if ((input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'SAVINGS ACCOUNT') ||
         (input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'CURRENT ACCOUNT')||
         (input[i].CURRENCY == 'USD' && input[i].ACCOUNTTYPE == 'CURRENT ACCOUNT')||
         (input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'UTILITY CARD LEDGER')) {
          out.push(input[i]);
        }
      }
      return out;
    }
})

mbank.filter('glNairaAccounts', function () {
   return function (input) {
     var out = [];
     for (var i = 0; i < input.length; i++) {
       if (input[i].Currency == 'GHS' && input[i].AccountType != 'GT TARGET' && input[i].AccountType != 'GT SPEND2SAVE' && input[i].AccountType != 'POS MERCHANT') {
         out.push(input[i]);
       }
     }
     return out;
   }
});

mbank.filter('targetAccounts', function () {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; i++) {
        if (input[i].CURRENCY == 'GHS' && input[i].ACCOUNTTYPE == 'TARGET SAVE') {
          out.push(input[i]);
        }
      }
      return out;
    }
});

mbank.filter('fxAccounts', function () {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; i++) {
        if (input[i].CURRENCY == 'USD' || input[i].CURRENCY == 'GBP' || input[i].CURRENCY == 'EUR') {
          out.push(input[i]);
        }
      }
      return out;
    }
});

mbank.filter('glFxAccounts', function () {
     return function (input) {
       var out = [];
       for (var i = 0; i < input.length; i++) {
         if (input[i].Currency == 'USD' || input[i].Currency == 'GBP' || input[i].Currency == 'EUR') {
           out.push(input[i]);
         }
       }
       return out;
     }
})

mbank.filter('capitalize', function() {
    return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
});
