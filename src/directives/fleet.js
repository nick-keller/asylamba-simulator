angular.module('sim')
    .directive('fleet', function() {
        return {
            restrict: 'A',
            controller: 'fleetCtrl',
            scope: {
                fleet: '='
            },
            templateUrl: 'src/view/fleet.html'
        };
    })
    .controller('fleetCtrl', function($scope, $cookies) {
        var selected = {
            squadron: 0,
            line: 0
        };

        $scope.selectedSquadron = null;
        $scope.compoName = '';
        $scope.compos = [];

        $scope.updateCompos = function() {
            $scope.compos = [];
            _.forEach($cookies.getAll(), function(json, name) {

                $scope.compos.push({
                    name: name,
                    data: JSON.parse(json)
                });
            });
        };

        $scope.totalPev = function() {
            var pev = 0;
            $scope.fleet.forEach(function(line) {
                line.forEach(function(squadron) {
                    ships.forEach(function(ship, i) {
                        pev += squadron[i] * ship.pev;
                    });
                })
            });

            return pev;
        };

        $scope.save = function($event) {
            if($scope.compoName && (!$event || $event.keyCode == 13)) {
                $cookies.put($scope.compoName, JSON.stringify($scope.fleet));
                $scope.updateCompos();
            }
        };

        $scope.load = function(name) {
            $scope.compoName = name;
            $scope.fleet = JSON.parse($cookies.get(name));
            $scope.selectSquadron(0,0);
        };

        $scope.remove = function(name) {
            $cookies.remove(name);
            $scope.updateCompos();
        };

        $scope.isSquadronSelected = function(line, squadron) {
            return selected.line == line && selected.squadron == squadron;
        };

        $scope.selectSquadron = function(line, squadron) {
            selected.line = line;
            selected.squadron = squadron;
            $scope.selectedSquadron = _.mapValues($scope.fleet[line][squadron]);
        };

        $scope.$watch(function() { return $scope.selectedSquadron}, function() {
            $scope.fleet[selected.line][selected.squadron] = _.map($scope.selectedSquadron);
        }, true);

        $scope.selectSquadron(0,0);
        $scope.updateCompos();
    });