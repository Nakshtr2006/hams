checkAuthentication();

const role = localStorage.getItem("role");

const createProductSection =
    document.getElementById("createProductSection");

let editingProductId = null;

async function loadProducts() {

    try {

        const response =
            await authorizedFetch("/products");

        const products =
            await response.json();

        let html = "";

        products.forEach(product => {

            let buttons = "";

            if (
                role === "ROOT" ||
                role === "ADMIN"
            ) {

                buttons = `
    <div class="table-actions">

        <button
            data-testid="edit-button"
            onclick="editProduct(${product.id})">
            Edit
        </button>

        <button
            data-testid="delete-button"
            onclick="deleteProduct(${product.id})">
            Delete
        </button>

    </div>
`;
            }

            html += `
    <div
        class="product-card"
        data-testid="product-card"
        data-product-name="${product.name}">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p><strong>Price:</strong> ₹${product.price}</p>

                    <p><strong>Stock:</strong> ${product.stock}</p>

                    ${buttons}

                </div>
            `;
        });

        document.getElementById("products").innerHTML = html;

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Failed to load products.";
    }
}

async function createProduct() {

    const productData = {

        name:
            document.getElementById("name").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        price:
            Number(document.getElementById("price").value),

        stock:
            Number(document.getElementById("stock").value),

        active: true
    };

    if (!productData.name) {

        document.getElementById("message").innerText =
            "Product name is required";

        return;
    }

    if (!productData.description) {

        document.getElementById("message").innerText =
            "Product description is required";

        return;
    }

    if (isNaN(productData.price) || productData.price < 0) {

        document.getElementById("message").innerText =
            "Price must be zero or greater";

        return;
    }

    if (isNaN(productData.stock) || productData.stock < 0) {

        document.getElementById("message").innerText =
            "Stock must be zero or greater";

        return;
    }

    let url = "/products";
    let method = "POST";

    if (editingProductId !== null) {

        url = "/products/" + editingProductId;

        method = "PUT";
    }

    try {

        const response =
            await authorizedFetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(productData)
            });

        if (response.ok) {

            document.getElementById("message").innerText =
                editingProductId === null
                    ? "Product Created Successfully"
                    : "Product Updated Successfully";

            clearForm();

            document.getElementById("createProductSection").style.display = "none";

            await loadProducts();

        } else {

            document.getElementById("message").innerText =
                "Operation Failed";
        }

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Operation Failed";
    }
}

async function editProduct(id) {

    try {

        const response =
            await authorizedFetch("/products/" + id);

        const product =
            await response.json();

        editingProductId = id;
        document.getElementById("createProductSection").style.display = "block";

        document.getElementById("name").value =
            product.name;

        document.getElementById("description").value =
            product.description;

        document.getElementById("price").value =
            product.price;

        document.getElementById("stock").value =
            product.stock;

        document.getElementById("message").innerText =
            "Editing Product ID: " + id;

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Unable to load product.";
    }
}

async function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    try {

        const response =
            await authorizedFetch(
                "/products/" + id,
                {
                    method: "DELETE"
                }
            );

        if (response.ok) {

            document.getElementById("message").innerText =
                "Product Deleted Successfully";

            await loadProducts();

        } else {

            document.getElementById("message").innerText =
                "Delete Failed";
        }

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Delete Failed";
    }
}

function clearForm() {

    editingProductId = null;

    document.getElementById("name").value = "";

    document.getElementById("description").value = "";

    document.getElementById("price").value = "";

    document.getElementById("stock").value = "";
}

function goBack() {

    window.location.href =
        "dashboard.html";
}

if (
    role !== "ROOT" &&
    role !== "ADMIN"
) {

    if (createProductSection) {

        createProductSection.style.display = "none";

    }
}

loadProducts();

function toggleCreateProduct() {

    const section =
        document.getElementById("createProductSection");

    if (section.style.display === "none") {

        section.style.display = "block";

    } else {

        section.style.display = "none";

        clearForm();
    }

}