function createAutoClosingAlert(selector, delay) {
    var alert = $(selector).alert();
    window.setTimeout(function() { alert.alert('close') }, delay);
}

app.controller('ProductCtrl', function ($scope, $http) {

    $scope.showAlertMessage = false;

    this.createProduct = function() {

        $http.post('/api/product', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.showAlertMessage = true;
                createAutoClosingAlert(".alert-message", 2000);

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});