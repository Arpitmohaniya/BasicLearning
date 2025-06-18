let currentProducts = [];

function searchProducts() {
  const input = document.getElementById("searchInput").value.trim();
  const error = document.getElementById("error");

  if (!input || input.length < 2) {
    error.textContent = "Please enter a valid search term (at least 2 characters).";
    return;
  }

  error.textContent = "";
  fetch(`https://dummyjson.com/products/search?q=${input}`)
    .then(res => res.json())
    .then(data => {
      currentProducts = data.products;
      displayProducts(currentProducts);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      error.textContent = "Failed to fetch products. Please try again later.";
    });
}

function displayProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p><strong>Name:</strong> ${product.brand}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
    `;

    container.appendChild(card);
  });
}

function sortProducts() {
  const sortBy = document.getElementById("sortOptions").value;
  if (!sortBy) return;

  const sorted = [...currentProducts];
  sorted.sort((a, b) => {
    return sortBy === "asc" ? a.price - b.price : b.price - a.price;
  });

  displayProducts(sorted);
}
