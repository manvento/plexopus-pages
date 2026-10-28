'use strict';

// The site and language links work without JavaScript. This progressively
// enhances only the illustrative connectivity example and section navigation.
const demo = document.querySelector('[data-demo]');
if (demo) {
  const control = demo.querySelector('.valve-control');
  const toggle = demo.querySelector('input');
  const result = demo.querySelector('[role="status"]');
  const state = demo.querySelector('[data-valve-state]');
  const key = demo.querySelector('.closed-key');
  const update = () => {
    const closed = toggle.checked;
    demo.classList.toggle('is-closed', closed);
    result.textContent = closed ? demo.dataset.closedMessage : demo.dataset.openMessage;
    state.textContent = closed ? demo.dataset.closedLabel : demo.dataset.openLabel;
    key.hidden = !closed;
  };
  control.hidden = false;
  toggle.addEventListener('change', update);
  update();
}

// Keep the current section when switching between the two complete HTML pages.
for (const link of document.querySelectorAll('.languages a')) {
  link.addEventListener('click', () => {
    const target = new URL(link.href);
    target.hash = location.hash;
    link.href = target.href;
  });
}
