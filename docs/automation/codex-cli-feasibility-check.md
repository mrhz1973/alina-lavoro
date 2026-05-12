# Codex CLI Feasibility Check — Fase 3A

**Data:** 2026-05-12  
**Task:** 0125-codex-cli-feasibility-check  
**Tipo:** runner-feasibility-docs-only  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

---

## 1. Executive Summary

**Codex CLI è tecnicamente candidabile come alternativa futura per Fase 3A, ma con limitazioni importanti che non ne consentono l'uso immediato come runner headless no-API-key su VPS.**

Risultati chiave dalla documentazione ufficiale OpenAI (developers.openai.com/codex, consultata 2026-05-12):

- **Autenticazione:** Codex CLI supporta due metodi — ChatGPT subscription e API key. La raccomandazione ufficiale OpenAI per automazione/CI-CD è **API key** (che viola il presupposto no-API-key manuale dell'utente).
- **Headless:** il login ChatGPT subscription è originariamente browser-based. Esistono workaround documentati (device code authentication — beta; copia `auth.json`; SSH port forwarding), ma tutti richiedono un passo manuale iniziale e gestione sicura del token.
- **Differenza chiave rispetto a Claude CLI:** a differenza di Claude Code CLI, Codex CLI **ha documentazione ufficiale per ambienti headless** (`codex login --device-auth`), ma questa funzione è ancora in **beta** e richiede abilitazione manuale nelle impostazioni ChatGPT.
- **Token/sessione:** le sessioni ChatGPT vengono refresh automaticamente durante l'uso, ma il file `~/.codex/auth.json` contiene access token in chiaro e va trattato come password.

**Raccomandazione:** Codex CLI è **più avanzato di Claude CLI per headless** ma non è ancora pronto per runner VPS no-API-key nel contesto Alina Lavoro senza un percorso sicuro di gestione del token. Possibile come **uso locale supervisionato** (sul computer dell'utente, non come runner VPS). Per VPS runner: richiede accettazione di uno dei due presupposti (API key o login interattivo sicuro una tantum con gestione `auth.json`). Raccomandazione finale: **non procedere con runner VPS Codex CLI** finché resta il vincolo no-API-key; valutare uso locale supervisionato come alternativa a Claude Code.

---

## 2. Contesto

- **Task 0124 completato:** decisione Fase 3A no-API documentata
- **Decisione corrente:** modalità manuale-supervisionata (Claude Code locale principale, Windsurf/Cascade riserva)
- **Codex CLI:** valutazione documentale autorizzata da task 0125 (questo documento)
- **Presupposto operativo:** no API key manuali (requisito utente confermato)
- **n8n:** resta queue reader/prompt generator/session tracker — NON runner
- **Runner automatico:** non attivo; non autorizzato
- **VPS:** Claude Code CLI installata ma non autenticata; nessun runner attivo

---

## 3. Fonti Consultate

| Fonte | URL | Data consultazione |
|-------|-----|--------------------|
| Codex CLI — Getting Started | https://developers.openai.com/codex/cli | 2026-05-12 |
| Codex CLI — Authentication | https://developers.openai.com/codex/auth | 2026-05-12 |
| Codex CLI — Features | https://developers.openai.com/codex/cli/features | 2026-05-12 |
| Codex CLI — Changelog | https://developers.openai.com/codex/changelog | 2026-05-12 |

**Nota:** nessun URL con token, query string sensibile, OAuth material o credenziali è stato documentato. Solo URL pubblici della documentazione ufficiale OpenAI.

---

## 4. Valutazione dei Criteri

### Criterio 1 — Documentazione Ufficiale Codex CLI Disponibile

**Evidenza:** Documentazione ufficiale completa e pubblica disponibile su `developers.openai.com/codex`. Include sezioni dedicate a: installazione, autenticazione, uso headless, scripting, approval modes, MCP, changelog.

**Esito:** ✅ **OK** — Documentazione ufficiale presente e strutturata, molto più matura rispetto a Claude Code CLI.

---

### Criterio 2 — Supporto Autenticazione con ChatGPT Plus/Subscription senza API key Manuale

**Evidenza dalla documentazione ufficiale:**
> "The first time you run Codex, you'll be prompted to sign in. Authenticate with your ChatGPT account or an API key."
> "ChatGPT Plus, Pro, Business, Edu, and Enterprise plans include Codex."
> "Recommendation is to use API key authentication for programmatic Codex CLI workflows (for example CI/CD jobs)."

**Analisi:**
- Il metodo ChatGPT subscription è supportato ufficialmente per uso interattivo
- Per uso **programmatico/CI-CD**, OpenAI raccomanda esplicitamente **API key**, non subscription
- Il subscription login (ChatGPT) genera un access token memorizzato in `~/.codex/auth.json`; questo token viene refreshato automaticamente durante l'uso attivo

**Esito:** ⚠️ **Da verificare** — login subscription tecnicamente funziona per uso locale/interattivo, ma per automazione OpenAI raccomanda API key. Uso subscription per runner VPS headless è possibile tecnicamente ma non è il percorso raccomandato.

---

### Criterio 3 — Compatibilità Headless/VPS

**Evidenza dalla documentazione ufficiale:**
> "If you are signing in to ChatGPT with the Codex CLI, there are some situations where the browser-based login UI may not work: You're running the CLI in a remote or headless environment."
> "In these situations, prefer device code authentication (beta)."

**Metodi headless documentati (in ordine di preferenza):**

1. **Device code authentication (beta)** — `codex login --device-auth` — richiede abilitazione nelle impostazioni ChatGPT; si completa tramite codice monouso su browser separato; **beta, non stabile**
2. **Copia `auth.json`** — login su macchina con browser, poi copia del file `~/.codex/auth.json` sul server via SSH/SCP; tratta il file come password
3. **SSH port forwarding** — forward della porta 1455 dal server alla macchina locale con browser

**Differenza rispetto a Claude Code CLI:** Codex CLI ha **tre percorsi headless documentati**; Claude Code CLI non ne aveva nessuno (solo `/login` interattivo).

**Esito:** ⚠️ **Da verificare** — headless è possibile con workaround documentati, ma tutti richiedono un passo manuale iniziale e comportano gestione di access token in chiaro su VPS.

---

### Criterio 4 — Necessità Browser/Login Interattivo

**Evidenza dalla documentazione ufficiale:**
- Default: browser-based login (apre finestra browser)
- Alternativa beta: device code authentication (richiede browser su macchina separata)
- Alternativa fallback: copia `auth.json` da macchina con browser

**Analisi:** anche con device code o copia `auth.json`, è sempre richiesta **almeno una sessione di login una tantum su una macchina con browser**. Il refresh automatico dei token avviene solo durante l'uso attivo della CLI, non è indefinito.

**Esito:** ⚠️ **Rischio medio** — il login interattivo iniziale è sempre richiesto; gestione dei token per sessioni lunghe richiede attenzione.

---

### Criterio 5 — Gestione Credential/Token/Sessioni

**Evidenza dalla documentazione ufficiale:**
> "Codex caches login details locally in a plaintext file at ~/.codex/auth.json or in your OS-specific credential store."
> "If you use file-based storage, treat ~/.codex/auth.json like a password: it contains access tokens. Don't commit it, paste it into tickets, or share it in chat."
> "For sign in with ChatGPT sessions, Codex refreshes tokens automatically during use before they expire, so active sessions usually continue without requiring another browser login."

**Analisi:**
- Token salvato in chiaro in `~/.codex/auth.json` sul VPS — rischio sicurezza
- Refresh automatico solo durante uso attivo
- Sessioni inattive possono scadere (documentazione non specifica durata)
- File non va mai committato, condiviso o incluso in export

**Esito:** ❌ **Non raccomandato per VPS non presidiato** — token in chiaro su filesystem VPS; gestione sicura complessa; rischio esposizione in ambiente server.

---

### Criterio 6 — Compatibilità con n8n come Runner Futuro

**Evidenza dalla documentazione ufficiale:**
> "Scripting Codex: Automate repeatable workflows by scripting Codex with the exec command."
> "Automate repeatable workflows by scripting Codex with the exec command."

**Analisi:**
- Codex CLI supporta modalità non-interattiva (`exec` command) per scripting/automazione
- Tecnicamente integrabile come runner chiamato da n8n via Execute Command
- Richiederebbe: Codex CLI installato su VPS + autenticato + nodo Execute Command in n8n

**Vincoli attuali:**
- Nessun nodo Execute Command autorizzato
- Nessuna installazione autorizzata
- Nessun login autorizzato

**Esito:** ⚠️ **Potenziale futuro** — tecnicamente possibile ma richiede task separati e gate manuali per installazione, autenticazione e configurazione.

---

### Criterio 7 — Limiti/Costi/Quote

**Evidenza dalla documentazione ufficiale:**
- ChatGPT Plus, Pro, Business, Edu, Enterprise: Codex CLI incluso (usa crediti ChatGPT)
- API key: fatturazione a consumo alle tariffe API standard OpenAI
- "Features that rely on ChatGPT credits, such as fast mode, are available only when you sign in with ChatGPT."
- Pricing dettagliato: `developers.openai.com/codex/pricing`

**Analisi:**
- Con subscription ChatGPT Plus: quota mensile inclusa, ma i crediti Codex sono separati
- I limiti di utilizzo dipendono dal piano e dall'uso concurrent
- Per runner automatico su VPS: consumo crediti non controllato senza supervisione

**Esito:** ⚠️ **Da verificare** — pricing Codex-specific richiede verifica separata; per runner automatico il consumo di crediti potrebbe essere significativo.

---

### Criterio 8 — Isolamento da App Alina V1.9.2

**Evidenza dalla documentazione ufficiale:**
> "Don't expose Codex execution in untrusted or public environments."
> "Approval modes: Choose the approval mode that matches your comfort level before Codex edits or runs commands."

**Analisi:**
- Codex CLI può ispezionare repository, editare file ed eseguire comandi — accesso al filesystem
- Approval modes permettono controllo: `suggest` (solo suggerimenti), `auto-edit` (edita file), `full-auto` (esegue comandi)
- In modalità supervisionata con approval mode `suggest`: rischio basso
- Come runner automatico non presidiato: rischio modifiche indesiderate

**Esito:** ✅ **OK in modalità supervisionata** — con approval mode `suggest` e supervisione manuale, isolamento dall'app Alina è gestibile; ❌ non raccomandato in modalità runner automatico non presidiato.

---

### Criterio 9 — Rischi di Modifiche Indesiderate

**Evidenza dalla documentazione ufficiale:**
- Modalità `full-auto`: Codex esegue comandi senza approvazione
- Modalità `suggest`: propone solo, non esegue
- Codex cloud tasks operano su branch separati con sandbox

**Analisi:**
- Runner automatico con `full-auto` su VPS con accesso al repository = alto rischio
- Modalità supervisionata locale con `suggest` = rischio basso
- Senza supervisione e con accesso a git: rischio commit/push non autorizzati

**Esito:** ❌ **Rischio alto per runner automatico** — ✅ **Rischio basso per uso supervisionato locale**.

---

### Criterio 10 — Possibilità di Dry-Run/Sandbox/Manual-Supervised

**Evidenza dalla documentazione ufficiale:**
- `suggest` mode: Codex propone modifiche senza applicarle
- Codex Cloud tasks: operano in ambienti sandbox isolati con applicazione diff manuale
- Approval modes configurabili

**Esito:** ✅ **OK** — esistono modalità supervisionata (`suggest`) e sandbox (Codex Cloud) per uso sicuro.

---

### Criterio 11 — Confronto con Opzioni Già Decise in 0124

| Confronto | Claude Code locale (A) | Windsurf/Cascade (B) | Codex CLI locale |
|-----------|----------------------|---------------------|-----------------|
| No API key | ✅ | ✅ | ✅ (con subscription) |
| Disponibile ora | ✅ | ✅ | ⚠️ (richiede installazione) |
| Headless VPS | ❌ | ❌ | ⚠️ (workaround documentati) |
| Supervisione | ✅ | ✅ | ✅ |
| Token su VPS | N/A | N/A | ❌ (rischio auth.json) |
| Documentazione | ✅ | ✅ | ✅ (migliore di Claude CLI) |

**Analisi:** Codex CLI locale (uso supervisionato sul computer dell'utente, non su VPS) è concettualmente simile all'opzione A (Claude Code locale). Non offre vantaggi operativi immediati rispetto a Claude Code o Windsurf per l'uso corrente. Per VPS headless runner: vantaggio documentale rispetto a Claude CLI (tre percorsi headless vs zero), ma i rischi di gestione token su VPS restano significativi.

---

## 5. Matrice Sintetica

| Criterio | Evidenza documentale | Rischio | Esito |
|----------|---------------------|---------|-------|
| 1. Doc ufficiale disponibile | Completa su developers.openai.com/codex | Basso | ✅ OK |
| 2. Auth subscription no-API-key | Supportata; OpenAI raccomanda API key per automazione | Medio | ⚠️ Da verificare |
| 3. Headless/VPS | Device code (beta), auth.json copy, SSH tunnel | Medio | ⚠️ Da verificare |
| 4. Browser/login interattivo | Sempre richiesto almeno una volta | Medio | ⚠️ Rischio medio |
| 5. Gestione token/credenziali | auth.json in chiaro su VPS | Alto | ❌ Non raccomandato (VPS) |
| 6. Compatibilità n8n runner | exec command supportato | Medio | ⚠️ Potenziale futuro |
| 7. Limiti/costi/quote | Incluso in Plus; consumo crediti Codex separato | Medio | ⚠️ Da verificare |
| 8. Isolamento app Alina | Approval modes configurabili | Basso (supervisionato) | ✅ OK (supervisionato) |
| 9. Rischio modifiche indesiderate | full-auto = alto rischio | Alto (runner auto) | ❌ Runner auto; ✅ Supervisionato |
| 10. Dry-run/sandbox | suggest mode e Codex Cloud sandbox | Basso | ✅ OK |
| 11. Confronto 0124 | Nessun vantaggio immediato vs A/B locali | Basso | ⚠️ Non urgente |

---

## 6. Raccomandazione

### Per uso su VPS come runner automatico no-API-key

**Non raccomandato nel breve termine.**

Motivazioni:
1. OpenAI raccomanda esplicitamente API key per automazione/CI-CD — presupposto no-API-key viola la via raccomandata
2. La via subscription headless (device code beta o copia `auth.json`) richiede login manuale iniziale e gestione token in chiaro su filesystem VPS
3. Il file `~/.codex/auth.json` contiene access token sensibili — rischio sicurezza su server non presidiato
4. La funzione device code è ancora in **beta** — non è percorso stabile per produzione

### Per uso locale supervisionato (computer dell'utente)

**Tecnicamente possibile, ma non prioritario rispetto alle opzioni già operative.**

Motivazioni:
- Funzionalmente simile a Claude Code locale (opzione A in 0124) — stesse garanzie di supervisione
- Richiederebbe installazione e login aggiuntivo (non autorizzati da questo task)
- Claude Code locale e Windsurf già operativi — nessun vantaggio immediato nell'aggiungere Codex CLI locale

### Percorso futuro (se il presupposto cambia)

Se in futuro l'utente accetta uno dei seguenti cambi di presupposto:
1. **Login interattivo sicuro una tantum su VPS** (con gestione controllata di `auth.json`, MFA abilitato, rotazione periodica token)
2. **API key dedicata** (via raccomandata OpenAI per automazione)

...allora Codex CLI diventa candidato più maturo di Claude Code CLI per runner headless, grazie a documentazione headless più completa e al supporto del comando `exec` per scripting.

**Eventuali passi runtime devono essere task separati con gate manuali separati.**

---

## 7. Conclusione

**Task 0125 non autorizza:**
- ❌ Runtime di nessun tipo
- ❌ Installazione Codex CLI
- ❌ Esecuzione Codex CLI
- ❌ Login ChatGPT / OpenAI
- ❌ Configurazione API key
- ❌ Modifiche VPS
- ❌ Modifiche n8n runtime
- ❌ GitHub Actions
- ❌ Runner automatico
- ❌ Modifiche app Alina
- ❌ Deploy / tag / rollback

**Stato invariato:**
- Runner automatico non attivo ✓
- VPS non modificato ✓
- n8n non modificato ✓
- App Alina V1.9.2 stabile ✓
- Modalità manuale-supervisionata confermata come decisione corrente (da 0124) ✓

**Prossimo passo raccomandato:** restare su modalità manuale-supervisionata (opzione F + A + B da 0124); valutare Codex CLI solo se cambia presupposto no-API-key o se si accetta login interattivo sicuro gestito; Cursor CLI preflight al reset Cursor (~10 giorni).

---
**Task 0125 completato — Codex CLI: non raccomandato per runner VPS no-API-key nel breve termine**
