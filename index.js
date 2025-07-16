// Combined and updated JS for MarketForFarmer

let loged = false;
const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedUser && loggedUser.role === "admin") {
  document.getElementById("adminOptions").classList.remove("d-none");
}
const ADMIN_CREDENTIALS = {
  email: "sgmcoe@gmail.com",
  password: "sgmcoe",
  name: "sgmcoe",
};

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Check for admin login first
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const adminUser = {
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
      role: "admin",
    };

    localStorage.setItem("loggedInUser", JSON.stringify(adminUser));

    document.getElementById("logBtn").classList.add("d-none");
    document.getElementById("profileName").textContent = adminUser.name;
    document.getElementById("profileSection").classList.remove("d-none");
    document.getElementById("view").classList.remove("d-none");
    document.getElementById("adminPanel").classList.remove("d-none");
    loged = true;
    closeModal();
    document.getElementById(
      "profileName"
    ).textContent = `Welcome, ${adminUser.name}`;

    // You can optionally call a function to show admin options

    return false;
  }

  // Regular user login
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (matchedUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
    document.getElementById("logBtn").classList.add("d-none");
    document.getElementById("profileName").textContent = matchedUser.name;
    document.getElementById("profileSection").classList.remove("d-none");
    if (matchedUser.role === "admin") {
      document.getElementById("adminOptions").classList.remove("d-none");
    }

    loged = true;
    closeModal();

    alert(`Welcome back, ${matchedUser.name}!`);
  } else {
    alert("Invalid email or password.");
  }

  return false;
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  loged = false;

  document.getElementById("logBtn").classList.remove("d-none");
  document.getElementById("profileSection").classList.add("d-none");
  document.getElementById("view").classList.add("d-none");
  document.getElementById("adminOptions")?.classList.add("d-none");
  document.getElementById("adminPanel").classList.add("d-none");

  alert("You have been logged out.");
}

function submitData(event) {
  event.preventDefault();

  const role = document.getElementById("registerRole").value;
  let user = {};

  if (role === "farmer") {
    user = {
      role: "farmer",
      name: document.querySelector("#farmerRegister input[name='name']").value,
      email: document.querySelector("#farmerRegister input[name='email']")
        .value,
      location: document.querySelector("#farmerRegister input[name='location']")
        .value,
      password: document.querySelector("#farmerRegister input[name='password']")
        .value,
    };
  } else if (role === "buyer") {
    user = {
      role: "buyer",
      name: document.querySelector("#buyerRegister input[name='name']").value,
      email: document.querySelector("#buyerRegister input[name='email']").value,
      address: document.querySelector("#buyerRegister input[name='address']")
        .value,
      password: document.querySelector("#buyerRegister input[name='password']")
        .value,
    };
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered successfully!");
  closeModal();
}

function openModal(type) {
  document.getElementById("authModal").style.display = "block";
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("loginForm").classList.remove("active");

  if (type === "register") {
    document.getElementById("registerForm").classList.add("active");
  } else {
    document.getElementById("loginForm").classList.add("active");
  }
}

function closeModal() {
  document.getElementById("authModal").style.display = "none";
}

function toggleRegisterRole() {
  const role = document.getElementById("registerRole").value;
  document.getElementById("farmerRegister").style.display =
    role === "farmer" ? "block" : "none";
  document.getElementById("buyerRegister").style.display =
    role === "buyer" ? "block" : "none";
}

window.onload = function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    document.getElementById("logBtn").classList.add("d-none");
    document.getElementById(
      "profileName"
    ).textContent = `Welcome, ${user.name}`;
    document.getElementById("profileSection").classList.remove("d-none");
    document.getElementById("view").classList.remove("d-none");
    loged = true;

    if (user.role === "admin") {
      document.getElementById("adminPanel").classList.remove("d-none");
      document.getElementById("adminOptions")?.classList.remove("d-none");
    }
  } else {
    document.getElementById("logBtn").classList.remove("d-none"); // Show login
    document.getElementById("profileSection").classList.add("d-none");
    document.getElementById("view").classList.add("d-none");
  }
};
window.onclick = function (event) {
  const modal = document.getElementById("authModal");
  if (event.target == modal) {
    closeModal();
  }
};

let selectedProduct = "";
let selectedPrice = 0;

function showPopup(productName, price) {
  selectedProduct = productName;
  selectedPrice = price;
  document.getElementById("popupProductName").textContent = productName;
  document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

function addToCart() {
  const quantity = parseInt(document.getElementById("quantityInput").value);
  if (!quantity || quantity < 1) return alert("Enter valid quantity");

  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

  cart.push({
    product: selectedProduct,
    quantity: quantity,
    price: selectedPrice,
  });

  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
  alert(`${selectedProduct} (${quantity}) added to cart! 🛒`);
  closePopup();
}

document.querySelectorAll(".cartbutton").forEach((button) => {
  button.addEventListener("click", function () {
    const card = this.closest(".card-container");
    const product = card.querySelector(".card-heading").innerText;
    const price = parseInt(card.querySelector(".price").innerText);
    showPopup(product, price);
  });
});

function showCart() {
  if (loged === true) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

    const cartItemsDiv = document.getElementById("cartItems");

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cartItemsDiv.innerHTML = cart
        .map(
          (item, index) => `
          <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded shadow-sm" style="min-width: 250px;">
            <div style="flex-grow: 1; font-weight: bold;">${item.product} (${item.quantity})</div>
            <div class="d-flex">
              <button onclick="removeOne(${index})" class="btn btn-outline-success btn-sm mr-2">➖</button>
              <button onclick="removeItem(${index})" class="btn btn-outline-danger btn-sm">🗑️</button>
            </div>
          </div>
        `
        )
        .join("");
    }

    document.getElementById("cartOverlay").style.display = "flex";
  } else {
    alert("Please login to view cart!");
    openModal("login");
  }
}

function closeCart() {
  document.getElementById("cartOverlay").style.display = "none";
}

function removeOne(index) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
  showCart();
}

function removeItem(index) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

  cart.splice(index, 1);
  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
  showCart();
}
function Buy() {
  let total = 0;
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
  localStorage.removeItem(`cart_${user.email}`);

  const cartItemsDiv = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItemsDiv.innerHTML = cart
      .map((item, index) => {
        const subtotal = item.quantity * item.price;
        total += subtotal;
        return `
          <div style="margin-bottom: 10px;">
            <strong class="container">${item.product}</strong>: 
            ${item.quantity} × ₹${item.price} = ₹${subtotal}
          </div>`;
      })
      .join("");

    cartItemsDiv.innerHTML += `
      <hr>
      <h5 class="text-right font-weight-bold">Total: ₹${total}</h5>
      <h5 class="text-success text-center mt-3">🛒 Pay on Delivery!</h5>
    `;
  }

  document.getElementById("cartOverlay").style.display = "flex";
}

function viewFarmers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const farmers = users.filter((user) => user.role === "farmer");

  if (farmers.length === 0) return alert("No farmers found.");

  document.getElementById("adminTitle").textContent = "Registered Farmers";
  document.getElementById("adminContent").innerHTML = farmers
    .map(
      (farmer) => `
    <div class="card p-2 mb-2 border border-success">
      <strong>Name:</strong> ${farmer.name}<br>
      <strong>Email:</strong> ${farmer.email}<br>
      <strong>Location:</strong> ${farmer.location}
    </div>
  `
    )
    .join("");

  document.getElementById("adminDisplay").style.display = "block";
}

function viewBuyers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const buyers = users.filter((user) => user.role === "buyer");

  if (buyers.length === 0) return alert("No buyers found.");

  document.getElementById("adminTitle").textContent = "Registered Buyers";
  document.getElementById("adminContent").innerHTML = buyers
    .map(
      (buyer) => `
    <div class="card p-2 mb-2 border border-primary">
      <strong>Name:</strong> ${buyer.name}<br>
      <strong>Email:</strong> ${buyer.email}<br>
      <strong>Address:</strong> ${buyer.address}
    </div>
  `
    )
    .join("");

  document.getElementById("adminDisplay").style.display = "block";
}
