'use strict';

// Energy Plasma Field Animation
class EnergyPlasmaField {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.plasmaNodes = [];
    this.lightningBolts = [];
    this.energyParticles = [];
    this.animationId = null;
    this.time = 0;
    this.mouse = { x: 0, y: 0 };
    this.isRunning = true;
    this.config = {
      nodeCount: 12,
      particleCount: 80,
      lightningFrequency: 0.02,
      energyIntensity: 1.0,
      plasmaRadius: 150,
      boltDuration: 30,
      colors: {
        plasma: { r: 138, g: 43, b: 226 },
        lightning: { r: 255, g: 255, b: 255 },
        energy: { r: 0, g: 191, b: 255 },
        core: { r: 255, g: 20, b: 147 }
      }
    };
    this.init();
  }

  init() {
    this.createCanvas();
    this.generatePlasmaNodes();
    this.generateEnergyParticles();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'plasmaCanvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%);
    `;
    
    let bgDiv = document.querySelector('.animated-background');
    if (!bgDiv) {
      bgDiv = document.createElement('div');
      bgDiv.className = 'animated-background';
      bgDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      `;
      document.body.appendChild(bgDiv);
    }

    bgDiv.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.updateCanvasSize();
    window.addEventListener('resize', () => this.updateCanvasSize());
  }

  updateCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  generatePlasmaNodes() {
    this.plasmaNodes = [];
    for (let i = 0; i < this.config.nodeCount; i++) {
      this.plasmaNodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        energy: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        radius: Math.random() * 50 + 30,
        connections: [],
        lastLightning: 0
      });
    }
  }

  generateEnergyParticles() {
    this.energyParticles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.energyParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 3 + 1,
        energy: Math.random(),
        life: 1,
        type: Math.random() > 0.7 ? 'charged' : 'neutral'
      });
    }
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('click', (e) => {
      this.createEnergyBurst(e.clientX, e.clientY);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  createEnergyBurst(x, y) {
    this.plasmaNodes.push({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      energy: 2.0,
      phase: 0,
      pulseSpeed: 0.1,
      radius: 100,
      connections: [],
      lastLightning: 0,
      isTemporary: true,
      life: 1.0
    });

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = Math.random() * 5 + 3;
      this.energyParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        energy: 1.0,
        life: 1.0,
        type: 'charged'
      });
    }
  }

  generateLightningBolt(startNode, endNode) {
    const segments = [];
    const numSegments = 8;
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      const x = startNode.x + (endNode.x - startNode.x) * t;
      const y = startNode.y + (endNode.y - startNode.y) * t;
      const offsetX = (Math.random() - 0.5) * 30 * (1 - Math.abs(t - 0.5) * 2);
      const offsetY = (Math.random() - 0.5) * 30 * (1 - Math.abs(t - 0.5) * 2);
      segments.push({
        x: x + offsetX,
        y: y + offsetY
      });
    }

    this.lightningBolts.push({
      segments: segments,
      life: this.config.boltDuration,
      intensity: startNode.energy * endNode.energy,
      startNode: startNode,
      endNode: endNode
    });
  }

  updateAnimation() {
    if (!this.isRunning) return;
    
    this.time += 0.016;
    
    // Update plasma nodes
    this.plasmaNodes.forEach((node, index) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -50) node.x = this.canvas.width + 50;
      if (node.x > this.canvas.width + 50) node.x = -50;
      if (node.y < -50) node.y = this.canvas.height + 50;
      if (node.y > this.canvas.height + 50) node.y = -50;

      node.phase += node.pulseSpeed;
      node.currentEnergy = node.energy * (0.7 + 0.3 * Math.sin(node.phase));

      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 200) {
        const force = (200 - distance) / 200;
        node.energy = Math.min(2, node.energy + force * 0.05);
      }

      if (node.isTemporary) {
        node.life -= 0.02;
        node.energy *= 0.98;
        if (node.life <= 0) {
          this.plasmaNodes.splice(index, 1);
        }
      }

      node.lastLightning++;
      if (node.lastLightning > 60 && Math.random() < this.config.lightningFrequency * node.currentEnergy) {
        this.plasmaNodes.forEach(otherNode => {
          if (otherNode !== node) {
            const dist = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
            if (dist < 300 && Math.random() < 0.3) {
              this.generateLightningBolt(node, otherNode);
              node.lastLightning = 0;
            }
          }
        });
      }
    });

    // Update energy particles
    this.energyParticles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      this.plasmaNodes.forEach(node => {
        const dx = node.x - particle.x;
        const dy = node.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius * 2) {
          const force = node.currentEnergy * 0.001;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
          particle.energy = Math.min(1, particle.energy + force * 10);
        }
      });

      particle.vx *= 0.99;
      particle.vy *= 0.99;
      particle.energy *= 0.995;

      if (particle.energy < 0.1 && Math.random() < 0.01) {
        this.energyParticles.splice(index, 1);
        this.energyParticles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 3 + 1,
          energy: Math.random(),
          life: 1,
          type: Math.random() > 0.7 ? 'charged' : 'neutral'
        });
      }
    });

    // Update lightning bolts
    this.lightningBolts.forEach((bolt, index) => {
      bolt.life--;
      if (bolt.life <= 0) {
        this.lightningBolts.splice(index, 1);
      }
    });
  }

  drawPlasmaNodes() {
    this.plasmaNodes.forEach(node => {
      const intensity = node.currentEnergy;
      const coreGradient = this.ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius
      );
      const { r, g, b } = this.config.colors.plasma;
      coreGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity * 0.8})`);
      coreGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity * 0.4})`);
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = coreGradient;
      this.ctx.fill();

      if (intensity > 0.5) {
        const coreSize = node.radius * 0.3 * intensity;
        const coreGlow = this.ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, coreSize
        );
        const { r: cr, g: cg, b: cb } = this.config.colors.core;
        coreGlow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${intensity})`);
        coreGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, coreSize, 0, Math.PI * 2);
        this.ctx.fillStyle = coreGlow;
        this.ctx.fill();
      }
    });
  }

  drawLightningBolts() {
    this.lightningBolts.forEach(bolt => {
      const opacity = bolt.life / this.config.boltDuration;
      const { r, g, b } = this.config.colors.lightning;

      this.ctx.beginPath();
      this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
      for (let i = 1; i < bolt.segments.length; i++) {
        this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
      }

      this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * bolt.intensity})`;
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      this.ctx.beginPath();
      this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
      for (let i = 1; i < bolt.segments.length; i++) {
        this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
      }

      this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity * bolt.intensity * 0.5})`;
      this.ctx.lineWidth = 6;
      this.ctx.stroke();
    });
  }

  drawEnergyParticles() {
    this.energyParticles.forEach(particle => {
      const { r, g, b } = particle.type === 'charged' ?
        this.config.colors.energy :
        this.config.colors.plasma;
      const size = particle.size * (0.5 + particle.energy * 0.5);
      const opacity = particle.energy;

      if (particle.energy > 0.3) {
        const glowSize = size * 3;
        const gradient = this.ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      this.ctx.fill();
    });
  }

  animate() {
    if (!this.isRunning) return;
    
    this.ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateAnimation();
    this.drawPlasmaNodes();
    this.drawLightningBolts();
    this.drawEnergyParticles();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// Portfolio functionality
const elementToggleFunc = function (elem) { 
  elem.classList.toggle("active"); 
}

// Sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// Sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { 
    elementToggleFunc(sidebar); 
  });
}

// Testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// Modal variables
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// Modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// Add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// Add click event to modal close button
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
}

if (overlay) {
  overlay.addEventListener("click", testimonialsModalFunc);
}

// Custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { 
    elementToggleFunc(this); 
  });
}

// Add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// Filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// Add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// Contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// Add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// Initialize Energy Plasma Field
let energyPlasmaField;

document.addEventListener('DOMContentLoaded', function() {
  energyPlasmaField = new EnergyPlasmaField();
  window.energyPlasmaField = energyPlasmaField;
  
  // Typing animation for title
  const titles = ["CFD Researcher", "OpenFOAM Developer", "ML Enthusiast", "Technology Innovator"];
  let titleIndex = 0;
  let charIndex = 0;
  const titleElement = document.querySelector('.title');
  
  if (titleElement) {
    function typeTitle() {
      if (charIndex < titles[titleIndex].length) {
        titleElement.textContent += titles[titleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeTitle, 100);
      } else {
        setTimeout(eraseTitle, 2000);
      }
    }

    function eraseTitle() {
      if (charIndex > 0) {
        titleElement.textContent = titles[titleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseTitle, 50);
      } else {
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(typeTitle, 500);
      }
    }

    typeTitle();
  }

  // Animated skill progress bars
  function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    skillBars.forEach(bar => {
      const targetWidth = bar.style.width;
      const numericWidth = parseInt(targetWidth);
      let currentWidth = 0;
      bar.style.width = '0%';

      const interval = setInterval(() => {
        if (currentWidth >= numericWidth) {
          clearInterval(interval);
        } else {
          currentWidth += 2;
          bar.style.width = currentWidth + '%';
        }
      }, 50);
    });
  }

  // Trigger animation when skills section is visible
  const skillSection = document.querySelector('.skill');
  if (skillSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkills();
        }
      });
    });
    observer.observe(skillSection);
  }
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// Dark/Light Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  
  // Theme toggle event listener
  themeToggle.addEventListener('click', function() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a little animation feedback
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 150);
  });
  
  // Enhanced hover effects with sound feedback (optional)
  const navLinks = document.querySelectorAll('.navbar-link');
  const socialLinks = document.querySelectorAll('.social-link');
  
  // Add ripple effect on click for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 193, 7, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});


// Contact_Email_script
// EmailJS Configuration
(function() {
  // Initialize EmailJS with your public key
  emailjs.init("hnxuHVQNiHCiC3u18"); // Replace with your actual public key
})();

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-btn');
  const statusMessage = document.getElementById('status-message');

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Show loading state
      sendBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
      sendBtn.disabled = true;
      
      // Send email using EmailJS
      emailjs.sendForm('service_a4hwkf8', 'template_9ybcxl8', this)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          showStatusMessage('Message sent successfully! Thank you for contacting me.', 'success');
          contactForm.reset();
        }, function(error) {
          console.log('FAILED...', error);
          showStatusMessage('Failed to send message. Please try again or contact me directly.', 'error');
        })
        .finally(function() {
          // Reset button
          sendBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
          sendBtn.disabled = false;
        });
    });
  }

  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    statusMessage.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    statusMessage.style.color = 'white';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 5000);
  }
});
// Contact email script Ens


//reseach stuffs------------
// Research Videos Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize video functionality
  initializeResearchVideos();
});

function initializeResearchVideos() {
  const videoCards = document.querySelectorAll('.video-card');
  
  videoCards.forEach(card => {
    const video = card.querySelector('.research-video');
    const overlay = card.querySelector('.video-overlay');
    const playButton = card.querySelector('.play-button');
    
    if (video && overlay && playButton) {
      // Handle video loading
      video.addEventListener('loadstart', function() {
        card.classList.add('loading');
      });
      
      video.addEventListener('loadeddata', function() {
        card.classList.remove('loading');
      });
      
      // Handle play button click
      playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
      
      // Handle video play/pause
      video.addEventListener('play', function() {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      });
      
      video.addEventListener('pause', function() {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      });
      
      video.addEventListener('ended', function() {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      });
      
      // Handle video errors
      video.addEventListener('error', function() {
        console.error('Error loading video:', video.src);
        card.classList.remove('loading');
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'video-error';
        errorMsg.innerHTML = `
          <ion-icon name="alert-circle-outline"></ion-icon>
          <p>Error loading video</p>
        `;
        errorMsg.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--bittersweet-shimmer);
          text-align: center;
          font-size: var(--fs-6);
        `;
        
        card.querySelector('.video-container').appendChild(errorMsg);
      });
      
      // Optimize video loading
      video.addEventListener('loadedmetadata', function() {
        // Set video poster if not set
        if (!video.poster) {
          // Create a canvas to capture first frame as poster
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          video.currentTime = 1; // Seek to 1 second
          video.addEventListener('seeked', function() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            video.poster = canvas.toDataURL();
            video.currentTime = 0; // Reset to beginning
          }, { once: true });
        }
      });
      
      // Intersection Observer for lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target.querySelector('.research-video');
            if (video && !video.src) {
              const source = video.querySelector('source');
              if (source && source.dataset.src) {
                source.src = source.dataset.src;
                video.load();
              }
            }
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });
      
      observer.observe(card);
    }
  });
}

// Video quality selector (optional enhancement)
function addVideoQualitySelector(video) {
  const qualities = [
    { label: '720p', src: video.src.replace('.mp4', '_720p.mp4') },
    { label: '480p', src: video.src.replace('.mp4', '_480p.mp4') },
    { label: '360p', src: video.src.replace('.mp4', '_360p.mp4') }
  ];
  
  // Implementation for quality selector would go here
  // This is a placeholder for future enhancement
}

// Video analytics (optional)
function trackVideoInteraction(video, action) {
  // Track video interactions for analytics
  console.log(`Video ${action}:`, video.src);
  
  // You can integrate with analytics services here
  // Example: Google Analytics, Adobe Analytics, etc.
}
//-------------------Research stuffs ends----------
