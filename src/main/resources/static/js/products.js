checkAuthentication();

const role =
    (localStorage.getItem("role") || "").toUpperCase();

const canManageProducts =
    role === "ROOT" ||
    role === "ADMIN";

let editingProductId = null;

function getProductStatus(product) {
    if (product.stock === 0) {
        return {
            label: "Out of Stock",
            className: "out"
        };
    }

    if (product.stock <= 5) {
        return {
            label: "Low Stock",
            className: "low"
        };
    }

    return {
        label: "In Stock",
        className: "active"
    };
}

function getProductActions(productId) {
    if (!canManageProducts) {
        return "";
    }

    return `
        <div class="row-actions">
            <button
                    class="icon-btn edit-btn"
                    data-testid="edit-button"
                    onclick="editProduct(${productId})"
                    aria-label="Edit product">
                <i class="bi bi-pencil"></i>
            </button>

            <button
                    class="icon-btn delete-btn"
                    data-testid="delete-button"
                    onclick="deleteProduct(${productId})"
                    aria-label="Delete product">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
}

function renderProductRow(product) {
    const status =
        getProductStatus(product);

    const searchText = [
        product.name,
        product.description,
        product.price,
        product.stock,
        status.label
    ].join(" ");

    return `
        <tr
                data-testid="product-card"
                data-product-name="${escapeHtml(product.name)}"
                data-search-text="${escapeHtml(searchText)}">
            <td class="product-name">
                <strong class="cell-title">${escapeHtml(product.name)}</strong>
            </td>

            <td>
                <div class="cell-truncate product-description">
                    ${escapeHtml(product.description)}
                </div>
            </td>

            <td>${formatCurrency(product.price)}</td>

            <td>
                <span class="stock-count">${escapeHtml(product.stock)}</span>
            </td>

            <td>
                <span class="status-badge ${status.className}">
                    ${status.label}
                </span>
            </td>

            <td>
                ${getProductActions(product.id)}
            </td>
        </tr>
    `;
}

async function loadProducts() {

    try {

        const response =
            await authorizedFetch("/products");

        if (!response.ok) {
            setMessage("Failed to load products.", "danger");
            return;
        }

        const products =
            await response.json();

        const rows =
            products.map(renderProductRow).join("");

        document.getElementById("products").innerHTML =
            rows ||
            `
                <tr>
                    <td colspan="6" class="empty-state">
                        No products found.
                    </td>
                </tr>
            `;

        setupLiveSearch(
            "search",
            "#products tr[data-testid='product-card']"
        );

    } catch (error) {

        console.error(error);

        setMessage("Failed to load products.", "danger");
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

        setMessage("Product name is required", "warning");

        return;
    }

    if (!productData.description) {

        setMessage("Product description is required", "warning");

        return;
    }

    if (isNaN(productData.price) || productData.price < 0) {

        setMessage("Price must be zero or greater", "warning");

        return;
    }

    if (isNaN(productData.stock) || productData.stock < 0) {

        setMessage("Stock must be zero or greater", "warning");

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

            setMessage(
                editingProductId === null
                    ? "Product Created Successfully"
                    : "Product Updated Successfully",
                "success"
            );

            clearForm();

            hideModal("createProductSection");

            await loadProducts();

        } else {

            setMessage("Operation Failed", "danger");
        }

    } catch (error) {

        console.error(error);

        setMessage("Operation Failed", "danger");
    }
}

async function editProduct(id) {

    try {

        const response =
            await authorizedFetch("/products/" + id);

        if (!response.ok) {
            setMessage("Unable to load product.", "danger");
            return;
        }

        const product =
            await response.json();

        editingProductId = id;

        document.getElementById("productModalTitle").innerText =
            "Edit Product";

        document.getElementById("name").value =
            product.name;

        document.getElementById("description").value =
            product.description;

        document.getElementById("price").value =
            product.price;

        document.getElementById("stock").value =
            product.stock;

        showModal("createProductSection");

        setMessage("Editing Product ID: " + id);

    } catch (error) {

        console.error(error);

        setMessage("Unable to load product.", "danger");
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

            setMessage("Product Deleted Successfully", "success");

            await loadProducts();

        } else {

            setMessage("Delete Failed", "danger");
        }

    } catch (error) {

        console.error(error);

        setMessage("Delete Failed", "danger");
    }
}

function clearForm() {

    editingProductId = null;

    document.getElementById("productModalTitle").innerText =
        "New Product";

    document.getElementById("name").value = "";

    document.getElementById("description").value = "";

    document.getElementById("price").value = "";

    document.getElementById("stock").value = "";
}

function goBack() {

    window.location.href =
        "dashboard.html";
}

function toggleCreateProduct() {

    if (!canManageProducts) {
        return;
    }

    clearForm();
    showModal("createProductSection");
}

if (!canManageProducts) {
    const createButton =
        document.getElementById("createButton");

    if (createButton) {
        createButton.style.display = "none";
    }
}

const createProductSection =
    document.getElementById("createProductSection");

if (createProductSection) {
    createProductSection.addEventListener("hidden.bs.modal", () => {
        clearForm();
    });
}

loadProducts();
