'use strict';

// Spiritual Books Page Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the energy plasma field for this page too
  if (typeof EnergyPlasmaField !== 'undefined') {
    new EnergyPlasmaField();
  }
  
  // Books data storage
  let booksData = [
    {
      id: 1,
      title: "The Power of Now",
      description: "A Guide to Spiritual Enlightenment",
      filename: "TU_book.pdf",
      path: "./assets/pdfs/TU_book.pdf"
    }
  ];
  
  // Add book form handling
  const addBookForm = document.getElementById('addBookForm');
  if (addBookForm) {
    addBookForm.addEventListener('submit', handleAddBook);
  }
  
  // Test PDF accessibility after a short delay to ensure page is fully loaded
  setTimeout(() => {
    testPDFAccess();
  }, 1000);
});

// Test PDF file accessibility (removed immediate error notification)
function testPDFAccess() {
  const pdfPath = './assets/pdfs/TU_book.pdf';
  fetch(pdfPath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log('✅ PDF file is accessible');
        // Only show success notification if explicitly needed
        // showNotification('PDF file loaded successfully', 'success');
      } else {
        console.error('❌ PDF file not accessible:', response.status);
        // Only show error if it's a real issue, not on page load
      }
    })
    .catch(error => {
      console.error('❌ Error accessing PDF:', error);
      // Only show error if user tries to access the file
    });
}

// Enhanced PDF viewing function with better error handling
function viewPDF(pdfPath) {
  console.log('Attempting to view PDF:', pdfPath);
  
  // Show loading notification
  showNotification('Opening PDF...', 'info');
  
  // Method 1: Direct window.open with better error handling
  try {
    const newWindow = window.open(pdfPath, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.log('Popup blocked, trying alternative method');
      viewPDFAlternative(pdfPath);
    } else {
      // Check if PDF loads successfully
      newWindow.onload = function() {
        showNotification('PDF opened successfully!', 'success');
      };
      
      newWindow.onerror = function() {
        showNotification('Error loading PDF. Please check if the file exists.', 'error');
      };
      
      // Fallback: if window doesn't load within 3 seconds, assume success
      setTimeout(() => {
        if (newWindow && !newWindow.closed) {
          showNotification('PDF opened in new window', 'success');
        }
      }, 3000);
    }
  } catch (error) {
    console.error('Error opening PDF:', error);
    viewPDFAlternative(pdfPath);
  }
}

// Alternative PDF viewing method
function viewPDFAlternative(pdfPath) {
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = pdfPath;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  
  // Add to document temporarily
  document.body.appendChild(link);
  
  // Trigger click
  try {
    link.click();
    showNotification('PDF opened successfully', 'success');
  } catch (error) {
    console.error('Error with alternative method:', error);
    showNotification('Unable to open PDF. Please check your browser settings.', 'error');
  }
  
  // Clean up
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 100);
}

// Enhanced download function with better feedback
function downloadPDF(pdfPath, filename) {
  console.log('Attempting to download PDF:', pdfPath, 'as', filename);
  
  // Show loading notification
  showNotification('Preparing download...', 'info');
  
  // Method 1: Fetch and create blob
  fetch(pdfPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      
      // Add to document and trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        if (downloadLink.parentNode) {
          downloadLink.parentNode.removeChild(downloadLink);
        }
      }, 100);
      
      showNotification('Download started successfully!', 'success');
    })
    .catch(error => {
      console.error('Fetch download failed:', error);
      // Fallback: Direct download link
      downloadPDFDirect(pdfPath, filename);
    });
}

// Direct download fallback
function downloadPDFDirect(pdfPath, filename) {
  const link = document.createElement('a');
  link.href = pdfPath;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  
  try {
    link.click();
    showNotification('Download initiated', 'success');
  } catch (error) {
    console.error('Direct download failed:', error);
    showNotification('Download failed. Please try right-clicking the View button and select "Save link as"', 'error');
  }
  
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 100);
}

// Function to show add book modal
function showAddBookModal() {
  const modal = document.getElementById('addBookModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Function to close add book modal
function closeAddBookModal() {
  const modal = document.getElementById('addBookModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('addBookForm');
    if (form) {
      form.reset();
    }
  }
}

// Function to handle adding new book
function handleAddBook(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const bookTitle = formData.get('bookTitle');
  const bookDescription = formData.get('bookDescription');
  const bookFile = formData.get('bookFile');
  
  if (!bookTitle || !bookFile) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }
  
  // In a real application, you would upload the file to a server
  addBookToTable({
    title: bookTitle,
    description: bookDescription || 'No description provided',
    filename: bookFile.name,
    path: '#' // Placeholder path
  });
  
  closeAddBookModal();
  showNotification('Book added successfully! (Note: File upload simulation)', 'success');
}

// Function to add book to table
function addBookToTable(book) {
  const tableBody = document.getElementById('booksTableBody');
  if (!tableBody) return;
  
  const rowCount = tableBody.children.length + 1;
  const newRow = document.createElement('tr');
  newRow.className = 'book-row';
  
  newRow.innerHTML = `
    <td>${rowCount}</td>
    <td>
      <div class="book-info">
        <div class="book-icon">
          <ion-icon name="book-outline"></ion-icon>
        </div>
        <div class="book-details">
          <h3>${book.title}</h3>
          <p>${book.description}</p>
        </div>
      </div>
    </td>
    <td>
      <div class="action-buttons">
        <button class="view-btn" onclick="viewPDF('${book.path}')">
          <ion-icon name="eye-outline"></ion-icon>
          View
        </button>
        <button class="download-btn" onclick="downloadPDF('${book.path}', '${book.filename}')">
          <ion-icon name="download-outline"></ion-icon>
          Download
        </button>
      </div>
    </td>
  `;
  
  tableBody.appendChild(newRow);
}

// Enhanced notification function with auto-dismiss for info messages
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const iconName = type === 'success' ? 'checkmark-circle-outline' : 
                   type === 'error' ? 'alert-circle-outline' : 
                   'information-circle-outline';
  
  notification.innerHTML = `
    <div class="notification-content">
      <ion-icon name="${iconName}"></ion-icon>
      <span>${message}</span>
    </div>
  `;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : 
                 type === 'error' ? '#dc3545' : '#007bff'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 350px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto-dismiss timing based on type
  const dismissTime = type === 'info' ? 2000 : type === 'success' ? 3000 : 5000;
  
  // Remove after specified time
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, dismissTime);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('addBookModal');
  if (modal && event.target === modal) {
    closeAddBookModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeAddBookModal();
  }
});

// Add event listeners to existing buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to view and download buttons
  const viewButtons = document.querySelectorAll('.view-btn');
  const downloadButtons = document.querySelectorAll('.download-btn');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const pdfPath = './assets/pdfs/TU_book.pdf';
      viewPDF(pdfPath);
    });
  });
  
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const pdfPath = './assets/pdfs/TU_book.pdf';
      const filename = 'The_Power_of_Now.pdf';
      downloadPDF(pdfPath, filename);
    });
  });
});

