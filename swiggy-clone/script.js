/***********************
  BASIC LOGIN CHECK
************************/
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function requireLogin() {
  if (!isLoggedIn()) {
    alert("Please login to continue");
    window.location.href = "login.html";
  }
}

/***********************
  CART LOGIC
************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* Add item to cart */
function addToCart(name, price, qtyId) {
  requireLogin();

  const qty = parseInt(document.getElementById(qtyId).value);

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart");
}

/***********************
  LOAD CART PAGE
************************/
function loadCart() {
  const cartBox = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalAmount");

  if (!cartBox) return;

  cartBox.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartBox.innerHTML = "<p>Your cart is empty</p>";
    totalBox.innerText = "₹0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartBox.innerHTML += `
      <div class="cart-item">
        <b>${item.name}</b>  
        <br>₹${item.price} × ${item.qty}
        <br>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  totalBox.innerText = "₹" + total;
}

/***********************
  REMOVE ITEM
************************/
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

/***********************
  PLACE ORDER
************************/
function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const payment = document.querySelector("input[name='payment']:checked");
  if (!payment) {
    alert("Select payment method");
    return;
  }

  orders.push({
    date: new Date().toLocaleString(),
    items: [...cart],
    payment: payment.value
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Order placed successfully!");
  loadCart();
  loadOrders();
}

/***********************
  ORDER HISTORY
************************/
function loadOrders() {
  const historyBox = document.getElementById("orderHistory");
  if (!historyBox) return;

  historyBox.innerHTML = "";

  if (orders.length === 0) {
    historyBox.innerHTML = "<p>No orders yet</p>";
    return;
  }

  orders.forEach(order => {
    historyBox.innerHTML += `
      <div class="order-box">
        <b>Order Date:</b> ${order.date}<br>
        <b>Payment:</b> ${order.payment}<br>
        <b>Items:</b>
        <ul>
          ${order.items.map(i => `<li>${i.name} × ${i.qty}</li>`).join("")}
        </ul>
      </div>
    `;
  });
}

/***********************
  LOGIN (FAKE)
************************/
function loginUser() {
  localStorage.setItem("loggedIn", "true");
  alert("Login successful");
  window.location.href = "index.html";
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out");
  window.location.href = "index.html";
}

/***********************
  AUTO LOAD
************************/
window.onload = function () {
  loadCart();
  loadOrders();
};
