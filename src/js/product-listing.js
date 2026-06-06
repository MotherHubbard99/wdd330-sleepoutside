import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./cart.js";

updateCartCount();

loadHeaderFooter();

const category = getParam("category");
//create an instance of the ExternalServices class
const dataSource = new ExternalServices();
//get the element from the product list that you want to render
const element = document.querySelector(".product-list");
//create an instance of the ProductList class and send it the correct informatio
const listing = new ProductList(category, dataSource, element);
//call the init method to render the product list

listing.init();
