app.controller('ProductCtrl', function ($scope, $http) {
    $scope.processForm = function() {
        console.log($scope.formData);
        $http({
            method  : 'POST',
            url     : '/products',
            data    : $scope.formData
        })
            .success(function(data) {
                console.log(data);

                if (!data.success) {
                    // if not successful, bind errors to error variables
                    $scope.errorName = data.errors.name;
                    $scope.errorSuperhero = data.errors.superheroAlias;
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.message;
                }
            });
    };

});