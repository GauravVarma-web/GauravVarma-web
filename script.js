// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('nav a');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: 'smooth'
            });
        });
    }
    
    // Fade-in animation for sections
    const allSections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    allSections.forEach(section => {
        section.classList.add('section');
        observer.observe(section);
    });
    
    // Project modals
    const modalButtons = document.querySelectorAll('.show-modal');
    const closeModal = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');
    
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    closeModal.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }
    
    // Add skill progress animation
    const skillBars = document.querySelectorAll('.skill-bar');
    
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress');
                    const targetWidth = progressBar.getAttribute('data-width');
                    progressBar.style.width = targetWidth;
                }
            });
        }, { threshold: 0.1 });
        
        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }
    
    // Typing effect for hero section
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const phrases = JSON.parse(typingElement.getAttribute('data-phrases'));
        let currentPhrase = 0;
        let currentChar = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentText = phrases[currentPhrase];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, currentChar - 1);
                currentChar--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, currentChar + 1);
                currentChar++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && currentChar === currentText.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at end
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typingSpeed = 500; // Pause before next phrase
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start the typing effect
        setTimeout(type, 1000);
    }
    
    // Add year to copyright in footer
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
// Particle animation for header
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.size > 0.2) this.size -= 0.01;
            
            // Wrap around edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        particlesArray = [];
        const numberOfParticles = canvas.width > 768 ? 70 : 40;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Create connections between particles
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/500})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
            
            // Remove small particles and add new ones
            if (particlesArray[i].size <= 0.2) {
                particlesArray.splice(i, 1);
                i--;
                particlesArray.push(new Particle());
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle resize
    window.addEventListener('resize', function() {
        resizeCanvas();
        init();
    });
    
    // Initialize
    resizeCanvas();
    init();
    animate();
});
