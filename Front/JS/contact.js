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
