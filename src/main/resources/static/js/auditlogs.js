checkAuthentication();

const role =
    localStorage.getItem("role");

function getAuditDetails(log) {
    const actionText =
        log.action || "System Event";

    const match =
        actionText.match(/^(Created|Updated|Deleted)\s+([^:]+):\s*(.+)$/i);

    if (!match) {
        return {
            action: actionText,
            entity: "System",
            description: actionText,
            result: "Success"
        };
    }

    return {
        action: match[1],
        entity: match[2],
        description: actionText,
        result: "Success"
    };
}

function renderAuditLogRow(log) {
    const details =
        getAuditDetails(log);

    const timestamp =
        formatDateTime(log.createdAt);

    const searchText = [
        timestamp,
        log.performedBy,
        details.action,
        details.entity,
        details.description,
        details.result
    ].join(" ");

    return `
        <tr
                class="product-card"
                data-testid="audit-log-card"
                data-search-text="${escapeHtml(searchText)}">
            <td>
                <span class="cell-title">${escapeHtml(timestamp)}</span>
            </td>

            <td>${escapeHtml(log.performedBy || "UNKNOWN")}</td>

            <td>
                <span class="status-badge success">
                    ${escapeHtml(details.action)}
                </span>
            </td>

            <td>${escapeHtml(details.entity)}</td>

            <td>
                <div class="cell-truncate audit-description">
                    ${escapeHtml(details.description)}
                </div>
            </td>

            <td>
                <span class="status-badge active">
                    ${escapeHtml(details.result)}
                </span>
            </td>
        </tr>
    `;
}

async function loadLogs() {

    try {

        const response =
            await authorizedFetch("/audit-logs");

        if (!response.ok) {

            document.getElementById("logs").innerHTML =
                `
                    <tr>
                        <td colspan="6" class="empty-state">
                            Audit logs are not available for this account.
                        </td>
                    </tr>
                `;

            setMessage("Failed to load audit logs.", "danger");

            return;

        }

        const logs =
            await response.json();

        const rows =
            logs
                .slice()
                .reverse()
                .map(renderAuditLogRow)
                .join("");

        document.getElementById("logs").innerHTML =
            rows ||
            `
                <tr>
                    <td colspan="6" class="empty-state">
                        No audit logs found.
                    </td>
                </tr>
            `;

        setupLiveSearch(
            "search",
            "#logs tr[data-testid='audit-log-card']"
        );

        setMessage("Audit Logs Loaded Successfully", "success");

    } catch (error) {

        console.error(error);

        setMessage("Failed to load audit logs.", "danger");

    }

}

function goBack() {

    window.location.href =
        "dashboard.html";

}

loadLogs();
