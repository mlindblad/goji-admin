var Product = require('./models/product'),
    Order = require('./models/order');

module.exports = function(app) {

	app.get('/products', function(req, res) {
        Product.find(function(err, products) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(products); // return all todos in JSON format
        });
    });

    app.post('/api/product', function(req, res) {
        Product.create(req.body,
            function(err, order) {
                if (err)
                    res.send(err);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end();
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
	app.get('*', function(req, res) {
		res.sendfile('./frontend/app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};