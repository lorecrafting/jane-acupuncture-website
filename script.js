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
        '.testimonial, .contact__centered'
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
            // Scroll to contact section when clicking a condition
            const contactSection = document.getElementById('contact');

            if (contactSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
