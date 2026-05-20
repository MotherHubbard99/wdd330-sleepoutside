import { getLocalStorage, setLocalStorage } from "./utils.mjs";
// Import helper functions for reading and writing to browser localStorage
// getLocalStorage: retrieves data from localStorage and parses JSON
// setLocalStorage: stringifies data and saves it to localStorage

export default class ProductDetails {
  // Export this class as the default export so other files can import and use it
  // This class handles displaying product details and adding the product to cart

    constructor(productId, dataSource) {
        // Constructor runs when you create a new ProductDetails instance
        // productId: the ID of the product to display
        // dataSource: an object with methods to fetch product data, e.g., from an API or file
        this.productId = productId; // Store the product ID for later use
        this.product = {}; // Initialize an empty object literal to hold product data
        this.dataSource = dataSource;// Store the data source so we can call its methods
    }

    async init() {
        // init is the main entry point. Called after creating the instance to load and display data
        // Marked async because we need to wait for the product data to load

        // Use the dataSource to fetch product details by ID from the database/API
        this.product = await this.dataSource.findProductById(this.productId);
        console.log(this.product);

        // Once we have the product data, render it to the page
        this.renderProductDetails(this.product);

        // Find the "Add to Cart" button in the DOM and attach a click listener
        //.bind(this) ensures that 'this' inside addProductToCart refers to the ProductDetails instance
        document
           .getElementById("addToCart")
           .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart(product) {
        console.log(this.product);
        // This method runs when the user clicks "Add to Cart"
        // It adds the current product to the cart stored in localStorage

        // Get existing cart items from localStorage. If none exist, use an empty array
        const cartItems = getLocalStorage("so-cart") || [];


 // Check if product already in cart
    const existingItem = cartItems.find(item => item.Id === this.product.Id);

    if (existingItem) {
        // If it exists, bump quantity
        existingItem.quantity += 1;
    } else {
        // If it's new, set quantity to 1 and add it
        this.product.quantity = 1;
        cartItems.push(this.product);
    }

        // Save the updated cart array back to localStorage under the key "so-cart"
        setLocalStorage("so-cart", cartItems);

 
      if (existingItem.FinalPrice < existingItem.SuggestedRetailPrice){
        const discount = existingItem.SuggestedRetailPrice - existingItem.FinalPrice;
           discountElement.textContent = `Discounted Price: $${discount.toFixed(2)}`;
        }
           
}
    


    renderProductDetails(product) {
        // This method is responsible for putting product data into the HTML
        // It delegates the actual HTML manipulation to productDetailsTemplate
        productDetailsTemplate(this.product);
    }
}

// Standalone function to update the DOM with product information
// Keeping it separate makes it easier to test and reuse
function productDetailsTemplate(product) {
    // Set the brand name in the first <h2> tag on the page
    document.querySelector('h2').textContent = product.Brand.Name;

    // Set the product name without brand in the first <h3> tag
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    // Find the product image element, set its src and alt attributes
    const productImage = document.getElementById("productImage");
    productImage.src = product.Image; // Set image URL
    productImage.alt = product.NameWithoutBrand; // Set alt text for accessibility

    // Display the final price in the element with id "productPrice"
    document.getElementById('productPrice').textContent = product.FinalPrice;

    // Display the first color name. Assumes Colors is an array with at least one item
    document.getElementById('productColor').textContent = product.Colors[0].ColorName;

    // Insert the product description HTML. Using innerHTML because DescriptionHtmlSimple contains HTML tags
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

    // Store the product ID on the "Add to Cart" button using a data attribute
    // This lets addProductToCart know which product was clicked if needed
    document.getElementById('addToCart').dataset.id = product.Id;
}



