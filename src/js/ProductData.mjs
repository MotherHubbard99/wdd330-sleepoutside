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

    constructor() {
    // The constructor is now empty because category is passed directly into getData() instead!
    }

    // We convert to aync/await and update to fetch from the live API endpoint
    async getData(category) {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);

      // The API will send data wrapped inside an object envelope, so we return data.Result
      return data.Result
    }

    async findProductById(id) {
      // We now fix the query so that the live API will directly ask for a single product using its unique ID
      const response = await fetch(`${baseURL}product/${id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.Result;
    }

}