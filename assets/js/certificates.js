'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the energy plasma field for this page if available
  if (typeof EnergyPlasmaField !== 'undefined') {
    new EnergyPlasmaField();
  }

  // Modal elements
  const modal = document.querySelector('[data-cert-modal]');
  const modalOverlay = document.querySelector('[data-cert-overlay]');
  const certImage = document.getElementById('cert-image');
  const closeBtn = document.getElementById('image-close-btn');

  // Function to open modal with certificate image
  function openModal(imgSrc, altText) {
    certImage.src = imgSrc;
    certImage.alt = altText || 'Certificate Image';
    modal.style.display = 'flex'; // Use flex for centering modal content
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showNotification('Opening certificate...', 'info');
  }

  // Function to close modal
  function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('active');
    certImage.src = '';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    showNotification('Certificate viewer closed', 'info');
  }

  // Event delegation adjusted for certificates grid layout
  const certsGrid = document.querySelector('.certificates-grid');
  if (certsGrid) {
    certsGrid.addEventListener('click', function(event) {
      const btn = event.target.closest('button.view-btn');
      if (!btn) return;
      event.preventDefault();
      const imgSrc = btn.getAttribute('data-img-src');
      const certTitle = btn.closest('.certificate-card')?.querySelector('h3')?.textContent || 'Certificate';
      if (imgSrc) {
        openModal(imgSrc, certTitle);
      } else {
        showNotification('Certificate image not available.', 'error');
      }
    });
  }

  // Close modal actions
  modalOverlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // Close modal on Escape key press
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Notification function consistent with your styling
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} show`;
    const iconName = type === 'success' ? 'checkmark-circle-outline' :
                     type === 'error' ? 'alert-circle-outline' :
                     'information-circle-outline';
    notification.innerHTML = `
      <div class="notification-content">
        <ion-icon name="${iconName}"></ion-icon>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    let dismissDelay = 2000;
    if (type === 'success') dismissDelay = 3000;
    if (type === 'error') dismissDelay = 5000;
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) notification.parentNode.removeChild(notification);
      }, 300);
    }, dismissDelay);
  }

  // Disable right-click on image
  if (certImage) {
    certImage.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      // Optional: showNotification('Right-click is disabled on this image.', 'info');
    });
  }
});

