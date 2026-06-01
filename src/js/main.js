
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

export function initWelcomeModal() {
    const modal = document.getElementById("welcome-modal");
    const closeBtn = document.getElementById("close-modal-btn");

    // Check localStorage to see if the user has visited before
    const hasVisited = localStorage.getItem("visited-sleep-outside");

    if (!hasVisited) {
        // If no recored exists, remove the 'hidden' class t show the banner modal
        modal.classList.remove("hidden");

        // We immediately set the key in localStorage so it won't appear on subsequent reloads
        localStorage.setItem("visited-sleep-outside", "true");

        // Handle manual close click event
        if (closeBtn && modal) {
            closeBtn.addEventListener("click", () => {
                modal.classList.add("hidden");
            });

            // Optional: Close the modal if they click anywhere on the dark background overlay
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    modal.classList.add("hidden");
                }
            });
        }


    }
}

// We then invoke the check on page DOM content load
document.addEventListener("DOMContentLoaded", initWelcomeModal);

