document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const MY_SERVER = "http://127.0.0.1:8000/";

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Serialize form data to JSON
        const formData = {};
        new FormData(registerForm).forEach((value, key) => {
            formData[key] = value;
        });

        // Perform registration logic
        try {
            const response = await axios.post(MY_SERVER + "register/", formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response has data property before accessing it
            if (response && response.data) {
                // Handle successful registration
                console.log("Registration successful:", response.data);
                // Redirect to the home page or show a success message
            } else {
                console.error("Invalid response format:", response);
            }
        } catch (error) {
            // Handle registration error
            if (error.response) {
                // The request was made and the server responded with a status code
                // Display specific error messages based on the response status or data
                console.error("Registration failed with status:", error.response.status);
                if (error.response.data && error.response.data.errors) {
                    alert("User not created because: " + Object.values(error.response.data.errors).flat().join(" "));
                } else {
                    alert("User not created due to registration error.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                alert("User not created. No response received from the server.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up the request:", error.message);
                alert("User not created due to an internal error.");
            }
        }
    });
});

// user_info.js

document.addEventListener("DOMContentLoaded", async function () {
    const welcomeContainer = document.getElementById("welcomeContainer");
    const loginNavItem = document.getElementById("loginNavItem");
    const registerNavItem = document.getElementById("registerNavItem");
    const orderHistoryNavItem = document.getElementById("orderHistoryNavItem");
    const logoutNavItem = document.getElementById("logoutNavItem");

    const MY_SERVER = "http://127.0.0.1:8000/";

    // Check if a user is already logged in
    const checkLoggedInUser = async () => {
        try {
            const response = await axios.get(MY_SERVER + "get_current_user/", {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
            });

            if (response && response.data && response.data.username) {
                // Display welcome message
                welcomeContainer.innerHTML = `<p>Welcome back, ${response.data.username}!</p>`;

                // If the user is logged in, show Order History and Logout, hide Login and Register
                orderHistoryNavItem.style.display = "block";
                logoutNavItem.style.display = "block";
                loginNavItem.style.display = "none";
                registerNavItem.style.display = "none";
            } else {
                // No user logged in
                welcomeContainer.innerHTML = '<p>No user logged in currently.</p>';

                // If no user is logged in, show Login and Register, hide Order History and Logout
                orderHistoryNavItem.style.display = "none";
                logoutNavItem.style.display = "none";
                loginNavItem.style.display = "block";
                registerNavItem.style.display = "block";
            }
        } catch (error) {
            console.error("Error checking logged-in user:", error);
        }
    };

    checkLoggedInUser();
});
