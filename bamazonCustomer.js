var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: "",
	database: "bamazon"
});

customerView()


function customerView() {
	connection.query("select * from products", function (error, response) {
		if (error) throw error; 

		console.log("--------------");
		console.log("CURRENT ITEMS FOR SALE");
		console.log("--------------");

		for (var i = 0; i < response.length; i ++) {
			console.log("Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Price: $" + response[i].price)
		};

		customerPrompt();
	});
}


function customerPrompt() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'productID',
			message: 'What is the Item ID for the product you would like to purchase?',
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
			name: 'productNumber',
			message: 'How many items of this product would you like to purchase?',
			validate: function(value) {
				if (isNaN(value) === false) {
					return true
				}

				else {
					return false
				}
			}
		}
	]).then(function(inquirerResponse) {

		var productID = inquirerResponse.productID;
		var number = inquirerResponse.productNumber;

		connection.query("select * from products where item_id = ?", [productID], function(error, response) {
			if (error) throw error;

			for (var i = 0; i < response.length; i ++) {
				var stockQuantity = response[i].stock_quantity;
				var price = response[i].price;
				var product = response[i].product_name;
				var productSales = response[i].product_sales;
				
				if (productSales === null) {
					productSales = 0;
				}
			}

			if (number > stockQuantity) {
				console.log("Insufficient quantity!");
				connection.end()
			}

			else {
				var totalCost = parseFloat(price) * parseInt(number);
				var newQuantity = parseInt(stockQuantity) - parseInt(number);
				var newProductSales = parseFloat(productSales) + totalCost;
				
				connection.query("update products set stock_quantity = ?, product_sales = ? where item_id = ?", [newQuantity, newProductSales, productID], function(error, response) {
					if (error) throw error; 


					console.log("YOUR PURCHASE")
					console.log("Purchased " + number + " of Product ID" + productID + ": " + product);
					console.log("Your purchase: $" + totalCost);
					console.log("--------------");

					connection.query("select * from products where item_id = ?", [productID], function (error, response) {
						if (error) throw error;


						console.log("NEW DATABASE ENTRY FOR PRODUCT: ")
						for (var i = 0; i < response.length; i ++) {
							console.log("Item ID: " + response[i].item_id + " | Product: " + response[i].product_name + " | Price: $" + response[i].price + " | In stock: " + response[i].stock_quantity)
						};

						connection.end()
					})
				})


			}
		})
	})
}