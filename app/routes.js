var Product = require('./models/product'),
    ftpConnection = require('./ftpConnection');


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
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
	});

    app.post('/products', function(req, res) {
        console.log(req.body);
        // create a todo, information comes from AJAX request from Angular
        Product.create(req.body, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
//            Todo.find(function(err, todos) {
//                if (err)
//                    res.send(err)
//                res.json(todos);
//            });
        });

    });

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});

    app.get('/createproduct', function(req, res) {
       res.sendfile('./frontend/app/createProduct.html');
    });

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./frontend/app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};