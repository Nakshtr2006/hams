const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

let editingUserId = null;

async function loadUsers() {

    const response =
        await fetch(
            "/users",
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

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

            buttons = `
                <button
                    onclick="editUser(${user.id})">
                    Edit
                </button>
            `;
        }

        html += `
            <div style="
                border:1px solid black;
                padding:10px;
                margin:10px;
            ">

                <h3>${user.name}</h3>

                <p>Email: ${user.email}</p>

                <p>Phone: ${user.phone}</p>

                <p>Role: ${user.role}</p>

                <p>Gender: ${user.gender}</p>

                ${buttons}

            </div>
        `;
    });

    document.getElementById(
        "users"
    ).innerHTML = html;
}

async function editUser(id) {

    const response =
        await fetch(
            "/users/" + id,
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

    const user =
        await response.json();

    editingUserId = id;

    const newName =
        prompt(
            "Enter Name",
            user.name
        );

    if (newName === null) {
        return;
    }

    const updatedUser = {
        ...user,
        name: newName
    };

    const updateResponse =
        await fetch(
            "/users/" + id,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        "Bearer " + token
                },

                body: JSON.stringify(
                    updatedUser
                )
            }
        );

    if (updateResponse.ok) {

        alert(
            "User Updated"
        );

        loadUsers();

    } else {

        alert(
            "Update Failed"
        );
    }
}

function goBack() {

    window.location.href =
        "dashboard.html";
}

loadUsers();