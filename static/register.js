// Register page - Frontend  Validation 

// ===========================
// Register Form Validation
// ===========================

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Stop form from submitting automatically

    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const confirmPass = document.getElementById("confirmPassword").value.trim();

    let errorMsg = "";

    // ---------------------------
    // 1. Validate Username
    // ---------------------------
    if (username.length < 3) {
        errorMsg = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z ]+$/.test(username)) {
        errorMsg = "Name should contain only letters.";
    }

    // ---------------------------
    // 2. Validate Email
    // ---------------------------
    else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errorMsg = "Please enter a valid email.";
    }

    // ---------------------------
    // 3. Validate Password
    // ---------------------------
    else if (pass.length < 6) {
        errorMsg = "Password must be at least 6 characters.";
    }

    // ---------------------------
    // 4. Confirm Password Match
    // ---------------------------
    else if (pass !== confirmPass) {
        errorMsg = "Passwords do not match.";
    }

    // ---------------------------
    // Show Error if Exists
    // ---------------------------
    const errorBox = document.getElementById("errorBox");
    if (errorMsg !== "") {
        errorBox.innerText = errorMsg;
        errorBox.style.display = "block";
        return;
    } else {
        errorBox.style.display = "none";
    }

    // ---------------------------
    // If Validation Passes → Send to Backend
    // ---------------------------
    registerUser(username, email, pass);
});

// ===========================
// Send Request to Backend
// ===========================
async function registerUser(username, email, password) {
    try {
        const response = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("errorBox").innerText = data.error;
            document.getElementById("errorBox").style.display = "block";
            return;
        }

        alert("Registration successful!");
        window.location.href = "login.html";

    } catch (error) {
        document.getElementById("errorBox").innerText = "Server error. Try again later.";
        document.getElementById("errorBox").style.display = "block";
    }
}
