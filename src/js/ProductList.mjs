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
    this.productList = []; // This is for array tracking the original , unmodified list fetched from API
  }

  async init() {
    if (!this.category) {
      this.category = "tents";
    }

    // 1. We fetch the data from the active category and store it
    this.productList = await this.dataSource.getData(this.category)

    // 2. We Dynamically change heading title
    const headingElement = document.querySelector(".products h2");
    if (headingElement) {
      const formattedCategory = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      headingElement.innerHTML = `Top Products: <span class="category-title>${formattedCategory}</span>`;
    }

    // 3.  We then render the initial list unsorted
    this.renderList(this.productList);
  

  // 4. We attach an event listener to our new Sort selector dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    // Using .bind(this) ensures 'this' inside sortProducts refers to the clas instance
    sortSelect.addEventListener("change", this.sortProducts.bind(this));
  }

  }

  // We add the handler method that runs when a user interacts with the dropdown selector
  sortProducts(event) {
    const sortValue = event.target.value;

    // We create a shallow copy array using the spread operator to preserve the original order refernce
    let sortedList = [...this.productList];

    if (sortValue === "name") {
      // Sort alphabetically string data values
      sortedList.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortValue === "price") {
      // Sort numerically floating point numbers (Low to High)
      sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    // We then pass the sortde array back into our standard rendering pipeline
    this.renderList(sortedList);
  }

  renderList(list) {
    this.parentListElement.innerHTML = "";
    renderListWithTemplate(productCardTemplate, this.parentListElement, list);
  }
}
  