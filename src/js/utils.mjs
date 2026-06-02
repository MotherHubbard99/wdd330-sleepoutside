

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

//get the product ID from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(template, parentListElement, list, position = "afterbegin", clear = true) {
    
 
  const htmlStrings = list.map(template);
  // if clear is true we need clear parent element before inserting new content
  if (clear) {
    parentListElement.innerHTML = "";
  }
  parentListElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
    
 parentElement.innerHTML = template;
  
 if(callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter(){

  const headerTemplate = await loadTemplate("/partials/header.html");

   const footerTemplate = await loadTemplate("/partials/footer.html");

const headerElement = document.querySelector("#main-header");

const footerElement = document.querySelector("#main-footer");

// We will attempt to render if the layout placeholders exist on the current page
if (headerElement) renderWithTemplate(headerTemplate, headerElement);
if (footerElement) renderWithTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll = true) {
  // We create the element to hold the alert
  const alertContainer = document.createElement("div");

  // We then add classes to style the alert banner
  alertContainer.classList.add("alert");

  // We will set the HTML contents with a custom close indicator text
  alertContainer.innerHTML = `<span>${message}</span><span class="alert-close" style="cursor:pointer; font-weight:bold;">X</span>`; 

  // Add a listener to see if they clicked the close element
  alertContainer.addEventListener("click", function(e) {
    // Now if they clicked the 'X' button text specifically, remove the alert child
    if (e.target.classList.contains("alert-close") || e.target.innerText === "X") {
      const main = document.querySelector("main");
      alertContainer.remove();
    }
  
  });

  // We then add the alert dynamically to the absolute top of the main layout element
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alertContainer);
  }
  

  // Automatically scroll back up to he top of the viewport window if true
  if (scroll) {
    window.scrollTo({top:0, behavior: "smooth"});
  }
}
 /*export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="alert_close">X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert_close") || e.target.tagName === "SPAN") {
      main.removeChild(this);
    }
  }); 
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  // setTimeout(function () {
  //   main.removeChild(alert);
  // }, duration);
} */

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}