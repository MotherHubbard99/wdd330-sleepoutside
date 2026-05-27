import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
//create an instance of the ProductData class
const dataSource = new ProductData();
//get the element from the product list that you want to render
const element = document.querySelector(".product-list");
//create an instance of the ProductList class and send it the correct informatio
const listing = new ProductList(category, dataSource, element);
//call the init method to render the product list

listing.init();
