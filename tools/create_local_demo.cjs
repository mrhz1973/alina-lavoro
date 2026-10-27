/* Build a standalone preview with a local simulated backend and no network.
   Usage: node tools/create_local_demo.cjs OUTPUT_HTML [PRIVATE_CONFIG_JSON] */
const fs = require('node:fs');
const path = require('node:path');

const output = process.argv[2];
if (!output) throw new Error('An output HTML path is required');
const configPath = process.argv[3];
const config = configPath ? JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, '')) : {
  nome_lavoro_variabile: 'Attivita A', nome_lavoro_programmato: 'Attivita B',
  operatore_registro: 'Operatore di prova',
  programma_1_inizio: '07:00', programma_1_fine: '09:30',
  programma_2_inizio: '14:00', programma_2_fine: '15:30'
};
const oldScheduledNames = Array.isArray(config._preview_previous_scheduled_names) ? config._preview_previous_scheduled_names : [];
delete config._preview_previous_scheduled_names;
const project = path.join(__dirname, '..');
let index = fs.readFileSync(path.join(project, 'src/frontend/Index.html'), 'utf8');
const moduleHtml = fs.readFileSync(path.join(project, 'src/frontend/ScheduledWork.html'), 'utf8');
const marker = '<!-- SCHEDULED_WORK_MODULE -->';
if (index.split(marker).length !== 2) throw new Error('The module marker is missing or duplicated');
index = index.replace(marker, moduleHtml);
[
  'alina_lavoro_cache_v1', 'alina_lavoro_queue_v1', 'alina_lavoro_access_v1',
  'alina_lavoro_salary_reminder_snooze_until_v1', 'alina_selected_workplace_v1',
  'alina_workplace_locations_v1', 'alina_geolocation_prompted_v1'
].forEach(key => { index = index.split(key).join('demo_' + key); });

const oldCall = "function serverCall(fn,args=[]){return new Promise((resolve,reject)=>{if(typeof google==='undefined'||!google.script||!google.script.run){reject(new Error('google.script.run non disponibile'));return}google.script.run.withSuccessHandler(resolve).withFailureHandler(reject)[fn](...args)})}";
if (index.split(oldCall).length !== 2) throw new Error('The expected serverCall function was not found');
index = index.replace(oldCall, 'function serverCall(fn,args=[]){return localDemoServerCall_(fn,args)}');
const seed = JSON.stringify(config).replace(/</g, '\\u003c');
const oldNames = JSON.stringify(oldScheduledNames).replace(/</g, '\\u003c');
const mock = [
  '<script>',
  'var localDemoSeed_ = ' + seed + ';',
  'var localDemoOldScheduledNames_ = ' + oldNames + ';',
  "var localDemoKey_ = 'alina_demo_backend_v2';",
  'function localDemoRead_(){',
  "  try { var s=JSON.parse(localStorage.getItem(localDemoKey_)||'null'); if(s){",
  "    var changed=false; s.config=s.config||{};",
  "    if(localDemoOldScheduledNames_.indexOf(s.config.nome_lavoro_programmato)>=0){s.config.nome_lavoro_programmato=localDemoSeed_.nome_lavoro_programmato;changed=true;}",
  "    ['aree_variabile_json','aree_programmata_json'].forEach(function(k){if(Object.prototype.hasOwnProperty.call(localDemoSeed_,k)&&s.config[k]!==localDemoSeed_[k]){s.config[k]=localDemoSeed_[k];changed=true;}});",
  "    if(changed)localStorage.setItem(localDemoKey_,JSON.stringify(s));return s; } } catch(_){}",
  "  return {config:Object.assign({lingua:'it',tema:'light',stile:'modern',giorno_busta:'10',media_mesi:'6',tariffa_media_default:'10',setup_completato:'yes'},localDemoSeed_),shifts:[],scheduledShifts:[],salaries:[],notes:[],summaries:[],reminder:{active:false},capabilities:{scheduledWork:1},operations:{}};",
  '}',
  'function localDemoUpsert_(rows,row){var i=rows.findIndex(function(x){return String(x.id)===String(row.id)});if(i<0)rows.push(row);else rows[i]=row;}',
  'async function localDemoServerCall_(fn,args){',
  '  var data=localDemoRead_();',
  "  if(fn==='getBootstrap')return {success:true,data:data};",
  "  if(fn==='syncBatch'){",
  '    var actions=args[1]||[];',
  '    actions.forEach(function(action){',
  "      if(action.type==='saveScheduledShift'){",
  '        if(data.operations[action.operationId])return;',
  '        var old=data.scheduledShifts.find(function(x){return String(x.id)===String(action.payload.id)});',
  "        if(Number(action.payload.revisione)!==(old?Number(old.revisione):0)+1)throw new Error('Conflitto demo');",
  '        localDemoUpsert_(data.scheduledShifts,action.payload);data.operations[action.operationId]=true;',
  "      } else if(action.type==='saveShift')localDemoUpsert_(data.shifts,action.payload);",
  "      else if(action.type==='saveSalary')localDemoUpsert_(data.salaries,action.payload);",
  "      else if(action.type==='saveNote')localDemoUpsert_(data.notes,action.payload);",
  "      else if(action.type==='deleteNote')data.notes=data.notes.filter(function(x){return x.id!==action.payload.id});",
  "      else if(action.type==='saveConfig')Object.assign(data.config,action.payload||{});",
  "      else throw new Error('Operazione non disponibile nella prova');",
  '    });',
  '    data.summaries=state.summaries||[];localStorage.setItem(localDemoKey_,JSON.stringify(data));return {success:true,data:data};',
  '  }',
  "  if(fn==='exportAllData')return {success:true,data:{alinaBackup:true,format:'demo',shifts:data.shifts,scheduledShifts:data.scheduledShifts,salaries:data.salaries,notes:data.notes,config:data.config}};",
  "  throw new Error('Funzione non disponibile nella prova locale');",
  '}',
  '</script>'
].join('\n');
index = index.replace('<head>\n', '<head>\n<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data: blob:; connect-src \'none\'; form-action \'none\'">\n' + mock + '\n');
index = index.replace('<body>', '<body>\n<div role="status" style="position:sticky;top:0;z-index:9999;background:#fff2be;color:#302500;padding:10px 16px;text-align:center;font:600 14px system-ui">ANTEPRIMA LOCALE — Dati di prova solo in questo browser. Non collegata all’app o al foglio reali.</div>');
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, index, 'utf8');
console.log('Anteprima locale creata: ' + output);
