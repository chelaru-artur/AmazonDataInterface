var app = angular.module("app", []);

app.controller("MainController", ["$http", "$scope", function($http, $scope) {
    // type field in db
    $scope.types = [];
    $scope.result = [];


    //query data (declare)
    // searches in fiealds with text index, by the moment vps memory can allow making text index only for TITLE field
    $scope.textSearch = '';
    $scope.type = '';
    $scope.price = 0;
    $scope.priceSecond = 0;
    $scope.rating = 0;
    $scope.ratingSecond = 0;
    $scope.sortBy = "";
    $scope.sortOrder = 1;



    var getTypes = function() {
        $http.get('/getTypes').success(
            function(types) {
                $scope.types = types;
            });
    };
    getTypes();

    $scope.formSubmit = function() {
        var query = {
            searchText: $scope.textSearch,
            type: $scope.type,
            priceOperand: $scope.priceOperand,
            price: ($scope.priceOperand == 'between') ? [$scope.price, $scope.priceSecond] : $scope.price,
            ratingOperand: $scope.ratingOperand,
            rating: ($scope.ratingOperand == 'between') ? [$scope.rating, $scope.ratingSecond] : $scope.rating
        };

        var sortBy = {
            sortBy: $scope.sortBy,
            sortOrder: $scope.sortOrder
        }

        $http.post('/postQuery', {query : query , sortBy : sortBy}).success(function(data) {
            $scope.result = data;
        });
    }
}]);