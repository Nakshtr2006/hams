function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");
}

function loadProfile() {
    const profileName =
        document.getElementById("profileName");

    const profileRole =
        document.getElementById("profileRole");

    const profileInitials =
        document.getElementById("profileInitials");

    if (!profileName && !profileRole && !profileInitials) {
        return;
    }

    const name =
        localStorage.getItem("name") || "Unknown User";

    const role =
        localStorage.getItem("role") || "";

    if (profileName) {
        profileName.innerText = name;
    }

    if (profileRole) {
        profileRole.innerText = role;
    }

    if (profileInitials) {
        profileInitials.innerText = getInitials(name);
    }
}

function setActiveSidebarItem() {
    const page =
        window.location.pathname.split("/").pop() || "dashboard.html";

    document
        .querySelectorAll("[data-nav]")
        .forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === page
            );
        });
}

function toggleSidebar(forceOpen) {
    const shouldOpen =
        typeof forceOpen === "boolean"
            ? forceOpen
            : !document.body.classList.contains("sidebar-open");

    document.body.classList.toggle("sidebar-open", shouldOpen);
}

function checkAuthentication() {
    const token = getToken();

    if (!token || token.trim() === "") {
        logout();
        return false;
    }

    loadProfile();
    setActiveSidebarItem();

    return true;
}

async function authorizedFetch(url, options = {}) {

    const token = getToken();

    options.headers = {
        ...(options.headers || {}),
        Authorization: "Bearer " + token
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
        logout();
        throw new Error("Unauthorized");
    }

    return response;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });
}

function formatDateTime(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function getModal(id) {
    const element =
        document.getElementById(id);

    if (
        !element ||
        !window.bootstrap ||
        !element.classList.contains("modal")
    ) {
        return null;
    }

    return bootstrap.Modal.getOrCreateInstance(element);
}

function showModal(id) {
    const modal = getModal(id);
    const element = document.getElementById(id);

    if (modal) {
        modal.show();
        return;
    }

    if (element) {
        element.style.display = "block";
    }
}

function hideModal(id) {
    const modal = getModal(id);
    const element = document.getElementById(id);

    if (modal) {
        modal.hide();
        return;
    }

    if (element) {
        element.style.display = "none";
    }
}

function setMessage(message, type = "info") {
    const messageElement =
        document.getElementById("message");

    if (messageElement) {
        messageElement.innerText = message;
    }

    if (message) {
        showToast(message, type);
    }
}

function showToast(message, type = "info") {
    const container =
        document.getElementById("toastContainer");

    if (!container || !window.bootstrap) {
        return;
    }

    const toast =
        document.createElement("div");

    toast.className = "toast align-items-center";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${escapeHtml(message)}
            </div>
            <button
                    type="button"
                    class="btn-close me-2 m-auto"
                    data-bs-dismiss="toast"
                    aria-label="Close">
            </button>
        </div>
    `;

    toast.dataset.type = type;
    container.appendChild(toast);

    const instance =
        bootstrap.Toast.getOrCreateInstance(toast, {
            delay: 2600
        });

    toast.addEventListener("hidden.bs.toast", () => {
        toast.remove();
    });

    instance.show();
}

function setupLiveSearch(inputId, rowSelector) {
    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (input.dataset.searchBound !== "true") {
        input.addEventListener("input", () => {
            applyLiveSearch(input, rowSelector);
        });

        input.dataset.searchBound = "true";
    }

    applyLiveSearch(input, rowSelector);
}

function applyLiveSearch(input, rowSelector) {
    const query =
        input.value.trim().toLowerCase();

    document
        .querySelectorAll(rowSelector)
        .forEach(row => {
            const text =
                (row.dataset.searchText || row.innerText).toLowerCase();

            row.style.display =
                text.includes(query) ? "" : "none";
        });
}

document.addEventListener("DOMContentLoaded", () => {
    setActiveSidebarItem();

    if (getToken()) {
        loadProfile();
    }
});
