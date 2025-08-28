// activities.js 

// ---- helpers ---------------------------------------------------------------

function toList(val) {
  if (Array.isArray(val)) val = val.join(",");
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
  try {
    const response = await fetch("activities.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Failed to load activities:", err);
    return [];
  }
}

// ---- UI build --------------------------------------------------------------

function createOptions(select, options) {
  select.innerHTML = "";
  options.forEach(val => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = val;
    select.appendChild(opt);
  });
}

function populateFilters(data) {
  // Prepend "All" to every filter
  const categories = ["All", ...uniqueFromCommaSeparated(data.map(i => i.Category))];
  const ageGroups  = ["All", ...uniqueFromCommaSeparated(data.map(i => i.AgeGroup))];
  const locations  = ["All", ...uniqueSorted(data.map(i => i.Location))];
  const languages  = ["All", ...uniqueSorted(data.map(i => i.Language))];

  createOptions(document.getElementById("categoryFilter"), categories);
  createOptions(document.getElementById("ageGroupFilter"),  ageGroups);
  createOptions(document.getElementById("locationFilter"),  locations);
  createOptions(document.getElementById("languageFilter"),  languages);
}

// Keep Choices instances so we don't initialize twice
const choicesInstances = {};

function enhanceSelectsWithChoices() {
  ["categoryFilter","ageGroupFilter","locationFilter","languageFilter"].forEach(id => {
    const el = document.getElementById(id);
    if (!el || choicesInstances[id]) return;
    choicesInstances[id] = new Choices(el, {
      removeItemButton: true,
      searchEnabled: true,
      shouldSort: false,
      placeholder: true,
      placeholderValue: `Select ${id.replace("Filter", "").toLowerCase()}`
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

    const shortDesc = (item.Description || "").slice(0, 120) +
      ((item.Description || "").length > 120 ? "..." : "");

    let tags = [];
    if (item.AgeGroup) {
      const ag = Array.isArray(item.AgeGroup) ? item.AgeGroup.join(", ") : item.AgeGroup.toString();
      if (ag.toLowerCase() !== "all") tags.push(ag);
    }
    if (item.Location) tags.push(item.Location);
    if (item.Language) tags.push(item.Language);

    const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join("");

    const deadlineHtml = item.Deadline
      ? `<p class="deadline"><strong>Deadline:</strong> ${item.Deadline}</p>`
      : "";

    const cardLinksHtml = ["Link1","Link2","Link3","Link4","Link5"]
      .map(k => item[k])
      .filter(Boolean)
      .map(link => `<a href="${link}" target="_blank">${link}</a>`)
      .join(", ") || "N/A";

    const extraInfo = `
      <div class="extra-info" style="display:none; margin-top:1rem; font-size:0.9rem; line-height:1.4; color:#444;">
        <p><strong>Full Description:</strong> ${item.Description || "N/A"}</p>
        <p><strong>How to Apply:</strong> ${item.HowToApply || "N/A"}</p>
        <p><strong>Links:</strong> ${cardLinksHtml}</p>
      </div>
    `;

    card.innerHTML = `
      <h3 class="title">${item.Title || "Untitled"}</h3>
      <p class="desc">${shortDesc}</p>
      ${deadlineHtml}
      <div class="tags">${tagsHtml}</div>
      <a href="#" class="learn-more">Learn More →</a>
      ${extraInfo}
    `;

    const learnMoreLink = card.querySelector(".learn-more");
    learnMoreLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Populate modal with this card’s data
      document.getElementById("modalTitle").textContent = item.Title || "Untitled";
      document.getElementById("modalSubtitle").textContent = item.Category || "";
      document.getElementById("modalDesc").textContent = item.Description || "No description available.";
      document.getElementById("modalTags").innerHTML = tagsHtml;
      document.getElementById("modalLocation").textContent = item.Location ? `Location: ${item.Location}` : "";
      document.getElementById("modalLanguage").textContent = item.Language ? `Language: ${item.Language}` : "";

      const howToApply = item.HowToApply || item["How to Apply"];
      document.getElementById("modalHowToApply").textContent =
        howToApply ? `How to apply: ${howToApply}` : "N/A";

      const modalLinksHtml = ["Link1","Link2","Link3","Link4","Link5"]
        .map(k => item[k])
        .filter(Boolean)
        .map(link => /^https?:\/\//i.test(link) ? `<a href="${link}" target="_blank">${link}</a>` : link)
        .join(", ") || "N/A";
      document.getElementById("modalLinks").innerHTML = modalLinksHtml;

      document.getElementById("activityModal").style.display = "flex";
    });

    grid.appendChild(card);
  });
}

// ---- filtering -------------------------------------------------------------

function itemMatchesMultiSelect(selectedValues, fieldVal) {
  if (!selectedValues || selectedValues.length === 0) return true;

  if (!Array.isArray(selectedValues)) {
    selectedValues = [selectedValues];
  }

  // ✅ If "All" is chosen, always match
  if (selectedValues.includes("All")) return true;

  const tokens = toList(fieldVal).map(t => t.toLowerCase());
  return selectedValues.some(val => tokens.includes((val || "").toLowerCase()));
}

function applyFilters(data) {
  const category = choicesInstances["categoryFilter"].getValue(true);
  const ageGroup = choicesInstances["ageGroupFilter"].getValue(true);
  const location = choicesInstances["locationFilter"].getValue(true);
  const language = choicesInstances["languageFilter"].getValue(true);
  const search   = document.getElementById("searchInput").value.toLowerCase().trim();

  const searchWords = search ? search.split(/\s+/).filter(Boolean) : [];

  const filtered = data.filter(item => {
    const matchCategory = itemMatchesMultiSelect(category, item.Category);
    const matchAge      = itemMatchesMultiSelect(ageGroup, item.AgeGroup);
    const matchLocation = itemMatchesMultiSelect(location, item.Location);
    const matchLanguage = itemMatchesMultiSelect(language, item.Language);

    const searchableText = [
      item.Title || "",
      item.Description || "",
      item.Category || "",
      item.Location || "",
      item.Language || ""
    ].join(" ").toLowerCase();

    const matchSearch = searchWords.every(word => searchableText.includes(word));

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

  // 4) Wire Choices change events so filtering happens immediately
  Object.entries(choicesInstances).forEach(([id, instance]) => {
    instance.passedElement.element.addEventListener("change", () => applyFilters(data));
  });

  // 5) Wire search input (live typing)
  document.getElementById("searchInput").addEventListener("input", () => applyFilters(data));

  // 6) If you have a search button, wire it up too (optional now)
  const searchButton = document.getElementById("searchBtn");
  if (searchButton) {
    searchButton.addEventListener("click", () => applyFilters(data));
  }

  // 7) Clear filters button
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    Object.values(choicesInstances).forEach(instance => {
      instance.removeActiveItems();
      instance.setChoiceByValue(""); // reset to placeholder
    });
    applyFilters(data); // reset results
  });

  // 8) Close activity modal when clicking outside
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("activityModal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
