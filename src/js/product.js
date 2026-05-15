import {getParam} from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Initializing the data source for the 'tents' category 
const dataSource = new ProductData("tents");

// Get the product ID from the URL query string 
const productId = getParam("product");

// Create a new instance of our ProductDetails class 
const product = new ProductDetails(productId, dataSource);

// Run the init method to fetch data and rendr page 
product.init();
