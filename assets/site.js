'use strict';
// The website is readable without JavaScript. These controls only switch illustrative examples.
for (const link of document.querySelectorAll('.lang-switch a')) {
  link.addEventListener('click', () => {
    const url = new URL(link.href, location.href);
    url.hash = location.hash;
    link.href = url.href;
  });
}
const chatCard = document.getElementById('chat-card');
if (chatCard) {
  const questions = [...document.querySelectorAll('[data-chat]')];
  const answers = (chatCard.dataset.answers || '').split('|||');
  const question = document.getElementById('chat-question');
  const answer = document.getElementById('chat-answer');
  for (const item of questions) {
    item.addEventListener('click', () => {
      const index = Number(item.dataset.chat);
      if (!Number.isInteger(index) || !answers[index]) return;
      questions.forEach((element) => element.setAttribute('aria-pressed', String(element === item)));
      question.textContent = item.textContent;
      answer.textContent = answers[index];
    });
  }
}
const lab = document.getElementById('lab-visual');
if (lab) {
  const buttons = [...document.querySelectorAll('[data-lab]')];
  const titles = (lab.dataset.titles || '').split('|||');
  const texts = (lab.dataset.texts || '').split('|||');
  const title = document.getElementById('lab-result-title');
  const result = document.getElementById('lab-result-text');
  const graphTitle = document.getElementById('graph-title');
  const graphDesc = document.getElementById('graph-desc');
  const graphDescriptions = (lab.dataset.graphDescriptions || '').split('|||');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.lab);
      if (!Number.isInteger(index) || !titles[index] || !texts[index]) return;
      buttons.forEach((element) => element.setAttribute('aria-pressed', String(element === button)));
      lab.dataset.mode = ['connect', 'closure', 'isolate'][index] || 'connect';
      title.textContent = titles[index];
      result.textContent = texts[index];
      if (graphTitle) graphTitle.textContent = titles[index];
      if (graphDesc) graphDesc.textContent = graphDescriptions[index] || texts[index];
    });
  }
}
