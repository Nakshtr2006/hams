const token =
    localStorage.getItem("token");

async function loadLogs() {

    const response =
        await fetch(
            "/audit-logs",
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );

    const logs =
        await response.json();

    let html = "";

    logs.reverse().forEach(log => {

        html += `
            <div style="
                border:1px solid black;
                padding:10px;
                margin:10px;
            ">

                <h3>${log.action}</h3>

                <p>
                    Performed By:
                    ${log.performedBy}
                </p>

                <p>
                    Time:
                    ${log.createdAt}
                </p>

            </div>
        `;
    });

    document.getElementById(
        "logs"
    ).innerHTML = html;
}

function goBack() {

    window.location.href =
        "dashboard.html";
}

loadLogs();