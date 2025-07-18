/**
 * Main JavaScript file for Cozy Matcha Shop
 */

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            document.querySelector('.overlay').classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking on a link
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            document.querySelector('.overlay').classList.add('hidden');
        });
    });
    
    // Close mobile menu when clicking on overlay
    document.querySelector('.overlay').addEventListener('click', function() {
        navLinks.classList.remove('active');
        this.classList.add('hidden');
        document.getElementById('shopping-cart').classList.remove('active');
    });
    
    // Add scrolled class to header when scrolling
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#cart') return; // Skip cart links
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active nav link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Initialize shopping cart functionality
 */
function initCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.querySelector('.close-cart');
    const shoppingCart = document.getElementById('shopping-cart');
    const overlay = document.querySelector('.overlay');
    
    // Open cart
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            shoppingCart.classList.add('active');
            overlay.classList.remove('hidden');
        });
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            shoppingCart.classList.remove('active');
            overlay.classList.add('hidden');
        });
    }
}

/**
 * Initialize modal functionality
 */
function initModals() {
    const modal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.querySelector('.overlay').classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.querySelector('.overlay').classList.add('hidden');
        }
    });
}

/**
 * Initialize products display
 */
function initProducts() {
    console.log('Initializing products...');
    
    const productsGrid = document.querySelector('.products-grid');
    const categoryFilter = document.querySelector('.category-filter');
    const modal = document.getElementById('product-modal');
    const modalContent = document.querySelector('.product-details');
    
    if (!productsGrid || !categoryFilter) {
        console.error('Products grid or category filter not found');
        return;
    }
    
    console.log('Found products grid and category filter');
    
    // Clear existing filter buttons except the default "All" button and recreate them
    const existingButtons = categoryFilter.querySelectorAll('.filter-btn:not([data-category="all"])');
    existingButtons.forEach(btn => btn.remove());
    
    // Ensure "All" button exists and is properly configured
    let allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (!allButton) {
        allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.dataset.category = 'all';
        allButton.textContent = 'All';
        categoryFilter.appendChild(allButton);
    }
    
    // Add click handler to All button
    allButton.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        displayProducts(getAllProducts());
    });
    
    // Add category filter buttons
    const categories = getAllCategories();
    console.log('Categories:', categories);
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category.id;
        button.textContent = category.name;
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            // Filter products with animation
            filterProducts(category.id);
        });
        categoryFilter.appendChild(button);
    });
    
    /**
     * Filter products with animation
     * @param {string} categoryId - Category ID to filter by
     */
    function filterProducts(categoryId) {
        const productsToShow = getProductsByCategory(categoryId);
        const productCards = document.querySelectorAll('.product-card');
        
        // First hide all products with animation
        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
        });
        
        // After animation completes, update the displayed products
        setTimeout(() => {
            displayProducts(productsToShow);
            
            // Animate the new products in
            document.querySelectorAll('.product-card').forEach(card => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            });
        }, 300);
    }
    
    // Display all products initially
    console.log('Displaying products...');
    displayProducts(getAllProducts());
    
    /**
     * Display products in the grid
     * @param {Array} productsToDisplay - Products to display
     */
    function displayProducts(productsToDisplay) {
        console.log('Displaying', productsToDisplay.length, 'products');
        
        // Clear products grid
        productsGrid.innerHTML = '';
        
        // Create product cards
        productsToDisplay.forEach(product => {
            console.log('Creating card for:', product.name);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            
            // Create product image
            const imageDiv = document.createElement('div');
            imageDiv.className = 'product-image-container';
            
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            img.className = 'product-image';
            
            // Add error handling for images
            img.onerror = function() {
                console.warn('Image failed to load:', product.image);
                this.style.display = 'none';
                imageDiv.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-accent); font-size: 3rem;">🍵</div>`;
            };
            
            imageDiv.appendChild(img);
            
            const productInfo = document.createElement('div');
            productInfo.className = 'product-info';
            
            productInfo.innerHTML = `
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <p class="product-description">${product.shortDescription}</p>
                <button class="btn view-product-btn" data-id="${product.id}">View Details</button>
            `;
            
            productCard.appendChild(imageDiv);
            productCard.appendChild(productInfo);
            productsGrid.appendChild(productCard);
            
            // Add event listener to view product button
            productCard.querySelector('.view-product-btn').addEventListener('click', function() {
                const productId = this.dataset.id;
                const product = getProductById(productId);
                
                if (!product || !modal || !modalContent) {
                    console.error('Product, modal, or modal content not found');
                    return;
                }
                
                // Populate modal with product details
                modalContent.innerHTML = `
                    <div class="product-details-image">
                        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=&quot;display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-accent); font-size: 5rem;&quot;>🍵</div>';">
                    </div>
                    <div class="product-details-info">
                        <h2 class="product-details-name">${product.name}</h2>
                        <p class="product-details-price">${formatPrice(product.price)}</p>
                        <p class="product-details-description">${product.description}</p>
                        <div class="quantity-selector">
                            <button class="quantity-btn decrease">-</button>
                            <input type="number" class="quantity-input" value="1" min="1" max="99">
                            <button class="quantity-btn increase">+</button>
                        </div>
                        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
                
                // Show modal
                modal.style.display = 'block';
                document.querySelector('.overlay').classList.remove('hidden');
                
                // Add event listeners for quantity buttons
                const quantityInput = modalContent.querySelector('.quantity-input');
                const decreaseBtn = modalContent.querySelector('.decrease');
                const increaseBtn = modalContent.querySelector('.increase');
                const addToCartBtn = modalContent.querySelector('.add-to-cart-btn');
                
                if (decreaseBtn) {
                    decreaseBtn.addEventListener('click', function() {
                        if (quantityInput.value > 1) {
                            quantityInput.value = parseInt(quantityInput.value) - 1;
                        }
                    });
                }
                
                if (increaseBtn) {
                    increaseBtn.addEventListener('click', function() {
                        if (quantityInput.value < 99) {
                            quantityInput.value = parseInt(quantityInput.value) + 1;
                        }
                    });
                }
                
                // Add event listener for add to cart button
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', function() {
                        const productId = this.dataset.id;
                        const quantity = parseInt(quantityInput.value);
                        
                        if (typeof addToCart === 'function') {
                            addToCart(productId, quantity);
                        } else {
                            console.warn('addToCart function not found');
                        }
                        
                        // Close modal
                        modal.style.display = 'none';
                        document.querySelector('.overlay').classList.add('hidden');
                        
                        // Show cart
                        const shoppingCart = document.getElementById('shopping-cart');
                        if (shoppingCart) {
                            shoppingCart.classList.add('active');
                            document.querySelector('.overlay').classList.remove('hidden');
                        }
                    });
                }
            });
        });
        
        console.log('Products displayed successfully');
    }
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would send the form data to a server
            // For this demo, we'll just show the success message
            
            // Hide the form
            contactForm.style.opacity = '0';
            
            // Show success message after a short delay
            setTimeout(() => {
                contactForm.style.display = 'none';
                if (contactSuccess) {
                    contactSuccess.classList.remove('hidden');
                    contactSuccess.style.opacity = '0';
                    
                    setTimeout(() => {
                        contactSuccess.style.opacity = '1';
                    }, 50);
                }
            }, 300);
            
            // Reset form
            contactForm.reset();
        });
    }
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-title, .about-content, .products-grid, .contact-content, .feature');
    
    // Add reveal class to elements
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Reveal elements in viewport
    function revealElements() {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    revealElements();
    
    // Add event listener for scroll
    window.addEventListener('scroll', revealElements);
}

/**
 * Error handling and validation functions
 */

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    showErrorNotification('Something went wrong. Please try again.');
    return false;
});

// Show error notification
function showErrorNotification(message) {
    // Check if notification function exists
    if (typeof showNotification === 'function') {
        showNotification(message);
    } else {
        alert(message);
    }
}

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Fallback for localStorage if not available
if (!isLocalStorageAvailable()) {
    // Create a simple in-memory storage
    const memoryStorage = {};
    
    // Override localStorage methods
    Storage.prototype.setItem = function(key, value) {
        memoryStorage[key] = value.toString();
    };
    
    Storage.prototype.getItem = function(key) {
        return memoryStorage[key] || null;
    };
    
    Storage.prototype.removeItem = function(key) {
        delete memoryStorage[key];
    };
    
    console.warn('localStorage is not available. Using in-memory storage instead.');
}

// Validate all forms on the page
function validateForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                input.classList.add('error');
                
                // Add shake animation
                input.classList.add('shake');
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 500);
            });
            
            input.addEventListener('input', function() {
                if (input.validity.valid) {
                    input.classList.remove('error');
                }
            });
        });
    });
}

// Initialize validation when DOM is ready
document.addEventListener('DOMContentLoaded', validateForms);

// DOM ready function - Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cozy Matcha Shop initialized');
    
    // Initialize navigation
    initNavigation();
    
    // Initialize products
    initProducts();
    
    // Initialize cart
    initCart();
    
    // Initialize modals
    initModals();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize scroll reveal
    setTimeout(initScrollReveal, 100);
});