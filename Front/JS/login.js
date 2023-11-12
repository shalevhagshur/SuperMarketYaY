// user_info.js

document.addEventListener("DOMContentLoaded", async function () {
    const MY_SERVER = "http://127.0.0.1:8000/";

    // Check if a user is already logged in
    const checkLoggedInUser = async () => {
        try {
            const response = await axios.get(MY_SERVER + "get_current_user/", {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
            });

            const welcomeContainer = document.getElementById("welcomeContainer");

            if (response && response.data && response.data.username) {
                // Display welcome message
                welcomeContainer.innerHTML = `<p>Welcome back, ${response.data.username}!</p>`;
            } else {
                // No user logged in
                welcomeContainer.innerHTML = '<p>No user logged in currently.</p>';
            }
        } catch (error) {
            console.error("Error checking logged-in user:", error);
        }
    };

    // Check and display logged-in user on page load
    checkLoggedInUser();

    // Add event listener for login form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Serialize form data to JSON
        const formData = {};
        new FormData(loginForm).forEach((value, key) => {
            formData[key] = value;
        });

        try {
            const response = await axios.post(MY_SERVER + "token/", formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response has data property before accessing it
            if (response && response.data && response.data.access) {
                // Save access token in session storage
                sessionStorage.setItem('access_token', response.data.access);

                // Display alert for successful login
                alert("Login successful!");

                // Clear form fields
                loginForm.reset();

                // Update and display logged-in user
                checkLoggedInUser();
            } else {
                console.error("Invalid response format:", response);
            }
        } catch (error) {
            // Handle login error
            console.error("Login error:", error.response ? error.response.data : error.message);
        }
    });
});
