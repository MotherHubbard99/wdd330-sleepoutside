import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    // 1. Calculate the dynamic pricing discount if it applies
    let discountHTML = "";
    if (product.FinalPrice < product.SuggestedRetailPrice) {
        const discount = product.SuggestedRetailPrice - product.FinalPrice;
        discountHTML = `<p class="discount-tag">Discounted Price: $${discount.toFixed(2)}</p>`;
    }

    // 2. Generate standard card layout framework
    return `<li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.Name}</h3>
        ${discountHTML}
        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      </a>
    </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement; // Matches your team's instantiation parameters exactly
    this.productList = [];          // State-tracking array structure for active sorts
  }

  async init() {
    if (!this.category) {
      this.category = "tents";
    }

    // 1. Fetch data profile arrays from remote database pipelines
    this.productList = await this.dataSource.getData(this.category);

    // 2. Dynamically modify headers on load
    const headingElement = document.querySelector(".products h2") || document.querySelector(".title");
    if (headingElement) {
      const formattedCategory = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      headingElement.innerHTML = `Top Products: <span class="category-title">${formattedCategory}</span>`;
    }

    // 3. Render base items list layout view
    this.renderList(this.productList);

    // 4. Bind event monitoring parameters to sorting selector inputs
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", this.sortProducts.bind(this));
    }
  } 

  sortProducts(event) {
    const sortValue = event.target.value;

    // Shallow duplicate targets cleanly using the JavaScript spread operator
    let sortedList = [...this.productList];

    if (sortValue === "name") {
      sortedList.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortValue === "price") {
      sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    // Refresh display nodes matching calculations
    this.renderList(sortedList);
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}







 

  
