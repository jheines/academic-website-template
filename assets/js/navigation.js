const main = document.querySelector("main.main");
// removed by Claude, 2026-11-17 14:35 -- Tasks/Tasks_2026-11-17.md Pass #4:
// #footer is now nested inside <main> (see index.html), so it shifts
// along with main's own margin-left automatically and no longer needs
// its own margin-left applied here.
// const footer = document.getElementById("footer");

function setupNavToggle() {
  const navigation = document.getElementById("navigation");
  const navigationToggleBtn = document.querySelector(".navigation-toggle");

  if (!navigation || !navigationToggleBtn) return;

  navigationToggleBtn.addEventListener("click", function () {
    togglenavigation();

    if (navigation.classList.contains("navigation-show")) {
      navigationToggleBtn.classList.remove("bi-list");
      navigationToggleBtn.classList.add("bi-x");
    } else {
      navigationToggleBtn.classList.add("bi-list");
      navigationToggleBtn.classList.remove("bi-x");
    }
  });

  handleResponsiveNavigation();

  window.addEventListener("resize", handleResponsiveNavigation);
}

function handleResponsiveNavigation() {
  const navigation = document.getElementById("navigation");
  if (!navigation) return;

  if (window.innerWidth >= 800) {
    navigation.classList.add("navigation-show");
    navigation.style.left = "0";
    if (main) main.style.marginLeft = "200px"; // updated by Claude, 2026-11-17 15:10, Pass #5: 300px -> 200px
  } else {
    navigation.classList.remove("navigation-show");
    navigation.style.left = "-200px"; // updated by Claude, 2026-11-17 15:10, Pass #5: 300px -> 200px
    if (main) main.style.marginLeft = "0px";
  }
}

// added by Claude, 2026-11-14 15:10 -- Tasks_2026-11-14.md Pass #2: reveal
// the "Links" nav item only when running on localhost. Fails safe: the
// item is display:none by default in navigation.css (.nav-dev-only),
// and this function only ever shows it, never hides it, so a slow/failed
// script run just leaves it hidden instead of accidentally exposing it.
// -- fixed by Claude, 2026-11-14 15:30, Pass #3: el.style.display = ""
// only clears an INLINE style; it doesn't override the .nav-dev-only
// CLASS rule (display: none), which was still in effect since the class
// itself was never removed -- so the item stayed hidden even though this
// function ran correctly. Removing the class instead actually un-hides it.
// -- updated by Claude, 2026-11-17 11:37, Pass #1: renamed from
// showLocalhostOnlyNavItems() and the nav-localhost-only class renamed to
// nav-dev-only, since the item should now ALSO show when the URL's
// search string contains "jesse" (e.g. ?jesse), not just on localhost.
function showDevOnlyNavItems() {
  const host = window.location.hostname;
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  // split into its own const by Claude, 2026-11-26 09:05 -- Tasks/Tasks_2026-11-26.md
  // Pass #1, at JMH's request: this covers viewing the site from one home
  // system while it's served from another home system on the same LAN
  // (e.g. testing on an iPhone over home wireless) -- added by JMH, 2026-11-26 08:16
  const isLANhost = host.startsWith("10.0.0");
  const hasJesseParam = window.location.search.includes("jesse");
  if (isLocalhost || isLANhost || hasJesseParam) {
    document.querySelectorAll(".nav-dev-only").forEach((el) => {
      el.classList.remove("nav-dev-only");
    });
  }
}

// added by Claude, 2026-11-14 16:08 -- Tasks_2026-11-14.md Pass #4: on
// localhost, point the Photographs link at the local site's own
// /pictures path instead of the production jesseheines.com one. Fails
// safe the same way as showDevOnlyNavItems(): the href baked into
// navigation.html is already the correct production URL, and this
// function only ever REWRITES it for the localhost case, so a slow/failed
// script run just leaves the production link in place everywhere else.
// -- updated by Claude, 2026-11-26 09:05 -- Tasks/Tasks_2026-11-26.md Pass #1:
// JMH asked that any system OTHER than GitHub Pages (jheines.github.io) or
// production (jesseheines.com) point Photographs at /Pictures/Version2022
// instead -- not just localhost, but any other home/LAN system too. Still
// fails safe the same way: the two production hosts are the only ones left
// untouched, and the baked-in href is already correct for them.
function setPhotographsLinkHref() {
  const host = window.location.hostname;
  const isProductionHost = host === "jheines.github.io" || host === "jesseheines.com";
  if (!isProductionHost) {
    const link = document.getElementById("nav-photographs-link");
    if (link) link.href = `${window.location.protocol}//${window.location.host}/Pictures/Version2022`;
  }
}

function togglenavigation() {
  const navigation = document.getElementById("navigation");
  if (!navigation) return;

  const isShown = navigation.classList.contains("navigation-show");

  if (isShown) {
    navigation.classList.remove("navigation-show");
    navigation.style.left = "-200px"; // updated by Claude, 2026-11-17 15:10, Pass #5: 300px -> 200px
    if (main)  main.style.marginLeft  = "0";
  } else {
    navigation.classList.add("navigation-show");
    navigation.style.left = "0";
    if (main)  main.style.marginLeft  = "200px"; // updated by Claude, 2026-11-17 15:10, Pass #5: 300px -> 200px
  }
}


// Load navigation.html into the #navigation-include div
// and initialize toggle after it's loaded

document.addEventListener("DOMContentLoaded", function () {
  const navInclude = document.getElementById("navigation-include");
  if (navInclude) {
    fetch("navigation.html")
      .then((response) => response.text())
      .then((html) => {
        navInclude.innerHTML = html;
        if (typeof applyConfig === "function") {
          applyConfig();
        } else if (typeof applySiteConfig === "function") {
          applySiteConfig();
        }
        setupNavToggle();
        showDevOnlyNavItems(); // added by Claude, 2026-11-14 15:10, renamed 2026-11-17
        setPhotographsLinkHref(); // added by Claude, 2026-11-14 16:08
        document.dispatchEvent(new Event("navigationLoaded"));
      });
  }
  const footerInclude = document.getElementById("footer-include");
  if (footerInclude) {
    fetch("footer.html")
      .then((response) => response.text())
      .then((html) => {
        footerInclude.innerHTML = html;
        if (typeof applyConfig === "function") {
          applyConfig();
        } else if (typeof applySiteConfig === "function") {
          applySiteConfig();
        }
        // Remove preloader after footer is injected (if present)
        const preloader = document.getElementById("preloader");
        if (preloader) preloader.remove();
        document.dispatchEvent(new Event("footerLoaded"));
      });
  }

  // Scroll-to-top button logic (use .active class for visibility)
  let scrollBtn = document.getElementById("scroll-top");
  if (!scrollBtn) {
    scrollBtn = document.createElement("a");
    scrollBtn.href = "#";
    scrollBtn.id = "scroll-top";
    scrollBtn.className =
      "scroll-top d-flex align-items-center justify-content-center";
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
    document.body.appendChild(scrollBtn);
  }

  // Show/hide button using .active class
  function toggleScrollTop() {
    if (window.scrollY > 100) {
      scrollBtn.classList.add("active");
    } else {
      scrollBtn.classList.remove("active");
    }
  }
  window.addEventListener("scroll", toggleScrollTop);
  window.addEventListener("load", toggleScrollTop);

  // Scroll to top on click
  scrollBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Scrollspy for nav links
(function () {
  function navmenuScrollspy() {
    const navmenulinks = document.querySelectorAll(".navmenu a");
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();
