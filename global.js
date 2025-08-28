// Navbar toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Desktop filters toggle
// Mobile Filters Hamburger Toggle
const filtersToggle = document.querySelector('.filters-toggle');
const filtersPanel = document.getElementById('filtersPanel');

filtersToggle.addEventListener('click', () => {
  filtersPanel.classList.toggle('show');
});
}
