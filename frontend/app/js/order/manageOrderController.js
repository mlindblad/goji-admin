app.controller('ManageOrderController', function ($http, $scope, $rootScope) {
    var self = this;

    $scope.order = {};
    $scope.orderItem = {};

    this.deleteOrder = function(order) {
        $http.delete('/api/order/' + order.name)
            .success(function(data) {
                self.orders = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    this.createOrder = function() {
        $http.post('/api/order', {name: $scope.order.name, orderItems: []})
            .success(function(data) {
                $scope.order = {};
                self.orders = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    this.createOrderItem = function(order, orderItem) {
        order.orderItems.push(orderItem);
        $http.put('/api/order/' + order.name, {orderItems: order.orderItems})
            .success(function(data) {
                $scope.order = {};
                self.orders = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    this.deleteOrderItem = function(order, number) {
        for(var i = 0; i < order.orderItems.length; i++) {
            var obj = order.orderItems[i];

            if(number === obj.number) {
                order.orderItems.splice(i, 1);
            }
        }
        $http.put('/api/order/' + order.name, {orderItems: order.orderItems})
            .success(function(data) {
                $scope.order = {};
                self.orders = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });


    }

    $http.get('/api/orders')
        .success(function(orders) {

            self.orders = orders
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});