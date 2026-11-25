/* assets/js/publications.js */
/* added by Claude, 2026-11-23 11:29 -- Tasks/Tasks_2026-11-23.md Pass #2

   First real expand/collapse interactivity for publications.html's
   per-entry abstracts (previously inert -- see publications.css).

   Each entry is a <li> that is a direct child of a <ul
   class="ExpandableAbstracts">. Its caret icon is drawn by CSS as a
   ::before pseudo-element positioned at the <li>'s own top-left corner
   (its padding-left column); pseudo-elements aren't real DOM nodes, so
   there's no element to attach a click listener to directly. Instead,
   every click on the <li> is checked against that icon's on-screen box
   (using the <li>'s own padding-left/line-height as the box size) --
   only a click landing there toggles the "open" class, which
   publications.css uses to swap the caret icon and slide the entry's
   <blockquote> abstract open/closed. Clicks anywhere else in the entry
   (the title text, a real link, the abstract body once it's open) fall
   outside that box and are left alone -- links keep navigating normally,
   and nothing else is clickable, per Jesse's request.

   updated by Claude, 2026-11-23 12:10 -- Tasks/Tasks_2026-11-23.md Pass #3:
   added the Show All Abstracts / Hide All Abstracts (#ExpandAll /
   #CollapseAll) button handlers.

   updated by Claude, 2026-11-24 11:42 -- Tasks/Tasks_2026-11-24.md Pass #1:
   clicking an entry's .clickable-title (currently just one entry -- see
   publications.css) now also toggles it, same as clicking its caret.

   updated by Claude, 2026-11-25 13:21 -- Tasks/Tasks_2026-11-25.md Pass #2:
   switched from a fixed-large-value max-height (CSS) to a per-entry
   measured one (here) -- see setEntryOpen() and the removed CSS rule's
   comment in publications.css for why the fixed value broke the timing
   Jesse asked for in Pass #1 (looked instant on open, delayed on close,
   regardless of the transition duration). */

(function () {
  function isCaretClick(li, evt) {
    var style = window.getComputedStyle(li);
    var iconWidth = parseFloat(style.paddingLeft) || 0;
    var iconHeight = parseFloat(style.lineHeight);
    if (isNaN(iconHeight)) {
      iconHeight = parseFloat(style.fontSize) * 1.25;
    }
    var rect = li.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    return x >= 0 && x <= iconWidth && y >= 0 && y <= iconHeight;
  }

  // added by Claude, 2026-11-25 13:21 -- Tasks/Tasks_2026-11-25.md Pass #2:
  // sets max-height to each of the entry's own direct-child blockquotes'
  // real scrollHeight (not a guessed-large value) so the CSS transition
  // animates the entry's whole visible range, immediately, for the full
  // duration -- both directions. querySelectorAll, not querySelector: one
  // entry (Heines, Olsen & Bowker, 1984) has two direct-child <blockquote>s
  // on the same <li>, and each needs its own correct measured height.
  function setEntryOpen(li, open) {
    var blockquotes = li.querySelectorAll(':scope > blockquote');
    if (!blockquotes.length) return;
    blockquotes.forEach(function (blockquote) {
      blockquote.style.maxHeight = open ? blockquote.scrollHeight + 'px' : '0px';
    });
    li.classList.toggle('open', open);
  }

  document.querySelectorAll('#mainbody .ExpandableAbstracts > li').forEach(function (li) {
    li.addEventListener('click', function (evt) {
      // added by Claude, 2026-11-24 11:42 -- Tasks/Tasks_2026-11-24.md Pass #1:
      // one entry ("Row, Row, Row..." Progressive Example Series) has no link
      // of its own, so Jesse asked for its title text itself to also act as a
      // toggle, same as the caret icon.
      if (isCaretClick(li, evt) || evt.target.closest('.clickable-title')) {
        setEntryOpen(li, !li.classList.contains('open'));
      }
    });
  });

  // added by Claude, 2026-11-23 12:10 -- Tasks/Tasks_2026-11-23.md Pass #3:
  // wire up the "Show All Abstracts" / "Hide All Abstracts" links. Both are
  // <a href="#">, so without preventDefault() a click would also jump the
  // page to the top -- not wanted here, since the whole point is to look
  // through the abstracts in place.
  function setAllOpen(open) {
    document.querySelectorAll('#mainbody .ExpandableAbstracts > li').forEach(function (li) {
      setEntryOpen(li, open);
    });
  }

  var expandAll = document.getElementById('ExpandAll');
  if (expandAll) {
    expandAll.addEventListener('click', function (evt) {
      evt.preventDefault();
      setAllOpen(true);
    });
  }

  var collapseAll = document.getElementById('CollapseAll');
  if (collapseAll) {
    collapseAll.addEventListener('click', function (evt) {
      evt.preventDefault();
      setAllOpen(false);
    });
  }
})();
