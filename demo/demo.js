// Panel konfigurasi: memanggil FixsCursor.configure() dari library utama.
(() => {
  const C = window.FixsCursor, panel = document.getElementById("panel"), code = document.getElementById("code");
  const inputs = [...panel.querySelectorAll("[data-k]")];
  const stopEls = [...panel.querySelectorAll("[data-stop]")];
  const nStops = panel.querySelector('[data-n="stops"]');
  const bar = document.getElementById("gradbar"), chips = document.getElementById("presets");
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
  const val = (i) => (i.type === "checkbox" ? i.checked : i.type === "range" ? Number(i.value) : i.value);
  const hex = (v, fb) => (/^#[0-9a-f]{6}$/i.test(v) ? v : fb);
  const stops = () => stopEls.slice(0, Number(nStops.value)).map((e) => e.value);

  // Isi panel dari opsi yang sedang aktif (dipakai setelah ganti preset)
  const fill = () => {
    const o = C.options;
    inputs.forEach((i) => {
      const v = o[i.dataset.k];
      if (i.type === "checkbox") i.checked = !!v;
      else if (i.type === "color") i.value = hex(v || o.color, "#3330ff");
      else i.value = v;
    });
    const list = String(o.trailColors).split(/,(?![^(]*\))/).map((s) => s.trim()).filter((s) => /^#[0-9a-f]{6}$/i.test(s)).slice(0, 5);
    if (list.length) { nStops.value = list.length; list.forEach((c, n) => (stopEls[n].value = c)); }
  };

  const render = () => {
    const o = {};
    inputs.forEach((i) => (o[i.dataset.k] = val(i)));
    o.trailColors = stops().join(",");
    if (C) C.configure(o);
    inputs.concat(nStops).forEach((i) => { const out = i.parentElement.querySelector("output"); if (out) out.textContent = i.value; });
    stopEls.forEach((e, n) => e.classList.toggle("off", n >= Number(nStops.value)));
    const s = stops();
    bar.style.background = s.length > 1 ? `linear-gradient(90deg, ${s.join(",")})` : s[0];
    document.getElementById("stops-out").textContent = s.length + " warna";
    // Kode pemasangan: hanya opsi yang berbeda dari bawaan library
    const d = C ? C.defaults : {};
    const attrs = Object.keys(o)
      .filter((k) => o[k] !== d[k] && !(k === "rippleColor" && o[k] === o.color) && (k !== "trailColors" || o.trail))
      .map((k) => `  data-${kebab(k)}="${o[k]}"`).join("\n");
    code.textContent = `<script\n  src="https://fixsarts.github.io/cursor/cursor.js"${attrs ? "\n" + attrs : ""}\n></script>`;
  };

  const mark = (name) => chips.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === name)));
  const usePreset = (name) => { C.configure({ preset: name }); C.clearTrail(); fill(); render(); mark(name); };

  C.presets.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.p = p; b.textContent = p; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => usePreset(p));
    chips.append(b);
  });

  panel.addEventListener("input", () => { render(); mark(""); });
  document.getElementById("reset").addEventListener("click", () => usePreset("default"));
  document.getElementById("copy").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(code.textContent); e.target.textContent = "Tersalin"; } catch (err) { e.target.textContent = "Salin manual dari kotak kode"; }
    setTimeout(() => (e.target.textContent = "Salin script"), 1800);
  });
  document.querySelector('a[href="#demo-form"]').addEventListener("click", (e) => { e.preventDefault(); document.getElementById("demo-form").scrollIntoView({ behavior: "smooth" }); });
  usePreset("rocket"); // tampilan awal demo
})();
