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
}

