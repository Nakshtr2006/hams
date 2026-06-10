const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "login.html";
}

const name =
    localStorage.getItem("name");

const role =
    localStorage.getItem("role");

document.getElementById(
    "welcomeMessage"
).innerText =
    "Welcome " + name;

document.getElementById(
    "roleMessage"
).innerText =
    "Role: " + role;

async function loadStats() {

    try {

        const response =
            await fetch(
                "/dashboard/stats"
            );

        const stats =
            await response.json();

        document.getElementById(
            "stats"
        ).innerHTML = `
            <h3>Total Users: ${stats.totalUsers}</h3>
            <h3>Total Products: ${stats.totalProducts}</h3>
            <h3>Total Audit Logs: ${stats.totalAuditLogs}</h3>
        `;

    } catch(error) {

        console.error(error);
    }
}

function applyRolePermissions() {

    const usersButton =
        document.querySelector(
            'button[onclick="goToUsers()"]'
        );

    const auditButton =
        document.querySelector(
            'button[onclick="goToAuditLogs()"]'
        );

    switch(role) {

        case "ROOT":
            break;

        case "ADMIN":

            if (auditButton) {
                auditButton.style.display =
                    "none";
            }

            break;

        case "MANAGER":

            if (auditButton) {
                auditButton.style.display =
                    "none";
            }

            break;

        case "EMPLOYEE":

            if (auditButton) {
                auditButton.style.display =
                    "none";
            }

            break;

        case "CUSTOMER":

            if (usersButton) {
                usersButton.style.display =
                    "none";
            }

            if (auditButton) {
                auditButton.style.display =
                    "none";
            }

            break;
    }
}

function goToProducts() {

    window.location.href =
        "products.html";
}

function goToUsers() {

    window.location.href =
        "users.html";
}

function goToAuditLogs() {

    window.location.href =
        "auditlogs.html";
}

function logout() {

    localStorage.clear();

    window.location.href =
        "login.html";
}

loadStats();
applyRolePermissions();