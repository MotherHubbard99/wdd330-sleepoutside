import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  const countElement = document.querySelector(".cart-count");
  if (countElement) {
    countElement.textContent = totalCount;
    countElement.style.display = totalCount > 0 ? "block" : "none";
  }
}

export function initWelcomeModal() {
  const modal = document.getElementById("welcome-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  // GUARD CLAUSE: If the modal element doesn't exist on this page, exit immediately!
  // This stops 'TypeError: Cannot read properties of null' from crashing other pages.
  if (!modal) {
    return;
  }

  // Set up the event listeners globally so the close button ALWAYS works if the modal is present
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Close the modal if they click anywhere on the dark background overlay
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // 3. Check localStorage to see if the user has visited before
  const hasVisited = localStorage.getItem("visited-sleep-outside");

  if (!hasVisited) {
    // If no record exists, remove the 'hidden' class to show the banner modal
    modal.classList.remove("hidden");

    // We immediately set the key in localStorage so it won't appear on subsequent reloads
    localStorage.setItem("visited-sleep-outside", "true");
  }
}

// Invoke the check on page DOM content load
document.addEventListener("DOMContentLoaded", initWelcomeModal);
