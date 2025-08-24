// activities.js

// ---- helpers ---------------------------------------------------------------

function toList(val) {
  // Turn Category / AgeGroup into an array of trimmed tokens
  if (Array.isArray(val)) val = val.join(",");           // some items have ["IG1, IG2, IB1, IB2"]
  if (typeof val !== "string") return [];
  return val.split(",").map(s => s.trim()).filter(Boolean);
}

function uniqueSorted(values) {
  const set = new Set(values.map(v => (v || "").toString().trim()).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b));
}

function uniqueFromCommaSeparated(values) {
  const out = new Set();
  values.forEach(v => toList(v).forEach(token => out.add(token)));
  return [...out].sort((a, b) => a.localeCompare(b));
}

// ---- data ------------------------------------------------------------------

async function loadData() {
  const response = await fetch("activities.json", { cache: "no-store" });
  return await response.json();
}

// ---- UI build --------------------------------------------------------------

function createOptions(select, options, placeholderText) {
  // wipe existing
  select.innerHTML = "";
  // default "all" option
  const def = document.createElement("option");
  def.value = "";
  def.textContent = placeholderText;
  select.appendChild(def);

  options.forEach(val => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = val;
    select.appendChild(opt);
  });
}

function populateFilters(data) {
  const categories = uniqueFromCommaSeparated(data.map(i => i.Category));
  const ageGroups  = uniqueFromCommaSeparated(data.map(i => i.AgeGroup));
  const locations  = uniqueSorted(data.map(i => i.Location));
  const languages  = uniqueSorted(data.map(i => i.Language));

  createOptions(document.getElementById("categoryFilter"), categories, "All categories");
  createOptions(document.getElementById("ageGroupFilter"),  ageGroups,  "All age groups");
  createOptions(document.getElementById("locationFilter"),  locations,  "All locations");
  createOptions(document.getElementById("languageFilter"),  languages,  "All languages");
}

// Keep Choices instances so we don't initialize twice
const choicesInstances = {};

function enhanceSelectsWithChoices() {
  ["categoryFilter","ageGroupFilter","locationFilter","languageFilter"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (choicesInstances[id]) return; // already enhanced
    choicesInstances[id] = new Choices(el, {
      removeItemButton: false,
      searchEnabled: false,
      shouldSort: false,
      placeholder: true,
      placeholderValue: el.options[0]?.textContent || "Select"
    });
  });
}

// ---- render cards ----------------------------------------------------------

function renderActivities(data) {
  const grid = document.getElementById("activityGrid");
  grid.innerHTML = "";

  if (!data || data.length === 0) {
    grid.innerHTML = "<p>No activities match your filters.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "activity-card";

    // Short description
    const shortDesc = (item.Description || "").slice(0, 120) +
      ((item.Description || "").length > 120 ? "..." : "");

    // Tags: AgeGroup + Location + Language
    let tagsHtml = "";
    if (item.AgeGroup) tagsHtml += `<span class="tag">${item.AgeGroup}</span>`;
    if (item.Location) tagsHtml += `<span class="tag">${item.Location}</span>`;
    if (item.Language) tagsHtml += `<span class="tag">${item.Language}</span>`;

    // Hidden extra info
    const extraInfo = `
      <div class="extra-info" style="display:none; margin-top:1rem; font-size:0.9rem; line-height:1.4; color:#444;">
        <p><strong>Full Description:</strong> ${item.Description || "N/A"}</p>
        <p><strong>How to Apply:</strong> ${item.HowToApply || "N/A"}</p>
        <p><strong>Links:</strong> ${
          ["Link1","Link2","Link3","Link4","Link5"]
            .map(k => item[k])
            .filter(Boolean)
            .map(link => `<a href="${link}" target="_blank">${link}</a>`)
            .join(", ") || "N/A"
        }</p>
      </div>
    `;

    card.innerHTML = `
      <h3 class="title">${item.Title || "Untitled"}</h3>
      <p class="desc">${shortDesc}</p>
      <div class="tags">${tagsHtml}</div>
      <a href="#" class="learn-more">Learn More →</a>
      ${extraInfo}
    `;

    // Expand/collapse toggle
    const learnMoreLink = card.querySelector(".learn-more");
    const extraInfoDiv = card.querySelector(".extra-info");

    learnMoreLink.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = extraInfoDiv.style.display === "block";
      extraInfoDiv.style.display = isVisible ? "none" : "block";
      learnMoreLink.textContent = isVisible ? "Show Less ↑" : "Learn More →";
    });

    grid.appendChild(card);
  });
}


// ---- filtering -------------------------------------------------------------

function itemContainsToken(selected, fieldVal) {
  if (!selected) return true; // no filter
  const tokens = toList(fieldVal);
  // treat "All" as matching any age group
  if (typeof fieldVal === "string" && fieldVal.trim().toLowerCase() === "all") return true;
  return tokens.includes(selected);
}

function applyFilters(data) {
  const category = document.getElementById("categoryFilter").value;
  const ageGroup = document.getElementById("ageGroupFilter").value;
  const location = document.getElementById("locationFilter").value;
  const language = document.getElementById("languageFilter").value;
  const search   = document.getElementById("searchInput").value.toLowerCase().trim();

  const filtered = data.filter(item => {
    const matchCategory = itemContainsToken(category, item.Category);
    const matchAge      = itemContainsToken(ageGroup, item.AgeGroup);
    const matchLocation = !location || (item.Location || "").includes(location);
    const matchLanguage = !language || (item.Language || "").includes(language);
    const matchSearch   =
      !search ||
      (item.Title || "").toLowerCase().includes(search) ||
      (item.Description || "").toLowerCase().includes(search) ||
      (item.Category || "").toLowerCase().includes(search);

    return matchCategory && matchAge && matchLocation && matchLanguage && matchSearch;
  });

  renderActivities(filtered);
}

// ---- boot ------------------------------------------------------------------

async function init() {
  const data = await loadData();

  // 1) Fill selects
  populateFilters(data);

  // 2) Enhance selects with Choices AFTER options exist
  enhanceSelectsWithChoices();

  // 3) Render all cards initially
  renderActivities(data);

  // 4) Wire change events for filters
  ["categoryFilter","ageGroupFilter","locationFilter","languageFilter"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => applyFilters(data));
  });
  document.getElementById("searchInput").addEventListener("input", () => applyFilters(data));

  // 5) Clear filters button
  document.getElementById("clearFilters").addEventListener("click", () => {
    // Reset search input
    document.getElementById("searchInput").value = "";

    // Reset all dropdowns using Choices API
    Object.values(choicesInstances).forEach(instance => {
      instance.removeActiveItems();      // clears selected values
      instance.setChoiceByValue("");     // reset to placeholder
    });

    // Re-render all activities
    renderActivities(data);
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);

