'use strict';
app.directive('error', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/error/error.html',
        transclude: true
    };
});