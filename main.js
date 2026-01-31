// Main JavaScript for Batman ExamShield Website

// Fetch and display OTP
async function fetchOTP() {
    try {
        // Add cache-busting parameter to always fetch fresh data
        const cacheBuster = new Date().getTime();
        const response = await fetch(`https://gist.githubusercontent.com/kishore-education/083affc1b34dcabdafe6a88f67728524/raw/?t=${cacheBuster}`, {
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const otpElement = document.getElementById('otp-value');
        if (otpElement && data.password) {
            otpElement.textContent = data.password;
            otpElement.style.color = '#00ff00';
            console.log('✅ OTP fetched successfully:', data.password);
        } else if (otpElement) {
            otpElement.textContent = 'No OTP Available';
            otpElement.style.color = '#ff6b6b';
        }
    } catch (error) {
        console.error('❌ Error fetching OTP:', error.message, error);
        const otpElement = document.getElementById('otp-value');
        if (otpElement) {
            // Show more specific error message
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                otpElement.textContent = 'Network Error / CORS Issue';
            } else {
                otpElement.textContent = 'Error: ' + error.message;
            }
            otpElement.style.color = '#ff6b6b';
            otpElement.style.fontSize = '18px';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch OTP on page load (after DOM is ready)
    fetchOTP();
    
    // Refresh OTP every 30 seconds
    setInterval(fetchOTP, 30000);
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .step, .shortcut-card, .works-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                button.textContent = 'Message Sent! ✓';
                button.style.background = '#28a745';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeft = '4px solid var(--primary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeft = 'none';
        });
    });

    // Typing effect for hero title (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let index = 0;
        
        // Disable typing effect for better performance
        heroTitle.innerHTML = text;
    }

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.hero-stats');

    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        const target = stat.textContent;
                        const isNumber = !isNaN(parseInt(target));
                        
                        if (isNumber) {
                            animateCounter(stat, parseInt(target));
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 30);
    }

    // Add active class to current nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--primary-color)';
                        link.style.fontWeight = '700';
                    } else {
                        link.style.color = '';
                        link.style.fontWeight = '500';
                    }
                });
            }
        });
    });

    // Copy shortcut on click
    const shortcutCards = document.querySelectorAll('.shortcut-card');
    shortcutCards.forEach(card => {
        card.addEventListener('click', function() {
            const keys = this.querySelector('.shortcut-keys').textContent.trim();
            
            // Create temporary element to copy text
            const tempInput = document.createElement('input');
            tempInput.value = keys;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show feedback
            const originalBg = this.style.background;
            this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.style.color = 'white';
            
            const heading = this.querySelector('h4');
            const originalText = heading.textContent;
            heading.textContent = 'Copied! ✓';
            
            setTimeout(() => {
                this.style.background = originalBg;
                this.style.color = '';
                heading.textContent = originalText;
            }, 1000);
        });
    });

    // Add scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
        } else {
            scrollButton.style.opacity = '0';
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });

    // Top Announcement Bar Logic
    const announcementBar = document.getElementById('announcement-bar');
    const closeAnnouncementBtn = document.getElementById('close-announcement');
    
    // Check if announcement has been closed previously
    // Using a new key for this specific announcement
    const announcementId = 'announcement_all_urls_v1';
    
    if (announcementBar && !localStorage.getItem(announcementId)) {
        // Show announcement
        announcementBar.style.display = 'flex';
        document.body.classList.add('has-announcement');
        
        // Handle close
        if (closeAnnouncementBtn) {
            closeAnnouncementBtn.addEventListener('click', function() {
                announcementBar.style.display = 'none';
                document.body.classList.remove('has-announcement');
                localStorage.setItem(announcementId, 'closed');
            });
        }
    }

    // Log initialization
    console.log('🦇 Batman ExamShield Website Initialized');
});
