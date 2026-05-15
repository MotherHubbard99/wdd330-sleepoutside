import {renderListWithTemplate} from "./utils.mjs";

export default class ProductList {
    constructor(category, dataSource, listElements) {
        // 1. We store the category (eg 'tents') 
        this.category = category;
        // 2. We then store the ProductData instance
        this.dataSource = dataSource;
        // 3. We then store the HTML element where the list should go 
        this.listElement = listElements;
    }

    async init() {
        // 4. We fetch the list of products from the data source 
        const list = await this.dataSource.getData();

        // 5. Render the list to the HTML element 
        this.renderList(list);
    }

    renderList(list) {
        // This replaces all the manual innerHTML and map/join logic
        renderListWithTemplate(productCardTemplate, this.listElement, list);

        // We then generate HTML for each product and join them into one string 
        const htmlString = list.map(productCardTemplate);
        // This joins the array of strings into one big string and adds to the DOM 
        this.listElement.insertAdjacentHTML("afterbegin", htmlString.join(""));
    }
}

// 6. We use Template function for a string product card 
function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.ListPrice}</p>
    </a>
    </li>`;
}