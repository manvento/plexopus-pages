'use strict';

// Opt into sticky scrollytelling only when JavaScript is available.
document.documentElement.classList.add('has-scroll-story');

/* Prototype only: one passive scroll listener, one coalesced animation frame.
   No timers, network calls, map API calls, analytics or dependencies. */

const diveTrack = document.getElementById('dive');
const diveStage = document.getElementById('dive-stage');
const octopus = document.getElementById('octo-traveler');
const diveCaptions = [...document.querySelectorAll('[data-dive-caption]')];
const studioTrack = document.getElementById('studio-story');
const studioStage = document.getElementById('studio-stage');
const studioCounter = document.getElementById('studio-story-counter');
const studioStepLabel = document.getElementById('studio-step-label');
const studioStepHeading = document.getElementById('studio-step-heading');
const studioStepDescription = document.getElementById('studio-step-description');
const studioOverlayKicker = document.getElementById('studio-overlay-kicker');
const studioOverlayTitle = document.getElementById('studio-overlay-title');
const studioOverlayDescription = document.getElementById('studio-overlay-description');
const studioOverlayState = document.getElementById('studio-overlay-state');
const studioFactA = document.getElementById('studio-fact-a');
const studioFactALabel = document.getElementById('studio-fact-a-label');
const studioFactB = document.getElementById('studio-fact-b');
const studioFactBLabel = document.getElementById('studio-fact-b-label');
const studioMapModeIcon = document.getElementById('studio-map-mode-icon');
const studioMapModeText = document.getElementById('studio-map-mode-text');
const studioDraft = document.querySelector('.studio-draft-connection');
const studioStepMarkers = [...document.querySelectorAll('.studio-step-markers span')];
const studioProgressFill = document.getElementById('studio-progress-fill');
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
const momentCounter = document.getElementById('moment-counter');
const momentDescription = document.getElementById('moment-description');
const momentDots = [...document.querySelectorAll('.moment-dots span')];
const bottomTimeline = document.getElementById('scene-timeline-fill');

const question = 'Se chiudo la valvola V-102, quali tratti non sono più raggiungibili dal nodo S1?';
const storyMessages = [
  "Con MCP puoi dialogare con Plexopus attraverso un assistente AI compatibile.",
  "Scrivi una domanda comprensibile, senza dover conoscere i comandi della piattaforma.",
  "MCP invoca strumenti di analisi secondo i permessi e i dati disponibili.",
  "La risposta illustra che cosa è raggiungibile nello scenario, con evidenze di rete.",
  "La risposta arriva direttamente nella conversazione: dialogare con la rete diventa immediato."
];
const studioSteps = [
  {
    mode: 'explore', label: '01 · ESPLORA', heading: 'Seleziona. Scopri. Esplora.',
    description: 'Tocca un elemento sulla mappa e segui i collegamenti senza perdere il contesto.',
    kicker: 'ESPLORA LA RETE', title: 'Valvola V-102',
    overlay: 'Seleziona un elemento e scopri come si collega alla rete.', status: 'Esplora i collegamenti',
    factA: 'V-102', factALabel: 'Elemento', factB: 'Traccia', factBLabel: 'Azione guidata',
    mapIcon: '⌕', mapCue: 'Selezione sulla mappa'
  },
  {
    mode: 'build', label: '02 · GESTISCI', heading: 'Collega due elementi, facilmente.',
    description: 'Scegli i due estremi sulla mappa: Studio prepara una connessione da verificare prima di salvarla.',
    kicker: 'BUILD · GUIDATO', title: 'Nuova connessione',
    overlay: 'I due estremi scelti compongono una proposta, senza modificare subito la rete.', status: 'Anteprima da confermare',
    factA: '1 → 2', factALabel: 'Estremi scelti', factB: 'Bozza', factBLabel: 'Nessuna scrittura',
    mapIcon: '+', mapCue: 'Crea sulla mappa'
  },
  {
    mode: 'validate', label: '03 · VERIFICA', heading: 'Le anomalie diventano visibili.',
    description: 'Esegui la validazione e apri ogni segnalazione direttamente nel suo contesto cartografico.',
    kicker: 'VALIDATE · RETE', title: 'Elemento da verificare',
    overlay: 'Una segnalazione viene evidenziata sulla mappa per esaminarla.', status: 'Apri il dettaglio',
    factA: 'J-4', factALabel: 'Esempio', factB: 'Issue', factBLabel: 'Da esaminare',
    mapIcon: '!', mapCue: 'Verifica e localizza'
  }
];

const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const mediaMobile = window.matchMedia('(max-width: 820px)');
const ecosystemTrack = document.getElementById('ecosystem');
const ecosystemStage = document.getElementById('ecosystem-stage');
const ecosystemCounter = document.getElementById('ecosystem-counter');
const ecosystemStepLabel = document.getElementById('ecosystem-step-label');
const ecosystemStepTitle = document.getElementById('ecosystem-step-title');
const ecosystemStepText = document.getElementById('ecosystem-step-text');
const ecosystemProgress = document.getElementById('ecosystem-progress-fill');
const closing = document.querySelector('.closing');
const bridge = document.getElementById('capabilities-bridge');
const bridgeStage = document.getElementById('bridge-stage');
const bridgeCards = [...document.querySelectorAll('[data-bridge-step]')];
const bridgeScenes = [...document.querySelectorAll('[data-bridge-scene]')];
const bridgeCounter = document.getElementById('bridge-counter');
const bridgeProgressFill = document.getElementById('bridge-progress-fill');
let queued = false;
let oldDiveStep = -1;
let oldMoment = -1;
let oldStudioStep = -1;
let oldBridgeStep = -1;
let oldEcosystemStep = -1;

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
    activeIn(diveTrack) || activeIn(bridge) || activeIn(studioTrack) || activeIn(conversationTrack) || activeIn(ecosystemTrack) || activeIn(closing)
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

// Palette checkpoints align exactly at every section boundary:
 // dive #092431 → bridge #071b27 → Studio #061620 → chat #04121c.
function paintDepth(stage, start, end, p) {
  const v = start.map((a, i) => Math.round(lerp(a, end[i], p)));
  stage.style.backgroundColor = 'rgb(' + v.join(',') + ')';
  stage.style.setProperty('--scene-p', p.toFixed(4));
}
function updateBridge(progress) {
  const p = clamp(progress);
  const current = Math.min(2, Math.floor(p * 3));
  const local = clamp((p - current / 3) * 3);
  paintDepth(bridgeStage, [9, 36, 49], [7, 27, 39], p);
  bridgeStage.style.setProperty('--bridge-path-draw', ease(.04, .92, local).toFixed(4));
  bridgeStage.style.setProperty('--bridge-effect', ease(.44, .9, local).toFixed(4));
  // During step 02, one diagram gradually changes state instead of switching screenshots.
  const closure = current === 1 ? local : 0;
  bridgeStage.style.setProperty('--closure-valve', ease(.22, .47, closure).toFixed(4));
  bridgeStage.style.setProperty('--closure-affected', ease(.46, .82, closure).toFixed(4));
  bridgeProgressFill.style.width = (p * 100).toFixed(2) + '%';
  if (current !== oldBridgeStep) {
    oldBridgeStep = current;
    bridgeStage.dataset.bridgeIndex = String(current);
    bridgeCounter.textContent = '0' + (current + 1) + ' / 03';
    bridgeCards.forEach((card, i) => card.classList.toggle('is-active', i === current));
  }
}

function updateStudio(progress) {
  const p = clamp(progress);
  const current = p < .33 ? 0 : p < .68 ? 1 : 2;
  studioStage.style.setProperty('--studio-progress', p.toFixed(4));
  paintDepth(studioStage, [7, 27, 39], [6, 22, 32], p);
  // Studio is visible at the very first frame of its pinned section.
  // Scroll changes the workflow, never reveals the application's shell.
  const currentMode = current === 0 ? 'explore' : current === 1 ? 'build' : 'validate';
  studioStage.dataset.studioMode = currentMode;
  resultTrace.style.strokeDashoffset = (1 - ease(0, .28, p)).toFixed(4);
  studioDraft.style.strokeDashoffset = (1 - ease(.34, .57, p)).toFixed(4);
  resultBranches.style.opacity = ease(.70, .80, p).toFixed(3);
  studioProgressFill.style.width = (100 * p).toFixed(2) + '%';
  if (current !== oldStudioStep) {
    oldStudioStep = current;
    const data = studioSteps[current];
    studioStage.dataset.studioMode = data.mode;
    studioCounter.textContent = '0' + (current + 1) + ' / 03';
    studioStepLabel.textContent = data.label;
    studioStepHeading.textContent = data.heading;
    studioStepDescription.textContent = data.description;
    studioOverlayKicker.textContent = data.kicker;
    studioOverlayTitle.textContent = data.title;
    studioOverlayDescription.textContent = data.overlay;
    studioOverlayState.textContent = data.status;
    studioFactA.textContent = data.factA;
    studioFactALabel.textContent = data.factALabel;
    studioFactB.textContent = data.factB;
    studioFactBLabel.textContent = data.factBLabel;
    studioMapModeIcon.textContent = data.mapIcon;
    studioMapModeText.textContent = data.mapCue;
    studioStepMarkers.forEach((item, i) => item.classList.toggle('is-active', i === current));
  }
}

function updateStory(progress) {
  const p = clamp(progress);
  conversationStage.style.setProperty('--story-progress', p.toFixed(4));
  paintDepth(conversationStage, [6, 22, 32], [4, 18, 28], p);
  const moment = p < .18 ? 0 : p < .39 ? 1 : p < .55 ? 2 : p < .76 ? 3 : 4;
  if (moment !== oldMoment) {
    oldMoment = moment;
    conversationStage.dataset.moment = String(moment);
    momentCounter.textContent = '0' + (moment + 1) + ' / 05';
    momentDescription.textContent = storyMessages[moment];
    momentDots.forEach((dot, i) => dot.classList.toggle('active', i === moment));
  }

  // The phone is already visible on the first frame (just like Studio).
  // Only its conversation content advances with the scroll.
  const typedPortion = ease(.16, .38, p);
  typedQuestion.textContent = question.slice(0, Math.round(question.length * typedPortion));
  questionBubble.style.opacity = ease(.16, .23, p).toFixed(3);
  phoneWelcome.style.opacity = (1 - ease(.14, .24, p)).toFixed(3);
  phoneWelcome.style.display = p > .25 ? 'none' : '';
  phoneTool.style.opacity = ease(.38, .48, p).toFixed(3);
  phoneTool.style.transform = 'translateY(' + lerp(8, 0, ease(.38, .48, p)).toFixed(1) + 'px)';
  phoneResult.style.opacity = ease(.53, .64, p).toFixed(3);
  phoneResult.style.transform = 'translateY(' + lerp(12, 0, ease(.53, .64, p)).toFixed(1) + 'px)';

  bottomTimeline.style.width = (p * 100).toFixed(2) + '%';
}

const ecosystemSteps = [
  {
    label: '01 · UNA BASE APERTA', title: 'Il motore è indipendente.',
    text: 'Plexopus Core raccoglie modello, regole, connettività e analisi. Non serve cambiare i tuoi software per usarlo.'
  },
  {
    label: '02 · SI INTEGRA', title: 'L’intelligenza esce dalla mappa.',
    text: 'Con REST API e MCP, le stesse analisi diventano disponibili ad applicazioni e assistenti AI autorizzati.'
  },
  {
    label: '03 · ENTRA NEL TUO MONDO', title: 'Si adatta ai tuoi strumenti.',
    text: 'GIS, gestionali, applicazioni operative o soluzioni personalizzate: Plexopus non impone un’interfaccia unica.'
  }
];

function updateEcosystem(progress) {
  const p = clamp(progress);
  const step = p < .31 ? 0 : p < .66 ? 1 : 2;
  paintDepth(ecosystemStage, [4, 18, 28], [3, 14, 23], p);
  ecosystemStage.style.setProperty('--ecosystem-p', p.toFixed(4));
  ecosystemStage.style.setProperty('--eco-flow', ease(.08, .92, p).toFixed(4));
  ecosystemStage.style.setProperty('--eco-offset',
    Math.round((1 - ease(.08, .92, p)) * 240) + 'px');
  ecosystemProgress.style.width = (p * 100).toFixed(2) + '%';
  if (step !== oldEcosystemStep) {
    oldEcosystemStep = step;
    ecosystemStage.dataset.ecosystemStep = String(step);
    ecosystemCounter.textContent = '0' + (step + 1) + ' / 03';
    ecosystemStepLabel.textContent = ecosystemSteps[step].label;
    ecosystemStepTitle.textContent = ecosystemSteps[step].title;
    ecosystemStepText.textContent = ecosystemSteps[step].text;
  }
}

function render() {
  queued = false;
  if (mediaReduced.matches) {
    document.body.classList.add('reduced-motion');
    momentDescription.textContent = storyMessages[4];
    studioStepDescription.textContent = studioSteps[2].description;
    studioStage.dataset.studioMode = 'validate';
    bridgeStage.style.setProperty('--bridge-path-draw', '1');
    bridgeStage.dataset.bridgeIndex = '0';
    bridgeCards.forEach((card, i) => card.classList.toggle('is-active', i === 0));
    typedQuestion.textContent = question;
    conversationStage.dataset.moment = '4';
    ecosystemStage.dataset.ecosystemStep = '2';
    ecosystemStepTitle.textContent = ecosystemSteps[2].title;
    ecosystemStepText.textContent = ecosystemSteps[2].text;
    return;
  }
  document.body.classList.remove('reduced-motion');
  setDeepHeader();
  animateDive(progressOf(diveTrack));
  updateBridge(progressOf(bridge));
  updateStudio(progressOf(studioTrack));
  updateStory(progressOf(conversationTrack));
  updateEcosystem(progressOf(ecosystemTrack));
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
  oldStudioStep = -1;
  oldBridgeStep = -1;
  oldEcosystemStep = -1;
  if (mediaReduced.matches) {
    const nodes = [diveStage, octopus, storyPhone, storyStudio, phoneWelcome,
      questionBubble, phoneTool, phoneResult, resultTrace, resultBranches];
    nodes.forEach((node) => { if (node) node.removeAttribute('style'); });
    diveCaptions.forEach((node) => node.removeAttribute('aria-hidden'));
  }
  schedule();
});
mediaMobile.addEventListener('change', schedule);
schedule();
