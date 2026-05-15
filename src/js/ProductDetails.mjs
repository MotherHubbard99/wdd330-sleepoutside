import { getLocalStorage, setLocalStorage } from "./utils.mjs";

/* function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
} */

export default class ProductDetails {
  
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    async init() {
        //use the db to get details for the product
        this.product = await this.dataSource.findProductById(this.productId);
        // Render the details to the page 
        this.renderProductDetails("main");

        // Add listener to the button AFTER it's rendered 
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }
    
    addProductToCart(product) {

        // Get current cart or empty array
        const cartItems = getLocalStorage("so-cart") || [];
        // Add the current product (this.product) to the array 
        cartItems.push(this.product);
        // Save back to local storage 
        setLocalStorage("so-cart", cartItems);
        alert("Added to cart!");
    }


    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        // Call the template and inject it into the 'main' element 


        element.innerHTML= productDetailsTemplate(this.product);

    }
}

function productDetailsTemplate(product) {
    return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img id="productImage" class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
    <p class="product-card__price">$${product.ListPrice}</p>
    <p class="product-color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
    </section>`;
}


