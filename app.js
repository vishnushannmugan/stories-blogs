/**
 * Stories Website JavaScript - Theme Toggle, Filtering, and Interactions
 * Author: Vishnu Shanmugan
 */

class StoriesApp {
  constructor() {
    this.stories = [];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.initializeTheme();
    this.setupThemeToggle();
    this.setupGenreFiltering();
    this.setupStoryInteractions();
    this.setupAnimations();
    this.loadStoryData();
    this.setupAccessibility();
  }

  /**
   * Theme Management
   */
  setupThemeToggle() {
    this.themeToggle = document.querySelector('.theme-toggle');
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    }
  }

  initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('stories-theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemPreference;
    
    this.setTheme(initialTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener((e) => {
      if (!localStorage.getItem('stories-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    
    // Save preference
    localStorage.setItem('stories-theme', newTheme);
    
    // Add feedback animation
    if (this.themeToggle) {
      this.themeToggle.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.themeToggle.style.transform = '';
      }, 150);
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Update theme toggle button aria-label
    if (this.themeToggle) {
      this.themeToggle.setAttribute('aria-label', 
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    console.log('Theme changed to:', theme);
  }

  /**
   * Genre Filtering System
   */
  setupGenreFiltering() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.storyCards = document.querySelectorAll('.story-card');
    
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleFilterClick(e);
      });
    });
  }

  handleFilterClick(e) {
    const button = e.currentTarget;
    const genre = button.dataset.genre;
    
    // Update active state
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter stories with animation
    this.filterStories(genre);
    
    // Update current filter
    this.currentFilter = genre;
    
    // Add click feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 100);
    
    // Dispatch filter changed event
    window.dispatchEvent(new CustomEvent('filterChanged', { detail: { genre } }));
    
    console.log('Filter changed to:', genre);
  }

  filterStories(genre) {
    this.storyCards.forEach((card, index) => {
      const cardGenres = card.dataset.genres.toLowerCase().split(' ');
      const shouldShow = genre === 'all' || cardGenres.some(cardGenre => cardGenre === genre);
      
      if (shouldShow) {
        // Show with staggered animation
        setTimeout(() => {
          card.classList.remove('hidden');
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
      } else {
        // Hide with animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          card.classList.add('hidden');
        }, 300);
      }
    });
    
    // Update counts
    setTimeout(() => {
      const visibleCount = document.querySelectorAll('.story-card:not(.hidden)').length;
      console.log(`Showing ${visibleCount} stories for ${genre} filter`);
    }, 400);
  }

  /**
   * Story Data Management
   */
  loadStoryData() {
    // Extract story data from the DOM
    this.storyCards = document.querySelectorAll('.story-card');
    this.stories = Array.from(this.storyCards).map(card => ({
      id: card.dataset.id,
      genres: card.dataset.genres.split(' '),
      title: card.querySelector('.story-title').textContent,
      synopsis: card.querySelector('.story-synopsis').textContent,
      element: card
    }));
    
    console.log('Loaded stories:', this.stories.length);
  }

  /**
   * Story Card Interactions
   */
  setupStoryInteractions() {
    this.storyCards = document.querySelectorAll('.story-card');
    this.storyCards.forEach(card => {
      this.setupCardHover(card);
      this.setupReadMoreButton(card);
      this.setupCardKeyboardNavigation(card);
    });
  }

  setupCardHover(card) {
    const handleMouseEnter = () => {
      // Add subtle animation to other cards
      this.storyCards.forEach(otherCard => {
        if (otherCard !== card && !otherCard.classList.contains('hidden')) {
          otherCard.style.opacity = '0.7';
          otherCard.style.transform = 'scale(0.98)';
        }
      });
    };

    const handleMouseLeave = () => {
      // Reset all cards
      this.storyCards.forEach(otherCard => {
        if (!otherCard.classList.contains('hidden')) {
          otherCard.style.opacity = '';
          otherCard.style.transform = '';
        }
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  }

  setupReadMoreButton(card) {
    const readMoreBtn = card.querySelector('.read-more-btn');
    if (readMoreBtn) {
      readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleReadMoreClick(card);
      });
    }
  }

  handleReadMoreClick(card) {
    const storyId = card.dataset.id;
    const storyTitle = card.querySelector('.story-title').textContent;
    
    // Placeholder for actual story loading
    console.log(`Opening story: ${storyTitle} (ID: ${storyId})`);
    
    // Show a notification
    this.showNotification(`"${storyTitle}" - Full story coming soon!`);
    
    // Add visual feedback to the button
    const readMoreBtn = card.querySelector('.read-more-btn');
    if (readMoreBtn) {
      readMoreBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        readMoreBtn.style.transform = '';
      }, 150);
    }
    
    // Analytics tracking
    this.trackStoryClick(storyId, storyTitle);
  }

  setupCardKeyboardNavigation(card) {
    const readMoreBtn = card.querySelector('.read-more-btn');
    
    // Make card focusable
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (readMoreBtn) {
          readMoreBtn.click();
        }
      }
    });

    // Focus styles
    card.addEventListener('focus', () => {
      card.style.outline = '2px solid var(--color-primary)';
      card.style.outlineOffset = '4px';
    });

    card.addEventListener('blur', () => {
      card.style.outline = '';
      card.style.outlineOffset = '';
    });
  }

  /**
   * Animation Setup
   */
  setupAnimations() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupSmoothScrolling();
  }

  setupScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

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

    // Observe elements for scroll animations
    const elementsToObserve = document.querySelectorAll('.story-card, .genre-filter, .about-content');
    elementsToObserve.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(element);
    });
  }

  setupParallaxEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const header = document.querySelector('.header');
    if (header) {
      let ticking = false;
      
      const updateParallax = () => {
        const scrolled = window.pageYOffset;
        if (scrolled < header.offsetHeight) {
          const speed = scrolled * 0.3;
          header.style.transform = `translateY(${speed}px)`;
        }
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    }
  }

  setupSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Accessibility Features
   */
  setupAccessibility() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Skip to main content with 'S' key
      if (e.key.toLowerCase() === 's' && e.altKey) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Toggle theme with 'T' key
      if (e.key.toLowerCase() === 't' && e.altKey) {
        e.preventDefault();
        this.toggleTheme();
      }

      // Filter stories with number keys (1-6)
      if (e.key >= '1' && e.key <= '6' && e.altKey) {
        e.preventDefault();
        const filterIndex = parseInt(e.key) - 1;
        const filterBtn = this.filterButtons[filterIndex];
        if (filterBtn) {
          filterBtn.click();
        }
      }
    });

    // Add focus indicators for better accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupScreenReaderSupport() {
    // Add ARIA labels and descriptions
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.filterButtons.forEach((button, index) => {
      const genre = button.dataset.genre;
      const countEl = button.querySelector('.count');
      const count = countEl ? countEl.textContent : '';
      button.setAttribute('aria-label', `Filter by ${genre} genre ${count}`);
    });

    // Add live region for filter updates
    if (!document.getElementById('filter-status')) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'filter-status';
      document.body.appendChild(liveRegion);
    }

    // Update live region when filter changes
    window.addEventListener('filterChanged', (e) => {
      setTimeout(() => {
        const visibleCount = document.querySelectorAll('.story-card:not(.hidden)').length;
        const liveRegion = document.getElementById('filter-status');
        if (liveRegion) {
          liveRegion.textContent = `Showing ${visibleCount} stories for ${e.detail.genre} filter`;
        }
      }, 500);
    });
  }

  setupFocusManagement() {
    // Manage focus for better keyboard navigation
    let focusedElementBeforeModal = null;

    // Store focus when modals open (for future modal implementation)
    window.addEventListener('modalOpen', () => {
      focusedElementBeforeModal = document.activeElement;
    });

    window.addEventListener('modalClose', () => {
      if (focusedElementBeforeModal) {
        focusedElementBeforeModal.focus();
        focusedElementBeforeModal = null;
      }
    });
  }

  /**
   * Utility Functions
   */
  
  showNotification(message, duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--color-primary);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-base);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Remove after duration
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  trackStoryClick(storyId, storyTitle) {
    // Analytics tracking (placeholder)
    console.log('Story clicked:', { storyId, storyTitle, filter: this.currentFilter });
    
    // In a real implementation, this would send data to analytics service
    // Example: gtag('event', 'story_click', { story_id: storyId, story_title: storyTitle });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Error Handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Stories app error:', e.error);
      this.showNotification('Something went wrong. Please refresh the page.', 5000);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.showNotification('Something went wrong. Please refresh the page.', 5000);
    });
  }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the main application
  const app = new StoriesApp();
  
  // Make app available globally for debugging
  window.storiesApp = app;
  
  // Setup error handling
  app.setupErrorHandling();
  
  console.log('Stories app initialized successfully');
});

/**
 * Handle page visibility changes for performance optimization
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden, pausing operations');
  } else {
    console.log('Page visible, resuming operations');
  }
});

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', 
  (() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('Window resized, adjusting layout');
      }, 250);
    };
  })()
);

/**
 * Console welcome message with keyboard shortcuts
 */
console.log(`
📚 Stories by Vishnu Shanmugan
✨ Interactive fiction storytelling website
🌙 Theme toggle: Alt + T
⌨️  Skip to main: Alt + S  
🔢 Filter shortcuts: Alt + 1-6
📧 Contact: contact@vishnushanmugan.in
`);

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoriesApp;
}