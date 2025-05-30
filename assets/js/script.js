'use strict';

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// Element toggle function
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

// Typing animation
const titles = ["CFD Researcher", "OpenFOAM Developer", "ML Enthusiast", "Technology Innovator"];
let titleIndex = 0;
let charIndex = 0;
const titleElement = document.getElementById('typing-text');

function typeTitle() {
    if (titleElement) {
        if (charIndex < titles[titleIndex].length) {
            titleElement.textContent += titles[titleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeTitle, 100);
        } else {
            setTimeout(eraseTitle, 2000);
        }
    }
}

function eraseTitle() {
    if (titleElement) {
        if (charIndex > 0) {
            titleElement.textContent = titles[titleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseTitle, 50);
        } else {
            titleIndex = (titleIndex + 1) % titles.length;
            setTimeout(typeTitle, 500);
        }
    }
}

// Start typing animation
setTimeout(typeTitle, 2000);

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else {
        body.setAttribute('data-theme', 'dark');
    }
}

// Particle.js configuration
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 60 },
            color: { value: '#ffdb70' },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: true },
            size: { value: 3, random: true },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: true,
                out_mode: 'out'
            }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' }
            },
            modes: {
                repulse: { distance: 100 },
                push: { particles_nb: 3 }
            }
        }
    });
}

// Testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// Modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// Modal toggle function
const testimonialsModalFunc = function () {
    if (modalContainer && overlay) {
        modalContainer.classList.toggle("active");
        overlay.classList.toggle("active");
    }
}

// Add click event to all modal items
if (testimonialsItem) {
    for (let i = 0; i < testimonialsItem.length; i++) {
        testimonialsItem[i].addEventListener("click", function () {
            if (modalImg && modalTitle && modalText) {
                const avatarImg = this.querySelector("[data-testimonials-avatar]");
                const titleElement = this.querySelector("[data-testimonials-title]");
                const textElement = this.querySelector("[data-testimonials-text]");
                
                if (avatarImg) {
                    modalImg.src = avatarImg.src;
                    modalImg.alt = avatarImg.alt;
                }
                if (titleElement) modalTitle.innerHTML = titleElement.innerHTML;
                if (textElement) modalText.innerHTML = textElement.innerHTML;

                testimonialsModalFunc();
            }
        });
    }
}

// Add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

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
if (selectItems) {
    for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) selectValue.inner
