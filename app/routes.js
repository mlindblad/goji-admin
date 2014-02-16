var Product = require('./models/product'),
    Order = require('./models/order'),
    mongoose = require('mongoose'),
    ftpConnection = require('./ftpConnection'),
    _ = require('underscore');


module.exports = function(app) {

	app.get('/products', function(req, res) {
        //Download stock status from e3pl, and update products
        ftpConnection.getStockStatus(function() {
            Product.find(function(err, products) {
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                res.json(products); // return all todos in JSON format
            });
        });
    });

	// api ---------------------------------------------------------------------
	// get all orders
	app.get('/api/orders', function(req, res) {
		Order.find(function(err, orders) {
			if (err)
				res.send(err)
			res.json(orders); // return all todos in JSON format
		});
	});

//    app.post('/products', function(req, res) {
//        console.log(req.body);
//        // create a todo, information comes from AJAX request from Angular
//        Product.create(req.body, function(err, todo) {
//            if (err)
//                res.send(err);
//
//            // get and return all the todos after you create another
////            Todo.find(function(err, todos) {
////                if (err)
////                    res.send(err)
////                res.json(todos);
////            });
//        });
//
//    });



	// create order and send back all orders after creation
	app.post('/api/order', function(req, res) {
        Order.create({name: req.body.name, orderItems: req.body.orderItems},
            function(err, order) {
            if (err)
                res.send(err);

            Order.find(function(err, orders) {
                if (err)
                    res.send(err)
                res.json(orders);
            });
        });
	});

    app.put('/api/order/:name', function (req, res) {
        Order.findOne({ 'name': req.params.name }, function (err, order) {
            if (err) {
                console.log(err);
            }
            order.orderItems = req.body.orderItems;

            order.save(function (err, order, numberAffected) {
                if (err) {
                    console.log(err);
                }

                Order.find(function(err, orders) {
                    if (err)
                        res.send(err)
                    res.json(orders);
                });
            })
        })
    });

	// delete a order
	app.delete('/api/order/:name', function(req, res) {
		Order.remove({
			name : req.params.name
		}, function(err, order) {
			if (err)
				res.send(err);

			// get and return all the orders after you create another
			Order.find(function(err, orders) {
				if (err)
					res.send(err)
				res.json(orders);
			});
		});
	});

    app.get('/orders', function(req, res) {
       res.sendfile('./frontend/app/listOrders.html');
    });

	// application -------------------------------------------------------------
//	app.get('*', function(req, res) {
//		res.sendfile('./frontend/app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//	});
};