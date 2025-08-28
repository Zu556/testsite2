// ==============================
// Navbar Toggle
// ==============================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// ==============================
// Filters Toggle (only exists on activities.html)
// ==============================
const desktopToggle = document.querySelector('.desktop-filters .filters-toggle');
const desktopFilters = document.querySelector('.desktop-filters .filters');

if (desktopToggle && desktopFilters) {
  desktopToggle.addEventListener('click', () => {
    desktopFilters.classList.toggle('collapsed'); // Desktop collapse
  });
}

const mobileToggle = document.querySelector('.mobile-filters .filters-toggle');
const mobileFilters = document.querySelector('.mobile-filters .filters');

if (mobileToggle && mobileFilters) {
  mobileToggle.addEventListener('click', () => {
    mobileFilters.classList.toggle('show'); // Mobile panel toggle
  });
}
