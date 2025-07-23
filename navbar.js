// navbar-loader.js - Loads the navigation menu from navbar.html

document.addEventListener('DOMContentLoaded', function() {
    // Function to load navbar
    function loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        
        if (!navbarContainer) {
            console.error('Navbar container not found');
            return;
        }
        
        // Determine the correct path to navbar.html based on current page location
        const currentPath = window.location.pathname;
        let navbarPath = 'navbar.html';
        
        // If we're in a subdirectory (like relations/), adjust the path
        if (currentPath.includes('/relations/') || 
            currentPath.includes('/pages/') || 
            currentPath.split('/').length > 2) {
            navbarPath = 'https://aethgov.pages.dev/navbar.html';
        }
        
        // Fetch and insert the navbar HTML
        fetch(navbarPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Insert the HTML directly - this maintains the structure your CSS expects
                navbarContainer.innerHTML = html;
                
                // Initialize dropdown functionality after navbar is loaded
                initializeDropdowns();
                
                // Set active page indicator
                setActivePageIndicator();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                // Fallback: create a basic navbar if loading fails
                createFallbackNavbar();
            });
    }
    
    // Function to create a basic fallback navbar if loading fails
    function createFallbackNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        navbarContainer.innerHTML = `
            <header id="header" class="official-seal">
                <img src="https://aethgov.pages.dev/assets/coatofarms.png" alt="Aetherian Coat of Arms" style="height: 80px; margin-right: 30px;">
                <div class="seal-content">
                    <h1 class="title">REGNUM AETHERIANORUM</h1>
                    <p class="seal-subtitle">Official Government Portal</p>
                </div>
            </header>
            <div class="alert-banner">
                🏛️ Official Government Website - For Citizen Services and Information
            </div>
            <nav class="navbar" role="navigation" aria-label="Main navigation">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/foreign-relations.html">Foreign Relations</a></li>
                    <li><a href="/contact.html">Contact</a></li>
                </ul>
            </nav>
        `;
        console.log('Fallback navbar loaded');
    }
    
    // Function to initialize dropdown functionality
    function initializeDropdowns() {
        const menuItems = document.querySelectorAll('.navbar li');
        
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.subitems');
            
            if (submenu) {
                // Keyboard navigation support
                link.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const isExpanded = this.getAttribute('aria-expanded') === 'true';
                        this.setAttribute('aria-expanded', !isExpanded);
                    }
                });
                
                // Mouse hover events
                item.addEventListener('mouseenter', function() {
                    link.setAttribute('aria-expanded', 'true');
                });
                
                item.addEventListener('mouseleave', function() {
                    link.setAttribute('aria-expanded', 'false');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!item.contains(e.target)) {
                        link.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
        
        console.log('Dropdown functionality initialized');
    }
    
    // Function to set active page indicator
    function setActivePageIndicator() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Remove any existing active indicators
            link.removeAttribute('aria-current');
            
            // Check if this link matches the current page
            if (linkPath === currentPath || 
                (currentPath.endsWith('.html') && linkPath.endsWith(currentPath.split('/').pop())) ||
                (currentPath === '/' && linkPath === '/')) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    // Function to handle responsive menu toggle (for mobile)
    function initializeMobileMenu() {
        // This function can be expanded later for mobile menu functionality
        const navbar = document.querySelector('.navbar');
        if (navbar && window.innerWidth <= 600) {
            // Add mobile-specific functionality here if needed
            console.log('Mobile menu initialized');
        }
    }
    
    // Load the navbar
    loadNavbar();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Re-initialize mobile menu on window resize
    window.addEventListener('resize', initializeMobileMenu);
});

// Additional utility functions for navbar management

// Function to update navbar programmatically (useful for admin pages)
function updateNavbarItem(selector, newText, newHref) {
    const item = document.querySelector(`.navbar ${selector}`);
    if (item) {
        if (newText) item.textContent = newText;
        if (newHref) item.setAttribute('href', newHref);
    }
}

// Function to add new navbar item programmatically
function addNavbarItem(parentSelector, text, href, position = 'last') {
    const parent = document.querySelector(`.navbar ${parentSelector}`);
    if (parent) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = text;
        a.href = href;
        li.appendChild(a);
        
        if (position === 'first') {
            parent.insertBefore(li, parent.firstChild);
        } else {
            parent.appendChild(li);
        }
    }
}

// Export functions for use in other scripts if needed
window.NavbarLoader = {
    updateNavbarItem,
    addNavbarItem
};