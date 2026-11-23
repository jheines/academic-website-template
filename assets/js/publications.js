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
   #CollapseAll) button handlers. */

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

  document.querySelectorAll('#mainbody .ExpandableAbstracts > li').forEach(function (li) {
    li.addEventListener('click', function (evt) {
      if (isCaretClick(li, evt)) {
        li.classList.toggle('open');
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
      li.classList.toggle('open', open);
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
