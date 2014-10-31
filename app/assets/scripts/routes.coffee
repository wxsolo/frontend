  angular.module('slowlytime', []).
      config [ 
        '$httpProvider',
        '$routeProvider',
        '$locationProvider',
        routeProvider
      ]
  
  routeProvider = ($httpProvider, $routeProvider, $locationProvider) ->
    $httpProvider.defaults.headers.common['Content-ype'] = 'application/json';
    $locationProvider.hashPrefix('!').html5Mode(true)

    $routeProvider
      .when('/',
        Controller: 'SearchCtrl as search'
        templateUrl: '/components/search/search.html'
      )
   
