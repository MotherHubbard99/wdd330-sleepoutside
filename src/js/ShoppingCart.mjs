import {getLocalStorage} from "./utils.mjs";

export default class ShoppingCart {
    constructor(key, parentSelector) {
        this.key = key; // The localStorage key (e.g., "so-cart")
        this.parentSelector = parentSelector; // The DOM target container (e.g., ".product-list")  
    }

    init() {
        // 1. We grab the current items array from local storage
        const cartItems = getLocalStorage(this.key);

        // 2. We then clear out any olde content and map/render the list
        this.renderCartContents(cartItems);
    }

    renderCartContents(cartItems) {
        const parentElement = document.querySelector(this.parentSelector);
        if (!parentElement) return;

        // We check if cartItems exist and is an array with entries
        if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
            const htmlItems = cartItems.map((item) => cartItemTemplate(item));
            parentElement.innerHTML = htmlItems.join("");
        } else if (cartItems && !Array.isArray(cartItems)) {
            // This handles fallback object instance case if single object isn't wrapped in an array
            parentElement.innerHTML = cartItemTemplate(cartItems); 
        } else {
            // We then clean fallback if the cart array contains zero elements
            parentElement.innerHTML = "<p class='empty-cart-msg'>Your cart is empty.</p>";
        }
    }
}

// Requirement 2: We then clean isolated string template function
function cartItemTemplate(item) {
    // This gracefully handles images whether flat string property or nested object property
    const imagePath = item.Images?.PrimaryMedium || item.Image;

    return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
        <img src="${imagePath}" alt="${item.Name}"/>
    </a>
    <a href="#">
    <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice || item.ListPrice}</p>
    </li>`;
}