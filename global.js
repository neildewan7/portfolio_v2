console.log("IT’S ALIVE!");
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear existing content
  containerElement.innerHTML = '';

  for (const project of projects) {
    // Create an <article> element
    const article = document.createElement('article');

    const image = project.image
      ? `<img src="${project.image}" alt="${project.title}">`
      : '';

    const tags = project.tags
      ? `<ul class="tag-list">${project.tags.map(t => `<li>${t}</li>`).join('')}</ul>`
      : '';

    const links = [];
    if (project.github) links.push(`<a href="${project.github}" target="_blank" rel="noopener">GitHub ↗</a>`);
    if (project.demo) links.push(`<a href="${project.demo}" target="_blank" rel="noopener">Live demo ↗</a>`);
    const linksHtml = links.length ? `<p class="project-links">${links.join(' · ')}</p>` : '';

    // Use a dynamic heading tag (e.g., h2, h3, etc.)
    article.innerHTML = `
  <${headingLevel}>${project.title} <span style="font-size: 0.8em; color: gray;">(${project.year})</span></${headingLevel}>
  ${image}
  <p>${project.description}</p>
  ${tags}
  ${linksHtml}
`;

    // Append the article to the container
    containerElement.appendChild(article);
  }
}


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}


const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio_v2/"; // CHANGE "portfolio" if your repo is named something else

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "experience/", title: "Experience" },
  { url: "resume/", title: "Resume" },
  { url: "jp-resume/", title: "日本語履歴書" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/neildewan7", title: "GitHub" }
  // "meta/" (Code Stats page) intentionally left out of nav -- leftover
  // course-assignment page, not relevant to a recruiter-facing nav. File
  // still exists if you want it back.
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
  
    // Adjust internal URLs based on BASE_PATH
    if (!url.startsWith("http")) {
      url = BASE_PATH + url;
    }
  
    // Create <a> element
    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
  
    // 🔹 Highlight current page
    a.classList.toggle(
      "current",
      a.host === location.host && a.pathname === location.pathname
    );
  
    // 🔹 Open external links (like GitHub) in a new tab
    a.toggleAttribute("target", a.host !== location.host);
    a.toggleAttribute("rel", a.host !== location.host);
  
    // Add to nav
    nav.append(a);
  }
  


nav.insertAdjacentHTML(
  "beforeend",
  `
  <div class="site-controls">
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    <label class="lang-switch">
        <select>
            <option value="en">EN</option>
            <option value="ja">日本語</option>
        </select>
    </label>
  </div>`,
);

// --- EN/JA toggle for elements marked with [data-en] / [data-ja] ---
// (currently only wired up on the homepage hero intro -- see index.html)
function setSiteLang(lang) {
  document.documentElement.classList.remove("lang-en", "lang-ja");
  document.documentElement.classList.add(`lang-${lang}`);
  localStorage.siteLang = lang;
}

const langSelect = document.querySelector(".lang-switch select");
const savedLang = localStorage.siteLang || "en";
setSiteLang(savedLang);
langSelect.value = savedLang;

langSelect.addEventListener("change", (event) => {
  setSiteLang(event.target.value);
});
let form = document.querySelector("#contact-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the default form behavior

  const data = new FormData(form);
  const email = "ndewan@ucsd.edu"; // your email address
  const params = [];

  for (let [name, value] of data) {
    const encoded = encodeURIComponent(value);
    params.push(`${name}=${encoded}`);
  }

  const query = params.join("&");
  const mailtoLink = `mailto:${email}?${query}`;

  location.href = mailtoLink;
});

let select = document.querySelector(".color-scheme select");

function setColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
}

// Load saved scheme on page load
if ("colorScheme" in localStorage) {
  const savedScheme = localStorage.colorScheme;
  setColorScheme(savedScheme);
  select.value = savedScheme;
}

// Save user selection on change
select.addEventListener("input", (event) => {
  const scheme = event.target.value;
  localStorage.colorScheme = scheme;
  setColorScheme(scheme);
});
