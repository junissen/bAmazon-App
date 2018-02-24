var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: "",
	database: "bamazon"
});

managerView()

function managerView() {
	inquirer.prompt([
		{
			type: 'list',
			name: 'managerOptions', 
			message: 'Choose which action you would like to take: ',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Products']
		}
	]).then( function(inquirerResponse) {

		var managerChoice = inquirerResponse.managerOptions;

		if (managerChoice === 'View Products for Sale') {
			viewProducts()
		}

		else if (managerChoice === 'View Low Inventory') {
			viewLowInventory()
		}

		else if (managerChoice === 'Add to Inventory') {
			addInventory()
		}

		else if (managerChoice === 'Add New Products') {
			addProducts()
		}

		else {
			console.log("You did not choose a valid option")
		}
	})
}

function viewProducts() {

	connection.query("select * from products", function (error, response) {
		if (error) throw error; 

		console.log("--------------");
		console.log("PRODUCTS FOR SALE");
		console.log("--------------");

		for (var i = 0; i < response.length; i ++) {
			console.log("Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Department: "  + response[i].department_name + " | Price: $" + response[i].price + " | Number in stock: " + response[i].stock_quantity)
		};


		connection.end()
	})
}

function viewLowInventory() {

	connection.query("select * from products having stock_quantity < 5", function (error, response) {
		if (error) throw error;

		console.log("--------------");
		console.log("LOW INVENTORY");
		console.log("--------------");

		for (var i = 0; i < response.length; i ++) {
			console.log("Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Department: "  + response[i].department_name + " | Price: $" + response[i].price + " | Number in stock: " + response[i].stock_quantity)
		};

		connection.end()

	})

}

function addInventory() {

	connection.query("select * from products", function (error, response) {

		if (error) throw error;

		var choiceArray = []

		for (var i = 0; i < response.length; i ++) {
			var newString = "Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Department: "  + response[i].department_name + " | Price: $" + response[i].price + " | Number in stock: " + response[i].stock_quantity
			choiceArray.push(newString)
		}

		inquirer.prompt([
				{
					type: 'list',
					name: 'addStock', 
					message: 'Choose which item you would like to add stock to:',
					choices: choiceArray
				}
			]).then( function(inquirerResponse) {
				var responseString = inquirerResponse.addStock;
				var responseArray = responseString.split(" | ");

				var responseID = responseArray[0].split(": ");
				var stockID = responseID[1];

				var responseQuantity = responseArray[4].split(": ");
				var stockQuantity = responseQuantity[1];
				
				inquirer.prompt([
					{
						type: 'input',
						name: 'stockNumber', 
						message: 'How much stock would you like to add?',
						validate: function(value) {
							if (isNaN(value) === false) {
								return true
							}

							else {
								return false
							}
						}
					}
				]).then( function(inquirerResponse) {
					var stockAdd = inquirerResponse.stockNumber;
					var newStockQuantity = parseInt(stockAdd) + parseInt(stockQuantity);

					connection.query("update products set stock_quantity = ? where item_id = ?", [newStockQuantity, stockID], function(error, response) {

						if (error) throw error;

						connection.query("select * from products where item_id = ?", [stockID], function(error,response) { 

							console.log("UPDATED STOCK FOR PRODUCT: ")
							for (var i = 0; i < response.length; i ++) {
								console.log("Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Department: "  + response[i].department_name + " | Price: $" + response[i].price + " | Number in stock: " + response[i].stock_quantity)
							};

							connection.end()

						})
					})
				})
		})

	})

}

function addProducts() {

	inquirer.prompt([
				{
					type: 'input',
					name: 'addProduct', 
					message: 'Produce to add: '
				},
				{
					type: 'input',
					name: 'addDepartment', 
					message: 'Department: '
				},
				{
					type: 'input',
					name: 'addPrice', 
					message: 'Price: $',
					validate: function(value) {
						if (isNaN(value) === false) {
								return true
							}

							else {
								return false
							}
					}
				},
				{
					type: 'input',
					name: 'addStockQuantity', 
					message: 'Stock Quantity: ',
					validate: function(value) {
						if (isNaN(value) === false) {
								return true
							}

							else {
								return false
							}
					}
				}
			]).then( function(inquirerResponse) {
				var product = inquirerResponse.addProduct;
				var department = inquirerResponse.addDepartment;
				var price = inquirerResponse.addPrice;
				var quantity = inquirerResponse.addStockQuantity;

				connection.query("insert into products(product_name, department_name, price, stock_quantity) values ('" + product + "','" + department + "'," + price + "," + quantity + ")", function(error, response) {
					if (error) throw error; 

					console.log("1 product added!")

					connection.query("select * from products", function (error, response) {

						if (error) throw error;

						console.log(response);

						console.log("--------------");
						console.log("NEW INVENTORY");
						console.log("--------------");

						for (var i = 0; i < response.length; i ++) {
							console.log("Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Department: "  + response[i].department_name + " | Price: $" + response[i].price + " | Number in stock: " + response[i].stock_quantity)
						}

						connection.end()
					})

				})
			});
}
