
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// Standalone function to update the DOM with product information
function productDetailsTemplate(product, discountFlag) {
    // Set text elements safely
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    // Fix the image path trap safely using optional chaining
    const productImage = document.getElementById("productImage");
    if (productImage) {
        productImage.src = product.Images?.PrimaryLarge || product.Image;
        productImage.alt = product.NameWithoutBrand;
    }

    // Assign text fields across the detail view layout
    document.getElementById('productPrice').textContent = `$${product.FinalPrice}`;
    document.getElementById('productColor').textContent = product.Colors?.[0]?.ColorName || "";
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
    
    // Set the data attribute for tracking operations
    document.getElementById('addToCart').dataset.id = product.Id;

    // Handle the discount flag banner if applicable
    const discountElement = document.getElementById('discount');
    if (discountElement) {
        discountElement.innerHTML = discountFlag;
    }

    // Display absolute numerical discount savings if applicable
    if (product.FinalPrice < product.SuggestedRetailPrice) {
        const discount = product.SuggestedRetailPrice - product.FinalPrice;
        const discountSavingsElement = document.getElementById("productDiscount");
        if (discountSavingsElement) {
            discountSavingsElement.textContent = `You Save: $${discount.toFixed(2)}`;
            discountSavingsElement.classList.remove("hidden");
        }
    }
}

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {}; 
        this.dataSource = dataSource;
    }

    async init() {
        // Fetch detailed database profile by unique code ID
        this.product = await this.dataSource.findProductById(this.productId);
        console.log("Fetched Product Details:", this.product);

        if (this.product) {
            // Render the page design structure layout
            this.renderProductDetails(this.product);

            // Dynamically listen to add to cart event interactions
            document
                .getElementById("addToCart")
                .addEventListener("click", this.addProductToCart.bind(this));
        }
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];

        // Check if product is already present in storage structures
        const existingItem = cartItems.find(item => item.Id === this.product.Id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.product.quantity = 1;
            cartItems.push(this.product);
        }

        setLocalStorage("so-cart", cartItems);
        alert("Item added to cart!"); 
    }

    renderProductDetails(product) {
        // Calculate percentages to determine if promotional displays apply
        const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice; 

        let discountFlag = '';
        if (hasDiscount) {
            const discountPercent = Math.round(
                ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
            );
            discountFlag = `Discount: <span class="discount-badge">-${discountPercent}% OFF</span>`;
        }

        // Pass calculated details forward directly into template layer
        productDetailsTemplate(product, discountFlag);
    }
}
        

      

  





