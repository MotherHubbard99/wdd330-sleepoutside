import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // This will check if cartItems exist and is actually an array
  if (cartItems && Array.isArray(cartItems)) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
  } else if (cartItems) {
    // This handles the case where only ONE item is in the cart (not in an array)
    const htmlItem = cartItemTemplate(cartItems);
    document.querySelector(".product-list").innerHTML = htmlItem;
  } else {
    // Handle an empty cart
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
