'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url        : '/',
        templateUrl: 'js/home/home.html',
        controller : "HomeController"
    });
});

app.controller("HomeController", function ($scope, $http) {
    var userStop = 'L14S';
    // L train === 2
    // 1, 2, 3, 4, 5, 6, S Lines === 1
    //Staten Island Rail = 11;
    var userTrain = 'L';

    $scope.minutesToTrain = "  ";

    $http.get('/api/next/' + userTrain + '/' + userStop).then(function (time) {
        $scope.minutesToTrain = time.data;
        $scope.minute = $scope.minutesToTrain === 1 ? 'minute' : 'minutes';
    });

});