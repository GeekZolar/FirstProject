var starter = angular.module('starter')

    starter.factory('Gtbank', function ($ionicLoading, $http, $state, $q) {

      var device = {
              devicetoken: null,
              uuid: null,
              manufacturer: null,
              platform: null,
              model: null
          };


          function setDevice(data) {
              device = data;
          }

          function getDevice() {
              return device;
          }

      var ResponseData = {}

      function setResponse(data) {
          ResponseData = data;
      }

      function getResponse() {
          return ResponseData;
      }

      var Branches = {}

      function setBranches(data) {
          Branches = data;
      }

      function getBranches() {
          return Branches;
      }

      var SaveData = {}

      function setData(data) {
          SaveData = data;
      }

      function getData() {
          return SaveData;
      }

      var UseToken = 0

      function setUseToken(data) {
          UseToken = data;
      }

      function getUseToken() {
          return UseToken;
      }

      var Bvn = ''

      function setBvn(data) {
          Bvn = data;
      }

      function getBvn() {
          return Bvn;
      }

      var AccountInfo={}
      function setAccountInfo(data) {
          AccountInfo = data;
      }

      function getAccountInfo() {
          return AccountInfo;
      }

      var TransferData = {}

      function setTransferData(data) {
          TransferData = data;
      }

      function getTransferData() {
          return TransferData;
      }
      var UserId = ''

    function setUserId(data) {
        UserId = data;
    }

    function getUserId() {
        return UserId;
    }

    var ActiveBeneficiary = [];

  function setActiveBeneficiary(data) {
      ActiveBeneficiary = data;
  }

  function getActiveBeneficiary() {
      return ActiveBeneficiary;
  }

    var historyDetail = [];

    function setHistoryDetail(data) {
      historyDetail = data;
    }

    function getHistoryDetail(){
      return historyDetail;
    }

      var Email = ''

    function setEmail(data) {
        Email = data;
    }

    function getEmail() {
        return Email;
    }

    var MobileNumber = ''

    function setMobileNumber(data) {
        MobileNumber = data;
    }

    function getMobileNumber() {
        return MobileNumber;
    }

    var AccountNumber = ''
    function setNewAccountNumber(data) {
      AccountNumber = data;
    }

    function getNewAccountNumber() {
        return AccountNumber;
    }

    var Uuid = ''
    function setUuid(data) {
      Uuid = data;
    }

    function getUuid() {
        return Uuid;
    }

    var Code = ''
    function setResCode(data) {
      Code = data;
    }

    function getResCode() {
        return Code;
    }

    var Info = {};
    function setInfo(data) {
        Info = data;
    }

    function getInfo() {
        return Info;
    }
    var Form = {}
    function setForms(data) {
        Form = data;
    }

    function getForms() {
        return Form;
    }
    var Category = {}
    function setCategory(data) {
        Category = data;
    }
    function getCategory() {
        return Category;
    }
    var FinalForm = {}
    function setFinalForm(data) {
        FinalForm = data;
    }
    function getFinalForm() {
        return FinalForm;
    }
    var SourceAcc = {}
    function setSourceAccount(data) {
        SourceAcc = data;
    }
    function getSourceAccount() {
        return SourceAcc;
    }

    var Beneficiary = [];
    function setBeneficiary(data) {
        Beneficiary = data;
    }
    function getBeneficiary() {
        return Beneficiary;
    }
    var accountToDebit = [];
    function setAccountToDebit(data)
    {
      accountToDebit = data;
    }
    function getAccountToDebit()
    {
      return accountToDebit;
    }
    var accountToCredit = [];
    function setAccountToCredit(data)
    {
      accountToCredit = data;
    }
    function getAccountToCredit()
    {
      return accountToCredit;
    }
    var thirdPartyAccountToDebit = [];
    function setThirdPartyAccountToDebit(data)
    {
      thirdPartyAccountToDebit = data;
    }
    function getThirdPartyAccountToDebit()
    {
      return thirdPartyAccountToDebit;
    }
    var fxAccountToDebit = [];
    function setFxAccountToDebit(data)
    {
      fxAccountToDebit = data;
    }
    function getFxAccountToDebit()
    {
      return fxAccountToDebit;
    }

    var Contacts = {}
    function setContacts(data) {
        Contacts = data;
    }
    function getContacts() {
        return Contacts;
    }

    var RequestType = {}
    function setRequestTypes(data) {
        RequestType = data;
    }
    function getRequestTypes() {
        return RequestType;
    }

    function wait (show) {
    if (show)
    document.getElementById("loader").className = "loader";
    else
    document.getElementById("loader").className = "hide";
    }


        return {
          setResponse: setResponse,
          getResponse: getResponse,
          setAccountInfo:setAccountInfo,
          getAccountInfo:getAccountInfo,
          setData:setData,
          getData:getData,
          setAccountToDebit: setAccountToDebit,
          getAccountToDebit: getAccountToDebit,
          setAccountToCredit: setAccountToCredit,
          getAccountToCredit: getAccountToCredit,
          setThirdPartyAccountToDebit: setThirdPartyAccountToDebit,
          getThirdPartyAccountToDebit: getThirdPartyAccountToDebit,
          setFxAccountToDebit: setFxAccountToDebit,
          getFxAccountToDebit: getFxAccountToDebit,
          getRequestTypes:getRequestTypes,
          setRequestTypes:setRequestTypes,
          setTransferData:setTransferData,
          getTransferData:getTransferData,
          setInfo:setInfo,
          getInfo:getInfo,
          getBranches:getBranches,
          setBranches:setBranches,
          setForms:setForms,
          getForms:getForms,
          setCategory:setCategory,
          getCategory:getCategory,
          setFinalForm:setFinalForm,
          getFinalForm:getFinalForm,
          setSourceAccount:setSourceAccount,
          getSourceAccount:getSourceAccount,
          setUserId:setUserId,
          getUserId:getUserId,
          setBeneficiary:setBeneficiary,
          getBeneficiary:getBeneficiary,
          setActiveBeneficiary:setActiveBeneficiary,
          getActiveBeneficiary:getActiveBeneficiary,
          wait:wait,
          setMobileNumber:setMobileNumber,
          getMobileNumber:getMobileNumber,
          getEmail:getEmail,
          setEmail:setEmail,
          setNewAccountNumber:setNewAccountNumber,
          getNewAccountNumber:getNewAccountNumber,
          setUuid:setUuid,
          getUuid:getUuid,
          setUseToken: setUseToken,
          getUseToken: getUseToken,
          setBvn:setBvn,
          getBvn:getBvn,
          setResCode:setResCode,
          getResCode:getResCode,
          getDevice:getDevice,
          setDevice:setDevice,
          getHistoryDetail:getHistoryDetail,
          setHistoryDetail:setHistoryDetail,
          getContacts:getContacts,
          setContacts:setContacts,
          getCategories: function () {
            return [
                {
                    "ID": 1,
                    "NAME": "Mobile Top-Up"
                }
            ];
          },
          getImages: function () {
            return [
              { "id":1,
                "url":"assets/temp/temp_01.jpg"
              },
              { "id":2,
                "url":"assets/temp/temp_02.jpg"
              },
              { "id":3,
                "url":"assets/temp/temp_03.jpg"
              }
            ];
          },
          getFeedbackErrorType: function () {
              return [
                  {
                      "id": 1,
                      "name": "Mobile Money"
                  },
                  {
                      "id": 2,
                      "name": "Bills Payment on Internet Banking"
                  },
                  {
                      "id": 3,
                      "name": "USSD Transactions"
                  },
                  {
                      "id": 4,
                      "name": "Mobile Banking Transactions"
                  },
                  {
                      "id": 5,
                      "name": "FX Transfer"
                  },
                  {
                      "id": 6,
                      "name": "Card Related Issue"
                  },
                  {
                      "id": 7,
                      "name": "ATM Dispense Error"
                  },
                  {
                      "id": 8,
                      "name": "Quickteller Dispense Error"
                  },
                  {
                      "id": 9,
                      "name": "ATM Bills Payment/Airtime Dispense Error"
                  },
                  {
                      "id": 10,
                      "name": "POS Dispense Error"
                  },
                  {
                      "id": 11,
                      "name": "Web Dispense Error"
                  },
                  {
                      "id": 12,
                      "name": "General Issues"
                  },
                  {
                      "id": 13,
                      "name": "Enquiries"
                  }];
          },
          getMobileBankingQuestionAndAnswer: function () {
              return [
                  {
                      'id': 1,
                      'q': 'What do I need to get started?',
                      'a': ['To access the GTBank Mobile App:', 'a) Download the application from these app stores – Apple App store and Android’s Google Play.', 'b) You must acquire login details (User ID and Password) which are the same as those used to access your profile on Internet Banking. The login details are sent via email at the time of opening an account to the email address profiled on the account. Please note that your login detail is usually sent via tzintops@gtbank.com and could either be delivered to your inbox or your bulk folder. You are therefore advised to check your bulk mail carefully before deleting unsolicited emails.', 'c) If you do not already have these login details, please visit the Customer Service Desk of any GTBank branch to make a request.']
                  }, {
                      'id': 2,
                      'q': 'Will I have 24/7 access to the GTBank Mobile Banking Services?',
                      'a': ['Except during scheduled maintenance periods, our mobile banking services can be accessed 24 hours a day, 7 days a week from anywhere in the world.']
                  }, {
                      'id': 3,
                      'q': 'What accounts can I access online?',
                      'a': ['Your accounts may include: Current, Savings, Domiciliary.']
                  }, {
                      'id': 4,
                      'q': 'What types of transactions can I conduct on the Mobile Banking Platform?',
                      'a': ['a) Account activities', ' - Account balance', ' - Transaction history', 'b) Transfer funds', ' - to own account', ' - other GTBank accounts', ' - to third party bank accounts']
                  }, {
                      'id': 5,
                      'q': 'I have forgotten my password what should I do?',
                      'a': ['If you have forgotten your password you can call our customer care on +2552227722533.', 'Alternatively, you can use the Forgot Password module on the login screen and your password will be re-set and a new one sent to your registered email address. You are advised to safeguard your login details to prevent unauthorized access to your account.']
                  }, {
                      'id': 6,
                      'q': 'How can I change my Mobile Banking password?',
                      'a': ['To change your default password to one that you can easily remember you will need to:', 'a) Sign in to your account, from the Home Screen select the settings button on the left-hand corner of the screen.', 'b) In the new page, select "Change Password"', 'd) Enter appropriate information in the required fields and click "Save"', 'e) A confirmation page will then indicate whether the change was successful.', 'Should you require further assistance, please call our customer care on +2552227722533.']
                  }, {
                      'id': 7,
                      'q': 'How often can I change my password?',
                      'a': ['We recommend that you change your password periodically to prevent unauthorized access to your account.']
                  }, {
                      'id': 8,
                      'q': 'How often can I transfer funds?',
                      'a': ['Funds transfer can be affected 24 hours a day, seven days a week from your mobile phone. The daily maximum transfer limit is set at TZS 2,500,000.00 (Two Million Five Hundred Thousand Tanzania only) per Customer.']
                  }, {
                      'id': 9,
                      'q': 'How can I change my Mobile Banking security question?',
                      'a': ['To change your security question:', 'a) Sign in to your account, from the Home Screen select the menu button on the left-hand  corner of the screen.', 'b) Select "My Profile"', 'c) In the new page, select "Security question"', 'd) Enter new secret question and answer and click "Save"', 'e) A confirmation page will indicate whether the change was successful.']
                  }, {
                      'id': 10,
                      'q': 'How long does it take for the beneficiary to receive the funds?',
                      'a': ['Own account transfer as well as transfers to other GTBank account holders can be accessed within minutes following a successful operation. However, Interbank funds transfers are affected within 24 hours using EFT.']
                  }, {
                      'id': 11,
                      'q': 'How does the Token work?',
                      'a': ['The Security Token works by generating a new 6-digit code every 30 seconds, from millions of possible combinations.']
                  }, {
                      'id': 12,
                      'q': 'When do I need to use the Token device?',
                      'a': ['To transfer money outside of your account to another GTBank account or to other bank account.']
                  }, {
                      'id': 13,
                      'q': 'In what scenarios other than third party transfers do I need to use the Token?',
                      'a': ['When completing transactions using Mobile Banking, instructions on the screen may prompt you to input the digits generate by the token e.g. for generating secure codes, FX transfers, adding self service, FX Sales etc.']
                  }, {
                      'id': 14,
                      'q': 'How long is the Token device valid for?',
                      'a': ['The token device is valid for 7 years.']
                  }, {
                      'id': 15,
                      'q': 'Do I still require codes sent via e-mails for any transaction?',
                      'a': ['You no longer require codes sent through SMS or via e-mail once you have a token.']
                  }, {
                      'id': 16,
                      'q': 'What is the limit of funds that can be transferred using the Token?',
                      'a': ['The daily limit is set at TZS 1 million on mobile banking.']
                  }, {
                      'id': 17,
                      'q': 'Can the Token work outside Tanzania?',
                      'a': ['Yes, the token works anywhere in the world.']
                  }, {
                      'id': 18,
                      'q': 'Can the Token be linked to all my different accounts with the bank?',
                      'a': ['Yes, one token can be linked to all your different accounts in the bank.']
                  }, {
                      'id': 19,
                      'q': 'How long does it take to get a Token?',
                      'a': ['The Security Token is available at all branches of GTBank, and would be immediately profiled and issued to the customer upon request.']
                  }, {
                      'id': 20,
                      'q': 'How long does it take to get another Token after a loss or misplacement?',
                      'a': ['Another token can be gotten immediately at any GTBank branch if your token gets lost or misplaced at a charge of TZS 3,000.']
                  }, {
                      'id': 21,
                      'q': 'Why do I sometimes get an invalid transaction code response on mobile banking after inserting the code generated by the Token?',
                      'a': ['When you get this error, kindly log out and ensure you generate a fresh set of transaction codes before inputting it on the system. If the problem persists, visit any branch of GTBank and get a replacement token free of charge.']
                  }, {
                      'id': 22,
                      'q': 'Can another person use my Token on his/her own account?',
                      'a': ['Each token is tied to your account only and cannot work on another account, because the code is constantly changing and is unique to your token, no-one but you will have the code needed to access your accounts.']
                  }, 
              ];
          }

        }

    });


    starter.factory('DataFactory', function () {



        var Feeds = {}

        function setFeeds(data) {
            Feeds = data;
        }

        function getFeeds() {
            return Feeds;
        }

        var Message = {}

        function setMessage(data) {
            Message = data;
        }

        function getMessage() {
            return Message;
        }

        var Response = {}

        function setResponse(data) {
            Response = data;
        }

        function getResponse() {
            return Response;
        }

        var Count = 10;

        function setNext(data) {
            Count = data;
        }

        function getNext() {
            return Count;
        }

        var Query = '';

        function setQuery(data) {
            Query = data;
        }

        function getQuery() {
            return Query;
        }

        function getObjectFromArray(oid,nameofKey,obj)
        {
            var found = 0;
            var Obj = {};


                angular.forEach(obj,function(value,key){
                    if (found == 0) {
                    if(nameofKey in value) {
                            if (value[nameofKey] == oid) {
                                Obj = value;
                                found = 1;
                            }
                        }
                    }

                });

            return Obj;
        }


        return {
            setFeeds: setFeeds,
            getFeeds: getFeeds,
            getMessage: getMessage,
            setMessage: setMessage,
            getResponse: getResponse,
            setResponse: setResponse,
            getNext: getNext,
            setNext: setNext,
            getQuery: getQuery,
            setQuery: setQuery,
            getObjectFromArray:getObjectFromArray
        }
    })


        starter.factory('LocationBased', function ($ionicLoading, $http, $q) {

            var PageData = {}

            function setPageData(data) {
                PageData = data;
            }

            function getPageData() {
                return PageData;
            }

            var SearchAddress = {}

            function setSearchAddress(data) {
                SearchAddress = data;
            }

            function getSearchAddress() {
                return SearchAddress;
            }

            var TrafficSearchAddress = {}

            function setTrafficSearchAddress(data) {
                TrafficSearchAddress = data;
            }

            function getTrafficSearchAddress() {
                return TrafficSearchAddress;
            }

            var SearchResults = {}

            function setSearchResults(data) {
                SearchResults = data;
            }

            function getSearchResults() {
                return SearchResults;
            }

            var ResourceType = {}

            function setResourceType(data) {
                ResourceType = data;
            }

            function getResourceType() {
                return ResourceType;
            }

            var SearchRange = {}

            function setSearchRange(data) {
                SearchRange = data;
            }

            function getSearchRange() {
                return SearchRange;
            }

            var AdvSearchResults = {}

            function setAdvSearchResults(data) {
                AdvSearchResults = data;
            }

            function getAdvSearchResults() {
                return AdvSearchResults;
            }

            var Resources = {}

            function setResources(data) {
                Resources = data;
            }

            function getResources() {
                return Resources;
            }

            var TravelMode = {}

            function setTravelMode(data) {
                TravelMode = data;
            }

            function getTravelMode() {
                return TravelMode;
            }

            return {
                setPageData: setPageData,
                getPageData: getPageData,
                getSearchAddress: getSearchAddress,
                setSearchAddress: setSearchAddress,
                setSearchResults: setSearchResults,
                getSearchResults: getSearchResults,
                setAdvSearchResults: setAdvSearchResults,
                getAdvSearchResults: getAdvSearchResults,
                getResources: getResources,
                setResources: setResources,
                getTravelMode: getTravelMode,
                setTravelMode: setTravelMode,
                getSearchRange: getSearchRange,
                setSearchRange: setSearchRange,
                getResourceType: getResourceType,
                setResourceType: setResourceType,
                setTrafficSearchAddress: setTrafficSearchAddress,
                getTrafficSearchAddress: getTrafficSearchAddress
            }
        });
