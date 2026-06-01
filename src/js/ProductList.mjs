import { renderListWithTemplate } from "./utils.mjs";

const myDialog = document.querySelector('#myDialog');
const h2 = document.querySelector('#myDialog h2');
const img = document.querySelector('#myDialog img');
const p = document.querySelector('#myDialog p');
const secondP = document.querySelector('.second'); // if you want to use the second paragraph in the dialog, you can target it like this
const closeDialog = document.querySelector('#closeDialog');
const productList = document.querySelector('.product-list');

let products = []; // this will hold the products once they are loaded, so the click listener can find them when a quick view button is clicked

closeDialog.addEventListener('click', () => {
  myDialog.close();
});

function productCardTemplate(product) {
  let discount = product.SuggestedRetailPrice - product.FinalPrice;
  console.log(product);
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
        <p class="discount">Discounted by: $${discount.toFixed(2)}</p>
      </a>
      <button class="quickView" data-id="${product.Id}">Quick View</button>
    </li>
  `;
}

// Delegate clicks from the list container
productList.addEventListener('click', (e) => {
  if (e.target.classList.contains('quickView')) {
    const id = e.target.dataset.id;
    const product = products.find(p => p.Id == id);
    if (product) showDialog(product); // guard against undefined
  }
});

function showDialog(product) {     
  h2.textContent = `${product.Brand.Name} `;
  p.textContent = product.NameWithoutBrand;
  img.src = product.Images.PrimaryMedium;
  img.alt = product.Name;
  secondP.innerHTML = product.DescriptionHtmlSimple;
  myDialog.showModal();
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.discount = 0
  }
  
  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent += ` - ${this.category}`;
 
  }

  

  renderList(list) {
    products = list; // updates the outer variable the listener closes over
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}