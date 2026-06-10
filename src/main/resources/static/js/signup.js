async function signup() {

    const response = await fetch(
        "/auth/signup",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name:
                document.getElementById("name").value,

                email:
                document.getElementById("email").value,

                password:
                document.getElementById("password").value,

                phone:
                document.getElementById("phone").value,

                gender:
                document.getElementById("gender").value
            })
        }
    );

    const message =
        document.getElementById("message");

    if (response.ok) {

        message.innerText =
            "Signup Successful";

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);

    } else {

        const errorData =
            await response.json();

        let errors = "";

        for (const key in errorData) {

            errors +=
                errorData[key] + "\n";
        }

        message.innerText = errors;
    }
}