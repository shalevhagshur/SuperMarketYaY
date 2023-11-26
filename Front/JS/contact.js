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

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const MY_SERVER = "http://127.0.0.1:8000/"
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        fetch(MY_SERVER + "contact/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",  // Set Content-Type to application/json
            },
            body: JSON.stringify(jsonData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Thank you for contacting us! We will get back to you soon.");
                } else {
                    alert("Error submitting the form. Please try again later.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
});

