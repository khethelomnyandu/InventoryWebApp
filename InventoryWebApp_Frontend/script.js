const apiUrl = "https://localhost:44365/api/products"; // Update with your backend port

const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");

let editId = null; // Track editing product

// Fetch products and populate table
async function fetchProducts() {
    const res = await fetch(apiUrl);
    const products = await res.json();
    productList.innerHTML = "";

    products.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.quantity}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>
                <button onclick="editProduct(${p.id}, '${p.name}', ${p.quantity}, ${p.price})">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Delete product
async function deleteProduct(id) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchProducts();
}

// Edit product
function editProduct(id, name, quantity, price) {
    document.getElementById("name").value = name;
    document.getElementById("quantity").value = quantity;
    document.getElementById("price").value = price;
    editId = id;
}

// Add or update product
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById("name").value,
        quantity: parseInt(document.getElementById("quantity").value),
        price: parseFloat(document.getElementById("price").value)
    };

    if (editId === null) {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
    } else {
        await fetch(`${apiUrl}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        editId = null;
    }

    form.reset();
    fetchProducts();
});

// Initial load
fetchProducts();