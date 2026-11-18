/* Kasse unterwegs (Handy-App). Daten bleiben im Handy; Abgleich mit dem Notebook über JSON-Datei und Belegfotos (Google Drive). */
'use strict';
const ES = {
  'Buchungen': 'Apuntes', 'Zahlen': 'Cifras', 'Abgleich': 'Sincronizar', 'Jahr': 'Año', 'Neue Buchung': 'Nuevo apunte', 'Buchung': 'Apunte', 'Einnahme': 'Ingreso', 'Ausgabe': 'Gasto',
  'Datum': 'Fecha', 'Betrag': 'Importe', 'Betrag ist': 'El importe es', 'brutto (mit IVA)': 'bruto (con IVA)', 'netto (ohne IVA)': 'neto (sin IVA)', 'IVA-Satz': 'Tipo de IVA', 'Partner (Kunde / Lieferant)': 'Contacto (cliente / proveedor)',
  'Rechnungsnummer': 'Nº de factura', 'Kategorie': 'Categoría', 'Land': 'País', 'Notiz': 'Nota', 'Belegfoto': 'Foto del justificante', 'Beleg aus Datei wählen oder fotografieren': 'Elegir archivo o hacer foto', 'Das Foto wird beim nächsten Sichern mitgesendet.': 'La foto se enviará en la próxima copia.', 'Foto gespeichert.': 'Foto guardado.', 'Foto wartet auf das Notebook': 'foto espera al portátil', 'Foto entfernen': 'Quitar foto',
  'Speichern': 'Guardar', 'Abbrechen': 'Cancelar', 'Schließen': 'Cerrar', 'Löschen': 'Borrar', 'Gespeichert.': 'Guardado.', 'Gelöscht.': 'Borrado.',
  'Das Datum ist ungültig.': 'La fecha no es válida.', 'Der Betrag muss größer als 0 sein.': 'El importe debe ser mayor que 0.', 'Dieses Quartal ist am Notebook abgeschlossen (deklariert). Hier kann nichts mehr eingetragen werden.': 'Este trimestre está cerrado (declarado) en el portátil. Aquí ya no se puede registrar nada.',
  'Vom Notebook – hier nur zum Ansehen.': 'Del portátil – aquí solo para consultar.', 'wartet auf das Notebook': 'espera al portátil', 'neu': 'nuevo', 'Beleg am Notebook': 'justificante en el portátil', 'Foto': 'foto', 'Quartal abgeschlossen': 'trimestre cerrado',
  'Keine Buchungen.': 'Sin apuntes.', 'Keine Daten vom Notebook im Handy. Du kannst trotzdem Buchungen erfassen; lade die Datei „kasse-daten.json“ unter „Abgleich“.': 'No hay datos del portátil en el móvil. Puedes registrar apuntes igualmente; carga el archivo «kasse-daten.json» en «Sincronizar».',
  'Schon gesichert – bitte am Notebook löschen.': 'Ya guardado y recibido en el portátil – bórralo allí.', 'Einnahmen (netto)': 'Ingresos (netos)', 'Ausgaben (netto)': 'Gastos (netos)', 'Gewinn': 'Rendimiento', 'IVA eingenommen': 'IVA repercutido', 'IVA bezahlt': 'IVA soportado', 'Buchungen insgesamt': 'apuntes en total',
  'Überschlag aus den Buchungen im Handy. Maßgeblich sind die Zahlen am Notebook.': 'Estimación con los apuntes del móvil. Valen las cifras del portátil.',
  'Sichern (nach Google Drive)': 'Guardar (en Google Drive)', 'Laden (vom Google Drive)': 'Cargar (desde Google Drive)', 'Das ist keine Datei der Kasse unterwegs.': 'Este archivo no es de la caja en marcha.', 'Die Datei konnte nicht gelesen werden.': 'No se pudo leer el archivo.',
  'Stand vom Notebook:': 'Datos del portátil:', 'noch nie geladen': 'nunca cargado', 'Zuletzt gesichert:': 'Última copia:', 'nie': 'nunca', 'Buchungen warten auf das Notebook': 'apuntes esperan al portátil', 'Fotos zum Mitsenden': 'fotos para enviar',
  'Sichern erzeugt eine Datei und die Belegfotos. Wähle in der Liste „Drive“ und den Ordner „Belege-Eingang“; das Notebook liest sie beim nächsten Abgleich ein.': 'Al guardar se crean un archivo y las fotos. Elija «Drive» y la carpeta «Belege-Eingang»; el portátil las leerá en la próxima sincronización.',
  'Laden öffnet die Dateiauswahl: nimm die Datei „kasse-daten.json“ aus dem Drive-Ordner „Belege-Eingang“.': 'Al cargar se abre el selector: elija «kasse-daten.json» de la carpeta «Belege-Eingang» de Drive.',
  'Datei gesichert.': 'Archivo guardado.', 'Nichts zu sichern.': 'Nada que guardar.', 'Geladen:': 'Cargado:', 'angekommen': 'recibidos', 'Fotos nicht angenommen: zu groß.': 'Foto no aceptada: demasiado grande.',
  'Von': 'De', 'bis': 'a', 'Alle Buchungen im Handy ansehen': 'Ver todos los apuntes'
};
const KATS = ['Förderung/Zuschuss', 'Rechnung', 'Bücher/KDP', 'Affiliate', 'Postkarten/Druck', 'Aufträge', 'Hosting/Domain', 'Software', 'Büro', 'Reise', 'Telefon/Internet', 'Sozialversicherung', 'Sonstiges', 'Unklar'];
const KES = { 'Förderung/Zuschuss': 'Subvención', 'Rechnung': 'Factura', 'Bücher/KDP': 'Libros/KDP', 'Affiliate': 'Afiliación', 'Postkarten/Druck': 'Postales/Impresión', 'Aufträge': 'Encargos', 'Hosting/Domain': 'Hosting/Dominio', 'Software': 'Software', 'Büro': 'Oficina', 'Reise': 'Viaje', 'Telefon/Internet': 'Teléfono/Internet', 'Sozialversicherung': 'Seguridad Social', 'Sonstiges': 'Otros', 'Unklar': 'Sin aclarar' };
let LANG = 'de'; try { LANG = localStorage.getItem('kb_lang') === 'es' ? 'es' : 'de'; } catch (e) { }
const t = s => LANG === 'es' && ES[s] ? ES[s] : s;
const tk = k => LANG === 'es' && KES[k] ? KES[k] : k;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const eur = v => Number(v).toLocaleString(LANG === 'es' ? 'es-ES' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const p2 = n => String(n).padStart(2, '0');
const heute = () => { const d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
const dm = d => d ? d.slice(8, 10) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4) : '';
const uid = () => [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
const qOf = d => Math.ceil(+d.slice(5, 7) / 3);
function msg(s, err) { const e = $('#toast'); e.textContent = s; e.className = err ? 'err' : ''; e.style.display = 'block'; clearTimeout(msg.t); msg.t = setTimeout(() => e.style.display = 'none', err ? 6000 : 2500); }
function validDate(d) { if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false; const x = new Date(d + 'T00:00:00Z'); return !isNaN(x) && x.toISOString().slice(0, 10) === d; }

/* ---------- Daten ---------- */
const leer = () => ({ master: null, eig: [], gesichert: 0 });
let D = (() => { try { const j = JSON.parse(localStorage.getItem('kb_data')); if (j && Array.isArray(j.eig)) return j; } catch (e) { } return leer(); })();
function save() { try { localStorage.setItem('kb_data', JSON.stringify(D)); } catch (e) { msg('Speichern im Handy nicht möglich.', 1); } }
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
const S = { tab: 'b', y: new Date().getFullYear(), q: 0 };
const zu = d => !!((D.master && D.master.abgeschlossen) || {})[d.slice(0, 4) + '-Q' + qOf(d)];
const alle = () => ((D.master && D.master.buchungen) || []).map(b => ({ ...b, _m: 1 })).concat(D.eig.map(b => ({ ...b, _m: 0 })));
const netto = b => Math.round(b.brutto / (1 + b.iva_satz / 100) * 100) / 100;

/* ---------- Fotos (IndexedDB) ---------- */
const idb = () => new Promise((res, rej) => { const r = indexedDB.open('kasse', 1); r.onupgradeneeded = () => r.result.createObjectStore('fotos'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const idbDo = (mode, f) => idb().then(d => new Promise((res, rej) => { const tx = d.transaction('fotos', mode), st = tx.objectStore('fotos'), q = f(st); tx.oncomplete = () => res(q && q.result); tx.onerror = () => rej(tx.error); }));
const fget = u => idbDo('readonly', s => s.get(u)).catch(() => null);
const fput = (u, b) => idbDo('readwrite', s => s.put(b, u));
const fdel = u => idbDo('readwrite', s => s.delete(u)).catch(() => { });
const fkeys = () => idbDo('readonly', s => s.getAllKeys()).then(k => k || []).catch(() => []);
function verkleinern(file) {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')) return Promise.resolve(file.type === 'application/pdf' ? file : new Blob([file], { type: 'application/pdf' }));
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const m = 1600, k = Math.min(1, m / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); c.toBlob(b => b ? res(b) : rej(new Error('Foto')), 'image/jpeg', 0.72);
    };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Foto')); };
    im.src = url;
  });
}

/* ---------- Abgleich ---------- */
function mergeMaster(j) {
  if (!j || j.format !== 'steuergali-kasse' || j.von !== 'notebook') throw new Error(t('Das ist keine Datei der Kasse unterwegs.'));
  D.master = { stand: j.stand || Date.now(), geladen: Date.now(), kategorien: Array.isArray(j.kategorien) && j.kategorien.length ? j.kategorien : KATS, abgeschlossen: j.abgeschlossen || {}, buchungen: j.buchungen || [], geloescht: j.geloescht || [] };
  const im = new Map(D.master.buchungen.map(b => [b.uid, b])), weg = new Set(D.master.geloescht.map(x => x.uid));
  let ang = 0;
  D.eig = D.eig.filter(b => { if (im.has(b.uid)) { ang++; return false; } return !weg.has(b.uid); });
  save();
  return fkeys().then(ks => Promise.all(ks.map(u => { const m = im.get(u); return (m && m.beleg) || weg.has(u) ? fdel(u) : null; }))).then(() => ang);
}
async function laden(inp) {
  const f = inp.files[0]; inp.value = ''; if (!f) return;
  try { const j = JSON.parse(await f.text()); const ang = await mergeMaster(j); msg(`${t('Geladen:')} ${D.master.buchungen.length} ${t('Buchungen')}, ${ang} ${t('angekommen')}`); go(S.tab); }
  catch (e) { msg(e instanceof SyntaxError ? t('Die Datei konnte nicht gelesen werden.') : e.message, 1); }
}
async function sichern() {
  const im = new Set(((D.master && D.master.buchungen) || []).filter(b => b.beleg).map(b => b.uid));
  const ks = (await fkeys()).filter(u => !im.has(u) && (D.eig.some(b => b.uid === u) || ((D.master && D.master.buchungen) || []).some(b => b.uid === u)));
  if (!D.eig.length && !ks.length) { msg(t('Nichts zu sichern.')); return; }
  const d = new Date(), fn = `kasse-handy-${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.json`;
  const out = { format: 'steuergali-kasse', version: 1, von: 'handy', stand: Date.now(), buchungen: D.eig.map(({ foto, geteilt, ...b }) => b) };
  const files = [new File([JSON.stringify(out)], fn, { type: 'application/json' })];
  for (const u of ks) { const b = await fget(u); if (b) { const pdf = b.type === 'application/pdf'; files.push(new File([b], `beleg-${u}.${pdf ? 'pdf' : 'jpg'}`, { type: pdf ? 'application/pdf' : 'image/jpeg' })); } }
  try {
    if (navigator.canShare && navigator.canShare({ files })) await navigator.share({ files, title: fn });
    else for (const f of files) { const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); await new Promise(r => setTimeout(r, 400)); URL.revokeObjectURL(a.href); a.remove(); }
    D.gesichert = Date.now(); D.eig.forEach(b => b.geteilt = D.gesichert); save(); msg(t('Datei gesichert.')); go(S.tab);
  } catch (e) { if (e && e.name !== 'AbortError') msg(String(e.message || e), 1); }
}

/* ---------- Oberfläche ---------- */
const TABS = [['b', 'Buchungen'], ['z', 'Zahlen'], ['y', 'Abgleich']];
function chrome() {
  $('#nv').innerHTML = TABS.map(([k, n]) => `<button class="${S.tab === k ? 'on' : ''}" onclick="go('${k}')">${t(n)}</button>`).join('');
  $('#lg').innerHTML = `<button class="${LANG === 'de' ? 'on' : ''}" onclick="sprache('de')">DE</button> <button class="${LANG === 'es' ? 'on' : ''}" onclick="sprache('es')">ES</button>`;
  $('#hs').textContent = alle().length + ' ' + t('Buchungen insgesamt');
}
function sprache(l) { LANG = l; try { localStorage.setItem('kb_lang', l); } catch (e) { } document.documentElement.lang = l; go(S.tab); }
function go(tab) { S.tab = tab; chrome(); ({ b: vB, z: vZ, y: vY })[tab](); scrollTo(0, 0); }
function yrOpts() { let h = ''; for (let y = 2023; y <= new Date().getFullYear() + 1; y++) h += `<option ${y === S.y ? 'selected' : ''}>${y}</option>`; return h; }
const chips = () => `<div class="chips">${[[0, t('Jahr')], [1, 'Q1'], [2, 'Q2'], [3, 'Q3'], [4, 'Q4']].map(([q, n]) => `<button class="${S.q === q ? 'on' : ''}" onclick="S.q=${q};go(S.tab)">${n}</button>`).join('')}</div>`;

async function vB() {
  const fk = new Set(await fkeys());
  const rows = alle().filter(b => b.datum.slice(0, 4) == S.y && (!S.q || qOf(b.datum) === S.q)).sort((a, b) => b.datum.localeCompare(a.datum) || (b.geaendert || 0) - (a.geaendert || 0));
  $('#m').innerHTML = `<div class="half"><select onchange="S.y=+this.value;go('b')">${yrOpts()}</select><button class="btn" onclick="edit('')">+ ${t('Neue Buchung')}</button></div>${chips()}` +
    (D.master ? '' : `<div class="sum">${t('Keine Daten vom Notebook im Handy. Du kannst trotzdem Buchungen erfassen; lade die Datei „kasse-daten.json“ unter „Abgleich“.')}</div>`) +
    (rows.length ? rows.map(b => `<div class="card" onclick="edit('${b.uid}')"><div class="l"><b>${esc(b.partner || tk(b.kategorie) || '–')}</b>
      <div class="mu">${dm(b.datum)} · ${esc(tk(b.kategorie) || '')}${b.iva_satz != 21 ? ' · ' + b.iva_satz + ' %' : ''}</div>
      <div>${b._m ? (b.beleg ? `<span class="tag">📎 ${t('Beleg am Notebook')}</span>` : (fk.has(b.uid) ? `<span class="tag w">📷 ${t('Foto wartet auf das Notebook')}</span>` : '')) : `<span class="tag w">${b.geteilt ? t('wartet auf das Notebook') : t('neu')}</span>${b.foto ? `<span class="tag">📷</span>` : ''}`}${zu(b.datum) ? `<span class="tag">🔒</span>` : ''}</div></div>
      <div class="r ${b.typ === 'einnahme' ? 'ein' : 'aus'}">${b.typ === 'einnahme' ? '+' : '−'}${eur(b.brutto)}</div></div>`).join('') : `<div class="mu">${t('Keine Buchungen.')}</div>`);
}

function vZ() {
  const rows = alle().filter(b => b.datum.slice(0, 4) == S.y && (!S.q || qOf(b.datum) === S.q));
  const s = { ein: 0, aus: 0, ive: 0, iva: 0 };
  rows.forEach(b => { const n = netto(b), v = Math.round((b.brutto - n) * 100) / 100; if (b.typ === 'einnahme') { s.ein += n; s.ive += v; } else { s.aus += n; s.iva += v; } });
  const kt = {}; rows.forEach(b => { const k = b.kategorie || '–'; kt[k] = (kt[k] || 0) + (b.typ === 'einnahme' ? 1 : -1) * netto(b); });
  $('#m').innerHTML = `<select onchange="S.y=+this.value;go('z')">${yrOpts()}</select>${chips()}
   <div class="card" style="display:block"><table><tr><td>${t('Einnahmen (netto)')}</td><td class="n ein">${eur(s.ein)}</td></tr><tr><td>${t('Ausgaben (netto)')}</td><td class="n aus">${eur(s.aus)}</td></tr>
   <tr><td><b>${t('Gewinn')}</b></td><td class="n"><b>${eur(s.ein - s.aus)}</b></td></tr><tr><td>${t('IVA eingenommen')}</td><td class="n">${eur(s.ive)}</td></tr><tr><td>${t('IVA bezahlt')}</td><td class="n">${eur(s.iva)}</td></tr></table></div>
   <div class="card" style="display:block"><table>${Object.keys(kt).sort().map(k => `<tr><td>${esc(tk(k))}</td><td class="n">${eur(kt[k])}</td></tr>`).join('')}</table></div>
   <div class="mu">${t('Überschlag aus den Buchungen im Handy. Maßgeblich sind die Zahlen am Notebook.')}</div>`;
}

async function vY() {
  const ks = await fkeys(), st = D.master ? new Date(D.master.stand).toLocaleString(LANG === 'es' ? 'es-ES' : 'de-DE') : t('noch nie geladen'), gs = D.gesichert ? new Date(D.gesichert).toLocaleString(LANG === 'es' ? 'es-ES' : 'de-DE') : t('nie');
  const offen = D.eig.length, fotos = ks.filter(u => D.eig.some(b => b.uid === u) || ((D.master && D.master.buchungen) || []).some(b => b.uid === u && !b.beleg)).length;
  $('#m').innerHTML = `<div class="sum">${t('Stand vom Notebook:')} <b>${st}</b><br>${t('Zuletzt gesichert:')} <b>${gs}</b><br><b>${offen}</b> ${t('Buchungen warten auf das Notebook')} · <b>${fotos}</b> ${t('Fotos zum Mitsenden')}</div>
   <div class="row"><button class="btn" onclick="sichern()">${t('Sichern (nach Google Drive)')}</button></div><div class="mu">${t('Sichern erzeugt eine Datei und die Belegfotos. Wähle in der Liste „Drive“ und den Ordner „Belege-Eingang“; das Notebook liest sie beim nächsten Abgleich ein.')}</div>
   <div class="row"><label class="btn alt" style="margin:0">${t('Laden (vom Google Drive)')}<input type="file" style="display:none" onchange="laden(this)"></label></div><div class="mu">${t('Laden öffnet die Dateiauswahl: nimm die Datei „kasse-daten.json“ aus dem Drive-Ordner „Belege-Eingang“.')}</div>`;
}

/* ---------- Buchung erfassen / ansehen ---------- */
let F = null;
function oc() { const o = $('#ov'); o.style.display = 'none'; o.innerHTML = ''; document.body.style.overflow = ''; }
function ov(h) { const o = $('#ov'); o.innerHTML = `<div class="sheet">${h}</div>`; o.style.display = 'block'; document.body.style.overflow = 'hidden'; o.scrollTop = 0; }
async function edit(u) {
  const alt = u ? alle().find(b => b.uid === u) : null;
  if (alt && alt._m) {
    const h = await fget(u); F = { uid: u, m: 1 };
    ov(`<h2>${t('Buchung')}</h2><div class="card" style="display:block"><b class="${alt.typ === 'einnahme' ? 'ein' : 'aus'}">${alt.typ === 'einnahme' ? '+' : '−'}${eur(alt.brutto)}</b><div class="mu">${dm(alt.datum)} · ${alt.iva_satz} % IVA · ${esc(alt.land)}</div><div>${esc(alt.partner)}</div><div class="mu">${esc(tk(alt.kategorie))}${alt.rechnungsnr ? ' · ' + esc(alt.rechnungsnr) : ''}</div><div>${esc(alt.notiz)}</div></div>
     <div class="mu">${t('Vom Notebook – hier nur zum Ansehen.')}</div>
     <label>${t('Belegfoto')}</label>${alt.beleg ? `<div class="mu">📎 ${t('Beleg am Notebook')}</div>` : `<div class="row"><label class="btn alt" style="margin:0">📷 ${t('Beleg aus Datei wählen oder fotografieren')}<input type="file" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp" style="display:none" onchange="fotoMaster(this)"></label><button class="btn del s" id="f-fw" onclick="fotoMasterWeg()" style="display:none">${t('Foto entfernen')}</button></div><img id="f-img" class="foto" style="display:none" alt=""><div class="mu" id="f-hint" style="display:none">${t('Das Foto wird beim nächsten Sichern mitgesendet.')}</div>`}
     <div class="row"><button class="btn alt" onclick="oc();go('b')">${t('Schließen')}</button></div>`);
    if (h && !alt.beleg) { zeigFoto(h); const x = $('#f-hint'); if (x) x.style.display = 'block'; }
    return;
  }
  F = { uid: alt ? alt.uid : uid(), neu: !alt, typ: alt ? alt.typ : 'ausgabe', blob: null, hatFoto: !!(alt && alt.foto), weg: false };
  const b = alt || { datum: heute(), brutto: '', iva_satz: 21, partner: '', rechnungsnr: '', kategorie: '', land: 'ES', notiz: '' };
  const kats = (D.master && D.master.kategorien) || KATS, parts = [...new Set(alle().map(x => x.partner).filter(Boolean))].sort();
  ov(`<h2>${alt ? t('Buchung') : t('Neue Buchung')}</h2>
   <div class="art"><button id="a-a" class="a ${F.typ === 'ausgabe' ? 'on' : ''}" onclick="art('ausgabe')">${t('Ausgabe')}</button><button id="a-e" class="e ${F.typ === 'einnahme' ? 'on' : ''}" onclick="art('einnahme')">${t('Einnahme')}</button></div>
   <label>${t('Datum')}</label><input type="date" id="f-d" value="${esc(b.datum)}">
   <div class="half"><div><label>${t('Betrag')}</label><input id="f-b" inputmode="decimal" placeholder="0,00" value="${b.brutto === '' ? '' : String(b.brutto).replace('.', ',')}"></div>
   <div><label>${t('Betrag ist')}</label><select id="f-bn"><option value="b">${t('brutto (mit IVA)')}</option><option value="n">${t('netto (ohne IVA)')}</option></select></div></div>
   <div class="half"><div><label>${t('IVA-Satz')}</label><select id="f-i">${[21, 10, 4, 0].map(i => `<option value="${i}" ${+b.iva_satz === i ? 'selected' : ''}>${i} %</option>`).join('')}</select></div>
   <div><label>${t('Land')}</label><select id="f-l">${['ES', 'EU', 'Drittland'].map(i => `<option ${b.land === i ? 'selected' : ''}>${i}</option>`).join('')}</select></div></div>
   <label>${t('Partner (Kunde / Lieferant)')}</label><input id="f-p" list="f-pl" value="${esc(b.partner)}"><datalist id="f-pl">${parts.map(p => `<option value="${esc(p)}">`).join('')}</datalist>
   <label>${t('Kategorie')}</label><select id="f-k"><option value=""></option>${kats.map(k => `<option value="${esc(k)}" ${b.kategorie === k ? 'selected' : ''}>${esc(tk(k))}</option>`).join('')}</select>
   <label>${t('Rechnungsnummer')}</label><input id="f-r" value="${esc(b.rechnungsnr)}">
   <label>${t('Notiz')}</label><textarea id="f-n">${esc(b.notiz)}</textarea>
   <label>${t('Belegfoto')}</label><div class="row"><label class="btn alt" style="margin:0">📷 ${t('Beleg aus Datei wählen oder fotografieren')}<input type="file" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp" style="display:none" onchange="fotoWahl(this)"></label><button class="btn del s" id="f-fw" onclick="fotoWeg()" style="display:none">${t('Foto entfernen')}</button></div><img id="f-img" class="foto" style="display:none" alt="">
   <div class="row" style="margin-top:18px"><button class="btn" onclick="eSave()">${t('Speichern')}</button><button class="btn alt" onclick="oc()">${t('Abbrechen')}</button>${alt ? `<button class="btn del" onclick="eDel()">${t('Löschen')}</button>` : ''}</div>`);
  if (F.hatFoto) fget(F.uid).then(bl => { if (bl) zeigFoto(bl); });
}
async function fotoMaster(inp) {
  const f = inp.files[0]; inp.value = ''; if (!f) return;
  try { const bl = await verkleinern(f); if (bl.size > 14 * 1024 * 1024) { msg(t('Fotos nicht angenommen: zu groß.'), 1); return; } await fput(F.uid, bl); zeigFoto(bl); const x = $('#f-hint'); if (x) x.style.display = 'block'; msg(t('Foto gespeichert.')); } catch (e) { msg('Foto: ' + e.message, 1); }
}
async function fotoMasterWeg() { await fdel(F.uid); const i = $('#f-img'); i.style.display = 'none'; const pp = $('#f-pdf'); if (pp) pp.style.display = 'none'; $('#f-fw').style.display = 'none'; const x = $('#f-hint'); if (x) x.style.display = 'none'; }
function art(x) { F.typ = x; $('#a-a').classList.toggle('on', x === 'ausgabe'); $('#a-e').classList.toggle('on', x === 'einnahme'); }
function zeigFoto(bl) { const i = $('#f-img'); if (!i) return; $('#f-fw').style.display = ''; let p = $('#f-pdf'); if (!p) { p = document.createElement('div'); p.id = 'f-pdf'; p.className = 'mu'; p.style.cssText = 'font-size:16px;margin:8px 0'; i.parentNode.insertBefore(p, i); } if (bl.type === 'application/pdf') { i.style.display = 'none'; p.textContent = '📄 PDF-Beleg angehängt'; p.style.display = 'block'; return; } p.style.display = 'none'; if (i.src) URL.revokeObjectURL(i.src); i.src = URL.createObjectURL(bl); i.style.display = 'block'; }
async function fotoWahl(inp) {
  const f = inp.files[0]; inp.value = ''; if (!f) return;
  try { const bl = await verkleinern(f); if (bl.size > 14 * 1024 * 1024) { msg(t('Fotos nicht angenommen: zu groß.'), 1); return; } F.blob = bl; F.weg = false; zeigFoto(bl); } catch (e) { msg('Foto: ' + e.message, 1); }
}
function fotoWeg() { F.blob = null; F.weg = true; const i = $('#f-img'); i.style.display = 'none'; const pp = $('#f-pdf'); if (pp) pp.style.display = 'none'; $('#f-fw').style.display = 'none'; }
async function eSave() {
  const d = $('#f-d').value, iva = +$('#f-i').value;
  let rb = $('#f-b').value.trim(); if (rb.includes(',')) rb = rb.replace(/\./g, '').replace(',', '.');
  let br = parseFloat(rb);
  if (!validDate(d)) { msg(t('Das Datum ist ungültig.'), 1); return; }
  if (!(br > 0)) { msg(t('Der Betrag muss größer als 0 sein.'), 1); return; }
  if ($('#f-bn').value === 'n') br = br * (1 + iva / 100);
  br = Math.round(br * 100) / 100;
  if (zu(d)) { msg(t('Dieses Quartal ist am Notebook abgeschlossen (deklariert). Hier kann nichts mehr eingetragen werden.'), 1); return; }
  const o = { uid: F.uid, datum: d, typ: F.typ, brutto: br, iva_satz: iva, partner: $('#f-p').value.trim(), rechnungsnr: $('#f-r').value.trim(), kategorie: $('#f-k').value, land: $('#f-l').value, notiz: $('#f-n').value.trim(), geaendert: Date.now() };
  const i = D.eig.findIndex(b => b.uid === F.uid), alt = i >= 0 ? D.eig[i] : null;
  o.geteilt = alt ? alt.geteilt || 0 : 0;
  o.foto = F.blob ? 1 : (F.weg ? 0 : (alt && alt.foto ? 1 : 0));
  try { if (F.blob) await fput(F.uid, F.blob); else if (F.weg) await fdel(F.uid); } catch (e) { msg('Foto konnte nicht im Handy gespeichert werden.', 1); return; }
  if (i >= 0) D.eig[i] = o; else D.eig.push(o);
  save(); oc(); msg(t('Gespeichert.')); S.y = +d.slice(0, 4); go('b');
}
async function eDel() {
  const b = D.eig.find(x => x.uid === F.uid); if (!b) { oc(); return; }
  if (b.geteilt) { msg(t('Schon gesichert – bitte am Notebook löschen.'), 1); return; }
  D.eig = D.eig.filter(x => x.uid !== F.uid); await fdel(F.uid); save(); oc(); msg(t('Gelöscht.')); go('b');
}
document.documentElement.lang = LANG;
go('b');
