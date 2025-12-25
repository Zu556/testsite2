// Navbar toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Mobile Filters Hamburger Toggle
const filtersToggle = document.querySelector('.filters-toggle');
const filtersPanel = document.getElementById('filtersPanel');

if (filtersToggle && filtersPanel) {
  filtersToggle.addEventListener('click', () => {
    filtersPanel.classList.toggle('show');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInside = filtersPanel.contains(event.target) || filtersToggle.contains(event.target);
    if (!isClickInside && filtersPanel.classList.contains('show')) {
      filtersPanel.classList.remove('show');
    }
  });
}

// =============================
// GUIDE PAGE INTERACTIONS
// =============================

// Audience toggle buttons
const toggles = document.querySelectorAll('.toggle');
const boxes = document.querySelectorAll('.audience-box');

toggles.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    toggles.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    // Show corresponding box, hide others
    const target = btn.dataset.target;
    boxes.forEach(box => {
      box.classList.toggle('active', box.id === target);
    });
  });
});

// Accordion expand/collapse
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    // Toggle the clicked item
    item.classList.toggle('active');
  });
});

function openContact() {
  document.getElementById("contactModal").style.display = "flex";
}

function closeContact() {
  document.getElementById("contactModal").style.display = "none";
}

