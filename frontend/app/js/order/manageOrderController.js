app.controller('ManageOrderController', function ($http, $scope) {
    var self = this;

    this.deleteOrder = function(order) {
        for(var i = 0; i < self.orders.length; i++) {
            var obj = self.orders[i];

            if(_.isEqual(obj, order)) {
                self.orders.splice(i, 1);
            }
        }
    }

    this.createOrder = function(name) {
       self.orders.push({name : name, orderItems : {}});
    }

    this.createOrderItem = function(order, orderItem) {
        order.orderItems.push({number: orderItem.number, name:orderItem.name, actualOrderAmount:orderItem.actualOrderAmount});
    }

    this.deleteOrderItem = function(order, number) {
        console.log($scope);
        for(var i = 0; i < order.orderItems.length; i++) {
            var obj = order.orderItems[i];

            if(number === obj.number) {
                order.orderItems.splice(i, 1);
            }
        }
    }

    $http.get('/api/orders')
        .success(function(orders) {

            self.orders = orders
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});