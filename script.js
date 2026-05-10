const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const revealEls = document.querySelectorAll(".reveal");
const parallaxEls = document.querySelectorAll("[data-parallax]");
const contactForm = document.getElementById("contactForm");

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "◐" : "◑";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#070816" : "#f5f7ff");
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(current);
});

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("is-hidden");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealEls.forEach((el) => {
  el.classList.add("is-hidden");
  observer.observe(el);
});

let ticking = false;
function updateParallax() {
  const y = window.scrollY || window.pageYOffset;
  parallaxEls.forEach((el) => {
    const speed = Number(el.getAttribute("data-parallax")) || 0;
    el.style.transform = `translate3d(0, ${y * speed * -0.08}px, 0)`;
  });
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent! NovaBloom is ready.");
  contactForm.reset();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}