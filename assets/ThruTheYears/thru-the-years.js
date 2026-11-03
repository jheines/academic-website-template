/** File: assets/ThruTheYears/thru-the-years.js
 *  written by Claude Code, at Jesse M. Heines's request
 *  maintained by Jesse M. Heines, jesse@jesseheines.com using Claude Code
 *  Copyright (c) 2026 by Jesse M. Heines.  All rights reserved.  May be
 *    freely copied or excerpted for educational purposes with credit to
 *    the author and maintainer.
 *  created on October 31, 2026
 *
 *  Implements the "Through the Years" auto-advancing photo carousel
 *  described in assets/ThruTheYears/CLAUDE.md:
 *   - Loads assets/ThruTheYears/ThruTheYears-CaptionList.json and advances
 *     to the next picture every 3 seconds.
 *   - Renders a framed photo (with a "n of total" counter overlay) and a
 *     caption (title / age + date / hover instructions) flanked by
 *     previous/next arrow buttons, into the #thru-the-years placeholder
 *     element in index.html's hero section.
 *   - Hovering the photo pauses auto-advance and swaps the arrows and
 *     hover-instruction text to their "paused" (red) state; moving the
 *     mouse off the photo resumes.
 *
 *  Wrapped in an IIFE so it doesn't add any names to the global scope
 *  shared with the template's other scripts.
 */
(function () {
  "use strict";

  // Where the pictures and arrow icons actually live (per CLAUDE.md, these
  // are hosted on jesseheines.com, not in this repo).
  var IMAGE_BASE_URL = "https://jesseheines.com/~heines/images/Jesse/";
  // Round 2 (2026-11-01): light green instead of light blue for the normal
  // (not paused) arrows.
  // Round 3 (2026-11-01 09:15, added by Claude): yellow instead of red for
  // the paused arrows.
  var ARROWS = {
    left: "https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-LightGreen_transparent.png",
    leftPaused: "https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Left-Yellow_transparent.png",
    right: "https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-LightGreen_transparent.png",
    rightPaused: "https://jesseheines.com/~heines/images/arrows/LucidaArrows193-Right-Yellow_transparent.png"
  };
  var CAPTION_LIST_URL = "assets/ThruTheYears/ThruTheYears-CaptionList.json";
  var ADVANCE_MS = 3000;
  // removed by Claude, 2026-11-03 10:30 -- Round 4: no longer needed now
  // that both photo layers fade via CSS at the same time (true
  // crossfade) instead of this script timing a sequential fade-out,
  // then swap, then fade-in.
  // var FADE_MS = 250;
  // added by Claude, 2026-11-03 10:30 -- Round 4: X-Small (phone) wording
  // for the hover-note, since there's no mouse to hover with there.
  // Matches the "X-Small" breakpoint used in assets/css/index.css's
  // Round 4 hero-spacing override.
  var X_SMALL_QUERY = "(max-width: 576px)";
  var HOVER_NOTE_NORMAL_DESKTOP = "Hover over a picture to pause auto-advancing.";
  var HOVER_NOTE_PAUSED_DESKTOP = "Move the mouse off the picture to resume auto-advancing.";
  var HOVER_NOTE_NORMAL_MOBILE = "Tap a picture to pause auto-advancing.";
  var HOVER_NOTE_PAUSED_MOBILE = "Tap the picture to resume auto-advancing.";

  var photos = [];     // [{ file, title, age, date, menu }, ...]
  // added by Claude, 2026-11-03 10:30 -- Round 4: [{ label, index }, ...],
  // built from photos' optional "menu" field, for the Age Links menu.
  var menuItems = [];
  var index = 0;
  // added by Claude, 2026-11-03 10:30 -- Round 4: which of the two
  // stacked .tty-photo <img> layers (see thru-the-years.css) is
  // currently the visible one.
  var activeLayer = 0;
  var timerId = null;
  var paused = false;
  var container = null;

  // added by Claude, 2026-11-03 10:30 -- Round 4
  function isXSmall() {
    return window.matchMedia(X_SMALL_QUERY).matches;
  }
  function hoverNoteNormal() {
    return isXSmall() ? HOVER_NOTE_NORMAL_MOBILE : HOVER_NOTE_NORMAL_DESKTOP;
  }
  function hoverNotePaused() {
    return isXSmall() ? HOVER_NOTE_PAUSED_MOBILE : HOVER_NOTE_PAUSED_DESKTOP;
  }

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    container = document.getElementById("thru-the-years");
    if (!container) return; // this page has no carousel placeholder

    try {
      var res = await fetch(CAPTION_LIST_URL, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load " + CAPTION_LIST_URL + " (" + res.status + ")");
      }
      var data = await res.json();

      // Per CLAUDE.md: every key except "comment" is a picture file name.
      // Round 2 (2026-11-01): an entry with "omit": true is excluded --
      // that's Jesse's way of "commenting out" a picture in JSON, which
      // has no comment syntax of its own.
      photos = Object.keys(data)
        .filter(function (key) { return key !== "comment"; })
        .filter(function (key) { return !data[key] || data[key].omit !== true; })
        .map(function (file) {
          var entry = data[file] || {};
          // added by Claude, 2026-11-03 10:30 -- Round 4: carry the
          // optional "menu" field through so the Age Links menu below
          // can look up each entry's position in the final (post-omit)
          // photos array.
          return { file: file, title: entry.title, age: entry.age, date: entry.date, menu: entry.menu };
        });

      if (!photos.length) return;

      // added by Claude, 2026-11-03 10:30 -- Round 4: Age Links menu
      // entries, in the same order as photos (already chronological).
      menuItems = photos
        .map(function (photo, i) { return { label: photo.menu, index: i }; })
        .filter(function (item) { return typeof item.label === "number"; });

      buildDom();
      render();
      startTimer();
    } catch (err) {
      console.error("Thru the Years: could not load caption list", err);
    }
  }

  function buildDom() {
    // added by Claude, 2026-11-03 10:30 -- Round 4: "Age Links" numbers,
    // same color as the hover-note text, spaced evenly across their own
    // bar below the caption. Omitted entirely when there are none.
    // updated by Claude, 2026-11-03 11:15 -- Round 5: label and numbers
    // are now flat siblings (no .tty-menu-items wrapper) so a single
    // justify-content: space-between in thru-the-years.css spaces all
    // of them, including the label-to-"1" gap, evenly.
    var menuHtml = "";
    if (menuItems.length) {
      menuHtml =
        '<div class="tty-menu">' +
          '<span class="tty-menu-label">Age Links:</span>' +
          menuItems.map(function (item) {
            return '<button type="button" class="tty-menu-item" data-index="' +
              item.index + '">' + item.label + "</button>";
          }).join("") +
        "</div>";
    }

    container.innerHTML =
      '<div class="tty-frame">' +
        // added by Claude, 2026-11-03 10:30 -- Round 4: two stacked
        // <img> layers (see .tty-photo / .tty-photo.tty-active in
        // thru-the-years.css) so the next picture can fade in while the
        // current one fades out at the same time -- a true crossfade.
        '<img class="tty-photo" alt="">' +
        '<img class="tty-photo" alt="">' +
        '<div class="tty-counter" aria-hidden="true"></div>' +
      "</div>" +
      // moved by Claude, 2026-11-03 10:30 -- Round 4: .tty-title is now
      // a sibling of .tty-caption-row, not nested inside .tty-caption,
      // so it can be as wide as the whole row (arrows included) instead
      // of just the narrower column between them.
      '<div class="tty-title"></div>' +
      '<div class="tty-caption-row">' +
        '<button type="button" class="tty-arrow-btn tty-arrow-left" aria-label="Previous picture">' +
          '<img class="tty-arrow-img" alt="">' +
        "</button>" +
        '<div class="tty-caption">' +
          '<div class="tty-age-date">' +
            '<span class="tty-age"></span>&nbsp;&nbsp;<span class="tty-date"></span>' +
          "</div>" +
          '<div class="tty-hover-note"></div>' +
        "</div>" +
        '<button type="button" class="tty-arrow-btn tty-arrow-right" aria-label="Next picture">' +
          '<img class="tty-arrow-img" alt="">' +
        "</button>" +
      "</div>" +
      menuHtml;

    var frame = container.querySelector(".tty-frame");
    var leftArrowImg = container.querySelector(".tty-arrow-left .tty-arrow-img");
    var rightArrowImg = container.querySelector(".tty-arrow-right .tty-arrow-img");

    leftArrowImg.src = ARROWS.left;
    rightArrowImg.src = ARROWS.right;
    // added by Claude, 2026-11-03 10:30 -- Round 4: show the correct
    // desktop/X-Small wording as soon as the DOM exists, instead of
    // waiting for the first hover/pause.
    container.querySelector(".tty-hover-note").textContent = hoverNoteNormal();

    container.querySelector(".tty-arrow-left").addEventListener("click", function () {
      goTo(index - 1);
      resetTimer();
    });
    container.querySelector(".tty-arrow-right").addEventListener("click", function () {
      goTo(index + 1);
      resetTimer();
    });

    // added by Claude, 2026-11-03 10:30 -- Round 4: clicking an Age
    // Links number jumps straight to that picture and keeps
    // auto-advancing normally from there, same as the arrow buttons.
    var menu = container.querySelector(".tty-menu");
    if (menu) {
      menu.addEventListener("click", function (e) {
        var btn = e.target.closest(".tty-menu-item");
        if (!btn) return;
        goTo(parseInt(btn.getAttribute("data-index"), 10));
        resetTimer();
      });
    }

    // "When the user hovers over any picture" -- scoped to the frame
    // (the photo + its counter overlay), not the caption row below it.
    frame.addEventListener("mouseenter", function () { setPaused(true); });
    frame.addEventListener("mouseleave", function () { setPaused(false); });

    // added by Claude, 2026-11-03 11:15 -- Round 5: on X-Small (phone)
    // devices there's no mouse to "leave", so a 1st tap fires the
    // mouseenter above (pausing), but nothing ever fires mouseleave --
    // tapping again did nothing. iOS also only sends this element a
    // real click starting on that 2nd tap (the 1st tap just simulates
    // hover), so toggling pause here on click, X-Small only, fixes
    // resume without double-toggling the 1st tap's mouseenter-driven
    // pause on desktop/tablet.
    frame.addEventListener("click", function () {
      if (isXSmall()) setPaused(!paused);
    });
  }

  function setPaused(isPaused) {
    paused = isPaused;

    var leftArrowImg = container.querySelector(".tty-arrow-left .tty-arrow-img");
    var rightArrowImg = container.querySelector(".tty-arrow-right .tty-arrow-img");
    var note = container.querySelector(".tty-hover-note");

    leftArrowImg.src = isPaused ? ARROWS.leftPaused : ARROWS.left;
    rightArrowImg.src = isPaused ? ARROWS.rightPaused : ARROWS.right;

    // updated by Claude, 2026-11-03 10:30 -- Round 4: wording now
    // depends on screen size (see hoverNoteNormal()/hoverNotePaused()
    // above).
    note.textContent = isPaused ? hoverNotePaused() : hoverNoteNormal();
    note.classList.toggle("tty-paused", isPaused);
  }

  function goTo(newIndex) {
    // Wrap around in both directions.
    index = ((newIndex % photos.length) + photos.length) % photos.length;
    render();
  }

  // updated by Claude, 2026-11-03 10:30 -- Round 4: true crossfade. The
  // next picture is loaded into whichever of the two stacked <img>
  // layers is currently hidden, then both layers' tty-active classes
  // flip at the same instant, so CSS fades the old one out and the new
  // one in at the same time (see .tty-photo / .tty-photo.tty-active in
  // thru-the-years.css) instead of Round 3's sequential fade-out,
  // swap-while-invisible, fade-in.
  function render() {
    var photo = photos[index];
    var imgs = container.querySelectorAll(".tty-photo");
    var outgoing = imgs[activeLayer];
    var incoming = imgs[1 - activeLayer];

    incoming.src = IMAGE_BASE_URL + photo.file;
    incoming.alt = photo.title ? stripHtml(photo.title) : "";

    incoming.classList.add("tty-active");
    outgoing.classList.remove("tty-active");
    activeLayer = 1 - activeLayer;

    // title supports simple inline HTML (e.g. <em>, <span class="nobold">,
    // named/numeric entities) -- see the family-photo entry in
    // ThruTheYears-CaptionList.json -- so it's set via innerHTML, same
    // pattern already used for about.json's tagline and citations.
    container.querySelector(".tty-title").innerHTML = photo.title || "";
    container.querySelector(".tty-age").textContent = photo.age || "";
    container.querySelector(".tty-date").textContent = photo.date ? "(" + photo.date + ")" : "";
    container.querySelector(".tty-counter").textContent = (index + 1) + " of " + photos.length;
  }

  function stripHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(function () {
      if (!paused) goTo(index + 1);
    }, ADVANCE_MS);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function resetTimer() {
    startTimer();
  }
})();
