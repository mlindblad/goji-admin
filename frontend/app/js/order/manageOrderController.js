app.controller('ManageOrderController', function ($http) {
    var self = this;

    this.deleteOrderItem = function(orderItem) {
        console.log(orderItem);
    }

    $http.get('/api/orders')
        .success(function(orders) {

            self.orders = orders
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});