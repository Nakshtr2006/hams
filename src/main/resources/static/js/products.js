const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

let editingProductId = null;

async function loadProducts() {

    const response =
        await fetch(
            "/products",
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

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
                <button
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>
            `;
        }

        html += `
            <div style="
                border:1px solid black;
                padding:10px;
                margin:10px;
            ">

                <h3>${product.name}</h3>

                <p>
                    ${product.description}
                </p>

                <p>
                    Price: Rs. ${product.price}
                </p>

                <p>
                    Stock: ${product.stock}
                </p>

                ${buttons}

            </div>
        `;
    });

    document.getElementById(
        "products"
    ).innerHTML = html;
}

async function createProduct() {

    const productData = {

        name:
        document.getElementById(
            "name"
        ).value,

        description:
        document.getElementById(
            "description"
        ).value,

        price:
        document.getElementById(
            "price"
        ).value,

        stock:
        document.getElementById(
            "stock"
        ).value,

        active: true
    };

    let url = "/products";
    let method = "POST";

    if (editingProductId !== null) {

        url =
            "/products/" +
            editingProductId;

        method = "PUT";
    }

    const response =
        await fetch(
            url,
            {
                method: method,

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        "Bearer " + token
                },

                body: JSON.stringify(
                    productData
                )
            }
        );

    if (response.ok) {

        document.getElementById(
            "message"
        ).innerText =
            editingProductId === null
                ? "Product Created Successfully"
                : "Product Updated Successfully";

        clearForm();

        loadProducts();

    } else {

        document.getElementById(
            "message"
        ).innerText =
            "Operation Failed";
    }
}

async function editProduct(id) {

    const response =
        await fetch(
            "/products/" + id,
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

    const product =
        await response.json();

    editingProductId = id;

    document.getElementById(
        "name"
    ).value =
        product.name;

    document.getElementById(
        "description"
    ).value =
        product.description;

    document.getElementById(
        "price"
    ).value =
        product.price;

    document.getElementById(
        "stock"
    ).value =
        product.stock;

    document.getElementById(
        "message"
    ).innerText =
        "Editing Product ID: " + id;
}

async function deleteProduct(id) {

    const response =
        await fetch(
            "/products/" + id,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

    if (response.ok) {

        loadProducts();

    } else {

        alert(
            "Delete Failed"
        );
    }
}

function clearForm() {

    editingProductId = null;

    document.getElementById(
        "name"
    ).value = "";

    document.getElementById(
        "description"
    ).value = "";

    document.getElementById(
        "price"
    ).value = "";

    document.getElementById(
        "stock"
    ).value = "";
}

function goBack() {

    window.location.href =
        "dashboard.html";
}

if (
    role !== "ROOT" &&
    role !== "ADMIN"
) {

    document.getElementById(
        "name"
    ).style.display = "none";

    document.getElementById(
        "description"
    ).style.display = "none";

    document.getElementById(
        "price"
    ).style.display = "none";

    document.getElementById(
        "stock"
    ).style.display = "none";
}

loadProducts();