checkAuthentication();

const role =
    (localStorage.getItem("role") || "").toUpperCase();

const canCreateUsers =
    role === "ROOT";

const canEditUsers =
    role === "ROOT" ||
    role === "ADMIN" ||
    role === "MANAGER";

const canDeleteUsers =
    role === "ROOT";

let editingUserId = null;

function getRoleBadge(roleName) {
    const value =
        roleName || "UNKNOWN";

    return `
        <span class="role-badge ${escapeHtml(value.toLowerCase())}">
            ${escapeHtml(value)}
        </span>
    `;
}

function getUserStatus(user) {
    if (user.active === false) {
        return `
            <span class="status-badge inactive">
                Inactive
            </span>
        `;
    }

    return `
        <span class="status-badge active">
            Active
        </span>
    `;
}

function getUserActions(userId) {
    let buttons = "";

    if (canEditUsers) {

        buttons += `
            <button
                    class="icon-btn edit-btn"
                    data-testid="edit-button"
                    onclick="editUser(${userId})"
                    aria-label="Edit user">
                <i class="bi bi-pencil"></i>
            </button>
        `;
    }

    if (canDeleteUsers) {

        buttons += `
            <button
                    class="icon-btn delete-btn"
                    data-testid="delete-button"
                    onclick="deleteUser(${userId})"
                    aria-label="Delete user">
                <i class="bi bi-trash"></i>
            </button>
        `;
    }

    if (!buttons) {
        return `<span class="muted">No actions</span>`;
    }

    return `
        <div class="row-actions">
            ${buttons}
        </div>
    `;
}

function renderUserRow(user) {
    const statusText =
        user.active === false ? "Inactive" : "Active";

    const searchText = [
        user.name,
        user.email,
        user.phone,
        user.role,
        statusText
    ].join(" ");

    return `
        <tr
                class="product-card"
                data-testid="user-card"
                data-search-text="${escapeHtml(searchText)}">
            <td class="user-identity">
                <strong class="cell-title">${escapeHtml(user.name)}</strong>
            </td>

            <td>
                <span class="user-contact">${escapeHtml(user.email)}</span>
            </td>

            <td>${escapeHtml(user.phone)}</td>

            <td>${getRoleBadge(user.role)}</td>

            <td>${getUserStatus(user)}</td>

            <td class="user-actions-cell">
                ${getUserActions(user.id)}
            </td>
        </tr>
    `;
}

async function loadUsers() {

    try {

        const response =
            await authorizedFetch("/users");

        if (!response.ok) {
            setMessage("Failed to load users.", "danger");
            return;
        }

        const users =
            await response.json();

        const rows =
            users.map(renderUserRow).join("");

        document.getElementById("users").innerHTML =
            rows ||
            `
                <tr>
                    <td colspan="6" class="empty-state">
                        No users found.
                    </td>
                </tr>
            `;

        setupLiveSearch(
            "search",
            "#users tr[data-testid='user-card']"
        );

    } catch (error) {

        console.error(error);

        setMessage("Failed to load users.", "danger");

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

        setMessage("Name is required", "warning");

        return;

    }

    if (!user.email) {

        setMessage("Email is required", "warning");

        return;

    }

    if (

        editingUserId === null &&

        !user.password

    ) {

        setMessage("Password is required", "warning");

        return;

    }

    if (!user.phone) {

        setMessage("Phone is required", "warning");

        return;

    }

    if (!user.gender) {

        setMessage("Gender is required", "warning");

        return;

    }

    if (!user.role) {

        setMessage("Role is required", "warning");

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

            setMessage(
                editingUserId === null
                    ? "User Created Successfully"
                    : "User Updated Successfully",
                "success"
            );

            clearForm();

            hideModal("createUserSection");

            await loadUsers();

        } else {

            const error =
                await response.text();

            setMessage(error, "danger");

        }

    } catch (error) {

        console.error(error);

        setMessage("Operation Failed", "danger");

    }

}

async function editUser(id) {

    try {

        const response =
            await authorizedFetch(
                "/users/" + id
            );

        if (!response.ok) {
            setMessage("Operation Failed", "danger");
            return;
        }

        const user =
            await response.json();

        editingUserId = id;

        document.getElementById("userModalTitle").innerText =
            "Edit User";

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

        showModal("createUserSection");

        setMessage("Editing User");

    } catch (error) {

        console.error(error);

        setMessage("Operation Failed", "danger");

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

            setMessage("User Deleted Successfully", "success");

            await loadUsers();

        } else {

            setMessage("Delete Failed", "danger");

        }

    } catch (error) {

        console.error(error);

        setMessage("Delete Failed", "danger");

    }

}

function clearForm() {

    editingUserId = null;

    document.getElementById("userModalTitle").innerText =
        "New User";

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

function toggleCreateUser() {

    if (!canCreateUsers) {
        return;
    }

    clearForm();
    showModal("createUserSection");
}

function goBack() {

    window.location.href =
        "dashboard.html";

}

if (!canCreateUsers) {

    const openCreateUserButton =
        document.getElementById("openCreateUserButton");

    if (openCreateUserButton) {

        openCreateUserButton.style.display = "none";

    }

}

const createUserSection =
    document.getElementById("createUserSection");

if (createUserSection) {
    createUserSection.addEventListener("hidden.bs.modal", () => {
        clearForm();
    });
}

loadUsers();
