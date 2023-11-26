// Function to update the cart
function updateCart(productId, productName, productPrice, productImage, productQuantity) {
    // Convert product price to float
    const productPriceFloat = parseFloat(productPrice);

    const existingCartItem = cartList.querySelector(`[data-product-id="${productId}"]`);
    const cartItemQuantityInput = existingCartItem ? existingCartItem.querySelector(".cart-item-quantity") : null;

    let quantity = parseInt(productQuantity, 10);

    if (cartItemQuantityInput) {
        // Validate and update existing cart item quantity
        quantity += parseInt(cartItemQuantityInput.value, 10);
        quantity = isNaN(quantity) ? 1 : quantity; // Set quantity to 1 if it's not a number

        if (quantity <= 0) {
            // If quantity is zero or negative, remove the product from the cart
            existingCartItem.remove();
        } else {
            cartItemQuantityInput.value = quantity;
        }
    } else {
        // Create a new cart item
        const cartItem = document.createElement("li");
        cartItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "cart-item");
        cartItem.dataset.productId = productId;
        cartItem.dataset.productName = productName;
        cartItem.dataset.productPrice = productPriceFloat;  // Use the float value here
        cartItem.dataset.productImage = productImage;

        cartItem.innerHTML = `<img class="cart-item-image" src="${productImage}">
                         ${productName} - $${productPriceFloat.toFixed(2)}
                         <div class="input-group input-group-sm">
                             <div class="input-group-prepend">
                                 <button class="btn btn-outline-secondary remove-from-cart" type="button">Remove</button>
                             </div>
                             <input type="number" class="form-control cart-item-quantity" value="${quantity}" min="1">
                             <div class="input-group-append">
                                 <button class="btn btn-outline-secondary add-to-cart" type="button">Add</button>
                             </div>
                         </div>`;

        cartList.appendChild(cartItem);

        // Close the product popup window only if the modal is currently displayed
        if (myCartModalElement.classList.contains('show')) {
            myCartModal.show();
        }
    }

    // Update local storage
    updateLocalStorage();

    // Display the total quantity in the cart
    updateCartBtnText();
}

// Function to update local storage
function updateLocalStorage() {
    const cartItems = Array.from(cartList.querySelectorAll(".cart-item"));

    const cartData = cartItems.map((cartItem) => ({
        productId: cartItem.dataset.productId,
        productName: cartItem.dataset.productName,
        productPrice: cartItem.dataset.productPrice,
        productImage: cartItem.dataset.productImage,
        quantity: cartItem.querySelector(".cart-item-quantity").value,
    }));

    localStorage.setItem("myCart", JSON.stringify(cartData));
}
function updateCartBtnText() {
    const totalQuantity = Array.from(cartList.querySelectorAll(".cart-item-quantity"))
        .reduce((total, input) => total + parseInt(input.value, 10), 0);

    myCartBtn.innerHTML = `My Cart (${totalQuantity})`;
}

// Define a global variable to store the total order price
let globalTotalOrderPrice = 0;

// Function to calculate the total order price
function calculateTotalOrderPrice(cartItems) {
    return cartItems.reduce((total, cartItem) => {
        const itemPrice = parseFloat(cartItem.dataset.productPrice);
        const itemQuantity = parseInt(cartItem.querySelector(".cart-item-quantity").value, 10);
        return total + itemPrice * itemQuantity;
    }, 0);
}
// Function to update and display the total order price
function updateTotalOrderPrice() {
    const cartItems = Array.from(cartList.querySelectorAll(".cart-item"));

    // Calculate the total order price
    globalTotalOrderPrice = calculateTotalOrderPrice(cartItems);

    // Display the total order price
    orderTotalPrice.textContent = `Order Total Price: $${globalTotalOrderPrice.toFixed(2)}`;
}


let userId;

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

    // Event listener for submitting the order
    const submitOrderBtn = document.getElementById("submitOrderBtn");
    const orderTotalPrice = document.getElementById("orderTotalPrice");

    submitOrderBtn.addEventListener("click", async () => {
        const isLoggedIn = sessionStorage.getItem('access_token') !== null;
        const MY_SERVER = "http://127.0.0.1:8000/";
        // Check if the cart is empty
        const cartItems = Array.from(cartList.querySelectorAll(".cart-item"));
        if (cartItems.length === 0) {
            alert("One item must be in the cart to submit an order.");
            return; // Stop further execution
        }

        if (isLoggedIn) {
            const cartItems = Array.from(cartList.querySelectorAll(".cart-item"));

            const orderData = {
                customer: userId, // Use the global userId variable
                order_details: cartItems.map((cartItem) => ({
                    product: cartItem.dataset.productId,
                    quantity: cartItem.querySelector(".cart-item-quantity").value,
                    subtotal: parseFloat(cartItem.dataset.productPrice) * parseInt(cartItem.querySelector(".cart-item-quantity").value),
                })),
            };

            updateTotalOrderPrice()


            try {
                const response = await axios.post(MY_SERVER + "submit_order/", orderData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                    },
                });

                if (response && response.data && response.data.detail) {
                    // Order submitted successfully, clear the cart
                    clearCart();
                    alert("Order submitted successfully!");

                } else {
                    console.error("Error submitting order:", response.data.error);
                    alert("Error submitting order.");
                }
            } catch (error) {

                alert("User Most Be Logged In");
            }
        } else {
            alert("Please log in to submit an order.");
        }
    });


// start of shop functions
const myCartModalElement = document.getElementById("myCartModal");
const myCartModal = new bootstrap.Modal(myCartModalElement);
document.addEventListener("DOMContentLoaded", async function () {
    const categoriesNav = document.getElementById("categoriesNav");
    const productList = document.getElementById("productList");
    const myCartBtn = document.getElementById("myCartBtn");
    const cartList = document.getElementById("cartList");
    const myCartModalElement = document.getElementById("myCartModal");
    const MY_SERVER = "http://127.0.0.1:8000/";

    // Function to remove the modal backdrop
    const removeModalBackdrop = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    };

    // Remove modal backdrop whenever the modal is hidden
    myCartModalElement.addEventListener('hidden.bs.modal', removeModalBackdrop);

    // Constant to store products
    const PRODUCTS_LIST = [];
    // Constant to store categories
    const CATEGORIES_LIST = [];
    // Variable to keep track of the current category
    let currentCategory = null;

    // Fetch categories and products
    await fetchCategories();
    await fetchProducts();

    // Display categories in the navigation bar
    displayCategories();

    // Display products based on the current category
    displayProducts();

    // Event listener for category navigation
    categoriesNav.addEventListener("click", (event) => {
        const selectedCategory = event.target.dataset.category;
        if (selectedCategory !== undefined) {
            currentCategory = selectedCategory === "all" ? null : selectedCategory;
            displayProducts();
        }
    });

    // Event listener for add to cart buttons
    productList.addEventListener("click", async (event) => {
        const addButton = event.target.closest(".add-to-cart");
        if (addButton) {
            const productId = addButton.dataset.productId;
            const productName = addButton.dataset.productName;
            const productPrice = addButton.dataset.productPrice;
            const productImage = addButton.dataset.productImage;
            const productQuantityInput = addButton.parentElement.querySelector(".product-quantity");
            const productQuantity = productQuantityInput ? parseInt(productQuantityInput.value, 10) : 1;

            // Update the cart
            updateCart(productId, productName, productPrice, productImage, productQuantity);

            // Reset product quantity to default
            if (productQuantityInput) {
                productQuantityInput.value = 1;
            }

            // Prevent automatic opening of myCart
            event.stopPropagation();
        }
    });

    // Event listener for myCartBtn
    myCartBtn.addEventListener("click", () => {
        updateTotalOrderPrice()
        myCartModal.show();

    });

    // Event listener for cartList
    cartList.addEventListener("click", async (event) => {
        const cartItem = event.target.closest(".cart-item");
        const removeButton = event.target.closest(".remove-from-cart");
        const addButton = event.target.closest(".add-to-cart");

        if (cartItem) {
            const productId = cartItem.dataset.productId;
            const productName = cartItem.dataset.productName;
            const productPrice = cartItem.dataset.productPrice;
            const productImage = cartItem.dataset.productImage;
            const cartItemQuantityInput = cartItem.querySelector(".cart-item-quantity");

            if (removeButton) {
                // Remove item from the cart
                handleRemoveCartItem(cartItem);
            } else if (addButton) {
                // Increase the quantity of the item in the cart
                handleAddMoreCartItem(cartItem);
            }
        }
    });

    // Function to handle removing items from the cart
    function handleRemoveCartItem(cartItem) {
        const productId = cartItem.dataset.productId;
        const productName = cartItem.dataset.productName;
        const productPrice = cartItem.dataset.productPrice;
        const productImage = cartItem.dataset.productImage;

        // Remove the item from the cart
        cartItem.remove();

        // Update local storage
        updateLocalStorage();

        // Display the total quantity in the cart
        updateCartBtnText();
    }

    // Function to handle adding more items to the cart
    function handleAddMoreCartItem(cartItem) {
        const cartItemQuantityInput = cartItem.querySelector(".cart-item-quantity");

        // Increase the quantity by 1
        let quantity = parseInt(cartItemQuantityInput.value, 10) + 1;

        // Update the cart item quantity
        cartItemQuantityInput.value = quantity;

        // Update local storage
        updateLocalStorage();

        // Display the total quantity in the cart
        updateCartBtnText();

        updateTotalOrderPrice();
    }

    // Function to fetch categories
    async function fetchCategories() {
        try {
            const response = await axios.get(MY_SERVER + "categories/");
            CATEGORIES_LIST.push({ name: "All Categories" }, ...response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Function to fetch products
    async function fetchProducts() {
        try {
            const response = await axios.get(MY_SERVER + "products/");
            PRODUCTS_LIST.push(...response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

// Function to display categories
async function displayCategories() {
    const categoriesNav = document.getElementById("categoriesNav");

    // Clear existing content
    categoriesNav.innerHTML = "";

    // Create HTML for "All Categories" button with the specified styling
    const allCategoriesHTML = `<li class="nav-item" role="presentation">
                                    <a class="nav-link category-link" ${currentCategory === null ? 'active all-categories-link' : 'all-categories-link'}" href="#" data-category="all">All Categories</a>
                                </li>`;

    // Add "All Categories" button to the subnavbar
    categoriesNav.innerHTML = allCategoriesHTML;

    try {
        // Fetch categories from the server
        const response = await axios.get(MY_SERVER + "categories/");
        const categories = response.data;

        // Create HTML for each category button with the blue background
        const categoryButtonsHTML = categories.map((category) => `
            <li class="nav-item" role="presentation">
                <a class="nav-link ${currentCategory === category.name ? 'active category-link' : 'category-link'}" href="#" data-category="${category.name}">${category.name}</a>
            </li>`
        );

        // Add category buttons to the subnavbar
        categoriesNav.innerHTML += categoryButtonsHTML.join("");
    } catch (error) {
        console.error("Error fetching categories:", error);
    }

    // Event listener for category navigation
    categoriesNav.addEventListener("click", (event) => {
        const selectedCategory = event.target.dataset.category;
        if (selectedCategory !== undefined) {
            currentCategory = selectedCategory === "all" ? null : selectedCategory;
            displayProducts();
        }
    });
}

    // Function to display products
    function displayProducts() {
        const filteredProducts = currentCategory
            ? PRODUCTS_LIST.filter((product) => product.category.name === currentCategory)
            : PRODUCTS_LIST;

        const products = filteredProducts.map((product) => {
            // Convert product price to float
            const productPriceFloat = parseFloat(product.price);

            return `<div class="col-md-4">
                        <div class="card mb-4 box-shadow">
                            <img class="card-img-top" src="${MY_SERVER}${product.prodimage.replace(/^\/\//, '/')}">
                            <div class="card-body">
                                <p class="card-text">${product.name}</p>
                                <p class="card-text">Price: $${productPriceFloat.toFixed(2)}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="input-group">
                                        <input type="number" class="form-control product-quantity" value="1" min="1">
                                        <button type="button" class="btn btn-sm btn-outline-secondary add-to-cart"
                                            data-product-id="${product.productID}"
                                            data-product-name="${product.name}"
                                            data-product-price="${productPriceFloat.toFixed(2)}"
                                            data-product-image="${MY_SERVER}${product.prodimage.replace(/^\/\//, '/')}">
                                            Add to Cart
                                        </button>
                                    </div>
                                    <div class="quantity-display">Quantity: ${1}</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });

        productList.innerHTML = products.join("");

        // Event listener for updating quantity display
        const quantityInputs = productList.querySelectorAll(".product-quantity");
        quantityInputs.forEach((input) => {
            input.addEventListener("input", updateQuantityDisplay);
        });
    }

    // Function to update quantity display
    function updateQuantityDisplay(event) {
        const input = event.target;
        const quantityDisplay = input.parentElement.nextElementSibling.querySelector(".quantity-display");

        // Check if quantityDisplay is not null before updating textContent
        if (quantityDisplay) {
            quantityDisplay.textContent = `Quantity: ${parseInt(input.value, 10)}`;
        }
    }

    // Function to handle removing items from the cart
    function handleRemoveCartItem(cartItem) {
        const productId = cartItem.dataset.productId;
        const productName = cartItem.dataset.productName;
        const productPrice = cartItem.dataset.productPrice;
        const productImage = cartItem.dataset.productImage;
        const cartItemQuantityInput = cartItem.querySelector(".cart-item-quantity");

        // Determine the quantity to remove (default to 1 if not specified)
        const quantityToRemove = 1; // Remove 1 item at a time

        // Calculate the updated quantity
        let quantity = parseInt(cartItemQuantityInput.value, 10) - quantityToRemove;

        // Validate the quantity to ensure it's within bounds
        quantity = Math.max(0, quantity); // Ensure quantity doesn't go below 0

        if (quantity === 0) {
            // If quantity becomes 0, remove the product from the cart
            cartItem.remove();
        } else {
            // Update the cart item quantity
            cartItemQuantityInput.value = quantity;
        }

        // Update local storage
        updateLocalStorage();

        // Display the total quantity in the cart
        updateCartBtnText();

        updateTotalOrderPrice();
    }

});

// Function to clear the cart
function clearCart() {
    cartList.innerHTML = "";
    updateLocalStorage();
    updateCartBtnText();
    updateTotalOrderPrice();
}

