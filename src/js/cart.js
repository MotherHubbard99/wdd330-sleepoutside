import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".cart-product-list").innerHTML = htmlItems.join("");

  calculateTotal();
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
  <p class="cart-card__quantity">qty: ${item.quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>


  <button class="remove" data-id="${item.Id}">Remove</button>

</li>`;

  return newItem;
}

function calculateTotal() {
  const cartItems = getLocalStorage("so-cart") || [];

  //define here
  const totalContainer = document.querySelector(".cart-total-container");
  const totalText = document.querySelector(".cart-total-text");
  //initialize total
  let total = 0;

  if (cartItems.length === 0) {
    totalContainer.classList.add("hide");
    total = 0;
    return;
  } else {
    totalContainer.classList.remove("hide");

    cartItems.forEach((item) => {
      total += item.FinalPrice * item.quantity;
    });
  }

  totalText.textContent = `Total: $${total.toFixed(2)}`;
}

renderCartContents();

//On click of the remove button we will need to remove the item from the cart and update local storage. We will also need to re-render the cart contents to reflect the change.
document
  .querySelector(".cart-product-list")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("remove")) {
      const itemId = event.target.dataset.id;

      removeFromCart(itemId);
    }
  });

function removeFromCart(itemId) {
  const cartItems = getLocalStorage("so-cart");
  const updatedCartItems = cartItems.filter((item) => item.Id !== itemId);
  localStorage.setItem("so-cart", JSON.stringify(updatedCartItems));
  renderCartContents();
}
