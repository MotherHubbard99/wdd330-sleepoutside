import { getLocalStorage, alertMessage, removeAllAlerts, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
  return simplifiedItems;
}
// there is nothing to pass to the constructor, so we can just call it without arguments. evrything it needs is either calculated as (this.variable) or pulled from local storage that was inported at the top of the file.
export default class CheckoutProcess {
  constructor() {
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage("so-cart");
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    const summaryElement = document.querySelector("#cartTotal");
    const itemNumElement = document.querySelector("#num-items");
    itemNumElement.innerText = this.list.length;
    // calculate the total of all the items in the cart
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = Number(item.FinalPrice) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
    summaryElement.innerText = `$${this.itemTotal}`;
  }

  calculateOrderTotal() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.tax = (this.itemTotal * .06);
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping)
    )
    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector("#tax");
    const shipping = document.querySelector("#shipping");
    const orderTotal = document.querySelector("#orderTotal");

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(formElement) {
    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.orderTotal = Number(this.orderTotal.toFixed(2));
    order.tax = Number(this.tax.toFixed(2));
    order.shipping = Number(this.shipping.toFixed(2));

    order.items = packageItems(this.list);
    console.log(order);

   try {
      const res = await services.checkout(order);
      console.log(res);
      setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html");
    } catch (err) {
      // get rid of any preexisting alerts.
      // removeAllAlerts();
      // for (let message in err.message) {
      //   alertMessage(`ERROR: ${err.message[message]}`);
      // }
      //alertMessage('Oops! Something went wrong with your order. Please check and try again');
        
        console.error("Checkout error:", err);

        // Case 1: backend sends { message: "something" }
        if (typeof err.message === "string") {
          alertMessage(`ERROR: ${err.message}`);
          return;
        }

        // Case 2: backend sends { message: { field: "error" } }
        if (typeof err.message === "object") {
          for (let key in err.message) {
            alertMessage(`ERROR: ${err.message[key]}`);
          }
          return;
        }

        // Case 3: backend sends { errors: { field: "error" } }
        if (err.errors) {
          for (let key in err.errors) {
            alertMessage(`ERROR: ${err.errors[key]}`);
          }
          return;
        }

        // Fallback
        alertMessage("Oops! Something went wrong with your order.");
    
    }
  }
}