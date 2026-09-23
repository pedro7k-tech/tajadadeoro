document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 2. Animated Counter for Results Section
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const checkCounters = () => {
        if(hasAnimated) return;
        const resultsSection = document.getElementById('resultados');
        if(!resultsSection) return;
        
        const rect = resultsSection.getBoundingClientRect();
        if(rect.top < window.innerHeight && rect.bottom >= 0) {
            hasAnimated = true;
            animateCounters();
        }
    };

    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Trigger on load if in viewport

    // 3. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Testimonial Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length > 0) {
        let currentSlide = 0;

        const updateSlider = (index) => {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                    slide.style.opacity = '1';
                    slide.style.pointerEvents = 'auto';
                    slide.style.zIndex = '2';
                } else {
                    slide.classList.remove('active');
                    slide.style.opacity = '0';
                    slide.style.pointerEvents = 'none';
                    slide.style.zIndex = '1';
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let index = currentSlide - 1;
                if (index < 0) index = slides.length - 1;
                updateSlider(index);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let index = currentSlide + 1;
                if (index >= slides.length) index = 0;
                updateSlider(index);
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateSlider(i));
        });
    }

    // 6. Back Redirect Modal
    const backRedirectOverlay = document.getElementById('back-redirect-overlay');
    const btnStay = document.getElementById('btn-stay');
    const btnLeave = document.getElementById('btn-leave');

    if (backRedirectOverlay) {
        let isModalOpen = false;

        // Push state initially
        history.pushState(null, document.title, location.href);
        
        window.addEventListener('popstate', function (event) {
            if (!isModalOpen) {
                isModalOpen = true;
                backRedirectOverlay.classList.add('active');
                // Push state again so they don't immediately leave if they click back accidentally
                history.pushState(null, document.title, location.href);
            } else {
                isModalOpen = false;
                backRedirectOverlay.classList.remove('active');
            }
        });

        if (btnStay) {
            btnStay.addEventListener('click', () => {
                backRedirectOverlay.classList.remove('active');
                isModalOpen = false;
            });
        }

        if (btnLeave) {
            btnLeave.addEventListener('click', () => {
                window.history.go(-2); // Volta a história para sair
            });
        }
    }

});
