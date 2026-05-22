const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  // Helper function to handle fetch responses         
  // 'res' is the Response object returned by fetch()

  if (res.ok) {
    // res.ok is true for HTTP status 200-299
    // If the request succeeded, parse the response body as JSON and return it
    return res.json();
  } else {
    // If the request failed, throw an error so the catch block can handle it
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  // This class handles loading product data for a specific category
  // Exported as default so you can import it with any name



 async getData(category) {
    // Fetch the JSON file for this category and return the parsed data
    // Uses .then() chain instead of async/await

    const response = await fetch(`${baseURL}products/search/${category} `);
    const data = await convertToJson(response);
    return data.Result;       
  }

  async findProductById(id) {
    // Find a single product in the category by its ID
    // Marked async because we need to await getData()

    const products = await this.getData();
    // Wait for getData() to finish and give us the full array of products

    return products.find((item) => item.Id === id);
    // Search the array and return the first item where item.Id matches the id passed in
    // Returns undefined if no match is found
  }
}