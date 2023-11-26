

document.addEventListener("DOMContentLoaded", async function () {
    const usernameElement = document.getElementById("username");
    const orderOptions = document.getElementById("orderOptions");
    const orderCards = document.getElementById("orderCards");
    const MY_SERVER = "http://127.0.0.1:8000/";

    // Get the access token from session storage
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
        // Fetch and decode the payload of the access token to get the username
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
        const username = tokenPayload.username;
        usernameElement.textContent = username;
    }

    // Fetch and display all orders by default
    try {
        const response = await axios.get(`${MY_SERVER}user_orders/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

    
        const orders = response.data;

        // Display orders using Bootstrap cards
        displayOrders(orders);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Unauthorized, user not logged in
            alert("You Must Be Logged In");
        } else {
            console.error("Error fetching orders:", error);
            // Handle other errors if needed
        }
    }

    // Event listener for order options change
    orderOptions.addEventListener("change", async function () {
        const selectedOption = orderOptions.value;

        try {
            // Implement logic to fetch orders based on the selected option
            let orders = [];

            if (selectedOption === "all") {
                // Fetch all orders
                const response = await axios.get(`${MY_SERVER}user_orders/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log(response.data); // Log the data
                orders = response.data;
            } else if (selectedOption === "recent") {
                // Fetch the three most recent orders
                const response = await axios.get(`${MY_SERVER}recent_orders/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log(response.data); // Log the data
                orders = response.data;
            }

            // Display orders using Bootstrap cards
            displayOrders(orders);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Unauthorized, user not logged in
                alert("You Must Be Logged In");
            } else {
                console.error("Error fetching orders:", error);
                // Handle other errors if needed
            }
        }
    });

    // Function to display orders using Bootstrap cards
    async function displayOrders(orders) {
        orderCards.innerHTML = ""; // Clear previous orders

        for (const order of orders) {
            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-4");

            // Access the order details array
            const orderDetails = order.order_details;

            // Fetch product details for each order detail
            const productDetails = await Promise.all(
                orderDetails.map(async (detail) => {
                    const productResponse = await axios.get(`${MY_SERVER}products/${detail.product}/`);
                    return productResponse.data;
                })
            );

            // Calculate order total
            const orderTotal = orderDetails.reduce((total, detail) => total + parseFloat(detail.subtotal), 0).toFixed(2);

            // Format order date
            const orderDate = new Date(order.order_date);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString();

            // Customize the card content based on your order structure
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order #${order.orderID}</h5>
                        <p class="card-text">Order Date: ${formattedDate}</p>
                        <p class="card-text">Order Time: ${formattedTime}</p>
                        <p class="card-text">Order Details:</p>
                        <ul>
                            ${orderDetails.map((detail, index) => `<li>${detail.quantity} x ${productDetails[index].name} - Subtotal: $${detail.subtotal}</li>`).join('')}
                        </ul>
                        <p class="card-text">Order Total: $${orderTotal}</p>
                        <button class="btn btn-primary" onclick="reuseCart(${order.orderID})">Reuse Cart</button>
                    </div>
                </div>
            `;

            orderCards.appendChild(card);
        }
    }

// Function to handle "Reuse Cart" button click
window.reuseCart = function (orderID) {
    // Fetch order details for the selected order
    axios.get(`${MY_SERVER}orders/${orderID}/`)
        .then(response => {
            const orderDetails = response.data.order_details;

            // Clear current myCart in local storage
            localStorage.removeItem("myCart");

            // Add items from the order to myCart
            orderDetails.forEach(async (detail) => {
                const productID = detail.product;
                const quantity = detail.quantity;

                try {
                    // Fetch product details using productID
                    const productResponse = await axios.get(`${MY_SERVER}products/${productID}/`);
                    const productDetails = productResponse.data;
                    const Image = MY_SERVER+productDetails.prodimage
                    // Add item to myCart
                    const myCart = JSON.parse(localStorage.getItem("myCart")) || [];
                    myCart.push({
                        productId: productDetails.productID,
                        productImage: Image,
                        productName: productDetails.name,
                        productPrice: productDetails.price,  // Adjust this based on your product data
                        quantity: quantity,
                        // Add other product details as needed
                    });
                    localStorage.setItem("myCart", JSON.stringify(myCart));
                } catch (productError) {
                    console.error("Error fetching product details:", productError);
                    // Handle error if needed
                }
                });

                // Optionally, redirect to the cart page or update the cart display
                // Implement your logic here
            })
            .catch(error => {
                console.error("Error fetching order details:", error);
                // Handle error if needed
            });
    };
});

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
