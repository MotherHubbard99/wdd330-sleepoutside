import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";



loadHeaderFooter();

// We extract the category parameter dynamically from the browser URL address bar
// If a user clicks 'Backpacks', this automatically grabs "backpacks" from ?category=backpacks
const category = getParam("category");

// We then initialize the updated data source class
const dataSource = new ProductData();

// We then grab the container element from the DOM where the list cards will inject
const listElement = document.querySelector(".product-list");

// We then Instantiate the ProductList renderer component, passing the category and source down 
const myList = new ProductList(category, dataSource, listElement);

// We then run the initialization to fetch from the API and build the HTML templates
myList.init();