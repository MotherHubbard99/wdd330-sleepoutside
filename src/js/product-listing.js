import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";

const category = getParam("category") || "tents";

const dataSource = new ProductData();

const listElement = document.querySelector(".product-list");

const titleElement = document.querySelector(".title");

if (titleElement) {
  titleElement.textContent =
    `Top Products: ${category.replace("-", " ")}`;
}

const productList =
  new ProductList(category, dataSource, listElement);

productList.init();