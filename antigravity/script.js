// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out',
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // Typing Effect Logic
    const texts = [
        "Data Analyst", 
        "Business Analyst", 
        "SQL Developer", 
        "Data Storyteller"
    ];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    const typeSpeed = 100;
    const eraseSpeed = 50;
    const delayBetween = 2000;
    let isDeleting = false;

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        document.getElementById('typed-text').textContent = letter;

        let typeDelay = isDeleting ? eraseSpeed : typeSpeed;

        if (!isDeleting && letter.length === currentText.length) {
            typeDelay = delayBetween;
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeDelay = 500;
        }

        setTimeout(type, typeDelay);
    }

    // Start typing effect only after page starts loading
    setTimeout(type, 1000);

    // Interactive Cursor Glow Logic
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
        });

        // Make the glow slightly bigger when hovering over links or buttons
        const interactables = document.querySelectorAll('a, button, .project-row, .stat-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                glow.style.width = '700px';
                glow.style.height = '700px';
                glow.style.background = 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%)'; // Changes to secondary color on hover
                glow.style.transform = `translate(${e.clientX - 350}px, ${e.clientY - 350}px)`;
            });
            el.addEventListener('mouseleave', () => {
                glow.style.width = '500px';
                glow.style.height = '500px';
                glow.style.background = 'radial-gradient(circle, rgba(250, 204, 21, 0.1) 0%, transparent 60%)'; // Back to primary color
                glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
            });
        });
    }

    // Expandable Projects Logic
    const accordionItems = document.querySelectorAll('.project-accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if(header) {
            header.addEventListener('click', () => {
                // Toggle the expanded state
                item.classList.toggle('expanded');
                
                // Update the hint text dynamically
                const hintText = item.querySelector('.expand-hint span');
                if (hintText) {
                    hintText.innerText = item.classList.contains('expanded') ? 'Click to collapse details' : 'Click to expand deep case study';
                }
            });
        }
    });

    // --- Gold Spark Particle System ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(x, y, isStatic = false) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 1.5 + 0.5; // Smaller size
                this.speedX = Math.random() * 2 - 1;   // Slower speed
                this.speedY = Math.random() * 2 - 1;
                this.color = '#d4af37'; // Pure Gold
                this.opacity = 1;
                this.life = Math.random() * 30 + 20; // Shorter life
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.01;
                this.opacity -= 1 / this.life;
            }

            draw() {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.shadowBlur = 8; // Added Glow
                ctx.shadowColor = '#d4af37';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function createSparks(e) {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            if (!x || !y) return;
            // Fewer particles for minimal look
            if (Math.random() > 0.1) {
                particles.push(new Particle(x, y));
            }
        }

        window.addEventListener('mousemove', createSparks);
        window.addEventListener('click', (e) => {
            for (let i = 0; i < 15; i++) {
                particles.push(new Particle(e.clientX, e.clientY));
            }
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].opacity <= 0 || particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }
});

// Tab Switching Logic for Featured Project
function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
        tabContents[i].classList.remove("active-tab");
    }

    // Remove active class from all buttons
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    const selectedTab = document.getElementById(tabName);
    selectedTab.style.display = "block";
    selectedTab.classList.add("active-tab");
    evt.currentTarget.classList.add("active");
}

// Active Nav Link mapping
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}
