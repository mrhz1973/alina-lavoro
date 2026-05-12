# Task — Claude Login/Subscription Check (Gated)

## Metadata

- ID: 0123-claude-login-subscription-check-gated
- Project: Alina Lavoro
- Type: cli-auth-planning-gated
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0122 ha installato Claude Code CLI 2.1.139 sul VPS. Task 0123 deve preparare la verifica del login/subscription come prerequisito per l'uso operativo di Claude Code CLI in Fase 3A runner documentale.

## Contesto Operativo

### Stato Attuale VPS

- **Claude Code CLI:** 2.1.139 installata ✅
- **Path:** /usr/local/bin/claude ✅
- **Node.js:** v18.19.1 ✅
- **npm:** 9.2.0 ✅
- **Login:** NON eseguito ❌
- **API key:** NON configurata ❌
- **n8n runtime:** non modificato ❌
- **Runner automatico:** non attivo ❌

### Presupposto Operativo

- **NO API key manuali:** l'utente non vuole usare API key manuali come presupposto operativo
- **Claude Pro/subscription login:** metodo di autenticazione preferito per Claude Code CLI
- **Nessun runner automatico:** n8n runner resta non attivo

## Obiettivo Futuro

Verificare se Claude Code CLI può essere autenticata tramite Claude Pro/subscription login sul VPS, documentando la compatibilità con ambiente headless/server.

**Questo task NON esegue nessun comando VPS, NON esegue login, NON configura API key, NON esegue `claude --print`.**

## Autorizzazione Gate Obbligatorio

La presenza di questo task in queue **NON autorizza automaticamente** l'esecuzione di alcun comando sul VPS.

Prima di qualsiasi SSH/login/authentication/runtime action, è richiesto:

1. Nuovo gate esplicito dell'orchestratore/utente
2. Approvazione scritta dell'azione specifica proposta
3. Conferma che il contesto VPS non è cambiato (task 0122 ancora valido)
4. Conferma che il presupposto subscription/login è accettabile per l'utente

## Scope del Task Futuro

Il task futuro, dopo gate esplicito, resterà limitato a:

- Verificare `claude --version` (già noto: 2.1.139)
- Verificare se esistono comandi help/read-only sicuri
- Verificare eventuale comando di login (solo se esplicitamente autorizzato nel gate futuro)
- Documentare compatibilità login con ambiente VPS/headless

**Fuori scope e vietato in task 0123:**
- `claude --print` (vietato, nessun test con task reali)
- Esecuzione di prompt reali
- Task docs-only automatici
- Lettura/scrittura `.env`
- Stampa completa di `env`
- Lettura token/sessioni locali
- Modifica shell profile
- Modifica n8n runtime
- Modifica docker-compose
- Modifica workflow n8n
- Creazione nodo Execute Command
- Deploy, tag, rollback
- Modifiche app Alina

## Comandi Futuri da Valutare (SOLO dopo Gate)

```bash
# Verifica versione (già nota, ma può essere ripetuta)
claude --version

# Eventuale comando help, se sicuro e non interattivo
claude --help || true

# Eventuale verifica stato auth, solo se non stampa token/credenziali
# NOTA: questo richiede gate esplicito specifico

# Eventuale comando login, SOLO se autorizzato nel gate
# NOTA: questo richiede gate esplicito specifico per login
```

## Stop Conditions (Criteri di Arresto)

Durante l'esecuzione futura, **fermarsi immediatamente** se:

- Claude richiede API key manuale
- Mostra token, URL sensibili o OAuth material
- Richiede browser login non gestibile in modo sicuro sul VPS
- L'autenticazione salva file non chiari o non documentati
- Serve modificare n8n, docker-compose o ambiente globale
- Appaiono ambiguità su costi, limiti, subscription, credential o path dei segreti
- Qualunque output contiene dati sensibili (token, sessioni, URL OAuth, credenziali)

## Gestione Segreti e Credenziali

**Regole assolute per task 0123:**

- **Nessuna credenziale/token/sessione committata** nel repository
- **Nessun URL di login in chiaro** nei documenti
- **Nessun OAuth code** nei log di sessione
- **Nessun session token** nei file di documentazione
- **File credential** (se creati da CLI) non devono essere letti/documentati in chiaro
- Eventuali output contenenti dati sensibili devono essere **redatti completamente**

## Output Documentale Previsto

Dopo esecuzione futura con gate esplicito:

1. **docs/automation/claude-login-subscription-check.md**
   - Metodo di autenticazione verificato (subscription/login)
   - Compatibilità con VPS/headless documentata
   - Comandi eseguiti (redatti se contengono dati sensibili)
   - Output sanitizzato
   - Eventuali warning o limitazioni
   - Conclusione: login pronto/non pronto per runner Fase 3A

2. **docs/sessions/2026-05-12-claude-login-subscription-check.md**
   - Timestamp esecuzione
   - Gate ricevuto
   - Comandi eseguiti
   - Output redatto/sanitizzato (no token, no URL, no credenziali)
   - Anomalie riscontrate
   - Passaggi non eseguiti perché vietati

3. **docs/tasks/done/0123-claude-login-subscription-check-gated.md**
   - Done marker
   - Evidence completamento
   - Conferma nessuna API key manuale configurata
   - Conferma nessun `claude --print` eseguito
   - Conferma nessun runner automatico attivato

## Done Criteria Futuri

Il task 0123 sarà considerato completato solo quando:

- ✅ Login/subscription verificato (OPPURE blocco documentato con motivazione precisa)
- ✅ Nessuna API key manuale configurata
- ✅ Nessun `claude --print` eseguito
- ✅ Nessun task reale eseguito tramite Claude CLI
- ✅ Nessun runner automatico attivato
- ✅ Nessuna modifica n8n runtime
- ✅ Nessun nodo Execute Command creato
- ✅ Documentazione aggiornata (con redazione segreti)
- ✅ Done marker creato
- ✅ Commit selettivo e push eseguiti
- ✅ Nessuna modifica app Alina

## Allowed Paths (futura esecuzione)

- docs/automation/claude-login-subscription-check.md
- docs/sessions/2026-05-12-claude-login-subscription-check.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0123-claude-login-subscription-check-gated.md

## Forbidden Paths (sempre)

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- .clasp.json
- .github/workflows/**
- export JSON n8n non redatti
- file con credenziali, token, chiavi, OAuth material, sessioni locali o URL raw sensibili

## Note Operative

- Questo task è puramente preparatorio/informativo
- Nessuna azione runtime deve essere eseguita in questo step
- L'esecuzione reale (login/auth) richiederà gate manuale separato
- App Alina V1.9.2 rimane stabile e non toccata
- Runner automatico non attivo
- Presupposto subscription/login prioritario su API key manuale
- Cursor sospeso fino al reset tra circa 10 giorni
- Windsurf/Cascade implementatore di riserva supervisionato
- Claude Code implementatore principale temporaneo

---
**Task creato — Claude login/subscription check preparato, attesa gate manuale per esecuzione**
