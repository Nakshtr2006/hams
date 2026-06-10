async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const response =
        await fetch(
            "/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

    const data =
        await response.json();

    if (response.ok) {

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "email",
            data.email
        );

        localStorage.setItem(
            "name",
            data.name
        );

        localStorage.setItem(
            "role",
            data.role
        );

        window.location.href =
            "dashboard.html";

    } else {

        document.getElementById(
            "message"
        ).innerText =
            "Login Failed";
    }
}