// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Get the contact form element
  const contactForm = document.getElementById('contactForm');

  // Only proceed if the form exists on the page
  if (contactForm) {
    // Listen for form submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form behavior (page reload)

      // Get values from input fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation: check if all fields are filled and email is valid
      if (name && validateEmail(email) && message) {
        // Send form data to backend using Fetch API
        fetch('http://192.168.1.139:3000/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message }) // Convert data to JSON
        })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json(); // Parse JSON response
        })
        .then(data => {
          // Show Bootstrap toast on success
          const toast = new bootstrap.Toast(document.getElementById('formToast'));
          toast.show();

          // Reset the form fields
          contactForm.reset();

          // Log submission for development/debugging
          console.log('Form submitted:', { name, email, message });
        })
        .catch(error => {
          // Handle errors gracefully
          console.error('Form submission error:', error);
          showToast('Oops! Something went wrong. Please try again later.', 'error');
        });
      }
    });
  }

    // ===================================
    // SMOOTH SCROLL TO TOP
    // ===================================
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ===================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ===================================
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'home';
    const navLinks = document.querySelectorAll('.nav-link');
    // Update active class on nav links
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'home') ||
            (currentPage === '/' && linkPage === 'home')) {
            link.classList.add('active');
        }
    });

    // ===================================
    // PHONE NUMBER CLICK TRACKING (Optional Analytics)
    // ===================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        // Format the display text, but skip if it has 'raw-phone' class
        if (!link.classList.contains('raw-phone')) {
            link.textContent = formatPhoneNumber(link.textContent);
        }
        
        link.addEventListener('click', function() {
            console.log('Phone link clicked: ' + this.href);
            // You could send this to Google Analytics or other tracking service
            // Example: gtag('event', 'call', { 'phone_number': '0788302499' });
        });
    });

    // ===================================
    // EMAIL LINK CLICK TRACKING (Optional Analytics)
    // ===================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Email link clicked: ' + this.href);
            // You could send this to Google Analytics or other tracking service
            // Example: gtag('event', 'email', { 'email_address': 'swift3finance@gmail.com' });
        });
    });

    // ===================================
    // NAVBAR SHADOW ON SCROLL
    // ===================================
    const header = document.querySelector('.header-nav');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                header.classList.add('shadow');
            } else {
                header.classList.remove('shadow');
            }
        });
    }

    // ===================================
    // FADE-IN ANIMATION ON SCROLL (Optional)
    // ===================================
    // Uncomment this section if you want elements to fade in as you scroll
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.service-card, .loan-card, .value-card, .vision-card, .vision-card-large, .value-card-detailed, .contact-info-item').forEach(el => {
        observer.observe(el);
    });
    

    // ===================================
    // LOG PAGE VIEW (Optional)
    // ===================================
    console.log('Swift Finance Ltd - Page loaded: ' + currentPage);
    console.log('Website version: HTML/Bootstrap/JavaScript');

});

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as needed (example: 0788-302-499)
    if (cleaned.length === 10) {
        return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 7) + '-' + cleaned.slice(7);
    }
    
    return phone;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Show a custom toast notification (optional enhancement)
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('formToast');
    if (toastEl) {
        const toastBody = toastEl.querySelector('.toast-body');
        toastBody.textContent = message;
        // Update class for type
        toastEl.className = `toast align-items-center text-bg-${type === 'error' ? 'danger' : type === 'info' ? 'primary' : 'success'} border-0`;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}
