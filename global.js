// Navbar toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Desktop filters toggle
const filtersToggle = document.querySelector('.filters-toggle');
const filters = document.querySelector('.filters');

if (filtersToggle && filters) {
  filtersToggle.addEventListener('click', () => {
    if (window.innerWidth > 768) {
      // Desktop: collapse sidebar
      filters.classList.toggle('collapsed');
    } else {
      // Mobile: show popup
      filters.classList.toggle('show');
    }
  });
}
