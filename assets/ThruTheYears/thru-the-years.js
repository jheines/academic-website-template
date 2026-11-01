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
  // added by Claude, 2026-11-01 09:15 -- Round 3: half of the photo's
  // cross-fade (fade-out, then swap+fade-in), so the full fade cycle is
  // about half a second, matching thru-the-years.css's .tty-photo
  // transition duration.
  var FADE_MS = 250;
  var HOVER_NOTE_NORMAL = "Hover over a picture to pause auto-advancing.";
  var HOVER_NOTE_PAUSED = "Move the mouse off the picture to resume auto-advancing.";

  var photos = [];   // [{ file, title, age, date }, ...]
  var index = 0;
  var timerId = null;
  var paused = false;
  var container = null;

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
          return { file: file, title: entry.title, age: entry.age, date: entry.date };
        });

      if (!photos.length) return;

      buildDom();
      render();
      startTimer();
    } catch (err) {
      console.error("Thru the Years: could not load caption list", err);
    }
  }

  function buildDom() {
    container.innerHTML =
      '<div class="tty-frame">' +
        '<img class="tty-photo" alt="">' +
        '<div class="tty-counter" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="tty-caption-row">' +
        '<button type="button" class="tty-arrow-btn tty-arrow-left" aria-label="Previous picture">' +
          '<img class="tty-arrow-img" alt="">' +
        "</button>" +
        '<div class="tty-caption">' +
          '<div class="tty-title"></div>' +
          '<div class="tty-age-date">' +
            '<span class="tty-age"></span>&nbsp;&nbsp;<span class="tty-date"></span>' +
          "</div>" +
          '<div class="tty-hover-note">' + HOVER_NOTE_NORMAL + "</div>" +
        "</div>" +
        '<button type="button" class="tty-arrow-btn tty-arrow-right" aria-label="Next picture">' +
          '<img class="tty-arrow-img" alt="">' +
        "</button>" +
      "</div>";

    var frame = container.querySelector(".tty-frame");
    var leftArrowImg = container.querySelector(".tty-arrow-left .tty-arrow-img");
    var rightArrowImg = container.querySelector(".tty-arrow-right .tty-arrow-img");

    leftArrowImg.src = ARROWS.left;
    rightArrowImg.src = ARROWS.right;

    container.querySelector(".tty-arrow-left").addEventListener("click", function () {
      goTo(index - 1);
      resetTimer();
    });
    container.querySelector(".tty-arrow-right").addEventListener("click", function () {
      goTo(index + 1);
      resetTimer();
    });

    // "When the user hovers over any picture" -- scoped to the frame
    // (the photo + its counter overlay), not the caption row below it.
    frame.addEventListener("mouseenter", function () { setPaused(true); });
    frame.addEventListener("mouseleave", function () { setPaused(false); });
  }

  function setPaused(isPaused) {
    paused = isPaused;

    var leftArrowImg = container.querySelector(".tty-arrow-left .tty-arrow-img");
    var rightArrowImg = container.querySelector(".tty-arrow-right .tty-arrow-img");
    var note = container.querySelector(".tty-hover-note");

    leftArrowImg.src = isPaused ? ARROWS.leftPaused : ARROWS.left;
    rightArrowImg.src = isPaused ? ARROWS.rightPaused : ARROWS.right;

    note.textContent = isPaused ? HOVER_NOTE_PAUSED : HOVER_NOTE_NORMAL;
    note.classList.toggle("tty-paused", isPaused);
  }

  function goTo(newIndex) {
    // Wrap around in both directions.
    index = ((newIndex % photos.length) + photos.length) % photos.length;
    render();
  }

  // added by Claude, 2026-11-01 09:15 -- Round 3: cross-fade between
  // pictures instead of an abrupt swap. Fades the current photo out,
  // swaps its src/caption while invisible, then fades the new one in --
  // the actual opacity transition is CSS (see .tty-photo /
  // .tty-photo.tty-fading in thru-the-years.css); this just times the
  // swap to happen at the mid-point, so the whole cycle is ~2 * FADE_MS.
  function render() {
    var photo = photos[index];
    var img = container.querySelector(".tty-photo");

    img.classList.add("tty-fading");
    setTimeout(function () {
      img.src = IMAGE_BASE_URL + photo.file;
      img.alt = photo.title ? stripHtml(photo.title) : "";

      // title supports simple inline HTML (e.g. <em>, <span class="nobold">,
      // named/numeric entities) -- see the family-photo entry in
      // ThruTheYears-CaptionList.json -- so it's set via innerHTML, same
      // pattern already used for about.json's tagline and citations.
      container.querySelector(".tty-title").innerHTML = photo.title || "";
      container.querySelector(".tty-age").textContent = photo.age || "";
      container.querySelector(".tty-date").textContent = photo.date ? "(" + photo.date + ")" : "";
      container.querySelector(".tty-counter").textContent = (index + 1) + " of " + photos.length;

      img.classList.remove("tty-fading");
    }, FADE_MS);
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
