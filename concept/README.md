# Plexopus — concept scrollytelling, revisione 02

Prototipo sperimentale **non pubblicato** nella directory `/concept/`, branch `concept/scroll-storytelling-v1`.

## Struttura del racconto

Il progetto ora ha **tre capitoli autonomi**:

1. **Il viaggio verso il fondale.** Il simbolo originale Plexopus scende nell'acqua e la rete emerge dal buio. La sequenza è invariata.
2. **Plexopus Studio: esplora, gestisci, verifica.** Una dimostrazione visuale map-first racconta in tre passaggi come consultare la rete, creare una connessione e controllare le anomalie. Studio è un'applicazione completa; non è presentato come il risultato obbligato di una chat.
3. **Assistente AI via MCP: dialoga con la rete.** Lo smartphone arriva, una domanda viene digitata, MCP effettua simbolicamente un'analisi autorizzata e il risultato viene letto nella conversazione. È un canale autonomo, non una schermata di Studio. Il ritmo e l'animazione della domanda sono conservati.

Le esperienze **possono integrarsi** (per esempio tramite il collegamento opzionale di una scheda Studio), ma questa associazione non fa parte del racconto principale e richiede la verifica del pilot. Nessun risultato o funzionamento reale viene simulato tramite API nel sito: mappe e conversazioni sono **illustrative**.

## Preview locale

Dalla root del repository:

```sh
python3 -m http.server 8000
```

Aprire `http://localhost:8000/concept/`. In alternativa visualizzare i file di questo commit tramite un servizio di anteprima GitHub che gestisca HTML/CSS/JS e asset relativi. Non è necessario effettuare il merge.

## Note tecniche

- Sito attuale e homepage pubblica **invariati**: tutti i file nuovi/restanti sono in `concept/`.
- No framework, no GSAP, no tracking, no font o immagini di terze parti.
- File separati `index.html`, `story.css`, `story.js`. Riutilizzo di token, simbolo e favicon ufficiali senza alterarli.
- Timeline legate allo scroll e reversibili, singolo handler passivo e `requestAnimationFrame`.
- Le scene restano visivamente **sott'acqua dalla discesa fino alla chiusura**: il vecchio intermezzo bianco è diventato un passaggio di fondale con rete SVG e quattro capacità che si illuminano progressivamente mentre scorri.
- Lo stage mobile di **Studio usa righe di layout distinte** (titolo, descrizione, mappa, progress, nota), non più posizionamenti percentuali separati che causavano sovrapposizione su iPhone.
- Scene e testi adattati per smartphone; layout statico `prefers-reduced-motion`.
- `noindex,nofollow` per non indicizzare il concept.
- Linguaggio di marketing: nessuna promessa di simulazione fisica, impatto idraulico certo o manovre automatiche; MCP autenticato con permessi per rete.

## Gate prima di una release

- [ ] Test visuale su iPhone Safari, incluso landscape, barra browser e scroll inverso: confermare nessuna sovrapposizione tra testo e mappa Studio
- [ ] Desktop Safari/Chromium, tablet e split screen
- [ ] Controllo che Studio mostri adeguatamente **esplorazione** e **gestione**, non soltanto tracing
- [ ] Verifica accessibilità, contrasto, focus, layout a movimento ridotto
- [ ] Miglioramento del materiale illustrativo sul prodotto reale
- [ ] Prestazioni, pesi, consumi su telefoni reali
- [ ] Allineamento alle funzioni effettive di Studio e MCP al lancio

La PR resta in **Draft**. Non effettuare il merge senza approvazione esplicita.

## Revisione 04 — Fondale continuo e dimostrazioni bloccate nello scroll

- La scena «Capire una rete. Gestirla con semplicità.» usa lo stesso meccanismo **sticky + scroll scrub** del viaggio iniziale: la pagina riserva 4 segmenti narrativi prima di proseguire a Studio. Non è una striscia di tag che scorre via immediatamente.
- Le quattro capacità sono **illustrazioni diverse**: tracing con percorsi evidenziati, chiusura con pannelli prima/dopo, piano di isolamento con alimentazioni e valvole proposte, integrazione del motore in GIS/gestionali/REST/MCP. Ogni visualizzazione cambia quando cambia la scheda attiva. Su mobile resta visibile una scheda per volta.
- La profondità ora prosegue monotonamente: fine della discesa **#092431**, fine funzionalità **#071b27**, fine Studio **#061620**, fine assistente AI **#04121c**, chiusura più profonda. Una trama sott'acqua con raggi e particelle resta presente nei capitoli successivi.
- Nessuna nuova dipendenza. Niente simulazioni fisiche o attuazioni reali.
- Test manuali da completare: iPhone Safari (scroll pinned, schede, dispositivi), tablet/desktop, orientamento, tastiera e movimento ridotto.

## Fix — la sezione delle funzionalità non resta fissa durante lo scroll

La classe `.bridge` aveva `overflow:hidden` applicato **al contenitore di scroll** della scena sticky. In Chromium e Safari l'overflow del contenitore può intercettare lo scroll e impedire a `.bridge-stage` di restare ancorata alla viewport; la sezione riservava comunque `440–490svh`, creando un lungo spazio vuoto (“buco”).

- Correzione: `.bridge { overflow: visible; }`; rimane `.bridge-stage { overflow: hidden; }` per ritagliare soltanto grafica e particelle.
- Verifica tecnica riprodotta con Chromium headless alle dimensioni **390 × 844**: con `overflow:hidden` lo stage perde il pin e sale a `top:-422px` dopo 422px di scroll; con `overflow:visible` rimane a `top:0` in tutta la corsa dello scroll.
- **Regressione manuale da ripetere su iPhone Safari**: entrare nel capitolo «Capire una rete», scorrere avanti per le quattro scene (tracing, scenari, isolamento, integrazioni), tornare indietro; verificare che SVG e testo restino visibili e che non ci sia spazio vuoto.

## Studio v2 — interfaccia immediata e valore del prodotto

- La shell dell'interfaccia Studio è **visibile dal primo frame** della sezione, anche se lo scroll è fermo a progresso 0. Non viene più rivelata con un fade ritardato (precedentemente `ease(.04,.20,p)` e `opacity:0`), evitando il vuoto iniziale.
- Lo scroll muove **solo la dimostrazione del lavoro sulla rete**: 01 selezione e percorsi con focus sulla valvola, 02 creazione guidata di una connessione fra due estremi con bozza, 03 validazione che evidenzia un elemento da esaminare. Il pannello e un'indicazione sulla mappa cambiano insieme, per raccontare in modo più leggibile ogni capacità.
- Schemi concettuali e dati d'esempio, nessun salvataggio/controllo effettivo eseguito dal sito.
- Verificare su iPhone Safari che la mappa sia visibile appena entra in viewport e che ciascuna fase sia leggibile, compresa la scheda contestuale.

## Revisione 06 — Smartphone immediato e integrazioni indipendenti

- La scocca dello **smartphone dell'assistente AI è presente al primo frame** del capitolo, come Plexopus Studio. La sequenza di digitazione della domanda, la chiamata MCP illustrativa e la risposta continuano ad avanzare con lo scroll; non c'è più un'animazione di entrata del dispositivo.
- Il capitolo sulle **capacità del motore** ora presenta tre esempi strettamente legati alla rete: tracing, confronto scenari e isolamento. Le integrazioni non sono più il quarto schema a raggiera.
- È stato aggiunto un **capitolo autonomo dopo l'assistente AI**, dedicato alla natura integrabile di Plexopus, con stratificazione verticale della rete → Core → REST/MCP → applicazioni e flussi luminosi nello stile del fondale. Lo scroll fa emergere prima il motore, poi le interfacce e infine le applicazioni GIS/non-GIS.
- Anche questa visualizzazione è un concept: nessun software è effettivamente collegato nel prototipo. La homepage pubblicata resta intatta.

## Revisione 07 — Scenario in una sola rete e immersione pulita

- Capitolo 01: rimossi i testi «SUPERFICIE» e «FONDALE» dall'indicatore laterale, mantenendo la linea di progressione della profondità.
- Capitolo 02 / step 02: sostituiti i due riquadri separati prima/dopo con **un unico diagramma SVG persistente**. Il percorso parte completamente raggiungibile; avanzando nello scroll la valvola V-102 si chiude soltanto nello scenario ipotetico, e gli stessi rami a valle passano da verde a tracciato arancione tratteggiato, non più raggiungibile dall'origine S1. La topologia non salta di posizione e tornando indietro lo stato si riavvolge.
- Contenuti esemplificativi, nessuna simulazione fisica o comando reale. Per utenti con movimento ridotto, lo schema mostra direttamente lo stato finale e il testo esplicita il caso d'uso.
- QA visivo da completare su iPhone Safari (scroll avanti/indietro nello step 02) e desktop.

## Revisione 08 — Logo ufficiale nella chat e layout mobile senza sovrapposizioni

- Entrambe le occorrenze del vecchio simbolo «✳» nello smartphone (avatar e schermata di benvenuto) sono sostituite da `../assets/plexopus-symbol-128.png`, il simbolo ufficiale riutilizzato senza modificarne i pixel.
- La scena smartphone su viewport fino a 820px ora usa **righe di griglia** per titolo, testo, dispositivo, progress e disclaimer. Il telefono è centrato nella sua riga e il suo fattore di scala si adatta alle altezze più ridotte; in landscape stretto il layout passa a due colonne, invece di sovrapporre telefono e copy.
- Digitazione, risposta MCP e scroll reversibile invariati. Testare a mano su iPhone Safari in portrait e landscape, con barra degli indirizzi espansa/chiusa e VoiceOver. La precedente sezione Studio e i capitoli rete restano invariati.

## Consolidamento 01 — manutenzione CSS e QA automatizzata

- CSS diviso in tre file nell'**ordine di cascata originale**: `story.css` (foundation/elementi base), `story-scenes.css` (capitoli, animazioni e loro breakpoint), `story-mobile.css` (ultima correzione responsive del telefono). La suddivisione non cambia le regole esistenti: i fogli vengono caricati nella stessa sequenza di prima.
- Eliminati selettori morti delle prove precedenti: handoff Chat→Studio, vecchio diagramma integrazioni radiale e alcune parti grafiche non più presenti.
- Verifiche funzionali e responsive: file `concept/qa/smoke.mjs` per Chromium Playwright, copertura scroll pin, progressione delle scene, Studio/smartphone visibili all'ingresso, assenza di sovrapposizioni, iPhone portrait/landscape e movimento ridotto; screenshot diagnostici salvati localmente.
- Il test è sviluppo/QA: **Playwright non è richiesto dal sito** e non si carica sul client.
- Non è incluso un merge in `main`, non è una pubblicazione, né una traduzione definitiva.

## Revisione 09 — feedback visivo finale su schermi piccoli

- Le onde della copertina riutilizzano lo stesso avorio chiaro `#fbfcf8` del fondo della hero; il secondo strato termina esattamente nel colore iniziale del mare `#0c7180`. Le luci della prima discesa sfumano dall'alto per non produrre un bordo orizzontale tra sezioni.
- L'etichetta `JUNCTION` è stata spostata fuori dal percorso verticale che la attraversava, correggendo l'interferenza testo/diagramma.
- Il tracciato arancione Build collega **S1 (169,135)** a **J4 (404,98)**. Cerchi numerati, etichetta visiva e scheda contestuale identificano gli stessi estremi. Si tratta soltanto di una proposta illustrativa.
- La copia dei passi Studio è stata accorciata. Descrizioni mobile principali impostate almeno a **13px**, con interlinea ~1.42, inclusi i capitoli rete, Studio, AI ed ecosistema; testi interni al mockup aumentati dove possibile.
- I test Chromium verificano anche coerenza dei colori dell'onda, estremi Build e leggibilità mobile. Safari su iPhone reale rimane una verifica ulteriore, prima del merge.
