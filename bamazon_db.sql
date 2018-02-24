drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id integer auto_increment not null,
    product_name varchar(100) not null,
    department_name varchar(100),
    price decimal(10,2), 
    stock_quantity integer not null,
    primary key (item_id)
);

create table departments (
	department_id integer auto_increment not null,
    department_name varchar(100) not null, 
    over_head_costs decimal(10,2),
    primary key (department_id)
);

alter table products
add product_sales decimal(10,2);

alter table departments
add product_sales decimal(10,2);

insert into products (product_name, department_name, price, stock_quantity)
values ('toothpaste', 'Personal Care', 4.99,  20), ('toilet paper', 'Personal Care', 6.49,  50), ('headphones', 'Electronics', 29.99, 10), ('notebook', 'School and Office Supplies', 22.95, 5), ('baby car seat', 'Baby', 69.99, 3);

insert into products (product_name, department_name, price, stock_quantity)
values ('diapers', 'Baby', 21.99, 7), ('sofa', 'Furniture', 405.99, 3), ('end table', 'Furniture', 94.99, 5), ('suitcase', 'Luggage', 99.99, 6), ('vacuum', 'Vacuums and Floor Care', 99.99, 12);


