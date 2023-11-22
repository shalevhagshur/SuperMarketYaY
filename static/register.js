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
            console.error("Registration error:", error.response ? error.response.data : error.message);
            // Display error message to the user
        }
    });
});
