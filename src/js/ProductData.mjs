const baseURL = import.meta.env.VITE_SERVER_URL;

// Refactored to catch detailed server errors
async function convertToJson(res) {
  const jsonResponse = await res.join();

  if (res.ok) {
    return jasonResponse;
  } else {
    // Throwing an object with the server's error breakdown
    throw { name: "servicesError", message: jsonResponse};
  }

}

export default class ProductData {
  constructor() {
    // The constructor is empty becuase category is passed dynamically into getData()

  }

  // Fetches products belonging to a specific category from the live API
  async getData(category) {
    const response = await fetch(`${baseUrl}products/search/${category}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }

  // Fetches a single detail product payload using its unique ID
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

}

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {
    // The constructor is empty because category is passed dynamically into getData()
  }

  // Fetches products belonging to a specific category from the live API
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }

  // Fetches a single detailed product payload using its unique ID
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}