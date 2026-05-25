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
        console.log("Fetched Product Details:", this.product);

        if (this.product) {
            this.renderProductDetails();

            document
                .getElementById("addToCart")
                .addEventListener("click", this.addProductToCart.bind(this));
        }
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];

        // We check if product is already in the cart
        const existingItem = cartItems.find(item => item.Id === this.product.Id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // We set initial quantity cleanly to 1
            this.product.quantity = 1;
            cartItems.push(this.product);
        }

        setLocalStorage("so-cart", cartItems);
        alert("Item added to cart!"); // This will be a nice UX feedback to let the user know it worked
    }

    renderProductDetails() {
        // Pass the product data directly to the template function
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
        document.querySelector('h2').textContent = product.Brand.Name;
        document.querySelector('h3').textContent = product.NameWithoutBrand;

        // We fix the image path trap
        // If the API returns a nested path, we will change this to: product.Images.PrimaryLarge
        const productImage = document.getElementById("productImage");
        productImage.src = product.Images?.PrimaryLarge || product.Image;
        productImage.alt = product.NameWithoutBrand;

        document.getElementById('productPrice').textContent = `$${product.FinalPrice}`;
        document.getElementById('productColor').textContent = product.Colors[0].ColorName;
        document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
        document.getElementById('addToCart').dataset.id = product.Id;

        //We calculate and display the discount on load
        if (product.FinalPrice < product.SuggestedRetailPrice) {
            const discount = product.SuggestedRetailPrice - product.FinalPrice;
            const discountElement = document.getElementById("productDiscount");
            if (discountElement) {
                discountElement.textContent = `You Save: $${discount.toFixed(2)}`;
                discountElement.classList.remove("hidden");
            }
        }
}


      