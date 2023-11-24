document.addEventListener("DOMContentLoaded", async function () {
    const usernameElement = document.getElementById("username");
    const orderOptions = document.getElementById("orderOptions");
    const orderCards = document.getElementById("orderCards");
    const MY_SERVER = "http://127.0.0.1:8000/"

    // Get the username from session storage
    const username = sessionStorage.getItem("username");
    if (username) {
        usernameElement.textContent = username;
    }

    // Fetch and display orders based on user selection
    orderOptions.addEventListener("change", async function () {
        const selectedOption = orderOptions.value;

        try {
            // Implement logic to fetch orders based on the selected option
            let orders = [];

            if (selectedOption === "all") {
                // Fetch all orders
                orders = await axios.get(`${MY_SERVER}orders/`);
            } else if (selectedOption === "recent") {
                // Fetch the three most recent orders
                orders = await axios.get(`${MY_SERVER}orders/<int:pk>/`);
            }

            // Display orders using Bootstrap cards
            displayOrders(orders.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            // Handle error if needed
        }
    });

    // Function to display orders using Bootstrap cards
    function displayOrders(orders) {
        orderCards.innerHTML = ""; // Clear previous orders

        orders.forEach((order) => {
            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-4");

            // Customize the card content based on your order structure
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order #${order.orderNumber}</h5>
                        <!-- Add additional order details here -->
                    </div>
                </div>
            `;

            orderCards.appendChild(card);
        });
    }
});
