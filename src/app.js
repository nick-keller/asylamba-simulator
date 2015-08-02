angular.module('sim', ['ngCookies'])
    .controller('main', function($scope) {
        $scope.attacker = [];
        $scope.defender = [];
        $scope.numberIterations = 1000;

        for(var line = 0; line <5; ++line) {
            $scope.attacker.push([]);
            $scope.defender.push([]);
            for(var squadron = 0; squadron<5; ++squadron) {
                $scope.attacker[line].push(_.fill(Array(12), 0));
                $scope.defender[line].push(_.fill(Array(12), 0));
            }
        }

        $scope.ships = ships;

        $scope.run = function() {
            var attacker = _.cloneDeep($scope.attacker);
            var defender = _.cloneDeep($scope.defender);

            runSimulations({
                attackingFleet: attacker,
                defendingFleet: defender,
                iterations: $scope.numberIterations
            });
        }
    })
    .filter('reverse', function() {
        return function(items) {
            return items.reverse();
        };
    });





