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
const filtersToggle = document.querySelector('.filters-toggle');
const filtersWrapper = document.querySelector('.filters');

if (filtersToggle && filtersWrapper) {
  filtersToggle.addEventListener('click', () => {
    if (window.innerWidth > 768) {
      // Desktop: toggle collapsed class
      filtersWrapper.classList.toggle('collapsed');
    } else {
      // Mobile: toggle show class
      filtersWrapper.classList.toggle('show');
    }
  });
}
