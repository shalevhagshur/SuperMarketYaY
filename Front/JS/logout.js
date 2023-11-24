document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    // Add click event listener to the logout button
    logoutBtn.addEventListener("click", async function () {
        try {
            // Implement your logout logic here, such as clearing session storage
            sessionStorage.removeItem('access_token');

            // Redirect to the login page after logout
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Logout error:", error);
            // Handle logout error if needed
        }
    });
});
