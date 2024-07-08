const form = document.querySelector("form");
const productPanel = document.querySelector("#product-panel");

// Variable to keep the differente products in the cart. It will storage in json file.
let cart = [];

function bringFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
};

// When add event listener of submit the form using capturing, the product is added to the cart.
form.addEventListener("submit", addProduct);

function addProduct(event) {
  event.preventDefault();

  const nameProduct = document.querySelector("#add-name");
  const priceProduct = document.querySelector("#add-price");
  const quantityProduct = document.querySelector("#add-quantity");
  const imageProduct = document.querySelector("#add-image");

  const salePriceProduct = priceProduct.value * 0.7;

  const product = {
    // Generating a random id for each product
    id: Date.now(),
    title: nameProduct.value,
    originalPrice: priceProduct.value,
    salePrice: salePriceProduct.toFixed(2),
    quantity: quantityProduct.value,
    image: imageProduct.value,
    totalPrice: Number(quantityProduct.value) *Number(salePriceProduct),
  };
  cart.unshift(product);

  localStorage.setItem("cart", JSON.stringify(cart));
  displayProduct();
  calculateTotal();
  form.reset();
}

function displayProduct() {
  productPanel.innerHTML = "";

  const html = cart.map(
    (product) =>
      `
        <div class="card d-flex flex-row m-3 shadow" style="max-width: 390px" id=${product.id}>
            <img
              src="${product.image}"
              class="img-fluid w-50"
            />
            <div class="product details w-100 my-1">
              <h6>${product.title}</h6>
              <h3 class="text-warning">
                ${product.salePrice}€<small
                  class="text-decoration-line-through fs-6 text-dark"
                  >${product.originalPrice}</small
                >
              </h3>
              <div
                class="d-flex bg-white border border-2 justify-content-center p-2 m-1"
              >
                <button class="btn btn-secondary btn-sm decrease">-</button>
                <input
                  type="text"
                  class="form-control border-0 bg-white quantity"
                  style="width: 50px"
                  readonly
                  value="${product.quantity}"
                />
                <button class="btn btn-secondary btn-sm increase">+</button>
              </div>
              <div class="d-grid m-1">
                <button class="btn btn-danger">
                  <i class="fa-solid fa-trash p-1"></i>Remove
                </button>
              </div>
              <p class="m-1">
                product total:<span id="product-total" class="fs-6 fw-bold"
                  >${product.totalPrice}€</span
                >
              </p>
            </div>
        </div>
        `
  );
  productPanel.innerHTML = html.join("");
}

// To manage the click event on the decrease, increase and remove buttons on each products, the event listener will be attached to the main conatiner of them(productPanel) using capturing effect

productPanel.addEventListener("click", clickHandler);

function clickHandler(event) {
  const element = event.target;
  if (element.className.includes("increase")) {
    increaseQuantityProduct(element);
  }
  if (element.className.includes("decrease")) {
    decreaseQuantityProduct(element);
  }
  if (element.className.includes("btn-danger")) {
    removeProduct(element);
  }
}

// Parameter: element--> it is necessary because the function needs to know in which element the quantity should be decreased
function decreaseQuantityProduct(element) {
  // Id of the parent of this product
  const parentId = Number(element.parentElement.parentElement.parentElement.id);
  // Finding the product of this id(just the parent has the id, so the children(product) will have the same)
  const product = cart.find((item) => item.id === parentId);
  product.quantity = Number(product.quantity) - 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  if (product.quantity === 0) {
    const answer = confirm("Do you want to remove this product?");
    if (answer) {
      removeProduct(element);
      return;
    } else {
      product.quantity = 1;
    }
  }
  product.totalPrice = Number(product.quantity) * Number(product.salePrice);

  displayProduct();
  calculateTotal();
}

function increaseQuantityProduct(element) {
  const parentId = Number(element.parentElement.parentElement.parentElement.id);
  const product = cart.find((item) => item.id === parentId);
  product.quantity = Number(product.quantity) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  product.totalPrice = Number(product.quantity) * Number(product.salePrice);

  displayProduct();
  calculateTotal();
}

function removeProduct(element) {
  const parentId = Number(element.parentElement.parentElement.parentElement.id);
  // Filter all cards that they don't have the id of the card where the remove button is being clicked
  cart = cart.filter((item) => item.id !== parentId);
  localStorage.setItem("cart", JSON.stringify(cart));

  displayProduct();
  calculateTotal();
}

function calculateTotal() {
  const subtotalElement = document.querySelector(".subtotal");
  const taxesElement = document.querySelector(".tax");
  const shippingElement = document.querySelector(".shipping");
  const totalElement = document.querySelector(".total");

  const shipping = cart.length >= 1 ? 15 : 0;
  const taxes = 0.18;
  const subtotal = cart.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  const taxAmount = subtotal * taxes;
  const total = subtotal + taxAmount + shipping;

  subtotalElement.textContent = subtotal.toFixed(2);
  taxesElement.textContent = taxAmount.toFixed(2);
  shippingElement.textContent = shipping;
  totalElement.textContent = total.toFixed(2);
}

window.addEventListener("DOMContentLoaded", () => {
  bringFromStorage();
  displayProduct();
  calculateTotal();
});
