checkAuthentication();

const name = localStorage.getItem("name");
const role = (localStorage.getItem("role") || "").toUpperCase();

console.log("Logged in Role:", role);

document.getElementById("welcomeMessage").innerText =
    "Welcome " + name;

document.getElementById("roleMessage").innerText =
    "Role: " + role;

async function loadStats() {

    try {

        const response =
            await authorizedFetch("/dashboard/stats");

        const stats =
            await response.json();

        document.getElementById("stats").innerHTML = `
            <h3>Total Users: ${stats.totalUsers}</h3>
            <h3>Total Products: ${stats.totalProducts}</h3>
            <h3>Total Audit Logs: ${stats.totalAuditLogs}</h3>
        `;

    } catch (error) {

        console.error(error);

    }

}

function applyRolePermissions() {

    console.log("Applying permissions for:", role);

    const usersButton =
        document.querySelector('[data-testid="users-button"]');

    const auditButton =
        document.querySelector('[data-testid="auditlogs-button"]');

    switch (role) {

        case "ROOT":

            console.log("ROOT -> Full Access");

            break;

        case "ADMIN":

            console.log("ADMIN -> Hide Audit Logs");

            if (auditButton) {
                auditButton.style.display = "none";
            }

            break;

        case "MANAGER":

            console.log("MANAGER -> Hide Audit Logs");

            if (auditButton) {
                auditButton.style.display = "none";
            }

            break;

        case "EMPLOYEE":

            console.log("EMPLOYEE -> Hide Audit Logs");

            if (auditButton) {
                auditButton.style.display = "none";
            }

            break;

        case "CUSTOMER":

            console.log("CUSTOMER -> Hide Users & Audit Logs");

            if (usersButton) {
                usersButton.style.display = "none";
            }

            if (auditButton) {
                auditButton.style.display = "none";
            }

            break;

        default:

            console.log("Unknown Role:", role);

            break;

    }

}

function goToProducts() {

    window.location.href = "products.html";

}

function goToUsers() {

    window.location.href = "users.html";

}

function goToAuditLogs() {

    window.location.href = "auditlogs.html";

}

function logout() {

    localStorage.clear();

    window.location.href = "login.html";

}

loadStats();
applyRolePermissions();