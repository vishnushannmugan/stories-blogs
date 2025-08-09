// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const newsletterForm = document.getElementById('newsletter-form');
const header = document.querySelector('.header');

// Mobile navigation toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const icon = navToggle.querySelector('i');
    
    if (navMenu.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on links
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add background blur effect when scrolled
    if (scrollTop > 100) {
        header.style.background = 'rgba(26, 26, 46, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.1)';
    } else {
        header.style.background = 'rgba(26, 26, 46, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Newsletter form validation and submission
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Basic validation
    if (!name) {
        showNotification('Please enter your name', 'error');
        return;
    }
    
    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        newsletterForm.reset();
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Successfully subscribed to Security Stories Digest! Check your email for confirmation.', 'success');
        
        // Update subscriber count (simulate increment)
        updateSubscriberCount();
    }, 2000);
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification__close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        max-width: 400px;
        padding: 16px 20px;
        background: ${type === 'success' ? 'var(--cyber-navy)' : type === 'error' ? '#dc2626' : 'var(--cyber-gray)'};
        color: var(--color-text);
        border: 1px solid ${type === 'success' ? 'var(--cyber-blue)' : type === 'error' ? '#dc2626' : 'var(--cyber-gray)'};
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    notification.querySelector('.notification__content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector('.notification__close').style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeButton = notification.querySelector('.notification__close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Update subscriber count (simulate)
function updateSubscriberCount() {
    const countElement = document.querySelector('.newsletter__count');
    const statElement = document.querySelector('.stat__number');
    
    if (countElement && statElement) {
        // Get current count and increment
        let currentCount = parseInt(countElement.textContent.replace(/[^0-9]/g, ''));
        currentCount += 1;
        
        // Update both locations
        countElement.textContent = `Join ${currentCount.toLocaleString()} subscribers`;
        statElement.textContent = currentCount.toLocaleString();
    }
}

// Animate elements on scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.pillar__card, .story__card, .testimonial__card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero__title');
    const originalText = heroTitle.textContent;
    
    // Add a slight delay before starting the typing effect
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 50);
    }, 500);
});

// Add glitch effect to cyber elements occasionally
function addGlitchEffect() {
    const cyberElements = document.querySelectorAll('.nav__brand, .hero__title, .newsletter__title');
    
    cyberElements.forEach(element => {
        if (Math.random() < 0.1) { // 10% chance
            element.style.textShadow = '2px 0 #ff00ff, -2px 0 #00ffff';
            element.style.animation = 'glitch 0.3s ease-in-out';
            
            setTimeout(() => {
                element.style.textShadow = '';
                element.style.animation = '';
            }, 300);
        }
    });
}

// Add glitch effect randomly
setInterval(addGlitchEffect, 10000); // Every 10 seconds

// Add CSS for glitch animation
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(glitchStyle);

// Add hover sound effect (optional, can be commented out)
function addHoverSounds() {
    const interactiveElements = document.querySelectorAll('.btn, .pillar__card, .story__card, .nav__link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Create a subtle audio feedback (optional)
            // This would require audio files, so it's commented out
            // playHoverSound();
        });
    });
}

// Initialize hover sounds
// addHoverSounds();

// Console easter egg for cybersecurity enthusiasts
console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║  🛡️  Welcome to CyberNarrative!                           ║
    ║                                                           ║
    ║  You found this console message! As a security           ║
    ║  professional, you know the importance of staying        ║
    ║  curious and exploring. Thank you for checking our       ║
    ║  code - transparency is key in cybersecurity.            ║
    ║                                                           ║
    ║  Stay secure! 🔐                                         ║
    ║                                                           ║
    ║  - The CyberNarrative Team                               ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
`);

// Add keyboard shortcuts for power users
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search (newsletter signup)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
            emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Performance optimization - lazy load images (if any were added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}