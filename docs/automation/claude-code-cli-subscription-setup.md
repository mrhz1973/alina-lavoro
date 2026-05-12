# Claude Code CLI Subscription Setup

**Data:** 2026-05-12  
**Task:** 0122-claude-code-cli-subscription-setup-gated  
**Tipo:** cli-setup-planning-gated  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

## Scopo

Installare e verificare Claude Code CLI sul VPS come prerequisito per Fase 3A runner documentale. Presupposto operativo: Claude Pro/subscription login (nessuna API key manuale).

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0122 Claude Code CLI setup, solo installazione/verifica CLI, nessuna API key, nessun runner automatico."

## Metodo di Installazione Scelto

**npm global package:** `@anthropic-ai/claude-code`

### Motivazione

- Node.js v18.19.1 già presente (task 0121)
- npm 9.2.0 già presente (task 0121)
- Installazione standard e documentata
- Nessun script curl/PPA esterno richiesto

## Comandi Eseguiti

| Fase | Comando | Scopo |
|------|---------|-------|
| Verifica prerequisiti | `node --version` | Verifica Node.js |
| Verifica prerequisiti | `npm --version` | Verifica npm |
| Verifica prerequisiti | `which node` | Path Node.js |
| Verifica prerequisiti | `which npm` | Path npm |
| Verifica stato CLI | `which claude \|\| true` | Claude CLI assente |
| Verifica stato CLI | `claude --version \|\| true` | Conferma assenza |
| Verifica package | `npm view @anthropic-ai/claude-code version` | Versione disponibile |
| Installazione | `npm install -g @anthropic-ai/claude-code` | Installazione globale |
| Verifica post | `which claude` | Path Claude installato |
| Verifica post | `claude --version` | Versione Claude |
| Anti-API-key check | `env \| cut -d= -f1 \| grep -E '^(ANTHROPIC_API_KEY\|CLAUDE_API_KEY\|CLAUDE_CODE_API_KEY\|CLAUDE_CODE_OAUTH_TOKEN)$' \|\| true` | Solo nomi variabili |

## Output Sintetico e Sanitizzato

### Verifica Prerequisiti

```
node --version: v18.19.1 ✓
npm --version: 9.2.0 ✓
which node: /usr/bin/node ✓
which npm: /usr/bin/npm ✓
```

### Stato CLI Prima dell'Installazione

```
which claude: command not found
claude --version: command not found
```

**Conferma:** Claude CLI non presente (come atteso)

### Versione Package npm

```
npm view @anthropic-ai/claude-code version: 2.1.139
```

### Installazione

```
npm install -g @anthropic-ai/claude-code
added 3 packages in 4s
```

**Esito:** Installazione completata con successo (3 pacchetti, nessun warning)

### Verifica Post-Installazione

```
which claude: /usr/local/bin/claude ✓
claude --version: 2.1.139 (Claude Code) ✓
```

### Anti-API-Key Check

```
[output vuoto - nessuna variabile API/token trovata]
```

**Nessuna variabile API/token/OAuth presente nell'ambiente VPS.**

## Versioni

- **Node.js:** v18.19.1 (da task 0121)
- **npm:** 9.2.0 (da task 0121)
- **Claude Code CLI:** 2.1.139 (installato in task 0122)

## Path Installazione

- **Claude Code CLI:** /usr/local/bin/claude

## Conferme di Non-Interferenza

- ✅ **Login Claude NON eseguito** — nessun `claude /login`, nessun OAuth, nessun browser auth
- ✅ **API key NON configurata** — nessuna variabile API/token trovata nell'ambiente
- ✅ **`claude --print` NON eseguito** — solo `claude --version` per verifica
- ✅ **n8n runtime NON modificato** — container n8n running invariato
- ✅ **docker-compose NON modificato** — nessuna modifica
- ✅ **Workflow n8n NON modificati** — nessun cambiamento
- ✅ **Nodi Execute Command NON creati** — nessun nodo aggiunto
- ✅ **Runner automatico NON attivato** — ancora supervisionato/manuale
- ✅ **App Alina NON modificata** — V1.9.2 stabile e non toccata

## Warning/Anomalie

Nessun warning o anomalia rilevata. Installazione pulita, 3 pacchetti aggiunti.

## Conclusione

**VPS pronto per futuro task di login subscription separato.**

- Claude Code CLI 2.1.139 installata e funzionante
- `claude --version` verificato: `2.1.139 (Claude Code)`
- Path: `/usr/local/bin/claude`
- Nessuna variabile API/token/OAuth presente
- Login subscription non eseguito (richiede gate separato)
- Il prossimo step (autenticazione subscription) richiederà gate esplicito dell'orchestratore
