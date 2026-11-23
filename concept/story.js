'use strict';

/* Prototype only: one passive scroll listener, one coalesced animation frame.
   No timers, network calls, map API calls, analytics or dependencies. */

const diveTrack = document.getElementById('dive');
const diveStage = document.getElementById('dive-stage');
const octopus = document.getElementById('octo-traveler');
const diveCaptions = [...document.querySelectorAll('[data-dive-caption]')];
const conversationTrack = document.getElementById('conversation');
const conversationStage = document.getElementById('conversation-stage');
const storyPhone = document.getElementById('story-phone');
const storyStudio = document.getElementById('story-studio');
const typedQuestion = document.getElementById('typed-question');
const questionBubble = document.getElementById('phone-question');
const phoneWelcome = document.querySelector('.phone-welcome');
const phoneTool = document.querySelector('.phone-tool');
const phoneResult = document.querySelector('.phone-result');
const resultTrace = document.querySelector('.studio-network-trace');
const resultBranches = document.querySelector('.studio-network-disconnected');
const transferBeam = document.querySelector('.transfer-beam');
const momentCounter = document.getElementById('moment-counter');
const momentDescription = document.getElementById('moment-description');
const momentDots = [...document.querySelectorAll('.moment-dots span')];
const bottomTimeline = document.getElementById('scene-timeline-fill');

const question = 'Se chiudo la valvola V-102, quali tratti non sono più raggiungibili dal nodo S1?';
const storyMessages = [
  "Un assistente AI compatibile diventa un nuovo modo di accedere all'intelligenza delle reti.",
  "La domanda prende forma. Non occorre conoscere tutti i comandi tecnici della piattaforma.",
  "MCP invoca gli strumenti di Plexopus con permessi verificati e uno scenario esplicito.",
  "Il risultato distingue i collegamenti raggiungibili da quelli esclusi nello scenario.",
  "La stessa analisi può essere consegnata alla mappa di Plexopus Studio, nella scheda collegata."
];

const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const mediaMobile = window.matchMedia('(max-width: 820px)');
const closing = document.querySelector('.closing');
const bridge = document.querySelector('.bridge');
let queued = false;
let oldDiveStep = -1;
let oldMoment = -1;

function progressOf(track) {
  const rect = track.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  return clamp(-rect.top / travel);
}

function setDeepHeader() {
  const activeIn = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top < 74 && rect.bottom > 74;
  };
  document.body.classList.toggle(
    'is-deep',
    activeIn(diveTrack) || activeIn(conversationTrack) || activeIn(closing)
  );
}

function animateDive(progress) {
  const p = clamp(progress);
  diveStage.style.setProperty('--dive-p', p.toFixed(4));
  const bg = [
    Math.round(lerp(12, 9, p)),
    Math.round(lerp(113, 36, p)),
    Math.round(lerp(128, 49, p))
  ];
  diveStage.style.backgroundColor = 'rgb(' + bg.join(',') + ')';
  diveStage.style.setProperty('--network-visible', ease(.28, .79, p).toFixed(4));
  diveStage.style.setProperty('--network-draw', ease(.47, .94, p).toFixed(4));

  const mobile = mediaMobile.matches;
  const x = mobile ? lerp(78, 49, p) : lerp(76, 55, p);
  const y = mobile ? lerp(52, 76, p) : lerp(23, 70, p);
  const scale = lerp(1.03, mobile ? .60 : .64, p);
  const rotation = Math.sin(p * Math.PI * 2) * 7;
  octopus.style.left = x.toFixed(2) + '%';
  octopus.style.top = y.toFixed(2) + '%';
  octopus.style.transform = 'translate(-50%, -50%) scale(' + scale.toFixed(3) +
    ') rotate(' + rotation.toFixed(2) + 'deg)';

  const chapter = p < .31 ? 0 : p < .65 ? 1 : 2;
  if (oldDiveStep !== chapter) {
    oldDiveStep = chapter;
    diveStage.dataset.depth = String(chapter);
    diveCaptions.forEach((caption) => {
      caption.setAttribute('aria-hidden', String(Number(caption.dataset.diveCaption) !== chapter));
    });
  }
}

function updateStory(progress) {
  const p = clamp(progress);
  conversationStage.style.setProperty('--story-progress', p.toFixed(4));
  const moment = p < .18 ? 0 : p < .39 ? 1 : p < .55 ? 2 : p < .76 ? 3 : 4;
  if (moment !== oldMoment) {
    oldMoment = moment;
    conversationStage.dataset.moment = String(moment);
    momentCounter.textContent = '0' + (moment + 1) + ' / 05';
    momentDescription.textContent = storyMessages[moment];
    momentDots.forEach((dot, i) => dot.classList.toggle('active', i === moment));
  }

  const mobile = mediaMobile.matches;
  const arrival = ease(.02, .18, p);
  const handoff = ease(.74, .96, p);
  const scale = mobile ? lerp(.63, .78, arrival) : lerp(.74, 1, arrival);
  const rotate = lerp(-9, 0, arrival);
  storyPhone.style.left = mobile ? '50%' : lerp(45, 17, handoff).toFixed(2) + '%';
  storyPhone.style.transform = 'translate(-50%, -50%) scale(' + scale.toFixed(3) +
    ') rotate(' + rotate.toFixed(2) + 'deg)';
  storyPhone.style.opacity = (mobile ? 1 - ease(.79, .90, p) : 1 - .22 * handoff).toFixed(3);

  const typedPortion = ease(.16, .38, p);
  typedQuestion.textContent = question.slice(0, Math.round(question.length * typedPortion));
  questionBubble.style.opacity = ease(.16, .23, p).toFixed(3);
  phoneWelcome.style.opacity = (1 - ease(.14, .24, p)).toFixed(3);
  phoneWelcome.style.display = p > .25 ? 'none' : '';
  phoneTool.style.opacity = ease(.38, .48, p).toFixed(3);
  phoneTool.style.transform = 'translateY(' + lerp(8, 0, ease(.38, .48, p)).toFixed(1) + 'px)';
  phoneResult.style.opacity = ease(.53, .64, p).toFixed(3);
  phoneResult.style.transform = 'translateY(' + lerp(12, 0, ease(.53, .64, p)).toFixed(1) + 'px)';

  const revealStudio = ease(.70, .87, p);
  storyStudio.style.opacity = revealStudio.toFixed(3);
  storyStudio.style.transform = mobile ?
    'translate(-50%, -50%) scale(' + lerp(.88, 1, revealStudio).toFixed(3) + ')' :
    'translate(' + lerp(60, 0, revealStudio).toFixed(1) +
    'px, -50%) scale(' + lerp(.83, 1, revealStudio).toFixed(3) + ')';

  resultTrace.style.strokeDashoffset = (1 - ease(.79, .95, p)).toFixed(4);
  resultBranches.style.opacity = ease(.84, .96, p).toFixed(3);
  transferBeam.style.opacity = ((1 - ease(.94, 1, p)) * ease(.76, .86, p)).toFixed(3);
  bottomTimeline.style.width = (p * 100).toFixed(2) + '%';
}

function render() {
  queued = false;
  if (mediaReduced.matches) {
    document.body.classList.add('reduced-motion');
    momentDescription.textContent = storyMessages[4];
    typedQuestion.textContent = question;
    conversationStage.dataset.moment = '4';
    return;
  }
  document.body.classList.remove('reduced-motion');
  setDeepHeader();
  animateDive(progressOf(diveTrack));
  updateStory(progressOf(conversationTrack));
}

function schedule() {
  if (!queued) {
    queued = true;
    window.requestAnimationFrame(render);
  }
}
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
mediaReduced.addEventListener('change', () => {
  oldDiveStep = -1;
  oldMoment = -1;
  if (mediaReduced.matches) {
    const nodes = [diveStage, octopus, storyPhone, storyStudio, phoneWelcome,
      questionBubble, phoneTool, phoneResult, resultTrace, resultBranches, transferBeam];
    nodes.forEach((node) => { if (node) node.removeAttribute('style'); });
    diveCaptions.forEach((node) => node.removeAttribute('aria-hidden'));
  }
  schedule();
});
mediaMobile.addEventListener('change', schedule);
schedule();
