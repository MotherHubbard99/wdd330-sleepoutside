

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

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true) {
  const htmlStrings = list.map(template);
  // if clear is true we need clear parent element before inserting new content
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderListWithTemplate (
  templateFn,
  parentElement,
  list,
  position ="afterbegin",
  clear = true
) {
  // Step 4: Clear the element if 'clear' is true 
  if (clear) {
    parentElement.innerHTML = "";
  }

  // Step 2: Use map to transform data into HTML strings 
  const htmlStrings = list.map(templateFn);

  // Step 2: Join and insert into the DOM 
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}