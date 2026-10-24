#!/usr/bin/env node
/**
 * Onurcar kalıcı bakım + iade notu yaması
 * Sabit PC'de Vite proje kökünde çalıştırın:
 *   node fix-onurcar-bakim.mjs
 * veya:
 *   node fix-onurcar-bakim.mjs "C:\Users\...\Desktop\projeler\rent-acar-app"
 *
 * Deploy ETMEZ. Düzeltmeden sonra siz onurcar production deploy edin.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(process.argv[2] || process.cwd());
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const SKIP = new Set(["node_modules", "dist", "build", ".git", ".next", "coverage"]);

const report = [];
function log(msg) {
  report.push(msg);
  console.log(msg);
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (EXTS.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}

function writeIfChanged(file, before, after, label) {
  if (before === after) return false;
  fs.writeFileSync(file, after, "utf8");
  log(`OK  ${label}: ${path.relative(ROOT, file)}`);
  return true;
}

/** 1) Ni otomatik Periyodik Bakım — yalnızca maintenanceEdited iken çalışsın */
function patchAutoMaintenance(src, file) {
  let s = src;
  let n = 0;

  // Yaygın çağrı: lastServiceKm > 0 && !x.maintenanceEdited → history = ensure...( )
  const patterns = [
    // if (v > 0 && patch.maintenanceEdited !== true) { finance.history = ...
    {
      re: /([^\n]*?)(lastServiceKm|v|nextLast|lastKm)\s*>\s*0\s*&&\s*!?\s*([A-Za-z0-9_?.]+)\.maintenanceEdited\s*!==\s*true\s*&&\s*\(/g,
      // too broad — handle below
    },
  ];

  // Doğrudan: && !xxx.maintenanceEdited && (history = fn(
  // veya: && xxx.maintenanceEdited !== true &&
  // Değiştir: otomatik eklemeyi kapat — koşulu false yap (maintenanceEdited === true zorunlu)
  const reGate =
    /(\b(?:v|lastServiceKm|lastKm|nextLast)\b\s*>\s*0\s*&&\s*)((?:[A-Za-z0-9_$?[\].]+)\.maintenanceEdited\s*!==\s*(?:!0|true)|!(?:[A-Za-z0-9_$?[\].]+)\.maintenanceEdited)(\s*&&)/g;
  const next = s.replace(reGate, (m, a, cond, and) => {
    n++;
    // Sadece gerçek bakım düzenlemesinde çalışsın
    return `${a}${(cond.includes("!==") ? cond.replace("!==", "===") : cond.replace(/^!/, "") + " === true").replace("=== true === true", "=== true")}${and}`;
  });
  // Simpler explicit replacements for common unminified forms
  const reps = [
    [
      /&&\s*!([A-Za-z0-9_$.?]+)\.maintenanceEdited\s*&&/g,
      "&& $1.maintenanceEdited === true &&",
    ],
    [
      /&&\s*([A-Za-z0-9_$.?]+)\.maintenanceEdited\s*!==\s*true\s*&&/g,
      "&& $1.maintenanceEdited === true &&",
    ],
    [
      /&&\s*([A-Za-z0-9_$.?]+)\.maintenanceEdited\s*!==\s*!0\s*&&/g,
      "&& $1.maintenanceEdited === !0 &&",
    ],
    // if (!patch.maintenanceEdited && lastServiceKm > 0)
    [
      /if\s*\(\s*!([A-Za-z0-9_$.?]+)\.maintenanceEdited\s*&&\s*([^)]+?)\)\s*\{([^{}]*Periyodik Bak[ıi]m[^{}]*)\}/g,
      "if ($1.maintenanceEdited === true && $2) {$3}",
    ],
  ];
  s = src;
  for (const [re, to] of reps) {
    const before = s;
    s = s.replace(re, to);
    if (s !== before) n++;
  }

  // allowEmptyMaintenance: maintenanceEdited === true kalmalı (zaten doğru)
  // Yi merge: allowEmptyMaintenance: t.maintenanceEdited === true — dokunma

  if (n && s !== src) {
    writeIfChanged(file, src, s, `bakım-otomatik-kapı(${n})`);
    return true;
  }
  return false;
}

/** 2) || 15000 / || 15e3 yazma varsayılanını kaldır */
function patchIntervalDefault(src, file) {
  if (!/15e3|15000|15_000/.test(src)) return false;
  if (!/serviceInterval/.test(src)) return false;
  let s = src;
  let n = 0;
  const reps = [
    // Number(x.serviceInterval) || 15000  → Number(x.serviceInterval) || 0  (yazmada 15k dayatma)
    [
      /Number\((\s*[A-Za-z0-9_$?[\].]+(?:\?[.?][A-Za-z0-9_$?[\].]+)*)\s*\)\s*\|\|\s*(?:15e3|15000|15_000)/g,
      (m, expr) => {
        if (!/serviceInterval|service_interval/i.test(expr)) return m;
        n++;
        return `Number(${expr}) || 0`;
      },
    ],
    // Number(x?.serviceInterval ?? y ?? 15000) || 15000
    [
      /Number\(([^)]*serviceInterval[^)]*?)(?:15e3|15000|15_000)\)\s*\|\|\s*(?:15e3|15000|15_000)/g,
      (m, mid) => {
        n++;
        return `Number(${mid}0) || 0`;
      },
    ],
    // value={String(v.serviceInterval || 15000)} → display için mevcut aralık; 0 ise boş gösterme için || "" 
    // select value: keep a display fallback but don't write 15k — use nullish for display only
    [
      /value:\s*String\(([A-Za-z0-9_$.?]+)\.serviceInterval\s*\|\|\s*(?:15e3|15000|15_000)\)/g,
      (m, v) => {
        n++;
        return `value: String(${v}.serviceInterval || "")`;
      },
    ],
    [
      /value=\{String\(([A-Za-z0-9_$.?]+)\.serviceInterval\s*\|\|\s*(?:15e3|15000|15_000)\)\}/g,
      (m, v) => {
        n++;
        return `value={String(${v}.serviceInterval || "")}`;
      },
    ],
    // onChange: Number(e.target.value) || 15000 → Number(e.target.value) || 0
    [
      /(serviceInterval[^;\n]{0,80}Number\([^)]+\)\s*\|\|\s*)(?:15e3|15000|15_000)/g,
      (m, pre) => {
        n++;
        return `${pre}0`;
      },
    ],
  ];
  for (const [re, to] of reps) {
    s = s.replace(re, to);
  }
  // Generic: serviceInterval ?? 15000 / || 15000 in assignment contexts
  let s2 = s.replace(
    /(\b(?:serviceInterval|service_interval)\b[^;\n=]{0,40}(?:=\s*|:\s*|,\s*)(?:Number\([^)]+\)|[A-Za-z0-9_$?[\].]+)\s*\?\?\s*)(?:15e3|15000|15_000)/g,
    (m, pre) => {
      n++;
      return `${pre}0`;
    }
  );
  s = s2;
  // let i = Number(n.serviceInterval) || 15e3
  s = s.replace(
    /(Number\(\s*n\.serviceInterval\s*\)\s*\|\|\s*)(?:15e3|15000|15_000)/g,
    (m, pre) => {
      n++;
      return `${pre}0`;
    }
  );
  s = s.replace(
    /(Number\(\s*t\?\.serviceInterval\s*\?\?\s*t\?\.service_interval\s*\?\?\s*)(?:15e3|15000|15_000)(\s*\)\s*\|\|\s*)(?:15e3|15000|15_000)/g,
    (m, a, b) => {
      n++;
      return `${a}0${b}0`;
    }
  );

  if (n && s !== src) {
    writeIfChanged(file, src, s, `aralık-15000-kaldır(${n})`);
    return true;
  }
  // softer: file has both serviceInterval and 15000 — try line-based
  if (!n) {
    const lines = src.split(/\n/);
    let changed = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!/serviceInterval|service_interval/.test(line)) continue;
      if (!/\|\|\s*(?:15e3|15000|15_000)|\?\?\s*(?:15e3|15000|15_000)/.test(line)) continue;
      // Don't strip from option lists like [10000, 15000, 20000]
      if (/\[\s*[\d,\s_e]+\]/.test(line) && !/Number\(/.test(line)) continue;
      const nl = line
        .replace(/\|\|\s*(?:15e3|15000|15_000)/g, "|| 0")
        .replace(/\?\?\s*(?:15e3|15000|15_000)/g, "?? 0");
      if (nl !== line) {
        lines[i] = nl;
        changed = true;
        n++;
      }
    }
    if (changed) {
      writeIfChanged(file, src, lines.join("\n"), `aralık-15000-satır(${n})`);
      return true;
    }
  }
  return false;
}

/** 3) Parmak izine maintenance ekle */
function patchFingerprint(src, file) {
  if (!/last_service_km|lastServiceKm/.test(src)) return false;
  if (!/service_interval|serviceInterval/.test(src)) return false;
  // look for fingerprint builder that joins car fields but omits maintenance
  if (!/history/.test(src) && !/\.join\(/.test(src)) return false;

  let s = src;
  let hit = false;

  // Pattern: array join including serviceInterval then .join(`:`) — insert maintenance fingerprint before join
  // Unminified likely:
  // e?.service_interval ?? e?.serviceInterval ?? ""
  // ].join(":")
  const marker =
    /((?:e|car|row)\?(?:\.|\[)(?:service_interval|serviceInterval)[^,\]]*)(,\s*)?(\]\s*\.join\(\s*[`'"]:)/;
  if (marker.test(s) && !/maintenanceFingerprint|history\.maintenance|maintSig/.test(s)) {
    s = s.replace(marker, (m, a, comma, join) => {
      hit = true;
      return `${a}, maintSig(e?.finance?.history?.maintenance) ${join}`;
    });
  }

  // Alternative: push fields into array then join — add after serviceInterval line
  if (!hit) {
    const reLine =
      /^([ \t]*)(.*(?:service_interval|serviceInterval).*)$/m;
    // Find block with both lastServiceKm and serviceInterval in nearby lines ending with .join
    const idx = s.search(
      /last_service_km|lastServiceKm[\s\S]{0,400}service_interval|serviceInterval[\s\S]{0,200}\.join\(/
    );
    if (idx >= 0 && !/maintSig|maintenanceFingerprint/.test(s)) {
      // Insert helper + field near the join array end before serviceInterval entry's closing
      const injectHelper = `
function maintSig(list) {
  if (!Array.isArray(list) || !list.length) return "";
  return list
    .map((r) => [r?.km ?? "", r?.date ?? "", r?.note ?? r?.details ?? "", r?.cost ?? ""].join("~"))
    .join(";");
}
`;
      if (!s.includes("function maintSig")) {
        // prepend helper after imports-ish: first function or first export
        const insertAt = s.search(/\n(export |function |const |let )/);
        if (insertAt > 0) {
          s = s.slice(0, insertAt) + "\n" + injectHelper + s.slice(insertAt);
          hit = true;
        }
      }
      // Add maintSig call into the fingerprint array — after serviceInterval field
      s = s.replace(
        /((?:e|car|row)\?(?:\.service_interval|\.serviceInterval|\[[^\]]*(?:service_interval|serviceInterval)[^\]]*\])[^,\n]*),?(\s*)(\]\.join\()/m,
        (m, field, ws, join) => {
          hit = true;
          return `${field}, maintSig((e||car||row)?.finance?.history?.maintenance),${ws}${join}`;
        }
      );
      // minified-like without optional: e?.service_interval ?? e?.serviceInterval ?? ``
      s = s.replace(
        /(e\?\.service_interval\s*\?\?\s*e\?\.serviceInterval\s*\?\?\s*[`'"]{2})(\s*)(\]\.join\()/m,
        (m, field, ws, join) => {
          hit = true;
          return `${field}, maintSig(e?.finance?.history?.maintenance)${ws}${join}`;
        }
      );
      s = s.replace(
        /(e\?\.last_service_km\s*\?\?\s*e\?\.lastServiceKm\s*\?\?\s*[`'"]{2},\s*e\?\.service_interval\s*\?\?\s*e\?\.serviceInterval\s*\?\?\s*[`'"]{2})/m,
        (m, fields) => {
          hit = true;
          return `${fields}, maintSig(e?.finance?.history?.maintenance)`;
        }
      );
    }
  }

  if (hit && s !== src) {
    writeIfChanged(file, src, s, "parmak-izi-maintenance");
    return true;
  }
  return false;
}

/** 4) İade notu: yalnız personel notu (admin_note serbest metin) */
function patchReturnNotes(src, file) {
  if (!/return_note|returnNote/.test(src)) return false;
  if (!/extra_reason|extraReason/.test(src)) return false;

  let s = src;
  let n = 0;

  // Replace helper that falls back to extra_reason
  const badFns = [
    // function E(e={}){ let t = return_note; let n = extra_reason; if(t)return t; ...}
    /function\s+([A-Za-z0-9_]+)\s*\(\s*e\s*=\s*\{\s*\}\s*\)\s*\{\s*let\s+t\s*=\s*String\(\s*e\.return_note[^;]+;\s*let\s+n\s*=\s*String\(\s*e\.extra_reason[^;]+;\s*if\s*\(\s*t\s*\)\s*return\s*t\s*;\s*if\s*\(\s*!n\s*\)\s*return\s*[`'"]{2}\s*;\s*let\s+r\s*=\s*n\.split\([^)]+\)[^;]+;\s*return\s*r\[r\.length\s*-\s*1\]\s*\|\|\s*n\s*;\s*\}/,
  ];

  const replacement = `function $1(e = {}) {
  // Yalnız personel notu (admin_note içindeki serbest metin; zaman çizelgesi satırları hariç)
  const raw = String(e.admin_note || e.adminNote || "").trim();
  if (!raw) return "";
  const timeline = /^(\\d{1,2}\\.\\d{1,2}\\.\\d{4}\\s+\\d{2}[.:]\\d{2})\\s·\\s/;
  return raw
    .split("\\n")
    .filter((line) => line.trim() && !timeline.test(line.trim()))
    .join("\\n")
    .trim();
}`;

  for (const re of badFns) {
    if (re.test(s)) {
      s = s.replace(re, replacement);
      n++;
    }
  }

  // Broader: any return that uses extra_reason as note display fallback in iade/return components
  if (!n && /Saha (personeli )?notu|Saha notu|return_note/.test(s)) {
    // Replace blocks: const note = return_note || last(extra_reason)
    const before = s;
    s = s.replace(
      /String\(\s*e\.return_note\s*\|\|\s*e\.returnNote\s*\|\|\s*[`'"]{2}\s*\)\.trim\(\)\s*;\s*let\s+([A-Za-z0-9_]+)\s*=\s*String\(\s*e\.extra_reason\s*\|\|\s*e\.extraReason\s*\|\|\s*[`'"]{2}\s*\)\.trim\(\)\s*;\s*if\s*\(\s*t\s*\)\s*return\s*t\s*;\s*if\s*\(\s*!\1\s*\)\s*return\s*[`'"]{2}\s*;[\s\S]{0,180}?return\s+\1\[[^\]]+\]\s*\|\|\s*\1\s*;/m,
      `String(e.admin_note || e.adminNote || "").trim().split("\\n").filter((line) => {
    const t = line.trim();
    return t && !/^(\\d{1,2}\\.\\d{1,2}\\.\\d{4}\\s+\\d{2}[.:]\\d{2})\\s·\\s/.test(t);
  }).join("\\n").trim();`
    );
    // Simpler assignment form used in source:
    // let note = (booking.return_note || booking.extra_reason.split...
    s = s.replace(
      /(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:String\()?(?:[A-Za-z0-9_$.?]+)\.return_note\s*\|\|\s*(?:[A-Za-z0-9_$.?]+)\.returnNote\s*\|\|\s*(?:[A-Za-z0-9_$.?]+)\.extra_reason[^;\n]+;/g,
      (m, name) => {
        n++;
        return `const ${name} = staffNoteOnly(arguments[0] || {});`.replace(
          "arguments[0] || {}",
          "e"
        );
      }
    );

    // Inject staffNoteOnly helper once near top if we changed something note-related
    if (s !== before && !s.includes("function staffNoteOnly")) {
      const helper = `
function staffNoteOnly(e = {}) {
  const raw = String(e.admin_note || e.adminNote || "").trim();
  if (!raw) return "";
  const timeline = /^(\\d{1,2}\\.\\d{1,2}\\.\\d{4}\\s+\\d{2}[.:]\\d{2})\\s·\\s/;
  return raw
    .split("\\n")
    .filter((line) => {
      const t = line.trim();
      return t && !timeline.test(t);
    })
    .join("\\n")
    .trim();
}
`;
      const insertAt = s.search(/\n(export |function |const |let )/);
      if (insertAt > 0) s = s.slice(0, insertAt) + helper + s.slice(insertAt);
      n++;
    }
  }

  // Most reliable for AracIade source: rewrite the whole helper when signature matches
  if (
    /return_note/.test(src) &&
    /extra_reason/.test(src) &&
    /split\(\s*[`'"]\|[`'"]\s*\)/.test(src)
  ) {
    const before = s;
    s = s.replace(
      /function\s+([A-Za-z_$][\w$]*)\s*\(\s*e\s*=\s*\{\s*\}\s*\)\s*\{[\s\S]*?extra_reason[\s\S]*?split\(\s*[`'"]\|[`'"]\s*\)[\s\S]*?return\s+[^;]+;\s*\}/m,
      `function $1(e = {}) {
  const raw = String(e.admin_note || e.adminNote || "").trim();
  if (!raw) return "";
  const timeline = /^(\\d{1,2}\\.\\d{1,2}\\.\\d{4}\\s+\\d{2}[.:]\\d{2})\\s·\\s/;
  return raw
    .split("\\n")
    .filter((line) => {
      const t = line.trim();
      return t && !timeline.test(t);
    })
    .join("\\n")
    .trim();
}`
    );
    if (s !== before) n++;
  }

  if (n && s !== src) {
    writeIfChanged(file, src, s, `iade-personel-notu(${n})`);
    return true;
  }
  return false;
}

function main() {
  log(`Kök: ${ROOT}`);
  if (!fs.existsSync(ROOT)) {
    console.error("Klasör yok:", ROOT);
    process.exit(1);
  }
  const files = walk(ROOT);
  log(`Taranan dosya: ${files.length}`);

  let changed = 0;
  const hits = {
    bakim: 0,
    aralik: 0,
    fingerprint: 0,
    not: 0,
  };

  for (const file of files) {
    let src;
    try {
      src = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    // skip huge bundles
    if (src.length > 1_500_000) continue;

    if (/Periyodik Bak[ıi]m|maintenanceEdited/.test(src)) {
      if (patchAutoMaintenance(src, file)) {
        hits.bakim++;
        changed++;
        src = fs.readFileSync(file, "utf8");
      }
    }
    if (/serviceInterval|service_interval/.test(src) && /15e3|15000|15_000/.test(src)) {
      if (patchIntervalDefault(src, file)) {
        hits.aralik++;
        changed++;
        src = fs.readFileSync(file, "utf8");
      }
    }
    if (
      /last_service_km|lastServiceKm/.test(src) &&
      /service_interval|serviceInterval/.test(src) &&
      /\.join\(/.test(src)
    ) {
      if (patchFingerprint(src, file)) {
        hits.fingerprint++;
        changed++;
        src = fs.readFileSync(file, "utf8");
      }
    }
    if (/return_note|returnNote/.test(src) && /extra_reason|extraReason/.test(src)) {
      if (patchReturnNotes(src, file)) {
        hits.not++;
        changed++;
      }
    }
  }

  log("---");
  log(`Bakım kapısı: ${hits.bakim} dosya`);
  log(`15000 kaldır: ${hits.aralik} dosya`);
  log(`Parmak izi: ${hits.fingerprint} dosya`);
  log(`İade notu: ${hits.not} dosya`);
  log(`Toplam değişen: ${changed}`);

  if (!changed) {
    log("UYARI: Eşleşme yok. Doğru Vite kökünde misiniz? (package.json + src/ olan klasör)");
    // hint: list dirs with package.json
    const pkgs = files.filter((f) => path.basename(f) === "package.json");
    // walk again for package.json only
    const pkgFiles = [];
    function walkPkg(dir) {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP.has(ent.name)) continue;
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walkPkg(p);
        else if (ent.name === "package.json") pkgFiles.push(p);
      }
    }
    try {
      walkPkg(ROOT);
    } catch {}
    for (const p of pkgFiles.slice(0, 20)) log(`  package.json: ${p}`);
    process.exit(2);
  }

  log("Tamam. Şimdi commit edip yalnız onurcar production deploy edin.");
  fs.writeFileSync(path.join(ROOT, "fix-onurcar-bakim.report.txt"), report.join("\n"), "utf8");
}

main();
