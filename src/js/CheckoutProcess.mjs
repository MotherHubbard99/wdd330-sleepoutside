import ProductData from "./ProductData.mjs";
import { alertMessage } from "./utils.mjs";

const services = new ProductData();

// Convert a standard form element into a clean key-value object pair
function formDataToJson(formElement) {
    const formData = new FormData(formElement);
    const convertedObject = {};

    formData.forEach((value, key) => {
        convertedObject[key] = value;
    });
    return convertedObject;
}

// Packages the raw local storage list into the exact order-item structure expected by the service
function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity || 1,
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    // Reads from LocalStorage, saves to the instance list property, and kicks off calculation
    init() {
        const storageItem = localStorage.getItem(this.key);
        this.list = storageItem ? JSON.parse(storageItem) : [];

        // Here we calculate and display item subtotal when page loads
        this.calculateItemTotal();
    }

    // Method to calculate and display the item subtotal
    calculateItemTotal() {
        const summaryElement = document.querySelector(this.outputSelector);
        if (!summaryElement) return;

        // We then sum up (Price * Quantity) for all items in the array
        this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);

        // We find or target the subtotal DOM display mode
        const subtotalDisplay = document.getElementById("summary-subtotal");
        if (subtotalDisplay) {
            subtotalDisplay.textContent = `$${this.itemTotal.toFixed(2)}`;
        }
    }

    // Method to calculate tax, shipping, and the total (triggered by Zip Code interaction)
    calculateOrdertotal() {
        // We calculate Shipping: $10 for the first item +$2 for each extra item
        const totalItemCount = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (totalItemCount > 0) {
            this.shipping = 10 + (totalItemCount - 1) * 2;
        } else {
            this.shipping = 0;
        }

        // We then calculate Tax: at 6% sales tax on the subtotal amount
        this.tax = this.itemTotal * 0.06;

        // We then find the final combined order total
        this.orderTotal = this.itemTotal + this.shipping + this.tax;

        // We then update the DOM elements with the calculated values
        this.displayOrderTotals();
    }

    // Helper method to write numbers cleanly to the summary block UI
    displayOrderTotals() {
        const shippingDisplay = document.getElementById("summary-shipping");
        const taxDisplay = document.getElementById("summary-tax");
        const totalDisplay = document.getElementById("summary-total");

        if (shippingDisplay) shippingDisplay.textContent = `$${this.shipping.toFixed(2)}`;
        if (taxDisplay) taxDisplay.textContent = `$${this.tax.toFixed(2)}`;
        if (totalDisplay) totalDisplay.textContent = `$${this.orderTotal.toFixed(2)}`;
    }

    // HANDLES SUBMITTING FORM PAYLOAD DATA AND CATCHING CUSTOM ERROR BLOCKS
    async checkoutSubmit(formElement) {
        // 1. Package form data text entries into an object
        const formJson = formDataToJson(formElement);

        // 2 Supplement object with extra metadata properties required by the server API
        const orderPayload = {
            ...formJson,
            orderDate: new Date().toISOString(),
            orderTotal: this.orderTotal.toFixed(2),
            shipping: this.shipping.toFixed(2),
            tax: this.tax.toFixed(2),
            items: packageItems(this.list)
        };

        console.log("Submitting Payload to Server:", orderPayload);

        // Clear out any old existing alert banners on the screen from a previous submission attempt
        const existingAlerts = document.querySelectorAll(".alert");
        existingAlerts.forEach(alert => alert.remove());

        try {
            // Send payload via a Post fetch request to checkout endpoint
            const baseUrl = import.meta.env.VITE_SERVER_URL;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderPayload),
            };

            const response = await fetch(`${baseUrl}checkout`, options);
            const data = await convertToJson(response);

            console.log("Order placed successfully:", data);

            // Clear cart from local storage on successful submission
            localStorage.removeItem(this.key);

            // Redirect user to success splash confirmation page
            window.location.href = "success.html";
        } catch (err) {
            // This catches specific servicesError object throwing custom response payloads
            if (err.name === "servicesError") {
                // Loop over the keys in the error message object to alert specific field validation problems
                for (const fieldName in err.message) {
                    if (Object.prototype.hasOwnProperty.call(err.message, fieldName)) {
                        // REPLACED: Swapped native browser alert for your custom dynamic layout component
                        alertMessage(`${fieldName}: ${err.message[fieldName]}`);
                    }
                }
            } else {
                // Fallback catch block logic for unexpected browser/network disruptions
                console.error("System Error encountered:", err);
                alertMessage("A critical system error occurred. Please verify your connection data.");
            }
        }
    }
} 

// Small utility to support calling convertToJson cleanly inside this module context
async function convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) {
        return jsonResponse;
    } else {
        // Fixed typo from serviceError to servicesError to match the catch block
        throw { name: "servicesError", message: jsonResponse };
    }
}