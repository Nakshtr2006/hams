checkAuthentication();

const role = localStorage.getItem("role");

const createUserSection =
    document.getElementById("createUserSection");

let editingUserId = null;

async function loadUsers() {

    try {

        const response =
            await authorizedFetch("/users");

        const users =
            await response.json();

        let html = "";

        users.forEach(user => {

            let buttons = "";

            if (
                role === "ROOT" ||
                role === "ADMIN" ||
                role === "MANAGER"
            ) {

                buttons += `
                    <button
                        data-testid="edit-button"
                        onclick="editUser(${user.id})">
                        Edit
                    </button>
                `;
            }

            if (
                role === "ROOT"
            ) {

                buttons += `
                    <button
                        data-testid="delete-button"
                        onclick="deleteUser(${user.id})">
                        Delete
                    </button>
                `;
            }

            html += `
                <div
                    class="product-card"
                    data-testid="user-card">

                    <h3>${user.name}</h3>

                    <p>Email: ${user.email}</p>

                    <p>Phone: ${user.phone}</p>

                    <p>Role: ${user.role}</p>

                    <p>Gender: ${user.gender}</p>

                    ${buttons}

                </div>
            `;

        });

        document.getElementById("users").innerHTML = html;

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Failed to load users.";

    }

}

async function createUser() {

    const user = {

        name:
            document.getElementById("name").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        password:
        document.getElementById("password").value,

        phone:
            document.getElementById("phone").value.trim(),

        gender:
        document.getElementById("gender").value,

        role:
        document.getElementById("role").value,

        active: true

    };

    if (!user.name) {

        document.getElementById("message").innerText =
            "Name is required";

        return;

    }

    if (!user.email) {

        document.getElementById("message").innerText =
            "Email is required";

        return;

    }

    if (

        editingUserId === null &&

        !user.password

    ) {

        document.getElementById("message").innerText =
            "Password is required";

        return;

    }

    if (!user.phone) {

        document.getElementById("message").innerText =
            "Phone is required";

        return;

    }

    if (!user.gender) {

        document.getElementById("message").innerText =
            "Gender is required";

        return;

    }

    if (!user.role) {

        document.getElementById("message").innerText =
            "Role is required";

        return;

    }

    let url = "/users";

    let method = "POST";

    let body = user;

    if (editingUserId !== null) {

        url = "/users/" + editingUserId;

        method = "PUT";

        body = {

            name: user.name,

            phone: user.phone,

            gender: user.gender,

            role: user.role,

            active: true

        };

    }

    try {

        const response =
            await authorizedFetch(url, {

                method: method,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)

            });

        if (response.ok) {

            document.getElementById("message").innerText =

                editingUserId === null

                    ? "User Created Successfully"

                    : "User Updated Successfully";

            clearForm();

            loadUsers();

        } else {

            const error =
                await response.text();

            document.getElementById("message").innerText =
                error;

        }

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Operation Failed";

    }

}

async function editUser(id) {

    try {

        const response =
            await authorizedFetch(
                "/users/" + id
            );

        const user =
            await response.json();

        editingUserId = id;

        document.getElementById("name").value =
            user.name;

        document.getElementById("email").value =
            user.email;

        document.getElementById("password").value =
            "";

        document.getElementById("phone").value =
            user.phone;

        document.getElementById("gender").value =
            user.gender;

        document.getElementById("role").value =
            user.role;

        document.getElementById("email").disabled = true;

        document.getElementById("password").disabled = true;

        document.getElementById("createButton").innerText =
            "Update User";

        document.getElementById("message").innerText =
            "Editing User";

    } catch (error) {

        console.error(error);

    }

}

async function deleteUser(id) {

    if (!confirm("Delete User?")) {

        return;

    }

    try {

        const response =
            await authorizedFetch(
                "/users/" + id,
                {
                    method: "DELETE"
                }
            );

        if (response.ok) {

            document.getElementById("message").innerText =
                "User Deleted Successfully";

            loadUsers();

        } else {

            document.getElementById("message").innerText =
                "Delete Failed";

        }

    } catch (error) {

        console.error(error);

    }

}

function clearForm() {

    editingUserId = null;

    document.getElementById("name").value = "";

    document.getElementById("email").value = "";

    document.getElementById("password").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("gender").value = "";

    document.getElementById("role").value = "";

    document.getElementById("email").disabled = false;

    document.getElementById("password").disabled = false;

    document.getElementById("createButton").innerText =
        "Create User";

}

function goBack() {

    window.location.href =
        "dashboard.html";

}

if (
    role !== "ROOT"
) {

    if (createUserSection) {

        createUserSection.style.display = "none";

    }

}

loadUsers();