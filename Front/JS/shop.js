
document.addEventListener("DOMContentLoaded", async function () {
    const welcomeContainer = document.getElementById("welcomeContainer");
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
            } else {
                // No user logged in
                welcomeContainer.innerHTML = '<p>No user logged in currently.</p>';
            }
        } catch (error) {
            console.error("Error checking logged-in user:", error);
        }
    };

    checkLoggedInUser();
});
