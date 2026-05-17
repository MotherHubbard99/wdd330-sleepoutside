import { getParam } from "./utils.mjs";
// Import getParam: a helper that reads query string parameters from the URL
// Example: if URL is product.html?product=123, getParam("product") returns "123"

import ProductData from "./ProductData.mjs";
// Import ProductData class. This handles fetching product data from your data source/API

import ProductDetails from "./ProductDetails.mjs";
// Import ProductDetails class. This handles rendering the product and managing cart actions

const dataSource = new ProductData("tents");
// Create a new ProductData instance for the "tents" category
// The "tents" string tells ProductData which dataset/API endpoint to use

const productId = getParam("product");
// Get the product ID from the URL query string
// So if you're on product.html?product=1010, productId becomes "1010"

const product = new ProductDetails(productId, dataSource);
// Create a new ProductDetails instance
// Pass in the productId to know what to load, and dataSource to know how to load it

product.init();
// Call init() to start the process: fetch product data, render it to the page,
// and attach the "Add to Cart" button listener