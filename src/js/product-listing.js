import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";
import alerts from "../json/alerts.json";

const category = getParam("category") || "tents";
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const titleElement = document.querySelector(".title");
const alertsElement = document.querySelector(".alerts");

if (titleElement) {
  titleElement.textContent = `Top Products: ${category.replace("-", " ")}`;
}

if (alertsElement && Array.isArray(alerts)) {
  alertsElement.innerHTML = alerts.map(alertTemplate).join("");
}

const productList = new ProductList(category, dataSource, listElement);
productList.init();

function alertTemplate(alert) {
  return `
    <div class="alert-banner" style="background-color: ${alert.background};">
      <p>${alert.message}</p>
    </div>
  `;
}