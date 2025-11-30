// Login page - Frontend  Validation 
const API_BASE = "http://127.0.0.1:5000";

// ------------------------------
// Validation & Login function
// ------------------------------
async function loginUser() {
    // Reset error messages
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("serverError").textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let isValid = true;

    // ----- Frontend validation -----

    if (email === "") {
        document.getElementById("emailError").textContent = "Email is required.";
        isValid = false;
    } else if (!email.includes("@")) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        isValid = false;
    }

    if (password === "") {
        document.getElementById("passwordError").textContent = "Password is required.";
        isValid = false;
    }

    if (!isValid) return;

    // ----- Send login request -----
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("serverError").textContent =
                data.error || "Login failed.";
            return;
        }

        // Save token + username
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);

        // Redirect to tasks page
        window.location.href = "index.html";

    } catch (err) {
        document.getElementById("serverError").textContent =
            "Server error. Try again later.";
        console.error(err);
    }
}
