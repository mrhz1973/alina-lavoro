/* Prepare and promote a numbered Apps Script release in a private staging dir.
   Neither command creates or changes a deployment without an explicit target.
   The staging directory contains private files and must stay outside Git. */
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const RECEIPT = '.versioned-release.json';
const LOCK = '.versioned-release.lock';
const VERSION_PATTERN = /const APP_VERSION\s*=\s*['"]([0-9]+)['"]\s*;/g;

function assertVersion(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error(name + ' non valida.');
  return number;
}

function stageProject(stage, expectedProject) {
  const dir = fs.realpathSync(stage);
  const projectDir = fs.realpathSync(path.join(__dirname, '..'));
  const relative = path.relative(projectDir, dir);
  if (!relative || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative))) {
    throw new Error('La cartella privata deve essere esterna al repository.');
  }
  const config = JSON.parse(fs.readFileSync(path.join(dir, '.clasp.json'), 'utf8'));
  if (!expectedProject || config.scriptId !== expectedProject) throw new Error('Il progetto Google non corrisponde a quello indicato.');
  if (config.rootDir && config.rootDir !== '.') throw new Error('La cartella privata deve contenere direttamente i file dello script.');
  return dir;
}

function withLock(stage, task) {
  const lock = path.join(stage, LOCK);
  let handle;
  try { handle = fs.openSync(lock, 'wx'); }
  catch (_) { throw new Error('È già presente un blocco di pubblicazione nella cartella privata. Verificarlo prima di riprovare.'); }
  try {
    fs.writeFileSync(handle, String(process.pid));
    return task();
  } finally {
    fs.closeSync(handle);
    fs.unlinkSync(lock);
  }
}

function writeAtomic(file, contents) {
  const temporary = path.join(path.dirname(file), '.' + path.basename(file) + '.' + crypto.randomBytes(8).toString('hex') + '.tmp');
  fs.writeFileSync(temporary, contents, { encoding: 'utf8', flag: 'wx' });
  try { fs.renameSync(temporary, file); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function snapshot(dir) {
  const files = new Map();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const isScript = /\.(?:js|gs|html)$/i.test(entry.name) || entry.name === 'appsscript.json';
    if (!isScript) {
      if (entry.isDirectory()) throw new Error('La cartella privata deve contenere soltanto file di primo livello.');
      continue;
    }
    if (!entry.isFile()) throw new Error('Un file dello script non è un file regolare.');
    const name = entry.name.replace(/\.gs$/i, '.js');
    if (files.has(name)) throw new Error('Due file dello script hanno lo stesso nome.');
    files.set(name, crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, entry.name))).digest('hex'));
  }
  if (!files.has('Index.html') || !files.has('appsscript.json')) throw new Error('Mancano i file principali dello script.');
  return Object.fromEntries([...files.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function sameSnapshot(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function inScratch(stage, task) {
  const root = fs.realpathSync(os.tmpdir());
  const dir = fs.mkdtempSync(path.join(root, 'alina-release-'));
  try {
    fs.copyFileSync(path.join(stage, '.clasp.json'), path.join(dir, '.clasp.json'));
    return task(dir);
  } finally {
    const resolved = fs.realpathSync(dir);
    if (path.dirname(resolved) !== root || !path.basename(resolved).startsWith('alina-release-')) {
      throw new Error('La cartella temporanea non è verificabile.');
    }
    fs.rmSync(resolved, { recursive: true, force: true });
  }
}

function pullSnapshot(stage, version, run) {
  return inScratch(stage, function (dir) {
    const args = ['pull'];
    if (version !== null) args.push('--versionNumber', String(version));
    run(args, dir);
    return snapshot(dir);
  });
}

function readDisplayedVersion(indexFile) {
  const text = fs.readFileSync(indexFile, 'utf8');
  const matches = [...text.matchAll(VERSION_PATTERN)];
  const label = /<p class=["']app-version["']>[^<]*\$\{APP_VERSION\}[^<]*<\/p>/i;
  if (matches.length !== 1 || !label.test(text)) throw new Error('Il numero versione nelle impostazioni non è identificabile.');
  return { text, version: assertVersion(matches[0][1], 'Versione visualizzata') };
}

function stampVersion(indexFile, version) {
  const current = readDisplayedVersion(indexFile);
  const text = current.text.replace(VERSION_PATTERN, () => "const APP_VERSION='" + version + "';");
  writeAtomic(indexFile, text);
  if (readDisplayedVersion(indexFile).version !== version) throw new Error('La scritta della versione non è stata aggiornata.');
}

function writeReceipt(stage, value) {
  writeAtomic(path.join(stage, RECEIPT), JSON.stringify(value, null, 2) + '\n');
}

function prepareRelease(options, run) {
  const stage = stageProject(options.stage, options.project);
  const base = assertVersion(options.base, 'Versione di partenza');
  if (!options.description) throw new Error('Serve una descrizione della versione.');
  return withLock(stage, function () {
    const baseSnapshot = pullSnapshot(stage, base, run);
    const headSnapshot = pullSnapshot(stage, null, run);
    if (!sameSnapshot(baseSnapshot, headSnapshot)) {
      throw new Error('Il progetto Google contiene modifiche successive alla versione di partenza. Fermarsi e confrontarle.');
    }
    const versions = run(['versions'], stage);
    if (!Array.isArray(versions) || versions.length === 0) throw new Error('Impossibile determinare la prossima versione.');
    const numbers = versions.map(item => assertVersion(item.versionNumber, 'Versione Google'));
    let expected = Math.max(...numbers) + 1;
    const index = path.join(stage, 'Index.html');
    writeReceipt(stage, { status: 'preparing', project: options.project });
    for (let attempt = 0; attempt < 3; attempt++) {
      stampVersion(index, expected);
      const prepared = snapshot(stage);
      run(['push'], stage);
      const created = run(['version', options.description], stage);
      const actual = assertVersion(created && created.versionNumber, 'Versione creata');
      const saved = pullSnapshot(stage, actual, run);
      if (!sameSnapshot(prepared, saved)) {
        throw new Error('Il contenuto della versione Google non coincide con la copia preparata. Nessuna pubblicazione effettuata.');
      }
      if (actual === expected) {
        const receipt = { status: 'ready', project: options.project, version: actual, files: prepared };
        writeReceipt(stage, receipt);
        return receipt;
      }
      if (actual < expected || !sameSnapshot(prepared, pullSnapshot(stage, null, run))) {
        throw new Error('La numerazione o il progetto Google sono cambiati durante la preparazione. Nessuna pubblicazione effettuata.');
      }
      expected = actual + 1;
    }
    throw new Error('La numerazione Google continua a cambiare. Nessuna pubblicazione effettuata.');
  });
}

function findDeployment(deployments, id) {
  if (!Array.isArray(deployments)) throw new Error('Elenco pubblicazioni non disponibile.');
  const matches = deployments.filter(item => item.deploymentId === id);
  if (matches.length !== 1) throw new Error('Il collegamento non appartiene in modo univoco al progetto indicato.');
  return matches[0];
}

function promoteRelease(options, run) {
  const stage = stageProject(options.stage, options.project);
  const current = assertVersion(options.current, 'Versione attuale');
  if (!options.deployment || !options.description) throw new Error('Servono il collegamento e una descrizione della pubblicazione.');
  return withLock(stage, function () {
    const receipt = JSON.parse(fs.readFileSync(path.join(stage, RECEIPT), 'utf8'));
    const version = assertVersion(receipt.version, 'Versione preparata');
    if (receipt.status !== 'ready' || receipt.project !== options.project || !receipt.files) {
      throw new Error('La preparazione non è completa o appartiene a un altro progetto.');
    }
    const indexVersion = readDisplayedVersion(path.join(stage, 'Index.html')).version;
    if (indexVersion !== version || !sameSnapshot(snapshot(stage), receipt.files)) {
      throw new Error('La copia preparata è stata modificata. Ricontrollarla prima di pubblicare.');
    }
    if (!sameSnapshot(pullSnapshot(stage, version, run), receipt.files)) {
      throw new Error('La versione Google non coincide con la copia verificata.');
    }
    const before = findDeployment(run(['list-deployments'], stage), options.deployment);
    if (Number(before.versionNumber) !== current) throw new Error('Il collegamento è cambiato dopo la verifica iniziale.');
    const result = run(['deploy', '--deploymentId', options.deployment, '--versionNumber', String(version), '--description', options.description], stage);
    if (!result || result.deploymentId !== options.deployment || Number(result.versionNumber) !== version) {
      throw new Error('Esito della pubblicazione incerto: verificare il collegamento prima di riprovare.');
    }
    const after = findDeployment(run(['list-deployments'], stage), options.deployment);
    if (Number(after.versionNumber) !== version) throw new Error('Google non conferma la versione pubblicata. Verificare prima di riprovare.');
    return version;
  });
}

function claspRunner(args, cwd) {
  const roots = [path.resolve(__dirname, '..', 'node_modules')].concat((process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean));
  const cli = roots.map(root => path.join(root, '@google', 'clasp', 'build', 'src', 'index.js')).find(file => fs.existsSync(file));
  if (!cli) throw new Error('Clasp non è disponibile nelle dipendenze del progetto.');
  const result = spawnSync(process.execPath, [cli, '--json', ...args], {
    cwd, encoding: 'utf8', windowsHide: true, timeout: 120000, maxBuffer: 8 * 1024 * 1024
  });
  if (result.error || result.status !== 0) {
    throw new Error('Comando Google non riuscito. Verificare lo stato prima di riprovare. ' + String(result.stderr || (result.error && result.error.message) || '').trim());
  }
  if (args[0] === 'pull' || args[0] === 'push') return null;
  try { return JSON.parse(result.stdout); }
  catch (_) { throw new Error('Risposta Google non leggibile. Verificare lo stato prima di riprovare.'); }
}

function parseOptions(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!/^--(?:stage|project|base|deployment|current|description)$/.test(key) || args[i + 1] === undefined) {
      throw new Error('Argomenti non validi.');
    }
    const name = key.slice(2);
    if (options[name] !== undefined) throw new Error('Argomento ripetuto: ' + key);
    options[name] = args[i + 1];
  }
  if (!options.stage || !options.project) throw new Error('Specificare la cartella privata e il progetto atteso.');
  return options;
}

if (require.main === module) {
  try {
    const command = process.argv[2];
    const options = parseOptions(process.argv.slice(3));
    if (command === 'prepare') {
      const receipt = prepareRelease(options, claspRunner);
      console.log('Versione ' + receipt.version + ' preparata e verificata. Nessun collegamento aggiornato.');
    } else if (command === 'promote') {
      const version = promoteRelease(options, claspRunner);
      console.log('Collegamento aggiornato e verificato alla versione ' + version + '.');
    } else {
      throw new Error('Usare prepare o promote.');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { prepareRelease, promoteRelease, snapshot };
