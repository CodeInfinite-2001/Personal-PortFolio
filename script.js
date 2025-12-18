// Portfolio Application - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the portfolio
    initPortfolio();
});

// Main initialization function
function initPortfolio() {
    console.log('Portfolio initialized');
    
    // Set up all event listeners
    setupEventListeners();
    
    // Initialize animations
    initAnimations();
    
    // Initialize skill bars
    initSkillBars();
    
    // Initialize project filtering
    initProjectFilter();
    
    // Check URL hash for initial section
    checkInitialHash();
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            showSection(sectionId);
            updateActiveNav(sectionId);
        });
    });
    
    // Mobile menu button
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navLinks = document.querySelector('.nav-links');
        if (!event.target.closest('.nav-container') && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links button').forEach(button => {
        button.addEventListener('click', closeMobileMenu);
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Action buttons (buttons with data-section attribute)
    document.querySelectorAll('[data-section]').forEach(button => {
        if (!button.classList.contains('nav-btn')) {
            button.addEventListener('click', function() {
                const sectionId = this.dataset.section;
                showSection(sectionId);
                updateActiveNav(sectionId);
            });
        }
    });
    
    // Window hash change
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showSection(hash);
            updateActiveNav(hash);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape key closes mobile menu
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Ctrl + / to open contact form
        if (event.ctrlKey && event.key === '/') {
            event.preventDefault();
            showSection('contact');
            updateActiveNav('contact');
        }
    });
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        // Update URL hash without scrolling
        history.replaceState(null, null, `#${sectionId}`);
        
        // Trigger animations for the new section
        setTimeout(() => {
            triggerSectionAnimations(sectionId);
        }, 100);
    }
    
    // Scroll to top of the section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav(sectionId) {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to the clicked button
    const activeButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.mobile-menu-btn i');
    
    navLinks.classList.toggle('active');
    
    // Change icon
    if (navLinks.classList.contains('active')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.mobile-menu-btn i');
    
    navLinks.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
}

// Animation functions
function initAnimations() {
    // Intersection Observer for skill bars
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        const progressBar = item.querySelector('.skill-progress');
                        const width = progressBar.dataset.width;
                        if (width && !progressBar.style.width) {
                            progressBar.style.width = width;
                        }
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
    
    // Intersection Observer for general animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements with animate classes
    document.querySelectorAll('.animate-slideInLeft, .animate-slideInRight, .animate-slideInUp').forEach(element => {
        animationObserver.observe(element);
    });
}

function triggerSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Remove and re-add animation classes to trigger them
    const animatedElements = section.querySelectorAll('.animate-slideInLeft, .animate-slideInRight, .animate-slideInUp');
    
    animatedElements.forEach(element => {
        const originalClasses = Array.from(element.classList)
            .filter(className => className.startsWith('animate-'))
            .join(' ');
        
        // Remove animation classes
        element.classList.remove('animate-slideInLeft', 'animate-slideInRight', 'animate-slideInUp');
        
        // Force reflow
        void element.offsetWidth;
        
        // Re-add animation classes
        setTimeout(() => {
            element.classList.add(...originalClasses.split(' '));
        }, 50);
    });
}

// Skill bars initialization
function initSkillBars() {
    // This is handled by the Intersection Observer in initAnimations()
}

// Project filtering
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact form handling
function handleContactForm(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Validation
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Success - show confirmation
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Optional: Switch to home section
        // showSection('home');
        // updateActiveNav('home');
        
    }, 1500);
}

function validateForm(formData) {
    // Name validation
    if (!formData.name) {
        showNotification('Please enter your name.', 'error');
        document.getElementById('name').focus();
        return false;
    }
    
    if (formData.name.length < 2) {
        showNotification('Name must be at least 2 characters long.', 'error');
        document.getElementById('name').focus();
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        showNotification('Please enter your email address.', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address.', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    // Message validation
    if (!formData.message) {
        showNotification('Please enter your message.', 'error');
        document.getElementById('message').focus();
        return false;
    }
    
    if (formData.message.length < 10) {
        showNotification('Message must be at least 10 characters long.', 'error');
        document.getElementById('message').focus();
        return false;
    }
    
    return true;
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--medium-grey);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                border-left: 4px solid var(--accent-red);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 1rem;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                z-index: 9999;
                max-width: 400px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.success {
                border-left-color: #00ff00;
            }
            .notification.error {
                border-left-color: var(--accent-red);
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification.success i {
                color: #00ff00;
            }
            .notification.error i {
                color: var(--accent-red);
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// Check initial URL hash
function checkInitialHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
        updateActiveNav(hash);
    } else {
        // Default to home
        showSection('home');
        updateActiveNav('home');
    }
}

// Add some interactivity to profile image
function addProfileImageEffects() {
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click to enlarge effect
        profileImage.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <img src="${this.src}" alt="Profile Image">
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Close modal
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
            });
            
            // Add modal styles if not already added
            if (!document.querySelector('#modal-styles')) {
                const style = document.createElement('style');
                style.id = 'modal-styles';
                style.textContent = `
                    .image-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.9);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
                    .image-modal.show {
                        opacity: 1;
                    }
                    .modal-content {
                        position: relative;
                        max-width: 90%;
                        max-height: 90%;
                    }
                    .modal-content img {
                        width: 100%;
                        height: auto;
                        border-radius: 10px;
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    }
                    .modal-close {
                        position: absolute;
                        top: -40px;
                        right: -40px;
                        background: var(--accent-red);
                        border: none;
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.2rem;
                        transition: all 0.3s;
                    }
                    .modal-close:hover {
                        background: var(--accent-red-dark);
                        transform: rotate(90deg);
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
}

// Initialize additional features
addProfileImageEffects();

// Export functions for debugging (optional)
window.portfolio = {
    showSection,
    updateActiveNav,
    toggleMobileMenu,
    initPortfolio
};