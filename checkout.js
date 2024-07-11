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

  const totalPrice = Number(quantityProduct.value) * Number(salePriceProduct);

  const product = {
    // Generating a random id for each product
    id: Date.now(),
    title: nameProduct.value,
    originalPrice: priceProduct.value,
    salePrice: salePriceProduct.toFixed(2),
    quantity: quantityProduct.value,
    image: imageProduct.value,
    totalPrice: totalPrice.toFixed(2),
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
                  >${product.originalPrice}€</small
                >
              </h3>
              <div
                class="d-flex bg-white border border-2 justify-content-center p-2 m-1"
              >
                <button class="btn btn-secondary btn-sm decrease" onclick="decreaseQuantityProduct(${product.id})">-</button>
                <input
                  type="text"
                  class="form-control border-0 bg-white quantity"
                  style="width: 50px"
                  readonly
                  value="${product.quantity}" id=${product.id}
                />
                <button class="btn btn-secondary btn-sm increase" onclick="increaseQuantityProduct(${product.id})">+</button>
              </div>
              <div class="d-grid m-1">
                <button class="btn btn-danger" onclick="removeProduct(${product.id})">
                  <i class="fa-solid fa-trash p-1"></i>Remove
                </button>
              </div>
              <p class="m-1">
                Product total: <span id="product-total" class="fs-6 fw-bold"
                  >${product.totalPrice}€</span
                >
              </p>
            </div>
        </div>
        `
  );
  productPanel.innerHTML = html.join("");
}


function decreaseQuantityProduct(id) {
const selectedProduct = id;
const product = cart.find((item) => item.id === selectedProduct);
product.quantity = Number(product.quantity) - 1;
localStorage.setItem("cart", JSON.stringify(cart));
if (product.quantity === 0) {
  const answer = confirm("Do you want to remove this product?");
  if (answer) {
    removeProduct(id);
    return;
  } else {
    product.quantity = 1;
  }
}
product.totalPrice = (Number(product.quantity) * Number(product.salePrice)).toFixed(2);

displayProduct();
calculateTotal();
}

function increaseQuantityProduct(id) {
  const selectedProduct = id;
  const product = cart.find((item) => item.id === selectedProduct);
  product.quantity = Number(product.quantity) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  product.totalPrice = (Number(product.quantity) * Number(product.salePrice)).toFixed(2);

  displayProduct();
  calculateTotal();
}

function removeProduct(id) {
  const selectedProduct = id;
  // Filter all cards that they don't have the id of the card where the remove button is being clicked
  cart = cart.filter((item) => item.id !== selectedProduct);
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
