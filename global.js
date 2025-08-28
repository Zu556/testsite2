// Navbar toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Desktop filters toggle
const desktopToggle = document.querySelector('.desktop-filters .filters-toggle');
const desktopFilters = document.querySelector('.desktop-filters .filters');

if (desktopToggle && desktopFilters) {
  desktopToggle.addEventListener('click', () => {
    desktopFilters.classList.toggle('collapsed'); // collapse sidebar
  });
}

// Mobile filters toggle
const mobileToggle = document.querySelector('.mobile-filters .filters-toggle');
const mobileFilters = document.querySelector('.mobile-filters .filters');

if (mobileToggle && mobileFilters) {
  mobileToggle.addEventListener('click', () => {
    mobileFilters.classList.toggle('show'); // show mobile panel
  });
}
