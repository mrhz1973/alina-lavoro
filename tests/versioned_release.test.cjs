const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { prepareRelease, promoteRelease } = require('../tools/versioned_release.cjs');

const project = 'synthetic-project';
const template = [
  "<script>const APP_VERSION='17';</script>",
  '<p class="app-version">Versione: ${APP_VERSION}</p>'
].join('\n');

function createStage(t) {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const dir = fs.mkdtempSync(path.join(tempRoot, 'alina-release-test-'));
  t.after(() => {
    const real = fs.realpathSync(dir);
    assert.equal(path.dirname(real), tempRoot);
    assert.ok(path.basename(real).startsWith('alina-release-test-'));
    fs.rmSync(real, { recursive: true });
  });
  fs.writeFileSync(path.join(dir, '.clasp.json'), JSON.stringify({ scriptId: project }));
  fs.writeFileSync(path.join(dir, 'Index.html'), template);
  fs.writeFileSync(path.join(dir, 'Code.js'), 'function example() {}');
  fs.writeFileSync(path.join(dir, 'appsscript.json'), '{}');
  return dir;
}

function readFiles(dir) {
  return Object.fromEntries(['Index.html', 'Code.js', 'appsscript.json'].map(name => [name, fs.readFileSync(path.join(dir, name), 'utf8')]));
}

function fakeGoogle(stage) {
  const original = readFiles(stage);
  const state = {
    head: { ...original }, versions: new Map([[17, { ...original }]]),
    deployments: new Map([['preview', 17], ['live', 17]]), calls: [], concurrentVersion: false, badSnapshot: false
  };
  function run(args, cwd) {
    state.calls.push(args[0]);
    if (args[0] === 'pull') {
      const index = args.indexOf('--versionNumber');
      const files = index < 0 ? state.head : state.versions.get(Number(args[index + 1]));
      if (!files) throw new Error('Unknown synthetic version');
      for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(cwd, name), content);
      return null;
    }
    if (args[0] === 'versions') return [...state.versions.keys()].reverse().map(versionNumber => ({ versionNumber }));
    if (args[0] === 'push') { state.head = readFiles(cwd); return null; }
    if (args[0] === 'version') {
      if (state.concurrentVersion) {
        state.concurrentVersion = false;
        state.versions.set(Math.max(...state.versions.keys()) + 1, { ...state.head });
      }
      const versionNumber = Math.max(...state.versions.keys()) + 1;
      const captured = { ...state.head };
      if (state.badSnapshot) captured['Code.js'] = 'different code';
      state.versions.set(versionNumber, captured);
      return { versionNumber };
    }
    if (args[0] === 'list-deployments') {
      return [...state.deployments].map(([deploymentId, versionNumber]) => ({ deploymentId, versionNumber }));
    }
    if (args[0] === 'deploy') {
      const deploymentId = args[args.indexOf('--deploymentId') + 1];
      const versionNumber = Number(args[args.indexOf('--versionNumber') + 1]);
      state.deployments.set(deploymentId, versionNumber);
      return { deploymentId, versionNumber };
    }
    throw new Error('Unexpected synthetic command ' + args[0]);
  }
  return { state, run };
}

function prepare(stage, run) {
  return prepareRelease({ stage, project, base: 17, description: 'Synthetic release' }, run);
}
function promote(stage, run, deployment, current = 17) {
  return promoteRelease({ stage, project, deployment, current, description: 'Synthetic release' }, run);
}

test('preparation stamps the assigned version and promotion reuses that version for each target', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  const receipt = prepare(stage, run);
  assert.equal(receipt.version, 18);
  assert.match(state.versions.get(18)['Index.html'], /APP_VERSION='18'/);
  assert.equal(state.deployments.get('live'), 17);
  assert.equal(promote(stage, run, 'preview'), 18);
  assert.equal(state.deployments.get('preview'), 18);
  assert.equal(state.deployments.get('live'), 17);
  assert.equal(promote(stage, run, 'live'), 18);
  assert.equal(state.deployments.get('live'), 18);
});

test('changes already made on the remote project stop preparation before a write', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  state.head['Code.js'] = 'independent remote edit';
  assert.throws(() => prepare(stage, run), /modifiche successive/);
  assert.equal(state.head['Code.js'], 'independent remote edit');
  assert.ok(!state.calls.includes('push'));
  assert.ok(!fs.existsSync(path.join(stage, '.versioned-release.json')));
});

test('a concurrently assigned version is never promoted with a mismatched label', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  state.concurrentVersion = true;
  const receipt = prepare(stage, run);
  assert.equal(receipt.version, 20);
  assert.match(state.versions.get(19)['Index.html'], /APP_VERSION='18'/);
  assert.match(state.versions.get(20)['Index.html'], /APP_VERSION='20'/);
  assert.equal(state.deployments.get('live'), 17);
  assert.equal(promote(stage, run, 'preview'), 20);
});

test('a different saved snapshot prevents either deployment and keeps a pending receipt', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  state.badSnapshot = true;
  assert.throws(() => prepare(stage, run), /non coincide/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(stage, '.versioned-release.json'), 'utf8')).status, 'preparing');
  assert.throws(() => promote(stage, run, 'live'), /Versione preparata|non è completa/);
  assert.ok(!state.calls.includes('deploy'));
  assert.equal(state.deployments.get('live'), 17);
});

test('a modified staging copy or unexpectedly updated target blocks promotion', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  prepare(stage, run);
  fs.appendFileSync(path.join(stage, 'Code.js'), '\nmodified');
  assert.throws(() => promote(stage, run, 'preview'), /modificata/);
  fs.writeFileSync(path.join(stage, 'Code.js'), 'function example() {}');
  state.deployments.set('preview', 18);
  assert.throws(() => promote(stage, run, 'preview'), /collegamento è cambiato/);
  assert.ok(!state.calls.includes('deploy'));
});

test('a lost version response leaves the receipt pending and never promotes automatically', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  const interrupted = (args, cwd) => {
    const result = run(args, cwd);
    if (args[0] === 'version') throw new Error('Synthetic lost response');
    return result;
  };
  assert.throws(() => prepare(stage, interrupted), /lost response/);
  assert.equal(state.versions.has(18), true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(stage, '.versioned-release.json'), 'utf8')).status, 'preparing');
  assert.throws(() => promote(stage, run, 'live'), /Versione preparata|non è completa/);
  assert.throws(() => prepare(stage, run), /modifiche successive/);
  assert.equal(state.deployments.get('live'), 17);
  assert.ok(!state.calls.includes('deploy'));
});

test('a wrong project identifier or missing visible label cannot be published', t => {
  const stage = createStage(t), { state, run } = fakeGoogle(stage);
  assert.throws(() => prepareRelease({ stage, project: 'other', base: 17, description: 'Synthetic' }, run), /non corrisponde/);
  assert.deepEqual(state.calls, []);
  fs.writeFileSync(path.join(stage, 'Index.html'), "<script>const APP_VERSION='17';</script>");
  assert.throws(() => prepare(stage, run), /impostazioni/);
  assert.ok(!state.calls.includes('push'));
});

test('private staging inside the repository is rejected before any Google call', () => {
  let calls = 0;
  assert.throws(
    () => prepareRelease({ stage: path.join(__dirname, '..'), project, base: 17, description: 'Synthetic' }, () => { calls++; }),
    /esterna al repository/
  );
  assert.equal(calls, 0);
});
