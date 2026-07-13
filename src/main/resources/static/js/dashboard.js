checkAuthentication();

const name =
    localStorage.getItem("name") || "Unknown User";

const role =
    (localStorage.getItem("role") || "").toUpperCase();

console.log("Logged in Role:", role);

document.getElementById("welcomeMessage").innerText =
    "Welcome " + name;

document.getElementById("roleMessage").innerText =
    "Role: " + role;

function renderMetricCard(icon, label, value, detail) {
    return `
        <article class="metric-card">
            <span class="metric-icon">
                <i class="bi ${icon}"></i>
            </span>

            <p class="metric-label">${escapeHtml(label)}</p>

            <h2 class="metric-value">${escapeHtml(value)}</h2>

            <p class="mb-0 muted">${escapeHtml(detail)}</p>
        </article>
    `;
}

async function loadStats() {

    try {

        const response =
            await authorizedFetch("/dashboard/stats");

        if (!response.ok) {
            return;
        }

        const stats =
            await response.json();

        document.getElementById("stats").innerHTML = [
            renderMetricCard(
                "bi-people",
                "Total Users",
                stats.totalUsers,
                "Managed identities"
            ),
            renderMetricCard(
                "bi-box-seam",
                "Total Products",
                stats.totalProducts,
                "Inventory records"
            ),
            renderMetricCard(
                "bi-journal-text",
                "Total Audit Logs",
                stats.totalAuditLogs,
                "Recorded events"
            ),
            renderMetricCard(
                "bi-graph-up-arrow",
                "Revenue",
                "—",
                "Statistics placeholder"
            )
        ].join("");

    } catch (error) {

        console.error(error);

    }

}

function renderRecentLog(log) {
    return `
        <div class="activity-item">
            <span class="activity-dot"></span>

            <div>
                <strong>${escapeHtml(log.action || "System Event")}</strong>
                <small>
                    ${escapeHtml(log.performedBy || "UNKNOWN")}
                    ·
                    ${escapeHtml(formatDateTime(log.createdAt))}
                </small>
            </div>
        </div>
    `;
}

async function loadRecentLogs() {
    const recentActivity =
        document.getElementById("recentActivity");

    if (!recentActivity) {
        return;
    }

    try {
        const response =
            await authorizedFetch("/audit-logs");

        if (!response.ok) {
            recentActivity.innerHTML =
                `<div class="empty-state">Recent activity is available to ROOT users.</div>`;

            return;
        }

        const logs =
            await response.json();

        recentActivity.innerHTML =
            logs
                .slice()
                .reverse()
                .slice(0, 5)
                .map(renderRecentLog)
                .join("") ||
            `<div class="empty-state">No recent activity found.</div>`;

    } catch (error) {
        console.error(error);

        recentActivity.innerHTML =
            `<div class="empty-state">Unable to load recent activity.</div>`;
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

loadStats();
loadRecentLogs();
applyRolePermissions();
