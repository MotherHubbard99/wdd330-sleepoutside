import ProductData from "./ProductData.mjs";
import ProductList from "./Productlist.mjs";


// We then create an instance for the "tents" category
const dataSource = new ProductData("tents");
// Find the <ul> or <section> in the index.html where the tents should go 
const element = document.querySelector(".product-list");

const listing = new ProductList("tents", dataSource, element);

listing.init();