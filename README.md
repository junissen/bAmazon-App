# bAmazon Node Application #

Node application for customers and managers to view, update, and purchase items.

### How to use ###

This application runs through Node.js in your terminal/command prompt using MySQL databases. First, MySQL must be connected to a server and the bamazon_db.sql file run to create the databases that will be used. Both these applications will be using the products table in the bamazon database.

Once databases are created using MySQL and the bamazon_db.sql file, the node application can be run. Customers who wish to view items for sale and purchase items can do so by directing their terminal/command prompt to the file directory, then typing the following into the command line.

```
node bamazonCustomer.js
```

Managers who wish to view products for sale, view low inventory, add to inventory, or add new products can do so by direction their terminal/command prompt to the file directory, then typing the following into the command line.

```
node bamazonManager.js
```

Full examples of the all of the following functions can be viewed in the example video in this repository.
