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

  constructor(category) {
    // category: string like "tents", "backpacks", etc.
    this.category = category;

    // Build the path to the JSON file for this category
    // Example: if category = "tents", path becomes "../json/tents.json"
    this.path = `../json/${this.category}.json`; 
  }

  getData() {
    // Fetch the JSON file for this category and return the parsed data
    // Uses .then() chain instead of async/await

    return fetch(this.path)           // Make a GET request to the JSON file
      .then(convertToJson)            // Pass the response through convertToJson to parse it
      .then((data) => data);          // Just return the data as-is. This line is redundant but harmless
                                      // You could simplify to: return fetch(this.path).then(convertToJson)
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