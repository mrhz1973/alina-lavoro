# Script npm **`aggio:win`** (Windows)

**Data:** 2026-05-05

## Motivo

Su Windows, `npm run aggio` esegue `bash tools/aggio.sh`. Se `bash` non è nel `PATH`, il comando fallisce anche con Git for Windows installato (bash presente sotto `C:\Program Files\Git\bin\bash.exe`).

## Modifica

- `package.json`: aggiunto script **`aggio:win`** che invoca Git Bash via percorso breve `C:\\Progra~1\\Git\\bin\\bash.exe` (evita spazi in `Program Files`, che su `cmd` rompono le virgolette negli script npm).
- `docs/COMMANDS.md`: nota operativa con `npm.cmd run aggio:win`.
- `docs/CHECKPOINT.md`: riga di aggiornamento leggera.

## Cosa resta invariato

- **`npm run aggio`:** invariato (Mac/Linux e Windows con `bash` nel PATH).
- Nessuna modifica a `src/`, `gas-current/`, deploy Apps Script, nuovi tag.

## Comando di riferimento

```bash
npm.cmd run aggio:win
```

Presuppone installazione **predefinita** di Git for Windows nel percorso standard sopra citato.
