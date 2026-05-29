// Get the backend API URL from your environment variables
// In Vite this comes from .env file: VITE_SERVER_URL=https://wdd330-backend.onrender.com/
const baseURL = import.meta.env.VITE_SERVER_URL;

// Helper function to handle fetch responses
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    return res.json().then(err => {
      throw new Error(err.message || err.error || `Bad Response: ${res.status}`);
    });
  }
}
// Class that handles all API calls to the backend
export default class ExternalServices {
  constructor() {
    // Empty for now. You could set category/path here if needed
  }

  // Get a list of products for a given category: tents, backpacks, sleeping-bags, etc
  async getData(category) {
    // Call the API endpoint for searching products by category
    const response = await fetch(`${baseURL}products/search/${category}`);
    
    // Convert the response to JSON. Will throw "Bad Response" if status isn't OK
    const data = await convertToJson(response);
    
    // The API returns { Status: 200, Result: [...] }. We only want the array
    return data.Result;
  }

  // Get a single product by its ID
  async findProductById(id) {
    // Call the API endpoint for one product
    const response = await fetch(`${baseURL}product/${id}`);
    
    const data = await convertToJson(response);
    
    // Return the single product object inside Result
    return data.Result;
  }

  // Send the order to the backend to process checkout
  async checkout(payload) {
    // Set up the POST request options
    const options = {
      method: "POST",                           // We're creating a new order
      headers: {
        "Content-Type": "application/json",     // Tell the server we're sending JSON
      },
      body: JSON.stringify(payload),            // Convert the JS object to a JSON string
    };

    // Send the POST request to /checkout/
    // .then(convertToJson) means: once fetch resolves, run the response through convertToJson
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
  
}