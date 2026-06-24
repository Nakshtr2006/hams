function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function checkAuthentication() {
    const token = getToken();

    if (!token || token.trim() === "") {
        logout();
        return false;
    }

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