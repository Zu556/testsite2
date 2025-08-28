// Navbar toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Filters toggle (same button works for desktop and mobile)
const filtersToggle = document.querySelector('.filters-toggle');
const filters = document.querySelector('.filters');

if (filtersToggle && filters) {
  filtersToggle.addEventListener('click', () => {
    if (window.innerWidth > 768) {
      // Desktop: collapse sidebar
      filters.classList.toggle('collapsed');
    } else {
      // Mobile: show hamburger-style panel
      filters.classList.toggle('show');
    }
  });
}
