function searchProducts() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  
  if (input === "") {
    alert("Search field cannot be empty!");
    return;
  }

  const products = document.querySelectorAll("#productList li");

  products.forEach(product => {
    const name = product.textContent.toLowerCase();
    product.style.display = name.includes(input) ? "" : "none";
  });
}
