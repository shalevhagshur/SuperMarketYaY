document.addEventListener("DOMContentLoaded", async function () {
    const welcomeContainer = document.getElementById("welcomeContainer");
    const loginNavItem = document.getElementById("loginNavItem");
    const registerNavItem = document.getElementById("registerNavItem");
    const orderHistoryNavItem = document.getElementById("orderHistoryNavItem");
    const logoutNavItem = document.getElementById("logoutNavItem");

    const MY_SERVER = "https://retrysupermarket.onrender.com/";

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
                alert("Password Or Username Are Incorrect");
                // console.error("Invalid response format:", response);
            }
        } catch (error) {
            // Handle login error
            alert("Password Or Username Are Incorrect");
        }
    });
});
