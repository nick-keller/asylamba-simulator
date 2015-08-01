angular.module('sim')
    .directive('squadron', function() {
        return {
            restrict: 'A',
            controller: 'squadronCtrl',
            scope: {
                id: '=',
                squadron: '=',
                active: '&'
            },
            templateUrl: 'src/view/squadron.html'
        };
    })
    .controller('squadronCtrl', function($scope) {
        $scope.$watch('squadron', function() {
            $scope.pev = 0;

            ships.forEach(function(ship, i) {
                $scope.pev += $scope.squadron[i] * ship.pev;
            });
        }, true);
    });