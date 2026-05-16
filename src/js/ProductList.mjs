import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
    </a>
  </li>`
}

export default class ProductList {
  constructor(category, dataSource, parentListElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.parentListElement = parentListElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    console.log(list);
   
  this.renderList(list);
  }

  renderList(list) {
  // const htmlStrings = list.map(productCardTemplate);
  // this.parentListElement.insertAdjacentHTML('afterbegin', htmlStrings.join(''));
  renderListWithTemplate(productCardTemplate, this.parentListElement, list);
}

 

  
   
}

  