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
- Scene e testi adattati per smartphone; layout statico `prefers-reduced-motion`.
- `noindex,nofollow` per non indicizzare il concept.
- Linguaggio di marketing: nessuna promessa di simulazione fisica, impatto idraulico certo o manovre automatiche; MCP autenticato con permessi per rete.

## Gate prima di una release

- [ ] Test visuale su iPhone Safari, incluso landscape, barra browser e scroll inverso
- [ ] Desktop Safari/Chromium, tablet e split screen
- [ ] Controllo che Studio mostri adeguatamente **esplorazione** e **gestione**, non soltanto tracing
- [ ] Verifica accessibilità, contrasto, focus, layout a movimento ridotto
- [ ] Miglioramento del materiale illustrativo sul prodotto reale
- [ ] Prestazioni, pesi, consumi su telefoni reali
- [ ] Allineamento alle funzioni effettive di Studio e MCP al lancio

La PR resta in **Draft**. Non effettuare il merge senza approvazione esplicita.
