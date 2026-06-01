import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails(this.product);

    document
      .getElementById("addToCart")
      .addEventListener("click", () => this.addProductToCart(this.product));
  }

  addProductToCart(product) {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    cartItems.push(product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails(product) {
    document.querySelector("h2").textContent = product.NameWithoutBrand;
    document.querySelector("h3").textContent = product.Brand.Name;

    const productImage = document.getElementById("productImage");
    productImage.src = product.Images.PrimaryLarge;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColor").textContent =
      product.Colors?.[0]?.ColorName || "";
    document.getElementById("productDesc").innerHTML =
      product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
  }
}