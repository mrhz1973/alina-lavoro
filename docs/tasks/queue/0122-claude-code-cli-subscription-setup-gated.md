# Task — Claude Code CLI Subscription Setup (Gated)

## Metadata

- ID: 0122-claude-code-cli-subscription-setup-gated
- Project: Alina Lavoro
- Type: cli-setup-planning-gated
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0121 ha completato l'installazione di Node.js v18.19.1 e npm 9.2.0 sul VPS. Task 0122 deve preparare il futuro setup di Claude Code CLI come candidato principale per Fase 3A runner documentale.

## Contesto Operativo Attuale

### Implementatori

- **Claude Code:** implementatore principale temporaneo (fino al reset di Cursor)
- **Windsurf/Cascade:** implementatore di riserva / supervisionato
- **Cursor:** non operativo fino al reset tra circa 10 giorni
- **ChatGPT Plus/Codex CLI:** alternativa futura, non priorità

### Presupposto Operativo

- **NO API key manuali:** l'utente non vuole usare API key manuali come presupposto operativo
- **Claude Pro/subscription login:** metodo di autenticazione preferito per Claude Code CLI
- **Nessun runner automatico:** n8n runner resta non attivo

## Stato Prerequisiti

### VPS (Task 0120 + 0121)

- **OS:** Ubuntu 24.04.4 LTS ✅
- **Kernel:** 6.8.0-111-generic ✅
- **CPU:** 4 cores ✅
- **RAM:** 3.8 GB (2.8 GB available) ✅
- **Docker:** 29.1.3 ✅
- **n8n:** running on 127.0.0.1:5678 ✅
- **Node.js:** v18.19.1 installato (task 0121) ✅
- **npm:** 9.2.0 installato (task 0121) ✅
- **Claude CLI:** NON installato ❌
- **API key:** NON configurate ❌

### n8n Runtime

- **Workflow n8n:** non modificati per runner ❌
- **Nodi Execute Command:** non creati ❌
- **Runner automatico:** non attivo ❌

## Obiettivo Futuro

Installare/verificare Claude Code CLI sul VPS come prerequisito per runner documentale Fase 3A, con autenticazione tramite Claude Pro/subscription se supportata e coerente.

**Questo task NON esegue nessun comando VPS, NON installa Claude Code CLI, NON configura API key, NON esegue login Claude.**

## Autorizzazione Gate Obbligatorio

La presenza di questo task in queue **NON autorizza automaticamente** l'esecuzione di alcun comando sul VPS.

Prima di qualsiasi SSH/installazione/login/runtime action, è richiesto:

1. Nuovo gate esplicito dell'orchestratore/utente
2. Approvazione scritta dell'azione specifica proposta
3. Conferma che il contesto VPS non è cambiato (task 0121 ancora valido)
4. Conferma che il presupposto subscription/login è accettabile per l'utente

## Scope del Task Futuro

Il task futuro, dopo gate esplicito, resterà limitato a:

- Verificare stato Node.js/npm
- Verificare eventuale pacchetto Claude Code CLI disponibile
- Installare Claude Code CLI solo se autorizzata
- Verificare `claude --version`
- Documentare metodo di autenticazione (subscription/login se supportato)
- Confermare che nessuna API key manuale è richiesta/registrata

**Fuori scope e vietato in task 0122:**
- Installazione con API key Anthropic manuale
- Configurazione API key in repo, VPS o n8n
- Salvataggio credenziali/token/URL sensibili
- Flusso browser auth non gestibile in modo sicuro sul VPS
- Esecuzione `claude --print`
- Test con task reali
- Modifica n8n runtime
- Modifica workflow n8n
- Creazione nodi Execute Command
- Attivazione runner automatico
- Deploy, tag, rollback
- Modifiche app Alina

## Comandi Futuri da Valutare (SOLO dopo Gate)

```bash
# Verifica prerequisiti
node --version
npm --version
which node
which npm

# Verifica disponibilità Claude Code CLI
npm search @anthropic-ai/claude-code || true
# oppure
npm list -g @anthropic-ai/claude-code || true

# Installazione (solo se autorizzata)
npm install -g @anthropic-ai/claude-code

# Verifica installazione
claude --version
which claude

# NOTA: nessun claude --print, nessun test con task reali
```

## Stop Conditions (Criteri di Arresto)

Durante l'esecuzione futura, **fermarsi immediatamente** se:

- Viene richiesta API key Anthropic manuale
- Login richiede salvare credenziali non comprese
- Vengono mostrati token, sessioni locali o URL sensibili
- La CLI richiede flusso browser non gestibile in modo sicuro sul VPS
- L'installazione richiede permessi o modifiche non previste
- n8n o docker-compose dovrebbero essere modificati
- Appare ambiguità su costi/limiti/credential
- Il presupposto subscription/login non è supportato dalla CLI
- Qualsiasi comando mostra risultati inattesi o potenzialmente dannosi

## Output Documentale Previsto

Dopo esecuzione futura con gate esplicito:

1. **docs/automation/claude-code-cli-subscription-setup.md**
   - Metodo di installazione scelto
   - Comandi eseguiti
   - Output sanitizzato
   - Versione Claude CLI installata
   - Metodo di autenticazione (subscription/login se supportato)
   - Conferma nessuna API key manuale
   - Note su eventuali warning o limitazioni

2. **docs/sessions/2026-05-12-claude-code-cli-subscription-setup.md**
   - Timestamp esecuzione
   - Gate ricevuto
   - Comandi eseguiti
   - Output redatto/sanitizzato
   - Anomalie riscontrate
   - Conferma nessuna modifica fuori scope

3. **docs/tasks/done/0122-claude-code-cli-subscription-setup-gated.md**
   - Done marker
   - Evidence completamento
   - Conferma nessuna API key manuale configurata
   - Conferma nessun runner automatico

## Done Criteria Futuri

Il task 0122 sarà considerato completato solo quando:

- ✅ Claude Code CLI installata e verificata (OPPURE blocco documentato con motivazione precisa)
- ✅ Nessuna API key manuale configurata
- ✅ Autenticazione subscription/login documentata (se supportata)
- ✅ Nessun runner automatico attivato
- ✅ Nessuna modifica n8n runtime
- ✅ Nessun nodo Execute Command creato
- ✅ Documentazione aggiornata
- ✅ Done marker creato
- ✅ Commit selettivo e push eseguito
- ✅ Nessuna modifica app Alina

## Allowed Paths (futura esecuzione)

- docs/automation/claude-code-cli-subscription-setup.md
- docs/sessions/2026-05-12-claude-code-cli-subscription-setup.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0122-claude-code-cli-subscription-setup-gated.md

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
- L'esecuzione reale richiederà gate manuale separato
- App Alina V1.9.2 rimane stabile e non toccata
- Runner automatico non attivo
- Presupposto subscription/login prioritario su API key manuale
- Cursor sospeso fino al reset tra circa 10 giorni
- Windsurf/Cascade implementatore di riserva supervisionato

---
**Task creato - Claude Code CLI subscription setup preparato, attesa gate manuale per esecuzione**
