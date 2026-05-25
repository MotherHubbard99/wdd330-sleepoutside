import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    // 1. Calculate the discount if it exists, otherwise keep it empty
    let discountHTML = "";
    if (product.FinalPrice < product.SuggestedRetailPrice) {
        const discount = product.SuggestedRetailPrice - product.FinalPrice;
        discountHTML = `<p class="discount-tag">Discounted Price: $${discount.toFixed(2)}</p>`;
    }

    // 2. Return a single, clean template string (Fixed the product.Images trap here!)
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
  constructor(category, dataSource, parentListElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.parentListElement = parentListElement;
  }

  async init() {
    if (!this.category) {
      this.category = "tents";
    }
    
    // Fetch direct data from active category
    const list = await this.dataSource.getData(this.category);

    // Step 8 Title Fix: Dynamically update header matching requirements (e.g., Top Products: Backpacks)
    const headingElement = document.querySelector(".products h2");
    if (headingElement) {
      // Formats label to "Top Products: Tents", "Top Products: Backpacks", etc.
      const formattedCategory = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      headingElement.innerHTML = `Top Products: <span class="category-title">${formattedCategory}</span>`;
    }
    
    this.renderList(list);
  } 

  renderList(list) {
    this.parentListElement.innerHTML = "";
    renderListWithTemplate(productCardTemplate, this.parentListElement, list);
  }
}
  