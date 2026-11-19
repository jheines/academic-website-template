// assets/js/links.js
// added by Claude, 2026-11-18 16:05 -- Tasks/Tasks_2026-11-18.md Pass #2
//
// Renders assets/data/JesseLinks.json into the #links-content container on
// links.html. JSON shape: top-level keys (besides "comment") are group
// titles; each group is an object whose keys are the link text to display.
// Per-link fields and their defaults (see JesseLinks.json's own "comment"
// block for Jesse's authoritative field spec):
//   level    1 (default) = flush with the group title, 2 = indented 1em
//   url      if missing/empty, rendered as plain text (no link) instead
//            of an anchor, matching Jesse's "arrow cursor, not a pointing
//            finger" spec for items with no destination
//   target   "_blank" (default)
//   active   true (default) = pointer cursor, false = arrow cursor
//   hidden   false (default) = shown, true = skipped entirely
//   color    CSS color value applied to the link text
//   boldface true = bold link text, false (default) = normal weight
//   tooltip  if present, becomes the anchor's title attribute

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('links-content');
  if (!container) return;

  let data;
  try {
    data = await loadJSON('assets/data/JesseLinks.json');
  } catch (err) {
    console.error('Failed to load JesseLinks.json:', err);
    return;
  }

  container.innerHTML = '';

  Object.keys(data)
    .filter(groupTitle => groupTitle !== 'comment')
    .forEach(groupTitle => {
      const groupData = data[groupTitle];
      const visibleItems = Object.keys(groupData)
        .filter(itemText => groupData[itemText].hidden !== true);

      if (visibleItems.length === 0) return; // whole group hidden -- skip, no empty heading

      const group = document.createElement('div');
      group.className = 'links-group';

      const heading = document.createElement('h2');
      heading.className = 'links-group-title';
      heading.textContent = groupTitle;
      group.appendChild(heading);

      const list = document.createElement('ul');
      list.className = 'links-list';

      visibleItems.forEach(itemText => {
        const item = groupData[itemText];
        const level = item.level === 2 ? 2 : 1;

        const li = document.createElement('li');
        li.className = `links-item links-level-${level}`;

        const hasUrl = typeof item.url === 'string' && item.url.trim() !== '';
        const el = document.createElement(hasUrl ? 'a' : 'span');
        el.innerHTML = itemText; // innerHTML: some keys contain inline tags, e.g. "<em>...</em>"

        if (hasUrl) {
          el.href = item.url;
          el.target = item.target || '_blank';
          if (el.target === '_blank') el.rel = 'noopener';
        }
        if (item.tooltip) el.title = item.tooltip;
        if (item.color) el.style.color = item.color;
        if (item.boldface === true) el.style.fontWeight = '700';
        if (!hasUrl || item.active === false) el.classList.add('links-inactive');

        li.appendChild(el);
        list.appendChild(li);
      });

      group.appendChild(list);
      container.appendChild(group);
    });
});
