var starter = angular.module('starter')

    starter.factory('GapsliteBanking', function () {
      users = {
          devicetoken: null,
          uuid: null,
          manufacturer: null,
          platform: null,
          model: null
      }

      function setUser(data) {
          users = data;
      }

      function getUser() {
          return users;
      }
        var AccountsInfo = {}

        function setAccountsInfo(data) {
            AccountsInfo = data;
        }

        function getAccountsInfo() {
            return AccountsInfo;
        }
        var Name = {}

        function setName(data) {
            Name = data;
        }

        function getName() {
            return Name;
        }
        var ResponseData = {}

        function setResponse(data) {
            ResponseData = data;
        }

        function getResponse() {
            return ResponseData;
        }

        var UserId = '';

        function setUserId(data) {
            UserId = data;
        }

        function getUserId() {
            return UserId;
        }

        var Username = '';

        function setUsername(data) {
            Username = data;
        }

        function getUsername (){
            return Username;
        }

        var Uuid = '';

        function setUuid(data) {
            Uuid = data;
        }

        function getUuid() {
            return Uuid;
        }
        var SaveData = {}
        function setData(data) {
            SaveData = data;
        }

        function getData() {
            return SaveData;
        }

        var Beneficiary = [];

        function setBeneficiary(data) {
            Beneficiary = data;
        }

        function getBeneficiary() {
            return Beneficiary;
        }

        function wait (show) {
        if (show)
        document.getElementById("loader").className = "loader";
        else
        document.getElementById("loader").className = "hide";
        };
        return {
            setResponse: setResponse,
            getResponse: getResponse,
            getAccountsInfo: getAccountsInfo,
            setAccountsInfo: setAccountsInfo,
            getUserId: getUserId,
            setUserId: setUserId,
            setUsername:setUsername,
            getUsername:getUsername,
            setUuid:setUuid,
            getUuid:getUuid,
            setName:setName,
            getName:getName,
            wait:wait,
            setBeneficiary:setBeneficiary,
            getBeneficiary:getBeneficiary,
            setUser: setUser,
            getUser: getUser,
            setData:setData,
            getData:getData,
            getFeedbackErrorType: function () {
                return [
                    {
                        "id": 0,
                        "name": "Select Error Type"
                    },
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
                        'a': ['To access the GTBank Mobile App:', 'a) Download the application from these app stores – Apple App store, BlackBerry App World, and Android’s Google Play.', 'b) You must acquire login details (User ID and Password) which are the same as those used to access your profile on Internet Banking. The login details are sent via email at the time of opening an account to the email address profiled on the account. Please note that your login detail is usually sent via intops@gtbank.com and could either be delivered to your inbox or your bulk folder. You are therefore advised to check your bulk mail carefully before deleting unsolicited emails.', 'c) If you do not already have these login details, please visit the Customer Service Desk of any GTBank branch to make a request.']
                    }, {
                        'id': 2,
                        'q': 'Will I have 24/7 access to the GTBank Mobile Banking Services?',
                        'a': ['Except during scheduled maintenance periods, our mobile banking services can be accessed 24 hours a day, 7 days a week from anywhere in the world.']
                    }, {
                        'id': 3,
                        'q': 'What accounts can I access online?',
                        'a': ['Your accounts may include: Current, Savings, Domiciliary, Target, Visa Dollar Card accounts etc.']
                    }, {
                        'id': 4,
                        'q': 'What types of transactions can I conduct on the Mobile Banking Platform?',
                        'a': ['a) Account activities', ' - Account balance', ' - Transaction history', 'b) Transfer funds', ' - to own account', ' - other GTBank accounts', ' - to third party bank accounts', 'c) Cheques', ' - Confirm Cheque', ' - Stop Cheque', 'd) Bill Payments']
                    }, {
                        'id': 5,
                        'q': 'I have forgotten my password what should I do?',
                        'a': ['If you have forgotten your password you can call our contact center (GTConnect) on 0700 GTCONNECT (0700 482666328), 234-1-4480000, 08029002900 or 08039003900.', 'Alternatively, you can visit our Internet Banking page via www.gtbank.com and follow below steps:', 'a) Enter your user ID and select the "Forgot your password" link.', 'b) You will be directed to the password reminder page.', 'c) Enter the answer to your secret question and select the ‘continue button’.', 'd) For security reasons you are advised to safeguard your.', 'If you have been locked out following 3 unsuccessful logon attempts, you will be required to call contact center (GTConnect) on 0700 GTCONNECT (0700 482666328), 234-1-4480000, 08029002900 or 08039003900 and select 2 & 0 to speak to an Agent.', 'Following authentication, your password will be re-set and a new one sent to your registered email address. You are advised to safeguard your login details to prevent unauthorized access to your account.']
                    }, {
                        'id': 6,
                        'q': 'How can I change my Mobile Banking password?',
                        'a': ['To change your default password to one that you can easily remember you will need to:', 'a) Sign in to your account, from the Home Screen select the menu button on the left-hand  corner of the screen.', 'b) Select "My Profile"', 'c) In the new page, select "Change Password"', 'd) Enter appropriate information in the required field s and click "Save"', 'e) A confirmation page will then indicate whether the change was successful.', 'Should you require further assistance, please call our Contact Centre (GTConnect) on 0700 GTCONNECT (0700 482666328), 234-1-4480000, 08029002900 or 08039003900 and follow the voice prompts or press 2 and 0 to speak to an Agent.']
                    }, {
                        'id': 7,
                        'q': 'How often can I change my password?',
                        'a': ['We recommend that you change your password periodically to prevent unauthorized access to your account.']
                    }, {
                        'id': 8,
                        'q': 'How often can I transfer funds?',
                        'a': ['Funds transfer can be affected 24 hours a day, seven days a week from your mobile phone. The daily maximum transfer limit is set at NGN 2,500,000.00 (Two Million Five Hundred Thousand naira only) per Customer.']
                    }, {
                        'id': 9,
                        'q': 'How can I change my Mobile Banking security question?',
                        'a': ['To change your security question:', 'a) Sign in to your account, from the Home Screen select the menu button on the left-hand  corner of the screen.', 'b) Select "My Profile"', 'c) In the new page, select "Security question"', 'd) Enter new secret question and answer and click "Save"', 'e) A confirmation page will indicate whether the change was successful.']
                    }, {
                        'id': 10,
                        'q': 'How long does it take for the beneficiary to receive the funds?',
                        'a': ['Own account transfer as well as transfers to other GTBank account holders can be accessed within minutes following a successful operation. However, Interbank funds transfers are affected within 24 hours using NEFT and instantly using NIPS.']
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
                        'a': ['When completing transactions using Mobile Banking, instructions on the screen may prompt you to input the digits generate by the token e.g. for generating secure codes, FX transfers, Cash/Draft In transit, adding self service, FX Sales etc.']
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
                        'a': ['The daily limit is set at N5million on mobile banking.']
                    }, {
                        'id': 17,
                        'q': 'Can the Token work outside Nigeria?',
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
                        'a': ['Another token can be gotten immediately at any GTBank branch if your token gets lost or misplaced at a charge of N3,000.']
                    }, {
                        'id': 21,
                        'q': 'Why do I sometimes get an invalid transaction code response on mobile banking after inserting the code generated by the Token?',
                        'a': ['When you get this error, kindly log out and ensure you generate a fresh set of transaction codes before inputting it on the system. If the problem persists, visit any branch of GTBank and get a replacement token free of charge.']
                    }, {
                        'id': 21,
                        'q': 'Can another person use my Token on his/her own account?',
                        'a': ['Each token is tied to your account only and cannot work on another account, because the code is constantly changing and is unique to your token, no-one but you will have the code needed to access your accounts.']
                    }, {
                        'id': 22,
                        'q': 'What are the maintenance requirements for my Token device?',
                        'a': ['You are to store your token in a cool, dry place when not in use. The token is not to be left hanging as a key holder as this can spoil the token.']
                    }, {
                        'id': 23,
                        'q': 'Does the Token use a battery that needs to be replaced?',
                        'a': ['The token uses a battery and the average life span of the battery is 7 years.']
                    }, {
                        'id': 24,
                        'q': 'Do I need to install anything on my phone to use the Security Token?',
                        'a': ['No. The Security Token can be used with any phone and no special software is required.']
                    }
                ]
            }
        }
    });
