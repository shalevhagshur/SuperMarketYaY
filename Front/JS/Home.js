document.addEventListener("DOMContentLoaded", function () {
    const categoriesSection = document.getElementById("categoryCarouselInner");
    const prevCategoryButton = document.querySelector(".category-carousel-control-prev");
    const nextCategoryButton = document.querySelector(".category-carousel-control-next");
    const MY_SERVER = "http://127.0.0.1:8000/";

    // Constant to store categories
    const CATEGORIES_LIST = [];
    // Variable to keep track of the current index
    let currentCategoryIndex = 0;

    // Function to make AJAX request using Axios and populate CATEGORIES_LIST
    function fetchCategories() {
        axios.get(MY_SERVER + "categories/")
            .then(response => {
                CATEGORIES_LIST.push(...response.data);
                displayCategories();
            })
            .catch(error => console.error("Error fetching categories:", error));
    }

    // Function to display categories based on the current index
    function displayCategories() {
        const categoryList = document.createElement("div");
        categoryList.classList.add("carousel-inner", "d-flex", "flex-nowrap");

        // Display categories in the list
        for (let i = 0; i < CATEGORIES_LIST.length; i++) {
            const category = CATEGORIES_LIST[i];
            displayCategory(category, categoryList);
        }

        categoriesSection.appendChild(categoryList);

        // Set up event listeners for prev and next buttons
        prevCategoryButton.addEventListener("click", () => adjustCategories(-1));
        nextCategoryButton.addEventListener("click", () => adjustCategories(1));
    }

    // Function to display a single category
    function displayCategory(category, container) {
        const categoryBox = document.createElement("div");
        categoryBox.classList.add("carousel-item", "category-box");

        const categoryImage = document.createElement("img");
        categoryImage.src = MY_SERVER + category.image;
        categoryImage.alt = category.name;

        const categoryName = document.createElement("p");
        categoryName.textContent = category.name;

        categoryBox.appendChild(categoryImage);
        categoryBox.appendChild(categoryName);

        container.appendChild(categoryBox);
    }

    // Function to adjust displayed categories based on the direction (-1 for prev, 1 for next)
    function adjustCategories(direction) {
        currentCategoryIndex = (currentCategoryIndex + direction + CATEGORIES_LIST.length) % CATEGORIES_LIST.length;
        updateDisplayedCategories();
    }

    // Function to update displayed categories based on the current index
    function updateDisplayedCategories() {
        const categoryList = categoriesSection.querySelector(".carousel-inner");
        categoryList.innerHTML = ""; // Clear previous categories

        for (let i = 0; i < CATEGORIES_LIST.length; i++) {
            const newIndex = (currentCategoryIndex + i) % CATEGORIES_LIST.length;
            const category = CATEGORIES_LIST[newIndex];
            displayCategory(category, categoryList);
        }
    }

    // Call the function to fetch categories and display them when the page is loaded
    fetchCategories();
});

document.addEventListener("DOMContentLoaded", function () {
    const productsSection = document.getElementById("productCarouselInner");
    const prevProductButton = document.querySelector(".product-carousel-control-prev");
    const nextProductButton = document.querySelector(".product-carousel-control-next");
    const MY_SERVER = "http://127.0.0.1:8000/";

    // Constant to store products
    const PRODUCTS_LIST = [];
    // Variable to keep track of the current index
    let currentProductIndex = 0;

    // Function to make AJAX request using Axios and populate PRODUCTS_LIST
    function fetchProducts() {
        axios.get(MY_SERVER + "products/")
            .then(response => {
                PRODUCTS_LIST.push(...response.data);
                displayProducts();
            })
            .catch(error => console.error("Error fetching products:", error));
    }

    // Function to display products based on the current index
    function displayProducts() {
        const productList = document.createElement("div");
        productList.classList.add("carousel-inner", "d-flex", "flex-nowrap");

        // Display products in the list
        for (let i = 0; i < PRODUCTS_LIST.length; i++) {
            const product = PRODUCTS_LIST[i];
            displayProduct(product, productList);
        }

        productsSection.appendChild(productList);

        // Set up event listeners for prev and next buttons
        prevProductButton.addEventListener("click", () => adjustProducts(-1));
        nextProductButton.addEventListener("click", () => adjustProducts(1));
    }

    // Function to display a single product
    function displayProduct(product, container) {
        const productBox = document.createElement("div");
        productBox.classList.add("carousel-item", "product-box");
    
        const productImage = document.createElement("img");
        productImage.src = MY_SERVER + product.prodimage.replace(/^\/\//, '/'); // Fix for double slash issue
        productImage.alt = product.name;
    
        const productName = document.createElement("p");
        productName.textContent = product.name;
    
        const productPrice = document.createElement("p");
        productPrice.textContent = "Price: " + formatPrice(product.price);
    
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
    
        const productCategory = document.createElement("p");
        productCategory.textContent = "Category: " + product.category.name;
    
        productBox.appendChild(productImage);
        productBox.appendChild(productName);
        productBox.appendChild(productPrice);
        productBox.appendChild(productDescription);
        productBox.appendChild(productCategory);
    
        container.appendChild(productBox);
    }
    
    function formatPrice(price) {
        const numericPrice = Number(price);
    
        if (!isNaN(numericPrice)) {
            return "$" + numericPrice.toFixed(2);
        } else {
            return "Price not available";
        }
    }
    
    

    // Function to adjust displayed products based on the direction (-1 for prev, 1 for next)
    function adjustProducts(direction) {
        currentProductIndex = (currentProductIndex + direction + PRODUCTS_LIST.length) % PRODUCTS_LIST.length;
        updateDisplayedProducts();
    }

    // Function to update displayed products based on the current index
    function updateDisplayedProducts() {
        const productList = productsSection.querySelector(".carousel-inner");
        productList.innerHTML = ""; // Clear previous products

        for (let i = 0; i < PRODUCTS_LIST.length; i++) {
            const newIndex = (currentProductIndex + i) % PRODUCTS_LIST.length;
            const product = PRODUCTS_LIST[newIndex];
            displayProduct(product, productList);
        }
    }

    // Call the function to fetch products and display them when the page is loaded
    fetchProducts();
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