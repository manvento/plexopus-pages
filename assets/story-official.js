'use strict';
// Keep the section when switching between EN and IT; both pages share anchor IDs.
// Without JavaScript the links still take the visitor to the other language.
document.querySelectorAll('[data-language-switch]').forEach((link) => {
  link.addEventListener('click', () => {
    if (!window.location.hash) return;
    const destination = new URL(link.href, window.location.href);
    destination.hash = window.location.hash;
    link.href = destination.href;
  });
});
// Mobile menu is native HTML details; close it after an in-page destination.
document.querySelectorAll('.mobile-nav nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = link.closest('details');
    if (menu) menu.open = false;
  });
});
