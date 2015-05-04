'use strict';
app.directive('backImg', function () {

    return {
        restrict: 'A',
        scope : {
            url : "=backImg"
        },
        link: function (scope, element, attrs) {
            element.css({
                'background-image' : 'url('+scope.url+')'
            });
        }
    };

});