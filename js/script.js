document.addEventListener('DOMContentLoaded', () => {
    /*** NAVIGATION ***/
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    /*** ANIMATIONS ***/
    // Add global styles for animations
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .game-card.in-view, .about-text p.in-view, .qr-code.in-view {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
            }
        </style>
    `);
    
    // Fix for game card flicker issue
    const initGameCards = () => {
        const gameCards = document.querySelectorAll('.game-card');
        
        // First make cards visible to prevent flickering
        gameCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        // Then set transition animations with slight delay
        setTimeout(() => {
            gameCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
                card.style.transitionDelay = `${index * 0.2}s`;
            });
            
            // Force browser reflow
            void document.documentElement.offsetHeight;
            
            // Add in-view animation
            gameCards.forEach((card) => {
                card.classList.add('in-view');
            });
        }, 100);
    };
    
    // Initialize scroll animations with Intersection Observer
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    
        // Apply animations to about section paragraphs
        document.querySelectorAll('.about-text p').forEach((p, index) => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(20px)';
            p.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
            p.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(p);
        });
    
        // Apply animations to QR codes
        document.querySelectorAll('.qr-code').forEach((qr, index) => {
            qr.style.opacity = '0';
            qr.style.transform = 'scale(0.9)';
            qr.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
            qr.style.transitionDelay = `${index * 0.3 + 0.5}s`;
            observer.observe(qr);
        });
    };

    // 3D poster tilt effect
    const init3DPosterEffect = () => {
        const poster = document.getElementById('tiltPoster');
        if (!poster) return;
        
        const posterImg = poster.querySelector('img');
        
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
            const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
            
            posterImg.style.transform = `
                perspective(1000px)
                rotateY(${xPercent * 10}deg)
                rotateX(${-yPercent * 10}deg)
                scale(1.05)
            `;
            
            posterImg.style.boxShadow = `
                ${-xPercent * 20}px ${-yPercent * 20}px 30px rgba(0, 0, 0, 0.7)
            `;
        });
        
        poster.addEventListener('mouseleave', () => {
            posterImg.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
            posterImg.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        });
    };

    /*** INTERACTION HANDLERS ***/
    // Handle "View More" buttons in instruction manual
    const initViewMoreButtons = () => {
        const viewMoreBtns = document.querySelectorAll('.view-more-btn');
        
        viewMoreBtns.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Link to different pages based on button index
                if (index === 0) {
                    window.location.href = 'instruction1-more1.html';
                } else if (index === 1) {
                    window.location.href = 'instruction1-more2.html';
                }
            });
        });
    };

    /*** MOBILE NAVIGATION ***/
    // Mobile hamburger menu toggle
    const initMobileMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!(menuToggle && mobileNav)) {
            console.error('Mobile menu elements not found');
            return;
        }
        
        console.log('Mobile menu elements found');
        
        // Toggle menu on hamburger click
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu toggle clicked');
            
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Disable/enable scrolling when menu is active
            if (mobileNav.classList.contains('active')) {
                console.log('Opening mobile menu');
                document.body.style.overflow = 'hidden';
            } else {
                console.log('Closing mobile menu');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when a menu link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Mobile link clicked');
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    };

    // Initialize all components
    initGameCards();
    initScrollAnimations();
    init3DPosterEffect();
    initViewMoreButtons();
    initMobileMenu();
});
