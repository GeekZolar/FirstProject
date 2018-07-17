// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var gtw = angular.module('starter')

gtw.config(['$stateProvider','$urlRouterProvider','$sceDelegateProvider',function($stateProvider, $urlRouterProvider,$sceDelegateProvider) {
  $stateProvider
  .state('login', {
      url: '/login',
      views: {
          'root': {
            templateUrl: 'login.html',
            controller: 'LoginCtrl',
            cache:false
          }
      }
  })
  .state('history', {
      url: '/history/:historyIndex',
      views: {
          'root': {
            templateUrl: 'history.html',
            controller: 'historyCtrl'
          }
      }
  })
  .state('historyDetail', {
      url: '/historyDetail/:acctId',
      views: {
          'root': {
            templateUrl: 'history_detail.html',
            controller: 'historyDetailCtrl',
            cache:false
          }
      }
  })
  .state('forgot-password', {
      url: '/forgot-password',
      views: {
          'root': {
            templateUrl: 'forgot_password.html',
            controller: 'ForgotPasswordCtrl',
            cache:false
          }
      }
  })
  .state('change-password', {
      url: '/change-password',
      views: {
          'root': {
            templateUrl: 'reset_password.html',
            controller: 'ForgotPasswordCtrl',
            cache:false
          }
      }
  })
  .state('change-password-inapp', {
      url: '/change-password-inapp',
      views: {
          'root': {
            templateUrl: 'reset_password_inapp.html',
            controller: 'ForgotPasswordCtrl',
            cache:false
          }
      }
  })
  .state('register-options', {
      url: '/register-options',
      views: {
          'root': {
            templateUrl: 'register_options.html',
            //cache:false
            //controller: 'registerCtrl'
          }
      }
  })
  .state('link-account', {
      url: '/link-account',
      views: {
          'root': {
            templateUrl: 'link_account.html',
            controller: 'AccountCtrl',
            cache:false
          }
      }
  })
  .state('register-email', {
      url: '/register-email',
      views: {
          'root': {
            templateUrl: 'register_email.html',
            controller: 'confirmEmailCtrl',
            cache:false

          }
      }
  })
  .state('link-gtbank-card', {
      url: '/link-gtbankcard',
      views: {
          'root': {
            templateUrl: 'link_gtbank_card.html',
            controller: 'LinkGTBankCardCtrl',
            cache:false

          }
      }
  })
  .state('dashboard', {
      url: '/dashboard',
      views: {
          'root': {
            templateUrl: 'dashboard.html',
            controller: 'dashboardCtrl',
            cache: false,
          }
      }
  })
  .state('register-bio', {
      url: '/register-bio',
      views: {
          'root': {
            templateUrl: 'register_bio.html',
            controller: 'registerCtrl',
            cache:false
          }
      }
  })
  .state('register-card', {
      url: '/register-card',
      views: {
          'root': {
            templateUrl: 'register_card.html',
            controller: 'linkCardCtrl',
            cache:false
          }
      }
  })
  .state('register-instant', {
      url: '/register-instant',
      views: {
          'root': {
            templateUrl: 'instant_account.html',
            controller: 'openAccountCtrl',
            cache:false
          }
      }
  })
  .state('register-instant-opened', {
      url: '/register-instant-opened',
      views: {
          'root': {
            templateUrl: 'instant_account_opened.html',
            controller: 'openAccountCtrl',
            cache:false
          }
      }
  })
  .state('transfer', {
      url: '/transfer',
      views: {
          'root': {
            templateUrl: 'transfer.html',
            controller: 'transferCtrl',
            cache:false
          }
      }
  })

  .state('spinlet', {
      url: '/spinlet',
      views: {
          'root': {
            templateUrl: 'spinlet.html',
            controller: 'spinletCtrl',
            cache:false
          }
      }
  })

  .state('ndani', {
      url: '/ndani',
      views: {
          'root': {
            templateUrl: 'ndani.html',
            controller: 'NdaniTvCtrl'
          }
      }
  })
  .state('ndani-play-video', {
      url: '/ndani-play-video',
      views: {
          'root': {
            templateUrl: 'ndani-play-video.html',
            controller: 'NdaniTvCtrl',
            cache: false
          }
      }
  })


  .state('gtCollection', {
      url: '/gtcollection',
      views: {
          'root': {
            templateUrl: 'gt_collection.html',
            controller: 'GTCollCtrl',
            cache:false
          }
      }
  })
  .state('airtime', {
      url: '/airtime',
      views: {
          'root': {
            templateUrl: 'airtime.html',
            controller: 'AirtimeCtrl',
            cache:false
          }
      }
  })
  .state('cabletv', {
      url: '/cabletv',
      views: {
          'root': {
            templateUrl: 'cable_tv.html',
            controller: 'CabletvCtrl',
            cache:false
          }
      }
  })

  .state('otp', {
      url: '/otp',
      views: {
          'root': {
            templateUrl: 'require-otp.html',
            controller: 'otpCtrl',
            cache:false
          }
      }
  })

  .state('register-complete', {
      url: '/register-complete',
      views: {
          'root': {
            templateUrl: 'register_complete.html',
            controller: 'RegisterCompleteCtrl',
            cache:false
          }
      }
  })

  .state('faq', {
      url: '/faq',
      views: {
          'root': {
            templateUrl: 'faq.html',
            controller: 'dashboardCtrl',
            //cache:false
          }
      }
  })

  .state('confirm-token', {
      url: '/confirm-token',
      views: {
          'root': {
            templateUrl: 'confirm_token.html',
            controller: 'dashboardCtrl',
            cache:false
          }
      }
  })

  .state('indemnity', {
      url: '/indemnity/:useToken/:fromDashboard',
      views: {
          'root': {
            templateUrl: 'indemnity.html',
            controller: 'SwitchDeviceCtrl',
          }
      }
  })

  .state('switch-device', {
      url: '/switch-device/:useToken',
      views: {
          'root': {
            templateUrl: 'switch_device.html',
            controller: 'SwitchDeviceCtrl',
            cache: false
          }
      }
  })

  .state('switch-token', {
      url: '/switch-token/:useToken',
      views: {
          'root': {
            templateUrl: 'switch_to_token.html',
            controller: 'SwitchDeviceCtrl',
            cache: false
          }
      }
  })

  .state('change-pin', {
      url: '/change-pin',
      views: {
          'root': {
            templateUrl: 'change_pin.html',
            controller: 'ForgotPasswordCtrl',
            cache: false
          }
      }
  })

  .state('terms-declined', {
      url: '/terms-declined',
      views: {
          'root': {
            templateUrl: 'terms_declined.html',
            controller: 'SwitchDeviceCtrl',
          }
      }
  })

  .state('device-authorization', {
      url: '/device-authorization',
      views: {
          'root': {
            templateUrl: 'device_authorization.html',
            controller: 'LoginCtrl',
          }
      }
  })

    .state('bills', {
        url: '/bills',
        views: {
            'root': {
              templateUrl: 'bills_menu.html',
              cache:false
            }
        }
    })
    .state('gtCollection1', {
        url: '/gtcollectionstep1',
        views: {
            'root': {
              templateUrl: 'gt_collection1.html',
              controller: 'GTCollCtrl_1',
              cache:false
            }
        }
    })
    .state('gtCollection2', {
        url: '/gtcollectionstep2',
        views: {
            'root': {
              templateUrl: 'gt_collection2.html',
              controller: 'GTCollCtrl_2',
              cache:false
            }
        }
    })
    .state('gtCollection3', {
        url: '/gtcollectionstep2',
        views: {
            'root': {
              templateUrl: 'gt_collection3.html',
              controller: 'GTCollCtrl_3',
              cache:false
            }
        }
    })

    .state('internet', {
        url: '/internet',
        views: {
            'root': {
              templateUrl: 'internet_service.html',
              controller: 'internetServiceCtrl',
              cache:false
            }
        }
    })
    .state('visa', {
        url: '/visastep1',
        views: {
            'root': {
              templateUrl: 'visa1.html',
              controller: 'visa1_Ctrl',
              cache:false
            }
        }
    })
    .state('visastep2', {
        url: '/visastep2',
        views: {
            'root': {
              templateUrl: 'visa2.html',
              controller: 'visa2_Ctrl',
              cache:false
            }
        }
    })
    .state('visastep3', {
        url: '/visastep3',
        views: {
            'root': {
              templateUrl: 'visa3.html',
              controller: 'visa3_Ctrl',
              cache:false
            }
        }
    })
    .state('westernUnion', {
        url: '/westernunionstep1',
        views: {
            'root': {
              templateUrl: 'western_union1.html',
              controller: 'westernUnion1Ctrl',
              cache:false
            }
        }
    })
    .state('westernUnion2', {
        url: '/westernunionstep2',
        views: {
            'root': {
              templateUrl: 'western_union2.html',
              controller: 'westernUnion2Ctrl',
              cache:false
            }
        }
    })
    .state('utility_tanzania', {
        url: '/utility_tanzania',
        views: {
            'root': {
              templateUrl: 'utility_tanzania.html',
              controller: 'utilitytzCtrl',
              cache:false
            }
        }
    })
    .state('tax', {
        url: '/tax',
        views: {
            'root': {
              templateUrl: 'tax.html',
              controller: 'taxCtrl',
              cache:false
            }
        }
    })
    .state('church', {
        url: '/churchstep1',
        views: {
            'root': {
              templateUrl: 'church_payment1.html',
              controller: 'churchPayments1Ctrl',
              cache:false
            }
        }
    })
    .state('church2', {
        url: '/churchstep2',
        views: {
            'root': {
              templateUrl: 'church_payment2.html',
              controller: 'churchPayments2Ctrl',
              cache:false
            }
        }
    })
    .state('church3', {
        url: '/churchstep3',
        views: {
            'root': {
              templateUrl: 'church_payment3.html',
              controller: 'churchPayments3Ctrl',
              cache:false
            }
        }
    })
    .state('airline', {
        url: '/airlineStepOne',
        views: {
            'root': {
              templateUrl: 'airline1.html',
              controller: 'airlineOneCtrl',
              cache:false
            }
        }
    })
    .state('airlineTwo', {
        url: '/airlineStepTwo',
        views: {
            'root': {
              templateUrl: 'airline2.html',
              controller: 'airlineTwoCtrl',
              cache:false
            }
        }
    })
    .state('airlineThree', {
        url: '/airlineStepThree',
        views: {
            'root': {
              templateUrl: 'airline3.html',
              controller: 'airlineThreeCtrl',
              cache:false
            }
        }
    })
    .state('successful', {
        url: '/successful',
        views: {
            'root': {
              templateUrl: 'transaction_complete.html',
              cache:false
            }
        }
    })

    .state('customer-service', {
      url: '/customer-service',
      views: {
          'root': {
            templateUrl: 'customer_service.html',
            controller: 'dashboardCtrl'
          }
      }
  })

  .state('cards', {
    url: '/cards',
    views: {
        'root': {
          templateUrl: 'cards.html',
          controller: 'cardsCtrl'
        }
    }
  })
  .state('gtlocate', {
    url: '/gtlocate',
    views: {
        'root': {
          templateUrl: 'gtlocate.html',
          controller: 'GtLocateCtrl'
        }
    }
  })

  .state('card-replacement', {
    url: '/card-replacement',
    views: {
        'root': {
          templateUrl: 'card_replacement.html',
          controller: 'cardsCtrl',
          cache:false

        }
    }
  })

  .state('card-hotlist', {
    url: '/card-hotlist',
    views: {
        'root': {
          templateUrl: 'card_hotlist.html',
          controller: 'cardsCtrl',
          cache:false

        }
    }
  })
  .state('irequire', {
          url: '/irequire',
          views: {
              'root': {
                templateUrl: 'irequire.html',
                controller: 'IrequireCtrl',
                cache:false
              }
          }
      })
  .state('gttraffic', {
          url: '/gttraffic',
          views: {
              'root': {
                templateUrl: 'gttraffic.html',
                controller: 'TrafficCtrl',
                cache:false
              }
          }
      })
      .state('billshistory', {
              url: '/billshistory',
              views: {
                  'root': {
                    templateUrl: 'bills_history.html',
                    controller: 'billsHistoryCtrl',
                    cache:false
                  }
              }
          })
          .state('otherQuickTeller', {
                  url: '/otherQuickTeller',
                  views: {
                      'root': {
                        templateUrl: 'other_quickteller.html',
                        controller: 'otherQuicktellerCtrl',
                        cache:false
                      }
                  }
              })

          .state('feedback', {
                  url: '/feedback',
                  views: {
                      'root': {
                        templateUrl: 'feedback.html',
                        controller: 'dashboardCtrl'
                      }
                  }
              })
              .state('confirm-delete', {
                      url: '/confirm-delete/:transType',
                      views: {
                          'root': {
                            templateUrl: 'delete_beneficiary.html',
                            controller: 'dashboardCtrl'
                          }
                      }
                  })

                  .state('statement-request', {
                          url: '/statement-request',
                          views: {
                              'root': {
                                templateUrl: 'statement_request.html',
                                controller: 'statementCtrl',
                                cache:false

                              }
                          }
                      })

                  .state('requests', {
                          url: '/requests',
                          views: {
                              'root': {
                                templateUrl: 'requests.html',
                                controller: 'IrequireCtrl',
                                cache:false

                              }
                          }
                      })

    .state('savings', {
          url: '/savings',
          views: {
              'root': {
                templateUrl: 'savings.html',
                controller: 'createGtTargetCtrl',
                cache:false

              }
          }
      })
      .state('createTarget', {
            url: '/createTarget',
            views: {
                'root': {
                  templateUrl: 'create_target.html',
                  controller: 'createGtTargetCtrl',
                  cache:false

                }
            }
        })
        .state('liquidateTarget', {
              url: '/liquidateTarget',
              views: {
                  'root': {
                    templateUrl: 'liquidate_target.html',
                    controller: 'liquidateGtTargetCtrl',
                    cache:false

                  }
              }
          })
          .state('interest-settings', {
              url: '/interest-settings',
              views: {
                  'root': {
                    templateUrl: 'interest-settings.html',
                     controller: 'DaashboardCtrl',
                    cache:false
                  }
              }
          })
          .state('socials', {
              url: '/socials',
              views: {
                  'root': {
                    templateUrl: 'socials.html',
                    controller: 'DaashboardCtrl',
                    cache:false
                  }
              }
          })
                      .state('reportMenu', {
                              url: '/reportMenu',
                              views: {
                                  'root': {
                                    templateUrl: 'ireport_home.html'
                                  }
                              }
                          })

                         .state('ireportAddmedia', {
                              url: '/ireportAddmedia',
                              views: {
                                  'root': {
                                    templateUrl: 'ireport_addmedia.html',
                                    controller: 'AddMediaCtrl',
                                    cache:false
                                  }
                              }
                          })
                          .state('ireportSuccess', {
                               url: '/ireportSuccess',
                               views: {
                                   'root': {
                                     templateUrl: 'ireport_success.html',
                                     controller: 'IReportSuccessCtrl',
                                     cache:false
                                   }
                               }
                           })
                          .state('ireportPastreport', {
                               url: '/ireportPastreport',
                               views: {
                                   'root': {
                                     templateUrl: 'ireport_pastreport.html',
                                     controller: 'IReportCtrl',
                                     cache:false
                                   }
                               }
                           })
                           .state('ireportPastreportdetail', {
                                url: '/ireportPastreport/:rId',
                                views: {
                                    'root': {
                                      templateUrl: 'ireport_pastreport_detail.html',
                                      controller: 'IReportCtrl',
                                      cache:false
                                    }
                                }
                            })
                            .state('search-directions', {
                                  url: '/search-directions/:searchResultId/:objIndex',
                                  views: {
                                    'root': {
                                     templateUrl: 'directions.html',
                                     controller: 'searchDirectionCtrl'
                                    }
                                  }
                              })
                              .state('loans', {
                                    url: '/loans',
                                    views: {
                                      'root': {
                                       templateUrl: 'loans.html',
                                       controller: 'loansCtrl'
                                      }
                                    }
                                })
                              .state('salary-advance', {
                                    url: '/loans/salaryAdvance',
                                    views: {
                                      'root': {
                                       templateUrl: 'salary_advance.html',
                                       controller: 'salaryAdvanceCtrl',
                                       cache:false

                                      }
                                    }
                                })
                                .state('notifications', {
                                    url: '/notifications',
                                    views: {
                                        'root': {
                                            templateUrl: 'notifications.html',
                                            controller: 'NotificationsCtrl'
                                        }
                                    }
                                })

                                // GAPS STATES

                                .state('accounts', {
                                      url: '/accounts',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/accounts/accounts.html',
                                              controller: 'HomeCtrl'
                                          }
                                      }
                                  })
                                  .state('history-details', {
                                      url: '/history-details',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/accounts/history.html',
                                              controller: 'HistoryDetailsCtrl'
                                          }
                                      }
                                  })
                                  .state('transfers', {
                                      url: '/transfers',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/transfers/transfers.html',
                                              controller: 'TransfrCtrl',
                                              cache:false
                                          }
                                      }
                                  })
                                 .state('airtime-and-payments', {
                                      url: '/airtime-and-payments',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/bills/airtime-and-payments.html',
                                              controller:'AirtimeGapsCtrl'
                                          }
                                      }
                                  })
                                  .state('settings-and-help', {
                                      url: '/settings-and-help',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/settings-help/settings-and-help.html',
                                              controller: 'SettingsAndHelpCtrl'
                                          }
                                      }
                                  })
                                  .state('lifestyle', {
                                      url: '/lifestyle',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/lifestyle/lifestyle.html',
                                              controller: 'LifestyleCtrl'
                                          }
                                      }
                                  })

                                  .state('notificationsGaps', {
                                      url: '/notificationsGaps',
                                      views: {
                                          'root': {
                                              templateUrl: 'views/notification/notifications.html',
                                              controller: 'NotificationsCtrl'
                                          }
                                      }
                                  })
                                  .state('successfulGaps', {
                                      url: '/successfulGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/transfers/transaction_complete.html',
                                            cache:false
                                          }
                                      }
                                  })

                                  .state('add-new-beneficiary', {
                                      url: '/add-new-beneficiary',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/transfers/addNewBeneficiary.html',
                                            controller: 'AddBeneficiaryCtrl'
                                          }
                                      },
                                      cache: false
                                  })

                                  .state('faqGaps', {
                                      url: '/faqGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/settings-help/faq.html',
                                            controller: 'SettingsAndHelpCtrl'
                                          }
                                      }

                                  })
                                  .state('about', {
                                      url: '/about',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/settings-help/about.html',
                                            // controller: 'SettingsAndHelpCtrl'
                                          }
                                      }

                                  })

                                  .state('customer-serviceGaps', {
                                      url: '/customer-serviceGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/settings-help/customer-service.html',
                                            controller: 'SettingsAndHelpCtrl'
                                          }
                                      }
                                  })

                                  .state('feedbackGaps', {
                                      url: '/feedbackGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/settings-help/feedback.html',
                                            controller: 'SettingsAndHelpCtrl'
                                          }
                                      }
                                  })

                                  .state('gl-login', {
                                      url: '/gl-login',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/login.html',
                                            controller: 'LoginGapsCtrl'
                                          }
                                      }
                                  })
                                  .state('ndaniGaps', {
                                      url: '/ndaniGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/lifestyle/ndani.html',
                                            controller: 'NdaniTvGapsCtrl'
                                          }
                                      }
                                  })
                                  // .state('bills_menu', {
                                  //     url: '/bills_menu',
                                  //     views: {
                                  //         'root': {
                                  //           templateUrl: 'views/bill-payments/bills_menu.html',
                                  //           // controller: ''
                                  //         }
                                  //     }
                                  // })
                                  .state('ndani-play-videoGaps', {
                                      url: '/ndani-play-videoGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/lifestyle/ndani-play-video.html',
                                            controller: 'NdaniTvGapsCtrl',
                                            cache: false
                                          }
                                      }
                                  })
                                  .state('forgot-passwordGaps', {
                                      url: 'forgot-passwordGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/forgot-password.html',
                                            controller: 'ForgotPasswordGapsCtrl',
                                            cache: false
                                          }
                                      }
                                  })
                                  .state('change-passwordGaps', {
                                      url: 'change-passwordGaps',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/change-password.html',
                                            controller: 'ChangePasswordCtrl',
                                            cache: false
                                          }
                                      }
                                  })
                                  .state('change-passwordGapsInapp', {
                                      url: 'change-passwordGapsInapp',
                                      views: {
                                          'root': {
                                            templateUrl: 'views/change-passwordInapp.html',
                                            controller: 'ChangePasswordCtrl',
                                            cache: false
                                          }
                                      }
                                  })

            .state('facebooklogin', {
                url: "/facebooklogin",
                views: {
                    'root': {
                        templateUrl: "loginfacebook.html",
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('facebook', {
                url: "/facebook",
                views: {
                    'root': {
                        templateUrl: 'facebook.html',
                        //controller: "FeedCtrl"
                    }
                }
            })
            // .state('facebook', {
            //     url: '/facebook',
            //     views: {
            //         'root': {
            //           templateUrl: 'facebook.html',
            //           controller: 'FeedCtrl'
            //         }
            //     }
            // })
            .state('twitter', {
                url: '/twitter',
                views: {
                    'root': {
                      templateUrl: 'twitter.html',
                      controller: 'twitterCtrl'
                    }
                }
            })
            .state('instagram', {
                  url: '/instagram',
                  views: {
                      'root': {
                        templateUrl: 'instagram.html',
                        controller: 'InstaCtrl'
                      }
                  }
              })

  $sceDelegateProvider.resourceUrlWhitelist([
                        'self',
                        'https://www.youtube.com/**','https://ibank.gtbank.com/report/**']);
  $urlRouterProvider.otherwise('/login');
}]);
