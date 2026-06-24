checkAuthentication();

const role =
    localStorage.getItem("role");

async function loadLogs() {

    try {

        const response =
            await authorizedFetch("/audit-logs");

        if (!response.ok) {

            document.getElementById("message").innerText =
                "Failed to load audit logs.";

            return;

        }

        const logs =
            await response.json();

        let html = "";

        logs
            .slice()
            .reverse()
            .forEach(log => {

                html += `
                    <div
                        class="product-card"
                        data-testid="audit-log-card">

                        <h3>${log.action}</h3>

                        <p>
                            <strong>Performed By:</strong>
                            ${log.performedBy}
                        </p>

                        <p>
                            <strong>Time:</strong>
                            ${log.createdAt}
                        </p>

                    </div>
                `;

            });

        document.getElementById("logs").innerHTML =
            html;

        document.getElementById("message").innerText =
            "Audit Logs Loaded Successfully";

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Failed to load audit logs.";

    }

}

function goBack() {

    window.location.href =
        "dashboard.html";

}

loadLogs();