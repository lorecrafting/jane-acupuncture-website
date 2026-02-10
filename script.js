/* ========================================
   Jane Acupuncture - Interactive Features
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------
    // Mobile Navigation Toggle
    // -----------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const body = document.body;

    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // -----------------------------------------
    // Header Scroll Effect
    // -----------------------------------------
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // -----------------------------------------
    // Smooth Scroll for Anchor Links
    // -----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

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

    // -----------------------------------------
    // Scroll Reveal Animation
    // -----------------------------------------
    const revealElements = document.querySelectorAll(
        '.section__header, .about__content, .about__images, ' +
        '.service-card, .practitioner__image, .practitioner__content, ' +
        '.testimonial, .contact__info, .contact__form-wrapper'
    );

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // -----------------------------------------
    // Staggered Animation for Service Cards
    // -----------------------------------------
    const serviceCards = document.querySelectorAll('.service-card');

    const staggerObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        staggerObserver.observe(card);
    });

    // -----------------------------------------
    // Contact Form Handling
    // -----------------------------------------
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Validation
            if (!data.name || !data.email || !data.phone) {
                e.preventDefault();
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                e.preventDefault();
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show sending state (form will submit natively to Formsubmit.co)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification__close" aria-label="Close">&times;</button>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#5B7B6D' : '#c44',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease'
        });

        // Add close button functionality
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        // Add animation keyframes
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification__close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // -----------------------------------------
    // Phone Number Formatting
    // -----------------------------------------
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = value;
        });
    }

    // -----------------------------------------
    // Active Navigation Highlight
    // -----------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation, { passive: true });

    // -----------------------------------------
    // Parallax Effect for Hero Background
    // -----------------------------------------
    const heroBg = document.querySelector('.hero__bg');

    if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }, { passive: true });
    }

    // -----------------------------------------
    // Lazy Loading Images Enhancement
    // -----------------------------------------
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // -----------------------------------------
    // Condition Tags Interaction
    // -----------------------------------------
    const conditionTags = document.querySelectorAll('.condition-tag');

    conditionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Scroll to contact form when clicking a condition
            const contactSection = document.getElementById('contact');
            const serviceSelect = document.getElementById('service');
            const messageField = document.getElementById('message');

            if (contactSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Pre-fill the message with the condition
                setTimeout(() => {
                    if (messageField) {
                        messageField.value = `I'm interested in treatment for: ${tag.textContent}`;
                        messageField.focus();
                    }
                }, 800);
            }
        });
    });

    // -----------------------------------------
    // Add CSS for Active Nav Link
    // -----------------------------------------
    const activeNavStyles = document.createElement('style');
    activeNavStyles.textContent = `
        .nav__link.active {
            color: var(--color-primary);
        }
        .nav__link.active::after {
            width: 100%;
        }
        img {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        img.loaded, img[src]:not([data-src]) {
            opacity: 1;
        }
    `;
    document.head.appendChild(activeNavStyles);

    // Initialize loaded state for images without data-src
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });

});
