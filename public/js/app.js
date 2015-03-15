var app =  angular.module("app",[]);
/*
app.controller("MainController",['$http','$scope','$resource',function($http,$scope,$resource) {
      // type field in db
    $scope.types = [];
    $scope.result = [];


    //query data (declare)
    // searches in fiealds with text index, by the moment vps memory can allow making text index only for TITLE field
    $scope.textSearch = '';
    $scope.type = '';
    $scope.price = 0;
    $scope.rating = 0;




    var getTypes = function () {
        $http.get('/getTypes').success(
            function (types) {
                $scope.types = types;
            });
    };
    getTypes();

    $scope.formSubmit = function () {
        var query = {
            searchText: $scope.textSearch,
            type: $scope.type,
            price: $scope.price,
            rating: $scope.rating
        };
        console.log(query);

        $http.post('/postQuery', query).success(function (data) {
            $scope.result = data;
        });
    }


]}

*/

app.controller("MainController",["$http","$scope",function($http,$scope){
    // type field in db
    $scope.types = [];
    $scope.result = [];


    //query data (declare)
    // searches in fiealds with text index, by the moment vps memory can allow making text index only for TITLE field
    $scope.textSearch = '';
    $scope.type = '';
    $scope.price = 0;
    $scope.rating = 0;




    var getTypes = function () {
        $http.get('/getTypes').success(
            function (types) {
                $scope.types = types;
            });
    };
    getTypes();

    $scope.formSubmit = function () {
        var query = {
            searchText: $scope.textSearch,
            type: $scope.type,
            price: $scope.price ,
            rating: $scope.rating
        };
        console.log(query);

        $http.post('/postQuery', query).success(function (data) {
            $scope.result = data;
        });
    }
}]);